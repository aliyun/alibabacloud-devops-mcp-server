import { 
  listAllReleaseWorkflows,
  listAllReleaseWorkflowBriefs,
  getReleaseWorkflowStage,
  listAllReleaseStageBriefs,
  updateAppReleaseStage,
  listAppReleaseStageRuns,
  executeChangeRequestReleaseStage,
  cancelExecutionReleaseStage,
  retryChangeRequestStagePipeline,
  skipChangeRequestStagePipeline,
  listAppReleaseStageExecutionIntegratedMetadata,
  getReleaseStagePipelineRun,
  passReleaseStagePipelineValidate,
  getAppReleaseStageExecutionPipelineJobLog,
  refuseReleaseStagePipelineValidate,
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

/**
 * Handle the appstack app release workflow tool requests (application level)
 * 
 * @param request - The tool request
 * @returns The tool response or null if not handled
 */
export async function handleAppStackAppReleaseWorkflowTools(request: any) {
  switch (request.params.name) {
    case 'list_app_release_workflows':
      const listParams = ListAllReleaseWorkflowsRequestSchema.parse(request.params.arguments);
      const listResult = await listAllReleaseWorkflows(listParams);
      return {
        content: [{ type: "text", text: JSON.stringify(listResult, null, 2) }],
      };
      
    case 'list_app_release_workflow_briefs':
      const listBriefsParams = ListAllReleaseWorkflowBriefsRequestSchema.parse(request.params.arguments);
      const listBriefsResult = await listAllReleaseWorkflowBriefs(listBriefsParams);
      return {
        content: [{ type: "text", text: JSON.stringify(listBriefsResult, null, 2) }],
      };
      
    case 'get_app_release_workflow_stage':
      const getStageParams = GetReleaseWorkflowStageRequestSchema.parse(request.params.arguments);
      const getStageResult = await getReleaseWorkflowStage(getStageParams);
      return {
        content: [{ type: "text", text: JSON.stringify(getStageResult, null, 2) }],
      };
      
    case 'list_app_release_stage_briefs':
      const listStageBriefsParams = ListAllReleaseStageBriefsRequestSchema.parse(request.params.arguments);
      const listStageBriefsResult = await listAllReleaseStageBriefs(listStageBriefsParams);
      return {
        content: [{ type: "text", text: JSON.stringify(listStageBriefsResult, null, 2) }],
      };
      
    case 'update_app_release_stage':
      const updateParams = UpdateAppReleaseStageRequestSchema.parse(request.params.arguments);
      const updateResult = await updateAppReleaseStage(updateParams);
      return {
        content: [{ type: "text", text: JSON.stringify(updateResult, null, 2) }],
      };
      
    case 'list_app_release_stage_runs':
      const listRunsParams = ListAppReleaseStageRunsRequestSchema.parse(request.params.arguments);
      const listRunsResult = await listAppReleaseStageRuns(listRunsParams);
      return {
        content: [{ type: "text", text: JSON.stringify(listRunsResult, null, 2) }],
      };
      
    case 'execute_app_release_stage':
      const executeParams = ExecuteChangeRequestReleaseStageRequestSchema.parse(request.params.arguments);
      const executeResult = await executeChangeRequestReleaseStage(executeParams);
      return {
        content: [{ type: "text", text: JSON.stringify(executeResult, null, 2) }],
      };
      
    case 'cancel_app_release_stage_execution':
      const cancelParams = CancelExecutionReleaseStageRequestSchema.parse(request.params.arguments);
      const cancelResult = await cancelExecutionReleaseStage(cancelParams);
      return {
        content: [{ type: "text", text: JSON.stringify(cancelResult, null, 2) }],
      };
      
    case 'retry_app_release_stage_pipeline':
      const retryParams = RetryChangeRequestStagePipelineRequestSchema.parse(request.params.arguments);
      const retryResult = await retryChangeRequestStagePipeline(retryParams);
      return {
        content: [{ type: "text", text: JSON.stringify(retryResult, null, 2) }],
      };
      
    case 'skip_app_release_stage_pipeline':
      const skipParams = SkipChangeRequestStagePipelineRequestSchema.parse(request.params.arguments);
      const skipResult = await skipChangeRequestStagePipeline(skipParams);
      return {
        content: [{ type: "text", text: JSON.stringify(skipResult, null, 2) }],
      };
      
    case 'list_app_release_stage_metadata':
      const listMetadataParams = ListAppReleaseStageExecutionIntegratedMetadataRequestSchema.parse(request.params.arguments);
      const listMetadataResult = await listAppReleaseStageExecutionIntegratedMetadata(listMetadataParams);
      return {
        content: [{ type: "text", text: JSON.stringify(listMetadataResult, null, 2) }],
      };
      
    case 'get_app_release_stage_pipeline_run':
      const getPipelineRunParams = GetReleaseStagePipelineRunRequestSchema.parse(request.params.arguments);
      const getPipelineRunResult = await getReleaseStagePipelineRun(getPipelineRunParams);
      return {
        content: [{ type: "text", text: JSON.stringify(getPipelineRunResult, null, 2) }],
      };
      
    case 'pass_app_release_stage_validate':
      const passValidateParams = PassReleaseStagePipelineValidateRequestSchema.parse(request.params.arguments);
      const passValidateResult = await passReleaseStagePipelineValidate(passValidateParams);
      return {
        content: [{ type: "text", text: JSON.stringify(passValidateResult, null, 2) }],
      };
      
    case 'get_app_release_stage_job_log':
      const getJobLogParams = GetAppReleaseStageExecutionPipelineJobLogRequestSchema.parse(request.params.arguments);
      const getJobLogResult = await getAppReleaseStageExecutionPipelineJobLog(getJobLogParams);
      return {
        content: [{ type: "text", text: JSON.stringify(getJobLogResult, null, 2) }],
      };
      
    case 'refuse_app_release_stage_validate':
      const refuseValidateParams = RefuseReleaseStagePipelineValidateRequestSchema.parse(request.params.arguments);
      const refuseValidateResult = await refuseReleaseStagePipelineValidate(refuseValidateParams);
      return {
        content: [{ type: "text", text: JSON.stringify(refuseValidateResult, null, 2) }],
      };
      
    default:
      return null;
  }
}

