import { z } from "zod";
import { yunxiaoRequest, buildUrl, handleRepositoryIdEncoding, floatToIntString } from "../../common/utils.js";
import { 
  ChangeRequestSchema, 
  PatchSetSchema
} from "./types.js";

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
 * 查询合并请求详情
 * 
 * @param organizationId 组织ID，示例：'60d54f3daccf2bbd6659f3ad'
 * @param repositoryId 代码库ID或路径，示例：'2835387' 或 '60de7a6852743a5162b5f957%2FDemoRepo'
 * @param localId 合并请求局部ID，示例：'1'
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
 * 支持多条件筛选、分页以及排序
 * 
 * @param organizationId 组织ID，示例：'60d54f3daccf2bbd6659f3ad'
 * @param page 页码，从1开始，默认1
 * @param perPage 每页大小，默认20
 * @param projectIds 代码库ID或路径列表，多个以逗号分隔，示例：'2813489,2813490'
 * @param authorIds 创建者用户ID列表，多个以逗号分隔，示例：'62c795xxxb468af8'
 * @param reviewerIds 评审人用户ID列表，多个以逗号分隔，示例：'62c795xxxb468af8'
 * @param state 合并请求筛选状态：'opened' - 已开启；'merged' - 已合并；'closed' - 已关闭。默认为null，即查询全部状态
 * @param search 标题关键字搜索，示例：'mr title'
 * @param orderBy 排序字段：'created_at' - 创建时间；'updated_at' - 更新时间（默认）
 * @param sort 排序方式：'asc' - 升序；'desc' - 降序（默认）
 * @param createdBefore 起始创建时间，ISO 8601格式，示例：'2024-04-05T15:30:45Z'
 * @param createdAfter 截止创建时间，ISO 8601格式，示例：'2024-04-05T15:30:45Z'
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
 * 查询合并请求的版本列表（Patch Sets）
 * Patch Sets 表示合并请求在不同时间点的版本快照
 * 
 * @param organizationId 组织ID，示例：'60d54f3daccf2bbd6659f3ad'
 * @param repositoryId 代码库ID或路径，示例：'2835387' 或 '60de7a6852743a5162b5f957%2FDemoRepo'
 * @param localId 合并请求局部ID，示例：'1'
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
 * 
 * @param organizationId 组织ID，示例：'60d54f3daccf2bbd6659f3ad'
 * @param repositoryId 代码库ID或路径，示例：'2835387' 或 '60de7a6852743a5162b5f957%2FDemoRepo'
 * @param title 标题，不超过256个字符，示例：'mr title'
 * @param sourceBranch 源分支名称，示例：'demo-branch'
 * @param targetBranch 目标分支名称，示例：'master'
 * @param description 描述，不超过10000个字符（可选），示例：'mr description'
 * @param sourceProjectId 源库ID（可选，未提供时将尝试自动获取），示例：2813489
 * @param targetProjectId 目标库ID（可选，未提供时将尝试自动获取），示例：2813489
 * @param reviewerUserIds 评审人用户ID列表（可选），示例：['62c795xxxb468af8']
 * @param workItemIds 关联工作项ID列表（可选），示例：['workitem-123']
 * @param createFrom 创建来源，默认 'WEB'。可选值：'WEB' - 页面创建；'COMMAND_LINE' - 命令行创建
 * @param triggerAIReviewRun 是否触发AI评审，默认 false
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
  createFrom: string = "WEB", // Possible values: WEB, COMMAND_LINE
  triggerAIReviewRun: boolean = false // Whether to trigger AI review
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
  
  if (triggerAIReviewRun !== undefined) {
    payload.triggerAIReviewRun = triggerAIReviewRun;
  }
  
  const response = await yunxiaoRequest(url, {
    method: "POST",
    body: payload,
  });
  
  return ChangeRequestSchema.parse(response);
} 