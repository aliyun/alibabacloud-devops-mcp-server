import { z } from 'zod';
import { yunxiaoRequest, isRegionEdition } from '../../common/utils.js';
import { resolveOrganizationId } from '../organization/organization.js';
import { isYunxiaoError } from '../../common/errors.js';

// Schema for TestPlanDTO
export const TestPlanDTOSchema = z.object({
  testPlanIdentifier: z.string().describe("测试计划id"),
  name: z.string().describe("测试计划名称"),
  managers: z.array(z.string()).nullable().optional().describe("测试计划管理员id"),
  gmtCreate: z.union([z.string(), z.number()]).nullable().optional().describe("创建时间（时间戳或ISO字符串）"),
  spaceIdentifier: z.string().nullable().optional().describe("关联项目id"),
});

// Schema for ListTestPlan
export const ListTestPlanRequestSchema = z.object({
  organizationId: z.string().describe("组织ID"),
});

export const ListTestPlanResponseSchema = z.array(TestPlanDTOSchema);

// Schema for MiniUser (reuse from testcases.ts)
// 字段设为可选，因为 API 可能返回空对象或 null，或者字段可能缺失
export const MiniUserSchema = z.object({
  id: z.string().optional().nullable().describe("用户id"),
  name: z.string().optional().nullable().describe("名称"),
}).passthrough(); // 允许额外的字段，处理空对象的情况

// Schema for FieldValue (from testplan.swagger.json)
export const TestPlanFieldValueSchema = z.object({
  fieldFormat: z.string().optional().describe("字段格式"),
  fieldIdentifier: z.string().optional().describe("字段id"),
  fieldClassName: z.string().optional().describe("字段类型"),
  value: z.string().optional().describe("字段值"),
});

// Schema for TestcaseTestResultSummary
export const TestcaseTestResultSummarySchema = z.object({
  identifier: z.string().describe("测试用例 id，测试用例唯一标识"),
  gmtCreate: z.union([z.string(), z.number()]).nullable().optional().describe("测试用例创建时间"),
  subject: z.string().nullable().optional().describe("测试用例标题"),
  // 使用 union 来正确处理 null 值或空对象，.optional() 处理 undefined
  assignedTo: z.union([MiniUserSchema, z.null()]).optional().describe("负责人信息"),
  spaceIdentifier: z.string().nullable().optional().describe("测试用例所属的测试库 id"),
  // customFields 实际返回的是数组，不是单个对象
  customFields: z.array(TestPlanFieldValueSchema).nullable().optional().describe("自定义字段数组"),
  testResultIdentifier: z.string().nullable().optional().describe("测试结果的id"),
  testResultStatus: z.enum(["TODO", "PASS", "FAILURE", "POSTPONE"]).nullable().optional().describe("测试结果的状态"),
  testResultExecutorIdentifier: z.string().nullable().optional().describe("测试计划执行人id"),
  // 使用 union 来正确处理 null 值或空对象，.optional() 处理 undefined
  testResultExecutor: z.union([MiniUserSchema, z.null()]).optional().describe("测试计划执行人对象"),
  testResultGmtCreate: z.union([z.string(), z.number()]).nullable().optional().describe("测试结果创建时间"),
  testResultGmtModified: z.union([z.string(), z.number()]).nullable().optional().describe("测试结果最后创建时间"),
  bugCount: z.number().int().nullable().optional().describe("测试执行结果关联缺陷数量"),
});

// Schema for GetTestResultList
export const GetTestResultListRequestSchema = z.object({
  organizationId: z.string().describe("组织ID"),
  testPlanIdentifier: z.string().describe("测试计划id"),
  directoryIdentifier: z.string().describe("目录id"),
});

export const GetTestResultListResponseSchema = z.array(TestcaseTestResultSummarySchema);

// Schema for UpdateTestResultRequest
export const UpdateTestResultRequestSchema = z.object({
  organizationId: z.string().describe("组织ID"),
  testplanId: z.string().describe("测试计划唯一标识"),
  testcaseId: z.string().describe("测试用例唯一标识"),
  executor: z.string().optional().describe("执行人userId"),
  status: z.enum(["TODO", "PASS", "FAILURE", "POSTPONE"]).optional().describe("状态"),
});

