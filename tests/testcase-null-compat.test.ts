import assert from 'node:assert/strict';
import http from 'node:http';
import { before, after, it } from 'node:test';
import { runWithAuth } from '../common/utils.js';
import { handleTestManagementTools } from '../tool-handlers/test-management.js';
import { CreateTestcaseRequestSchema } from '../operations/testhub/testcases.js';

const base = { organizationId: 'org', testRepoId: 'repo' };
const fixtures = ['TABLE', null].map(contentType => ({
  id: contentType ?? 'legacy', subject: '用例',
  testSteps: { contentType, content: [], stepContentFormat: null, expectedResultFormat: null },
  customFieldValues: [{ fieldId: 'field', fieldName: '字段', fieldFormat: 'input', values: null }],
}));
let server: http.Server;
let baseUrl: string;
const requests: { url: string; body: any }[] = [];
before(async () => {
  server = http.createServer((req, res) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      requests.push({ url: req.url!, body: body ? JSON.parse(body) : undefined });
      res.writeHead(200, { 'Content-Type': 'application/json' });
      const result = req.url!.endsWith(':search') ? fixtures
        : req.method === 'GET' ? fixtures.find(f => req.url!.endsWith('/' + f.id))
        : { id: 'created' };
      res.end(JSON.stringify(result));
    });
  });
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  assert.ok(address && typeof address !== 'string');
  baseUrl = `http://127.0.0.1:${address.port}`;
});
after(() => new Promise<void>((resolve, reject) => server.close(err => err ? reject(err) : resolve())));

for (const edition of ['central', 'region']) {
  it(`${edition}: omits null steps from create and preserves nullable detail/search fields`, async () => {
    const previous = process.env.YUNXIAO_EDITION;
    process.env.YUNXIAO_EDITION = edition;
    try {
      await runWithAuth({ token: 'test-token', apiBaseUrl: baseUrl }, async () => {
        const call = async (name: string, args: Record<string, unknown>) => {
          const result = await handleTestManagementTools({ params: { name, arguments: { ...base, ...args } } });
          assert.ok(result);
          return JSON.parse(result.content[0].text);
        };
        for (const testSteps of [null, undefined]) {
          await call('create_testcase', { subject: '用例', testSteps });
          assert.deepEqual(requests.at(-1)!.body, { subject: '用例' });
          assert.equal(requests.at(-1)!.url, `/oapi/v1/testhub${edition === 'central' ? '/organizations/org' : ''}/testRepos/repo/testcases`);
        }
        for (const fixture of fixtures) {
          assert.deepEqual(await call('get_testcase', { testcaseId: fixture.id }), fixture);
        }
        assert.deepEqual(await call('search_testcases', {}), fixtures);
      });
    } finally {
      if (previous === undefined) delete process.env.YUNXIAO_EDITION;
      else process.env.YUNXIAO_EDITION = previous;
    }
  });
}

it('does not loosen explicit create step types or formats', () => {
  for (const testSteps of [
    { contentType: null }, {}, { contentType: 'OTHER' },
    { contentType: 'TEXT', stepContentFormat: null },
    { contentType: 'TEXT', expectedResultFormat: null },
    { contentType: 'TEXT', stepContentFormat: 'MARKDOWN' },
  ]) {
    assert.equal(CreateTestcaseRequestSchema.safeParse({ ...base, testSteps }).success, false);
  }
});
