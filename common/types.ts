import { z } from "zod";

// Organization related types
export const CurrentOrganizationInfoSchema = z.object({
  lastOrganization: z.string().optional().describe("Last logged-in organization"),
});

export const OrganizationInfoSchema = z.object({
  id: z.string().optional().describe("Organization ID"),
  name: z.string().optional().describe("Organization name"),
  description: z.string().optional().describe("Organization description"),
});

export const UserOrganizationsInfoSchema = z.array(OrganizationInfoSchema);

// User related types
export const UserInfoSchema = z.object({
  id: z.string().nullable().optional().describe("User ID"),
  name: z.string().nullable().optional().describe("User name"),
});

// Custom field related types
export const FieldItemSchema = z.object({
  displayValue: z.string().nullable().optional().describe("Display value"),
  identifier: z.string().nullable().optional().describe("Identifier"),
});

export const CustomFieldValuesSchema = z.object({
  fieldId: z.string().nullable().optional().describe("Custom field ID"),
  fieldName: z.string().nullable().optional().describe("Custom field name"),
  values: z.array(FieldItemSchema).nullable().optional().describe("Values"),
});

export const ValueSchema = z.object({
  displayValue: z.string().nullable().optional().describe("Display value"),
  identifier: z.string().nullable().optional().describe("Identifier"),
});

export const CustomFieldValueSchema = z.object({
  fieldFormat: z.string().nullable().optional().describe("Field format"),
  fieldId: z.string().nullable().optional().describe("Field ID"),
  fieldName: z.string().nullable().optional().describe("Field name"),
  values: z.array(ValueSchema).nullable().optional().describe("Values"),
});

// Project related types
export const ProjectStatusInfoSchema = z.object({
  id: z.string().nullable().optional().describe("Status ID"),
  name: z.string().nullable().optional().describe("Status name"),
});

export const ProjectInfoSchema = z.object({
  id: z.string().nullable().optional().describe("Project ID, unique identifier for the project"),
  name: z.string().nullable().optional().describe("Project name"),
  description: z.string().nullable().optional().describe("Project description"),
  icon: z.string().nullable().optional().describe("Icon URL"),
  customCode: z.string().nullable().optional().describe("Code number"),
  gmtCreate: z.number().int().nullable().optional().describe("Creation timestamp"),
  gmtModified: z.number().int().nullable().optional().describe("Last update timestamp"),
  logicalStatus: z.string().nullable().optional().describe("Logical status, e.g., normal"),
  scope: z.string().nullable().optional().describe("Public type, enum values: public, private"),
  creator: UserInfoSchema.nullable().optional().describe("Creator"),
  modifier: UserInfoSchema.nullable().optional().describe("Modifier"),
  status: ProjectStatusInfoSchema.nullable().optional().describe("Status"),
  customFieldValues: z.array(CustomFieldValuesSchema).nullable().optional().describe("Custom field values"),
  logoUrl: z.string().nullable().optional().describe("Project logo URL"),
  isArchived: z.boolean().nullable().optional().describe("Whether archived"),
  isPublic: z.boolean().nullable().optional().describe("Whether public"),
  accessLevel: z.string().nullable().optional().describe("Access level"),
  organizationIdentifier: z.string().nullable().optional().describe("Organization identifier"),
  includeSubOrgs: z.boolean().nullable().optional().describe("Whether to include sub-organizations"),
  isTemplate: z.boolean().nullable().optional().describe("Whether it's a template"),
  parentIdentifier: z.string().nullable().optional().describe("Parent identifier"),
  associatedCodes: z.array(z.string()).nullable().optional().describe("Associated code repositories"),
  associatedCodeSources: z.array(z.string()).nullable().optional().describe("Associated code sources"),
  customField: z.record(z.string(), z.any()).nullable().optional().describe("Custom fields"),
  statusInfo: z.object({
    identifier: z.string().nullable().optional().describe("Status identifier"),
    name: z.string().nullable().optional().describe("Status name"),
    color: z.string().nullable().optional().describe("Status color"),
    type: z.string().nullable().optional().describe("Status type"),
    desc: z.string().nullable().optional().describe("Status description"),
  }).nullable().optional().describe("Status information"),
});

