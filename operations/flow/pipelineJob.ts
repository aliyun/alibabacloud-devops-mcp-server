/**
 * 流水线任务相关操作
 * 提供按照分类获取流水线执行的任务接口
 */

import * as utils from "../../common/utils.js";
import { resolveOrganizationId } from "../organization/organization.js";
import {
  PipelineJobItemSchema,
  PipelineJobItem,
  PipelineJobHistoryItemSchema,
  PipelineJobHistoryItem,
  PipelineJobRunLogSchema,
  PipelineJobRunLog,
  PipelineJobStepsResponseSchema,
  PipelineJobStepsResponse,
  PipelineJobStepLogSchema,
  PipelineJobStepLog
} from "./types.js";

/**
 * 按任务分类获取流水线执行的任务
 * @param organizationId Organization ID（组织ID）
 * @param pipelineId Pipeline ID（流水线ID）
 * @param category Task category, currently only supports DEPLOY（任务分类，当前仅支持DEPLOY）
 * @returns 任务列表
 */
export async function listPipelineJobsByCategoryFunc(
  organizationId: string | undefined,
  pipelineId: string,
  category: string
): Promise<PipelineJobItem[]> {
  const finalOrgId = await resolveOrganizationId(organizationId);
  const url = utils.isRegionEdition()
    ? `/oapi/v1/flow/pipelines/${pipelineId}/listTasksByCategory/${category}`
    : `/oapi/v1/flow/organizations/${finalOrgId}/pipelines/${pipelineId}/listTasksByCategory/${category}`;

  const response = await utils.yunxiaoRequest(url, {
    method: "GET",
  });

  if (!Array.isArray(response)) {
    return [];
  }

  return response.map(job => PipelineJobItemSchema.parse(job));
}

/**
 * 获取流水线任务的执行历史
 * @param organizationId Organization ID（组织ID）
 * @param pipelineId Pipeline ID（流水线ID）
 * @param category Task category, currently only supports DEPLOY（任务分类，当前仅支持DEPLOY）
 * @param identifier Task identifier（任务标识）
 * @param page Page number, default 1
 * @param perPage Number of items per page, default 10, max 30
 * @returns Job history list and pagination information
 */
export async function listPipelineJobHistorysFunc(
  organizationId: string | undefined,
  pipelineId: string,
  category: string,
  identifier: string,
  page: number = 1,
  perPage: number = 10
): Promise<{
  items: PipelineJobHistoryItem[],
  pagination: {
    nextPage: number | null,
    page: number,
    perPage: number,
    prevPage: number | null,
    total: number,
    totalPages: number
  }
}> {
  const finalOrgId = await resolveOrganizationId(organizationId);
  const baseUrl = utils.isRegionEdition()
    ? `/oapi/v1/flow/pipelines/getComponentsWithoutButtons`
    : `/oapi/v1/flow/organizations/${finalOrgId}/pipelines/getComponentsWithoutButtons`;

  const queryParams: Record<string, string | number> = {
    pipelineId,
    category,
    identifier,
    page,
    perPage
  };

  const url = utils.buildUrl(baseUrl, queryParams);

  const response = await utils.yunxiaoRequest(url, {
    method: "GET",
  });

  const pagination = {
    nextPage: null as number | null,
    page: page,
    perPage: perPage,
    prevPage: null as number | null,
    total: 0,
    totalPages: 0
  };

  if (response && 'headers' in (response as any)) {
    const headers = (response as any).headers;
    
    if (headers['x-next-page']) {
      pagination.nextPage = parseInt(headers['x-next-page']);
    }
    
    if (headers['x-page']) {
      pagination.page = parseInt(headers['x-page']);
    }
    
    if (headers['x-per-page']) {
      pagination.perPage = parseInt(headers['x-per-page']);
    }
    
    if (headers['x-prev-page']) {
      pagination.prevPage = parseInt(headers['x-prev-page']);
    }
    
    if (headers['x-total']) {
      pagination.total = parseInt(headers['x-total']);
    }
    
    if (headers['x-total-pages']) {
      pagination.totalPages = parseInt(headers['x-total-pages']);
    }
  }

  const items = Array.isArray(response) 
    ? response.map(item => PipelineJobHistoryItemSchema.parse(item))
    : [];

  return {
    items,
    pagination
  };
}

