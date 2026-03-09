import { z } from 'zod';
import { yunxiaoRequest, buildUrl, isRegionEdition } from '../../common/utils.js';
import { resolveOrganizationId } from '../organization/organization.js';

// Schema for the CreateAppTag API
export const CreateAppTagRequestSchema = z.object({
  organizationId: z.string().describe("组织ID"),
  name: z.string().describe("应用标签名称"),
  color: z.string().describe("标签颜色：#66acab 蓝绿色, #7b9ab4 蓝灰色, #698cd4 明亮的蓝色, #4676e5 强烈的蓝色, #5c68c1 深蓝紫色, #9f76dA 紫色, #6bAe3f 绿色, #ae9e6b 土黄色, #a7bc60 浅绿, #ae785e 棕色, #eb933e 橙色, #d75644 红色"),
});

export const CreateAppTagResponseSchema = z.object({
  frontendStyle: z.string().describe("样式，目前仅含颜色"),
  name: z.string().describe("应用标签名称"),
});

// Schema for the UpdateAppTag API
export const UpdateAppTagRequestSchema = z.object({
  organizationId: z.string().describe("组织ID"),
  name: z.string().describe("应用标签名称"),
  newName: z.string().describe("要修改为的新的应用标签名称，如无需修改，请确保与原name相同"),
  color: z.string().optional().describe("应用标签颜色：#66acab 蓝绿色, #7b9ab4 蓝灰色, #698cd4 明亮的蓝色, #4676e5 强烈的蓝色, #5c68c1 深蓝紫色, #9f76dA 紫色, #6bAe3f 绿色, #ae9e6b 土黄色, #a7bc60 浅绿, #ae785e 棕色, #eb933e 橙色, #d75644 红色。若不填写则保持原有颜色不变"),
});

export const UpdateAppTagResponseSchema = z.object({
  frontendStyle: z.string().describe("样式，目前仅含颜色"),
  name: z.string().describe("应用标签名称"),
});

// Schema for the DeleteAppTag API
export const DeleteAppTagRequestSchema = z.object({
  organizationId: z.string().describe("组织ID"),
  name: z.string().describe("应用标签名称"),
});

// Schema for the SearchAppTag API
export const SearchAppTagRequestSchema = z.object({
  organizationId: z.string().describe("组织ID"),
  current: z.number().optional().describe("页数，从1开始。默认值为1"),
  pageSize: z.number().optional().describe("本页返回的数量，默认值为10"),
  orderBy: z.string().optional().describe("排序方式，支持tagName和id，默认为id"),
  sort: z.string().optional().describe("排序方式，支持asc和desc，默认为desc"),
  search: z.string().optional().describe("应用标签名称的模糊搜索"),
});

export const SearchAppTagResponseSchema = z.object({
  total: z.number().describe("当前搜索条件下的总数"),
  data: z.array(z.object({
    frontendStyle: z.string().optional().describe("样式，目前仅含颜色"),
    name: z.string().optional().describe("应用标签名称"),
  })).describe("返回的应用标签列表"),
});

// Schema for the UpdateAppTagBind API
export const UpdateAppTagBindRequestSchema = z.object({
  organizationId: z.string().describe("组织ID"),
  appName: z.string().describe("应用名"),
  tagNames: z.array(z.string()).describe("要绑定的应用标签名称列表。注意：tagNames中不存在的应用标签将被忽略。如果tagNames中的所有应用标签都不存在，或者tagNames为空数组，则会清空当前应用的应用标签列表"),
});

export type CreateAppTagRequest = z.infer<typeof CreateAppTagRequestSchema>;
export type CreateAppTagResponse = z.infer<typeof CreateAppTagResponseSchema>;
export type UpdateAppTagRequest = z.infer<typeof UpdateAppTagRequestSchema>;
export type UpdateAppTagResponse = z.infer<typeof UpdateAppTagResponseSchema>;
export type DeleteAppTagRequest = z.infer<typeof DeleteAppTagRequestSchema>;
export type SearchAppTagRequest = z.infer<typeof SearchAppTagRequestSchema>;
export type SearchAppTagResponse = z.infer<typeof SearchAppTagResponseSchema>;
export type UpdateAppTagBindRequest = z.infer<typeof UpdateAppTagBindRequestSchema>;