// Sprint related types
export const SprintInfoSchema = z.object({
  identifier: z.string().optional().describe("Sprint identifier"),
  name: z.string().optional().describe("Sprint name"),
  goal: z.string().optional().describe("Sprint goal"),
  startDate: z.string().optional().describe("Start date"),
  endDate: z.string().optional().describe("End date"),
  status: z.string().optional().describe("Status"),
  spaceIdentifier: z.string().optional().describe("Project identifier"),
  organizationIdentifier: z.string().optional().describe("Organization identifier"),
  gmtCreate: z.string().optional().describe("Creation time"),
  gmtModified: z.string().optional().describe("Last modified time"),
  capacityHours: z.number().optional().describe("Capacity hours"),
  creator: UserInfoSchema.nullable().optional().describe("Creator"),
  description: z.string().optional().describe("Description"),
  locked: z.boolean().optional().describe("Whether locked"),
  modifier: UserInfoSchema.nullable().optional().describe("Modifier"),
  owners: z.array(UserInfoSchema).nullable().optional().describe("Owners"),
});

export const SprintSchema = z.object({
  id: z.string().optional().describe("Sprint ID"),
  name: z.string().optional().describe("Sprint name"),
});

// Work item related types
export const WorkItemTypeSchema = z.object({
  id: z.string().nullable().optional().describe("Work item type ID"),
  name: z.string().nullable().optional().describe("Work item type name"),
});

export const StatusSchema = z.object({
  displayName: z.string().nullable().optional().describe("Display name"),
  id: z.string().nullable().optional().describe("Status ID"),
  name: z.string().nullable().optional().describe("Status name"),
  nameEn: z.string().nullable().optional().describe("English name"),
});

export const SpaceSchema = z.object({
  id: z.string().optional().describe("Space ID"),
  name: z.string().optional().describe("Space name"),
});

export const LabelSchema = z.object({
  id: z.string().nullable().optional().describe("Label ID"),
  name: z.string().nullable().optional().describe("Label name"),
  color: z.string().nullable().optional().describe("Label color"),
});

export const VersionSchema = z.object({
  id: z.string().nullable().optional().describe("Version ID"),
  name: z.string().nullable().optional().describe("Version name"),
});

export const WorkItemSchema = z.object({
  id: z.string().nullable().optional().describe("Work item ID"),
  subject: z.string().nullable().optional().describe("Title"),
  description: z.string().nullable().optional().describe("Description"),
  gmtCreate: z.number().int().nullable().optional().describe("Creation time"),
  gmtModified: z.number().int().nullable().optional().describe("Last modification time"),
  workitemType: WorkItemTypeSchema.nullable().optional().describe("Work item type"),
  status: StatusSchema.nullable().optional().describe("Status"),
  formatType: z.string().nullable().optional().describe("Format type"),
  categoryId: z.string().nullable().optional().describe("Category ID"),
  logicalStatus: z.string().nullable().optional().describe("Logical status"),
  parentId: z.string().nullable().optional().describe("Parent ID"),
  serialNumber: z.string().nullable().optional().describe("Serial number"),
  statusStageId: z.string().nullable().optional().describe("Status stage ID"),
  updateStatusAt: z.number().int().nullable().optional().describe("Status update time"),
  idPath: z.string().nullable().optional().describe("ID path"),
  
  assignedTo: UserInfoSchema.nullable().optional().describe("Assignee"),
  creator: UserInfoSchema.nullable().optional().describe("Creator"),
  modifier: UserInfoSchema.nullable().optional().describe("Modifier"),
  verifier: UserInfoSchema.nullable().optional().describe("Verifier"),
  space: SpaceSchema.nullable().optional().describe("Space"),
  sprint: SprintSchema.nullable().optional().describe("Sprint"),
  
  labels: z.array(LabelSchema).nullable().optional().describe("Labels"),
  participants: z.array(UserInfoSchema).nullable().optional().describe("Participants"),
  trackers: z.array(UserInfoSchema).nullable().optional().describe("Trackers"),
  versions: z.array(VersionSchema).nullable().optional().describe("Versions"),
  customFieldValues: z.array(CustomFieldValueSchema).nullable().optional().describe("Custom field values"),
  
  identifier: z.string().nullable().optional().describe("Work item identifier"),
  priority: z.string().nullable().optional().describe("Priority"),
  spaceIdentifier: z.string().nullable().optional().describe("Project identifier"),
  organizationIdentifier: z.string().nullable().optional().describe("Organization identifier"),
  parentIdentifier: z.string().nullable().optional().describe("Parent work item identifier"),
  customFields: z.record(z.string(), z.any()).nullable().optional().describe("Custom fields"),
  type: z.string().nullable().optional().describe("Type"),
});