/**
 * 手动运行流水线任务
 * @param organizationId Organization ID（组织ID）
 * @param pipelineId Pipeline ID（流水线ID）
 * @param pipelineRunId Pipeline run instance ID（流水线运行ID）
 * @param jobId Job ID for the pipeline run task（流水线运行任务ID）
 * @returns Whether the operation was successful
 */
export async function executePipelineJobRunFunc(
  organizationId: string | undefined,
  pipelineId: string,
  pipelineRunId: string,
  jobId: string
): Promise<boolean> {
  const finalOrgId = await resolveOrganizationId(organizationId);
  const url = utils.isRegionEdition()
    ? `/oapi/v1/flow/pipelines/${pipelineId}/pipelineRuns/${pipelineRunId}/jobs/${jobId}/start`
    : `/oapi/v1/flow/organizations/${finalOrgId}/pipelines/${pipelineId}/pipelineRuns/${pipelineRunId}/jobs/${jobId}/start`;

  const response = await utils.yunxiaoRequest(url, {
    method: "POST",
  });

  return Boolean(response);
}

/**
 * 查询任务运行日志
 * @param organizationId Organization ID（组织ID）
 * @param pipelineId Pipeline ID（流水线ID）
 * @param pipelineRunId Pipeline run instance ID（流水线运行ID）
 * @param jobId Job ID of the pipeline run task（流水线运行任务ID）
 * @returns Log content and metadata
 */
export async function getPipelineJobRunLogFunc(
  organizationId: string | undefined,
  pipelineId: string,
  pipelineRunId: string,
  jobId: string
): Promise<PipelineJobRunLog> {
  const finalOrgId = await resolveOrganizationId(organizationId);
  const url = utils.isRegionEdition()
    ? `/oapi/v1/flow/pipelines/${pipelineId}/runs/${pipelineRunId}/job/${jobId}/log`
    : `/oapi/v1/flow/organizations/${finalOrgId}/pipelines/${pipelineId}/runs/${pipelineRunId}/job/${jobId}/log`;

  const response = await utils.yunxiaoRequest(url, {
    method: "GET",
  });

  return PipelineJobRunLogSchema.parse(response);
}

/**
 * 终止流水线任务运行
 */
export async function stopPipelineJobRunFunc(
  organizationId: string | undefined,
  pipelineId: string,
  pipelineRunId: string,
  jobId: string
): Promise<boolean> {
  const finalOrgId = await resolveOrganizationId(organizationId);
  const url = utils.isRegionEdition()
    ? `/oapi/v1/flow/pipelines/${pipelineId}/pipelineRuns/${pipelineRunId}/jobs/${jobId}/stop`
    : `/oapi/v1/flow/organizations/${finalOrgId}/pipelines/${pipelineId}/pipelineRuns/${pipelineRunId}/jobs/${jobId}/stop`;

  const response = await utils.yunxiaoRequest(url, {
    method: "PUT",
  });

  return Boolean(response);
}

/**
 * 重试流水线任务运行
 */
export async function retryPipelineJobRunFunc(
  organizationId: string | undefined,
  pipelineId: string,
  pipelineRunId: string,
  jobId: string
): Promise<boolean> {
  const finalOrgId = await resolveOrganizationId(organizationId);
  const url = utils.isRegionEdition()
    ? `/oapi/v1/flow/pipelines/${pipelineId}/pipelineRuns/${pipelineRunId}/jobs/${jobId}/retry`
    : `/oapi/v1/flow/organizations/${finalOrgId}/pipelines/${pipelineId}/pipelineRuns/${pipelineRunId}/jobs/${jobId}/retry`;

  const response = await utils.yunxiaoRequest(url, {
    method: "PUT",
  });

  return Boolean(response);
}

