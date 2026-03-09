import { z } from 'zod';
import { yunxiaoRequest, buildUrl, isRegionEdition } from '../../common/utils.js';
import { resolveOrganizationId } from '../organization/organization.js';

// Schema for the SearchAppTemplates API
export const SearchAppTemplatesRequestSchema = z.object({
  organizationId: z.string().describe("组织ID"),
  pagination: z.enum(['keyset']).optional().default('keyset').describe("分页模式参数，目前只支持键集分页 keyset 模式"),
  perPage: z.number().optional().describe("分页尺寸参数，决定一页最多返回多少对象"),
  orderBy: z.enum(['id', 'gmtCreate']).optional().default('id').describe("分页排序属性，决定根据何种属性进行记录排序；推荐在实现严格遍历时，使用 id 属性"),
  sort: z.enum(['asc', 'desc']).optional().default('asc').describe("分页排序升降序，asc 为升序，desc 为降序；推荐在实现严格遍历时，使用升序"),
  nextToken: z.string().optional().describe("键集分页 token，获取第一页数据时无需传入，否则需要传入前一页查询结果中的 nextToken 字段"),
  displayNameKeyword: z.string().optional().describe("按展示名进行模糊搜索的关键字"),
  page: z.number().optional().default(1).describe("页码分页时使用，用于获取下一页内容"),
});

export const SearchAppTemplatesResponseSchema = z.object({
  current: z.number().optional().nullable().describe("页码分页时存在该字段，表示当前页"),
  data: z.array(z.object({
    cover: z.string().nullable().optional().describe("应用模板封面"),
    creatorId: z.string().nullable().optional().describe("应用模板创建人"),
    description: z.string().nullable().optional().describe("应用模板描述"),
    displayName: z.string().nullable().optional().describe("应用模板展示名称"),
    gmtCreate: z.string().nullable().optional().describe("应用模板创建时间"),
    gmtModified: z.string().nullable().optional().describe("应用模板修改时间"),
    modifierId: z.string().nullable().optional().describe("应用模板修改人"),
    name: z.string().nullable().optional().describe("应用模板名称"),
    type: z.enum(['CUSTOMIZE', 'PRESET']).nullable().optional().describe("应用模板类型"),
  })).describe("分页结果数据"),
  nextToken: z.string().nullable().optional().describe("采用键值分页时存在该字段，用于传给分页接口，迭代获取下一页数据"),
  pages: z.number().nullable().optional().describe("页码分页时存在该字段，表示总页数"),
  perPage: z.number().nullable().optional().describe("页码分页时存在该字段，表示每页大小"),
  total: z.number().nullable().optional().describe("页码分页时存在该字段，表示结果总数"),
});

export type SearchAppTemplatesRequest = z.infer<typeof SearchAppTemplatesRequestSchema>;
export type SearchAppTemplatesResponse = z.infer<typeof SearchAppTemplatesResponseSchema>;

/**
 * Search application templates
 * 
 * @param params - The request parameters
 * @returns The list of application templates
 */
export async function searchAppTemplates(params: SearchAppTemplatesRequest): Promise<SearchAppTemplatesResponse> {
  const { organizationId, ...queryParams } = params;
  const finalOrgId = await resolveOrganizationId(organizationId);
  
  // Build query string properly
  const query: Record<string, string | number> = {};
  if (queryParams.pagination) query.pagination = queryParams.pagination;
  if (queryParams.perPage) query.perPage = queryParams.perPage;
  if (queryParams.orderBy) query.orderBy = queryParams.orderBy;
  if (queryParams.sort) query.sort = queryParams.sort;
  if (queryParams.nextToken) query.nextToken = queryParams.nextToken;
  if (queryParams.displayNameKeyword) query.displayNameKeyword = queryParams.displayNameKeyword;
  if (queryParams.page) query.page = queryParams.page;
  
  try {
    // Build the full URL with query parameters
    const baseUrl = isRegionEdition()
      ? `/oapi/v1/appstack/appTemplates:search`
      : `/oapi/v1/appstack/organizations/${finalOrgId}/appTemplates:search`;
    const url = buildUrl(baseUrl, query);
    
    const response = await yunxiaoRequest(
      url,
      {
        method: 'GET',
      }
    );
    return SearchAppTemplatesResponseSchema.parse(response);
  } catch (error) {
    throw error;
  }
}