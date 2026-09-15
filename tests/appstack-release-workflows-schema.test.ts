import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  ListSystemAllReleaseWorkflowsResponseSchema,
  ReleaseStageSchema,
} from '../operations/appstack/releaseWorkflows.js';

const pipelineResponse = {
  engineType: 'FlowV1',
  engineSn: '4711366',
  pipelineYaml: 'sources:\n  defaultWorkspace: {}',
  plugins: null,
  refObjectList: [{ refType: 'APP', refSn: 'umodeltest' }],
  pipeline: {
    id: 4711366,
    name: 'umodeltest-标准研发流程-测试阶段',
    status: 'ONLINE',
    pipelineSystemType: 'appDeployment',
    originPipelineId: 1,
    lastConfigId: 20302460,
    lastInstId: 155891569,
    readOnly: 'N',
  },
  futureFlowField: { keep: true },
};

const releaseStageResponse = {
  appName: 'umodeltest',
  labels: [{ value: 'test' }],
  name: '测试阶段',
  order: '1',
  pipeline: pipelineResponse,
  releaseWorkflowSn: '0c380a67bf4945dd95433f0e3f917565',
  sn: '880c7125f0a143c791a57446303c9688',
  variableGroups: [],
};

describe('AppStack release workflow response schemas', () => {
  it('preserves the complete Flow pipeline envelope and nested detail', () => {
    const parsed = ReleaseStageSchema.parse(releaseStageResponse);

    assert.deepEqual(parsed.pipeline, pipelineResponse);
    assert.equal(parsed.pipeline?.pipeline?.name, 'umodeltest-标准研发流程-测试阶段');
    assert.equal(parsed.pipeline?.engineSn, '4711366');
  });

  it('accepts a null or missing pipeline for stages without a configured pipeline', () => {
    assert.equal(ReleaseStageSchema.parse({
      ...releaseStageResponse,
      pipeline: null,
    }).pipeline, null);

    const { pipeline: _pipeline, ...stageWithoutPipeline } = releaseStageResponse;
    assert.equal(ReleaseStageSchema.parse(stageWithoutPipeline).pipeline, undefined);
  });

  it('preserves pipeline data when parsing the workflow list response', () => {
    const parsed = ListSystemAllReleaseWorkflowsResponseSchema.parse([{
      appName: 'umodeltest',
      name: '标准研发流程',
      note: null,
      order: '1',
      releaseStages: [releaseStageResponse],
      sn: '0c380a67bf4945dd95433f0e3f917565',
      type: 'APP_RELEASE',
    }]);

    assert.deepEqual(parsed[0].releaseStages[0].pipeline, pipelineResponse);
  });
});
