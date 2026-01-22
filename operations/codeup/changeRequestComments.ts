import { z } from "zod";
import { yunxiaoRequest, buildUrl, handleRepositoryIdEncoding } from "../../common/utils.js";
import { 
  ChangeRequestCommentSchema
} from "./types.js";

/**
 * 创建合并请求评论
 * 支持两种评论类型：
 * 1. GLOBAL_COMMENT - 全局评论：对整个合并请求的评论
 * 2. INLINE_COMMENT - 行内评论：针对特定代码行的评论
 * 
 * 创建行内评论时，必须提供以下参数：
 * - file_path: 文件路径，例如 '/src/main/java/com/example/MyClass.java'
 * - line_number: 行号，例如 42
 * - from_patchset_biz_id: 比较的起始版本ID（通常是目标分支版本）
 * - to_patchset_biz_id: 比较的目标版本ID（通常是源分支版本）
 * 
 * @param organizationId 组织ID，示例：'60d54f3daccf2bbd6659f3ad'
 * @param repositoryId 代码库ID或路径，示例：'2835387' 或 '60de7a6852743a5162b5f957%2FDemoRepo'
 * @param localId 合并请求局部ID，示例：'1'
 * @param comment_type 评论类型：'GLOBAL_COMMENT' 或 'INLINE_COMMENT'
 * @param content 评论内容，长度1-65535，示例：'This is a comment content.'
 * @param draft 是否草稿评论，默认 false
 * @param resolved 是否标记已解决，默认 false
 * @param patchset_biz_id 关联版本ID，示例：'bf117304dfe44d5d9b1132f348edf92e'
 * @param file_path 文件路径（仅行内评论），示例：'/src/main/java/com/example/MyClass.java'
 * @param line_number 行号（仅行内评论），示例：42
 * @param from_patchset_biz_id 起始版本ID（行内评论必传），示例：'bf117304dfe44d5d9b1132f348edf92e'
 * @param to_patchset_biz_id 目标版本ID（行内评论必传），示例：'537367017a9841738ac4269fbf6aacbe'
 * @param parent_comment_biz_id 父评论ID（用于回复），示例：'1d8171cf0cc2453197fae0e0a27d5ece'
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
 * 支持按评论类型、状态、解决状态和文件路径进行过滤
 * 
 * @param organizationId 组织ID，示例：'60d54f3daccf2bbd6659f3ad'
 * @param repositoryId 代码库ID或路径，示例：'2835387' 或 '60de7a6852743a5162b5f957%2FDemoRepo'
 * @param localId 合并请求局部ID，示例：'1'
 * @param patchSetBizIds 版本ID列表（可选），示例：['bf117304dfe44d5d9b1132f348edf92e']
 * @param commentType 评论类型：'GLOBAL_COMMENT' 或 'INLINE_COMMENT'，默认 'GLOBAL_COMMENT'
 * @param state 评论状态：'OPENED' 或 'DRAFT'，默认 'OPENED'
 * @param resolved 是否已解决，默认 false
 * @param filePath 文件路径过滤（仅行内评论），示例：'/src/main/java/com/example/MyClass.java'
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

/**
 * 更新合并请求评论
 * 可以更新评论的内容和解决状态
 * 
 * @param organizationId 组织ID，示例：'60d54f3daccf2bbd6659f3ad'
 * @param repositoryId 代码库ID或路径，示例：'2835387' 或 '60de7a6852743a5162b5f957%2FDemoRepo'
 * @param localId 合并请求局部ID，示例：'1'
 * @param commentBizId 评论 bizId，示例：'bf117304dfe44d5d9b1132f348edf92e'
 * @param content 更新后的评论内容（可选），示例：'your new comment'
 * @param resolved 是否已解决（可选），示例：false
 */
export async function updateChangeRequestCommentFunc(
  organizationId: string,
  repositoryId: string,
  localId: string,
  commentBizId: string,
  content?: string,
  resolved?: boolean
): Promise<{ result: boolean }> {
  const encodedRepoId = handleRepositoryIdEncoding(repositoryId);

  const url = `/oapi/v1/codeup/organizations/${organizationId}/repositories/${encodedRepoId}/changeRequests/${localId}/comments/${commentBizId}`;

  // 准备payload
  const payload: Record<string, any> = {};

  if (content !== undefined) {
    payload.content = content;
  }

  if (resolved !== undefined) {
    payload.resolved = resolved;
  }

  const response = await yunxiaoRequest(url, {
    method: "PUT",
    body: payload,
  });

  // 根据 swagger 文档，响应格式为 { result: boolean }
  return response as { result: boolean };
} 