import { z } from 'zod';
import { yunxiaoRequest, buildUrl, isRegionEdition } from '../../common/utils.js';
import { resolveOrganizationId } from '../organization/organization.js';

// Define the referenced schemas based on their definitions in appstack.swagger.json
const AuditItemSchema = z.object({
  auditOrderSn: z.string().optional(),
  refSn: z.string(),
  refType: z.enum(["CR"]),
  state: z.string(),
  type: z.enum(["CODE_SPLC", "CODE_REVIEW"]),
}).describe("审批项");

const StageMetadataCommitVOSchema = z.object({
  committedDate: z.string().describe("提交时间"),
  committerId: z.string().describe("提交人"),
  id: z.string().describe("变更执行记录版本ID"),
}).describe("变更执行记录版本");

const ChangeRequestExecutionVOSchema = z.object({
  commit: StageMetadataCommitVOSchema.describe("变更执行记录版本"),
  runNumber: z.string().describe("运行序号"),
  state: z.enum(["RUNNING", "SUCCESS", "FAILED", "CANCELED", "UNKNOWN"]).describe("阶段执行状态"),
}).describe("变更执行记录");

const CodeReviewAuditItemSchema = AuditItemSchema.extend({
  auditOrderSn: z.string().optional().describe("审批单编号"),
  commitId: z.string().optional().describe("代码提交 ID"),
  crId: z.string().describe("变更 ID"),
  operatorId: z.string().describe("代码提交人 ID"),
  refSn: z.string().optional(),
  refType: z.string().optional(),
  sourceVersion: z.string().describe("代码来源分支版本"),
  state: z.string().describe("审批状态"),
  targetVersion: z.string().describe("代码目标分支版本"),
  type: z.string().describe("审批类型"),
  url: z.string().optional().describe("代码提交 URL"),
}).describe("代码审核审批项");

const CodeSplcAuditItemSchema = AuditItemSchema.extend({
  auditOrderSn: z.string().optional().describe("审批单编号"),
  commitDate: z.string().describe("提交时间"),
  commitEmployeeId: z.string().describe("提交人"),
  commitMsg: z.string().optional().describe("提交信息"),
  crId: z.string().describe("变更 ID"),
  refSn: z.string().optional(),
  refType: z.string().optional(),
  state: z.string().describe("审批状态"),
  trunkVersion: z.string().describe("主干版本"),
  type: z.string().describe("审批类型"),
  url: z.string().optional().describe("提交地址"),
  version: z.string().describe("变更版本"),
}).describe("代码扫描审批项");

// Schema for the CreateChangeRequest API
export const CreateChangeRequestRequestSchema = z.object({
  organizationId: z.string().describe("组织ID"),
  appName: z.string().describe("应用名"),
  appCodeRepoSn: z.string().describe("应用代码仓库标识符"),
  autoDeleteBranchWhenEnd: z.boolean().describe("变更结束时候是否自动删除分支"),
  branchName: z.string().describe("应用代码分支名称"),
  createBranch: z.boolean().describe("是否创建分支"),
  ownerAccountId: z.string().optional().describe("变更负责人账号"),
  ownerId: z.string().optional().describe("变更负责人"),
  title: z.string().describe("变更标题"),
});

export const CreateChangeRequestResponseSchema = z.object({
  appCodeRepoSn: z.string().optional().describe("代码仓库唯一标识"),
  appName: z.string().describe("应用名"),
  autoDeleteBranchWhenEnd: z.boolean().describe("结束后是否自动删除分支"),
  branch: z.string().optional().describe("变更代码分支"),
  creatorAccountId: z.string().optional().describe("创建者的阿里云账号pk"),
  creatorId: z.string().optional().describe("创建者者云效id"),
  gmtCreate: z.string().describe("创建时间"),
  gmtModified: z.string().describe("修改时间"),
  name: z.string().optional().describe("变更名称"),
  originBranch: z.string().optional().describe("代码分支源分支"),
  originBranchRevisionSha: z.string().optional().describe("代码分支源分支版本"),
  ownerAccountId: z.string().optional().describe("拥有者的阿里云账号pk"),
  ownerId: z.string().optional().describe("拥有者ID"),
  sn: z.string().describe("唯一标识符"),
  state: z.string().describe("状态"),
  type: z.string().describe("变更类型"),
});

// Schema for the GetChangeRequestAuditItems API
export const GetChangeRequestAuditItemsRequestSchema = z.object({
  organizationId: z.string().describe("组织ID"),
  appName: z.string().describe("应用名"),
  sn: z.string().describe("变更标识符"),
  refType: z.string().describe("关联类型"),
});

export const GetChangeRequestAuditItemsResponseSchema = z.array(
  z.union([
    CodeReviewAuditItemSchema,
    CodeSplcAuditItemSchema
  ])
);

