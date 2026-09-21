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
  it('uses the Swagger-defined central paths, bodies, and response DTOs', async () => {
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

      if (init?.method === 'GET') {
        return new Response(JSON.stringify([{
          gmtCreate: 1789459200000,
          id: 'relation-1',
          relationType: 'ASSOCIATED',
          resourceId: 'target-1',
          resourceType: 'WORKITEM',
        }]), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
      if (init?.method === 'POST') {
        return new Response(JSON.stringify({ id: 'relation-1' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      return new Response(null, { status: 204 });
    };

    const listed = await listWorkitemRelationRecordsFunc('org-1', 'source-1', 'ASSOCIATED');
    const created = await createWorkitemRelationRecordFunc(
      'org-1', 'source-1', 'target-1', 'ASSOCIATED', 'operator-1',
    );
    await deleteWorkitemRelationRecordFunc(
      'org-1', 'source-1', 'target-1', 'ASSOCIATED', 'operator-1',
    );

    assert.equal(listed[0].resourceId, 'target-1');
    assert.equal(listed[0].gmtCreate, 1789459200000);
    assert.deepEqual(created, { id: 'relation-1' });
    assert.deepEqual(requests, [
      {
        url: 'https://pre-openapi-rdc.aliyuncs.com/oapi/v1/projex/organizations/org-1/workitems/source-1/relationRecords?relationType=ASSOCIATED',
        method: 'GET',
      },
      {
        url: 'https://pre-openapi-rdc.aliyuncs.com/oapi/v1/projex/organizations/org-1/workitems/source-1/relationRecords',
        method: 'POST',
        body: JSON.stringify({ relationType: 'ASSOCIATED', workitemId: 'target-1', operatorId: 'operator-1' }),
      },
      {
        url: 'https://pre-openapi-rdc.aliyuncs.com/oapi/v1/projex/organizations/org-1/workitems/source-1/relationRecords',
        method: 'DELETE',
        body: JSON.stringify({ relationType: 'ASSOCIATED', workitemId: 'target-1', operatorId: 'operator-1' }),
      },
    ]);
  });

  it('uses organization-free paths for a Region station', async () => {
    process.env.YUNXIAO_API_BASE_URL = 'https://region.example.com';
    process.env.YUNXIAO_EDITION = 'region';

    let requestedUrl = '';
    globalThis.fetch = async input => {
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
