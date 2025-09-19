import { z } from "zod";

// Codeup Branch related schemas
export const CodeupBranchSchema = z.object({
  name: z.string().optional().describe("Branch name"),
  defaultBranch: z.boolean().optional().describe("Whether it is the default branch"),
  commit: z.object({
    authorEmail: z.string().optional().describe("Author email"),
    authorName: z.string().optional().describe("Author name"),
    committedDate: z.string().optional().describe("Commit date"),
    committerEmail: z.string().optional().describe("Committer email"),
    committerName: z.string().optional().describe("Committer name"),
    id: z.string().optional().describe("Commit ID"),
    message: z.string().optional().describe("Commit message"),
    parentIds: z.array(z.string()).optional().describe("Parent commit IDs"),
    shortId: z.string().optional().describe("Code group path"),
    stats: z.object({
      additions: z.number().optional().describe("Added lines"),
      deletions: z.number().optional().describe("Deleted lines"),
      total: z.number().optional().describe("Total lines"),
    }).nullable().optional().describe("Commit statistics"),
    title: z.string().optional().describe("Title, first line of the commit message"),
    webUrl: z.string().url().optional().describe("Web access URL"),
  }).nullable().optional().describe("Commit information"),
  protected: z.boolean().optional().describe("Whether it is a protected branch"),
  webUrl: z.string().url().optional().describe("Web access URL"),
});

// Codeup File related schemas
export const FileContentSchema = z.object({
  fileName: z.string().optional().describe("File name"),
  filePath: z.string().optional().describe("File path"),
  size: z.string().optional().describe("File size"),
  content: z.string().optional().describe("File content"),
  encoding: z.string().optional().describe("Content encoding (base64 or text)"),
  ref: z.string().optional().describe("Reference (branch, tag, or commit)"),
  blobId: z.string().optional().describe("Blob ID"),
  commitId: z.string().optional().describe("Commit ID"),
});

export const FileInfoSchema = z.object({
  id: z.string().optional().describe("File/directory ID"),
  name: z.string().optional().describe("File/directory name"),
  path: z.string().optional().describe("File/directory path"),
  type: z.string().optional().describe("Type of entry: tree (directory) or blob (file)"),
  mode: z.string().optional().describe("File mode"),
  size: z.number().int().optional().describe("File size (not present for directories)"),
});

export const CreateFileResponseSchema = z.object({
  filePath: z.string().optional().describe("File path"),
  branch: z.string().optional().describe("Branch name"),
  newOid: z.string().optional().describe("Git Object ID"),
});

export const DeleteFileResponseSchema = z.object({
  filePath: z.string().optional().describe("File path"),
  branch: z.string().optional().describe("Branch name"),
  commitId: z.string().optional().describe("Commit ID"),
  commitMessage: z.string().optional().describe("Commit message"),
});

// Codeup Repository related schemas
export const RepositorySchema = z.object({
  id: z.number().int().optional().describe("Repository ID"),
  name: z.string().optional().describe("Repository name"),
  webUrl: z.string().optional().describe("Web URL for accessing the repository"),
  description: z.string().optional().describe("Repository description"),
  path: z.string().optional().describe("Repository path"),
});

// Codeup Compare related schemas
export const CompareSchema = z.object({
  base_commit_sha: z.string().optional(),
  commits: z.array(z.unknown()).optional(),
  commits_count: z.number().optional(),
  diffs: z.array(z.unknown()).optional(),
  files_count: z.number().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
});

// Codeup Change Request related schemas
export const PatchSetSchema = z.object({
  commitId: z.string().nullable().optional(),
  createTime: z.string().nullable().optional(),
  patchSetBizId: z.string().nullable().optional(),
  patchSetName: z.string().optional(),
  ref: z.string().optional(),
  relatedMergeItemType: z.string().optional(),
  shortId: z.string().optional(),
  versionNo: z.number().int().optional(),
});

