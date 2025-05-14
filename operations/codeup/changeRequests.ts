import { z } from "zod";
import { yunxiaoRequest, buildUrl, handleRepositoryIdEncoding, floatToIntString } from "../../common/utils.js";
import { 
  ChangeRequestSchema, 
  PatchSetSchema,
  GetChangeRequestSchema,
  GetChangeRequestOptions,
  ListChangeRequestsSchema,
  ListChangeRequestsOptions,
  ListChangeRequestPatchSetsSchema,
  ListChangeRequestPatchSetsOptions,
  CreateChangeRequestSchema,
  CreateChangeRequestOptions
} from "../../common/types.js";

// 通过API获取仓库的数字ID
async function getRepositoryNumericId(organizationId: string, repositoryId: string): Promise<string> {
  const url = `/oapi/v1/codeup/organizations/${organizationId}/repositories/${repositoryId}`;
  
  const response = await yunxiaoRequest(url, {
    method: "GET",
  });
  
  if (!response || typeof response !== 'object' || !('id' in response)) {
    throw new Error("Failed to get repository ID");
  }
  
  const repoId = response.id;
  if (!repoId) {
    throw new Error("Could not get repository ID");
  }
  
  return repoId.toString();
}

/**
 * 查询合并请求
 * @param organizationId
 * @param repositoryId
 * @param localId
 */
export async function getChangeRequestFunc(
  organizationId: string,
  repositoryId: string,
  localId: string
): Promise<z.infer<typeof ChangeRequestSchema>> {
  const encodedRepoId = handleRepositoryIdEncoding(repositoryId);

  const url = `/oapi/v1/codeup/organizations/${organizationId}/repositories/${encodedRepoId}/changeRequests/${localId}`;

  const response = await yunxiaoRequest(url, {
    method: "GET",
  });

  return ChangeRequestSchema.parse(response);
}

/**
 * 查询合并请求列表
 * @param organizationId
 * @param page
 * @param perPage
 * @param projectIds
 * @param authorIds
 * @param reviewerIds
 * @param state
 * @param search
 * @param orderBy
 * @param sort
 * @param createdBefore
 * @param createdAfter
 */
