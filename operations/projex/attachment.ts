import { z } from "zod";
import { readFile } from "fs/promises";
import { existsSync } from "fs";
import { randomBytes } from "crypto";
import path from "path";
import {
  yunxiaoRequest,
  isRegionEdition,
  getYunxiaoApiBaseUrl,
  getCurrentSessionToken,
  getCurrentForwardHost,
  requestWithHostOverride,
  isNetworkTransport
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
 * 优先透传云效服务端返回的 embedUrl / embedMarkdown / embedHtml。
 * 仅当 API 未返回 markdown / html 但有 embedUrl 时,本地派生作为兜底
 * (例如附件列表接口暂未提供这两个字段的场景)。
 */
function withEmbedFields(parsed: WorkitemFile, fallbackName?: string | null): WorkitemFile {
  if (!parsed.embedUrl) return parsed;
  if (parsed.embedMarkdown && parsed.embedHtml) return parsed;
  const altText = (parsed.name || fallbackName || "image").replace(/[\[\]]/g, "");
  return {
    ...parsed,
    embedMarkdown: parsed.embedMarkdown ?? `![${altText}](${parsed.embedUrl})`,
    embedHtml: parsed.embedHtml ?? `<img src="${parsed.embedUrl}" alt="${altText}" />`,
  };
}

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
 * @param id 文件唯一标识或附件ID。支持两种格式：
 *   - 文件ID（长hex字符串）：用于描述中嵌入的图片，直接调用文件接口
 *   - 附件ID（纯数字如 62487031）：先从附件列表中查找匹配项并返回下载信息
 * @returns 文件信息
 */
export async function getWorkitemFileFunc(
  organizationId: string | undefined,
  workitemId: string,
  id: string
): Promise<WorkitemFile> {
  // 如果是纯数字ID（附件ID），先从附件列表中查找
  if (/^\d+$/.test(id)) {
    const attachments = await listWorkitemAttachmentsFunc(organizationId, workitemId);
    const attachment = attachments.find(a => a.id === id);
    if (attachment) {
      const fileId = attachment.fileId || attachment.id;
      const parsed = WorkitemFileSchema.parse({
        id: fileId,
        name: attachment.fileName,
        size: attachment.size,
        suffix: attachment.suffix,
        url: attachment.url,
        embedUrl: attachment.embedUrl,
      });
      return withEmbedFields(parsed);
    }
    throw new Error(`Attachment with id ${id} not found for workitem ${workitemId}`);
  }

  // 非数字ID视为文件ID（hex），走文件接口
  const finalOrgId = await resolveOrganizationId(organizationId);
  const url = isRegionEdition()
    ? `/oapi/v1/projex/workitems/${workitemId}/files/${id}`
    : `/oapi/v1/projex/organizations/${finalOrgId}/workitems/${workitemId}/files/${id}`;

  const response = await yunxiaoRequest(url, {
    method: "GET",
  });

  // 如果响应中包含result字段，则返回result中的数据
  const raw = (response && typeof response === 'object' && 'result' in response) ? (response as any).result : response;
  const parsed = WorkitemFileSchema.parse(raw);
  return withEmbedFields(parsed);
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
  opts: {
    filePath?: string;
    fileContent?: string;
    fileName?: string;
    operatorId?: string;
  }
): Promise<WorkitemFile> {
  const { filePath, fileContent, operatorId } = opts;

  // 安全：网络(HTTP)传输下 filePath 指向的是【服务器】文件系统。若允许远程调用方传 filePath，
  // 攻击者可传 /etc/passwd、密钥等敏感路径，让 server 读取并上传，造成任意文件读取/数据外泄。
  // 因此远程部署一律禁止 filePath（即使同时给了 fileContent 也拒绝，避免语义混淆），只允许 base64。
  if (filePath && isNetworkTransport()) {
    throw new Error(
      "远程(HTTP)部署下禁止使用 filePath 上传附件：filePath 指向服务器本地文件系统，存在任意文件读取风险。请改用 fileContent 传入文件的 base64 编码（配合 fileName）。"
    );
  }

  // 解析文件字节与文件名：优先 base64 内联内容（远程 streamable HTTP 场景，server 读不到
  // 调用方本地文件），否则读本地路径（同机 / stdio 场景）。
  let fileBuffer: Buffer;
  let fileName: string;
  if (fileContent) {
    fileBuffer = Buffer.from(fileContent, "base64");
    if (fileBuffer.length === 0) {
      throw new Error("fileContent 解码后为空，请确认传入的是有效的 base64 编码");
    }
    fileName = opts.fileName || "file";
  } else {
    if (!filePath) {
      throw new Error("必须提供 fileContent（base64）或 filePath（本地路径）之一");
    }
    if (!existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    fileBuffer = await readFile(filePath);
    fileName = opts.fileName || path.basename(filePath);
  }

  const finalOrgId = await resolveOrganizationId(organizationId);
  const urlPath = isRegionEdition()
    ? `/oapi/v1/projex/workitems/${workItemId}/attachments`
    : `/oapi/v1/projex/organizations/${finalOrgId}/workitems/${workItemId}/attachments`;

  const fullUrl = `${getYunxiaoApiBaseUrl()}${urlPath}`;

  // 不走 yunxiaoRequest：它强制 JSON content-type，无法发 multipart/form-data。
  const requestHeaders: Record<string, string> = {
    "Accept": "application/json",
    "User-Agent": `modelcontextprotocol/servers/alibabacloud-devops-mcp-server/v${VERSION} ${getUserAgent()}`,
  };

  const token = getCurrentSessionToken();
  if (token) {
    requestHeaders["x-yunxiao-token"] = token;
  }

  // region 多租户：需要把租户子域名作为 Host 送达 openapi 网关。fetch 会静默丢弃
  // Host 头（forbidden header），故此时手动构造 multipart 并走 http.request；
  // 中心站 / 无 forwardHost 时保持原生 fetch + FormData 路径（行为零变化）。
  const forwardHost = getCurrentForwardHost();
  const overrideHost = !!forwardHost && isRegionEdition();

  let status: number;
  let ok: boolean;
  let responseBody: unknown;

  if (overrideHost) {
    requestHeaders["Host"] = forwardHost as string;

    const boundary = `----mcpFormBoundary${randomBytes(16).toString("hex")}`;
    const CRLF = "\r\n";
    // filename 去掉可能破坏 multipart 头的字符
    const safeFileName = fileName.replace(/["\\\r\n]/g, "_");
    const parts: Buffer[] = [
      Buffer.from(
        `--${boundary}${CRLF}` +
          `Content-Disposition: form-data; name="file"; filename="${safeFileName}"${CRLF}` +
          `Content-Type: application/octet-stream${CRLF}${CRLF}`,
        "utf8"
      ),
      fileBuffer,
      Buffer.from(CRLF, "utf8"),
    ];
    if (operatorId) {
      parts.push(
        Buffer.from(
          `--${boundary}${CRLF}` +
            `Content-Disposition: form-data; name="operatorId"${CRLF}${CRLF}` +
            `${operatorId}${CRLF}`,
          "utf8"
        )
      );
    }
    parts.push(Buffer.from(`--${boundary}--${CRLF}`, "utf8"));
    const bodyBuffer = Buffer.concat(parts);

    requestHeaders["Content-Type"] = `multipart/form-data; boundary=${boundary}`;
    requestHeaders["Content-Length"] = String(bodyBuffer.length);

    const response = await requestWithHostOverride(fullUrl, {
      method: "POST",
      headers: requestHeaders,
      body: bodyBuffer,
    });
    status = response.status;
    ok = response.ok;
    const text = await response.text();
    responseBody = response.headers.get("content-type")?.includes("application/json")
      ? (text ? JSON.parse(text) : {})
      : text;
  } else {
    // 构造 FormData（Node.js 18+ 原生支持），fetch 自动设置 multipart 边界
    const formData = new FormData();
    const blob = new Blob([new Uint8Array(fileBuffer)]);
    formData.append("file", blob, fileName);
    if (operatorId) {
      formData.append("operatorId", operatorId);
    }

    const response = await fetch(fullUrl, {
      method: "POST",
      headers: requestHeaders,
      body: formData,
    } as RequestInit);
    status = response.status;
    ok = response.ok;
    responseBody = response.headers.get("content-type")?.includes("application/json")
      ? await response.json()
      : await response.text();
  }

  if (!ok) {
    throw createYunxiaoError(
      status,
      responseBody,
      fullUrl,
      "POST",
      requestHeaders,
      { fileName, source: fileContent ? "base64" : "filePath" }
    );
  }

  const parsed = WorkitemFileSchema.parse(responseBody);
  return withEmbedFields(parsed, fileName);
}
