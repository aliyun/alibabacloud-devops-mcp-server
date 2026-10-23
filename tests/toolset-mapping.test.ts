import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';
import { DefaultToolsetManager } from '../common/toolsetManager.js';
import { Toolset } from '../common/toolsets.js';
import { handleToolRequestByToolset } from '../tool-handlers/index.js';

describe('toolset registry coverage', () => {
  const manager = new DefaultToolsetManager();

  it('exposes Flow tag tools through pipeline-management', () => {
    const names = manager.getToolsByToolset(Toolset.PIPELINE_MANAGEMENT).map(tool => tool.name);

    for (const name of [
      'create_tag',
      'create_tag_group',
      'list_tag_groups',
      'delete_tag_group',
      'update_tag_group',
      'get_tag_group',
      'delete_tag',
      'update_tag',
    ]) {
      assert.ok(names.includes(name), `${name} should be registered`);
    }
  });

  it('routes Flow tag requests through pipeline-management handlers', async () => {
    await assert.rejects(
      handleToolRequestByToolset({ params: { name: 'create_tag', arguments: {} } }, Toolset.PIPELINE_MANAGEMENT),
      error => error instanceof Error && !error.message.includes('Unknown tool')
    );
  });

  it('exposes system release workflow tools through application-delivery', () => {
    const names = manager.getToolsByToolset(Toolset.APPLICATION_DELIVERY).map(tool => tool.name);

    for (const name of [
      'list_system_release_workflows',
      'create_system_release_workflow',
      'update_system_release_stage',
      'execute_system_release_stage',
    ]) {
      assert.ok(names.includes(name), `${name} should be registered`);
    }
  });

  it('routes system release workflow requests through application-delivery handlers', async () => {
    await assert.rejects(
      handleToolRequestByToolset({ params: { name: 'create_system_release_workflow', arguments: {} } }, Toolset.APPLICATION_DELIVERY),
      error => error instanceof Error && !error.message.includes('Unknown tool')
    );
  });
});