/**
 * 重新运行流水线任务（仅支持部署类任务）
 */
export async function rerunPipelineJobRunFunc(
  organizationId: string | undefined,
  pipelineId: string,
  pipelineRunId: string,
  jobId: string
): Promise<boolean> {
  const finalOrgId = await resolveOrganizationId(organizationId);
  const url = utils.isRegionEdition()
    ? `/oapi/v1/flow/pipelines/${pipelineId}/pipelineRuns/${pipelineRunId}/jobs/${jobId}/rerun`
    : `/oapi/v1/flow/organizations/${finalOrgId}/pipelines/${pipelineId}/pipelineRuns/${pipelineRunId}/jobs/${jobId}/rerun`;

  const response = await utils.yunxiaoRequest(url, {
    method: "PUT",
  });

  return Boolean(response);
}

/**
 * 跳过流水线任务运行
 */
export async function skipPipelineJobRunFunc(
  organizationId: string | undefined,
  pipelineId: string,
  pipelineRunId: string,
  jobId: string
): Promise<boolean> {
  const finalOrgId = await resolveOrganizationId(organizationId);
  const url = utils.isRegionEdition()
    ? `/oapi/v1/flow/pipelines/${pipelineId}/pipelineRuns/${pipelineRunId}/jobs/${jobId}/skip`
    : `/oapi/v1/flow/organizations/${finalOrgId}/pipelines/${pipelineId}/pipelineRuns/${pipelineRunId}/jobs/${jobId}/skip`;

  const response = await utils.yunxiaoRequest(url, {
    method: "PUT",
  });

  return Boolean(response);
}

/**
 * 通过人工卡点
 */
export async function passPipelineValidateFunc(
  organizationId: string | undefined,
  pipelineId: string,
  pipelineRunId: string,
  jobId: string
): Promise<boolean> {
  const finalOrgId = await resolveOrganizationId(organizationId);
  const url = utils.isRegionEdition()
    ? `/oapi/v1/flow/pipelines/${pipelineId}/pipelineRuns/${pipelineRunId}/jobs/${jobId}/pass`
    : `/oapi/v1/flow/organizations/${finalOrgId}/pipelines/${pipelineId}/pipelineRuns/${pipelineRunId}/jobs/${jobId}/pass`;

  const response = await utils.yunxiaoRequest(url, {
    method: "POST",
  });

  return Boolean(response);
}

/**
 * 拒绝人工卡点
 */
export async function refusePipelineValidateFunc(
  organizationId: string | undefined,
  pipelineId: string,
  pipelineRunId: string,
  jobId: string
): Promise<boolean> {
  const finalOrgId = await resolveOrganizationId(organizationId);
  const url = utils.isRegionEdition()
    ? `/oapi/v1/flow/pipelines/${pipelineId}/pipelineRuns/${pipelineRunId}/jobs/${jobId}/refuse`
    : `/oapi/v1/flow/organizations/${finalOrgId}/pipelines/${pipelineId}/pipelineRuns/${pipelineRunId}/jobs/${jobId}/refuse`;

  const response = await utils.yunxiaoRequest(url, {
    method: "POST",
  });

  return Boolean(response);
}

/**
 * 运行流水线任务后续 action
 */
