import { z } from 'zod';
import { yunxiaoRequest, buildUrl, isRegionEdition } from '../../common/utils.js';
import { resolveOrganizationId } from '../organization/organization.js';

// Schema for Label
export const LabelSchema = z.object({
  // Based on the reference in the swagger, we'll define a basic structure
  // You may need to update this with the actual fields from Label
  key: z.string().optional().describe("标签键"),
  value: z.string().optional().describe("标签值"),
});

// Schema for VariableGroup
export const VariableGroupSchema = z.object({
  // Based on the reference in the swagger, we'll define a basic structure
  // You may need to update this with the actual fields from VariableGroup
  name: z.string().optional().describe("变量组名称"),
  variables: z.record(z.string()).optional().describe("变量映射"),
});

// Schema for FlowV1Pipeline
export const FlowV1PipelineSchema = z.object({
  // Based on the reference in the swagger, we'll define a basic structure
  // You may need to update this with the actual fields from FlowV1Pipeline
  id: z.number().optional().describe("流水线ID"),
  name: z.string().optional().describe("流水线名称"),
});

// Schema for FlowV2Pipeline
export const FlowV2PipelineSchema = z.object({
  // Based on the reference in the swagger, we'll define a basic structure
  // You may need to update this with the actual fields from FlowV2Pipeline
  id: z.number().optional().describe("流水线ID"),
  name: z.string().optional().describe("流水线名称"),
});

// Schema for ReleaseStage
export const ReleaseStageSchema = z.object({
  appName: z.string().optional().describe("应用名"),
  labels: z.array(LabelSchema).describe("标签列表"),
  name: z.string().optional().describe("名称"),
  order: z.string().optional().describe("阶段顺序"),
  pipeline: z.union([FlowV1PipelineSchema, FlowV2PipelineSchema]).optional(),
  releaseWorkflowSn: z.string().optional().describe("所属的流程sn"),
  sn: z.string().optional().describe("唯一序列号"),
  variableGroups: z.array(VariableGroupSchema).describe("变量组列表"),
});

// Schema for ReleaseWorkflow
export const ReleaseWorkflowSchema = z.object({
  appName: z.string().optional().describe("应用名"),
  name: z.string().optional().describe("名称"),
  note: z.string().nullable().optional().describe("公告"),
  order: z.string().optional().describe("排序"),
  releaseStages: z.array(ReleaseStageSchema).describe("研发阶段列表"),
  sn: z.string().optional().describe("唯一标识sn"),
  type: z.enum(["CR", "APP_RELEASE"]).optional().describe("研发流程类型"),
});

// Schema for ListSystemAllReleaseWorkflows API
export const ListSystemAllReleaseWorkflowsRequestSchema = z.object({
  organizationId: z.string().describe("组织ID"),
  systemName: z.string().describe("系统名"),
});

export const ListSystemAllReleaseWorkflowsResponseSchema = z.array(ReleaseWorkflowSchema);

// Schema for CreateSystemReleaseWorkflows API
export const CreateReleaseWorkflowRequestSchema = z.object({
  name: z.string(),
  note: z.string().optional(),
  templateSn: z.string().optional(),
});

export const CreateSystemReleaseWorkflowsRequestSchema = z.object({
  organizationId: z.string().describe("组织ID"),
  systemName: z.string().describe("系统名"),
  workflow: CreateReleaseWorkflowRequestSchema,
});

export const CreateSystemReleaseWorkflowsResponseSchema = ReleaseWorkflowSchema;

// Schema for UpdateSystemReleaseStage API
export const UpdateReleaseStageRequestSchema = z.object({
  commitMessage: z.string().optional().describe("版本commit信息"),
  labelList: z.array(LabelSchema).describe("标签列表"),
  name: z.string().optional().describe("名称"),
  order: z.string().optional().describe("排序"),
  variableGroups: z.array(VariableGroupSchema).describe("变量组列表"),
});

export const UpdateSystemReleaseStageRequestSchema = z.object({
  organizationId: z.string().describe("组织ID"),
  systemName: z.string().describe("系统名"),
  releaseWorkflowSn: z.string().describe("发布流程SN"),
  releaseStageSn: z.string().describe("发布阶段SN"),
  stage: UpdateReleaseStageRequestSchema,
});

export const UpdateSystemReleaseStageResponseSchema = ReleaseStageSchema;

// Schema for ExecuteReleaseStage API
export const ExecuteReleaseStagePipelineNgRequestSchema = z.object({
  appReleaseSn: z.string().optional().describe("发布sn"),
  params: z.record(z.any()).optional().describe("运行流水线参数"),
});

export const ExecuteReleaseStageRequestSchema = z.object({
  organizationId: z.string().describe("组织ID"),
  systemName: z.string().describe("系统名"),
  releaseWorkflowSn: z.string().describe("发布流程SN"),
  releaseStageSn: z.string().describe("发布阶段SN"),
  execution: ExecuteReleaseStagePipelineNgRequestSchema,
});

export const ExecutePipelineResultSchema = z.object({
  object: z.number().describe("流水线对象"),
  pipelineId: z.number().describe("流水线ID"),
  pipelineRunId: z.number().describe("流水线运行ID"),
});

export const ExecuteReleaseStageResponseSchema = ExecutePipelineResultSchema;

