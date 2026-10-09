import assert from 'node:assert/strict';
import http from 'node:http';
import { once } from 'node:events';
import { spawn } from 'node:child_process';
import { after, before, it } from 'node:test';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { clientIp } from '../common/clientIp.js';
import { runWithAuth, yunxiaoRequest, verifyToken } from '../common/utils.js';
import { createWorkitemAttachmentFunc } from '../operations/projex/attachment.js';

const allowed = '203.0.113.7';
const denied = '198.51.100.9';
const requests: { ip?: string; real?: string; token?: string; host?: string; path?: string }[] = [];
let gateway: http.Server;
let apiBaseUrl: string;
let previousEdition: string | undefined;
async function listen(server: http.Server) {
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const addr = server.address();
  assert.ok(addr && typeof addr !== 'string');
  return addr.port;
}
async function close(server: http.Server) {
  server.closeAllConnections();
  await new Promise<void>(resolve => server.close(() => resolve()));
}
before(async () => {
  previousEdition = process.env.YUNXIAO_EDITION;
  process.env.YUNXIAO_EDITION = 'region';
  gateway = http.createServer((req, res) => {
    const ip = req.headers['x-forwarded-for'] as string | undefined;
    requests.push({ ip, real: req.headers['x-real-ip'] as string, token: req.headers['x-yunxiao-token'] as string, host: req.headers.host, path: req.url });
    req.resume();
    req.on('end', () => setTimeout(() => {
      const permitted = ip === allowed;
      res.writeHead(permitted ? 200 : 403, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(permitted ? { id: 'user', name: 'Test' } : {
        code: 'Forbidden.InvalidIP.AllowListForbidden', message: 'Current ip is not in the allow list and has no right to operate.',
      }));
    }, ip === allowed ? 15 : 1));
  });
  apiBaseUrl = `http://127.0.0.1:${await listen(gateway)}`;
});
after(async () => {
  await close(gateway);
  if (previousEdition === undefined) delete process.env.YUNXIAO_EDITION;
  else process.env.YUNXIAO_EDITION = previousEdition;
});

it('uses ingress X-Real-IP and normalizes IPv4/IPv6 addresses', () => {
  const request = (ip: string) => ({ headers: { 'x-real-ip': ip }, socket: { remoteAddress: '127.0.0.1' } });
  assert.equal(clientIp(request(' 203.0.113.7 ')), allowed);
  assert.equal(clientIp(request('::ffff:203.0.113.7')), allowed);
  assert.equal(clientIp(request('2001:db8::1')), '2001:db8::1');
});

it('ignores XFF and falls back to socket for missing or invalid ingress IP', () => {
  for (const realIp of [undefined, '', 'not-an-ip', `${allowed}, ${denied}`, [allowed, denied]]) {
    assert.equal(clientIp({
      headers: { 'x-real-ip': realIp, 'x-forwarded-for': allowed },
      socket: { remoteAddress: '::ffff:127.0.0.1' },
    }), '127.0.0.1');
  }
  assert.equal(clientIp({ headers: { 'x-forwarded-for': allowed } }), undefined);
  assert.equal(clientIp({ headers: { 'x-real-ip': denied, 'x-forwarded-for': allowed } }), denied);
});

it('isolates concurrent requests and includes IP in the auth probe and cache key', async () => {
  const auth = { token: 'cache-test', apiBaseUrl, forwardHost: 'tenant.example' };
  assert.equal(await verifyToken(auth.token, apiBaseUrl, auth.forwardHost, allowed), true);
  const count = requests.length;
  assert.equal(await verifyToken(auth.token, apiBaseUrl, auth.forwardHost, allowed), true);
  assert.equal(requests.length, count);
  assert.equal(await verifyToken(auth.token, apiBaseUrl, auth.forwardHost, denied), 'unknown');
  assert.equal(requests.at(-1)?.ip, denied);
  const results = await Promise.allSettled([allowed, denied, allowed, denied].map(ip =>
    runWithAuth({ ...auth, clientIp: ip }, () => yunxiaoRequest('/oapi/v1/platform/user'))));
  assert.deepEqual(results.map(r => r.status), ['fulfilled', 'rejected', 'fulfilled', 'rejected']);
  assert.ok(requests.slice(-4).every(r => r.ip === r.real && r.host === auth.forwardHost));
});

