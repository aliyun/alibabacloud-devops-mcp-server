import { z } from 'zod';
import { yunxiaoRequest } from '../../common/utils.js';

// Schema for TestcaseDirectoryDTO
export const TestcaseDirectoryDTOSchema = z.object({
  id: z.string().describe("目录id"),
  name: z.string().describe("目录名称"),
  parentId: z.string().nullable().optional().describe("父目录id"),
});

// Schema for CreateTestcaseDirectoryRequest
export const CreateTestcaseDirectoryRequestSchema = z.object({
  organizationId: z.string().describe("组织ID"),
  testRepoId: z.string().describe("用例库唯一标识"),
  name: z.string().describe("目录名称"),
  parentIdentifier: z.string().optional().describe("父目录ID"),
});

export const CreateTestcaseDirectoryResponseSchema = TestcaseDirectoryDTOSchema;

// Schema for ListDirectories
export const ListDirectoriesRequestSchema = z.object({
  organizationId: z.string().describe("组织ID"),
  testRepoId: z.string().describe("用例库唯一标识"),
});

export const ListDirectoriesResponseSchema = z.array(TestcaseDirectoryDTOSchema);

// Schema for WorkitemSimpleFiled
export const WorkitemSimpleFiledSchema = z.object({
  id: z.string().describe("字段id"),
  name: z.string().describe("名称"),
  type: z.string().describe("字段类型"),
  format: z.string().nullable().optional().describe("字段格式"),
  required: z.boolean().optional().describe("是否必填"),
  showWhenCreate: z.boolean().optional().describe("创建时是否展示"),
  description: z.string().nullable().optional().describe("描述"),
  defaultValue: z.string().nullable().optional().describe("默认值"),
  options: z.array(z.object({
    id: z.string().optional(),
    value: z.string().optional(),
    displayValue: z.string().optional(),
    valueEn: z.string().optional(),
  })).optional().describe("可选值"),
  cascadingOptions: z.any().nullable().optional().describe("层级字段的待选择"),
});

// Schema for GetTestcaseFieldConfig
export const GetTestcaseFieldConfigRequestSchema = z.object({
  organizationId: z.string().describe("组织ID"),
  testRepoId: z.string().describe("用例库唯一标识"),
});

export const GetTestcaseFieldConfigResponseSchema = z.array(WorkitemSimpleFiledSchema);

// Schema for TestStep
export const TestStepSchema = z.object({
  step: z.string().describe("测试步骤"),
  expected: z.string().describe("期望结果"),
});

// Schema for TestStepsDTO
export const TestStepsDTOSchema = z.object({
  contentType: z.enum(["TABLE", "TEXT"]).describe("内容格式"),
  stepContent: z.string().nullable().optional().describe("当contentType为TEXT时，该字段描述了测试步骤的内容"),
  expectedResult: z.string().nullable().optional().describe("当contentType为TEXT时，该字段描述了期望结果的内容"),
  content: z.array(TestStepSchema).nullable().optional().describe("当contentType为TABLE时，该字段描述了测试步骤的内容；当contentType为TEXT时，该字段为null"),
});

// Schema for CreateTestcaseRequest
export const CreateTestcaseRequestSchema = z.object({
  organizationId: z.string().describe("组织ID"),
  testRepoId: z.string().describe("用例库唯一标识"),
  subject: z.string().min(0).max(256).optional().describe("标题"),
  assignedTo: z.string().optional().describe("负责人userId"),
  directoryId: z.string().optional().describe("目录id"),
  preCondition: z.string().optional().describe("前置条件"),
  labels: z.array(z.string()).optional().describe("标签ids"),
  customFieldValues: z.record(z.any()).optional().describe("自定义字段值"),
  testSteps: TestStepsDTOSchema.optional().describe("测试步骤"),
});

export const CreateTestcaseResponseSchema = z.object({
  id: z.string().describe("id"),
});

// Schema for SearchTestcasesRequest
export const SearchTestcasesRequestSchema = z.object({
  organizationId: z.string().describe("组织ID"),
  testRepoId: z.string().describe("用例库唯一标识"),
  page: z.number().int().optional().default(1).describe("分页参数，第几页"),
  perPage: z.number().int().min(0).max(200).optional().default(20).describe("分页参数，每页大小"),
  orderBy: z.enum(["gmtCreate", "name"]).optional().default("gmtCreate").describe("排序字段"),
  sort: z.enum(["desc", "asc"]).optional().default("desc").describe("排序方式"),
  directoryId: z.string().optional().describe("目录id"),
  conditions: z.string().optional().describe("过滤条件，是一个json串"),
});

