import { z } from 'zod';
import { yunxiaoRequest, buildUrl, isRegionEdition } from '../../common/utils.js';
import { resolveOrganizationId } from '../organization/organization.js';
import { YunxiaoError } from '../../common/errors.js';

// Schema for the ListApplications API
export const ListApplicationsRequestSchema = z.object({
  organizationId: z.string().describe("组织id"),
  pagination: z.enum(['keyset']).default('keyset').describe("分页模式参数，目前只支持键集分页 keyset 模式"),
  perPage: z.number().optional().describe("分页尺寸参数，决定一页最多返回多少对象"),
  orderBy: z.string().optional().default("id").describe("分页排序属性，决定根据何种属性进行记录排序；推荐在实现严格遍历时，使用 id 属性"),
  sort: z.enum(['asc', 'desc']).optional().default('asc').describe("分页排序为升降序，asc 为升序，desc 为降序；推荐在实现严格遍历时，使用升序"),
  nextToken: z.string().optional().describe("分页 token，获取第一页数据时无需传入，否则需要传入前一页查询结果中的 nextToken 字段"),
});

export const ListApplicationsResponseSchema = z.object({
  data: z.array(z.object({
    appTemplateDisplayName: z.string().nullable().optional().describe("应用模版显示名称"),
    appTemplateName: z.string().nullable().optional().describe("应用模版名称"),
    creatorId: z.string().optional().describe("应用创建者id"),
    description: z.string().optional().describe("应用描述"),
    gmtCreate: z.string().optional().describe("创建时间"),
    name: z.string().optional().describe("应用名"),
  })),
  nextToken: z.string().nullable().optional(),
});

// Schema for the GetApplication API
export const GetApplicationRequestSchema = z.object({
  organizationId: z.string().describe("组织id"),
  appName: z.string().describe("应用名"),
});

export const GetApplicationResponseSchema = z.object({
  appTemplateDisplayName: z.string().nullable().optional().describe("应用模版展示名称"),
  appTemplateName: z.string().nullable().optional().describe("应用模版名称"),
  creatorId: z.string().optional().describe("应用创建者id"),
  description: z.string().optional().describe("应用描述"),
  gmtCreate: z.string().optional().describe("创建时间"),
  name: z.string().optional().describe("应用名"),
});

// Schema for the CreateApplication API
export const CreateApplicationRequestSchema = z.object({
  organizationId: z.string().describe("组织id"),
  name: z.string().describe("应用名"),
  appTemplateName: z.string().optional().describe("应用模板唯一名"),
  description: z.string().optional().describe("应用描述"),
  ownerId: z.string().optional().describe("应用 owner ID"),
  tags: z.array(z.string()).optional().describe("应用标签"),
});

export const CreateApplicationResponseSchema = z.object({
  appTemplateDisplayName: z.string().nullable().optional().describe("应用模版展示名称"),
  appTemplateName: z.string().nullable().optional().describe("应用模版名称"),
  creatorId: z.string().optional().describe("应用创建者id"),
  description: z.string().optional().describe("应用描述"),
  gmtCreate: z.string().optional().describe("创建时间"),
  name: z.string().optional().describe("应用名"),
});

// Schema for the UpdateApplication API
export const UpdateApplicationRequestSchema = z.object({
  organizationId: z.string().describe("组织id"),
  appName: z.string().describe("应用名"),
  ownerId: z.string().optional().describe("应用 owner ID"),
});

export const UpdateApplicationResponseSchema = z.object({
  appTemplateDisplayName: z.string().nullable().optional().describe("应用模版展示名称"),
  appTemplateName: z.string().nullable().optional().describe("应用模版名称"),
  creatorId: z.string().optional().describe("应用创建者id"),
  description: z.string().optional().describe("应用描述"),
  gmtCreate: z.string().optional().describe("创建时间"),
  name: z.string().optional().describe("应用名"),
});