it('forwards IP for both multipart paths and omits IP for stdio and central requests', async () => {
  for (const forwardHost of ['tenant.example', undefined]) {
    await runWithAuth({ token: 'attachment-test', apiBaseUrl, forwardHost, clientIp: allowed }, () =>
      createWorkitemAttachmentFunc('org', 'workitem', { fileContent: 'aGVsbG8=', fileName: 'test.txt' }));
    assert.equal(requests.at(-1)?.ip, allowed);
    assert.equal(requests.at(-1)?.real, allowed);
  }
  await assert.rejects(runWithAuth({ apiBaseUrl }, () => yunxiaoRequest('/stdio')));
  assert.equal(requests.at(-1)?.ip, undefined);
  process.env.YUNXIAO_EDITION = 'central';
  try {
    await assert.rejects(runWithAuth({ apiBaseUrl, clientIp: allowed }, () => yunxiaoRequest('/central')));
    assert.equal(requests.at(-1)?.ip, undefined);
  } finally { process.env.YUNXIAO_EDITION = 'region'; }
});

for (const mode of ['stateless', 'stateful', 'sse']) {
  it(`${mode}: propagates ingress IP through auth and tools and refreshes it on each request`, { timeout: 20000 }, async () => {
    const reservation = http.createServer();
    const port = await listen(reservation);
    await close(reservation);
    const args = ['dist/index.js', mode === 'sse' ? '--sse' : '--streamable-http'];
    if (mode === 'stateless') args.push('--stateless');
    const child = spawn(process.execPath, args, {
      env: { ...process.env, PORT: String(port), MCP_CLUSTER: 'false', MCP_AUTH_CHECK: 'true', YUNXIAO_ACCESS_TOKEN: 'transport-test', YUNXIAO_API_BASE_URL: apiBaseUrl, YUNXIAO_EDITION: 'region' },
      stdio: ['ignore', 'ignore', 'pipe'],
    });
    let logs = '';
    child.stderr?.on('data', chunk => { logs += chunk.toString(); });
    const client = new Client({ name: 'ip-regression', version: '1' });
    try {
      let ready = false;
      for (let i = 0; i < 100; i++) {
        if (child.exitCode !== null) throw new Error(logs);
        try { if ((await fetch(`http://127.0.0.1:${port}/healthz`)).ok) { ready = true; break; } } catch {}
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      assert.ok(ready, logs);
      let ip = allowed;
      const customFetch: typeof fetch = (url, init) => {
        const headers = new Headers(init?.headers);
        headers.set('X-Real-IP', ip);
        headers.set('X-Forwarded-For', allowed); // must not override ingress X-Real-IP
        headers.set('X-Forwarded-Host', 'tenant.example');
        return fetch(url, { ...init, headers });
      };
      const endpoint = new URL(`http://127.0.0.1:${port}/${mode === 'sse' ? 'sse' : 'mcp'}`);
      const transport = mode === 'sse'
        ? new SSEClientTransport(endpoint, { fetch: customFetch, eventSourceInit: { fetch: customFetch } })
        : new StreamableHTTPClientTransport(endpoint, { fetch: customFetch });
      const before = requests.length;
      await client.connect(transport);
      const good = await client.callTool({ name: 'get_current_user', arguments: {} });
      assert.ok(!good.isError, JSON.stringify(good));
      assert.ok(requests.slice(before).every(r => r.ip === allowed && r.real === allowed));
      ip = denied; // ingress reports denied source despite an allowlisted XFF value
      await assert.rejects(client.callTool({ name: 'get_current_user', arguments: {} }), /403.*allow list/);
      assert.equal(requests.at(-1)?.ip, denied);
      ip = allowed;
      assert.ok(!(await client.callTool({ name: 'get_current_user', arguments: {} })).isError);
    } finally {
      await client.close();
      const exit = once(child, 'exit');
      child.kill('SIGTERM');
      await exit;
    }
  });
}
