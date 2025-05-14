import { z } from "zod";
import {yunxiaoRequest, buildUrl, pathEscape} from "../../common/utils.js";
import { 
  FileContentSchema, 
  CreateFileResponseSchema, 
  DeleteFileResponseSchema,
  FileInfoSchema,
  GetFileBlobsSchema,
  GetFileBlobsOptions,
  CreateFileSchema,
  CreateFileOptions,
  UpdateFileSchema,
  UpdateFileOptions,
  DeleteFileSchema,
  DeleteFileOptions,
  ListFilesSchema,
  ListFilesOptions
} from "../../common/types.js";

// Common helper function to handle repositoryId and filePath encoding
function handlePathEncoding(repositoryId: string, filePath: string): { encodedRepoId: string; encodedFilePath: string } {
  let encodedRepoId = repositoryId;
  let encodedFilePath = filePath;
  
  // 自动处理repositoryId中未编码的斜杠
  if (repositoryId.includes("/")) {
    // 发现未编码的斜杠，自动进行URL编码
    const parts = repositoryId.split("/", 2);
    if (parts.length === 2) {
      const encodedRepoName = encodeURIComponent(parts[1]);
      // 移除编码中的+号（空格被编码为+，但我们需要%20）
      const formattedEncodedName = encodedRepoName.replace(/\+/g, "%20");
      encodedRepoId = `${parts[0]}%2F${formattedEncodedName}`;
    }
  }

  // 确保filePath已被URL编码
  if (filePath.includes("/")) {
    const startsWithSlash = filePath.startsWith("/");
    if (startsWithSlash) {
      encodedFilePath = encodedFilePath.substring(1);
    }
    encodedFilePath = encodeURIComponent(filePath);
  }

  return { encodedRepoId, encodedFilePath };
}

/**
 * 查询文件内容
 * @param organizationId
 * @param repositoryId
 * @param filePath
 * @param ref
 */
export async function getFileBlobsFunc(
  organizationId: string,
  repositoryId: string,
  filePath: string,
  ref: string
): Promise<z.infer<typeof FileContentSchema>> {
  // const { encodedRepoId, encodedFilePath } = handlePathEncoding(repositoryId, filePath);
  let encodedRepoId = repositoryId;
  let encodedFilePath = filePath;
  // 自动处理repositoryId中未编码的斜杠
  if (repositoryId.includes("/")) {
    // 发现未编码的斜杠，自动进行URL编码
    const parts = repositoryId.split("/", 2);
    if (parts.length === 2) {
      const encodedRepoName = encodeURIComponent(parts[1]);
      // 移除编码中的+号（空格被编码为+，但我们需要%20）
      const formattedEncodedName = encodedRepoName.replace(/\+/g, "%20");
      encodedRepoId = `${parts[0]}%2F${formattedEncodedName}`;
    }
  }

  // 确保filePath已被URL编码
  if (filePath.includes("/")) {
    encodedFilePath = encodeURIComponent(filePath);
  }

  const baseUrl = `/oapi/v1/codeup/organizations/${organizationId}/repositories/${encodedRepoId}/files/${encodedFilePath}`;
  
  // 构建查询参数
  const queryParams: Record<string, string | number | undefined> = {
    ref: ref
  };

  // 使用buildUrl函数构建包含查询参数的URL
  const url = buildUrl(baseUrl, queryParams);

  const response = await yunxiaoRequest(url, {
    method: "GET",
  });

  return FileContentSchema.parse(response);
}

/**
 * 创建文件
 * @param organizationId
 * @param repositoryId
 * @param filePath
 * @param content
 * @param commitMessage
 * @param branch
 * @param encoding
 */
export async function createFileFunc(
  organizationId: string,
  repositoryId: string,
  filePath: string,
  content: string,
  commitMessage: string,
  branch: string,
  encoding?: string
): Promise<z.infer<typeof CreateFileResponseSchema>> {
  let encodedRepoId = repositoryId;
  let encodedFilePath = filePath;

  if (repositoryId.includes("/")) {
    // 发现未编码的斜杠，自动进行URL编码
    const parts = repositoryId.split("/", 2);
    if (parts.length === 2) {
      const encodedRepoName = encodeURIComponent(parts[1]);
      // 移除编码中的+号（空格被编码为+，但我们需要%20）
      const formattedEncodedName = encodedRepoName.replace(/\+/g, "%20");
      encodedRepoId = `${parts[0]}%2F${formattedEncodedName}`;
    }
  }

  // 确保filePath已被URL编码
  if (filePath.includes("/")) {
    encodedFilePath = pathEscape(filePath);
  }

  const url = `/oapi/v1/codeup/organizations/${organizationId}/repositories/${encodedRepoId}/files`;

  const body = {
    branch: branch,
    filePath: encodedFilePath,
    content: content,
    commitMessage: commitMessage,
    encoding: encoding || "text"  // 默认使用text编码
  };

  const response = await yunxiaoRequest(url, {
    method: "POST",
    body: body
  });

  return CreateFileResponseSchema.parse(response);
}

/**
 * 更新文件内容
 * @param organizationId
 * @param repositoryId
 * @param filePath
 * @param content
 * @param commitMessage
 * @param branch
 * @param encoding
 */
