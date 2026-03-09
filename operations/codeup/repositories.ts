/**
 * 代码库（Repository）相关操作
 * 
 * 概念说明：
 * - 代码库（Repository）是云效平台中的代码管理单元，属于CodeUp产品
 * - 代码库与项目（Project）是不同的概念，项目属于项目管理领域
 * - 代码库用于存储和管理源代码，而项目用于管理工作项、迭代等
 * - 请勿混淆这两个概念，它们是不同的资源类型
 */

import { z } from "zod";
import {yunxiaoRequest, buildUrl, handleRepositoryIdEncoding, isRegionEdition} from "../../common/utils.js";
import { resolveOrganizationId } from "../organization/organization.js";
import { 
  RepositorySchema
} from "./types.js";


/**
 * 查询仓库详情
 * @param organizationId
 * @param repositoryId
 */
export async function getRepositoryFunc(
  organizationId: string | undefined,
  repositoryId: string
): Promise<z.infer<typeof RepositorySchema>> {
  const finalOrgId = await resolveOrganizationId(organizationId);
  const encodedRepoId = handleRepositoryIdEncoding(repositoryId);

  const url = isRegionEdition()
    ? `/oapi/v1/codeup/repositories/${encodedRepoId}`
    : `/oapi/v1/codeup/organizations/${finalOrgId}/repositories/${encodedRepoId}`;

  const response = await yunxiaoRequest(url, {
    method: "GET",
  });

  return RepositorySchema.parse(response);
}

/**
 * 查询仓库列表
 * @param organizationId
 * @param page
 * @param perPage
 * @param orderBy
 * @param sort
 * @param search
 * @param archived
 */
export async function listRepositoriesFunc(
  organizationId: string | undefined,
  page?: number,
  perPage?: number,
  orderBy?: string,
  sort?: string,
  search?: string,
  archived?: boolean
): Promise<z.infer<typeof RepositorySchema>[]> {
  const finalOrgId = await resolveOrganizationId(organizationId);
  const baseUrl = isRegionEdition()
    ? `/oapi/v1/codeup/repositories`
    : `/oapi/v1/codeup/organizations/${finalOrgId}/repositories`;

  const queryParams: Record<string, string | number | undefined> = {};
  
  if (page !== undefined) {
    queryParams.page = page;
  }
  
  if (perPage !== undefined) {
    queryParams.perPage = perPage;
  }
  
  if (orderBy !== undefined) {
    queryParams.orderBy = orderBy;
  }
  
  if (sort !== undefined) {
    queryParams.sort = sort;
  }
  
  if (search !== undefined) {
    queryParams.search = search;
  }
  
  if (archived !== undefined) {
    queryParams.archived = String(archived); // Convert boolean to string
  }

  const url = buildUrl(baseUrl, queryParams);

  const response = await yunxiaoRequest(url, {
    method: "GET",
  });

  if (!Array.isArray(response)) {
    return [];
  }

  return response.map(repo => RepositorySchema.parse(repo));
} 