export const ChangeRequestCommentSchema = z.object({
  author: z.object({
    avatar: z.string().nullable().optional().describe("用户头像地址"),
    email: z.string().nullable().optional().describe("用户邮箱"),
    name: z.string().nullable().optional().describe("用户名称"),
    state: z.string().nullable().optional().describe("用户状态：active - 激活可用；blocked - 阻塞暂不可用"),
    userId: z.string().nullable().optional().describe("云效用户ID"),
    username: z.string().nullable().optional().describe("用户登录名")
  }).nullable().optional().describe("评论作者信息"),
  child_comments_list: z.array(z.any()).nullable().optional().describe("子评论列表"),
  comment_biz_id: z.string().nullable().optional().describe("评论业务ID"),
  comment_time: z.string().nullable().optional().describe("评论时间 (ISO 8601格式)"),
  comment_type: z.string().nullable().optional().describe("评论类型：GLOBAL_COMMENT - 全局评论；INLINE_COMMENT - 行内评论"),
  content: z.string().nullable().optional().describe("评论内容"),
  expression_reply_list: z.array(z.any()).nullable().optional().describe("表情回复列表"),
  filePath: z.string().nullable().optional().describe("文件路径，仅行内评论有"),
  from_patchset_biz_id: z.string().nullable().optional().describe("比较的起始版本ID"),
  is_deleted: z.boolean().nullable().optional().describe("是否已删除"),
  last_edit_time: z.string().nullable().optional().describe("最后编辑时间 (ISO 8601格式)"),
  last_edit_user: z.object({
    avatar: z.string().nullable().optional().describe("用户头像地址"),
    email: z.string().nullable().optional().describe("用户邮箱"),
    name: z.string().nullable().optional().describe("用户名称"),
    state: z.string().nullable().optional().describe("用户状态"),
    userId: z.string().nullable().optional().describe("云效用户ID"),
    username: z.string().nullable().optional().describe("用户登录名")
  }).nullable().optional().describe("最后编辑用户"),
  last_resolved_status_change_time: z.string().nullable().optional().describe("最后解决状态变更时间 (ISO 8601格式)"),
  last_resolved_status_change_user: z.object({
    avatar: z.string().nullable().optional().describe("用户头像地址"),
    email: z.string().nullable().optional().describe("用户邮箱"),
    name: z.string().nullable().optional().describe("用户名称"),
    state: z.string().nullable().optional().describe("用户状态"),
    userId: z.string().nullable().optional().describe("云效用户ID"),
    username: z.string().nullable().optional().describe("用户登录名")
  }).nullable().optional().describe("最后解决状态变更用户"),
  line_number: z.number().int().nullable().optional().describe("所在行号"),
  location: z.object({
    can_located: z.boolean().nullable().optional().describe("是否可以定位"),
    located_file_path: z.string().nullable().optional().describe("定位的文件路径"),
    located_line_number: z.number().int().nullable().optional().describe("定位的行号"),
    located_patch_set_biz_id: z.string().nullable().optional().describe("定位的补丁集业务ID")
  }).nullable().optional().describe("位置信息"),
  mr_biz_id: z.string().nullable().optional().describe("所属合并请求的业务ID"),
  out_dated: z.boolean().nullable().optional().describe("是否过期评论"),
  parent_comment_biz_id: z.string().nullable().optional().describe("父评论业务ID"),
  project_id: z.number().int().nullable().optional().describe("代码库ID"),
  related_patchset: z.object({
    commitId: z.string().nullable().optional().describe("版本对应的提交ID"),
    createTime: z.string().nullable().optional().describe("版本创建时间 (ISO 8601格式)"),
    patchSetBizId: z.string().nullable().optional().describe("版本ID，具有唯一性"),
    patchSetName: z.string().nullable().optional().describe("版本名称"),
    ref: z.string().nullable().optional().describe("版本对应的ref信息"),
    relatedMergeItemType: z.string().nullable().optional().describe("关联的类型：MERGE_SOURCE - 合并源；MERGE_TARGET - 合并目标"),
    shortId: z.string().nullable().optional().describe("提交ID对应的短ID，通常为8位"),
    versionNo: z.number().int().nullable().optional().describe("版本号")
  }).nullable().optional().describe("关联的补丁集信息"),
  resolved: z.boolean().nullable().optional().describe("是否已解决"),
  root_comment_biz_id: z.string().nullable().optional().describe("根评论业务ID"),
  state: z.string().nullable().optional().describe("评论状态：OPENED - 已公开；DRAFT - 草稿"),
  to_patchset_biz_id: z.string().nullable().optional().describe("比较的目标版本ID"),
});

