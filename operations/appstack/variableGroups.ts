import { z } from 'zod';
import { yunxiaoRequest, buildUrl, isRegionEdition } from '../../common/utils.js';
import { resolveOrganizationId } from '../organization/organization.js';

// Define the Variable schema based on the definition in appstack.swagger.json
const VariableSchema = z.object({
  description: z.string().optional().describe("变量描述"),
  key: z.string().optional().describe("变量键"),
  value: z.string().optional().describe("变量值"),
}).describe("变量模型");

// Define the RepoMeta schema based on the definition in appstack.swagger.json
const RepoMetaSchema = z.object({
  name: z.string().describe("仓库名称"),
  type: z.string().describe("仓库类型"),
}).describe("仓库信息");

// Define the Revision schema based on the definition in 变量组.swagger.json
const RevisionSchema = z.object({
  author: z.string().describe("提交人"),
  commitTime: z.number().describe("提交时间 (毫秒时间戳)"),
  message: z.string().describe("版本提交信息"),
  refs: z.array(z.string()).describe("关联信息"),
  repoMeta: RepoMetaSchema.describe("仓库元信息"),
  sha: z.string().describe("版本sha值"),
}).describe("版本信息");

// Define the RevisionVariableGroup schema based on the definition in 变量组.swagger.json
const RevisionVariableGroupSchema = z.object({
  displayName: z.string().optional().describe("变量组展示名称"),
  name: z.string().optional().describe("变量组名称"),
  revision: RevisionSchema.optional().describe("版本信息"),
  type: z.enum(["GLOBAL", "TEMPLATE", "APP"]).optional().describe("类型"),
  vars: z.array(VariableSchema).optional().describe("变量列表"),
}).describe("变量组版本记录");

// Schema for the GetEnvVariableGroups API
export const GetEnvVariableGroupsRequestSchema = z.object({
  organizationId: z.string().describe("组织ID"),
  appName: z.string().describe("应用名"),
  envName: z.string().describe("环境名"),
});

export const GetEnvVariableGroupsResponseSchema = z.array(RevisionVariableGroupSchema);

// Schema for the CreateVariableGroup API
export const CreateVariableGroupRequestSchema = z.object({
  organizationId: z.string().describe("组织ID"),
  appName: z.string().describe("应用名"),
  branchName: z.string().optional().describe("版本分支，默认 master"),
  displayName: z.string().optional().describe("变量组展示名"),
  fromRevisionSha: z.string().describe("变量组版本号"),
  message: z.string().optional().describe("变量组描述信息"),
  name: z.string().optional().describe("变量组唯一名"),
  vars: z.array(VariableSchema).optional().describe("变量列表"),
});

export const CreateVariableGroupResponseSchema = RevisionVariableGroupSchema;

// Schema for the DeleteVariableGroup API
export const DeleteVariableGroupRequestSchema = z.object({
  organizationId: z.string().describe("组织ID"),
  appName: z.string().describe("应用名"),
  variableGroupName: z.string().describe("变量组名"),
});

export const DeleteVariableGroupResponseSchema = z.boolean().describe("调用是否成功");

// Schema for the GetVariableGroup API
export const GetVariableGroupRequestSchema = z.object({
  organizationId: z.string().describe("组织ID"),
  appName: z.string().describe("应用名"),
  variableGroupName: z.string().describe("变量组名"),
});

export const GetVariableGroupResponseSchema = RevisionVariableGroupSchema;

// Schema for the UpdateVariableGroup API
export const UpdateVariableGroupRequestSchema = z.object({
  organizationId: z.string().describe("组织ID"),
  appName: z.string().describe("应用名"),
  variableGroupName: z.string().describe("变量组名"),
  branchName: z.string().optional().describe("版本分支，默认 master"),
  displayName: z.string().optional().describe("变量组展示名"),
  fromRevisionSha: z.string().describe("变量组版本号"),
  message: z.string().optional().describe("变量组描述信息"),
  name: z.string().optional().describe("变量组唯一名"),
  vars: z.array(VariableSchema).optional().describe("变量列表"),
});