// Search condition related types
export const FilterConditionSchema = z.object({
  className: z.string().optional().describe("Class name"),
  fieldIdentifier: z.string().optional().describe("Field identifier"),
  format: z.string().optional().describe("Format"),
  operator: z.string().optional().describe("Operator"),
  toValue: z.string().nullable().optional().describe("To value"),
  value: z.array(z.string()).nullable().optional().describe("Values"),
});

export const ConditionsSchema = z.object({
  conditionGroups: z.array(z.array(z.any())).nullable().optional().describe("Condition groups"),
});

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

export const RepositorySchema = z.object({
  id: z.number().int().optional().describe("Repository ID"),
  name: z.string().optional().describe("Repository name"),
  webUrl: z.string().optional().describe("Web URL for accessing the repository"),
  description: z.string().optional().describe("Repository description"),
  path: z.string().optional().describe("Repository path"),
});

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
  comment_time: z.string().nullable().optional().describe("评论时间"),
  comment_type: z.string().nullable().optional().describe("评论类型：GLOBAL_COMMENT - 全局评论；INLINE_COMMENT - 行内评论"),
  content: z.string().nullable().optional().describe("评论内容"),
  expression_reply_list: z.array(z.any()).nullable().optional().describe("表情回复列表"),
  filePath: z.string().nullable().optional().describe("文件路径，仅行内评论有"),
  from_patchset_biz_id: z.string().nullable().optional().describe("比较的起始版本ID"),
  is_deleted: z.boolean().nullable().optional().describe("是否已删除"),
  last_edit_time: z.string().nullable().optional().describe("最后编辑时间"),
  last_edit_user: z.object({
    avatar: z.string().nullable().optional().describe("用户头像地址"),
    email: z.string().nullable().optional().describe("用户邮箱"),
    name: z.string().nullable().optional().describe("用户名称"),
    state: z.string().nullable().optional().describe("用户状态"),
    userId: z.string().nullable().optional().describe("云效用户ID"),
    username: z.string().nullable().optional().describe("用户登录名")
  }).nullable().optional().describe("最后编辑用户"),
  last_resolved_status_change_time: z.string().nullable().optional().describe("最后解决状态变更时间"),
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
    createTime: z.string().nullable().optional().describe("版本创建时间"),
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
  createTime: z.string().nullable().optional().describe("创建时间"),
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
    reviewTime: z.string().nullable().optional().describe("审阅时间"),
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
  updateTime: z.string().nullable().optional().describe("更新时间"),
  webUrl: z.string().nullable().optional().describe("页面地址")
});

