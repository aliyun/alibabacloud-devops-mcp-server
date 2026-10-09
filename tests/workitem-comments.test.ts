import assert from 'node:assert/strict';
import http from 'node:http';
import { after, before, describe, it } from 'node:test';
import { runWithAuth } from '../common/utils.js';
import { handleProjectManagementTools } from '../tool-handlers/project-management.js';

let server: http.Server;
let baseUrl: string;
const requests: { method?: string; url?: string; body: unknown }[] = [];

before(async () => {
  server = http.createServer((req, res) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      requests.push({ method: req.method, url: req.url, body: JSON.parse(body) });
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ result: { id: 'comment-id' } }));
    });
  });
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  assert.ok(address && typeof address !== 'string');
  baseUrl = `http://127.0.0.1:${address.port}`;
});

after(() => new Promise<void>((resolve, reject) => {
  server.close(error => error ? reject(error) : resolve());
}));

describe('create_work_item_comment formatType', () => {
  for (const edition of ['central', 'region']) {
    for (const formatType of [undefined, 'RICHTEXT', 'MARKDOWN']) {
      it(`${edition}: forwards ${formatType ?? 'omitted format without adding a default'}`, async () => {
        const previousEdition = process.env.YUNXIAO_EDITION;
        process.env.YUNXIAO_EDITION = edition;
        const content = formatType === 'MARKDOWN' ? '**评论**' : '<p>评论</p>';
        try {
          const response = await runWithAuth({ token: 'test-token', apiBaseUrl: baseUrl }, () =>
            handleProjectManagementTools({
              params: {
                name: 'create_work_item_comment',
                arguments: {
                  organizationId: 'org-id',
                  workItemId: 123,
                  content,
                  ...(formatType === undefined ? {} : { formatType }),
                },
              },
            }),
          );
          assert.deepEqual(response, {
            content: [{ type: 'text', text: JSON.stringify({ id: 'comment-id' }, null, 2) }],
          });
          assert.deepEqual(requests.at(-1), {
            method: 'POST',
            url: edition === 'region'
              ? '/oapi/v1/projex/workitems/123/comments'
              : '/oapi/v1/projex/organizations/org-id/workitems/123/comments',
            body: formatType === undefined ? { content } : { content, formatType },
          });
        } finally {
          if (previousEdition === undefined) delete process.env.YUNXIAO_EDITION;
          else process.env.YUNXIAO_EDITION = previousEdition;
        }
      });
    }
  }

  it('rejects invalid formats before sending a request', async () => {
    const count = requests.length;
    for (const formatType of ['HTML', 'markdown', '', null, 1]) {
      await assert.rejects(() => handleProjectManagementTools({
        params: {
          name: 'create_work_item_comment',
          arguments: { organizationId: 'org-id', workItemId: '123', content: '评论', formatType },
        },
      }), /formatType/);
    }
    assert.equal(requests.length, count);
  });
});
