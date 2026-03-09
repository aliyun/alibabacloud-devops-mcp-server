import * as utils from "../../common/utils.js";
import { resolveOrganizationId } from "../organization/organization.js";
import { ServiceConnectionSchema, ServiceConnection, ListServiceConnectionsSchema } from "./types.js";

/**
 * 获取服务连接列表
 * @param organizationId 组织ID
 * @param serviceConnectionType 服务连接类型
 * @returns 服务连接列表
 */
export async function listServiceConnectionsFunc(
  organizationId: string | undefined,
  serviceConnectionType: string
): Promise<ServiceConnection[]> {
  const finalOrgId = await resolveOrganizationId(organizationId);
  const baseUrl = utils.isRegionEdition()
    ? `/oapi/v1/flow/serviceConnections`
    : `/oapi/v1/flow/organizations/${finalOrgId}/serviceConnections`;
  
  // 构建查询参数
  const queryParams: Record<string, string | number | undefined> = {
    sericeConnectionType: serviceConnectionType  // 注意：API文档中拼写为 sericeConnectionType
  };

  const url = utils.buildUrl(baseUrl, queryParams);
  
  const response = await utils.yunxiaoRequest(url, {
    method: "GET",
  });

  if (!Array.isArray(response)) {
    return [];
  }

  return response.map(item => ServiceConnectionSchema.parse(item));
}