export type ListSystemAllReleaseWorkflowsRequest = z.infer<typeof ListSystemAllReleaseWorkflowsRequestSchema>;
export type ListSystemAllReleaseWorkflowsResponse = z.infer<typeof ListSystemAllReleaseWorkflowsResponseSchema>;
export type CreateSystemReleaseWorkflowsRequest = z.infer<typeof CreateSystemReleaseWorkflowsRequestSchema>;
export type CreateSystemReleaseWorkflowsResponse = z.infer<typeof CreateSystemReleaseWorkflowsResponseSchema>;
export type UpdateSystemReleaseStageRequest = z.infer<typeof UpdateSystemReleaseStageRequestSchema>;
export type UpdateSystemReleaseStageResponse = z.infer<typeof UpdateSystemReleaseStageResponseSchema>;
export type ExecuteReleaseStageRequest = z.infer<typeof ExecuteReleaseStageRequestSchema>;
export type ExecuteReleaseStageResponse = z.infer<typeof ExecuteReleaseStageResponseSchema>;

/**
 * List all release workflows for a system
 * 
 * @param params - The request parameters
 * @returns The list of release workflows
 */
export async function listSystemAllReleaseWorkflows(params: ListSystemAllReleaseWorkflowsRequest): Promise<ListSystemAllReleaseWorkflowsResponse> {
  const { organizationId, systemName } = params;
  const finalOrgId = await resolveOrganizationId(organizationId);
  
  try {
    const url = isRegionEdition()
      ? `/oapi/v1/appstack/systems/${systemName}/releaseWorkflows`
      : `/oapi/v1/appstack/organizations/${finalOrgId}/systems/${systemName}/releaseWorkflows`;
    const response = await yunxiaoRequest(
      url,
      {
        method: 'GET',
      }
    );
    return ListSystemAllReleaseWorkflowsResponseSchema.parse(response);
  } catch (error) {
    throw error;
  }
}

/**
 * Create a release workflow for a system
 * 
 * @param params - The request parameters
 * @returns The created release workflow
 */
export async function createSystemReleaseWorkflows(params: CreateSystemReleaseWorkflowsRequest): Promise<CreateSystemReleaseWorkflowsResponse> {
  const { organizationId, systemName, workflow } = params;
  const finalOrgId = await resolveOrganizationId(organizationId);
  
  try {
    const url = isRegionEdition()
      ? `/oapi/v1/appstack/systems/${systemName}/releaseWorkflows`
      : `/oapi/v1/appstack/organizations/${finalOrgId}/systems/${systemName}/releaseWorkflows`;
    const response = await yunxiaoRequest(
      url,
      {
        method: 'POST',
        body: workflow,
      }
    );
    return CreateSystemReleaseWorkflowsResponseSchema.parse(response);
  } catch (error) {
    throw error;
  }
}

/**
 * Update a release stage
 * 
 * @param params - The request parameters
 * @returns The updated release stage
 */
export async function updateSystemReleaseStage(params: UpdateSystemReleaseStageRequest): Promise<UpdateSystemReleaseStageResponse> {
  const { organizationId, systemName, releaseWorkflowSn, releaseStageSn, stage } = params;
  const finalOrgId = await resolveOrganizationId(organizationId);
  
  try {
    const url = isRegionEdition()
      ? `/oapi/v1/appstack/systems/${systemName}/releaseWorkflows/${releaseWorkflowSn}/releaseStages/${releaseStageSn}`
      : `/oapi/v1/appstack/organizations/${finalOrgId}/systems/${systemName}/releaseWorkflows/${releaseWorkflowSn}/releaseStages/${releaseStageSn}`;
    const response = await yunxiaoRequest(
      url,
      {
        method: 'PUT',
        body: stage,
      }
    );
    return UpdateSystemReleaseStageResponseSchema.parse(response);
  } catch (error) {
    throw error;
  }
}

/**
 * Execute a release stage
 * 
 * @param params - The request parameters
 * @returns The execution result
 */
export async function executeReleaseStage(params: ExecuteReleaseStageRequest): Promise<ExecuteReleaseStageResponse> {
  const { organizationId, systemName, releaseWorkflowSn, releaseStageSn, execution } = params;
  const finalOrgId = await resolveOrganizationId(organizationId);
  
  try {
    const url = isRegionEdition()
      ? `/oapi/v1/appstack/systems/${systemName}/releaseWorkflows/${releaseWorkflowSn}/releaseStages/${releaseStageSn}:execute`
      : `/oapi/v1/appstack/organizations/${finalOrgId}/systems/${systemName}/releaseWorkflows/${releaseWorkflowSn}/releaseStages/${releaseStageSn}:execute`;
    const response = await yunxiaoRequest(
      url,
      {
        method: 'POST',
        body: execution,
      }
    );
    return ExecuteReleaseStageResponseSchema.parse(response);
  } catch (error) {
    throw error;
  }
}

// ========== Application Level Release Workflow APIs ==========

// Schema for ReleaseWorkflowBriefVO
export const ReleaseWorkflowBriefVOSchema = z.object({
  name: z.string().optional().describe("名称"),
  sn: z.string().optional().describe("唯一标识sn"),
  type: z.enum(["CR", "APP_RELEASE"]).optional().describe("研发流程类型"),
});

