import {
  OrganizationMembersSchema,
  OrganizationMembers,
  GetOrganizationMemberInfo,
  MemberInfoSchema, SearchOrganizationMembersResult, SearchOrganizationMembersResultSchema,
} from './types.js';
import {buildUrl, yunxiaoRequest, isRegionEdition} from "../../common/utils.js";
import {resolveOrganizationId} from "./organization.js";

/**
 * 查询组织成员列表
 * @param organizationId 组织ID
 * @param page 当前页，默认1
 * @param perPage 每页数据条数，默认100
 * @returns 组织成员列表
 */
export const getOrganizationMembersFunc = async (
  organizationId: string | undefined,
  page: number = 1,
  perPage: number = 100
): Promise<OrganizationMembers> => {
  const finalOrgId = await resolveOrganizationId(organizationId);

  const url = isRegionEdition()
    ? `/oapi/v1/platform/members`
    : `/oapi/v1/platform/organizations/${finalOrgId}/members`;

  const params = {
    page: page,
    perPage: perPage
  };
  const urlWithParams = buildUrl(url, params);

  const response = await yunxiaoRequest(urlWithParams, {
    method: "GET",
  });

  // 验证响应数据结构
  return OrganizationMembersSchema.parse(response);
};

/**
 * 查询组织成员详细信息
 * @param organizationId 组织ID
 * @param memberId 成员ID
 * @returns 组织成员详细信息
 */
export const getOrganizationMemberInfoFunc = async (
  organizationId: string | undefined,
  memberId: string
): Promise<GetOrganizationMemberInfo> => {
  const finalOrgId = await resolveOrganizationId(organizationId);
  const url = isRegionEdition()
    ? `/oapi/v1/platform/members/${memberId}`
    : `/oapi/v1/platform/organizations/${finalOrgId}/members/${memberId}`;
  const response = await yunxiaoRequest(url, {
    method: "GET",
  });

  return MemberInfoSchema.parse(response);
};

/**
 * 搜索组织成员
 * @param organizationId 组织ID
 * @param includeChildren
 * @param page 当前页，默认1
 * @param perPage 每页数据条数，默认100
 * @param deptIds
 * @param nextToken
 * @param query
 * @param roleIds
 * @param statuses
 * @returns 搜索到的组织成员列表
 */
export const searchOrganizationMembersFunc = async (
    organizationId: string | undefined,
    includeChildren: boolean = false,
    page: number = 1,
    perPage: number = 100,
    deptIds?: string[],
    nextToken? : string,
    query? : string,
    roleIds? : string[],
    statuses?: string[],

): Promise<SearchOrganizationMembersResult> => {
  const finalOrgId = await resolveOrganizationId(organizationId);
  const url = isRegionEdition()
    ? `/oapi/v1/platform/members:search`
    : `/oapi/v1/platform/organizations/${finalOrgId}/members:search`;

  const payload: Record<string, any> = {
    page: page,
    perPage: perPage
  };

  if (deptIds) {
    payload.deptIds = deptIds;
  }

  if (nextToken) {
    payload.nextToken = nextToken;
  }

  if (query) {
    payload.query = query;
  }

  if (roleIds) {
    payload.roleIds = roleIds;
  }

  if (statuses) {
    payload.statuses = statuses;
  }

  const response = await yunxiaoRequest(url, {
    method: "POST",
    body: payload,
  });

  // 验证响应数据结构
  return SearchOrganizationMembersResultSchema.parse(response);
};

/**
 * 通过用户ID查询组织成员详细信息
 * @param organizationId 组织ID
 * @param userId 用户ID
 * @returns 组织成员详细信息
 */
export const getOrganizationMemberByUserIdInfoFunc = async (
  organizationId: string | undefined,
  userId: string
): Promise<GetOrganizationMemberInfo> => {
  const finalOrgId = await resolveOrganizationId(organizationId);
  const url = isRegionEdition()
    ? `/oapi/v1/platform/members:readByUser`
    : `/oapi/v1/platform/organizations/${finalOrgId}/members:readByUser`;
  const params = {
    userId: userId
  };

  const urlWithParams = buildUrl(url, params);

  const response = await yunxiaoRequest(urlWithParams, {
    method: "GET",
  });

  return MemberInfoSchema.parse(response);
};
