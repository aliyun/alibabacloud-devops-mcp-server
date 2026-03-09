import * as utils from "../../common/utils.js";
import { resolveOrganizationId } from "../organization/organization.js";
import { z } from "zod";

// 定义资源成员的Zod模式
export const ResourceMemberSchema = z.object({
  username: z.string().nullable().optional().describe("用户名"),
  userId: z.string().nullable().optional().describe("用户id"),
  role: z.string().nullable().optional().describe("用户角色"),
});

// 定义API请求参数的Zod模式
export const ResourceMemberBaseSchema = z.object({
  organizationId: z.string().describe("企业Id"),
  resourceType: z.string().describe("资源类型 pipeline 流水线 hostGroup 主机组"),
  resourceId: z.string().describe("资源Id"),
});

export const DeleteResourceMemberSchema = ResourceMemberBaseSchema.extend({
  userId: z.string().describe("用户Id"),
});

export const UpdateResourceMemberSchema = ResourceMemberBaseSchema.extend({
  roleName: z.string().describe("角色部署组 hostGroup: user(成员，使用权限) admin(管理员，使用编辑权限) 流水线 pipeline: admin(管理员，查看、运行、编辑权限) member(运行权限) viewer(查看权限)"),
  userId: z.string().describe("用户id"),
});

export const CreateResourceMemberSchema = ResourceMemberBaseSchema.extend({
  roleName: z.string().describe("角色部署组 hostGroup: user(成员，使用权限) admin(管理员，使用编辑权限) owner(拥有者，所有权限)  流水线 pipeline: owner(拥有者，所有权限) admin(管理员，查看、运行、编辑权限) member(运行权限) viewer(查看权限)"),
  userId: z.string().describe("用户id"),
});

export const UpdateResourceOwnerSchema = ResourceMemberBaseSchema.extend({
  newOwnerId: z.string().describe("新拥有者用户Id"),
});

// 定义资源成员类型
export type ResourceMember = z.infer<typeof ResourceMemberSchema>;
export type DeleteResourceMemberParams = z.infer<typeof DeleteResourceMemberSchema>;
export type UpdateResourceMemberParams = z.infer<typeof UpdateResourceMemberSchema>;
export type CreateResourceMemberParams = z.infer<typeof CreateResourceMemberSchema>;
export type UpdateResourceOwnerParams = z.infer<typeof UpdateResourceOwnerSchema>;

/**
 * 删除资源成员
 * @param organizationId 企业Id
 * @param resourceType 资源类型 pipeline 流水线 hostGroup 主机组
 * @param resourceId 资源Id
 * @param userId 用户Id
 * @returns 是否成功
 */
export async function deleteResourceMemberFunc(
  organizationId: string | undefined,
  resourceType: string,
  resourceId: string,
  userId: string
): Promise<boolean> {
  const finalOrgId = await resolveOrganizationId(organizationId);
  const url = utils.isRegionEdition()
    ? `/oapi/v1/flow/resourceMembers/resourceTypes/${resourceType}/resourceIds/${resourceId}`
    : `/oapi/v1/flow/organizations/${finalOrgId}/resourceMembers/resourceTypes/${resourceType}/resourceIds/${resourceId}`;
  
  const queryParams = { userId };
  const fullUrl = utils.buildUrl(url, queryParams);

  const response = await utils.yunxiaoRequest(fullUrl, {
    method: "DELETE",
  });

  return Boolean(response);
}

/**
 * 获取资源成员列表
 * @param organizationId 企业Id
 * @param resourceType 资源类型 pipeline 流水线 hostGroup 主机组
 * @param resourceId 资源Id
 * @returns 资源成员列表
 */