export async function executePipelineJobActionFunc(
  organizationId: string | undefined,
  pipelineId: string,
  pipelineRunId: string,
  jobId: string,
  actionId: string
): Promise<boolean> {
  const finalOrgId = await resolveOrganizationId(organizationId);
  const url = utils.isRegionEdition()
    ? `/oapi/v1/flow/pipelines/${pipelineId}/pipelineRuns/${pipelineRunId}/jobs/${jobId}/action/${actionId}`
    : `/oapi/v1/flow/organizations/${finalOrgId}/pipelines/${pipelineId}/pipelineRuns/${pipelineRunId}/jobs/${jobId}/action/${actionId}`;

  const response = await utils.yunxiaoRequest(url, {
    method: "POST",
  });

  return Boolean(response);
}

/**
 * 获取流水线任务步骤列表
 */
export async function getPipelineJobStepsFunc(
  organizationId: string | undefined,
  pipelineId: string,
  pipelineRunId: string,
  jobId: string
): Promise<PipelineJobStepsResponse> {
  const finalOrgId = await resolveOrganizationId(organizationId);
  const url = utils.isRegionEdition()
    ? `/oapi/v1/flow/pipelines/${pipelineId}/pipelineRuns/${pipelineRunId}/jobs/${jobId}/steps`
    : `/oapi/v1/flow/organizations/${finalOrgId}/pipelines/${pipelineId}/pipelineRuns/${pipelineRunId}/jobs/${jobId}/steps`;

  const response = await utils.yunxiaoRequest(url, {
    method: "GET",
  });

  return PipelineJobStepsResponseSchema.parse(response);
}

/**
 * 获取流水线任务步骤日志
 */
export async function getPipelineJobStepLogFunc(
  organizationId: string | undefined,
  pipelineId: string,
  pipelineRunId: string,
  jobId: string,
  stepIndex: number,
  offset: number,
  limit: number,
  buildId: number
): Promise<PipelineJobStepLog> {
  const finalOrgId = await resolveOrganizationId(organizationId);
  const baseUrl = utils.isRegionEdition()
    ? `/oapi/v1/flow/pipelines/${pipelineId}/pipelineRuns/${pipelineRunId}/jobs/${jobId}/step/log`
    : `/oapi/v1/flow/organizations/${finalOrgId}/pipelines/${pipelineId}/pipelineRuns/${pipelineRunId}/jobs/${jobId}/step/log`;

  const queryParams: Record<string, string | number> = {
    stepIndex,
    offset,
    limit,
    buildId
  };

  const url = utils.buildUrl(baseUrl, queryParams);

  const response = await utils.yunxiaoRequest(url, {
    method: "GET",
  });

  return PipelineJobStepLogSchema.parse(response);
}

/**
 * 获取流水线任务步骤日志下载地址
 */
export async function getPipelineJobStepLogUrlFunc(
  organizationId: string | undefined,
  pipelineId: string,
  pipelineRunId: string,
  jobId: string,
  stepIndex: number,
  buildId: number
): Promise<string> {
  const finalOrgId = await resolveOrganizationId(organizationId);
  const baseUrl = utils.isRegionEdition()
    ? `/oapi/v1/flow/pipelines/${pipelineId}/pipelineRuns/${pipelineRunId}/jobs/${jobId}/step/log/url`
    : `/oapi/v1/flow/organizations/${finalOrgId}/pipelines/${pipelineId}/pipelineRuns/${pipelineRunId}/jobs/${jobId}/step/log/url`;

  const queryParams: Record<string, string | number> = {
    stepIndex,
    buildId
  };

  const url = utils.buildUrl(baseUrl, queryParams);

  const response = await utils.yunxiaoRequest(url, {
    method: "GET",
  });

  // Response could be:
  // - a plain string URL (declared as JSON but returned as text)
  // - a JSON object like { url: "https://..." }
  // - an empty body
  if (response == null) {
    return "";
  }
  if (typeof response === "string") {
    return response;
  }
  if (typeof response === "object") {
    const obj = response as Record<string, unknown>;
    if (typeof obj.url === "string") {
      return obj.url;
    }
    if (typeof obj.downloadUrl === "string") {
      return obj.downloadUrl;
    }
  }
  return String(response);
}

