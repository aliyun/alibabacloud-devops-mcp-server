import { z } from 'zod';
import { yunxiaoRequest, isRegionEdition } from '../../common/utils.js';
import { resolveOrganizationId } from '../organization/organization.js';

const PipelineRefSchema = z.object({
  id: z.number().describe("流水线ID"),
  name: z.string().describe("流水线名称"),
}).describe("关联流水线信息");

const VariableSchema = z.object({
  name: z.string().describe("变量名"),
  value: z.string().describe("变量值"),
  isEncrypted: z.boolean().optional().describe("是否加密"),
}).describe("变量信息");

const VariableGroupSchema = z.object({
  id: z.number().describe("变量组ID"),
  name: z.string().describe("变量组名称"),
  description: z.string().nullable().optional().describe("变量组描述"),
  creatorAccountId: z.string().optional().describe("创建者账号ID"),
  modifierAccountId: z.string().optional().describe("修改者账号ID"),
  createTime: z.number().optional().describe("创建时间（毫秒时间戳）"),
  updateTime: z.number().optional().describe("更新时间（毫秒时间戳）"),
  relatedPipelines: z.array(PipelineRefSchema).optional().describe("关联流水线列表"),
  variables: z.array(VariableSchema).optional().describe("变量列表"),
}).describe("流水线变量组");

export const ListFlowVariableGroupsRequestSchema = z.object({
  organizationId: z.string().optional().describe("组织ID（中心站必填，区域站可省略）"),
});

export const ListFlowVariableGroupsResponseSchema = z.array(VariableGroupSchema);

export const GetFlowVariableGroupRequestSchema = z.object({
  organizationId: z.string().optional().describe("组织ID（中心站必填，区域站可省略）"),
  id: z.number().describe("变量组ID"),
});

export const GetFlowVariableGroupResponseSchema = VariableGroupSchema;

export const CreateFlowVariableGroupRequestSchema = z.object({
  organizationId: z.string().optional().describe("组织ID（中心站必填，区域站可省略）"),
  name: z.string().describe("变量组名称"),
  description: z.string().optional().describe("变量组描述"),
  variables: z.array(VariableSchema).describe("变量列表"),
});

export const CreateFlowVariableGroupResponseSchema = z.number().describe("创建的变量组ID");

export const UpdateFlowVariableGroupRequestSchema = z.object({
  organizationId: z.string().optional().describe("组织ID（中心站必填，区域站可省略）"),
  id: z.number().describe("变量组ID"),
  name: z.string().describe("变量组名称"),
  description: z.string().optional().describe("变量组描述"),
  variables: z.array(VariableSchema).describe("变量列表"),
});

export const UpdateFlowVariableGroupResponseSchema = z.boolean().describe("更新是否成功");

export const DeleteFlowVariableGroupRequestSchema = z.object({
  organizationId: z.string().optional().describe("组织ID（中心站必填，区域站可省略）"),
  id: z.number().describe("变量组ID"),
});

export const DeleteFlowVariableGroupResponseSchema = z.boolean().describe("删除是否成功");

export type ListFlowVariableGroupsRequest = z.infer<typeof ListFlowVariableGroupsRequestSchema>;
export type ListFlowVariableGroupsResponse = z.infer<typeof ListFlowVariableGroupsResponseSchema>;
export type GetFlowVariableGroupRequest = z.infer<typeof GetFlowVariableGroupRequestSchema>;
export type GetFlowVariableGroupResponse = z.infer<typeof GetFlowVariableGroupResponseSchema>;
export type CreateFlowVariableGroupRequest = z.infer<typeof CreateFlowVariableGroupRequestSchema>;
export type CreateFlowVariableGroupResponse = z.infer<typeof CreateFlowVariableGroupResponseSchema>;
export type UpdateFlowVariableGroupRequest = z.infer<typeof UpdateFlowVariableGroupRequestSchema>;
export type UpdateFlowVariableGroupResponse = z.infer<typeof UpdateFlowVariableGroupResponseSchema>;
export type DeleteFlowVariableGroupRequest = z.infer<typeof DeleteFlowVariableGroupRequestSchema>;
export type DeleteFlowVariableGroupResponse = z.infer<typeof DeleteFlowVariableGroupResponseSchema>;