export const ChangeRequestSchema = z.object({
  ahead: z.number().int().nullable().optional().describe("源分支领先目标分支的commit数量"),
  allRequirementsPass: z.boolean().nullable().optional().describe("是否所有卡点项通过"),
  author: z.object({
    avatar: z.string().nullable().optional().describe("用户头像地址"),
    email: z.string().nullable().optional().describe("用户邮箱"),
    name: z.string().nullable().optional().describe("用户名称"),
    state: z.string().nullable().optional().describe("用户状态：active - 激活可用；blocked - 阻塞暂不可用"),
    userId: z.string().nullable().optional().describe("云效用户ID"),
    username: z.string().nullable().optional().describe("用户登录名")
  }).nullable().optional().describe("创建者信息"),
  behind: z.number().int().nullable().optional().describe("目标分支领先源分支的commit数量"),
  canRevertOrCherryPick: z.boolean().nullable().optional().describe("是否能Revert或者CherryPick"),
  conflictCheckStatus: z.string().nullable().optional().describe("冲突检测状态：CHECKING - 检测中；HAS_CONFLICT - 有冲突；NO_CONFLICT - 无冲突；FAILED - 检测失败"),
  createFrom: z.string().nullable().optional().describe("创建来源：WEB - 页面创建；COMMAND_LINE - 命令行创建"),
  createTime: z.string().nullable().optional().describe("创建时间 (ISO 8601格式)"),
  description: z.string().nullable().optional().describe("描述"),
  detailUrl: z.string().nullable().optional().describe("合并请求详情地址"),
  hasReverted: z.boolean().nullable().optional().describe("是否Revert过"),
  localId: z.union([z.string(), z.number().int()]).nullable().optional().describe("局部ID，表示代码库中第几个合并请求"),
  mergedRevision: z.string().nullable().optional().describe("合并版本（提交ID），仅已合并状态才有值"),
  mrType: z.string().nullable().optional().describe("合并请求类型"),
  projectId: z.number().int().nullable().optional().describe("项目ID"),
  reviewers: z.array(z.object({
    avatar: z.string().nullable().optional().describe("用户头像地址"),
    email: z.string().nullable().optional().describe("用户邮箱"),
    hasCommented: z.boolean().nullable().optional().describe("是否已评论"),
    hasReviewed: z.boolean().nullable().optional().describe("是否已审阅"),
    name: z.string().nullable().optional().describe("用户名称"),
    reviewOpinionStatus: z.string().nullable().optional().describe("审阅意见状态"),
    reviewTime: z.string().nullable().optional().describe("审阅时间 (ISO 8601格式)"),
    state: z.string().nullable().optional().describe("用户状态"),
    userId: z.string().nullable().optional().describe("云效用户ID"),
    username: z.string().nullable().optional().describe("用户登录名")
  })).nullable().optional().describe("评审人列表"),
  sourceBranch: z.string().nullable().optional().describe("源分支"),
  sourceCommitId: z.string().nullable().optional().describe("源提交ID，当createFrom=COMMAND_LINE时有值"),
  sourceProjectId: z.union([z.string(), z.number().int()]).nullable().optional().describe("源库ID"),
  sourceRef: z.string().nullable().optional().describe("源提交引用，当createFrom=COMMAND_LINE时有值"),
  status: z.string().nullable().optional().describe("合并请求状态：UNDER_DEV - 开发中；UNDER_REVIEW - 评审中；TO_BE_MERGED - 待合并；CLOSED - 已关闭；MERGED - 已合并"),
  subscribers: z.array(z.object({
    avatar: z.string().nullable().optional().describe("用户头像地址"),
    email: z.string().nullable().optional().describe("用户邮箱"),
    name: z.string().nullable().optional().describe("用户名称"),
    state: z.string().nullable().optional().describe("用户状态"),
    userId: z.string().nullable().optional().describe("云效用户ID"),
    username: z.string().nullable().optional().describe("用户登录名")
  })).nullable().optional().describe("订阅人列表"),
  supportMergeFastForwardOnly: z.boolean().nullable().optional().describe("是否支持fast-forward-only"),
  targetBranch: z.string().nullable().optional().describe("目标分支"),
  targetProjectId: z.union([z.string(), z.number().int()]).nullable().optional().describe("目标库ID"),
  targetProjectNameWithNamespace: z.string().nullable().optional().describe("目标库名称（含完整父路径）"),
  targetProjectPathWithNamespace: z.string().nullable().optional().describe("目标库路径（含完整父路径）"),
  title: z.string().nullable().optional().describe("标题"),
  totalCommentCount: z.number().int().nullable().optional().describe("总评论数"),
  unResolvedCommentCount: z.number().int().nullable().optional().describe("未解决评论数"),
  updateTime: z.string().nullable().optional().describe("更新时间 (ISO 8601格式)"),
  webUrl: z.string().nullable().optional().describe("页面地址")
});

