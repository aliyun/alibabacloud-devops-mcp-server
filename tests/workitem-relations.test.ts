import { afterEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  createWorkitemRelationRecordFunc,
  deleteWorkitemRelationRecordFunc,
  listWorkitemRelationRecordsFunc,
} from '../operations/projex/workitem.js';

const originalFetch = globalThis.fetch;
const originalApiBaseUrl = process.env.YUNXIAO_API_BASE_URL;
const originalEdition = process.env.YUNXIAO_EDITION;

afterEach(() => {
  globalThis.fetch = originalFetch;
  if (originalApiBaseUrl === undefined) {
    delete process.env.YUNXIAO_API_BASE_URL;
  } else {
    process.env.YUNXIAO_API_BASE_URL = originalApiBaseUrl;
  }
  if (originalEdition === undefined) {
    delete process.env.YUNXIAO_EDITION;
  } else {
    process.env.YUNXIAO_EDITION = originalEdition;
  }
});

describe('work item relation record operations', () => {
  it('uses the documented central-station paths and request body', async () => {
    process.env.YUNXIAO_API_BASE_URL = 'https://pre-openapi-rdc.aliyuncs.com';
    process.env.YUNXIAO_EDITION = 'central';

    const requests: Array<{ url: string; method: string; body?: string }> = [];
    globalThis.fetch = async (input, init) => {
      const request: { url: string; method: string; body?: string } = {
        url: String(input),
        method: String(init?.method),
      };
      if (init?.body != null) {
        request.body = String(init.body);
      }
      requests.push(request);

      const responseBody = init?.method === 'GET'
        ? { result: [{ id: 'relation-1' }] }
        : { result: true };
      return new Response(JSON.stringify(responseBody), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    };

    const listed = await listWorkitemRelationRecordsFunc('org-1', 'source-1', 'ASSOCIATED');
    const created = await createWorkitemRelationRecordFunc('org-1', 'source-1', 'target-1', 'ASSOCIATED');
    const deleted = await deleteWorkitemRelationRecordFunc('org-1', 'source-1', 'target-1', 'ASSOCIATED');

    assert.deepEqual(listed, [{ id: 'relation-1' }]);
    assert.equal(created, true);
    assert.equal(deleted, true);
    assert.deepEqual(requests, [
      {
        url: 'https://pre-openapi-rdc.aliyuncs.com/oapi/v1/projex/organizations/org-1/workitems/source-1/relationRecords?relationType=ASSOCIATED',
        method: 'GET',
      },
      {
        url: 'https://pre-openapi-rdc.aliyuncs.com/oapi/v1/projex/organizations/org-1/workitems/source-1/relationRecords',
        method: 'POST',
        body: JSON.stringify({ relationType: 'ASSOCIATED', workitemId: 'target-1' }),
      },
      {
        url: 'https://pre-openapi-rdc.aliyuncs.com/oapi/v1/projex/organizations/org-1/workitems/source-1/relationRecords',
        method: 'DELETE',
        body: JSON.stringify({ relationType: 'ASSOCIATED', workitemId: 'target-1' }),
      },
    ]);
  });

  it('uses organization-free paths for a region station', async () => {
    process.env.YUNXIAO_API_BASE_URL = 'https://region.example.com';
    process.env.YUNXIAO_EDITION = 'region';

    let requestedUrl = '';
    globalThis.fetch = async (input) => {
      requestedUrl = String(input);
      return new Response('[]', {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    };

    await listWorkitemRelationRecordsFunc('ignored-org', 'source-1', 'ASSOCIATED');

    assert.equal(
      requestedUrl,
      'https://region.example.com/oapi/v1/projex/workitems/source-1/relationRecords?relationType=ASSOCIATED',
    );
  });
});
