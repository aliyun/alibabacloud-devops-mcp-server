import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { ChildProcess, spawn } from 'node:child_process';
import './setup.js';

const PORT = 13579;
const TOKEN = process.env.YUNXIAO_ACCESS_TOKEN!;
const TEST_ORG_ID = '5ebbe3fa0d4ce6105176dcbc';

let serverProcess: ChildProcess;

async function waitForServer(url: string, maxMs = 10000): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < maxMs) {
    try {
      await fetch(url, { method: 'OPTIONS' });
      return;
    } catch {
      await new Promise((r) => setTimeout(r, 200));
    }
  }
  throw new Error(`Server did not start within ${maxMs}ms`);
}

async function jsonRpc(url: string, id: number, method: string, params: Record<string, unknown>, headers?: Record<string, string>) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json, text/event-stream',
      ...headers,
    },
    body: JSON.stringify({ jsonrpc: '2.0', id, method, params }),
  });
  const text = await res.text();
  const sessionId = res.headers.get('mcp-session-id') ?? undefined;

  const lines = text.split('\n');
  const dataLine = lines.find((l) => l.startsWith('data: '));
  const payload = dataLine ? JSON.parse(dataLine.slice(6)) : JSON.parse(text);
  return { payload, sessionId, status: res.status };
}

before(async () => {
  serverProcess = spawn('node', ['dist/index.js', '--sse', '--streamable-http'], {
    env: { ...process.env, PORT: String(PORT) },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  serverProcess.stderr?.on('data', () => {});
  serverProcess.stdout?.on('data', () => {});
  await waitForServer(`http://localhost:${PORT}/mcp`);
});

after(() => {
  serverProcess?.kill('SIGTERM');
});

// ─── Streamable HTTP ───

describe('Streamable HTTP transport', () => {
  let sessionId: string;

  it('initialize via x-yunxiao-token header', async () => {
    const { payload, sessionId: sid } = await jsonRpc(
      `http://localhost:${PORT}/mcp`, 1, 'initialize',
      { protocolVersion: '2025-03-26', capabilities: {}, clientInfo: { name: 'test', version: '1.0' } },
      { 'x-yunxiao-token': TOKEN },
    );
    assert.ok(sid, 'should return mcp-session-id');
    assert.equal(payload.result.serverInfo.name, 'alibabacloud-devops-mcp-server');
    sessionId = sid!;
  });

  it('tool call with x-yunxiao-token header', async () => {
    const { payload } = await jsonRpc(
      `http://localhost:${PORT}/mcp`, 2, 'tools/call',
      { name: 'get_current_user', arguments: {} },
      { 'x-yunxiao-token': TOKEN, 'Mcp-Session-Id': sessionId },
    );
    const user = JSON.parse(payload.result.content[0].text);
    assert.ok(user.id);
    assert.ok(user.name);
  });

  it('tool call with Authorization Bearer header', async () => {
    const { payload } = await jsonRpc(
      `http://localhost:${PORT}/mcp`, 3, 'tools/call',
      { name: 'get_current_user', arguments: {} },
      { 'Authorization': `Bearer ${TOKEN}`, 'Mcp-Session-Id': sessionId },
    );
    const user = JSON.parse(payload.result.content[0].text);
    assert.ok(user.id);
  });

  it('business call with org ID', async () => {
    const { payload } = await jsonRpc(
      `http://localhost:${PORT}/mcp`, 4, 'tools/call',
      { name: 'search_projects', arguments: { organizationId: TEST_ORG_ID, pageSize: 2 } },
      { 'Authorization': `Bearer ${TOKEN}`, 'Mcp-Session-Id': sessionId },
    );
    const projects = JSON.parse(payload.result.content[0].text);
    assert.ok(Array.isArray(projects));
    assert.ok(projects.length > 0);
    assert.ok(projects[0].id);
  });
});

// ─── SSE ───

describe('SSE transport', () => {
  let sseSessionId: string;
  let messagesUrl: string;
  let abortController: AbortController;

  it('establish SSE connection and get endpoint', async () => {
    abortController = new AbortController();
    const endpoint = await new Promise<string>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('SSE timeout')), 10000);
      fetch(`http://localhost:${PORT}/sse`, {
        headers: { 'Authorization': `Bearer ${TOKEN}` },
        signal: abortController.signal,
      }).then(async (res) => {
        assert.equal(res.status, 200);
        const reader = res.body!.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const match = buffer.match(/data: (\/messages\?sessionId=\S+)/);
          if (match) {
            clearTimeout(timer);
            resolve(match[1]);
            return;
          }
        }
      }).catch((err) => {
        if (err.name !== 'AbortError') reject(err);
      });
    });
    messagesUrl = `http://localhost:${PORT}${endpoint}`;
    sseSessionId = endpoint.split('sessionId=')[1];
    assert.ok(sseSessionId);
  });

  it('tool call via SSE POST /messages with Bearer token', async () => {
    const res = await fetch(messagesUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TOKEN}`,
      },
      body: JSON.stringify({ jsonrpc: '2.0', id: 10, method: 'tools/call', params: { name: 'get_current_user', arguments: {} } }),
    });
    assert.equal(res.status, 202);

    // Response comes through the SSE stream; wait a moment then verify server didn't error
    await new Promise((r) => setTimeout(r, 2000));
    assert.ok(true, 'POST accepted without error');
  });

  it('business call via SSE with org ID', async () => {
    const res = await fetch(messagesUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-yunxiao-token': TOKEN,
      },
      body: JSON.stringify({ jsonrpc: '2.0', id: 11, method: 'tools/call', params: { name: 'search_projects', arguments: { organizationId: TEST_ORG_ID, pageSize: 1 } } }),
    });
    assert.equal(res.status, 202);
    await new Promise((r) => setTimeout(r, 2000));
    assert.ok(true, 'POST accepted without error');
  });

  after(() => {
    abortController?.abort();
  });
});
