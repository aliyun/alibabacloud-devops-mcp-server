import { z } from 'zod';
import { yunxiaoRequest, buildUrl, isRegionEdition } from '../../common/utils.js';
import { resolveOrganizationId } from '../organization/organization.js';

// Define the referenced schemas based on their usage
const VariableSchema = z.object({
  key: z.string().optional().describe("变量键"),
  value: z.string().optional().describe("变量值"),
  description: z.string().optional().describe("变量描述"),
}).describe("变量");

const RevisionSchema = z.object({
  author: z.string().optional().describe("提交人"),
  commitTime: z.number().optional().describe("提交时间 (毫秒时间戳)"),
  message: z.string().optional().describe("版本提交信息"),
  refs: z.array(z.string()).optional().describe("关联信息"),
  sha: z.string().optional().describe("版本sha值"),
}).describe("版本信息");

const GlobalVarVOSchema = z.object({
  name: z.string().optional().describe("全局变量组名称"),
  displayName: z.string().optional().describe("全局变量组显示名称"),
  creator: z.string().optional().describe("全局变量组创建者"),
  gmtCreate: z.string().optional().describe("全局变量组创建时间"),
  gmtModified: z.string().optional().describe("全局变量组修改时间"),
  modifier: z.string().optional().describe("全局变量组修改者"),
}).describe("全局变量组VO");

// Schema for the CreateGlobalVar API
export const CreateGlobalVarRequestSchema = z.object({
  organizationId: z.string().describe("组织ID"),
  displayName: z.string().describe("全局变量组显示名称"),
  name: z.string().describe("全局变量组名称"),
  content: z.array(VariableSchema).optional().describe("变量列表"),
  message: z.string().optional().describe("全局变量组信息"),
  ownerId: z.string().optional().describe("全局变量组拥有者"),
});

export const CreateGlobalVarResponseSchema = z.object({
  content: z.array(VariableSchema).optional().describe("全局变量组变量列表"),
  creator: z.string().optional().describe("全局变量组创建者"),
  displayName: z.string().optional().describe("全局变量组显示名称"),
  gmtCreate: z.string().optional().describe("全局变量组创建时间"),
  gmtModified: z.string().optional().describe("全局变量组修改时间"),
  modifier: z.string().optional().describe("全局变量组修改者"),
  name: z.string().optional().describe("全局变量组名称"),
  revision: RevisionSchema.optional().describe("版本信息"),
});

// Schema for the DeleteGlobalVar API
export const DeleteGlobalVarRequestSchema = z.object({
  organizationId: z.string().describe("组织ID"),
  name: z.string().describe("全局变量组名称"),
});

export const DeleteGlobalVarResponseSchema = z.boolean().describe("调用是否成功");

// Schema for the GetGlobalVar API
export const GetGlobalVarRequestSchema = z.object({
  organizationId: z.string().describe("组织ID"),
  name: z.string().describe("全局变量组名称"),
  revisionSha: z.string().optional().describe("全局变量组版本"),
});

export const GetGlobalVarResponseSchema = z.object({
  content: z.array(VariableSchema).optional().describe("全局变量组变量列表"),
  creator: z.string().optional().describe("全局变量组创建者"),
  displayName: z.string().optional().describe("全局变量组显示名称"),
  gmtCreate: z.string().optional().describe("全局变量组创建时间"),
  gmtModified: z.string().optional().describe("全局变量组修改时间"),
  modifier: z.string().optional().describe("全局变量组修改者"),
  name: z.string().optional().describe("全局变量组名称"),
  revision: RevisionSchema.optional().describe("版本信息"),
});

// Schema for the UpdateGlobalVar API
export const UpdateGlobalVarRequestSchema = z.object({
  organizationId: z.string().describe("组织ID"),
  name: z.string().describe("全局变量组名称"),
  content: z.array(VariableSchema).describe("变量列表"),
  fromRevisionSha: z.string().describe("更新源版本信息"),
  message: z.string().optional().describe("全局变量组信息"),
});

export const UpdateGlobalVarResponseSchema = z.object({
  content: z.array(VariableSchema).optional().describe("全局变量组变量列表"),
  creator: z.string().optional().describe("全局变量组创建者"),
  displayName: z.string().optional().describe("全局变量组显示名称"),
  gmtCreate: z.string().optional().describe("全局变量组创建时间"),
  gmtModified: z.string().optional().describe("全局变量组修改时间"),
  modifier: z.string().optional().describe("全局变量组修改者"),
  name: z.string().optional().describe("全局变量组名称"),
  revision: RevisionSchema.optional().describe("版本信息"),
});

// Schema for the ListGlobalVars API
export const ListGlobalVarsRequestSchema = z.object({
  organizationId: z.string().describe("组织ID"),
  current: z.number().describe("当前页码"),
  pageSize: z.number().describe("每页大小"),
  search: z.string().optional().describe("查询关键字"),
});

export const ListGlobalVarsResponseSchema = z.object({
  current: z.number().describe("当前页数"),
  pageSize: z.number().describe("每页大小"),
  pages: z.number().describe("总页数"),
  records: z.array(GlobalVarVOSchema).describe("数据列表"),
  total: z.number().describe("总数"),
});

