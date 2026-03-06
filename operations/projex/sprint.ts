import { z } from "zod";
import { yunxiaoRequest, buildUrl, isRegionEdition } from "../../common/utils.js";
import { resolveOrganizationId } from "../organization/organization.js";
import {
  SprintInfoSchema
} from "./types.js";

// Create Sprint Response Schema
const CreateSprintResponseSchema = z.object({
  id: z.string().describe("Created sprint ID"),
});

export async function getSprintFunc(
  organizationId: string | undefined,
  projectId: string,
  id: string
): Promise<z.infer<typeof SprintInfoSchema>> {
  const finalOrgId = await resolveOrganizationId(organizationId);
  const url = isRegionEdition()
    ? `/oapi/v1/projex/projects/${projectId}/sprints/${id}`
    : `/oapi/v1/projex/organizations/${finalOrgId}/projects/${projectId}/sprints/${id}`;

  const response = await yunxiaoRequest(url, {
    method: "GET",
  });

  return SprintInfoSchema.parse(response);
}

export async function listSprintsFunc(
  organizationId: string | undefined,
  id: string,
  status?: string[],
  page?: number,
  perPage?: number
): Promise<z.infer<typeof SprintInfoSchema>[]> {
  const finalOrgId = await resolveOrganizationId(organizationId);
  const baseUrl = isRegionEdition()
    ? `/oapi/v1/projex/projects/${id}/sprints`
    : `/oapi/v1/projex/organizations/${finalOrgId}/projects/${id}/sprints`;

  const queryParams: Record<string, string | number | undefined> = {};

  if (status !== undefined && status.length > 0) {
    queryParams.status = status.join(',');
  }

  if (page !== undefined) {
    queryParams.page = page;
  }

  if (perPage !== undefined) {
    queryParams.perPage = perPage;
  }

  const url = buildUrl(baseUrl, queryParams);

  const response = await yunxiaoRequest(url, {
    method: "GET",
  });

  if (!Array.isArray(response)) {
    return [];
  }

  return response.map(sprint => SprintInfoSchema.parse(sprint));
}

export async function createSprintFunc(
  organizationId: string | undefined,
  projectId: string,
  name: string,
  owners: string[],
  startDate?: string,
  endDate?: string,
  description?: string,
  capacityHours?: number,
  operatorId?: string
): Promise<{ id: string }> {
  const finalOrgId = await resolveOrganizationId(organizationId);
  const url = isRegionEdition()
    ? `/oapi/v1/projex/projects/${projectId}/sprints`
    : `/oapi/v1/projex/organizations/${finalOrgId}/projects/${projectId}/sprints`;

  const requestBody: Record<string, any> = {
    name,
    owners,
  };

  if (startDate !== undefined) {
    requestBody.startDate = startDate;
  }

  if (endDate !== undefined) {
    requestBody.endDate = endDate;
  }

  if (description !== undefined) {
    requestBody.description = description;
  }

  if (capacityHours !== undefined) {
    requestBody.capacityHours = capacityHours;
  }

  if (operatorId !== undefined) {
    requestBody.operatorId = operatorId;
  }

  const response = await yunxiaoRequest(url, {
    method: "POST",
    body: requestBody,
  });

  return CreateSprintResponseSchema.parse(response);
}

export async function updateSprintFunc(
  organizationId: string | undefined,
  projectId: string,
  id: string,
  name: string,
  owners?: string[],
  startDate?: string,
  endDate?: string,
  description?: string,
  capacityHours?: number,
  operatorId?: string
): Promise<void> {
  const finalOrgId = await resolveOrganizationId(organizationId);
  const url = isRegionEdition()
    ? `/oapi/v1/projex/projects/${projectId}/sprints/${id}`
    : `/oapi/v1/projex/organizations/${finalOrgId}/projects/${projectId}/sprints/${id}`;

  const requestBody: Record<string, any> = {
    name,
  };

  if (owners !== undefined) {
    requestBody.owners = owners;
  }

  if (startDate !== undefined) {
    requestBody.startDate = startDate;
  }

  if (endDate !== undefined) {
    requestBody.endDate = endDate;
  }

  if (description !== undefined) {
    requestBody.description = description;
  }

  if (capacityHours !== undefined) {
    requestBody.capacityHours = capacityHours;
  }

  if (operatorId !== undefined) {
    requestBody.operatorId = operatorId;
  }

  await yunxiaoRequest(url, {
    method: "PUT",
    body: requestBody,
  });
} 