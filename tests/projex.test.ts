import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { searchProjectsFunc } from '../operations/projex/project.js';
import { searchWorkitemsFunc } from '../operations/projex/workitem.js';
import { TEST_ORG_ID } from './setup.js';

describe('Projex - Projects', () => {
  it('searchProjects returns at least one project', async () => {
    const projects = await searchProjectsFunc(TEST_ORG_ID);
    assert.ok(projects.length > 0);
    assert.ok(projects[0].id);
    assert.ok(projects[0].name);
  });
});

describe('Projex - Work Items', () => {
  it('searchWorkitems returns results for a project', async () => {
    const projects = await searchProjectsFunc(TEST_ORG_ID, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, 1, 1);
    const projectId = projects[0].id!;

    const result = await searchWorkitemsFunc(TEST_ORG_ID, 'Req', projectId);
    assert.ok(result.items);
    assert.ok(Array.isArray(result.items));
  });
});