export type CreateGlobalVarRequest = z.infer<typeof CreateGlobalVarRequestSchema>;
export type CreateGlobalVarResponse = z.infer<typeof CreateGlobalVarResponseSchema>;
export type DeleteGlobalVarRequest = z.infer<typeof DeleteGlobalVarRequestSchema>;
export type DeleteGlobalVarResponse = z.infer<typeof DeleteGlobalVarResponseSchema>;
export type GetGlobalVarRequest = z.infer<typeof GetGlobalVarRequestSchema>;
export type GetGlobalVarResponse = z.infer<typeof GetGlobalVarResponseSchema>;
export type UpdateGlobalVarRequest = z.infer<typeof UpdateGlobalVarRequestSchema>;
export type UpdateGlobalVarResponse = z.infer<typeof UpdateGlobalVarResponseSchema>;
export type ListGlobalVarsRequest = z.infer<typeof ListGlobalVarsRequestSchema>;
export type ListGlobalVarsResponse = z.infer<typeof ListGlobalVarsResponseSchema>;

/**
 * Create a global variable group
 * 
 * @param params - The request parameters
 * @returns The created global variable group
 */
export async function createGlobalVar(params: CreateGlobalVarRequest): Promise<CreateGlobalVarResponse> {
  const { organizationId, ...body } = params;
  const finalOrgId = await resolveOrganizationId(organizationId);
  
  try {
    const url = isRegionEdition()
      ? `/oapi/v1/appstack/globalVars`
      : `/oapi/v1/appstack/organizations/${finalOrgId}/globalVars`;
    const response = await yunxiaoRequest(
      url,
      {
        method: 'POST',
        body: body,
      }
    );
    return CreateGlobalVarResponseSchema.parse(response);
  } catch (error) {
    throw error;
  }
}

/**
 * Delete a global variable group
 * 
 * @param params - The request parameters
 * @returns Whether the deletion was successful
 */
export async function deleteGlobalVar(params: DeleteGlobalVarRequest): Promise<DeleteGlobalVarResponse> {
  const { organizationId, name } = params;
  const finalOrgId = await resolveOrganizationId(organizationId);
  
  try {
    const url = isRegionEdition()
      ? `/oapi/v1/appstack/globalVars/${name}`
      : `/oapi/v1/appstack/organizations/${finalOrgId}/globalVars/${name}`;
    const response = await yunxiaoRequest(
      url,
      {
        method: 'DELETE',
      }
    );
    return DeleteGlobalVarResponseSchema.parse(response);
  } catch (error) {
    throw error;
  }
}

/**
 * Get a global variable group
 * 
 * @param params - The request parameters
 * @returns The global variable group
 */
export async function getGlobalVar(params: GetGlobalVarRequest): Promise<GetGlobalVarResponse> {
  const { organizationId, name, revisionSha } = params;
  const finalOrgId = await resolveOrganizationId(organizationId);
  
  // Build query string properly
  const query: Record<string, string | number> = {};
  if (revisionSha) query.revisionSha = revisionSha;
  
  try {
    const baseUrl = isRegionEdition()
      ? `/oapi/v1/appstack/globalVars/${name}`
      : `/oapi/v1/appstack/organizations/${finalOrgId}/globalVars/${name}`;
    const url = buildUrl(baseUrl, query);
    
    const response = await yunxiaoRequest(
      url,
      {
        method: 'GET',
      }
    );
    return GetGlobalVarResponseSchema.parse(response);
  } catch (error) {
    throw error;
  }
}

/**
 * Update a global variable group
 * 
 * @param params - The request parameters
 * @returns The updated global variable group
 */
export async function updateGlobalVar(params: UpdateGlobalVarRequest): Promise<UpdateGlobalVarResponse> {
  const { organizationId, name, ...body } = params;
  const finalOrgId = await resolveOrganizationId(organizationId);
  
  try {
    const url = isRegionEdition()
      ? `/oapi/v1/appstack/globalVars/${name}`
      : `/oapi/v1/appstack/organizations/${finalOrgId}/globalVars/${name}`;
    const response = await yunxiaoRequest(
      url,
      {
        method: 'PUT',
        body: body,
      }
    );
    return UpdateGlobalVarResponseSchema.parse(response);
  } catch (error) {
    throw error;
  }
}

/**
 * List global variable groups
 * 
 * @param params - The request parameters
 * @returns The list of global variable groups
 */
export async function listGlobalVars(params: ListGlobalVarsRequest): Promise<ListGlobalVarsResponse> {
  const { organizationId, current, pageSize, search } = params;
  const finalOrgId = await resolveOrganizationId(organizationId);
  
  // Build query string properly
  const query: Record<string, string | number> = {
    current: current,
    pageSize: pageSize
  };
  
  try {
    const baseUrl = isRegionEdition()
      ? `/oapi/v1/appstack/globalVars:search`
      : `/oapi/v1/appstack/organizations/${finalOrgId}/globalVars:search`;
    const url = buildUrl(baseUrl, query);
    
    const response = await yunxiaoRequest(
      url,
      {
        method: 'POST',
        body: { search },
      }
    );
    return ListGlobalVarsResponseSchema.parse(response);
  } catch (error) {
    throw error;
  }
}