export const UpdateTestResultResponseSchema = z.union([
  z.object({}),
  z.string(),
  z.undefined(),
]).transform(() => ({}));

// Type exports
export type ListTestPlanRequest = z.infer<typeof ListTestPlanRequestSchema>;
export type ListTestPlanResponse = z.infer<typeof ListTestPlanResponseSchema>;
export type GetTestResultListRequest = z.infer<typeof GetTestResultListRequestSchema>;
export type GetTestResultListResponse = z.infer<typeof GetTestResultListResponseSchema>;
export type UpdateTestResultRequest = z.infer<typeof UpdateTestResultRequestSchema>;
export type UpdateTestResultResponse = z.infer<typeof UpdateTestResultResponseSchema>;

// ========== GetTestPlanProgressRate ==========
// Schema for TestPlanProgress (response)
export const TestPlanProgressSchema = z.object({
  paasCount: z.number().int().nullable().optional().describe("通过数量"),
  failureCount: z.number().int().nullable().optional().describe("失败数量"),
  postponeCount: z.number().int().nullable().optional().describe("延后数量"),
  todoCount: z.number().int().nullable().optional().describe("待执行/其他数量"),
}).passthrough();

export const GetTestPlanProgressRequestSchema = z.object({
  organizationId: z.string().describe("组织ID"),
  testPlanIdentifier: z.string().describe("测试计划唯一标识"),
});

export type GetTestPlanProgressRequest = z.infer<typeof GetTestPlanProgressRequestSchema>;
export type TestPlanProgress = z.infer<typeof TestPlanProgressSchema>;

// ========== GetTestPlanResultDirectoryList ==========
// Recursive schema for DirectoryWithCount (self-reference via z.lazy)
type DirectoryWithCount = {
  identifier?: string | null;
  name?: string | null;
  displayName?: string | null;
  spaceIdentifier?: string | null;
  parentIdentifier?: string | null;
  workitemCount?: number | null;
  children?: DirectoryWithCount[] | null;
};
export const DirectoryWithCountSchema: z.ZodType<DirectoryWithCount> = z.lazy(() => z.object({
  identifier: z.string().nullable().optional().describe("目录唯一标识"),
  name: z.string().nullable().optional().describe("目录名称"),
  displayName: z.string().nullable().optional().describe("目录显示名称"),
  spaceIdentifier: z.string().nullable().optional().describe("关联空间标识符"),
  parentIdentifier: z.string().nullable().optional().describe("父目录唯一标识"),
  workitemCount: z.number().int().nullable().optional().describe("目录下的工作项数量（包含子目录）"),
  children: z.array(DirectoryWithCountSchema).nullable().optional().describe("子目录列表"),
}).passthrough());

export const GetTestPlanResultDirectoryListRequestSchema = z.object({
  organizationId: z.string().describe("组织ID"),
  testPlanIdentifier: z.string().describe("测试计划唯一标识"),
});

export const GetTestPlanResultDirectoryListResponseSchema = z.record(z.array(DirectoryWithCountSchema));

export type GetTestPlanResultDirectoryListRequest = z.infer<typeof GetTestPlanResultDirectoryListRequestSchema>;
export type GetTestPlanResultDirectoryListResponse = z.infer<typeof GetTestPlanResultDirectoryListResponseSchema>;

// ========== ListTestRepoTags ==========
export const TestRepoLabelSchema = z.object({
  id: z.string().nullable().optional().describe("标签唯一标识（业务 identifier）"),
  name: z.string().nullable().optional().describe("标签名称"),
  color: z.string().nullable().optional().describe("颜色，如 #49AEAC"),
}).passthrough();

export const ListTestRepoTagsRequestSchema = z.object({
  organizationId: z.string().describe("组织ID"),
  id: z.string().describe("测试用例库唯一标识"),
  page: z.number().int().min(1).optional().describe("页码，默认 1"),
  perPage: z.number().int().min(1).max(100).optional().describe("每页条数，默认 20，最大 100"),
  q: z.string().optional().describe("按名称关键词过滤"),
});