// Schema for ReleaseStageBriefVO
export const ReleaseStageBriefVOSchema = z.object({
  name: z.string().optional().describe("名称"),
  order: z.string().optional().describe("阶段顺序"),
  sn: z.string().optional().describe("唯一序列号"),
});

// Schema for ListAllReleaseWorkflows API (Application level)
export const ListAllReleaseWorkflowsRequestSchema = z.object({
  organizationId: z.string().describe("组织ID"),
  appName: z.string().describe("应用名"),
});

export const ListAllReleaseWorkflowsResponseSchema = z.array(ReleaseWorkflowSchema);

// Schema for ListAllReleaseWorkflowBriefs API
export const ListAllReleaseWorkflowBriefsRequestSchema = z.object({
  organizationId: z.string().describe("组织ID"),
  appName: z.string().describe("应用名"),
});

export const ListAllReleaseWorkflowBriefsResponseSchema = z.array(ReleaseWorkflowBriefVOSchema);

// Schema for GetReleaseWorkflowStage API
export const GetReleaseWorkflowStageRequestSchema = z.object({
  organizationId: z.string().describe("组织ID"),
  appName: z.string().describe("应用名"),
  releaseWorkflowSn: z.string().describe("研发流程唯一标识符"),
  releaseStageSn: z.string().describe("研发阶段唯一标识符"),
});

export const GetReleaseWorkflowStageResponseSchema = ReleaseStageSchema;

// Schema for ListAllReleaseStageBriefs API
export const ListAllReleaseStageBriefsRequestSchema = z.object({
  organizationId: z.string().describe("组织ID"),
  appName: z.string().describe("应用名"),
  releaseWorkflowSn: z.string().describe("研发流程唯一标识符"),
});

export const ListAllReleaseStageBriefsResponseSchema = z.array(ReleaseStageBriefVOSchema);

// Schema for UpdateReleaseStage API (Application level)
export const UpdateAppReleaseStageRequestSchema = z.object({
  organizationId: z.string().describe("组织ID"),
  appName: z.string().describe("应用名"),
  releaseWorkflowSn: z.string().describe("发布流程唯一序列号"),
  releaseStageSn: z.string().describe("发布流程阶段唯一序列号"),
  stage: UpdateReleaseStageRequestSchema,
});

export const UpdateAppReleaseStageResponseSchema = ReleaseStageSchema;

// Schema for ListAppReleaseStageRuns API
export const ListAppReleaseStageRunsRequestSchema = z.object({
  organizationId: z.string().describe("组织ID"),
  appName: z.string().describe("应用名"),
  releaseWorkflowSn: z.string().describe("发布流程唯一序列号"),
  releaseStageSn: z.string().describe("发布流程阶段唯一序列号"),
  pagination: z.enum(["keyset", ""]).optional().describe("分页模式参数：keyset表示键集分页，不传表示页码分页"),
  perPage: z.number().min(1).max(100).default(20).optional().describe("分页尺寸参数，决定一页最多返回多少对象"),
  orderBy: z.enum(["id", "gmtCreate"]).optional().describe("分页排序属性，决定根据何种属性进行记录排序；推荐在实现严格遍历时，使用 id 属性"),
  sort: z.enum(["asc", "desc"]).optional().describe("分页排序升降序，asc 为升序，desc 为降序；推荐在实现严格遍历时，使用升序"),
  nextToken: z.string().optional().describe("键集分页 token，获取第一页数据时无需传入，否则需要传入前一页查询结果中的 nextToken 字段"),
  page: z.number().default(1).optional().describe("页码分页时使用，用于获取下一页内容"),
});

// Schema for ReleaseStageInstanceVO (simplified)
export const ReleaseStageInstanceVOSchema = z.object({
  executionNumber: z.string().optional().describe("执行序号"),
  state: z.string().optional().describe("状态"),
  gmtCreate: z.string().optional().describe("创建时间"),
});

// Schema for PageListReleaseStageInstanceVO
export const PageListReleaseStageInstanceVOSchema = z.object({
  current: z.number().optional().describe("当前页数"),
  pageSize: z.number().optional().describe("每页大小"),
  pages: z.number().optional().describe("总页数"),
  records: z.array(ReleaseStageInstanceVOSchema).optional().describe("数据列表"),
  total: z.number().optional().describe("总数"),
  nextToken: z.string().nullable().optional().describe("下一页token"),
});

export const ListAppReleaseStageRunsResponseSchema = PageListReleaseStageInstanceVOSchema;

// Schema for ExecuteChangeRequestReleaseStage API
export const ExecuteChangeRequestReleaseStageRequestSchema = z.object({
  organizationId: z.string().describe("组织ID"),
  appName: z.string().describe("应用名"),
  releaseWorkflowSn: z.string().describe("发布流程唯一序列号"),
  releaseStageSn: z.string().describe("发布流程阶段唯一序列号"),
  execution: ExecuteReleaseStagePipelineNgRequestSchema,
});

export const ExecuteChangeRequestReleaseStageResponseSchema = ExecutePipelineResultSchema;

// Schema for CancelExecutionReleaseStage API
export const CancelExecutionReleaseStageRequestSchema = z.object({
  organizationId: z.string().describe("组织ID"),
  appName: z.string().describe("应用名"),
  releaseWorkflowSn: z.string().describe("发布流程唯一序列号"),
  releaseStageSn: z.string().describe("发布流程阶段唯一序列号"),
  executionNumber: z.string().describe("发布流程阶执行序号"),
});

