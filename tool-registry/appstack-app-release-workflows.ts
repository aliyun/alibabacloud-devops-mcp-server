import { toInputSchema } from '../common/inputSchema.js';
import { 
  ListAllReleaseWorkflowsRequestSchema,
  ListAllReleaseWorkflowBriefsRequestSchema,
  GetReleaseWorkflowStageRequestSchema,
  ListAllReleaseStageBriefsRequestSchema,
  UpdateAppReleaseStageRequestSchema,
  ListAppReleaseStageRunsRequestSchema,
  ExecuteChangeRequestReleaseStageRequestSchema,
  CancelExecutionReleaseStageRequestSchema,
  RetryChangeRequestStagePipelineRequestSchema,
  SkipChangeRequestStagePipelineRequestSchema,
  ListAppReleaseStageExecutionIntegratedMetadataRequestSchema,
  GetReleaseStagePipelineRunRequestSchema,
  PassReleaseStagePipelineValidateRequestSchema,
  GetAppReleaseStageExecutionPipelineJobLogRequestSchema,
  RefuseReleaseStagePipelineValidateRequestSchema
} from '../operations/appstack/releaseWorkflows.js';

// Export all appstack app release workflow tools (application level)
export const getAppStackAppReleaseWorkflowTools = () => [
  {
    name: 'list_app_release_workflows',
    description: '[application delivery] 查询应用下所有发布流程',
    inputSchema: toInputSchema(ListAllReleaseWorkflowsRequestSchema),
  },
  {
    name: 'list_app_release_workflow_briefs',
    description: '[application delivery] 查询应用下所有发布流程摘要',
    inputSchema: toInputSchema(ListAllReleaseWorkflowBriefsRequestSchema),
  },
  {
    name: 'get_app_release_workflow_stage',
    description: '[application delivery] 获取发布流程阶段详情',
    inputSchema: toInputSchema(GetReleaseWorkflowStageRequestSchema),
  },
  {
    name: 'list_app_release_stage_briefs',
    description: '[application delivery] 查询发布流程阶段摘要列表',
    inputSchema: toInputSchema(ListAllReleaseStageBriefsRequestSchema),
  },
  {
    name: 'update_app_release_stage',
    description: '[application delivery] 更新应用发布流程阶段',
    inputSchema: toInputSchema(UpdateAppReleaseStageRequestSchema),
  },
  {
    name: 'list_app_release_stage_runs',
    description: '[application delivery] 查询发布流程阶段执行记录列表',
    inputSchema: toInputSchema(ListAppReleaseStageRunsRequestSchema),
  },
  {
    name: 'execute_app_release_stage',
    description: '[application delivery] 执行变更请求的发布流程阶段',
    inputSchema: toInputSchema(ExecuteChangeRequestReleaseStageRequestSchema),
  },
  {
    name: 'cancel_app_release_stage_execution',
    description: '[application delivery] 取消发布流程阶段执行',
    inputSchema: toInputSchema(CancelExecutionReleaseStageRequestSchema),
  },
  {
    name: 'retry_app_release_stage_pipeline',
    description: '[application delivery] 重试变更请求的发布流程阶段流水线',
    inputSchema: toInputSchema(RetryChangeRequestStagePipelineRequestSchema),
  },
  {
    name: 'skip_app_release_stage_pipeline',
    description: '[application delivery] 跳过变更请求的发布流程阶段流水线',
    inputSchema: toInputSchema(SkipChangeRequestStagePipelineRequestSchema),
  },
  {
    name: 'list_app_release_stage_metadata',
    description: '[application delivery] 查询研发阶段执行记录集成变更信息',
    inputSchema: toInputSchema(ListAppReleaseStageExecutionIntegratedMetadataRequestSchema),
  },
  {
    name: 'get_app_release_stage_pipeline_run',
    description: '[application delivery] 获取研发阶段流水线运行实例',
    inputSchema: toInputSchema(GetReleaseStagePipelineRunRequestSchema),
  },
  {
    name: 'pass_app_release_stage_validate',
    description: '[application delivery] 通过发布流程阶段验证',
    inputSchema: toInputSchema(PassReleaseStagePipelineValidateRequestSchema),
  },
  {
    name: 'get_app_release_stage_job_log',
    description: '[application delivery] 查询研发阶段流水线任务运行日志',
    inputSchema: toInputSchema(GetAppReleaseStageExecutionPipelineJobLogRequestSchema),
  },
  {
    name: 'refuse_app_release_stage_validate',
    description: '[application delivery] 拒绝发布流程阶段验证',
    inputSchema: toInputSchema(RefuseReleaseStagePipelineValidateRequestSchema),
  }
];

