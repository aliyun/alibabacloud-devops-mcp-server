import { describe, it, expect } from 'vitest';
import { listPipelinesFunc, getPipelineFunc } from '../operations/flow/pipeline.js';
import { TEST_ORG_ID } from './setup.js';

describe('Flow - Pipelines', () => {
  it('listPipelines returns results', async () => {
    const result = await listPipelinesFunc(TEST_ORG_ID, { page: 1, perPage: 5 });
    expect(result.items).toBeDefined();
    expect(result.pagination).toBeDefined();
    expect(result.pagination.total).toBeGreaterThanOrEqual(0);
  });

  it('getPipeline returns pipeline details when pipelines exist', async () => {
    const result = await listPipelinesFunc(TEST_ORG_ID, { page: 1, perPage: 1 });
    if (result.items.length === 0) return;

    const pipelineId = String(result.items[0].pipelineId);
    const pipeline = await getPipelineFunc(TEST_ORG_ID, pipelineId);
    expect(pipeline).toBeDefined();
    expect(pipeline.name).toBeDefined();
  });
});