// Schema for the ListChangeRequestExecutions API
export const ListChangeRequestExecutionsRequestSchema = z.object({
  organizationId: z.string().describe("组织ID"),
  appName: z.string().describe("应用名"),
  sn: z.string().describe("变更标识符"),
  perPage: z.number().min(1).max(100).default(20).optional().describe("分页尺寸参数，决定一页最多返回多少对象"),
  page: z.number().optional().describe("页面分页时使用，用于获取下一页内容，默认第1页"),
  orderBy: z.enum(["id", "gmtCreate"]).optional().describe("分页排序属性，决定根据何种属性进行记录排序；推荐在实现严格遍历时，使用 id 属性"),
  sort: z.enum(["asc", "desc"]).optional().describe("分页排序升降序，asc 为升序，desc 为降序；推荐在实现严格遍历时，使用升序"),
  releaseWorkflowSn: z.string().describe("流程唯一标识"),
  releaseStageSn: z.string().describe("阶段唯一标识"),
});

export const ListChangeRequestExecutionsResponseSchema = z.object({
  current: z.number().describe("当前页数"),
  pageSize: z.number().describe("每页大小"),
  pages: z.number().describe("总页数"),
  records: z.array(ChangeRequestExecutionVOSchema).describe("数据列表"),
  total: z.number().describe("总数"),
});

// Schema for the ListChangeRequestWorkItems API
export const ListChangeRequestWorkItemsRequestSchema = z.object({
  organizationId: z.string().describe("组织ID"),
  appName: z.string().describe("应用名"),
  sn: z.string().describe("变更标识符"),
});

export const ListChangeRequestWorkItemsResponseSchema = z.array(z.object({
  description: z.string().optional().describe("变更工作项描述"),
  name: z.string().optional().describe("变更工作项名称"),
  sn: z.string().optional().describe("变更工作项唯一标识"),
  type: z.string().optional().describe("变更工作项类型"),
  value: z.string().optional().describe("变更工作项内容"),
}));

// Schema for the CancelChangeRequest API
export const CancelChangeRequestRequestSchema = z.object({
  organizationId: z.string().describe("组织ID"),
  appName: z.string().describe("应用名"),
  sn: z.string().describe("变更标识符"),
});

export const CancelChangeRequestResponseSchema = z.boolean().describe("调用是否成功");

// Schema for the CloseChangeRequest API
export const CloseChangeRequestRequestSchema = z.object({
  organizationId: z.string().describe("组织ID"),
  appName: z.string().describe("应用名"),
  sn: z.string().describe("变更标识符"),
});

export const CloseChangeRequestResponseSchema = z.boolean().describe("调用是否成功");

export type CreateChangeRequestRequest = z.infer<typeof CreateChangeRequestRequestSchema>;
export type CreateChangeRequestResponse = z.infer<typeof CreateChangeRequestResponseSchema>;
export type GetChangeRequestAuditItemsRequest = z.infer<typeof GetChangeRequestAuditItemsRequestSchema>;
export type GetChangeRequestAuditItemsResponse = z.infer<typeof GetChangeRequestAuditItemsResponseSchema>;
export type ListChangeRequestExecutionsRequest = z.infer<typeof ListChangeRequestExecutionsRequestSchema>;
export type ListChangeRequestExecutionsResponse = z.infer<typeof ListChangeRequestExecutionsResponseSchema>;
export type ListChangeRequestWorkItemsRequest = z.infer<typeof ListChangeRequestWorkItemsRequestSchema>;
export type ListChangeRequestWorkItemsResponse = z.infer<typeof ListChangeRequestWorkItemsResponseSchema>;
export type CancelChangeRequestRequest = z.infer<typeof CancelChangeRequestRequestSchema>;
export type CancelChangeRequestResponse = z.infer<typeof CancelChangeRequestResponseSchema>;
export type CloseChangeRequestRequest = z.infer<typeof CloseChangeRequestRequestSchema>;
export type CloseChangeRequestResponse = z.infer<typeof CloseChangeRequestResponseSchema>;

/**
 * Create a change request
 * 
 * @param params - The request parameters
 * @returns The created change request
 */
export async function createChangeRequest(params: CreateChangeRequestRequest): Promise<CreateChangeRequestResponse> {
  const { organizationId, appName, ...body } = params;
  const finalOrgId = await resolveOrganizationId(organizationId);
  
  try {
    const url = isRegionEdition()
      ? `/oapi/v1/appstack/apps/${appName}/changeRequests`
      : `/oapi/v1/appstack/organizations/${finalOrgId}/apps/${appName}/changeRequests`;
    const response = await yunxiaoRequest(
      url,
      {
        method: 'POST',
        body: body,
      }
    );
    return CreateChangeRequestResponseSchema.parse(response);
  } catch (error) {
    throw error;
  }
}

/**
 * Get audit items for a change request
 * 
 * @param params - The request parameters
 * @returns The list of audit items
 */
