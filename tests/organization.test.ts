import { describe, it, expect } from 'vitest';
import { getCurrentUserFunc } from '../operations/organization/organization.js';
import { getOrganizationMembersFunc } from '../operations/organization/members.js';
import { TEST_ORG_ID } from './setup.js';

describe('Organization - Current User', () => {
  it('getCurrentUser returns user info', async () => {
    const user = await getCurrentUserFunc();
    expect(user).toBeDefined();
    expect(user.id).toBeDefined();
    expect(user.name).toBeDefined();
  });
});

describe('Organization - Members', () => {
  it('getOrganizationMembers returns members list', async () => {
    const result = await getOrganizationMembersFunc(TEST_ORG_ID);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });
});