// Codeup Branch related schemas
export const CreateBranchSchema = z.object({
  organizationId: z.string().describe("Organization ID, can be found in the basic information page of the organization admin console"),
  repositoryId: z.string().describe("Repository ID or a combination of organization ID and repository name, for example: 2835387 or organizationId%2Frepo-name (Note: slashes need to be URL encoded as %2F)"),
  branch: z.string().describe("Name of the branch to be created"),
  ref: z.string().default("master").describe("Source branch name, the new branch will be created based on this branch, default value is master"),
});

export const GetBranchSchema = z.object({
  organizationId: z.string().describe("Organization ID, can be found in the basic information page of the organization admin console"),
  repositoryId: z.string().describe("Repository ID or a combination of organization ID and repository name, for example: 2835387 or organizationId%2Frepo-name (Note: slashes need to be URL encoded as %2F)"),
  branchName: z.string().describe("Branch name (if it contains special characters, use URL encoding), example: master or feature%2Fdev"),
});

export const DeleteBranchSchema = z.object({
  organizationId: z.string().describe("Organization ID, can be found in the basic information page of the organization admin console"),
  repositoryId: z.string().describe("Repository ID or a combination of organization ID and repository name, for example: 2835387 or organizationId%2Frepo-name (Note: slashes need to be URL encoded as %2F)"),
  branchName: z.string().describe("Branch name (use URL-Encoder for encoding, example: feature%2Fdev)"),
});

export const ListBranchesSchema = z.object({
  organizationId: z.string().describe("Organization ID, can be found in the basic information page of the organization admin console"),
  repositoryId: z.string().describe("Repository ID or a combination of organization ID and repository name, for example: 2835387 or organizationId%2Frepo-name (Note: slashes need to be URL encoded as %2F)"),
  page: z.number().int().default(1).optional().describe("Page number"),
  perPage: z.number().int().default(20).optional().describe("Items per page"),
  sort: z.enum(["name_asc", "name_desc", "updated_asc", "updated_desc"]).default("name_asc").optional().describe("Sort order: name_asc - name ascending, name_desc - name descending, updated_asc - update time ascending, updated_desc - update time descending"),
  search: z.string().nullable().optional().describe("Search query"),
});

// Codeup repositories related Schema definitions
export const GetRepositorySchema = z.object({
  organizationId: z.string().describe("Organization ID, can be found in the basic information page of the organization admin console"),
  repositoryId: z.string().describe("Repository ID or a combination of organization ID and repository name, for example: 2835387 or organizationId%2Frepo-name (Note: slashes need to be URL encoded as %2F)"),
});

export const ListRepositoriesSchema = z.object({
  organizationId: z.string().describe("Organization ID, can be found in the basic information page of the organization admin console"),
  page: z.number().int().default(1).optional().describe("Page number, default starts from 1, generally should not exceed 150 pages"),
  perPage: z.number().int().default(20).optional().describe("Items per page, default 20, value range [1, 100]"),
  orderBy: z.string().default("created_at").optional().describe("Sort field, options include {created_at, name, path, last_activity_at}, default is created_at"),
  sort: z.string().default("desc").optional().describe("Sort order, options include {asc, desc}, default is desc"),
  search: z.string().nullable().optional().describe("Search keyword, used to fuzzy match repository paths"),
  archived: z.boolean().default(false).optional().describe("Whether archived"),
});

// Codeup files related Schema definitions
export const GetFileBlobsSchema = z.object({
  organizationId: z.string().describe("Organization ID, can be found in the basic information page of the organization admin console"),
  repositoryId: z.string().describe("Repository ID or a combination of organization ID and repository name, for example: 2835387 or organizationId%2Frepo-name (Note: slashes need to be URL encoded as %2F)"),
  filePath: z.string().describe("File path, needs to be URL encoded, for example: /src/main/java/com/aliyun/test.java"),
  ref: z.string().describe("Reference name, usually branch name, can be branch name, tag name or commit SHA. If not provided, the default branch of the repository will be used, such as master"),
});

