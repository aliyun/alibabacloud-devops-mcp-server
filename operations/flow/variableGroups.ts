import { z } from "zod";
import * as utils from "../../common/utils.js";
import { resolveOrganizationId } from "../organization/organization.js";

// ---------------------------------------------------------------------------
// Schemas - based on docs/variableGroup.swagger.json
// ---------------------------------------------------------------------------

// A variable inside a Flow variable group
export const FlowVariableSchema = z.object({
  name: z.string().describe("变量名"),
  value: z.string().describe("变量值"),
  isEncrypted: z.boolean().describe("是否加密"),
});

export type FlowVariable = z.infer<typeof FlowVariableSchema>;

// Related pipeline info in VariableGroupVo
const FlowVariableGroupRelatedPipelineSchema = z
  .object({
    id: z.number().nullable().optional().describe("关联的流水线 Id"),
    name: z.string().nullable().optional().describe("关联的流水线名称"),
  })
  .describe("关联的流水线信息");

// VariableGroupVo returned by GET/List endpoints
export const FlowVariableGroupVoSchema = z
  .object({
    id: z.number().nullable().optional().describe("变量组 id"),
    name: z.string().nullable().optional().describe("变量组名称"),
    description: z.string().nullable().optional().describe("变量组描述"),
    creatorAccountId: z
      .string()
      .nullable()
      .optional()
      .describe("创建人阿里云账号 id"),
    modifierAccountId: z
      .string()
      .nullable()
      .optional()
      .describe("更新人阿里云账号 id"),
    createTime: z.number().nullable().optional().describe("创建时间"),
    updateTime: z.number().nullable().optional().describe("更新时间"),
    relatedPipelines: z
      .array(FlowVariableGroupRelatedPipelineSchema)
      .nullable()
      .optional()
      .describe("关联的流水线列表"),
    variables: z
      .array(
        z.object({
          name: z.string().nullable().optional().describe("变量名"),
          value: z.string().nullable().optional().describe("变量值"),
          isEncrypted: z.boolean().nullable().optional().describe("是否加密"),
        })
      )
      .nullable()
      .optional()
      .describe("变量列表"),
  })
  .describe("Flow 变量组");

export type FlowVariableGroupVo = z.infer<typeof FlowVariableGroupVoSchema>;

// ------------------------------ Request schemas ----------------------------

export const CreateFlowVariableGroupRequestSchema = z.object({
  organizationId: z.string().describe("组织ID/企业Id"),
  name: z.string().describe("变量组名称"),
  description: z.string().optional().describe("变量组描述"),
  variables: z
    .array(FlowVariableSchema)
    .describe("变量列表。将被序列化为 JSON 字符串传递给 variables 查询参数"),
});

export const ListFlowVariableGroupsRequestSchema = z.object({
  organizationId: z.string().describe("组织ID/企业Id"),
  perPage: z
    .number()
    .int()
    .optional()
    .describe("每页数据条数，默认10，最大支持30"),
  page: z.number().int().optional().describe("当前页，默认1"),
  pageSort: z.string().optional().describe("排序条件，如 ID"),
  pageOrder: z
    .string()
    .optional()
    .describe("排序顺序 DESC 降序 ASC 升序"),
});

export const GetFlowVariableGroupRequestSchema = z.object({
  organizationId: z.string().describe("组织ID/企业Id"),
  id: z.number().int().describe("变量组 id"),
});

export const DeleteFlowVariableGroupRequestSchema = z.object({
  organizationId: z.string().describe("组织ID/企业Id"),
  id: z.number().int().describe("变量组 id"),
});

export const UpdateFlowVariableGroupRequestSchema = z.object({
  organizationId: z.string().describe("组织ID/企业Id"),
  id: z.number().int().describe("变量组 id"),
  name: z.string().describe("变量组名称"),
  description: z.string().optional().describe("变量组描述"),
  variables: z
    .array(FlowVariableSchema)
    .describe("变量列表。将被序列化为 JSON 字符串传递给 variables 查询参数"),
});

// ------------------------------ Response schemas ---------------------------

export const CreateFlowVariableGroupResponseSchema = z
  .object({
    variableGroupId: z.number().nullable().optional(),
  })
  .passthrough();

export const ListFlowVariableGroupsResponseSchema = z.array(
  FlowVariableGroupVoSchema
);

export const GetFlowVariableGroupResponseSchema = FlowVariableGroupVoSchema;

export const DeleteFlowVariableGroupResponseSchema = z.boolean();

export const UpdateFlowVariableGroupResponseSchema = z.boolean();