export const CancelExecutionReleaseStageResponseSchema = z.boolean();

// Schema for RetryChangeRequestStagePipeline API
export const RetryChangeRequestStagePipelineRequestSchema = z.object({
  organizationId: z.string().describe("组织ID"),
  appName: z.string().describe("应用名"),
  releaseWorkflowSn: z.string().describe("发布流程唯一序列号"),
  releaseStageSn: z.string().describe("发布流程阶段唯一序列号"),
  executionNumber: z.string().describe("发布流程阶执行序号"),
});

export const RetryChangeRequestStagePipelineResponseSchema = z.boolean();

// Schema for SkipChangeRequestStagePipeline API
export const SkipChangeRequestStagePipelineRequestSchema = z.object({
  organizationId: z.string().describe("组织ID"),
  appName: z.string().describe("应用名"),
  releaseWorkflowSn: z.string().describe("发布流程唯一序列号"),
  releaseStageSn: z.string().describe("发布流程阶段唯一序列号"),
  executionNumber: z.string().describe("发布流程阶执行序号"),
});

export const SkipChangeRequestStagePipelineResponseSchema = z.boolean();

// Export types
export type ListAllReleaseWorkflowsRequest = z.infer<typeof ListAllReleaseWorkflowsRequestSchema>;
export type ListAllReleaseWorkflowsResponse = z.infer<typeof ListAllReleaseWorkflowsResponseSchema>;
export type ListAllReleaseWorkflowBriefsRequest = z.infer<typeof ListAllReleaseWorkflowBriefsRequestSchema>;
export type ListAllReleaseWorkflowBriefsResponse = z.infer<typeof ListAllReleaseWorkflowBriefsResponseSchema>;
export type GetReleaseWorkflowStageRequest = z.infer<typeof GetReleaseWorkflowStageRequestSchema>;
export type GetReleaseWorkflowStageResponse = z.infer<typeof GetReleaseWorkflowStageResponseSchema>;
export type ListAllReleaseStageBriefsRequest = z.infer<typeof ListAllReleaseStageBriefsRequestSchema>;
export type ListAllReleaseStageBriefsResponse = z.infer<typeof ListAllReleaseStageBriefsResponseSchema>;
export type UpdateAppReleaseStageRequest = z.infer<typeof UpdateAppReleaseStageRequestSchema>;
export type UpdateAppReleaseStageResponse = z.infer<typeof UpdateAppReleaseStageResponseSchema>;
export type ListAppReleaseStageRunsRequest = z.infer<typeof ListAppReleaseStageRunsRequestSchema>;
export type ListAppReleaseStageRunsResponse = z.infer<typeof ListAppReleaseStageRunsResponseSchema>;
export type ExecuteChangeRequestReleaseStageRequest = z.infer<typeof ExecuteChangeRequestReleaseStageRequestSchema>;
export type ExecuteChangeRequestReleaseStageResponse = z.infer<typeof ExecuteChangeRequestReleaseStageResponseSchema>;
export type CancelExecutionReleaseStageRequest = z.infer<typeof CancelExecutionReleaseStageRequestSchema>;
export type CancelExecutionReleaseStageResponse = z.infer<typeof CancelExecutionReleaseStageResponseSchema>;
export type RetryChangeRequestStagePipelineRequest = z.infer<typeof RetryChangeRequestStagePipelineRequestSchema>;
export type RetryChangeRequestStagePipelineResponse = z.infer<typeof RetryChangeRequestStagePipelineResponseSchema>;
export type SkipChangeRequestStagePipelineRequest = z.infer<typeof SkipChangeRequestStagePipelineRequestSchema>;
export type SkipChangeRequestStagePipelineResponse = z.infer<typeof SkipChangeRequestStagePipelineResponseSchema>;

/**
 * List all release workflows for an application
 */
export async function listAllReleaseWorkflows(params: ListAllReleaseWorkflowsRequest): Promise<ListAllReleaseWorkflowsResponse> {
  const { organizationId, appName } = params;
  const finalOrgId = await resolveOrganizationId(organizationId);
  
  try {
    const url = isRegionEdition()
      ? `/oapi/v1/appstack/apps/${appName}/releaseWorkflows`
      : `/oapi/v1/appstack/organizations/${finalOrgId}/apps/${appName}/releaseWorkflows`;
    const response = await yunxiaoRequest(
      url,
      {
        method: 'GET',
      }
    );
    return ListAllReleaseWorkflowsResponseSchema.parse(response);
  } catch (error) {
    throw error;
  }
}

/**
 * List all release workflow briefs for an application
 */
export async function listAllReleaseWorkflowBriefs(params: ListAllReleaseWorkflowBriefsRequest): Promise<ListAllReleaseWorkflowBriefsResponse> {
  const { organizationId, appName } = params;
  const finalOrgId = await resolveOrganizationId(organizationId);
  
  try {
    const url = isRegionEdition()
      ? `/oapi/v1/appstack/apps/${appName}/releaseWorkflowBriefs`
      : `/oapi/v1/appstack/organizations/${finalOrgId}/apps/${appName}/releaseWorkflowBriefs`;
    const response = await yunxiaoRequest(
      url,
      {
        method: 'GET',
      }
    );
    return ListAllReleaseWorkflowBriefsResponseSchema.parse(response);
  } catch (error) {
    throw error;
  }
}

