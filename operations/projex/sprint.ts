import { z } from "zod";
import { yunxiaoRequest, buildUrl } from "../../common/utils.js";
import {
  SprintInfoSchema
} from "../../common/types.js";

// Function implementations
export async function getSprintFunc(
  organizationId: string,
  projectId: string,
  id: string
): Promise<z.infer<typeof SprintInfoSchema>> {
  const url = `/oapi/v1/projex/organizations/${organizationId}/projects/${projectId}/sprints/${id}`;

  const response = await yunxiaoRequest(url, {
    method: "GET",
  });

  return SprintInfoSchema.parse(response);
}

export async function listSprintsFunc(
  organizationId: string,
  id: string,
  status?: string,
  page?: number,
  perPage?: number
): Promise<z.infer<typeof SprintInfoSchema>[]> {
  const baseUrl = `/oapi/v1/projex/organizations/${organizationId}/projects/${id}/sprints`;

  // Build query parameters
  const queryParams: Record<string, string | number | undefined> = {};

  // Add optional parameters
  if (status !== undefined) {
    queryParams.status = status;
  }

  if (page !== undefined) {
    queryParams.page = page;
  }

  if (perPage !== undefined) {
    queryParams.perPage = perPage;
  }

  // Use buildUrl function to construct URL with query parameters
  const url = buildUrl(baseUrl, queryParams);

  const response = await yunxiaoRequest(url, {
    method: "GET",
  });

  // Ensure response is an array
  if (!Array.isArray(response)) {
    return [];
  }

  // Parse each sprint object
  return response.map(sprint => SprintInfoSchema.parse(sprint));
} 