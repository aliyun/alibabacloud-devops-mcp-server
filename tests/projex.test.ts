import { describe, it, expect } from 'vitest';
import { searchProjectsFunc } from '../operations/projex/project.js';
import { searchWorkitemsFunc } from '../operations/projex/workitem.js';
import { TEST_ORG_ID } from './setup.js';

describe('Projex - Projects', () => {
  it('searchProjects returns at least one project', async () => {
    const projects = await searchProjectsFunc(TEST_ORG_ID);
    expect(projects.length).toBeGreaterThan(0);
    expect(projects[0].id).toBeDefined();
    expect(projects[0].name).toBeDefined();
  });
});

describe('Projex - Work Items', () => {
  it('searchWorkitems returns results for a project', async () => {
    const projects = await searchProjectsFunc(TEST_ORG_ID, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, 1, 1);
    const projectId = projects[0].id!;

    const result = await searchWorkitemsFunc(TEST_ORG_ID, 'Req', projectId);
    expect(result.items).toBeDefined();
    expect(Array.isArray(result.items)).toBe(true);
  });
});