export const ListTestRepoTagsResponseSchema = z.array(TestRepoLabelSchema);

export type ListTestRepoTagsRequest = z.infer<typeof ListTestRepoTagsRequestSchema>;
export type ListTestRepoTagsResponse = z.infer<typeof ListTestRepoTagsResponseSchema>;

/**
 * 获取测试计划列表
 */
export async function listTestPlan(params: ListTestPlanRequest): Promise<ListTestPlanResponse> {
  const { organizationId } = params;
  const finalOrgId = await resolveOrganizationId(organizationId);
  const url = isRegionEdition()
    ? `/oapi/v1/projex/testPlan/list`
    : `/oapi/v1/projex/organizations/${finalOrgId}/testPlan/list`;
  const response = await yunxiaoRequest(url, { method: 'POST', body: {} });
  return ListTestPlanResponseSchema.parse(response);
}

/**
 * 获取测试计划中测试用例列表
 * 如果第一个 API 返回 404，则自动回退到第二个 API
 */
export async function getTestResultList(params: GetTestResultListRequest): Promise<GetTestResultListResponse> {
  const { organizationId, testPlanIdentifier, directoryIdentifier } = params;
  const finalOrgId = await resolveOrganizationId(organizationId);
  
  // 首先尝试使用 projex API
  try {
    const url = isRegionEdition()
      ? `/oapi/v1/projex/${testPlanIdentifier}/result/list/${directoryIdentifier}`
      : `/oapi/v1/projex/organizations/${finalOrgId}/${testPlanIdentifier}/result/list/${directoryIdentifier}`;
    const response = await yunxiaoRequest(url, { method: 'POST', body: {} });
    return GetTestResultListResponseSchema.parse(response);
  } catch (error) {
    // 如果是 404 错误，尝试使用 testhub API
    if (isYunxiaoError(error) && error.status === 404) {
      const url = isRegionEdition()
        ? `/oapi/v1/testhub/${testPlanIdentifier}/result/list/${directoryIdentifier}`
        : `/oapi/v1/testhub/organizations/${finalOrgId}/${testPlanIdentifier}/result/list/${directoryIdentifier}`;
      const response = await yunxiaoRequest(url, { method: 'POST', body: {} });
      return GetTestResultListResponseSchema.parse(response);
    }
    // 其他错误直接抛出
    throw error;
  }
}

/**
 * 更新测试结果
 */
export async function updateTestResult(params: UpdateTestResultRequest): Promise<UpdateTestResultResponse> {
  const { organizationId, testplanId, testcaseId, executor, status } = params;
  const finalOrgId = await resolveOrganizationId(organizationId);
  const url = isRegionEdition()
    ? `/oapi/v1/testhub/testPlans/${testplanId}/testcases/${testcaseId}`
    : `/oapi/v1/testhub/organizations/${finalOrgId}/testPlans/${testplanId}/testcases/${testcaseId}`;
  const body: any = {};
  if (executor !== undefined) {
    body.executor = executor;
  }
  if (status !== undefined) {
    body.status = status;
  }
  const response = await yunxiaoRequest(url, { method: 'PUT', body });
  return UpdateTestResultResponseSchema.parse(response);
}

/**
 * 获取测试计划用例执行进度统计
 */
export async function getTestPlanProgress(params: GetTestPlanProgressRequest): Promise<TestPlanProgress> {
  const { organizationId, testPlanIdentifier } = params;
  const finalOrgId = await resolveOrganizationId(organizationId);
  const url = isRegionEdition()
    ? `/oapi/v1/testhub/${testPlanIdentifier}/progressRate`
    : `/oapi/v1/testhub/organizations/${finalOrgId}/${testPlanIdentifier}/progressRate`;
  const response = await yunxiaoRequest(url, { method: 'GET' });
  return TestPlanProgressSchema.parse(response);
}

/**
 * 获取测试计划结果目录列表
 * 返回用例库名称 -> 目录列表的映射
 */
