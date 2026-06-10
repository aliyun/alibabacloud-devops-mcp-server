import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { listRepositoriesFunc } from '../operations/codeup/repositories.js';
import { listBranchesFunc, getBranchFunc } from '../operations/codeup/branches.js';
import { TEST_ORG_ID } from './setup.js';

describe('Codeup - Repositories', () => {
  it('listRepositories returns at least one repo', async () => {
    const repos = await listRepositoriesFunc(TEST_ORG_ID, 1, 5);
    assert.ok(repos.length > 0);
    assert.ok(repos[0].id);
    assert.ok(repos[0].name);
  });
});

describe('Codeup - Branches', () => {
  it('listBranches returns branches for a repo', async () => {
    const repos = await listRepositoriesFunc(TEST_ORG_ID, 1, 1);
    const repoId = String(repos[0].id);

    const branches = await listBranchesFunc(TEST_ORG_ID, repoId);
    assert.ok(branches.length > 0);
    assert.ok(branches[0].name);
  });

  it('getBranch returns branch with commit info', async () => {
    const repos = await listRepositoriesFunc(TEST_ORG_ID, 1, 1);
    const repoId = String(repos[0].id);

    const branches = await listBranchesFunc(TEST_ORG_ID, repoId);
    const branchName = branches[0].name!;

    const branch = await getBranchFunc(TEST_ORG_ID, repoId, branchName);
    assert.equal(branch.name, branchName);
    assert.ok(branch.commit);
    assert.ok(branch.commit?.id);
  });
});