export const UpdateVariableGroupResponseSchema = RevisionVariableGroupSchema;

// Schema for the GetAppVariableGroups API
export const GetAppVariableGroupsRequestSchema = z.object({
  organizationId: z.string().describe("组织ID"),
  appName: z.string().describe("应用名"),
});

export const GetAppVariableGroupsResponseSchema = z.array(RevisionVariableGroupSchema);

// Schema for the GetAppVariableGroupsRevision API
export const GetAppVariableGroupsRevisionRequestSchema = z.object({
  organizationId: z.string().describe("组织ID"),
  appName: z.string().describe("应用名"),
});

export const GetAppVariableGroupsRevisionResponseSchema = RevisionSchema;

export type GetEnvVariableGroupsRequest = z.infer<typeof GetEnvVariableGroupsRequestSchema>;
export type GetEnvVariableGroupsResponse = z.infer<typeof GetEnvVariableGroupsResponseSchema>;
export type CreateVariableGroupRequest = z.infer<typeof CreateVariableGroupRequestSchema>;
export type CreateVariableGroupResponse = z.infer<typeof CreateVariableGroupResponseSchema>;
export type DeleteVariableGroupRequest = z.infer<typeof DeleteVariableGroupRequestSchema>;
export type DeleteVariableGroupResponse = z.infer<typeof DeleteVariableGroupResponseSchema>;
export type GetVariableGroupRequest = z.infer<typeof GetVariableGroupRequestSchema>;
export type GetVariableGroupResponse = z.infer<typeof GetVariableGroupResponseSchema>;
export type UpdateVariableGroupRequest = z.infer<typeof UpdateVariableGroupRequestSchema>;
export type UpdateVariableGroupResponse = z.infer<typeof UpdateVariableGroupResponseSchema>;
export type GetAppVariableGroupsRequest = z.infer<typeof GetAppVariableGroupsRequestSchema>;
export type GetAppVariableGroupsResponse = z.infer<typeof GetAppVariableGroupsResponseSchema>;
export type GetAppVariableGroupsRevisionRequest = z.infer<typeof GetAppVariableGroupsRevisionRequestSchema>;
export type GetAppVariableGroupsRevisionResponse = z.infer<typeof GetAppVariableGroupsRevisionResponseSchema>;

/**
 * Get variable groups for an environment
 * 
 * @param params - The request parameters
 * @returns The list of variable groups for the environment
 */
export async function getEnvVariableGroups(params: GetEnvVariableGroupsRequest): Promise<GetEnvVariableGroupsResponse> {
  const { organizationId, appName, envName } = params;
  const finalOrgId = await resolveOrganizationId(organizationId);
  
  try {
    const url = isRegionEdition()
      ? `/oapi/v1/appstack/apps/${appName}/envs/${envName}/variableGroups`
      : `/oapi/v1/appstack/organizations/${finalOrgId}/apps/${appName}/envs/${envName}/variableGroups`;
    const response = await yunxiaoRequest(
      url,
      {
        method: 'GET',
      }
    );
    return GetEnvVariableGroupsResponseSchema.parse(response);
  } catch (error) {
    throw error;
  }
}

/**
 * Create a variable group
 * 
 * @param params - The request parameters
 * @returns The created variable group
 */
export async function createVariableGroup(params: CreateVariableGroupRequest): Promise<CreateVariableGroupResponse> {
  const { organizationId, appName, ...body } = params;
  const finalOrgId = await resolveOrganizationId(organizationId);
  
  try {
    const url = isRegionEdition()
      ? `/oapi/v1/appstack/apps/${appName}/variableGroup`
      : `/oapi/v1/appstack/organizations/${finalOrgId}/apps/${appName}/variableGroup`;
    const response = await yunxiaoRequest(
      url,
      {
        method: 'POST',
        body: body,
      }
    );
    return CreateVariableGroupResponseSchema.parse(response);
  } catch (error) {
    throw error;
  }
}

/**
 * Delete a variable group
 * 
 * @param params - The request parameters
 * @returns Whether the deletion was successful
 */
