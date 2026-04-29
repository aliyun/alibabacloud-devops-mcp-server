import { z } from "zod";
import { readFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import {
  yunxiaoRequest,
  isRegionEdition,
  getYunxiaoApiBaseUrl,
  getCurrentSessionToken
} from "../../common/utils.js";
import { getUserAgent } from "universal-user-agent";
import { VERSION } from "../../common/version.js";
import { createYunxiaoError } from "../../common/errors.js";
import {
  AttachmentDTOSchema,
  WorkitemFileSchema,
  AttachmentDTO,
  WorkitemFile
} from "./types.js";
import { resolveOrganizationId } from "../organization/organization.js";

/**
 * 获取工作项附件列表
 * @param organizationId 组织ID
 * @param workItemId 工作项唯一标识
 * @returns 附件列表
 */
export async function listWorkitemAttachmentsFunc(
  organizationId: string | undefined,
  workItemId: string
): Promise<AttachmentDTO[]> {
  const finalOrgId = await resolveOrganizationId(organizationId);
  const url = isRegionEdition()
    ? `/oapi/v1/projex/workitems/${workItemId}/attachments`
    : `/oapi/v1/projex/organizations/${finalOrgId}/workitems/${workItemId}/attachments`;

  const response = await yunxiaoRequest(url, {
    method: "GET",
  });

  // 确保返回的是数组格式
  if (Array.isArray(response)) {
    return response.map(item => AttachmentDTOSchema.parse(item));
  }

  // 如果响应中包含result字段，则返回result中的数据
  if (response && typeof response === 'object' && 'result' in response && Array.isArray(response.result)) {
    return response.result.map((item: any) => AttachmentDTOSchema.parse(item));
  }

  // 其他情况返回空数组
  return [];
}

/**
 * 获取工作项文件信息
 * @param organizationId 组织ID
 * @param workitemId 工作项唯一标识
 * @param id 文件唯一标识
 * @returns 文件信息
 */
export async function getWorkitemFileFunc(
  organizationId: string | undefined,
  workitemId: string,
  id: string
): Promise<WorkitemFile> {
  const finalOrgId = await resolveOrganizationId(organizationId);
  const url = isRegionEdition()
    ? `/oapi/v1/projex/workitems/${workitemId}/files/${id}`
    : `/oapi/v1/projex/organizations/${finalOrgId}/workitems/${workitemId}/files/${id}`;

  const response = await yunxiaoRequest(url, {
    method: "GET",
  });

  // 如果响应中包含result字段，则返回result中的数据
  if (response && typeof response === 'object' && 'result' in response) {
    return WorkitemFileSchema.parse(response.result);
  }

  return WorkitemFileSchema.parse(response);
}

/**
 * 上传工作项附件（基于本地文件路径）
 * @param organizationId 组织ID
 * @param workItemId 工作项唯一标识
 * @param filePath 本地文件绝对路径
 * @param operatorId 操作者ID（可选）
 * @returns 上传结果
 */
export async function createWorkitemAttachmentFunc(
  organizationId: string | undefined,
  workItemId: string,
  filePath: string,
  operatorId?: string
): Promise<WorkitemFile> {
  // 验证文件存在
  if (!existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  // 读取文件内容
  const fileBuffer = await readFile(filePath);
  const fileName = path.basename(filePath);

  const finalOrgId = await resolveOrganizationId(organizationId);
  const urlPath = isRegionEdition()
    ? `/oapi/v1/projex/workitems/${workItemId}/attachments`
    : `/oapi/v1/projex/organizations/${finalOrgId}/workitems/${workItemId}/attachments`;

  const fullUrl = `${getYunxiaoApiBaseUrl()}${urlPath}`;

  // 构造 FormData（Node.js 18+ 原生支持）
  const formData = new FormData();
  const blob = new Blob([fileBuffer]);
  formData.append("file", blob, fileName);
  if (operatorId) {
    formData.append("operatorId", operatorId);
  }

  // 直接用 fetch 发送 multipart/form-data（不走 yunxiaoRequest，因为它强制 JSON content-type）
  const requestHeaders: Record<string, string> = {
    "Accept": "application/json",
    "User-Agent": `modelcontextprotocol/servers/alibabacloud-devops-mcp-server/v${VERSION} ${getUserAgent()}`,
  };

  const token = getCurrentSessionToken();
  if (token) {
    requestHeaders["x-yunxiao-token"] = token;
  }

  const response = await fetch(fullUrl, {
    method: "POST",
    headers: requestHeaders,
    body: formData,
  } as RequestInit);

  const contentType = response.headers.get("content-type");
  const responseBody = contentType?.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    throw createYunxiaoError(
      response.status,
      responseBody,
      fullUrl,
      "POST",
      requestHeaders,
      { filePath, fileName }
    );
  }

  return WorkitemFileSchema.parse(responseBody);
}
