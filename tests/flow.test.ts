import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { listPipelinesFunc, getPipelineFunc } from '../operations/flow/pipeline.js';
import { TEST_ORG_ID } from './setup.js';

describe('Flow - Pipelines', () => {
  it('listPipelines returns results', async () => {
    const result = await listPipelinesFunc(TEST_ORG_ID, { page: 1, perPage: 5 });
    assert.ok(result.items);
    assert.ok(result.pagination);
    assert.ok(result.pagination.total >= 0);
  });

  it('getPipeline returns pipeline details when pipelines exist', async () => {
    const result = await listPipelinesFunc(TEST_ORG_ID, { page: 1, perPage: 1 });
    if (result.items.length === 0) return;

    const pipelineId = String(result.items[0].pipelineId);
    const pipeline = await getPipelineFunc(TEST_ORG_ID, pipelineId);
    assert.ok(pipeline);
    assert.ok(pipeline.name);
  });
});