export type ListApplicationsRequest = z.infer<typeof ListApplicationsRequestSchema>;
export type ListApplicationsResponse = z.infer<typeof ListApplicationsResponseSchema>;
export type GetApplicationRequest = z.infer<typeof GetApplicationRequestSchema>;
export type GetApplicationResponse = z.infer<typeof GetApplicationResponseSchema>;
export type CreateApplicationRequest = z.infer<typeof CreateApplicationRequestSchema>;
export type CreateApplicationResponse = z.infer<typeof CreateApplicationResponseSchema>;
export type UpdateApplicationRequest = z.infer<typeof UpdateApplicationRequestSchema>;
export type UpdateApplicationResponse = z.infer<typeof UpdateApplicationResponseSchema>;

/**
 * List applications in an organization with pagination
 * 
 * @param params - The request parameters
 * @returns The list of applications
 */
export async function listApplications(params: ListApplicationsRequest): Promise<ListApplicationsResponse> {
  const { organizationId, ...queryParams } = params;
  const finalOrgId = await resolveOrganizationId(organizationId);
  
  // Build query string properly
  const query: Record<string, string | number> = {};
  if (queryParams.pagination) query.pagination = queryParams.pagination;
  if (queryParams.perPage) query.perPage = queryParams.perPage;
  if (queryParams.orderBy) query.orderBy = queryParams.orderBy;
  if (queryParams.sort) query.sort = queryParams.sort;
  if (queryParams.nextToken) query.nextToken = queryParams.nextToken;
  
  try {
    // Build the full URL with query parameters
    const baseUrl = isRegionEdition()
      ? `/oapi/v1/appstack/apps:search`
      : `/oapi/v1/appstack/organizations/${finalOrgId}/apps:search`;
    const url = buildUrl(baseUrl, query);
    
    const response = await yunxiaoRequest(
      url,
      {
        method: 'GET',
      }
    );
    return ListApplicationsResponseSchema.parse(response);
  } catch (error) {
    throw error;
  }
}

/**
 * Get application details by name
 * 
 * @param params - The request parameters
 * @returns The application details
 */
export async function getApplication(params: GetApplicationRequest): Promise<GetApplicationResponse> {
  const { organizationId, appName } = params;
  const finalOrgId = await resolveOrganizationId(organizationId);
  
  try {
    const url = isRegionEdition()
      ? `/oapi/v1/appstack/apps/${appName}`
      : `/oapi/v1/appstack/organizations/${finalOrgId}/apps/${appName}`;
    const response = await yunxiaoRequest(
      url,
      {
        method: 'GET',
      }
    );
    return GetApplicationResponseSchema.parse(response);
  } catch (error) {
    throw error;
  }
}

/**
 * Create a new application
 * 
 * @param params - The request parameters
 * @returns The created application details
 */
export async function createApplication(params: CreateApplicationRequest): Promise<CreateApplicationResponse> {
  const { organizationId, ...body } = params;
  const finalOrgId = await resolveOrganizationId(organizationId);
  
  try {
    const url = isRegionEdition()
      ? `/oapi/v1/appstack/apps`
      : `/oapi/v1/appstack/organizations/${finalOrgId}/apps`;
    const response = await yunxiaoRequest(
      url,
      {
        method: 'POST',
        body: body,
      }
    );
    return CreateApplicationResponseSchema.parse(response);
  } catch (error) {
    throw error;
  }
}

/**
 * Update an existing application
 * 
 * @param params - The request parameters
 * @returns The updated application details
 */
export async function updateApplication(params: UpdateApplicationRequest): Promise<UpdateApplicationResponse> {
  const { organizationId, appName, ...body } = params;
  const finalOrgId = await resolveOrganizationId(organizationId);
  
  try {
    const url = isRegionEdition()
      ? `/oapi/v1/appstack/apps/${appName}`
      : `/oapi/v1/appstack/organizations/${finalOrgId}/apps/${appName}`;
    const response = await yunxiaoRequest(
      url,
      {
        method: 'PUT',
        body: body,
      }
    );
    return UpdateApplicationResponseSchema.parse(response);
  } catch (error) {
    throw error;
  }
}