export async function getChangeRequestAuditItems(params: GetChangeRequestAuditItemsRequest): Promise<GetChangeRequestAuditItemsResponse> {
  const { organizationId, appName, sn, refType } = params;
  const finalOrgId = await resolveOrganizationId(organizationId);
  
  // Build query string properly
  const query: Record<string, string | number> = {};
  if (refType) query.refType = refType;
  
  try {
    const baseUrl = isRegionEdition()
      ? `/oapi/v1/appstack/apps/${appName}/changeRequests/${sn}/auditItems`
      : `/oapi/v1/appstack/organizations/${finalOrgId}/apps/${appName}/changeRequests/${sn}/auditItems`;
    const url = buildUrl(baseUrl, query);
    
    const response = await yunxiaoRequest(
      url,
      {
        method: 'GET',
      }
    );
    return GetChangeRequestAuditItemsResponseSchema.parse(response);
  } catch (error) {
    throw error;
  }
}

/**
 * List change request executions
 * 
 * @param params - The request parameters
 * @returns The list of change request executions
 */
export async function listChangeRequestExecutions(params: ListChangeRequestExecutionsRequest): Promise<ListChangeRequestExecutionsResponse> {
  const { organizationId, appName, sn, perPage, page, orderBy, sort, releaseWorkflowSn, releaseStageSn } = params;
  const finalOrgId = await resolveOrganizationId(organizationId);
  
  // Build query string properly
  const query: Record<string, string | number> = {};
  if (perPage !== undefined) query.perPage = perPage;
  if (page !== undefined) query.page = page;
  if (orderBy) query.orderBy = orderBy;
  if (sort) query.sort = sort;
  if (releaseWorkflowSn) query.releaseWorkflowSn = releaseWorkflowSn;
  if (releaseStageSn) query.releaseStageSn = releaseStageSn;
  
  try {
    const baseUrl = isRegionEdition()
      ? `/oapi/v1/appstack/apps/${appName}/changeRequests/${sn}/executions`
      : `/oapi/v1/appstack/organizations/${finalOrgId}/apps/${appName}/changeRequests/${sn}/executions`;
    const url = buildUrl(baseUrl, query);
    
    const response = await yunxiaoRequest(
      url,
      {
        method: 'GET',
      }
    );
    return ListChangeRequestExecutionsResponseSchema.parse(response);
  } catch (error) {
    throw error;
  }
}

/**
 * List work items for a change request
 * 
 * @param params - The request parameters
 * @returns The list of work items
 */
export async function listChangeRequestWorkItems(params: ListChangeRequestWorkItemsRequest): Promise<ListChangeRequestWorkItemsResponse> {
  const { organizationId, appName, sn } = params;
  const finalOrgId = await resolveOrganizationId(organizationId);
  
  try {
    const url = isRegionEdition()
      ? `/oapi/v1/appstack/apps/${appName}/changeRequests/${sn}/workItems`
      : `/oapi/v1/appstack/organizations/${finalOrgId}/apps/${appName}/changeRequests/${sn}/workItems`;
    const response = await yunxiaoRequest(
      url,
      {
        method: 'GET',
      }
    );
    return ListChangeRequestWorkItemsResponseSchema.parse(response);
  } catch (error) {
    throw error;
  }
}

/**
 * Cancel a change request
 * 
 * @param params - The request parameters
 * @returns Whether the cancellation was successful
 */
export async function cancelChangeRequest(params: CancelChangeRequestRequest): Promise<CancelChangeRequestResponse> {
  const { organizationId, appName, sn } = params;
  const finalOrgId = await resolveOrganizationId(organizationId);
  
  try {
    const url = isRegionEdition()
      ? `/oapi/v1/appstack/apps/${appName}/changeRequests/${sn}:cancel`
      : `/oapi/v1/appstack/organizations/${finalOrgId}/apps/${appName}/changeRequests/${sn}:cancel`;
    const response = await yunxiaoRequest(
      url,
      {
        method: 'POST',
      }
    );
    return CancelChangeRequestResponseSchema.parse(response);
  } catch (error) {
    throw error;
  }
}

/**
 * Close a change request
 * 
 * @param params - The request parameters
 * @returns Whether the close operation was successful
 */
export async function closeChangeRequest(params: CloseChangeRequestRequest): Promise<CloseChangeRequestResponse> {
  const { organizationId, appName, sn } = params;
  const finalOrgId = await resolveOrganizationId(organizationId);
  
  try {
    const url = isRegionEdition()
      ? `/oapi/v1/appstack/apps/${appName}/changeRequests/${sn}:finish`
      : `/oapi/v1/appstack/organizations/${finalOrgId}/apps/${appName}/changeRequests/${sn}:finish`;
    const response = await yunxiaoRequest(
      url,
      {
        method: 'POST',
      }
    );
    return CloseChangeRequestResponseSchema.parse(response);
  } catch (error) {
    throw error;
  }
}