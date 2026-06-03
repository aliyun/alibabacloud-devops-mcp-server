import { describe, it, expect } from 'vitest';
import { listRepositoriesFunc } from '../operations/codeup/repositories.js';
import { listBranchesFunc, getBranchFunc } from '../operations/codeup/branches.js';
import { TEST_ORG_ID } from './setup.js';

describe('Codeup - Repositories', () => {
  it('listRepositories returns at least one repo', async () => {
    const repos = await listRepositoriesFunc(TEST_ORG_ID, 1, 5);
    expect(repos.length).toBeGreaterThan(0);
    expect(repos[0].id).toBeDefined();
    expect(repos[0].name).toBeDefined();
  });
});

describe('Codeup - Branches', () => {
  it('listBranches returns branches for a repo', async () => {
    const repos = await listRepositoriesFunc(TEST_ORG_ID, 1, 1);
    const repoId = String(repos[0].id);

    const branches = await listBranchesFunc(TEST_ORG_ID, repoId);
    expect(branches.length).toBeGreaterThan(0);
    expect(branches[0].name).toBeDefined();
  });

  it('getBranch returns branch with commit info', async () => {
    const repos = await listRepositoriesFunc(TEST_ORG_ID, 1, 1);
    const repoId = String(repos[0].id);

    const branches = await listBranchesFunc(TEST_ORG_ID, repoId);
    const branchName = branches[0].name!;

    const branch = await getBranchFunc(TEST_ORG_ID, repoId, branchName);
    expect(branch.name).toBe(branchName);
    expect(branch.commit).toBeDefined();
    expect(branch.commit?.id).toBeDefined();
  });
});