export const CompareSchema = z.object({
  base_commit_sha: z.string().optional(),
  commits: z.array(z.unknown()).optional(),
  commits_count: z.number().optional(),
  diffs: z.array(z.unknown()).optional(),
  files_count: z.number().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
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

export type Sprint = z.infer<typeof SprintSchema>;
export type Status = z.infer<typeof StatusSchema>;
export type Space = z.infer<typeof SpaceSchema>;

// 添加流水线相关的Schema

// 流水线配置源Schema
export const PipelineConfigSourceSchema = z.object({
  data: z.object({
    branch: z.string().nullable().optional().describe("Default branch"),
    cloneDepth: z.number().int().nullable().optional().describe("Clone depth"),
    credentialId: z.number().int().nullable().optional().describe("Credential ID"),
    credentialLabel: z.string().nullable().optional().describe("Credential label"),
    credentialType: z.string().nullable().optional().describe("Credential type"),
    events: z.array(z.string()).nullable().optional().describe("Trigger events"),
    isBranchMode: z.boolean().nullable().optional().describe("Whether branch mode is enabled"),
    isCloneDepth: z.boolean().nullable().optional().describe("Whether clone depth is enabled"),
    isSubmodule: z.boolean().nullable().optional().describe("Whether submodule is enabled"),
    isTrigger: z.boolean().nullable().optional().describe("Whether commit trigger is enabled"),
    label: z.string().nullable().optional().describe("Display name"),
    namespace: z.string().nullable().optional().describe("Namespace"),
    repo: z.string().nullable().optional().describe("Repository URL"),
    serviceConnectionId: z.number().int().nullable().optional().describe("Service connection ID"),
    triggerFilter: z.string().nullable().optional().describe("Trigger filter condition"),
    webhook: z.string().nullable().optional().describe("Webhook URL"),
  }),
  sign: z.string().nullable().optional().describe("Code source identifier"),
  type: z.string().nullable().optional().describe("Code source type"),
});

export const PipelineTagSchema = z.object({
  id: z.number().int().nullable().optional().describe("Tag ID"),
  name: z.string().nullable().optional().describe("Tag name"),
});

export const PipelineConfigSchema = z.object({
  flow: z.string().nullable().optional().describe("Flow configuration"),
  settings: z.string().nullable().optional().describe("Pipeline settings"),
  sources: z.array(PipelineConfigSourceSchema).nullable().optional().describe("Code source configurations"),
});

// 流水线详情Schema
export const PipelineDetailSchema = z.object({
  createTime: z.number().int().nullable().optional().describe("Creation time"),
  creatorAccountId: z.string().nullable().optional().describe("Creator account ID"),
  envId: z.number().int().nullable().optional().describe("Environment ID: 0-Daily 1-Pre-release 2-Production"),
  envName: z.string().nullable().optional().describe("Environment name"),
  groupId: z.number().int().nullable().optional().describe("Pipeline group ID"),
  modifierAccountId: z.string().nullable().optional().describe("Last modifier account ID"),
  name: z.string().nullable().optional().describe("Pipeline name"),
  pipelineConfig: PipelineConfigSchema.nullable().optional().describe("Pipeline configuration"),
  tagList: z.array(PipelineTagSchema).nullable().optional().describe("Tag list"),
  updateTime: z.number().int().nullable().optional().describe("Update time"),
});

// 获取流水线详情的参数Schema
export const GetPipelineSchema = z.object({
  organizationId: z.string().describe("Organization ID, can be found in the basic information page of the organization admin console"),
  pipelineId: z.string().describe("Pipeline ID"),
});

// 获取流水线列表的参数Schema
export const ListPipelinesSchema = z.object({
  organizationId: z.string().describe("Organization ID, can be found in the basic information page of the organization admin console"),
  createStartTime: z.number().int().optional().describe("Creation start time in milliseconds timestamp format (e.g., 1729178040000). For filtering pipelines created after this time."),
  createEndTime: z.number().int().optional().describe("Creation end time in milliseconds timestamp format (e.g., 1729178040000). For filtering pipelines created before this time."),
  executeStartTime: z.number().int().optional().describe("Execution start time in milliseconds timestamp format (e.g., 1729178040000). For filtering pipelines executed after this time."),
  executeEndTime: z.number().int().optional().describe("Execution end time in milliseconds timestamp format (e.g., 1729178040000). For filtering pipelines executed before this time."),
  pipelineName: z.string().optional().describe("Pipeline name for filtering"),
  statusList: z.string().optional().describe("Pipeline status list, comma separated (SUCCESS,RUNNING,FAIL,CANCELED,WAITING)"),
  perPage: z.number().int().min(1).max(30).default(10).optional().describe("Number of items per page, default 10, max 30"),
  page: z.number().int().min(1).default(1).optional().describe("Page number, default 1"),
});

// 流水线列表项Schema
export const PipelineListItemSchema = z.object({
  name: z.string().nullable().optional().describe("Pipeline name"),
  id: z.number().int().nullable().optional().describe("Pipeline ID"),
  creatorAccountId: z.string().nullable().optional().describe("Creator account ID"),
  createTime: z.number().int().nullable().optional().describe("Creation time"),
});

// 创建流水线运行的参数Schema
export const CreatePipelineRunSchema = z.object({
  organizationId: z.string().describe("Organization ID, can be found in the basic information page of the organization admin console"),
  pipelineId: z.string().describe("Pipeline ID to run"),
  params: z.string().optional().describe("Pipeline run parameters in JSON string format. Can include: branchModeBranchs(array), envs(object), runningBranchs(object), runningTags(object), runningPipelineArtifacts(object), runningAcrArtifacts(object), runningPackagesArtifacts(object), comment(string), needCreateBranch(boolean), releaseBranch(string)"),
  
  // 添加自然语言相关参数，这些参数将被转换为params参数的内容
  description: z.string().optional().describe("Natural language description of how to run the pipeline, e.g. 'Run pipeline using branch mode with branches main and develop'"),
  branches: z.array(z.string()).optional().describe("Branches to use in branch mode or specific branches for repositories"),
  branchMode: z.boolean().optional().describe("Whether to run in branch mode"),
  releaseBranch: z.string().optional().describe("Specific release branch to use"),
  createReleaseBranch: z.boolean().optional().describe("Whether to create a release branch"),
  environmentVariables: z.record(z.string()).optional().describe("Environment variables for the pipeline run"),
  repositories: z.array(z.object({
    url: z.string().describe("Repository URL"),
    branch: z.string().optional().describe("Branch to use for this repository"),
    tag: z.string().optional().describe("Tag to use for this repository")
  })).optional().describe("Specific repository configurations")
});

// 流水线运行相关Schema
export const PipelineRunActionSchema = z.object({
  data: z.string().nullable().optional().describe("Action data"),
  disable: z.boolean().nullable().optional().describe("Whether the action is disabled"),
  displayType: z.string().nullable().optional().describe("Display type of the action"),
  name: z.string().nullable().optional().describe("Action name"),
  order: z.number().int().nullable().optional().describe("Order of the action"),
  params: z.record(z.any()).nullable().optional().describe("Action parameters"),
  title: z.string().nullable().optional().describe("Action title"),
  type: z.string().nullable().optional().describe("Action type")
});

export const PipelineRunJobSchema = z.object({
  id: z.number().int().nullable().optional().describe("Job ID"),
  name: z.string().nullable().optional().describe("Job name"),
  startTime: z.number().int().nullable().optional().describe("Start time of the job"),
  endTime: z.number().int().nullable().optional().describe("End time of the job"),
  status: z.string().nullable().optional().describe("Job status: FAIL, SUCCESS, RUNNING"),
  params: z.string().nullable().optional().describe("Job parameters in JSON string format"),
  jobSign: z.string().nullable().optional().describe("Job unique identifier"),
  result: z.string().nullable().optional().describe("Job result data in JSON string format"),
  actions: z.array(PipelineRunActionSchema).nullable().optional().describe("Available actions for the job"),
});

export const PipelineStageInfoSchema = z.object({
  startTime: z.number().int().nullable().optional().describe("Start time of the stage"),
  endTime: z.number().int().nullable().optional().describe("End time of the stage"),
  name: z.string().nullable().optional().describe("Stage name"),
  status: z.string().nullable().optional().describe("Stage status: FAIL, SUCCESS, RUNNING"),
  id: z.number().int().nullable().optional().describe("Stage ID"),
  jobs: z.array(PipelineRunJobSchema).nullable().optional().describe("Jobs in this stage"),
});

export const PipelineStageSchema = z.object({
  index: z.string().nullable().optional().describe("Stage index"),
  name: z.string().nullable().optional().describe("Stage name"),
  stageInfo: PipelineStageInfoSchema.nullable().optional().describe("Stage detailed information")
});

export const PipelineRunSourceSchema = z.object({
  data: z.record(z.any()).optional().describe("Source configuration data"),
  name: z.string().nullable().optional().describe("Source name"),
  sign: z.string().nullable().optional().describe("Source identifier"),
  type: z.string().nullable().optional().describe("Source type"),
  label: z.string().nullable().optional().describe("Source label"),
});

export const PipelineRunGlobalParamSchema = z.object({
  key: z.string().nullable().optional().describe("Parameter key"),
  value: z.string().nullable().optional().describe("Parameter value"),
  masked: z.boolean().nullable().optional().describe("Whether the parameter is masked"),
  runningConfig: z.boolean().nullable().optional().describe("Whether the parameter is running configuration"),
  encrypted: z.boolean().nullable().optional().describe("Whether the parameter is encrypted"),
  metaData: z.string().nullable().optional().describe("Parameter metadata"),
  type: z.string().nullable().optional().describe("Parameter type"),
  description: z.string().nullable().optional().describe("Parameter description"),
  optionType: z.string().nullable().optional().describe("Parameter option type"),
});

export const PipelineRunGroupSchema = z.object({
  id: z.number().int().nullable().optional().describe("Group ID"),
  name: z.string().nullable().optional().describe("Group name")
});

export const PipelineRunSchema = z.object({
  updateTime: z.number().int().nullable().optional().describe("Last update time"),
  pipelineConfigId: z.number().int().nullable().optional().describe("Pipeline configuration ID"),
  createTime: z.number().int().nullable().optional().describe("Creation time of the run"),
  pipelineId: z.number().int().nullable().optional().describe("Pipeline ID"),
  pipelineRunId: z.number().int().nullable().optional().describe("Pipeline run ID"),
  status: z.string().optional().nullable().describe("Pipeline run status: FAIL, SUCCESS, RUNNING"),
  triggerMode: z.number().int().nullable().optional().describe("Trigger mode: 1-Manual, 2-Scheduled, 3-Code commit, 5-Pipeline, 6-Webhook"),
  stageGroup: z.array(z.array(z.string())).nullable().optional().describe("Stage groups"),
  groups: z.array(PipelineRunGroupSchema).nullable().optional().describe("Pipeline groups"),
  pipelineType: z.string().nullable().optional().describe("Pipeline type"),
  creatorAccountId: z.string().nullable().optional().describe("Creator account ID"),
  modifierAccountId: z.string().optional().describe("Last modifier account ID"),
  stages: z.array(PipelineStageSchema).nullable().optional().describe("Pipeline stages"),
  sources: z.array(PipelineRunSourceSchema).nullable().optional().describe("Code sources used in this run"),
  creator: z.string().nullable().optional().describe("Creator"),
  modifier: z.string().nullable().optional().describe("Last modifier"),
  globalParams: z.array(PipelineRunGlobalParamSchema).nullable().optional().describe("Global parameters"),
});

// 获取最近一次流水线运行信息的参数Schema
export const GetLatestPipelineRunSchema = z.object({
  organizationId: z.string().describe("Organization ID, can be found in the basic information page of the organization admin console"),
  pipelineId: z.string().describe("Pipeline ID to get the latest run information"),
});

// 获取特定流水线运行实例的参数Schema
export const GetPipelineRunSchema = z.object({
  organizationId: z.string().describe("Organization ID, can be found in the basic information page of the organization admin console"),
  pipelineId: z.string().describe("Pipeline ID"),
  pipelineRunId: z.string().describe("Pipeline run ID to retrieve details for"),
});

// 流水线运行实例列表项Schema
export const PipelineRunListItemSchema = z.object({
  status: z.string().nullable().optional().describe("Pipeline run status: FAIL, SUCCESS, RUNNING"),
  startTime: z.number().int().nullable().optional().describe("Start time of the run"),
  triggerMode: z.number().int().nullable().optional().describe("Trigger mode: 1-Manual, 2-Scheduled, 3-Code commit, 5-Pipeline, 6-Webhook"),
  pipelineRunId: z.number().int().nullable().optional().describe("Pipeline run ID"),
  pipelineId: z.number().int().nullable().optional().describe("Pipeline ID"),
  endTime: z.number().int().nullable().optional().describe("End time of the run"),
  creator: z.string().nullable().optional().describe("Creator"),
  creatorAccountId: z.string().nullable().optional().describe("Creator account ID"),
});

// 获取流水线运行实例列表的参数Schema
export const ListPipelineRunsSchema = z.object({
  organizationId: z.string().describe("Organization ID, can be found in the basic information page of the organization admin console"),
  pipelineId: z.string().describe("Pipeline ID to list runs for"),
  perPage: z.number().int().min(1).max(30).default(10).optional().describe("Number of items per page, default 10, max 30"),
  page: z.number().int().min(1).default(1).optional().describe("Page number, default 1"),
  startTime: z.number().int().optional().describe("Execution start time filter in milliseconds timestamp format"),
  endTime: z.number().int().optional().describe("Execution end time filter in milliseconds timestamp format"),
  status: z.string().optional().describe("Run status filter: FAIL, SUCCESS, or RUNNING"),
  triggerMode: z.number().int().optional().describe("Trigger mode filter: 1-Manual, 2-Scheduled, 3-Code commit, 5-Pipeline, 6-Webhook")
});

// 添加流水线相关的类型导出
export type PipelineDetail = z.infer<typeof PipelineDetailSchema>;
export type PipelineListItem = z.infer<typeof PipelineListItemSchema>;
export type ListPipelinesOptions = z.infer<typeof ListPipelinesSchema>;
export type CreatePipelineRunOptions = z.infer<typeof CreatePipelineRunSchema>;
export type PipelineRun = z.infer<typeof PipelineRunSchema>;
export type PipelineRunListItem = z.infer<typeof PipelineRunListItemSchema>;
export type ListPipelineRunsOptions = z.infer<typeof ListPipelineRunsSchema>;

// 添加projex目录中项目的Schema定义
export const GetProjectSchema = z.object({
  organizationId: z.string().describe("Organization ID"),
  id: z.string().describe("Project unique identifier"),
});

export const SearchProjectsSchema = z.object({
  organizationId: z.string().describe("Organization ID"),

  // Simplified search parameters
  name: z.string().nullable().optional().describe("Text contained in project name"),
  status: z.string().nullish().optional().describe("Project status ID, multiple separated by commas"),
  createdAfter: z.string().nullable().optional().describe("Created not earlier than, format: YYYY-MM-DD"),
  createdBefore: z.string().nullable().optional().describe("Created not later than, format: YYYY-MM-DD"),
  creator: z.string().nullable().optional().describe("Creator"),
  admin: z.string().nullable().optional().describe("Administrator"),
  logicalStatus: z.string().nullable().optional().describe("Logical status, e.g., NORMAL"),

  // Advanced parameters
  advancedConditions: z.string().nullable().optional().describe("Advanced filter conditions, JSON format"),
  extraConditions: z.string().nullable().optional().describe("Additional filter conditions, e.g., projects I manage, projects I participate in, projects I favorited, etc."),
  orderBy: z.string().optional().default("gmtCreate").describe("Sort field, default is gmtCreate, supports: gmtCreate (creation time), name (name)"),
  page: z.number().int().default(1).optional().describe("Pagination parameter, page number"),
  perPage: z.number().int().default(20).optional().describe("Pagination parameter, page size, 0-200, default value is 20"),
  sort: z.string().optional().default("desc").describe("Sort order, default is desc, options: desc (descending), asc (ascending)"),
});

// 工作项相关的Schema定义
export const GetWorkItemSchema = z.object({
  organizationId: z.string().describe("Organization ID, can be found in the basic information page of the organization admin console"),
  workItemId: z.string().describe("Work item unique identifier, required parameter"),
});

export const SearchWorkitemsSchema = z.object({
  organizationId: z.string().describe("Organization ID"),
  category: z.string().describe("Search for work item types, such as Req (requirement), Task (task), Bug (defect), etc., multiple values separated by commas"),
  spaceId: z.string().describe("Project ID, project unique identifier"),

  // Simplified search parameters
  subject: z.string().nullable().optional().describe("Text contained in the title"),
  status: z.string().nullable().optional().describe("Status ID, multiple separated by commas. Status names and their IDs: Pending Confirmation (28), Pending Processing (100005), Reopened (30), Deferred Fix (34), Confirmed (32), Selected (625489), In Analysis (154395), Analysis Complete (165115), In Progress (100010), In Design (156603), Design Complete (307012), In Development (142838), Development Complete (100011), In Testing (100012)"),
  createdAfter: z.string().nullable().optional().describe("Created not earlier than, format: YYYY-MM-DD"),
  createdBefore: z.string().nullable().optional().describe("Created not later than, format: YYYY-MM-DD"),
  creator: z.string().nullable().optional().describe("Creator ID, multiple separated by commas"),
  assignedTo: z.string().nullable().optional().describe("Assignee ID, multiple separated by commas"),

  // Advanced parameters
  advancedConditions: z.string().nullable().optional().describe("Advanced filter conditions, JSON format"),
  orderBy: z.string().optional().default("gmtCreate").describe("Sort field, default is gmtCreate. Possible values: gmtCreate, subject, status, priority, assignedTo"),
});

// Codeup branches related Schema definitions
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

// Export types for Codeup operations
export type CreateBranchOptions = z.infer<typeof CreateBranchSchema>;
export type GetBranchOptions = z.infer<typeof GetBranchSchema>;
export type DeleteBranchOptions = z.infer<typeof DeleteBranchSchema>;
export type ListBranchesOptions = z.infer<typeof ListBranchesSchema>;

export type GetRepositoryOptions = z.infer<typeof GetRepositorySchema>;
export type ListRepositoriesOptions = z.infer<typeof ListRepositoriesSchema>;

export type GetFileBlobsOptions = z.infer<typeof GetFileBlobsSchema>;
export type CreateFileOptions = z.infer<typeof CreateFileSchema>;
export type UpdateFileOptions = z.infer<typeof UpdateFileSchema>;
export type DeleteFileOptions = z.infer<typeof DeleteFileSchema>;
export type ListFilesOptions = z.infer<typeof ListFilesSchema>;

export type GetCompareOptions = z.infer<typeof GetCompareSchema>;

export type GetChangeRequestOptions = z.infer<typeof GetChangeRequestSchema>;
export type ListChangeRequestsOptions = z.infer<typeof ListChangeRequestsSchema>;
export type CreateChangeRequestOptions = z.infer<typeof CreateChangeRequestSchema>;
export type ListChangeRequestPatchSetsOptions = z.infer<typeof ListChangeRequestPatchSetsSchema>;

export type CreateChangeRequestCommentOptions = z.infer<typeof CreateChangeRequestCommentSchema>;
export type ListChangeRequestCommentsOptions = z.infer<typeof ListChangeRequestCommentsSchema>;

// 制品仓库相关的Schema定义
export const PackageRepositorySchema = z.object({
  accessLevel: z.string().nullable().optional().describe("Access level: PRIVATE - Private repository (only accessible to repository members), INTERNAL - Organization-wide visibility (accessible to all organization members)"),
  latestUpdate: z.number().int().nullable().optional().describe("Latest update time"),
  repoCategory: z.string().nullable().optional().describe("Repository mode: Hybrid/Local/Proxy/ProxyCache/Group"),
  repoDesc: z.string().nullable().optional().describe("Repository description"),
  repoDescriptor: z.string().nullable().optional().describe("Repository descriptor file"),
  repoId: z.string().nullable().optional().describe("Repository ID"),
  repoName: z.string().nullable().optional().describe("Repository name"),
  repoType: z.string().nullable().optional().describe("Repository type: GENERIC/DOCKER/MAVEN/NPM/NUGET"),
  star: z.boolean().nullable().optional().describe("Whether the repository is favorited"),
});

export const ListPackageRepositoriesSchema = z.object({
  organizationId: z.string().describe("Organization ID"),
  repoTypes: z.string().optional().describe("Repository types, available values: GENERIC/DOCKER/MAVEN/NPM/NUGET, multiple types can be separated by commas"),
  repoCategories: z.string().optional().describe("Repository modes, available values: Hybrid/Local/Proxy/ProxyCache/Group, multiple modes can be separated by commas"),
  perPage: z.number().int().optional().default(8).describe("Number of items per page, default value is 8"),
  page: z.number().int().optional().default(1).describe("Current page number"),
});

// 制品相关的Schema定义
export const ArtifactVersionSchema = z.object({
  createTime: z.number().int().nullable().optional().describe("Creation time"),
  creator: z.string().nullable().optional().describe("Creator"),
  gmtDownload: z.number().int().nullable().optional().describe("Latest download time"),
  id: z.number().int().nullable().optional().describe("Artifact version ID"),
  modifier: z.string().nullable().optional().describe("Modifier"),
  updateTime: z.number().int().nullable().optional().describe("Modification time"),
  version: z.string().nullable().optional().describe("Version number"),
});

export const ArtifactSchema = z.object({
  downloadCount: z.number().int().nullable().optional().describe("Download count"),
  gmtDownload: z.number().int().nullable().optional().describe("Latest download time"),
  id: z.number().int().nullable().optional().describe("Artifact ID"),
  latestUpdate: z.number().int().nullable().optional().describe("Latest update time"),
  module: z.string().nullable().optional().describe("Module name"),
  organization: z.string().nullable().optional().describe("Organization information"),
  repositoryId: z.string().nullable().optional().describe("Repository ID"),
  versions: z.array(ArtifactVersionSchema).nullable().optional().describe("Version list"),
});

export const ListArtifactsSchema = z.object({
  organizationId: z.string().describe("Organization ID"),
  repoId: z.string().describe("Repository ID"),
  repoType: z.string().describe("Repository type, available values: GENERIC/DOCKER/MAVEN/NPM/NUGET"),
  page: z.number().int().optional().default(1).describe("Current page number"),
  perPage: z.number().int().optional().default(8).describe("Number of items per page, default is 10"),
  search: z.string().optional().describe("Search by package name"),
  orderBy: z.string().optional().default("latestUpdate").describe("Sort method: latestUpdate - by latest update time; gmtDownload - by latest download time"),
  sort: z.string().optional().default("desc").describe("Sort order: asc - ascending; desc - descending"),
});

export const GetArtifactSchema = z.object({
  organizationId: z.string().describe("Organization ID"),
  repoId: z.string().describe("Repository ID"),
  id: z.number().int().describe("Artifact ID, can be obtained from ListArtifacts API"),
  repoType: z.string().describe("Repository type, available values: GENERIC/DOCKER/MAVEN/NPM/NUGET/PYPI"),
});

// 添加制品仓库相关的类型导出
export type PackageRepository = z.infer<typeof PackageRepositorySchema>;
export type Artifact = z.infer<typeof ArtifactSchema>;