export async function getTestPlanResultDirectoryList(
  params: GetTestPlanResultDirectoryListRequest
): Promise<GetTestPlanResultDirectoryListResponse> {
  const { organizationId, testPlanIdentifier } = params;
  const finalOrgId = await resolveOrganizationId(organizationId);
  const url = isRegionEdition()
    ? `/oapi/v1/testhub/${testPlanIdentifier}/result/directory/list`
    : `/oapi/v1/testhub/organizations/${finalOrgId}/${testPlanIdentifier}/result/directory/list`;
  const response = await yunxiaoRequest(url, { method: 'GET' });
  return GetTestPlanResultDirectoryListResponseSchema.parse(response);
}

/**
 * 获取测试用例库标签列表
 */
export async function listTestRepoTags(params: ListTestRepoTagsRequest): Promise<ListTestRepoTagsResponse> {
  const { organizationId, id, page, perPage, q } = params;
  const finalOrgId = await resolveOrganizationId(organizationId);
  const basePath = isRegionEdition()
    ? `/oapi/v1/testhub/testRepo/${id}/tags`
    : `/oapi/v1/testhub/organizations/${finalOrgId}/testRepo/${id}/tags`;
  const queryParts: string[] = [];
  if (page !== undefined) queryParts.push(`page=${encodeURIComponent(String(page))}`);
  if (perPage !== undefined) queryParts.push(`perPage=${encodeURIComponent(String(perPage))}`);
  if (q !== undefined && q !== '') queryParts.push(`q=${encodeURIComponent(q)}`);
  const url = queryParts.length > 0 ? `${basePath}?${queryParts.join('&')}` : basePath;
  const response = await yunxiaoRequest(url, { method: 'GET' });
  return ListTestRepoTagsResponseSchema.parse(response);
}

// ========== ListTestRepos ==========
export const TestRepoDTOSchema = z.object({
  testRepoIdentifier: z.string().nullable().optional().describe("用例库唯一标识"),
  name: z.string().nullable().optional().describe("用例库名称"),
  description: z.string().nullable().optional().describe("描述"),
  icon: z.string().nullable().optional().describe("图标"),
  scope: z.string().nullable().optional().describe("可见范围（public / private）"),
  creatorIdentifier: z.string().nullable().optional().describe("创建者 identifier"),
  adminIdentifiers: z.array(z.string()).nullable().optional().describe("管理员 identifier 列表"),
  gmtCreate: z.union([z.string(), z.number()]).nullable().optional().describe("创建时间"),
}).passthrough();

export const ListTestReposRequestSchema = z.object({
  organizationId: z.string().describe("组织ID"),
  page: z.number().int().min(1).optional().describe("分页参数，第几页，默认为 1"),
  perPage: z.number().int().min(1).max(100).optional().describe("分页参数，每页大小，最大 100，默认为 20"),
  name: z.string().optional().describe("用例库名称模糊匹配，不传则不限制"),
});

export const ListTestReposResponseSchema = z.array(TestRepoDTOSchema);

export type ListTestReposRequest = z.infer<typeof ListTestReposRequestSchema>;
export type ListTestReposResponse = z.infer<typeof ListTestReposResponseSchema>;

/**
 * 获取用例库列表
 */
export async function listTestRepos(params: ListTestReposRequest): Promise<ListTestReposResponse> {
  const { organizationId, page, perPage, name } = params;
  const finalOrgId = await resolveOrganizationId(organizationId);
  const basePath = isRegionEdition()
    ? `/oapi/v1/testhub/testRepo/list`
    : `/oapi/v1/testhub/organizations/${finalOrgId}/testRepo/list`;
  const queryParts: string[] = [];
  if (page !== undefined) queryParts.push(`page=${encodeURIComponent(String(page))}`);
  if (perPage !== undefined) queryParts.push(`perPage=${encodeURIComponent(String(perPage))}`);
  if (name !== undefined && name !== '') queryParts.push(`name=${encodeURIComponent(name)}`);
  const url = queryParts.length > 0 ? `${basePath}?${queryParts.join('&')}` : basePath;
  const response = await yunxiaoRequest(url, { method: 'GET' });
  return ListTestReposResponseSchema.parse(response);
}