/**
 * Get release workflow stage
 */
export async function getReleaseWorkflowStage(params: GetReleaseWorkflowStageRequest): Promise<GetReleaseWorkflowStageResponse> {
  const { organizationId, appName, releaseWorkflowSn, releaseStageSn } = params;
  const finalOrgId = await resolveOrganizationId(organizationId);
  
  try {
    const url = isRegionEdition()
      ? `/oapi/v1/appstack/apps/${appName}/releaseWorkflow/${releaseWorkflowSn}/releaseStage/${releaseStageSn}`
      : `/oapi/v1/appstack/organizations/${finalOrgId}/apps/${appName}/releaseWorkflow/${releaseWorkflowSn}/releaseStage/${releaseStageSn}`;
    const response = await yunxiaoRequest(
      url,
      {
        method: 'GET',
      }
    );
    return GetReleaseWorkflowStageResponseSchema.parse(response);
  } catch (error) {
    throw error;
  }
}

/**
 * List all release stage briefs
 */
export async function listAllReleaseStageBriefs(params: ListAllReleaseStageBriefsRequest): Promise<ListAllReleaseStageBriefsResponse> {
  const { organizationId, appName, releaseWorkflowSn } = params;
  const finalOrgId = await resolveOrganizationId(organizationId);
  
  try {
    const url = isRegionEdition()
      ? `/oapi/v1/appstack/apps/${appName}/releaseWorkflow/${releaseWorkflowSn}/releaseStageBriefs`
      : `/oapi/v1/appstack/organizations/${finalOrgId}/apps/${appName}/releaseWorkflow/${releaseWorkflowSn}/releaseStageBriefs`;
    const response = await yunxiaoRequest(
      url,
      {
        method: 'GET',
      }
    );
    return ListAllReleaseStageBriefsResponseSchema.parse(response);
  } catch (error) {
    throw error;
  }
}

/**
 * Update release stage (application level)
 */
export async function updateAppReleaseStage(params: UpdateAppReleaseStageRequest): Promise<UpdateAppReleaseStageResponse> {
  const { organizationId, appName, releaseWorkflowSn, releaseStageSn, stage } = params;
  const finalOrgId = await resolveOrganizationId(organizationId);
  
  try {
    const url = isRegionEdition()
      ? `/oapi/v1/appstack/apps/${appName}/releaseWorkflows/${releaseWorkflowSn}/releaseStages/${releaseStageSn}`
      : `/oapi/v1/appstack/organizations/${finalOrgId}/apps/${appName}/releaseWorkflows/${releaseWorkflowSn}/releaseStages/${releaseStageSn}`;
    const response = await yunxiaoRequest(
      url,
      {
        method: 'PUT',
        body: stage,
      }
    );
    return UpdateAppReleaseStageResponseSchema.parse(response);
  } catch (error) {
    throw error;
  }
}

/**
 * List app release stage runs
 */
export async function listAppReleaseStageRuns(params: ListAppReleaseStageRunsRequest): Promise<ListAppReleaseStageRunsResponse> {
  const { organizationId, appName, releaseWorkflowSn, releaseStageSn, pagination, perPage, orderBy, sort, nextToken, page } = params;
  const finalOrgId = await resolveOrganizationId(organizationId);
  
  const query: Record<string, string | number> = {};
  if (pagination) query.pagination = pagination;
  if (perPage !== undefined) query.perPage = perPage;
  if (orderBy) query.orderBy = orderBy;
  if (sort) query.sort = sort;
  if (nextToken) query.nextToken = nextToken;
  if (page !== undefined) query.page = page;
  
  try {
    const baseUrl = isRegionEdition()
      ? `/oapi/v1/appstack/apps/${appName}/releaseWorkflows/${releaseWorkflowSn}/releaseStages/${releaseStageSn}/executions`
      : `/oapi/v1/appstack/organizations/${finalOrgId}/apps/${appName}/releaseWorkflows/${releaseWorkflowSn}/releaseStages/${releaseStageSn}/executions`;
    const url = buildUrl(baseUrl, query);
    const response = await yunxiaoRequest(url, { method: 'GET' });
    return ListAppReleaseStageRunsResponseSchema.parse(response);
  } catch (error) {
    throw error;
  }
}

/**
 * Execute change request release stage
 */
export async function executeChangeRequestReleaseStage(params: ExecuteChangeRequestReleaseStageRequest): Promise<ExecuteChangeRequestReleaseStageResponse> {
  const { organizationId, appName, releaseWorkflowSn, releaseStageSn, execution } = params;
  const finalOrgId = await resolveOrganizationId(organizationId);
  
  try {
    const url = isRegionEdition()
      ? `/oapi/v1/appstack/apps/${appName}/releaseWorkflows/${releaseWorkflowSn}/releaseStages/${releaseStageSn}:execute`
      : `/oapi/v1/appstack/organizations/${finalOrgId}/apps/${appName}/releaseWorkflows/${releaseWorkflowSn}/releaseStages/${releaseStageSn}:execute`;
    const response = await yunxiaoRequest(
      url,
      {
        method: 'POST',
        body: execution,
      }
    );
    return ExecuteChangeRequestReleaseStageResponseSchema.parse(response);
  } catch (error) {
    throw error;
  }
}

