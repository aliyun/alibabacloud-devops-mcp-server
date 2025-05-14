import { z } from "zod";
import { yunxiaoRequest, buildUrl, handleRepositoryIdEncoding } from "../../common/utils.js";
import { 
  ChangeRequestCommentSchema,
  CreateChangeRequestCommentSchema,
  CreateChangeRequestCommentOptions,
  ListChangeRequestCommentsSchema,
  ListChangeRequestCommentsOptions
} from "../../common/types.js";

/**
 * 创建合并请求评论
 * @param organizationId
 * @param repositoryId
 * @param localId
 * @param comment_type
 * @param content
 * @param draft
 * @param resolved
 * @param patchset_biz_id
 * @param file_path
 * @param line_number
 * @param from_patchset_biz_id
 * @param to_patchset_biz_id
 * @param parent_comment_biz_id
 */
export async function createChangeRequestCommentFunc(
  organizationId: string,
  repositoryId: string,
  localId: string,
  comment_type: string, // Possible values: GLOBAL_COMMENT, INLINE_COMMENT
  content: string,
  draft: boolean,
  resolved: boolean,
  patchset_biz_id: string,
  file_path?: string,
  line_number?: number,
  from_patchset_biz_id?: string,
  to_patchset_biz_id?: string,
  parent_comment_biz_id?: string
): Promise<z.infer<typeof ChangeRequestCommentSchema>> {
  const encodedRepoId = handleRepositoryIdEncoding(repositoryId);

  const url = `/oapi/v1/codeup/organizations/${organizationId}/repositories/${encodedRepoId}/changeRequests/${localId}/comments`;

  // 准备payload
  const payload: Record<string, any> = {
    comment_type: comment_type,
    content: content,
    draft: draft,
    resolved: resolved,
    patchset_biz_id: patchset_biz_id,
  };

  // 根据评论类型添加必要参数
  if (comment_type === "INLINE_COMMENT") {
    // 检查INLINE_COMMENT必需的参数
    if (!file_path || line_number === undefined || !from_patchset_biz_id || !to_patchset_biz_id) {
      throw new Error("For INLINE_COMMENT, file_path, line_number, from_patchset_biz_id, and to_patchset_biz_id are required");
    }

    payload.file_path = file_path;
    payload.line_number = line_number;
    payload.from_patchset_biz_id = from_patchset_biz_id;
    payload.to_patchset_biz_id = to_patchset_biz_id;
  }

  // 添加可选参数
  if (parent_comment_biz_id) {
    payload.parent_comment_biz_id = parent_comment_biz_id;
  }

  const response = await yunxiaoRequest(url, {
    method: "POST",
    body: payload,
  });

  return ChangeRequestCommentSchema.parse(response);
}

/**
 * 获取合并请求评论列表
 * @param organizationId
 * @param repositoryId
 * @param localId
 * @param patchSetBizIds
 * @param commentType
 * @param state
 * @param resolved
 * @param filePath
 */
export async function listChangeRequestCommentsFunc(
  organizationId: string,
  repositoryId: string,
  localId: string,
  patchSetBizIds?: string[],
  commentType: string = "GLOBAL_COMMENT", // Possible values: GLOBAL_COMMENT, INLINE_COMMENT
  state: string = "OPENED", // Possible values: OPENED, DRAFT
  resolved: boolean = false,
  filePath?: string
): Promise<z.infer<typeof ChangeRequestCommentSchema>[]> {
  const encodedRepoId = handleRepositoryIdEncoding(repositoryId);

  const url = `/oapi/v1/codeup/organizations/${organizationId}/repositories/${encodedRepoId}/changeRequests/${localId}/comments/list`;

  // 准备payload
  const payload: Record<string, any> = {
    patchSetBizIds: patchSetBizIds || [],
    commentType: commentType,
    state: state,
    resolved: resolved,
  };

  // 添加可选参数
  if (filePath) {
    payload.filePath = filePath;
  }

  const response = await yunxiaoRequest(url, {
    method: "POST",
    body: payload,
  });

  // 确保响应是数组
  if (!Array.isArray(response)) {
    return [];
  }

  // 解析每个评论对象
  return response.map(comment => ChangeRequestCommentSchema.parse(comment));
} 