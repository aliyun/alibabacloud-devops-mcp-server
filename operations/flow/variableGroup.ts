import * as utils from "../../common/utils.js";
import { resolveOrganizationId } from "../organization/organization.js";
import {
  AddPipelineRelationsParams,
  FlowVariableGroupSchema,
  FlowVariableGroup,
  CreateFlowVariableGroupParams,
  ListFlowVariableGroupsParams,
} from "./types.js";

export async function listFlowVariableGroupsFunc(
  organizationId: string | undefined,
  options?: Omit<ListFlowVariableGroupsParams, "organizationId">,
): Promise<FlowVariableGroup[]> {
  const finalOrgId = await resolveOrganizationId(organizationId);
  const baseUrl = utils.isRegionEdition()
    ? `/oapi/v1/flow/variableGroups`
    : `/oapi/v1/flow/organizations/${finalOrgId}/variableGroups`;

  const url = utils.buildUrl(baseUrl, {
    perPage: options?.perPage,
    page: options?.page,
    pageSort: options?.pageSort,
    pageOrder: options?.pageOrder,
  });

  const response = await utils.yunxiaoRequest(url, {
    method: "GET",
  });

  if (!Array.isArray(response)) {
    return [];
  }

  return response.map(item => FlowVariableGroupSchema.parse(item));
}

export async function createFlowVariableGroupFunc(
  params: CreateFlowVariableGroupParams,
): Promise<number> {
  const { organizationId, name, description, variables } = params;
  const finalOrgId = await resolveOrganizationId(organizationId);
  const baseUrl = utils.isRegionEdition()
    ? `/oapi/v1/flow/variableGroups`
    : `/oapi/v1/flow/organizations/${finalOrgId}/variableGroups`;

  const url = utils.buildUrl(baseUrl, {
    name,
    description,
    variables: JSON.stringify(variables),
  });

  const response = await utils.yunxiaoRequest(url, {
    method: "POST",
  });

  return Number(response);
}

export async function addPipelineRelationsFunc(
  params: AddPipelineRelationsParams,
): Promise<boolean> {
  const { organizationId, pipelineId, relObjectType, relObjectIds } = params;
  const finalOrgId = await resolveOrganizationId(organizationId);
  const baseUrl = utils.isRegionEdition()
    ? `/oapi/v1/flow/pipelines/${pipelineId}/pipelineObjRel/add`
    : `/oapi/v1/flow/organizations/${finalOrgId}/pipelines/${pipelineId}/pipelineObjRel/add`;

  const url = utils.buildUrl(baseUrl, {
    relObjectType,
    relObjectIds: relObjectIds.join(","),
  });

  const response = await utils.yunxiaoRequest(url, {
    method: "POST",
  });

  return response === true || response === "true";
}