export async function updateFileFunc(
  organizationId: string,
  repositoryId: string,
  filePath: string,
  content: string,
  commitMessage: string,
  branch: string,
  encoding?: string
): Promise<z.infer<typeof CreateFileResponseSchema>> {
  //const { encodedRepoId, encodedFilePath } = handlePathEncoding(repositoryId, filePath);
  let encodedRepoId = repositoryId;
  let encodedFilePath = filePath;

  // 自动处理repositoryId中未编码的斜杠
  if (repositoryId.includes("/")) {
    // 发现未编码的斜杠，自动进行URL编码
    const parts = repositoryId.split("/", 2);
    if (parts.length === 2) {
      const encodedRepoName = encodeURIComponent(parts[1]);
      // 移除编码中的+号（空格被编码为+，但我们需要%20）
      const formattedEncodedName = encodedRepoName.replace(/\+/g, "%20");
      encodedRepoId = `${parts[0]}%2F${formattedEncodedName}`;
    }
  }

  // 确保filePath已被URL编码
  if (filePath.includes("/")) {
    const pathToEncode = filePath.startsWith("/") ? filePath.substring(1) : filePath;
    encodedFilePath = encodeURIComponent(pathToEncode);
  }

  const url = `/oapi/v1/codeup/organizations/${organizationId}/repositories/${encodedRepoId}/files/${encodedFilePath}`;

  const body = {
    branch: branch,
    commitMessage: commitMessage,
    content: content,
    encoding: encoding || "text"  // 默认使用text编码
  };

  const response = await yunxiaoRequest(url, {
    method: "PUT",
    body: body
  });

  return CreateFileResponseSchema.parse(response);
}

/**
 * 删除文件
 * @param organizationId
 * @param repositoryId
 * @param filePath
 * @param commitMessage
 * @param branch
 */
export async function deleteFileFunc(
  organizationId: string,
  repositoryId: string,
  filePath: string,
  commitMessage: string,
  branch: string
): Promise<z.infer<typeof DeleteFileResponseSchema>> {
  let encodedRepoId = repositoryId;
  let encodedFilePath = filePath;

  if (repositoryId.includes("/")) {
    // 发现未编码的斜杠，自动进行URL编码
    const parts = repositoryId.split("/", 2);
    if (parts.length === 2) {
      const encodedRepoName = encodeURIComponent(parts[1]);
      // 移除编码中的+号（空格被编码为+，但我们需要%20）
      const formattedEncodedName = encodedRepoName.replace(/\+/g, "%20");
      encodedRepoId = `${parts[0]}%2F${formattedEncodedName}`;
    }
  }

  // 确保filePath已被URL编码
  if (filePath.includes("/")) {
    encodedFilePath = encodeURIComponent(filePath);
  }

  const baseUrl = `/oapi/v1/codeup/organizations/${organizationId}/repositories/${encodedRepoId}/files/${encodedFilePath}`;
  
  // 构建查询参数
  const queryParams: Record<string, string | number | undefined> = {
    branch: branch,
    commitMessage: commitMessage
  };

  // 使用buildUrl函数构建包含查询参数的URL
  const url = buildUrl(baseUrl, queryParams);

  const response = await yunxiaoRequest(url, {
    method: "DELETE",
  });

  return DeleteFileResponseSchema.parse(response);
}

/**
 * 查询文件树
 * @param organizationId
 * @param repositoryId
 * @param path
 * @param ref
 * @param type
 */
export async function listFilesFunc(
  organizationId: string,
  repositoryId: string,
  path?: string,
  ref?: string,
  type?: string // Possible values: DIRECT, RECURSIVE, FLATTEN
): Promise<z.infer<typeof FileInfoSchema>[]> {
  // 自动处理repositoryId中未编码的斜杠
  let encodedRepoId = repositoryId;
  if (repositoryId.includes("/")) {
    // 发现未编码的斜杠，自动进行URL编码
    const parts = repositoryId.split("/", 2);
    if (parts.length === 2) {
      const encodedRepoName = encodeURIComponent(parts[1]);
      // 移除编码中的+号（空格被编码为+，但我们需要%20）
      const formattedEncodedName = encodedRepoName.replace(/\+/g, "%20");
      encodedRepoId = `${parts[0]}%2F${formattedEncodedName}`;
    }
  }

  const baseUrl = `/oapi/v1/codeup/organizations/${organizationId}/repositories/${encodedRepoId}/files/tree`;
  
  // 构建查询参数
  const queryParams: Record<string, string | number | undefined> = {};
  
  if (path) {
    queryParams.path = path;
  }
  
  if (ref) {
    queryParams.ref = ref;
  }
  
  if (type) {
    queryParams.type = type;
  }

  // 使用buildUrl函数构建包含查询参数的URL
  const url = buildUrl(baseUrl, queryParams);

  const response = await yunxiaoRequest(url, {
    method: "GET",
  });

  // 确保响应是数组
  if (!Array.isArray(response)) {
    return [];
  }

  // 解析每个文件信息对象
  return response.map(fileInfo => FileInfoSchema.parse(fileInfo));
} 