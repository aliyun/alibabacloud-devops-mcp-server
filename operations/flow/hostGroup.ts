import * as utils from "../../common/utils.js";
import { resolveOrganizationId } from "../organization/organization.js";
import { HostGroupSchema, HostGroup, ListHostGroupsSchema } from "./types.js";

/**
 * 获取主机组列表
 * @param organizationId 组织ID
 * @param options 查询选项
 * @returns 主机组列表
 */
export async function listHostGroupsFunc(
  organizationId: string | undefined,
  options?: {
    ids?: string;
    name?: string;
    createStartTime?: number;
    createEndTime?: number;
    creatorAccountIds?: string;
    perPage?: number;
    page?: number;
    pageSort?: string;
    pageOrder?: string;
  }
): Promise<HostGroup[]> {
  const finalOrgId = await resolveOrganizationId(organizationId);
  const baseUrl = utils.isRegionEdition()
    ? `/oapi/v1/flow/hostGroups`
    : `/oapi/v1/flow/organizations/${finalOrgId}/hostGroups`;
  
  // 构建查询参数
  const queryParams: Record<string, string | number | undefined> = {};
  
  if (options?.ids !== undefined) {
    queryParams.ids = options.ids;
  }
  
  if (options?.name !== undefined) {
    queryParams.name = options.name;
  }
  
  if (options?.createStartTime !== undefined) {
    queryParams.createStartTime = options.createStartTime;
  }
  
  if (options?.createEndTime !== undefined) {
    queryParams.createEndTime = options.createEndTime;
  }
  
  if (options?.creatorAccountIds !== undefined) {
    queryParams.creatorAccountIds = options.creatorAccountIds;
  }
  
  if (options?.perPage !== undefined) {
    queryParams.perPage = options.perPage;
  }
  
  if (options?.page !== undefined) {
    queryParams.page = options.page;
  }
  
  if (options?.pageSort !== undefined) {
    queryParams.pageSort = options.pageSort;
  }
  
  if (options?.pageOrder !== undefined) {
    queryParams.pageOrder = options.pageOrder;
  }

  const url = utils.buildUrl(baseUrl, queryParams);
  
  const response = await utils.yunxiaoRequest(url, {
    method: "GET",
  });

  if (!Array.isArray(response)) {
    return [];
  }

  return response.map(item => HostGroupSchema.parse(item));
}