/**
 * Cancel execution release stage
 */
export async function cancelExecutionReleaseStage(params: CancelExecutionReleaseStageRequest): Promise<CancelExecutionReleaseStageResponse> {
  const { organizationId, appName, releaseWorkflowSn, releaseStageSn, executionNumber } = params;
  const finalOrgId = await resolveOrganizationId(organizationId);
  
  try {
    const url = isRegionEdition()
      ? `/oapi/v1/appstack/apps/${appName}/releaseWorkflows/${releaseWorkflowSn}/releaseStages/${releaseStageSn}/executions/${executionNumber}:cancel`
      : `/oapi/v1/appstack/organizations/${finalOrgId}/apps/${appName}/releaseWorkflows/${releaseWorkflowSn}/releaseStages/${releaseStageSn}/executions/${executionNumber}:cancel`;
    const response = await yunxiaoRequest(
      url,
      {
        method: 'POST',
      }
    );
    return CancelExecutionReleaseStageResponseSchema.parse(response);
  } catch (error) {
    throw error;
  }
}

/**
 * Retry change request stage pipeline
 */
export async function retryChangeRequestStagePipeline(params: RetryChangeRequestStagePipelineRequest): Promise<RetryChangeRequestStagePipelineResponse> {
  const { organizationId, appName, releaseWorkflowSn, releaseStageSn, executionNumber } = params;
  const finalOrgId = await resolveOrganizationId(organizationId);
  
  try {
    const url = isRegionEdition()
      ? `/oapi/v1/appstack/apps/${appName}/releaseWorkflows/${releaseWorkflowSn}/releaseStages/${releaseStageSn}/executions/${executionNumber}:retry`
      : `/oapi/v1/appstack/organizations/${finalOrgId}/apps/${appName}/releaseWorkflows/${releaseWorkflowSn}/releaseStages/${releaseStageSn}/executions/${executionNumber}:retry`;
    const response = await yunxiaoRequest(
      url,
      {
        method: 'POST',
      }
    );
    return RetryChangeRequestStagePipelineResponseSchema.parse(response);
  } catch (error) {
    throw error;
  }
}

/**
 * Skip change request stage pipeline
 */
export async function skipChangeRequestStagePipeline(params: SkipChangeRequestStagePipelineRequest): Promise<SkipChangeRequestStagePipelineResponse> {
  const { organizationId, appName, releaseWorkflowSn, releaseStageSn, executionNumber } = params;
  const finalOrgId = await resolveOrganizationId(organizationId);
  
  try {
    const url = isRegionEdition()
      ? `/oapi/v1/appstack/apps/${appName}/releaseWorkflows/${releaseWorkflowSn}/releaseStages/${releaseStageSn}/executions/${executionNumber}:skip`
      : `/oapi/v1/appstack/organizations/${finalOrgId}/apps/${appName}/releaseWorkflows/${releaseWorkflowSn}/releaseStages/${releaseStageSn}/executions/${executionNumber}:skip`;
    const response = await yunxiaoRequest(
      url,
      {
        method: 'POST',
      }
    );
    return SkipChangeRequestStagePipelineResponseSchema.parse(response);
  } catch (error) {
    throw error;
  }
}

// ========== Additional Application Level Release Workflow APIs ==========

// Schema for ReleaseStageInstanceIntegratedMetadataVO (simplified)
export const ReleaseStageInstanceIntegratedMetadataVOSchema = z.object({
  changeRequestSn: z.string().optional().describe("变更请求标识"),
  commitId: z.string().optional().describe("提交ID"),
  commitMessage: z.string().optional().describe("提交信息"),
  gmtCreate: z.string().optional().describe("创建时间"),
});

// Schema for ListAppReleaseStageExecutionIntegratedMetadata API
export const ListAppReleaseStageExecutionIntegratedMetadataRequestSchema = z.object({
  organizationId: z.string().describe("组织ID"),
  appName: z.string().describe("应用名"),
  releaseWorkflowSn: z.string().describe("发布流程唯一序列号"),
  releaseStageSn: z.string().describe("发布流程阶段唯一序列号"),
  executionNumber: z.string().describe("研发阶段的执行记录编号"),
});

export const ListAppReleaseStageExecutionIntegratedMetadataResponseSchema = z.array(ReleaseStageInstanceIntegratedMetadataVOSchema);

// Schema for GetPipelineRunResponse (simplified)
export const GetPipelineRunResponseSchema = z.object({
  pipelineId: z.number().optional().describe("流水线ID"),
  pipelineRunId: z.number().optional().describe("流水线运行ID"),
  jobs: z.array(z.object({
    id: z.string().optional().describe("任务ID"),
    name: z.string().optional().describe("任务名称"),
    state: z.string().optional().describe("任务状态"),
  })).optional().describe("任务列表"),
});

// Schema for GetReleaseStagePipelineRun API
export const GetReleaseStagePipelineRunRequestSchema = z.object({
  organizationId: z.string().describe("组织ID"),
  appName: z.string().describe("应用名"),
  releaseWorkflowSn: z.string().describe("发布流程唯一序列号"),
  releaseStageSn: z.string().describe("发布流程阶段唯一序列号"),
  executionNumber: z.string().describe("发布流程阶执行序号"),
});

