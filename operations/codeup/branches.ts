import { z } from "zod";
import {buildUrl, yunxiaoRequest, isRegionEdition} from "../../common/utils.js";
import { resolveOrganizationId } from "../organization/organization.js";
import {
  CodeupBranchSchema
} from "./types.js";

// Response type for delete branch operation
interface DeleteBranchResponse {
  branchName: string;
}

/**
 * 创建分支
 * @param organizationId
 * @param repositoryId
 * @param branch
 * @param ref
 */
export async function createBranchFunc(
    organizationId: string | undefined,
    repositoryId: string,
    branch: string,
    ref: string = "master"
): Promise<z.infer<typeof CodeupBranchSchema>>{
  const finalOrgId = await resolveOrganizationId(organizationId);
  // Automatically handle unencoded slashes in repositoryId
  if (repositoryId.includes("/")) {
    // Found unencoded slash, automatically URL encode it
    const parts = repositoryId.split("/", 2);
    if (parts.length === 2) {
      const encodedRepoName = encodeURIComponent(parts[1]);
      // Remove + signs from encoding (spaces are encoded as +, but we need %20)
      const formattedEncodedName = encodedRepoName.replace(/\+/g, "%20");
      repositoryId = `${parts[0]}%2F${formattedEncodedName}`;
    }
  }

  const baseUrl = isRegionEdition()
    ? `/oapi/v1/codeup/repositories/${repositoryId}/branches`
    : `/oapi/v1/codeup/organizations/${finalOrgId}/repositories/${repositoryId}/branches`;

  // Build query parameters
  const queryParams: Record<string, string | number | undefined> = {
    branch: branch,
    ref: ref
  };

  const url = buildUrl(baseUrl, queryParams);
  console.error("createBranchFunc url:" + url);

  const response = await yunxiaoRequest(url, {
    method: "POST",
  });
  return CodeupBranchSchema.parse(response);
}

/**
 * 获取分支详情
 * @param organizationId
 * @param repositoryId
 * @param branchName
 */
export async function getBranchFunc(
    organizationId: string | undefined,
    repositoryId: string,
    branchName: string
): Promise<z.infer<typeof CodeupBranchSchema>>{
  const finalOrgId = await resolveOrganizationId(organizationId);
  // Automatically handle unencoded slashes in repositoryId
  if (repositoryId.includes("/")) {
    // Found unencoded slash, automatically URL encode it
    const parts = repositoryId.split("/", 2);
    if (parts.length === 2) {
      const encodedRepoName = encodeURIComponent(parts[1]);
      // Remove + signs from encoding (spaces are encoded as +, but we need %20)
      const formattedEncodedName = encodedRepoName.replace(/\+/g, "%20");
      repositoryId = `${parts[0]}%2F${formattedEncodedName}`;
    }
  }

  // Automatically handle unencoded slashes in branchName
  if (branchName.includes("/")) {
    branchName = encodeURIComponent(branchName);
  }

  const url = isRegionEdition()
    ? `/oapi/v1/codeup/repositories/${repositoryId}/branches/${branchName}`
    : `/oapi/v1/codeup/organizations/${finalOrgId}/repositories/${repositoryId}/branches/${branchName}`;

  const response = await yunxiaoRequest(url, {
    method: "GET",
  });
  return CodeupBranchSchema.parse(response);
}

/**
 * 删除分支
 * @param organizationId
 * @param repositoryId
 * @param branchName
 */
export async function deleteBranchFunc(
    organizationId: string | undefined,
    repositoryId: string,
    branchName: string
): Promise<DeleteBranchResponse> {
  const finalOrgId = await resolveOrganizationId(organizationId);
  // Automatically handle unencoded slashes in repositoryId
  if (repositoryId.includes("/")) {
    // Found unencoded slash, automatically URL encode it
    const parts = repositoryId.split("/", 2);
    if (parts.length === 2) {
      const encodedRepoName = encodeURIComponent(parts[1]);
      // Remove + signs from encoding (spaces are encoded as +, but we need %20)
      const formattedEncodedName = encodedRepoName.replace(/\+/g, "%20");
      repositoryId = `${parts[0]}%2F${formattedEncodedName}`;
    }
  }

  // Automatically handle unencoded slashes in branchName
  if (branchName.includes("/")) {
    branchName = encodeURIComponent(branchName);
  }

  const url = isRegionEdition()
    ? `/oapi/v1/codeup/repositories/${repositoryId}/branches/${branchName}`
    : `/oapi/v1/codeup/organizations/${finalOrgId}/repositories/${repositoryId}/branches/${branchName}`;

  const response = await yunxiaoRequest(url, {
    method: "DELETE",
  });

  return {
    branchName: branchName
  };
}

/**
 * 查询分支列表
 * @param organizationId
 * @param repositoryId
 * @param page
 * @param perPage
 * @param sort
 * @param search
 */
export async function listBranchesFunc(
    organizationId: string | undefined,
    repositoryId: string,
    page?: number,
    perPage?: number,
    sort?: string, // Possible values: name_asc, name_desc, updated_asc, updated_desc
    search?: string
): Promise<z.infer<typeof CodeupBranchSchema>[]> {
  const finalOrgId = await resolveOrganizationId(organizationId);
  console.error("listBranchesFunc page:" + page + " perPage:" + perPage + " sort:" + sort + " search:" + search);
  // Automatically handle unencoded slashes in repositoryId
  if (repositoryId.includes("/")) {
    // Found unencoded slash, automatically URL encode it
    const parts = repositoryId.split("/", 2);
    if (parts.length === 2) {
      const encodedRepoName = encodeURIComponent(parts[1]);
      // Remove + signs from encoding (spaces are encoded as +, but we need %20)
      const formattedEncodedName = encodedRepoName.replace(/\+/g, "%20");
      repositoryId = `${parts[0]}%2F${formattedEncodedName}`;
    }
  }

  const baseUrl = isRegionEdition()
    ? `/oapi/v1/codeup/repositories/${repositoryId}/branches`
    : `/oapi/v1/codeup/organizations/${finalOrgId}/repositories/${repositoryId}/branches`;

  // Build query parameters - use lowercase parameter names as expected by the API
  const queryParams: Record<string, string | number | undefined> = {};
  if (page !== undefined && page !== null) {
    queryParams.page = page;
  }
  if (perPage !== undefined && perPage !== null) {
    queryParams.perPage = perPage;
  }
  if (sort !== undefined && sort !== null) {
    queryParams.sort = sort;
  }
  if (search !== undefined && search !== null) {
    queryParams.search = search;
  }

  const url = buildUrl(baseUrl, queryParams);

  const response = await yunxiaoRequest(url, {
    method: "GET",
  });

  if (!Array.isArray(response)) {
    return [];
  }

  // Map each branch object and handle null values
  return response.map(branchData => {
    // Filter out null values that would cause parsing errors
    // This is a defensive approach until we update all schemas properly
    return CodeupBranchSchema.parse(branchData);
  });
}