// ---------------------------------------------------------------------------
// URL helpers
// ---------------------------------------------------------------------------

function baseCollectionUrl(finalOrgId: string): string {
  return utils.isRegionEdition()
    ? `/oapi/v1/flow/variableGroups`
    : `/oapi/v1/flow/organizations/${finalOrgId}/variableGroups`;
}

function baseItemUrl(finalOrgId: string, id: number): string {
  return utils.isRegionEdition()
    ? `/oapi/v1/flow/variableGroups/${id}`
    : `/oapi/v1/flow/organizations/${finalOrgId}/variableGroups/${id}`;
}

// ---------------------------------------------------------------------------
// API functions
// ---------------------------------------------------------------------------

/**
 * 创建 Flow 组织级变量组
 */
export async function createFlowVariableGroupFunc(
  params: z.infer<typeof CreateFlowVariableGroupRequestSchema>
): Promise<z.infer<typeof CreateFlowVariableGroupResponseSchema>> {
  const finalOrgId = await resolveOrganizationId(params.organizationId);
  const queryParams: Record<string, string | number | undefined> = {
    name: params.name,
    variables: JSON.stringify(params.variables),
  };
  if (params.description !== undefined) {
    queryParams.description = params.description;
  }

  const url = utils.buildUrl(baseCollectionUrl(finalOrgId), queryParams);
  const response = await utils.yunxiaoRequest(url, { method: "POST" });

  // API 返回的是 { variableGroupId: 1234 } 或直接一个数字
  if (typeof response === "number") {
    return { variableGroupId: response };
  }
  return CreateFlowVariableGroupResponseSchema.parse(response ?? {});
}

/**
 * 获取 Flow 组织级变量组列表
 */
export async function listFlowVariableGroupsFunc(
  params: z.infer<typeof ListFlowVariableGroupsRequestSchema>
): Promise<z.infer<typeof ListFlowVariableGroupsResponseSchema>> {
  const finalOrgId = await resolveOrganizationId(params.organizationId);
  const queryParams: Record<string, string | number | undefined> = {};
  if (params.perPage !== undefined) queryParams.perPage = params.perPage;
  if (params.page !== undefined) queryParams.page = params.page;
  if (params.pageSort !== undefined) queryParams.pageSort = params.pageSort;
  if (params.pageOrder !== undefined) queryParams.pageOrder = params.pageOrder;

  const url = utils.buildUrl(baseCollectionUrl(finalOrgId), queryParams);
  const response = await utils.yunxiaoRequest(url, { method: "GET" });

  if (!Array.isArray(response)) {
    return [];
  }
  return response.map((item) => FlowVariableGroupVoSchema.parse(item));
}

/**
 * 获取 Flow 组织级变量组详情
 */
export async function getFlowVariableGroupFunc(
  params: z.infer<typeof GetFlowVariableGroupRequestSchema>
): Promise<z.infer<typeof GetFlowVariableGroupResponseSchema>> {
  const finalOrgId = await resolveOrganizationId(params.organizationId);
  const url = baseItemUrl(finalOrgId, params.id);
  const response = await utils.yunxiaoRequest(url, { method: "GET" });
  return FlowVariableGroupVoSchema.parse(response);
}

/**
 * 删除 Flow 组织级变量组
 */
export async function deleteFlowVariableGroupFunc(
  params: z.infer<typeof DeleteFlowVariableGroupRequestSchema>
): Promise<z.infer<typeof DeleteFlowVariableGroupResponseSchema>> {
  const finalOrgId = await resolveOrganizationId(params.organizationId);
  const url = baseItemUrl(finalOrgId, params.id);
  const response = await utils.yunxiaoRequest(url, { method: "DELETE" });
  if (typeof response === "boolean") return response;
  return true;
}

/**
 * 更新 Flow 组织级变量组
 */
export async function updateFlowVariableGroupFunc(
  params: z.infer<typeof UpdateFlowVariableGroupRequestSchema>
): Promise<z.infer<typeof UpdateFlowVariableGroupResponseSchema>> {
  const finalOrgId = await resolveOrganizationId(params.organizationId);
  const queryParams: Record<string, string | number | undefined> = {
    name: params.name,
    variables: JSON.stringify(params.variables),
  };
  if (params.description !== undefined) {
    queryParams.description = params.description;
  }

  const url = utils.buildUrl(baseItemUrl(finalOrgId, params.id), queryParams);
  const response = await utils.yunxiaoRequest(url, { method: "PUT" });
  if (typeof response === "boolean") return response;
  return true;
}