export const GetReleaseStagePipelineRunResponseSchema = GetPipelineRunResponseSchema;

// Schema for PassPipelineValidateResponse (simplified)
export const PassPipelineValidateResponseSchema = z.object({
  success: z.boolean().optional().describe("是否成功"),
  message: z.string().optional().describe("消息"),
});

// Schema for PassReleaseStagePipelineValidate API
export const PassReleaseStagePipelineValidateRequestSchema = z.object({
  organizationId: z.string().describe("组织ID"),
  appName: z.string().describe("应用名"),
  releaseWorkflowSn: z.string().describe("发布流程唯一序列号"),
  releaseStageSn: z.string().describe("发布流程阶段唯一序列号"),
  executionNumber: z.string().describe("发布流程阶执行序号"),
  jobId: z.string().describe("任务ID"),
});

export const PassReleaseStagePipelineValidateResponseSchema = PassPipelineValidateResponseSchema;

// Schema for RefusePipelineValidateResponse (simplified)
export const RefusePipelineValidateResponseSchema = z.object({
  success: z.boolean().optional().describe("是否成功"),
  message: z.string().optional().describe("消息"),
});

// Schema for RefuseReleaseStagePipelineValidate API
export const RefuseReleaseStagePipelineValidateRequestSchema = z.object({
  organizationId: z.string().describe("组织ID"),
  appName: z.string().describe("应用名"),
  releaseWorkflowSn: z.string().describe("研发流程唯一序列号"),
  releaseStageSn: z.string().describe("研发流程阶段唯一序列号"),
  executionNumber: z.string().describe("研发流程阶执行序号"),
  jobId: z.string().describe("任务ID"),
});

export const RefuseReleaseStagePipelineValidateResponseSchema = RefusePipelineValidateResponseSchema;

// Schema for ReleaseStageExecutionPipelineJobLogResponse (simplified)
export const ReleaseStageExecutionPipelineJobLogResponseSchema = z.object({
  log: z.string().optional().describe("日志内容"),
  hasMore: z.boolean().optional().describe("是否有更多日志"),
});

// Schema for GetAppReleaseStageExecutionPipelineJobLog API
export const GetAppReleaseStageExecutionPipelineJobLogRequestSchema = z.object({
  organizationId: z.string().describe("组织ID"),
  appName: z.string().describe("应用名"),
  releaseWorkflowSn: z.string().describe("发布流程唯一序列号"),
  releaseStageSn: z.string().describe("发布流程阶段唯一序列号"),
  executionNumber: z.string().describe("研发阶段的执行记录编号"),
  jobId: z.string().describe("任务ID，可通过GetReleaseStagePipelineRun接口获取任务ID"),
});

export const GetAppReleaseStageExecutionPipelineJobLogResponseSchema = ReleaseStageExecutionPipelineJobLogResponseSchema;

// Export types
export type ListAppReleaseStageExecutionIntegratedMetadataRequest = z.infer<typeof ListAppReleaseStageExecutionIntegratedMetadataRequestSchema>;
export type ListAppReleaseStageExecutionIntegratedMetadataResponse = z.infer<typeof ListAppReleaseStageExecutionIntegratedMetadataResponseSchema>;
export type GetReleaseStagePipelineRunRequest = z.infer<typeof GetReleaseStagePipelineRunRequestSchema>;
export type GetReleaseStagePipelineRunResponse = z.infer<typeof GetReleaseStagePipelineRunResponseSchema>;
export type PassReleaseStagePipelineValidateRequest = z.infer<typeof PassReleaseStagePipelineValidateRequestSchema>;
export type PassReleaseStagePipelineValidateResponse = z.infer<typeof PassReleaseStagePipelineValidateResponseSchema>;
export type RefuseReleaseStagePipelineValidateRequest = z.infer<typeof RefuseReleaseStagePipelineValidateRequestSchema>;
export type RefuseReleaseStagePipelineValidateResponse = z.infer<typeof RefuseReleaseStagePipelineValidateResponseSchema>;
export type GetAppReleaseStageExecutionPipelineJobLogRequest = z.infer<typeof GetAppReleaseStageExecutionPipelineJobLogRequestSchema>;
export type GetAppReleaseStageExecutionPipelineJobLogResponse = z.infer<typeof GetAppReleaseStageExecutionPipelineJobLogResponseSchema>;

/**
 * List app release stage execution integrated metadata
 */
export async function listAppReleaseStageExecutionIntegratedMetadata(params: ListAppReleaseStageExecutionIntegratedMetadataRequest): Promise<ListAppReleaseStageExecutionIntegratedMetadataResponse> {
  const { organizationId, appName, releaseWorkflowSn, releaseStageSn, executionNumber } = params;
  const finalOrgId = await resolveOrganizationId(organizationId);
  
  try {
    const url = isRegionEdition()
      ? `/oapi/v1/appstack/apps/${appName}/releaseWorkflows/${releaseWorkflowSn}/releaseStages/${releaseStageSn}/executions/${executionNumber}/integratedMetadata`
      : `/oapi/v1/appstack/organizations/${finalOrgId}/apps/${appName}/releaseWorkflows/${releaseWorkflowSn}/releaseStages/${releaseStageSn}/executions/${executionNumber}/integratedMetadata`;
    const response = await yunxiaoRequest(
      url,
      {
        method: 'GET',
      }
    );
    return ListAppReleaseStageExecutionIntegratedMetadataResponseSchema.parse(response);
  } catch (error) {
    throw error;
  }
}

