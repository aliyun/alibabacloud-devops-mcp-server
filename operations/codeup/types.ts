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
  organizationId: z.string().describe("组织ID，可在组织管理后台的基本信息页面获取。示例：'60d54f3daccf2bbd6659f3ad'"),
  repositoryId: z.string().describe("代码库ID或者URL-Encoder编码的全路径。示例：'2835387' 或 '60de7a6852743a5162b5f957%2FDemoRepo'（注意：斜杠需要URL编码为%2F）"),
  localId: z.string().describe("局部ID，表示代码库中第几个合并请求。示例：'1' 或 '42'"),
});

export const ListChangeRequestsSchema = z.object({
  organizationId: z.string().describe("组织ID，可在组织管理后台的基本信息页面获取。示例：'60d54f3daccf2bbd6659f3ad'"),
  page: z.number().int().default(1).optional().describe("页码，从1开始。示例：1"),
  perPage: z.number().int().default(20).optional().describe("每页大小，默认20。示例：20"),
  projectIds: z.string().nullable().optional().describe("代码库ID或者路径列表，多个以逗号分隔。示例：'2813489,2813490' 或 '2813489,60de7a6852743a5162b5f957%2FDemoRepo'（注意：斜杠需要URL编码为%2F）"),
  authorIds: z.string().nullable().optional().describe("创建者用户ID列表，多个以逗号分隔。示例：'62c795xxxb468af8' 或 '62c795xxxb468af8,62c795xxxb468af9'"),
  reviewerIds: z.string().nullable().optional().describe("评审人用户ID列表，多个以逗号分隔。示例：'62c795xxxb468af8' 或 '62c795xxxb468af8,62c795xxxb468af9'"),
  state: z.enum(["opened", "merged", "closed"]).nullable().optional().describe("合并请求筛选状态。opened - 已开启；merged - 已合并；closed - 已关闭。默认为null，即查询全部状态。示例：'opened'"),
  search: z.string().nullable().optional().describe("标题关键字搜索，用于在合并请求标题中搜索。示例：'mr title' 或 'bug fix'"),
  orderBy: z.enum(["created_at", "updated_at"]).default("updated_at").optional().describe("排序字段。created_at - 按创建时间排序；updated_at - 按更新时间排序（默认）。示例：'updated_at'"),
  sort: z.enum(["asc", "desc"]).default("desc").optional().describe("排序方式。asc - 升序；desc - 降序（默认）。示例：'desc'"),
  createdBefore: z.string().nullable().optional().describe("起始创建时间，时间格式为ISO 8601。查询创建时间不早于此时间的合并请求。示例：'2024-04-05T15:30:45Z'"),
  createdAfter: z.string().nullable().optional().describe("截止创建时间，时间格式为ISO 8601。查询创建时间不晚于此时间的合并请求。示例：'2024-04-05T15:30:45Z'"),
});

export const CreateChangeRequestSchema = z.object({
  organizationId: z.string().describe("组织ID，可在组织管理后台的基本信息页面获取。示例：'60d54f3daccf2bbd6659f3ad'"),
  repositoryId: z.string().describe("代码库ID或者URL-Encoder编码的全路径。示例：'2835387' 或 '60de7a6852743a5162b5f957%2FDemoRepo'（注意：斜杠需要URL编码为%2F）"),
  title: z.string().max(256).describe("标题，不超过256个字符。示例：'mr title' 或 '修复登录bug'"),
  description: z.string().max(10000).nullable().optional().describe("描述，不超过10000个字符。示例：'mr description' 或 '修复了用户登录时的验证逻辑问题'"),
  sourceBranch: z.string().describe("源分支名称，即要合并的分支。示例：'demo-branch' 或 'feature/user-login'"),
  sourceProjectId: z.number().int().optional().describe("源库ID，如果未提供，将尝试自动获取。示例：2813489"),
  targetBranch: z.string().describe("目标分支名称，即合并到的分支。示例：'master' 或 'main'"),
  targetProjectId: z.number().int().optional().describe("目标库ID，如果未提供，将尝试自动获取。示例：2813489"),
  reviewerUserIds: z.array(z.string()).nullable().optional().describe("评审人用户ID列表。示例：['62c795xxxb468af8'] 或 ['62c795xxxb468af8', '62c795xxxb468af9']"),
  workItemIds: z.array(z.string()).nullable().optional().describe("关联工作项ID列表。示例：['workitem-123', 'workitem-456']"),
  createFrom: z.enum(["WEB", "COMMAND_LINE"]).optional().default("WEB").describe("创建来源。WEB - 页面创建；COMMAND_LINE - 命令行创建。默认为WEB"),
  triggerAIReviewRun: z.boolean().optional().default(false).describe("是否触发AI评审。true - 触发AI评审；false - 不触发（默认）"),
});

export const ListChangeRequestPatchSetsSchema = z.object({
  organizationId: z.string().describe("组织ID，可在组织管理后台的基本信息页面获取。示例：'60d54f3daccf2bbd6659f3ad'"),
  repositoryId: z.string().describe("代码库ID或者URL-Encoder编码的全路径。示例：'2835387' 或 '60de7a6852743a5162b5f957%2FDemoRepo'（注意：斜杠需要URL编码为%2F）"),
  localId: z.string().describe("局部ID，表示代码库中第几个合并请求。示例：'1' 或 '42'"),
});