export const CreateFileSchema = z.object({
  organizationId: z.string().describe("Organization ID, can be found in the basic information page of the organization admin console"),
  repositoryId: z.string().describe("Repository ID or a combination of organization ID and repository name, for example: 2835387 or organizationId%2Frepo-name (Note: slashes need to be URL encoded as %2F)"),
  filePath: z.string().describe("File path, needs to be URL encoded, for example: /src/main/java/com/aliyun/test.java"),
  content: z.string().describe("File content"),
  commitMessage: z.string().describe("Commit message, not empty, no more than 102400 characters"),
  branch: z.string().describe("Branch name"),
  encoding: z.string().optional().describe("Encoding rule, options {text, base64}, default is text"),
});

export const UpdateFileSchema = z.object({
  organizationId: z.string().describe("Organization ID, can be found in the basic information page of the organization admin console"),
  repositoryId: z.string().describe("Repository ID or a combination of organization ID and repository name, for example: 2835387 or organizationId%2Frepo-name (Note: slashes need to be URL encoded as %2F)"),
  filePath: z.string().describe("File path, needs to be URL encoded, for example: /src/main/java/com/aliyun/test.java"),
  content: z.string().describe("File content"),
  commitMessage: z.string().describe("Commit message, not empty, no more than 102400 characters"),
  branch: z.string().describe("Branch name"),
  encoding: z.string().default("text").optional().describe("Encoding rule, options {text, base64}, default is text"),
});

export const DeleteFileSchema = z.object({
  organizationId: z.string().describe("Organization ID, can be found in the basic information page of the organization admin console"),
  repositoryId: z.string().describe("Repository ID or a combination of organization ID and repository name, for example: 2835387 or organizationId%2Frepo-name (Note: slashes need to be URL encoded as %2F)"),
  filePath: z.string().describe("File path, needs to be URL encoded, for example: /src/main/java/com/aliyun/test.java"),
  commitMessage: z.string().describe("Commit message"),
  branch: z.string().describe("Branch name"),
});

export const ListFilesSchema = z.object({
  organizationId: z.string().describe("Organization ID, can be found in the basic information page of the organization admin console"),
  repositoryId: z.string().describe("Repository ID or a combination of organization ID and repository name, for example: 2835387 or organizationId%2Frepo-name (Note: slashes need to be URL encoded as %2F)"),
  path: z.string().optional().describe("Specific path to query, for example to query files in the src/main directory"),
  ref: z.string().optional().describe("Reference name, usually branch name, can be branch name, tag name or commit SHA. If not provided, the default branch of the repository will be used, such as master"),
  type: z.string().default("RECURSIVE").optional().describe("File tree retrieval method: DIRECT - only get the current directory, default method; RECURSIVE - recursively find all files under the current path; FLATTEN - flat display (if it is a directory, recursively find until the subdirectory contains files or multiple directories)"),
});

// Codeup compare related Schema definitions
export const GetCompareSchema = z.object({
  organizationId: z.string().describe("Organization ID, can be found in the basic information page of the organization admin console"),
  repositoryId: z.string().describe("Repository ID or a combination of organization ID and repository name, for example: 2835387 or organizationId%2Frepo-name (Note: slashes need to be URL encoded as %2F)"),
  from: z.string().describe("Can be CommitSHA, branch name or tag name"),
  to: z.string().describe("Can be CommitSHA, branch name or tag name"),
  sourceType: z.string().nullable().optional().describe("Options: branch, tag; if it's a commit comparison, you can omit this; if it's a branch comparison, you need to provide: branch, or you can omit it but ensure there are no branch or tag name conflicts; if it's a tag comparison, you need to provide: tag; if there are branches and tags with the same name, you need to strictly provide branch or tag"),
  targetType: z.string().nullable().optional().describe("Options: branch, tag; if it's a commit comparison, you can omit this; if it's a branch comparison, you need to provide: branch, or you can omit it but ensure there are no branch or tag name conflicts; if it's a tag comparison, you need to provide: tag; if there are branches and tags with the same name, you need to strictly provide branch or tag"),
  straight: z.string().default("false").nullable().optional().describe("Whether to use Merge-Base: straight=false means using Merge-Base; straight=true means not using Merge-Base; default is false, meaning using Merge-Base"),
});