export async function listResourceMembersFunc(
  organizationId: string | undefined,
  resourceType: string,
  resourceId: string
): Promise<ResourceMember[]> {
  const finalOrgId = await resolveOrganizationId(organizationId);
  const url = utils.isRegionEdition()
    ? `/oapi/v1/flow/resourceMembers/resourceTypes/${resourceType}/resourceIds/${resourceId}`
    : `/oapi/v1/flow/organizations/${finalOrgId}/resourceMembers/resourceTypes/${resourceType}/resourceIds/${resourceId}`;

  const response = await utils.yunxiaoRequest(url, {
    method: "GET",
  });

  if (Array.isArray(response)) {
    return response.map(item => ResourceMemberSchema.parse(item));
  }

  // 如果响应不是数组，但包含数据，尝试解析单个对象
  try {
    return [ResourceMemberSchema.parse(response)];
  } catch {
    return [];
  }
}

/**
 * 更新资源成员
 * @param organizationId 企业Id
 * @param resourceType 资源类型 pipeline 流水线 hostGroup 主机组
 * @param resourceId 资源Id
 * @param roleName 角色
 * @param userId 用户id
 * @returns 是否成功
 */
export async function updateResourceMemberFunc(
  organizationId: string | undefined,
  resourceType: string,
  resourceId: string,
  roleName: string,
  userId: string
): Promise<boolean> {
  const finalOrgId = await resolveOrganizationId(organizationId);
  const url = utils.isRegionEdition()
    ? `/oapi/v1/flow/resourceMembers/resourceTypes/${resourceType}/resourceIds/${resourceId}`
    : `/oapi/v1/flow/organizations/${finalOrgId}/resourceMembers/resourceTypes/${resourceType}/resourceIds/${resourceId}`;
  
  const queryParams = { roleName, userId };
  const fullUrl = utils.buildUrl(url, queryParams);

  const response = await utils.yunxiaoRequest(fullUrl, {
    method: "PUT",
  });

  return Boolean(response);
}

/**
 * 插入资源成员
 * @param organizationId 企业Id
 * @param resourceType 资源类型 pipeline 流水线 hostGroup 主机组
 * @param resourceId 资源Id
 * @param roleName 角色
 * @param userId 用户id
 * @returns 是否成功
 */
export async function createResourceMemberFunc(
  organizationId: string | undefined,
  resourceType: string,
  resourceId: string,
  roleName: string,
  userId: string
): Promise<boolean> {
  const finalOrgId = await resolveOrganizationId(organizationId);
  const url = utils.isRegionEdition()
    ? `/oapi/v1/flow/resourceMembers/resourceTypes/${resourceType}/resourceIds/${resourceId}`
    : `/oapi/v1/flow/organizations/${finalOrgId}/resourceMembers/resourceTypes/${resourceType}/resourceIds/${resourceId}`;
  
  const queryParams = { roleName, userId };
  const fullUrl = utils.buildUrl(url, queryParams);

  const response = await utils.yunxiaoRequest(fullUrl, {
    method: "POST",
  });

  return Boolean(response);
}

/**
 * 移交资源对象拥有者
 * @param organizationId 企业Id
 * @param resourceType 资源类型 pipeline 流水线 hostGroup 主机组
 * @param resourceId 资源Id
 * @param newOwnerId 新拥有者用户Id
 * @returns 是否成功
 */
export async function updateResourceOwnerFunc(
  organizationId: string | undefined,
  resourceType: string,
  resourceId: string,
  newOwnerId: string
): Promise<boolean> {
  const finalOrgId = await resolveOrganizationId(organizationId);
  const url = utils.isRegionEdition()
    ? `/oapi/v1/flow/resourceMembers/resourceTypes/${resourceType}/resourceIds/${resourceId}/transfer/owner`
    : `/oapi/v1/flow/organizations/${finalOrgId}/resourceMembers/resourceTypes/${resourceType}/resourceIds/${resourceId}/transfer/owner`;
  
  const queryParams = { newOwnerId };
  const fullUrl = utils.buildUrl(url, queryParams);

  const response = await utils.yunxiaoRequest(fullUrl, {
    method: "POST",
  });

  return Boolean(response);
}
