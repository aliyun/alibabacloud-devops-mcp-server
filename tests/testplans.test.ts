import { afterEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  ListTestPlanRequestSchema,
  listTestPlan,
} from '../operations/testhub/testplans.js';

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

describe('ListTestPlanRequestSchema', () => {
  it('accepts pagination and filter parameters', () => {
    const request = ListTestPlanRequestSchema.parse({
      organizationId: 'org-1',
      page: 2,
      perPage: 100,
      sprintIdentifier: 123,
      projectIdentifier: 'project-1',
      status: ['TODO', 'DOING'],
      name: 'smoke',
    });

    assert.equal(request.sprintIdentifier, '123');
    assert.deepEqual(request.status, ['TODO', 'DOING']);

    const commaSeparated = ListTestPlanRequestSchema.parse({
      organizationId: 'org-1',
      status: 'TODO,DOING',
    });
    assert.equal(commaSeparated.status, 'TODO,DOING');
  });

  it('rejects invalid pagination and status values', () => {
    assert.equal(ListTestPlanRequestSchema.safeParse({ organizationId: 'org-1', page: 0 }).success, false);
    assert.equal(ListTestPlanRequestSchema.safeParse({ organizationId: 'org-1', perPage: 1001 }).success, false);
    assert.equal(ListTestPlanRequestSchema.safeParse({ organizationId: 'org-1', status: 'UNKNOWN' }).success, false);
  });
});

describe('listTestPlan', () => {
  it('forwards pagination and filters in the POST body', async () => {
    process.env.YUNXIAO_API_BASE_URL = 'https://pre-openapi-rdc.aliyuncs.com';
    process.env.YUNXIAO_EDITION = 'central';

    let requestedUrl = '';
    let requestedBody = '';
    globalThis.fetch = async (input, init) => {
      requestedUrl = String(input);
      requestedBody = String(init?.body);
      return new Response('[]', {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    };

    await listTestPlan({
      organizationId: 'org-1',
      page: 2,
      perPage: 20,
      projectIdentifier: 'project-1',
      status: ['TODO', 'DOING'],
      name: 'smoke',
    });

    assert.equal(
      requestedUrl,
      'https://pre-openapi-rdc.aliyuncs.com/oapi/v1/projex/organizations/org-1/testPlan/list',
    );
    assert.deepEqual(JSON.parse(requestedBody), {
      page: 2,
      perPage: 20,
      projectIdentifier: 'project-1',
      status: ['TODO', 'DOING'],
      name: 'smoke',
    });
  });
});
