import { yunxiaoRequest, buildUrl, isRegionEdition } from "../../common/utils.js";
import { resolveOrganizationId } from "../organization/organization.js";
import {
  ArtifactSchema,
  Artifact,
} from "./types.js";

/**
 * 查询制品信息
 * @param organizationId
 * @param repoId
 * @param repoType
 * @param page
 * @param perPage
 * @param search
 * @param orderBy
 * @param sort
 * @returns 制品信息列表
 */
export async function listArtifactsFunc(
  organizationId: string | undefined,
  repoId: string,
  repoType: string,
  page?: number,
  perPage?: number,
  search?: string,
  orderBy: string = "latestUpdate",
  sort: string = "desc"
): Promise<Artifact[]> {
  const finalOrgId = await resolveOrganizationId(organizationId);
  const baseUrl = isRegionEdition()
    ? `/oapi/v1/packages/repositories/${repoId}/artifacts`
    : `/oapi/v1/packages/organizations/${finalOrgId}/repositories/${repoId}/artifacts`;

  const queryParams: Record<string, string | number | undefined> = {
    repoType,
  };

  if (page !== undefined) {
    queryParams.page = page;
  }

  if (perPage !== undefined) {
    queryParams.perPage = perPage;
  }

  if (search !== undefined) {
    queryParams.search = search;
  }

  queryParams.orderBy = orderBy;
  queryParams.sort = sort;

  const url = buildUrl(baseUrl, queryParams);

  const response = await yunxiaoRequest(url, {
    method: "GET",
  });

  if (!Array.isArray(response)) {
    return [];
  }

  return response.map(artifact => ArtifactSchema.parse(artifact));
}

/**
 * 查看单个制品信息
 * @param organizationId
 * @param repoId
 * @param id
 * @param repoType
 * @returns 制品信息
 */
export async function getArtifactFunc(
  organizationId: string | undefined,
  repoId: string,
  id: number,
  repoType: string
): Promise<Artifact | null> {
  const finalOrgId = await resolveOrganizationId(organizationId);
  const baseUrl = isRegionEdition()
    ? `/oapi/v1/packages/repositories/${repoId}/artifacts/${id}`
    : `/oapi/v1/packages/organizations/${finalOrgId}/repositories/${repoId}/artifacts/${id}`;

  const queryParams: Record<string, string | number | undefined> = {
    repoType,
  };

  const url = buildUrl(baseUrl, queryParams);

  try {
    const response = await yunxiaoRequest(url, {
      method: "GET",
    });

    return ArtifactSchema.parse(response);
  } catch (error) {
    console.error(`Error fetching artifact: ${error}`);
    return null;
  }
}