export async function deleteVariableGroup(params: DeleteVariableGroupRequest): Promise<DeleteVariableGroupResponse> {
  const { organizationId, appName, variableGroupName } = params;
  const finalOrgId = await resolveOrganizationId(organizationId);
  
  try {
    const url = isRegionEdition()
      ? `/oapi/v1/appstack/apps/${appName}/variableGroup/${variableGroupName}`
      : `/oapi/v1/appstack/organizations/${finalOrgId}/apps/${appName}/variableGroup/${variableGroupName}`;
    const response = await yunxiaoRequest(
      url,
      {
        method: 'DELETE',
      }
    );
    return DeleteVariableGroupResponseSchema.parse(response);
  } catch (error) {
    throw error;
  }
}

/**
 * Get a variable group
 * 
 * @param params - The request parameters
 * @returns The variable group
 */
export async function getVariableGroup(params: GetVariableGroupRequest): Promise<GetVariableGroupResponse> {
  const { organizationId, appName, variableGroupName } = params;
  const finalOrgId = await resolveOrganizationId(organizationId);
  
  try {
    const url = isRegionEdition()
      ? `/oapi/v1/appstack/apps/${appName}/variableGroup/${variableGroupName}`
      : `/oapi/v1/appstack/organizations/${finalOrgId}/apps/${appName}/variableGroup/${variableGroupName}`;
    const response = await yunxiaoRequest(
      url,
      {
        method: 'GET',
      }
    );
    return GetVariableGroupResponseSchema.parse(response);
  } catch (error) {
    throw error;
  }
}

/**
 * Update a variable group
 * 
 * @param params - The request parameters
 * @returns The updated variable group
 */
export async function updateVariableGroup(params: UpdateVariableGroupRequest): Promise<UpdateVariableGroupResponse> {
  const { organizationId, appName, variableGroupName, ...body } = params;
  const finalOrgId = await resolveOrganizationId(organizationId);
  
  try {
    const url = isRegionEdition()
      ? `/oapi/v1/appstack/apps/${appName}/variableGroup/${variableGroupName}`
      : `/oapi/v1/appstack/organizations/${finalOrgId}/apps/${appName}/variableGroup/${variableGroupName}`;
    const response = await yunxiaoRequest(
      url,
      {
        method: 'PUT',
        body: body,
      }
    );
    return UpdateVariableGroupResponseSchema.parse(response);
  } catch (error) {
    throw error;
  }
}

/**
 * Get variable groups for an application
 * 
 * @param params - The request parameters
 * @returns The list of variable groups for the application
 */
export async function getAppVariableGroups(params: GetAppVariableGroupsRequest): Promise<GetAppVariableGroupsResponse> {
  const { organizationId, appName } = params;
  const finalOrgId = await resolveOrganizationId(organizationId);
  
  try {
    const url = isRegionEdition()
      ? `/oapi/v1/appstack/apps/${appName}/variableGroups`
      : `/oapi/v1/appstack/organizations/${finalOrgId}/apps/${appName}/variableGroups`;
    const response = await yunxiaoRequest(
      url,
      {
        method: 'GET',
      }
    );
    return GetAppVariableGroupsResponseSchema.parse(response);
  } catch (error) {
    throw error;
  }
}

/**
 * Get the revision of variable groups for an application
 * 
 * @param params - The request parameters
 * @returns The revision of variable groups for the application
 */
export async function getAppVariableGroupsRevision(params: GetAppVariableGroupsRevisionRequest): Promise<GetAppVariableGroupsRevisionResponse> {
  const { organizationId, appName } = params;
  const finalOrgId = await resolveOrganizationId(organizationId);
  
  try {
    const url = isRegionEdition()
      ? `/oapi/v1/appstack/apps/${appName}/variableGroups:revision`
      : `/oapi/v1/appstack/organizations/${finalOrgId}/apps/${appName}/variableGroups:revision`;
    const response = await yunxiaoRequest(
      url,
      {
        method: 'GET',
      }
    );
    return GetAppVariableGroupsRevisionResponseSchema.parse(response);
  } catch (error) {
    throw error;
  }
}