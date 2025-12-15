import { z } from 'zod';
import { yunxiaoRequest } from '../../common/utils.js';
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

/**
 * 获取测试计划列表
 */
export async function listTestPlan(params: ListTestPlanRequest): Promise<ListTestPlanResponse> {
  const { organizationId } = params;
  const response = await yunxiaoRequest(
    `/oapi/v1/projex/organizations/${organizationId}/testPlan/list`,
    { method: 'POST', body: {} }
  );
  return ListTestPlanResponseSchema.parse(response);
}

/**
 * 获取测试计划中测试用例列表
 * 如果第一个 API 返回 404，则自动回退到第二个 API
 */
export async function getTestResultList(params: GetTestResultListRequest): Promise<GetTestResultListResponse> {
  const { organizationId, testPlanIdentifier, directoryIdentifier } = params;
  
  // 首先尝试使用 projex API
  try {
    const response = await yunxiaoRequest(
      `/oapi/v1/projex/organizations/${organizationId}/${testPlanIdentifier}/result/list/${directoryIdentifier}`,
      { method: 'POST', body: {} }
    );
    return GetTestResultListResponseSchema.parse(response);
  } catch (error) {
    // 如果是 404 错误，尝试使用 testhub API
    if (isYunxiaoError(error) && error.status === 404) {
      const response = await yunxiaoRequest(
        `/oapi/v1/testhub/organizations/${organizationId}/${testPlanIdentifier}/result/list/${directoryIdentifier}`,
        { method: 'POST', body: {} }
      );
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
  const body: any = {};
  if (executor !== undefined) {
    body.executor = executor;
  }
  if (status !== undefined) {
    body.status = status;
  }
  const response = await yunxiaoRequest(
    `/oapi/v1/testhub/organizations/${organizationId}/testPlans/${testplanId}/testcases/${testcaseId}`,
    { method: 'PUT', body }
  );
  return UpdateTestResultResponseSchema.parse(response);
}