/**
 * Get release stage pipeline run
 */
export async function getReleaseStagePipelineRun(params: GetReleaseStagePipelineRunRequest): Promise<GetReleaseStagePipelineRunResponse> {
  const { organizationId, appName, releaseWorkflowSn, releaseStageSn, executionNumber } = params;
  const finalOrgId = await resolveOrganizationId(organizationId);
  
  try {
    const url = isRegionEdition()
      ? `/oapi/v1/appstack/apps/${appName}/releaseWorkflows/${releaseWorkflowSn}/releaseStages/${releaseStageSn}/executions/${executionNumber}:getPipelineRun`
      : `/oapi/v1/appstack/organizations/${finalOrgId}/apps/${appName}/releaseWorkflows/${releaseWorkflowSn}/releaseStages/${releaseStageSn}/executions/${executionNumber}:getPipelineRun`;
    const response = await yunxiaoRequest(
      url,
      {
        method: 'GET',
      }
    );
    return GetReleaseStagePipelineRunResponseSchema.parse(response);
  } catch (error) {
    throw error;
  }
}

/**
 * Pass release stage pipeline validate
 */
export async function passReleaseStagePipelineValidate(params: PassReleaseStagePipelineValidateRequest): Promise<PassReleaseStagePipelineValidateResponse> {
  const { organizationId, appName, releaseWorkflowSn, releaseStageSn, executionNumber, jobId } = params;
  const finalOrgId = await resolveOrganizationId(organizationId);
  
  const query: Record<string, string> = {};
  if (jobId) query.jobId = jobId;
  
  try {
    const baseUrl = isRegionEdition()
      ? `/oapi/v1/appstack/apps/${appName}/releaseWorkflows/${releaseWorkflowSn}/releaseStages/${releaseStageSn}/executions/${executionNumber}:passPipelineValidate`
      : `/oapi/v1/appstack/organizations/${finalOrgId}/apps/${appName}/releaseWorkflows/${releaseWorkflowSn}/releaseStages/${releaseStageSn}/executions/${executionNumber}:passPipelineValidate`;
    const url = buildUrl(baseUrl, query);
    const response = await yunxiaoRequest(url, { method: 'POST' });
    return PassReleaseStagePipelineValidateResponseSchema.parse(response);
  } catch (error) {
    throw error;
  }
}

/**
 * Get app release stage execution pipeline job log
 */
export async function getAppReleaseStageExecutionPipelineJobLog(params: GetAppReleaseStageExecutionPipelineJobLogRequest): Promise<GetAppReleaseStageExecutionPipelineJobLogResponse> {
  const { organizationId, appName, releaseWorkflowSn, releaseStageSn, executionNumber, jobId } = params;
  const finalOrgId = await resolveOrganizationId(organizationId);
  
  const query: Record<string, string> = {};
  if (jobId) query.jobId = jobId;
  
  try {
    const baseUrl = isRegionEdition()
      ? `/oapi/v1/appstack/apps/${appName}/releaseWorkflows/${releaseWorkflowSn}/releaseStages/${releaseStageSn}/executions/${executionNumber}:pipelineJobLog`
      : `/oapi/v1/appstack/organizations/${finalOrgId}/apps/${appName}/releaseWorkflows/${releaseWorkflowSn}/releaseStages/${releaseStageSn}/executions/${executionNumber}:pipelineJobLog`;
    const url = buildUrl(baseUrl, query);
    const response = await yunxiaoRequest(url, { method: 'GET' });
    return GetAppReleaseStageExecutionPipelineJobLogResponseSchema.parse(response);
  } catch (error) {
    throw error;
  }
}

/**
 * Refuse release stage pipeline validate
 */
export async function refuseReleaseStagePipelineValidate(params: RefuseReleaseStagePipelineValidateRequest): Promise<RefuseReleaseStagePipelineValidateResponse> {
  const { organizationId, appName, releaseWorkflowSn, releaseStageSn, executionNumber, jobId } = params;
  const finalOrgId = await resolveOrganizationId(organizationId);
  
  const query: Record<string, string> = {};
  if (jobId) query.jobId = jobId;
  
  try {
    const baseUrl = isRegionEdition()
      ? `/oapi/v1/appstack/apps/${appName}/releaseWorkflows/${releaseWorkflowSn}/releaseStages/${releaseStageSn}/executions/${executionNumber}:refusePipelineValidate`
      : `/oapi/v1/appstack/organizations/${finalOrgId}/apps/${appName}/releaseWorkflows/${releaseWorkflowSn}/releaseStages/${releaseStageSn}/executions/${executionNumber}:refusePipelineValidate`;
    const url = buildUrl(baseUrl, query);
    const response = await yunxiaoRequest(url, { method: 'POST' });
    return RefuseReleaseStagePipelineValidateResponseSchema.parse(response);
  } catch (error) {
    throw error;
  }
}