export async function listChangeRequestsFunc(
  organizationId: string,
  page?: number,
  perPage?: number,
  projectIds?: string,
  authorIds?: string,
  reviewerIds?: string,
  state?: string, // Possible values: opened, merged, closed
  search?: string,
  orderBy?: string, // Possible values: created_at, updated_at
  sort?: string, // Possible values: asc, desc
  createdBefore?: string,
  createdAfter?: string
): Promise<z.infer<typeof ChangeRequestSchema>[]> {
  const baseUrl = `/oapi/v1/codeup/organizations/${organizationId}/changeRequests`;
  
  // 构建查询参数
  const queryParams: Record<string, string | number | undefined> = {};
  
  if (page !== undefined) {
    queryParams.page = page;
  }
  
  if (perPage !== undefined) {
    queryParams.perPage = perPage;
  }
  
  if (projectIds !== undefined) {
    queryParams.projectIds = projectIds;
  }
  
  if (authorIds !== undefined) {
    queryParams.authorIds = authorIds;
  }
  
  if (reviewerIds !== undefined) {
    queryParams.reviewerIds = reviewerIds;
  }
  
  if (state !== undefined) {
    queryParams.state = state;
  }
  
  if (search !== undefined) {
    queryParams.search = search;
  }
  
  if (orderBy !== undefined) {
    queryParams.orderBy = orderBy;
  }
  
  if (sort !== undefined) {
    queryParams.sort = sort;
  }
  
  if (createdBefore !== undefined) {
    queryParams.createdBefore = createdBefore;
  }
  
  if (createdAfter !== undefined) {
    queryParams.createdAfter = createdAfter;
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

  // 解析每个变更请求对象
  return response.map(changeRequest => ChangeRequestSchema.parse(changeRequest));
}

/**
 * 查询合并请求的版本列表
 * @param organizationId
 * @param repositoryId
 * @param localId
 */
export async function listChangeRequestPatchSetsFunc(
  organizationId: string,
  repositoryId: string,
  localId: string
): Promise<z.infer<typeof PatchSetSchema>[]> {
  const encodedRepoId = handleRepositoryIdEncoding(repositoryId);

  const url = `/oapi/v1/codeup/organizations/${organizationId}/repositories/${encodedRepoId}/changeRequests/${localId}/diffs/patches`;

  const response = await yunxiaoRequest(url, {
    method: "GET",
  });

  // 确保响应是数组
  if (!Array.isArray(response)) {
    return [];
  }

  // 解析每个版本对象
  return response.map(patchSet => PatchSetSchema.parse(patchSet));
}

/**
 * 创建合并请求
 * @param organizationId
 * @param repositoryId
 * @param title
 * @param sourceBranch
 * @param targetBranch
 * @param description
 * @param sourceProjectId
 * @param targetProjectId
 * @param reviewerUserIds
 * @param workItemIds
 * @param createFrom
 */
export async function createChangeRequestFunc(
  organizationId: string,
  repositoryId: string,
  title: string,
  sourceBranch: string,
  targetBranch: string,
  description?: string,
  sourceProjectId?: number,
  targetProjectId?: number,
  reviewerUserIds?: string[],
  workItemIds?: string[],
  createFrom: string = "WEB" // Possible values: WEB, COMMAND_LINE
): Promise<z.infer<typeof ChangeRequestSchema>> {
  const encodedRepoId = handleRepositoryIdEncoding(repositoryId);
  
  // 检查和获取sourceProjectId和targetProjectId
  let sourceIdString: string | undefined;
  let targetIdString: string | undefined;
  
  if (sourceProjectId !== undefined) {
    sourceIdString = floatToIntString(sourceProjectId);
  }
  
  if (targetProjectId !== undefined) {
    targetIdString = floatToIntString(targetProjectId);
  }
  
  // 如果repositoryId是纯数字，且sourceProjectId或targetProjectId未提供，直接使用repositoryId的值
  if (!isNaN(Number(repositoryId))) {
    // 是数字ID，可以直接使用
    if (sourceIdString === undefined) {
      sourceIdString = repositoryId;
    }
    if (targetIdString === undefined) {
      targetIdString = repositoryId;
    }
  } else if (repositoryId.includes("%2F") || repositoryId.includes("/")) {
    // 如果是组织ID与仓库名称的组合，调用API获取数字ID
    if (sourceIdString === undefined || targetIdString === undefined) {
      try {
        const numericId = await getRepositoryNumericId(organizationId, encodedRepoId);
        
        if (sourceIdString === undefined) {
          sourceIdString = numericId;
        }
        if (targetIdString === undefined) {
          targetIdString = numericId;
        }
      } catch (error) {
        throw new Error(`When using 'organizationId%2Frepo-name' format, you must first get the numeric ID of the repository and use it for sourceProjectId and targetProjectId parameters. Please use get_repository tool to get the numeric ID of '${repositoryId}' and then use that ID as the value for sourceProjectId and targetProjectId.`);
      }
    }
  }
  
  // 确保sourceProjectId和targetProjectId已设置
  if (sourceIdString === undefined) {
    throw new Error("Could not get sourceProjectId, please provide this parameter manually");
  }
  if (targetIdString === undefined) {
    throw new Error("Could not get targetProjectId, please provide this parameter manually");
  }
  
  const url = `/oapi/v1/codeup/organizations/${organizationId}/repositories/${encodedRepoId}/changeRequests`;
  
  // 准备payload
  const payload: Record<string, any> = {
    title: title,
    sourceBranch: sourceBranch,
    targetBranch: targetBranch,
    sourceProjectId: sourceIdString,
    targetProjectId: targetIdString,
    createFrom: createFrom,
  };
  
  // 添加可选参数
  if (description !== undefined) {
    payload.description = description;
  }
  
  if (reviewerUserIds !== undefined) {
    payload.reviewerUserIds = reviewerUserIds;
  }
  
  if (workItemIds !== undefined) {
    payload.workItemIds = workItemIds;
  }
  
  const response = await yunxiaoRequest(url, {
    method: "POST",
    body: payload,
  });
  
  return ChangeRequestSchema.parse(response);
} 