// Codeup change requests related Schema definitions
export const GetChangeRequestSchema = z.object({
  organizationId: z.string().describe("Organization ID, can be found in the basic information page of the organization admin console"),
  repositoryId: z.string().describe("Repository ID or a combination of organization ID and repository name, for example: 2835387 or organizationId%2Frepo-name (Note: slashes need to be URL encoded as %2F)"),
  localId: z.string().describe("Local ID, represents the nth merge request in the repository"),
});

export const ListChangeRequestsSchema = z.object({
  organizationId: z.string().describe("Organization ID, can be found in the basic information page of the organization admin console"),
  page: z.number().int().default(1).optional().describe("Page number"),
  perPage: z.number().int().default(20).optional().describe("Items per page"),
  projectIds: z.string().nullable().optional().describe("Repository ID or a combination of organization ID and repository name list, for example: 2835387 or organizationId%2Frepo-name (Note: slashes need to be URL encoded as %2F), multiple separated by commas"),
  authorIds: z.string().nullable().optional().describe("Creator user ID list, multiple separated by commas"),
  reviewerIds: z.string().nullable().optional().describe("Reviewer user ID list, multiple separated by commas"),
  state: z.string().nullable().optional().describe("Merge request filter status. Possible values: opened, merged, closed. Default is null, which queries all statuses"),
  search: z.string().nullable().optional().describe("Title keyword search"),
  orderBy: z.string().default("updated_at").optional().describe("Sort field. Possible values: created_at (creation time), updated_at (update time, default)"),
  sort: z.string().default("desc").optional().describe("Sort order. Possible values: asc (ascending), desc (descending, default)"),
  createdBefore: z.string().nullable().optional().describe("Start creation time, time format is ISO 8601, for example: 2019-03-15T08:00:00Z"),
  createdAfter: z.string().nullable().optional().describe("End creation time, time format is ISO 8601, for example: 2019-03-15T08:00:00Z"),
});

export const CreateChangeRequestSchema = z.object({
  organizationId: z.string().describe("Organization ID, can be found in the basic information page of the organization admin console"),
  repositoryId: z.string().describe("Repository ID or a combination of organization ID and repository name, for example: 2835387 or organizationId%2Frepo-name (Note: slashes need to be URL encoded as %2F)"),
  title: z.string().describe("Title, no more than 256 characters"),
  description: z.string().nullable().optional().describe("Description, no more than 10000 characters"),
  sourceBranch: z.string().describe("Source branch name"),
  sourceProjectId: z.number().optional().describe("Source repository ID (if not provided, will try to get automatically)"),
  targetBranch: z.string().describe("Target branch name"),
  targetProjectId: z.number().optional().describe("Target repository ID (if not provided, will try to get automatically)"),
  reviewerUserIds: z.array(z.string()).nullable().optional().describe("Reviewer user ID list"),
  workItemIds: z.array(z.string()).nullable().optional().describe("Associated work item ID list"),
  createFrom: z.string().optional().default("WEB").describe("Creation source. Possible values: WEB (created from web page), COMMAND_LINE (created from command line). Default is WEB"),
});

export const ListChangeRequestPatchSetsSchema = z.object({
  organizationId: z.string().describe("Organization ID, can be found in the basic information page of the organization admin console"),
  repositoryId: z.string().describe("Repository ID or a combination of organization ID and repository name, for example: 2835387 or organizationId%2Frepo-name (Note: slashes need to be URL encoded as %2F)"),
  localId: z.string().describe("Local ID, represents the nth merge request in the repository"),
});

// Codeup change request comments related Schema definitions
export const CreateChangeRequestCommentSchema = z.object({
  organizationId: z.string().describe("Organization ID, can be found in the basic information page of the organization admin console"),
  repositoryId: z.string().describe("Repository ID or a combination of organization ID and repository name, for example: 2835387 or organizationId%2Frepo-name (Note: slashes need to be URL encoded as %2F)"),
  localId: z.string().describe("Local ID, represents the nth merge request in the repository"),
  comment_type: z.string().default("GLOBAL_COMMENT").describe("Comment type. Possible values: GLOBAL_COMMENT, INLINE_COMMENT"),
  content: z.string().describe("Comment content, length must be between 1 and 65535"),
  draft: z.boolean().default(false).describe("Whether it is a draft comment"),
  resolved: z.boolean().default(false).describe("Whether to mark as resolved"),
  patchset_biz_id: z.string().describe("Associated version ID, if it's INLINE_COMMENT, choose one from from_patchset_biz_id or to_patchset_biz_id"),
  file_path: z.string().nullable().optional().describe("File name, only for inline comments"),
  line_number: z.number().int().nullable().optional().describe("Line number, only for inline comments"),
  from_patchset_biz_id: z.string().nullable().optional().describe("Start version ID for comparison, required for INLINE_COMMENT type"),
  to_patchset_biz_id: z.string().nullable().optional().describe("Target version ID for comparison, required for INLINE_COMMENT type"),
  parent_comment_biz_id: z.string().nullable().optional().describe("Parent comment ID"),
});

