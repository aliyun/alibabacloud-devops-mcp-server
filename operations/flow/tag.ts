import * as utils from "../../common/utils.js";
import { resolveOrganizationId } from "../organization/organization.js";
import { z } from "zod";

// 定义标签和标签分类的Zod模式
export const TagGroupSchema = z.object({
  id: z.number().int().nullable().optional().describe("标签分类 id"),
  name: z.string().nullable().optional().describe("标签分类名称"),
  creatorAccountId: z.string().nullable().optional().describe("创建人"),
  modifierAccountId: z.string().nullable().optional().describe("更新人"),
});

export const TagSchema = z.object({
  id: z.number().int().nullable().optional().describe("标签 id"),
  name: z.string().nullable().optional().describe("标签名称"),
  color: z.string().nullable().optional().describe("标签颜色"),
  creatorAccountId: z.string().nullable().optional().describe("创建人"),
  modifierAccountId: z.string().nullable().optional().describe("更新人"),
});

export const TagGroupWithTagsSchema = TagGroupSchema.extend({
  flowTagList: z.array(TagSchema).nullable().optional().describe("标签列表"),
});

// 定义API请求参数的Zod模式
export const BaseTagSchema = z.object({
  organizationId: z.string().describe("企业Id"),
});

export const CreateTagSchema = BaseTagSchema.extend({
  name: z.string().describe("标签名称"),
  color: z.string().describe("#1F9AEF 蓝色; #E63A3A 红色; #FA8C15 黄色; #15AD31 绿色; #7978E5 紫色; #8C8C8C 灰色"),
  flowTagGroupId: z.number().int().describe("标签分类 id"),
});

export const CreateTagGroupSchema = BaseTagSchema.extend({
  name: z.string().describe("标签分类名称"),
});

export const DeleteTagGroupSchema = BaseTagSchema.extend({
  id: z.number().int().describe("标签分类 id"),
});

export const UpdateTagGroupSchema = DeleteTagGroupSchema.extend({
  name: z.string().describe("标签分类名称"),
});

export const DeleteTagSchema = BaseTagSchema.extend({
  id: z.number().int().describe("标签 id"),
});

export const UpdateTagSchema = DeleteTagSchema.extend({
  name: z.string().describe("标签名称"),
  color: z.string().describe("#1F9AEF 蓝色; #E63A3A 红色; #FA8C15 黄色; #15AD31 绿色; #7978E5 紫色; #8C8C8C 灰色"),
  flowTagGroupId: z.number().int().describe("标签分类 id"),
});

export const GetTagGroupSchema = DeleteTagGroupSchema;

// 定义类型
export type TagGroup = z.infer<typeof TagGroupSchema>;
export type Tag = z.infer<typeof TagSchema>;
export type TagGroupWithTags = z.infer<typeof TagGroupWithTagsSchema>;
export type CreateTagParams = z.infer<typeof CreateTagSchema>;
export type CreateTagGroupParams = z.infer<typeof CreateTagGroupSchema>;
export type DeleteTagGroupParams = z.infer<typeof DeleteTagGroupSchema>;
export type UpdateTagGroupParams = z.infer<typeof UpdateTagGroupSchema>;
export type DeleteTagParams = z.infer<typeof DeleteTagSchema>;
export type UpdateTagParams = z.infer<typeof UpdateTagSchema>;
export type GetTagGroupParams = z.infer<typeof GetTagGroupSchema>;

/**
 * 创建标签
 * @param organizationId 企业Id
 * @param name 标签名称
 * @param color 标签颜色
 * @param flowTagGroupId 标签分类 id
 * @returns 标签 id
 */
export async function createTagFunc(
  organizationId: string | undefined,
  name: string,
  color: string,
  flowTagGroupId: number
): Promise<number> {
  const finalOrgId = await resolveOrganizationId(organizationId);
  const url = utils.isRegionEdition()
    ? `/oapi/v1/flow/tags`
    : `/oapi/v1/flow/organizations/${finalOrgId}/tags`;
  
  const queryParams = { name, color, flowTagGroupId };
  const fullUrl = utils.buildUrl(url, queryParams);

  const response = await utils.yunxiaoRequest(fullUrl, {
    method: "POST",
  });

  return Number(response);
}

/**
 * 创建标签分类
 * @param organizationId 企业Id
 * @param name 标签分类名称
 * @returns 标签分类 id
 */