// Schema for MiniUser
export const MiniUserSchema = z.object({
  id: z.string().describe("用户id"),
  name: z.string().describe("名称"),
});

// Schema for MiniLabel
export const MiniLabelSchema = z.object({
  id: z.string().describe("id"),
  name: z.string().describe("名称"),
  color: z.string().optional().describe("颜色"),
});

// Schema for MiniItemDTO
export const MiniItemDTOSchema = z.object({
  id: z.string().describe("id"),
  name: z.string().describe("名称"),
});

// Schema for FieldValue
export const FieldValueSchema = z.object({
  fieldId: z.string().describe("字段id"),
  fieldName: z.string().describe("字段名称"),
  fieldFormat: z.string().describe("字段类型"),
  values: z.array(z.object({
    identifier: z.string().describe("值的唯一标识"),
    displayValue: z.string().describe("显示的名称"),
  })).optional().describe("字段值"),
});

// Schema for TestcaseDTO
export const TestcaseDTOSchema = z.object({
  id: z.string().describe("id"),
  subject: z.string().describe("标题"),
  customCode: z.string().nullable().optional().describe("编号"),
  assignedTo: MiniUserSchema.nullable().optional().describe("负责人"),
  creator: MiniUserSchema.nullable().optional().describe("创建人"),
  modifier: MiniUserSchema.nullable().optional().describe("修改人"),
  directory: MiniItemDTOSchema.nullable().optional().describe("目录"),
  preCondition: z.string().nullable().optional().describe("前置条件内容"),
  preConditionFormat: z.enum(["RICHTEXT", "TEXT"]).nullable().optional().describe("前置条件内容格式"),
  labels: z.array(MiniLabelSchema).nullable().optional().describe("标签"),
  customFieldValues: z.array(FieldValueSchema).nullable().optional().describe("自定义字段值"),
  testSteps: TestStepsDTOSchema.nullable().optional().describe("测试步骤"),
  gmtCreate: z.union([z.string(), z.number()]).nullable().optional().describe("创建时间（时间戳或ISO字符串）"),
  gmtModified: z.union([z.string(), z.number()]).nullable().optional().describe("修改时间（时间戳或ISO字符串）"),
  testRepo: z.object({
    id: z.string().describe("id"),
    name: z.string().describe("名称"),
  }).nullable().optional().describe("测试用例库"),
});

export const SearchTestcasesResponseSchema = z.array(TestcaseDTOSchema);

// Schema for GetTestcase
export const GetTestcaseRequestSchema = z.object({
  organizationId: z.string().describe("组织ID"),
  testRepoId: z.string().describe("用例库唯一标识"),
  testcaseId: z.string().describe("用例唯一标识"),
});

export const GetTestcaseResponseSchema = TestcaseDTOSchema;

// Schema for DeleteTestcase
export const DeleteTestcaseRequestSchema = z.object({
  organizationId: z.string().describe("组织ID"),
  testRepoId: z.string().describe("用例库唯一标识"),
  testcaseId: z.string().describe("用例唯一标识"),
});

// DELETE 请求可能返回空响应（空字符串、空对象或 undefined）
export const DeleteTestcaseResponseSchema = z.union([
  z.object({}),
  z.string(),
  z.undefined(),
]).transform(() => ({}));