// Codeup change request comments related Schema definitions
export const CreateChangeRequestCommentSchema = z.object({
  organizationId: z.string().describe("组织ID，可在组织管理后台的基本信息页面获取。示例：'60d54f3daccf2bbd6659f3ad'"),
  repositoryId: z.string().describe("代码库ID或者URL-Encoder编码的全路径。示例：'2835387' 或 '60de7a6852743a5162b5f957%2FDemoRepo'（注意：斜杠需要URL编码为%2F）"),
  localId: z.string().describe("局部ID，表示代码库中第几个合并请求。示例：'1' 或 '42'"),
  comment_type: z.enum(["GLOBAL_COMMENT", "INLINE_COMMENT"]).default("GLOBAL_COMMENT").describe("评论类型。GLOBAL_COMMENT - 全局评论（对整个合并请求的评论）；INLINE_COMMENT - 行内评论（针对特定代码行的评论）。创建行内评论时，必须提供 file_path、line_number、from_patchset_biz_id 和 to_patchset_biz_id 参数"),
  content: z.string().min(1).max(65535).describe("评论内容，长度必须在 1 到 65535 之间。示例：'This is a comment content.' 或 '这里需要优化性能，建议使用缓存机制'"),
  draft: z.boolean().default(false).describe("是否草稿评论。true - 草稿评论（不会立即显示给其他人）；false - 正式评论（默认值）"),
  resolved: z.boolean().default(false).describe("是否标记已解决。true - 已解决；false - 未解决（默认值）"),
  patchset_biz_id: z.string().describe("关联版本ID，具有唯一性。对于全局评论，使用最新合并源版本ID；对于行内评论，选择 from_patchset_biz_id 或 to_patchset_biz_id 中的一个。示例：'bf117304dfe44d5d9b1132f348edf92e'"),
  file_path: z.string().optional().describe("文件路径，仅行内评论需要。表示评论针对的文件路径。示例：'/src/main/java/com/example/MyClass.java' 或 'src/utils/helper.ts' 或 'frontend/components/Button.tsx'"),
  line_number: z.number().int().positive().optional().describe("行号，仅行内评论需要。表示评论针对的代码行号，从1开始计数。示例：42 表示第42行，100 表示第100行"),
  from_patchset_biz_id: z.string().optional().describe("比较的起始版本ID，行内评论类型必传。表示代码比较的起始版本（通常是目标分支版本，即合并目标对应的版本）。示例：'bf117304dfe44d5d9b1132f348edf92e'"),
  to_patchset_biz_id: z.string().optional().describe("比较的目标版本ID，行内评论类型必传。表示代码比较的目标版本（通常是源分支版本，即合并源对应的版本）。示例：'537367017a9841738ac4269fbf6aacbe'"),
  parent_comment_biz_id: z.string().optional().describe("父评论ID，用于回复评论。如果这是对某个评论的回复，需要传入被回复评论的 bizId。示例：'1d8171cf0cc2453197fae0e0a27d5ece'"),
});

export const ListChangeRequestCommentsSchema = z.object({
  organizationId: z.string().describe("组织ID，可在组织管理后台的基本信息页面获取。示例：'60d54f3daccf2bbd6659f3ad'"),
  repositoryId: z.string().describe("代码库ID或者URL-Encoder编码的全路径。示例：'2835387' 或 '60de7a6852743a5162b5f957%2FDemoRepo'（注意：斜杠需要URL编码为%2F）"),
  localId: z.string().describe("合并请求局部ID，表示代码库中第几个合并请求。示例：'1' 或 '42'"),
  patchSetBizIds: z.array(z.string()).optional().describe("关联版本ID列表，每个评论都关联一个版本，表示该评论是在哪个版本上发布的。对于全局评论，关联的是最新合并源版本。示例：['bf117304dfe44d5d9b1132f348edf92e', '537367017a9841738ac4269fbf6aacbe']"),
  commentType: z.enum(["GLOBAL_COMMENT", "INLINE_COMMENT"]).optional().default("GLOBAL_COMMENT").describe("评论类型。GLOBAL_COMMENT - 全局评论；INLINE_COMMENT - 行内评论"),
  state: z.enum(["OPENED", "DRAFT"]).optional().default("OPENED").describe("评论状态。OPENED - 已发布的评论；DRAFT - 草稿评论"),
  resolved: z.boolean().optional().default(false).describe("是否已解决。true - 只查询已解决的评论；false - 只查询未解决的评论（默认值）"),
  filePath: z.string().optional().describe("文件路径过滤，仅用于行内评论。可以过滤特定文件的评论。示例：'/src/main/java/com/example/MyClass.java' 或 'src/utils/helper.ts'"),
});

export const UpdateChangeRequestCommentSchema = z.object({
  organizationId: z.string().describe("组织ID，可在组织管理后台的基本信息页面获取。示例：'60d54f3daccf2bbd6659f3ad'"),
  repositoryId: z.string().describe("代码库ID或者URL-Encoder编码的全路径。示例：'2835387' 或 '60de7a6852743a5162b5f957%2FDemoRepo'（注意：斜杠需要URL编码为%2F）"),
  localId: z.string().describe("合并请求局部ID，表示代码库中第几个合并请求。示例：'1' 或 '42'"),
  commentBizId: z.string().describe("评论 bizId，具有唯一性，用于标识要更新的评论。示例：'bf117304dfe44d5d9b1132f348edf92e'"),
  content: z.string().min(1).optional().describe("评论内容，更新后的评论内容（可选）。如果提供，将更新评论的文本内容。示例：'your new comment' 或 '更新后的评论内容：这里需要优化性能，建议使用缓存机制'"),
  resolved: z.boolean().optional().describe("是否已解决（可选）。true - 标记为已解决；false - 标记为未解决。示例：false。如果不提供此参数，将保持原有的解决状态不变"),
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