/**
 * List Flow pipeline variable groups
 *
 * @param params - The request parameters
 * @returns The list of pipeline variable groups
 */
export async function listFlowVariableGroups(params: ListFlowVariableGroupsRequest): Promise<ListFlowVariableGroupsResponse> {
  const { organizationId } = params;
  const finalOrgId = await resolveOrganizationId(organizationId);

  const url = isRegionEdition()
    ? `/oapi/v1/flow/variableGroups`
    : `/oapi/v1/flow/organizations/${finalOrgId}/variableGroups`;

  const response = await yunxiaoRequest(url, { method: 'GET' });
  return ListFlowVariableGroupsResponseSchema.parse(response);
}

/**
 * Get a Flow pipeline variable group by ID
 *
 * @param params - The request parameters
 * @returns The variable group details
 */
export async function getFlowVariableGroup(params: GetFlowVariableGroupRequest): Promise<GetFlowVariableGroupResponse> {
  const { organizationId, id } = params;
  const finalOrgId = await resolveOrganizationId(organizationId);

  const url = isRegionEdition()
    ? `/oapi/v1/flow/variableGroups/${id}`
    : `/oapi/v1/flow/organizations/${finalOrgId}/variableGroups/${id}`;

  const response = await yunxiaoRequest(url, { method: 'GET' });
  return GetFlowVariableGroupResponseSchema.parse(response);
}

/**
 * Create a Flow pipeline variable group
 *
 * @param params - The request parameters
 * @returns The created variable group ID
 */
export async function createFlowVariableGroup(params: CreateFlowVariableGroupRequest): Promise<CreateFlowVariableGroupResponse> {
  const { organizationId, name, description, variables } = params;
  const finalOrgId = await resolveOrganizationId(organizationId);

  const queryParams = new URLSearchParams();
  queryParams.append('name', name);
  if (description) queryParams.append('description', description);
  queryParams.append('variables', JSON.stringify(variables));

  const baseUrl = isRegionEdition()
    ? `/oapi/v1/flow/variableGroups`
    : `/oapi/v1/flow/organizations/${finalOrgId}/variableGroups`;

  const url = `${baseUrl}?${queryParams.toString()}`;

  const response = await yunxiaoRequest(url, { method: 'POST' });
  // The API returns the ID as a plain text number
  return CreateFlowVariableGroupResponseSchema.parse(response);
}

/**
 * Update a Flow pipeline variable group
 *
 * @param params - The request parameters
 * @returns Whether the update was successful
 */
export async function updateFlowVariableGroup(params: UpdateFlowVariableGroupRequest): Promise<UpdateFlowVariableGroupResponse> {
  const { organizationId, id, name, description, variables } = params;
  const finalOrgId = await resolveOrganizationId(organizationId);

  const queryParams = new URLSearchParams();
  queryParams.append('name', name);
  if (description) queryParams.append('description', description);
  queryParams.append('variables', JSON.stringify(variables));

  const baseUrl = isRegionEdition()
    ? `/oapi/v1/flow/variableGroups/${id}`
    : `/oapi/v1/flow/organizations/${finalOrgId}/variableGroups/${id}`;

  const url = `${baseUrl}?${queryParams.toString()}`;

  const response = await yunxiaoRequest(url, { method: 'PUT' });
  return UpdateFlowVariableGroupResponseSchema.parse(response);
}

/**
 * Delete a Flow pipeline variable group
 *
 * @param params - The request parameters
 * @returns Whether the deletion was successful
 */
export async function deleteFlowVariableGroup(params: DeleteFlowVariableGroupRequest): Promise<DeleteFlowVariableGroupResponse> {
  const { organizationId, id } = params;
  const finalOrgId = await resolveOrganizationId(organizationId);

  const url = isRegionEdition()
    ? `/oapi/v1/flow/variableGroups/${id}`
    : `/oapi/v1/flow/organizations/${finalOrgId}/variableGroups/${id}`;

  const response = await yunxiaoRequest(url, { method: 'DELETE' });
  return DeleteFlowVariableGroupResponseSchema.parse(response);
}