// Type exports
export type ListDirectoriesRequest = z.infer<typeof ListDirectoriesRequestSchema>;
export type ListDirectoriesResponse = z.infer<typeof ListDirectoriesResponseSchema>;
export type CreateTestcaseDirectoryRequest = z.infer<typeof CreateTestcaseDirectoryRequestSchema>;
export type CreateTestcaseDirectoryResponse = z.infer<typeof CreateTestcaseDirectoryResponseSchema>;
export type GetTestcaseFieldConfigRequest = z.infer<typeof GetTestcaseFieldConfigRequestSchema>;
export type GetTestcaseFieldConfigResponse = z.infer<typeof GetTestcaseFieldConfigResponseSchema>;
export type CreateTestcaseRequest = z.infer<typeof CreateTestcaseRequestSchema>;
export type CreateTestcaseResponse = z.infer<typeof CreateTestcaseResponseSchema>;
export type SearchTestcasesRequest = z.infer<typeof SearchTestcasesRequestSchema>;
export type SearchTestcasesResponse = z.infer<typeof SearchTestcasesResponseSchema>;
export type GetTestcaseRequest = z.infer<typeof GetTestcaseRequestSchema>;
export type GetTestcaseResponse = z.infer<typeof GetTestcaseResponseSchema>;
export type DeleteTestcaseRequest = z.infer<typeof DeleteTestcaseRequestSchema>;
export type DeleteTestcaseResponse = z.infer<typeof DeleteTestcaseResponseSchema>;

/**
 * 获取测试用例目录列表
 */
export async function listDirectories(params: ListDirectoriesRequest): Promise<ListDirectoriesResponse> {
  const { organizationId, testRepoId } = params;
  const response = await yunxiaoRequest(
    `/oapi/v1/testhub/organizations/${organizationId}/testRepos/${testRepoId}/directories`,
    { method: 'GET' }
  );
  return ListDirectoriesResponseSchema.parse(response);
}

/**
 * 创建测试用例目录
 */
export async function createTestcaseDirectory(params: CreateTestcaseDirectoryRequest): Promise<CreateTestcaseDirectoryResponse> {
  const { organizationId, testRepoId, name, parentIdentifier } = params;
  const body: any = { name };
  if (parentIdentifier) {
    body.parentIdentifier = parentIdentifier;
  }
  const response = await yunxiaoRequest(
    `/oapi/v1/testhub/organizations/${organizationId}/testRepos/${testRepoId}/directories`,
    { method: 'POST', body }
  );
  return CreateTestcaseDirectoryResponseSchema.parse(response);
}

/**
 * 获取测试用例字段配置
 */
export async function getTestcaseFieldConfig(params: GetTestcaseFieldConfigRequest): Promise<GetTestcaseFieldConfigResponse> {
  const { organizationId, testRepoId } = params;
  const response = await yunxiaoRequest(
    `/oapi/v1/testhub/organizations/${organizationId}/testRepos/${testRepoId}/testcases/fields`,
    { method: 'GET' }
  );
  return GetTestcaseFieldConfigResponseSchema.parse(response);
}

/**
 * 创建测试用例
 */
export async function createTestcase(params: CreateTestcaseRequest): Promise<CreateTestcaseResponse> {
  const { organizationId, testRepoId, ...body } = params;
  const response = await yunxiaoRequest(
    `/oapi/v1/testhub/organizations/${organizationId}/testRepos/${testRepoId}/testcases`,
    { method: 'POST', body }
  );
  return CreateTestcaseResponseSchema.parse(response);
}

/**
 * 搜索测试用例
 */
export async function searchTestcases(params: SearchTestcasesRequest): Promise<SearchTestcasesResponse> {
  const { organizationId, testRepoId, ...body } = params;
  const response = await yunxiaoRequest(
    `/oapi/v1/testhub/organizations/${organizationId}/testRepos/${testRepoId}/testcases:search`,
    { method: 'POST', body }
  );
  return SearchTestcasesResponseSchema.parse(response);
}

/**
 * 获取测试用例信息
 */
export async function getTestcase(params: GetTestcaseRequest): Promise<GetTestcaseResponse> {
  const { organizationId, testRepoId, testcaseId } = params;
  const response = await yunxiaoRequest(
    `/oapi/v1/testhub/organizations/${organizationId}/testRepos/${testRepoId}/testcases/${testcaseId}`,
    { method: 'GET' }
  );
  return GetTestcaseResponseSchema.parse(response);
}

/**
 * 删除测试用例
 */
export async function deleteTestcase(params: DeleteTestcaseRequest): Promise<DeleteTestcaseResponse> {
  const { organizationId, testRepoId, testcaseId } = params;
  const response = await yunxiaoRequest(
    `/oapi/v1/testhub/organizations/${organizationId}/testRepos/${testRepoId}/testcases/${testcaseId}`,
    { method: 'DELETE' }
  );
  return DeleteTestcaseResponseSchema.parse(response);
}

