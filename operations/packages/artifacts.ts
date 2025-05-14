import { yunxiaoRequest, buildUrl } from "../../common/utils.js";
import {
  ArtifactSchema,
  Artifact,
} from "../../common/types.js";

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
  organizationId: string,
  repoId: string,
  repoType: string,
  page?: number,
  perPage?: number,
  search?: string,
  orderBy: string = "latestUpdate",
  sort: string = "desc"
): Promise<Artifact[]> {
  const baseUrl = `/oapi/v1/packages/organizations/${organizationId}/repositories/${repoId}/artifacts`;

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
  organizationId: string,
  repoId: string,
  id: number,
  repoType: string
): Promise<Artifact | null> {
  const baseUrl = `/oapi/v1/packages/organizations/${organizationId}/repositories/${repoId}/artifacts/${id}`;

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