/**
 * Create an application tag
 * 
 * @param params - The request parameters
 * @returns The created tag details
 */
export async function createAppTag(params: CreateAppTagRequest): Promise<CreateAppTagResponse> {
  const { organizationId, ...body } = params;
  const finalOrgId = await resolveOrganizationId(organizationId);
  
  try {
    const url = isRegionEdition()
      ? `/oapi/v1/appstack/appTags`
      : `/oapi/v1/appstack/organizations/${finalOrgId}/appTags`;
    const response = await yunxiaoRequest(
      url,
      {
        method: 'POST',
        body: body,
      }
    );
    return CreateAppTagResponseSchema.parse(response);
  } catch (error) {
    throw error;
  }
}

/**
 * Update an application tag
 * 
 * @param params - The request parameters
 * @returns The updated tag details
 */
export async function updateAppTag(params: UpdateAppTagRequest): Promise<UpdateAppTagResponse> {
  const { organizationId, name, ...body } = params;
  const finalOrgId = await resolveOrganizationId(organizationId);
  
  try {
    const url = isRegionEdition()
      ? `/oapi/v1/appstack/appTags/updateTag?name=${name}`
      : `/oapi/v1/appstack/organizations/${finalOrgId}/appTags/updateTag?name=${name}`;
    const response = await yunxiaoRequest(
      url,
      {
        method: 'PUT',
        body: body,
      }
    );
    return UpdateAppTagResponseSchema.parse(response);
  } catch (error) {
    throw error;
  }
}

/**
 * Delete an application tag
 * 
 * @param params - The request parameters
 */
export async function deleteAppTag(params: DeleteAppTagRequest): Promise<void> {
  const { organizationId, name } = params;
  const finalOrgId = await resolveOrganizationId(organizationId);
  
  try {
    const url = isRegionEdition()
      ? `/oapi/v1/appstack/appTags/deleteTag?name=${name}`
      : `/oapi/v1/appstack/organizations/${finalOrgId}/appTags/deleteTag?name=${name}`;
    await yunxiaoRequest(
      url,
      {
        method: 'DELETE',
      }
    );
  } catch (error) {
    throw error;
  }
}

/**
 * Search application tags
 * 
 * @param params - The request parameters
 * @returns The search results
 */
export async function searchAppTag(params: SearchAppTagRequest): Promise<SearchAppTagResponse> {
  const { organizationId, current, pageSize, ...body } = params;
  const finalOrgId = await resolveOrganizationId(organizationId);
  
  // Build query string properly
  const query: Record<string, string | number> = {};
  if (current) query.current = current;
  if (pageSize) query.pageSize = pageSize;
  
  try {
    const baseUrl = isRegionEdition()
      ? `/oapi/v1/appstack/appTags:search`
      : `/oapi/v1/appstack/organizations/${finalOrgId}/appTags:search`;
    const url = buildUrl(baseUrl, query);
    
    const response = await yunxiaoRequest(
      url,
      {
        method: 'POST',
        body: body,
      }
    );
    return SearchAppTagResponseSchema.parse(response);
  } catch (error) {
    throw error;
  }
}

/**
 * Update application tag bindings
 * 
 * @param params - The request parameters
 */
export async function updateAppTagBind(params: UpdateAppTagBindRequest): Promise<void> {
  const { organizationId, appName, ...body } = params;
  const finalOrgId = await resolveOrganizationId(organizationId);
  
  try {
    const url = isRegionEdition()
      ? `/oapi/v1/appstack/apps/${appName}/appTags`
      : `/oapi/v1/appstack/organizations/${finalOrgId}/apps/${appName}/appTags`;
    await yunxiaoRequest(
      url,
      {
        method: 'PUT',
        body: body,
      }
    );
  } catch (error) {
    throw error;
  }
}