export async function createTagGroupFunc(
  organizationId: string | undefined,
  name: string
): Promise<number> {
  const finalOrgId = await resolveOrganizationId(organizationId);
  const url = utils.isRegionEdition()
    ? `/oapi/v1/flow/tagGroups`
    : `/oapi/v1/flow/organizations/${finalOrgId}/tagGroups`;
  
  const queryParams = { name };
  const fullUrl = utils.buildUrl(url, queryParams);

  const response = await utils.yunxiaoRequest(fullUrl, {
    method: "POST",
  });

  return Number(response);
}

/**
 * 获取流水线分类列表
 * @param organizationId 企业Id
 * @returns 流水线分类列表
 */
export async function listTagGroupsFunc(
  organizationId: string | undefined
): Promise<TagGroup[]> {
  const finalOrgId = await resolveOrganizationId(organizationId);
  const url = utils.isRegionEdition()
    ? `/oapi/v1/flow/tagGroups`
    : `/oapi/v1/flow/organizations/${finalOrgId}/tagGroups`;

  const response = await utils.yunxiaoRequest(url, {
    method: "GET",
  });

  if (Array.isArray(response)) {
    return response.map(item => TagGroupSchema.parse(item));
  }

  return [];
}

/**
 * 删除标签分类
 * @param organizationId 企业Id
 * @param id 标签分类 id
 * @returns 是否成功
 */
export async function deleteTagGroupFunc(
  organizationId: string | undefined,
  id: number
): Promise<boolean> {
  const finalOrgId = await resolveOrganizationId(organizationId);
  const url = utils.isRegionEdition()
    ? `/oapi/v1/flow/tagGroups/${id}`
    : `/oapi/v1/flow/organizations/${finalOrgId}/tagGroups/${id}`;

  const response = await utils.yunxiaoRequest(url, {
    method: "DELETE",
  });

  return Boolean(response);
}

/**
 * 更新标签分类
 * @param organizationId 企业Id
 * @param id 标签分类 id
 * @param name 标签分类名称
 * @returns 是否成功
 */
export async function updateTagGroupFunc(
  organizationId: string | undefined,
  id: number,
  name: string
): Promise<boolean> {
  const finalOrgId = await resolveOrganizationId(organizationId);
  const url = utils.isRegionEdition()
    ? `/oapi/v1/flow/tagGroups/${id}`
    : `/oapi/v1/flow/organizations/${finalOrgId}/tagGroups/${id}`;
  
  const queryParams = { name };
  const fullUrl = utils.buildUrl(url, queryParams);

  const response = await utils.yunxiaoRequest(fullUrl, {
    method: "PUT",
  });

  return Boolean(response);
}

/**
 * 获取标签分类
 * @param organizationId 企业Id
 * @param id 标签分类 id
 * @returns 标签分类
 */
export async function getTagGroupFunc(
  organizationId: string | undefined,
  id: number
): Promise<TagGroupWithTags> {
  const finalOrgId = await resolveOrganizationId(organizationId);
  const url = utils.isRegionEdition()
    ? `/oapi/v1/flow/tagGroups/${id}`
    : `/oapi/v1/flow/organizations/${finalOrgId}/tagGroups/${id}`;

  const response = await utils.yunxiaoRequest(url, {
    method: "GET",
  });

  return TagGroupWithTagsSchema.parse(response);
}

/**
 * 删除标签
 * @param organizationId 企业Id
 * @param id 标签 id
 * @returns 是否成功
 */
export async function deleteTagFunc(
  organizationId: string | undefined,
  id: number
): Promise<boolean> {
  const finalOrgId = await resolveOrganizationId(organizationId);
  const url = utils.isRegionEdition()
    ? `/oapi/v1/flow/tags/${id}`
    : `/oapi/v1/flow/organizations/${finalOrgId}/tags/${id}`;

  const response = await utils.yunxiaoRequest(url, {
    method: "DELETE",
  });

  return Boolean(response);
}

/**
 * 更新标签
 * @param organizationId 企业Id
 * @param id 标签 id
 * @param name 标签名称
 * @param color 标签颜色
 * @param flowTagGroupId 标签分类 id
 * @returns 是否成功
 */
export async function updateTagFunc(
  organizationId: string | undefined,
  id: number,
  name: string,
  color: string,
  flowTagGroupId: number
): Promise<boolean> {
  const finalOrgId = await resolveOrganizationId(organizationId);
  const url = utils.isRegionEdition()
    ? `/oapi/v1/flow/tags/${id}`
    : `/oapi/v1/flow/organizations/${finalOrgId}/tags/${id}`;
  
  const queryParams = { name, color, flowTagGroupId };
  const fullUrl = utils.buildUrl(url, queryParams);

  const response = await utils.yunxiaoRequest(fullUrl, {
    method: "PUT",
  });

  return Boolean(response);
}
