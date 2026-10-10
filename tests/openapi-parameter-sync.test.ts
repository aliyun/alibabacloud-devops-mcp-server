import assert from 'node:assert/strict';
import http from 'node:http';
import { before, after, it } from 'node:test';
import { runWithAuth } from '../common/utils.js';
import { handleCodeManagementTools } from '../tool-handlers/code-management.js';
import { handlePipelineTools } from '../tool-handlers/pipeline.js';

let server: http.Server;
let baseUrl: string;
const requests: { method?: string; url: string; body: any }[] = [];
const createArgs = { organizationId: 'org', repositoryId: 123, title: 'Test', sourceBranch: 'feature', targetBranch: 'master' };

before(async () => {
  server = http.createServer((req, res) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      requests.push({ method: req.method, url: req.url!, body: body ? JSON.parse(body) : undefined });
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(req.method === 'GET' ? [] : { localId: 1 }));
    });
  });
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  assert.ok(address && typeof address !== 'string');
  baseUrl = `http://127.0.0.1:${address.port}`;
});
after(() => new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve())));

for (const edition of ['central', 'region']) {
  it(`${edition}: sends endTime and preserves optional extensionParams through handlers`, async () => {
    const previous = process.env.YUNXIAO_EDITION;
    process.env.YUNXIAO_EDITION = edition;
    try {
      await runWithAuth({ token: 'test-token', apiBaseUrl: baseUrl }, async () => {
        const orgPath = edition === 'central' ? '/organizations/org' : '';
        for (const endTime of [1729178040000, undefined]) {
          await handlePipelineTools({ params: { name: 'list_pipeline_runs', arguments: {
            organizationId: 'org', pipelineId: 123, startTime: 1729000000000, endTime,
          } } });
          const request = requests.at(-1)!;
          const url = new URL(request.url, baseUrl);
          assert.equal(request.method, 'GET');
          assert.equal(url.pathname, `/oapi/v1/flow${orgPath}/pipelines/123/runs`);
          assert.equal(url.searchParams.get('endTime'), endTime === undefined ? null : String(endTime));
          assert.equal(url.searchParams.has('endTme'), false);
          assert.equal(url.searchParams.get('startTime'), '1729000000000');
        }
        for (const extensionParams of [undefined, {}, { 'aiReview.model': '{"modelKey":"glm-5.2"}', custom: 'unchanged' }]) {
          await handleCodeManagementTools({ params: { name: 'create_change_request', arguments: {
            ...createArgs, triggerAIReviewRun: true, extensionParams,
          } } });
          const request = requests.at(-1)!;
          assert.equal(request.method, 'POST');
          assert.equal(request.url, `/oapi/v1/codeup${orgPath}/repositories/123/changeRequests`);
          assert.deepEqual(request.body.extensionParams, extensionParams);
          assert.equal(Object.hasOwn(request.body, 'extensionParams'), extensionParams !== undefined);
          assert.equal(request.body.triggerAIReviewRun, true);
        }
      });
    } finally {
      if (previous === undefined) delete process.env.YUNXIAO_EDITION;
      else process.env.YUNXIAO_EDITION = previous;
    }
  });
}
it('rejects non-string extension values before making requests', async () => {
  const count = requests.length;
  for (const extensionParams of [{ 'aiReview.model': { modelKey: 'glm-5.2' } }, { custom: 123 }, null]) {
    await assert.rejects(() => handleCodeManagementTools({ params: {
      name: 'create_change_request', arguments: { ...createArgs, extensionParams },
    } }), /extensionParams/);
  }
  assert.equal(requests.length, count);
});
