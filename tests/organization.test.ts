import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { getCurrentUserFunc } from '../operations/organization/organization.js';
import { getOrganizationMembersFunc } from '../operations/organization/members.js';
import { TEST_ORG_ID } from './setup.js';

describe('Organization - Current User', () => {
  it('getCurrentUser returns user info', async () => {
    const user = await getCurrentUserFunc();
    assert.ok(user);
    assert.ok(user.id);
    assert.ok(user.name);
  });
});

describe('Organization - Members', () => {
  it('getOrganizationMembers returns members list', async () => {
    const result = await getOrganizationMembersFunc(TEST_ORG_ID);
    assert.ok(Array.isArray(result));
    assert.ok(result.length > 0);
  });
});
