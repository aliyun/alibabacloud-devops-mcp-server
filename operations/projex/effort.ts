import { z } from "zod";
import { yunxiaoRequest, isRegionEdition } from "../../common/utils.js";
import { resolveOrganizationId } from "../organization/organization.js";
import {
  EffortRecordSchema,
  EstimatedEffortSchema,
  IdentifierDTOSchema,
  ListCurrentUserEffortRecordsSchema,
  ListEffortRecordsSchema,
  CreateEffortRecordRequestSchema,
  ListEstimatedEffortsSchema,
  CreateEstimatedEffortRequestSchema,
  UpdateEffortRecordSchema,
  UpdateEstimatedEffortSchema
} from "./types.js";

// List current user effort records
export async function listCurrentUserEffortRecords(
  params: z.infer<typeof ListCurrentUserEffortRecordsSchema>
) {
  const validatedParams = ListCurrentUserEffortRecordsSchema.parse(params);
  const finalOrgId = await resolveOrganizationId(validatedParams.organizationId);
  const url = isRegionEdition()
    ? `/oapi/v1/projex/effortRecords`
    : `/oapi/v1/projex/organizations/${finalOrgId}/effortRecords`;
  const queryParams = {
    startDate: validatedParams.startDate,
    endDate: validatedParams.endDate
  };
  
  const response = await yunxiaoRequest(`${url}?startDate=${queryParams.startDate}&endDate=${queryParams.endDate}`, {
    method: "GET"
  });

  return z.array(EffortRecordSchema).parse(response);
}

// List effort records
export async function listEffortRecords(
  params: z.infer<typeof ListEffortRecordsSchema>
) {
  const validatedParams = ListEffortRecordsSchema.parse(params);
  const finalOrgId = await resolveOrganizationId(validatedParams.organizationId);
  const url = isRegionEdition()
    ? `/oapi/v1/projex/workitems/${validatedParams.id}/effortRecords`
    : `/oapi/v1/projex/organizations/${finalOrgId}/workitems/${validatedParams.id}/effortRecords`;
  
  const response = await yunxiaoRequest(url, {
    method: "GET"
  });

  return z.array(EffortRecordSchema).parse(response);
}

// Create effort record
export async function createEffortRecord(
  params: z.infer<typeof CreateEffortRecordRequestSchema> & {
    id: string;
    organizationId: string | undefined;
  }
) {
  const validatedParams = CreateEffortRecordRequestSchema.parse({
    actualTime: params.actualTime,
    description: params.description,
    gmtEnd: params.gmtEnd,
    gmtStart: params.gmtStart,
    operatorId: params.operatorId,
    workType: params.workType
  });
  const finalOrgId = await resolveOrganizationId(params.organizationId);
  const url = isRegionEdition()
    ? `/oapi/v1/projex/workitems/${params.id}/effortRecords`
    : `/oapi/v1/projex/organizations/${finalOrgId}/workitems/${params.id}/effortRecords`;
  
  const response = await yunxiaoRequest(url, {
    method: "POST",
    body: validatedParams
  });

  return IdentifierDTOSchema.parse(response);
}

// List estimated efforts
export async function listEstimatedEfforts(
  params: z.infer<typeof ListEstimatedEffortsSchema>
) {
  const validatedParams = ListEstimatedEffortsSchema.parse(params);
  const finalOrgId = await resolveOrganizationId(validatedParams.organizationId);
  const url = isRegionEdition()
    ? `/oapi/v1/projex/workitems/${validatedParams.id}/estimatedEfforts`
    : `/oapi/v1/projex/organizations/${finalOrgId}/workitems/${validatedParams.id}/estimatedEfforts`;
  
  const response = await yunxiaoRequest(url, {
    method: "GET"
  });

  return z.array(EstimatedEffortSchema).parse(response);
}

// Create estimated effort
export async function createEstimatedEffort(
  params: z.infer<typeof CreateEstimatedEffortRequestSchema> & {
    id: string;
    organizationId: string | undefined;
  }
) {
  const validatedParams = CreateEstimatedEffortRequestSchema.parse({
    description: params.description,
    operatorId: params.operatorId,
    owner: params.owner,
    spentTime: params.spentTime,
    workType: params.workType
  });
  const finalOrgId = await resolveOrganizationId(params.organizationId);
  const url = isRegionEdition()
    ? `/oapi/v1/projex/workitems/${params.id}/estimatedEfforts`
    : `/oapi/v1/projex/organizations/${finalOrgId}/workitems/${params.id}/estimatedEfforts`;
  
  const response = await yunxiaoRequest(url, {
    method: "POST",
    body: validatedParams
  });

  return IdentifierDTOSchema.parse(response);
}

// Update effort record
export async function updateEffortRecord(
  params: z.infer<typeof CreateEffortRecordRequestSchema> & {
    organizationId: string | undefined;
    workitemId: string;
    id: string;
  }
) {
  const validatedParams = CreateEffortRecordRequestSchema.parse({
    actualTime: params.actualTime,
    description: params.description,
    gmtEnd: params.gmtEnd,
    gmtStart: params.gmtStart,
    operatorId: params.operatorId,
    workType: params.workType
  });
  const finalOrgId = await resolveOrganizationId(params.organizationId);
  const url = isRegionEdition()
    ? `/oapi/v1/projex/workitems/${params.workitemId}/effortRecords/${params.id}`
    : `/oapi/v1/projex/organizations/${finalOrgId}/workitems/${params.workitemId}/effortRecords/${params.id}`;
  
  const response = await yunxiaoRequest(url, {
    method: "PUT",
    body: validatedParams
  });

  return response;
}

// Update estimated effort
export async function updateEstimatedEffort(
  params: z.infer<typeof CreateEstimatedEffortRequestSchema> & {
    organizationId: string | undefined;
    workitemId: string;
    id: string;
  }
) {
  const validatedParams = CreateEstimatedEffortRequestSchema.parse({
    description: params.description,
    operatorId: params.operatorId,
    owner: params.owner,
    spentTime: params.spentTime,
    workType: params.workType
  });
  const finalOrgId = await resolveOrganizationId(params.organizationId);
  const url = isRegionEdition()
    ? `/oapi/v1/projex/workitems/${params.workitemId}/estimatedEfforts/${params.id}`
    : `/oapi/v1/projex/organizations/${finalOrgId}/workitems/${params.workitemId}/estimatedEfforts/${params.id}`;
  
  const response = await yunxiaoRequest(url, {
    method: "PUT",
    body: validatedParams
  });

  return response;
}