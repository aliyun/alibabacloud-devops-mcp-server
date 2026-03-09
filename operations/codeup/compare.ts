import { z } from "zod";
import {yunxiaoRequest, buildUrl, handleRepositoryIdEncoding, isRegionEdition} from "../../common/utils.js";
import { resolveOrganizationId } from "../organization/organization.js";
import { 
  CompareSchema
} from "./types.js";


export async function getCompareFunc(
  organizationId: string | undefined,
  repositoryId: string,
  from: string,
  to: string,
  sourceType?: string, // Possible values: branch, tag
  targetType?: string, // Possible values: branch, tag
  straight?: string
): Promise<z.infer<typeof CompareSchema>> {
  const finalOrgId = await resolveOrganizationId(organizationId);
  const encodedRepoId = handleRepositoryIdEncoding(repositoryId);

  const baseUrl = isRegionEdition()
    ? `/oapi/v1/codeup/repositories/${encodedRepoId}/compares`
    : `/oapi/v1/codeup/organizations/${finalOrgId}/repositories/${encodedRepoId}/compares`;

  const queryParams: Record<string, string | undefined> = {
    from,
    to
  };
  
  if (sourceType !== undefined) {
    queryParams.sourceType = sourceType;
  }
  
  if (targetType !== undefined) {
    queryParams.targetType = targetType;
  }
  
  if (straight !== undefined) {
    queryParams.straight = straight;
  }

  const url = buildUrl(baseUrl, queryParams);

  const response = await yunxiaoRequest(url, {
    method: "GET",
  });

  return CompareSchema.parse(response);
} 