export const ListChangeRequestCommentsSchema = z.object({
  organizationId: z.string().describe("Organization ID, can be found in the basic information page of the organization admin console"),
  repositoryId: z.string().describe("Repository ID or a combination of organization ID and repository name, for example: 2835387 or organizationId%2Frepo-name (Note: slashes need to be URL encoded as %2F)"),
  localId: z.string().describe("Change request local ID"),
  patchSetBizIds: z.array(z.string()).nullable().optional().describe("Associated version ID list, each comment is associated with a version, indicating which version the comment was posted on, for global comments, it's associated with the latest merge source version"),
  commentType: z.string().optional().default("GLOBAL_COMMENT").describe("Comment type. Possible values: GLOBAL_COMMENT, INLINE_COMMENT"),
  state: z.string().optional().default("OPENED").describe("Comment state. Possible values: OPENED, DRAFT"),
  resolved: z.boolean().optional().default(false).describe("Whether marked as resolved"),
  filePath: z.string().nullable().optional().describe("Filter by file path (for inline comments)"),
});

// Codeup commit related Schema definitions
export const ListCommitsRequestSchema = z.object({
  organizationId: z.string().describe("组织ID"),
  repositoryId: z.string().describe("代码库ID或者URL-Encoder编码的全路径"),
  refName: z.string().describe("分支名称、标签名称或提交版本，默认为代码库默认分支"),
  since: z.string().optional().describe("提交起始时间，格式：YYYY-MM-DDTHH:MM:SSZ"),
  until: z.string().optional().describe("提交截止时间，格式：YYYY-MM-DDTHH:MM:SSZ"),
  page: z.number().int().optional().describe("页码"),
  perPage: z.number().int().optional().describe("每页大小"),
  path: z.string().optional().describe("文件路径"),
  search: z.string().optional().describe("搜索关键字"),
  showSignature: z.boolean().optional().describe("是否展示签名"),
  committerIds: z.string().optional().describe("提交人ID列表（多个ID以逗号隔开）"),
});

export const GetCommitRequestSchema = z.object({
  organizationId: z.string().describe("组织ID"),
  repositoryId: z.string().describe("代码库ID或者URL-Encoder编码的全路径"),
  sha: z.string().describe("提交ID，即Commit SHA值"),
});

export const CreateCommitCommentRequestSchema = z.object({
  organizationId: z.string().describe("组织ID"),
  repositoryId: z.string().describe("代码库ID或者URL-Encoder编码的全路径"),
  sha: z.string().describe("提交的SHA值"),
  content: z.string().describe("commit的评论内容"),
});

export const DevopsCommitVOSchema = z.object({
  id: z.string().nullable().optional().describe("提交ID"),
  shortId: z.string().nullable().optional().describe("代码组路径"),
  title: z.string().nullable().optional().describe("标题，提交的第一行内容"),
  message: z.string().nullable().optional().describe("提交内容"),
  authorName: z.string().nullable().optional().describe("作者姓名"),
  authorEmail: z.string().nullable().optional().describe("作者邮箱"),
  authoredDate: z.string().nullable().optional().describe("作者提交时间"),
  committerName: z.string().nullable().optional().describe("提交者姓名"),
  committerEmail: z.string().nullable().optional().describe("提交者邮箱"),
  committedDate: z.string().nullable().optional().describe("提交者提交时间"),
  webUrl: z.string().nullable().optional().describe("页面访问地址"),
  parentIds: z.array(z.string()).nullable().optional().describe("父提交ID"),
});

export const DevopsCommitStatVOSchema = z.object({
  additions: z.number().int().nullable().optional().describe("增加行数"),
  deletions: z.number().int().nullable().optional().describe("删除行数"),
  total: z.number().int().nullable().optional().describe("总变动行数"),
});

export const CreateCommitCommentVOSchema = z.object({
  content: z.string().describe("commit的评论内容"),
});