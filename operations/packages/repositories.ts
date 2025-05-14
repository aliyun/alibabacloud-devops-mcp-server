import { yunxiaoRequest, buildUrl } from "../../common/utils.js";
import {
  PackageRepository,
  PackageRepositorySchema,
} from "../../common/types.js";

/**
 * 查看制品仓库信息
 * @param organizationId
 * @param repoTypes
 * @param repoCategories
 * @param perPage
 * @param page
 * @returns 制品仓库信息列表
 */
export async function listPackageRepositoriesFunc(
  organizationId: string,
  repoTypes?: string,
  repoCategories?: string,
  perPage?: number,
  page?: number
): Promise<PackageRepository[]> {
  const baseUrl = `/oapi/v1/packages/organizations/${organizationId}/repositories`;

  const queryParams: Record<string, string | number | undefined> = {};
  
  if (repoTypes !== undefined) {
    queryParams.repoTypes = repoTypes;
  }
  
  if (repoCategories !== undefined) {
    queryParams.repoCategories = repoCategories;
  }
  
  if (perPage !== undefined) {
    queryParams.perPage = perPage;
  }
  
  if (page !== undefined) {
    queryParams.page = page;
  }

  const url = buildUrl(baseUrl, queryParams);

  const response = await yunxiaoRequest(url, {
    method: "GET",
  });

  if (!Array.isArray(response)) {
    return [];
  }

  return response.map(repo => PackageRepositorySchema.parse(repo));
}
