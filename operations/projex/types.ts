import { z } from "zod";
import { UserInfoSchema } from "../organization/types.js";

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
  gmtCreate: z.number().int().nullable().optional().describe("Creation timestamp in milliseconds"),
  gmtModified: z.number().int().nullable().optional().describe("Last update timestamp in milliseconds"),
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
  startDate: z.number().nullable().optional().describe("Start date"),
  endDate: z.number().nullable().optional().describe("End date"),
  status: z.string().optional().describe("Status"),
  spaceIdentifier: z.string().optional().describe("Project identifier"),
  organizationIdentifier: z.string().optional().describe("Organization identifier"),
  gmtCreate: z.number().optional().describe("Creation time in milliseconds"),
  gmtModified: z.number().optional().describe("Last modified time in milliseconds"),
  capacityHours: z.number().nullable().optional().describe("Capacity hours"),
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

// List Sprints Schema
export const ListSprintsSchema = z.object({
  organizationId: z.string().describe("Organization ID"),
  id: z.string().describe("Project unique identifier"),
  status: z.array(z.string()).optional().describe("Filter by status: TODO, DOING, ARCHIVED"),
  page: z.number().int().min(1).optional().describe("Page number"),
  perPage: z.number().int().min(1).max(100).optional().describe("Page size"),
});

// Get Sprint Schema
export const GetSprintSchema = z.object({
  organizationId: z.string().describe("Organization ID"),
  projectId: z.string().describe("Project unique identifier"),
  id: z.string().describe("Sprint unique identifier"),
});

// Create Sprint Schema
export const CreateSprintSchema = z.object({
  organizationId: z.string().describe("Organization ID"),
  projectId: z.string().describe("Project unique identifier"),
  name: z.string().describe("Sprint name"),
  owners: z.array(z.string()).describe("Sprint owner user IDs"),
  startDate: z.string().optional().describe("Date string in YYYY-MM-DD format"),
  endDate: z.string().optional().describe("Date string in YYYY-MM-DD format"),
  description: z.string().optional().describe("Sprint description"),
  capacityHours: z.number().int().optional().describe("Sprint capacity hours"),
});

// Update Sprint Schema
export const UpdateSprintSchema = z.object({
  organizationId: z.string().describe("Organization ID"),
  projectId: z.string().describe("Project unique identifier"),
  id: z.string().describe("Sprint unique identifier"),
  name: z.string().describe("Sprint name"),
  owners: z.array(z.string()).optional().describe("Sprint owner user IDs"),
  startDate: z.string().optional().describe("Date string in YYYY-MM-DD format"),
  endDate: z.string().optional().describe("Date string in YYYY-MM-DD format"),
  description: z.string().optional().describe("Sprint description"),
  capacityHours: z.number().int().optional().describe("Sprint capacity hours"),
});

// Work item related types
export const WorkItemTypeSchema = z.object({
  addUser: z.object({
    id: z.string().nullable().optional().describe("user id"),
    name: z.string().nullable().optional().describe("名称")
  }).nullable().optional(),
  categoryId: z.string().nullable().optional().describe("Unique identifier of the category, e.g., Req, Task, Bug"),
  creator: z.object({
    id: z.string().nullable().optional().describe("User ID"),
    name: z.string().nullable().optional().describe("Name")
  }).nullable().optional(),
  defaultType: z.boolean().nullable().optional().describe("Is it the default type"),
  description: z.string().nullable().optional().describe("Type description"),
  enable: z.boolean().nullable().optional().describe("Is it enabled"),
  gmtAdd: z.string().nullable().optional().describe("Add time"),
  gmtCreate: z.string().nullable().optional().describe("Creation time"),
  id: z.string().describe("Unique identifier of the work item type"),
  name: z.string().nullable().optional().describe("Type name"),
  nameEn: z.string().nullable().optional().describe("English name of the type"),
  systemDefault: z.boolean().nullable().optional().describe("Is it a system default type")
});

export type WorkItemType = z.infer<typeof WorkItemTypeSchema>;

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
  id: z.string().describe("Work item ID"),
  subject: z.string().nullable().optional().describe("Title"),
  description: z.string().nullable().optional().describe("Description"),
  gmtCreate: z.number().int().nullable().optional().describe("Creation time in milliseconds"),
  gmtModified: z.number().int().nullable().optional().describe("Last modification time in milliseconds"),
  workitemType: WorkItemTypeSchema.nullable().optional().describe("Work item type"),
  status: StatusSchema.nullable().optional().describe("Status"),
  formatType: z.string().nullable().optional().describe("Description format. Supported values: RICHTEXT (rich text format), MARKDOWN (markdown format)"),
  categoryId: z.string().nullable().optional().describe("Category ID"),
  logicalStatus: z.string().nullable().optional().describe("Logical status, e.g., normal, archived"),
  parentId: z.string().nullable().optional().describe("Parent Work item ID"),
  serialNumber: z.string().nullable().optional().describe("Serial number"),
  statusStageId: z.string().nullable().optional().describe("Status stage ID"),
  updateStatusAt: z.number().int().nullable().optional().describe("Status update time in milliseconds"),
  idPath: z.string().nullable().optional().describe("Work item ID path"),
  
  assignedTo: UserInfoSchema.nullable().optional().describe("Assignee user ID, multiple values separated by commas. Special value 'self' can be used to represent the current user"),
  creator: UserInfoSchema.nullable().optional().describe("Creator user ID, multiple values separated by commas. Special value 'self' can be used to represent the current user"),
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

// Projex Project related schemas
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
  adminUserId: z.string().nullable().optional().describe("Project administrator user ID, should use userId returned from getCurrentOrganizationInfoFunc or user-provided user ID, multiple IDs separated by commas"),
  logicalStatus: z.string().nullable().optional().describe("Logical status, e.g., NORMAL"),

  // Special filter for common scenarios
  scenarioFilter: z.enum(["manage", "participate", "favorite"]).nullable().optional().describe("Predefined filter scenarios: 'manage' (projects I manage), 'participate' (projects I participate in), 'favorite' (projects I favorited). Will be used to construct appropriate extraConditions. Requires userId from getCurrentOrganizationInfoFunc."),
  userId: z.string().nullable().optional().describe("User ID to use with scenarioFilter, should be the userId returned from getCurrentOrganizationInfoFunc"),

  // Advanced parameters
  advancedConditions: z.string().nullable().optional().describe("Advanced filter conditions, JSON format"),
  extraConditions: z.string().nullable().optional().describe("Additional filter conditions as JSON string. Should be constructed similar to the conditions parameter. For common scenarios: 1) For 'projects I manage': use fieldIdentifier 'project.admin' with the user ID; 2) For 'projects I participate in': use fieldIdentifier 'users' with the user ID; 3) For 'projects I favorited': use fieldIdentifier 'collectMembers' with the user ID. Example: JSON.stringify({conditionGroups:[[{className:'user',fieldIdentifier:'project.admin',format:'multiList',operator:'CONTAINS',value:[userId]}]]})"),
  orderBy: z.string().optional().default("gmtCreate").describe("Sort field, default is gmtCreate, supports: gmtCreate (creation time), name (name)"),
  page: z.number().int().default(1).optional().describe("Pagination parameter, page number"),
  perPage: z.number().int().default(20).optional().describe("Pagination parameter, page size, 0-200, default value is 20"),
  sort: z.string().optional().default("desc").describe("Sort order, default is desc, options: desc (descending), asc (ascending)"),
});

// Work item related schemas
export const GetWorkItemSchema = z.object({
  organizationId: z.string().describe("Organization ID, can be found in the basic information page of the organization admin console"),
  workItemId: z.string().describe("Work item unique identifier, required parameter"),
});

export const CreateWorkItemSchema = z.object({
  organizationId: z.string().describe("Organization ID"),
  spaceId: z.string().describe("Space ID, project unique identifier"),
  subject: z.string().describe("Work item title"),
  workitemTypeId: z.string().describe("Work item type ID"),
  assignedTo: z.string().describe("Assignee user ID"),
  customFieldValues: z.record(z.string()).optional().describe("Custom field values"),
  description: z.string().optional().describe("Work item description"),
  labels: z.array(z.string()).optional().describe("Associated label IDs"),
  parentId: z.string().optional().describe("Parent work item ID"),
  participants: z.array(z.string()).optional().describe("Participant user IDs"),
  sprint: z.string().optional().describe("Associated sprint ID"),
  trackers: z.array(z.string()).optional().describe("CC user IDs"),
  verifier: z.string().optional().describe("Verifier user ID"),
  versions: z.array(z.string()).optional().describe("Associated version IDs")
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
  updatedAfter: z.string().nullable().optional().describe("Updated not earlier than, format: YYYY-MM-DD"),
  updatedBefore: z.string().nullable().optional().describe("Updated not later than, format: YYYY-MM-DD"),
  creator: z.string().nullable().optional().describe("Creator user ID, multiple values separated by commas. Special value 'self' can be used to represent the current user"),
  assignedTo: z.string().nullable().optional().describe("Assignee user ID, multiple values separated by commas. Special value 'self' can be used to represent the current user"),
  sprint: z.string().nullable().optional().describe("Sprint ID, multiple values separated by commas"),
  workitemType: z.string().nullable().optional().describe("Work item type ID, multiple values separated by commas"),
  statusStage: z.string().nullable().optional().describe("Status stage ID, multiple values separated by commas"),
  tag: z.string().nullable().optional().describe("Tag ID, multiple values separated by commas"),
  priority: z.string().nullable().optional().describe("Priority ID, multiple values separated by commas"),
  subjectDescription: z.string().nullable().optional().describe("Text contained in title or description"),
  finishTimeAfter: z.string().nullable().optional().describe("Finish time not earlier than, format: YYYY-MM-DD"),
  finishTimeBefore: z.string().nullable().optional().describe("Finish time not later than, format: YYYY-MM-DD"),
  updateStatusAtAfter: z.string().nullable().optional().describe("Status update time not earlier than, format: YYYY-MM-DD"),
  updateStatusAtBefore: z.string().nullable().optional().describe("Status update time not later than, format: YYYY-MM-DD"),

  // Advanced parameters
  advancedConditions: z.string().nullable().optional().describe("Advanced filter conditions, JSON format"),
  orderBy: z.string().optional().default("gmtCreate").describe("Sort field, default is gmtCreate. Possible values: gmtCreate, subject, status, priority, assignedTo"),
  sort: z.string().optional().default("desc").describe("Sort order, default is desc. Possible values: desc (descending), asc (ascending)"),
  page: z.number().int().min(1).optional().describe("Page number, starting from 1. Default is 1"),
  perPage: z.number().int().min(0).max(200).optional().describe("Number of items per page, range 0-200. Default is 20"),
  includeDetails: z.boolean().optional().describe("Set to true when you need work item descriptions/detailed content. This automatically fetches missing descriptions instead of requiring separate get_work_item calls. RECOMMENDED: Use includeDetails=true when user asks for 'detailed content', 'descriptions', or 'full information' of work items. This is more efficient than calling get_work_item multiple times. Default is false")
});

// Work item type related schemas
export const WorkItemTypeDetailSchema = z.object({
  id: z.string().nullable().optional().describe("工作项类型ID"),
  name: z.string().nullable().optional().describe("工作项类型名称"),
  nameEn: z.string().nullable().optional().describe("工作项类型英文名称"),
  category: z.string().nullable().optional().describe("工作项类型分类"),
  description: z.string().nullable().optional().describe("工作项类型描述"),
  icon: z.string().nullable().optional().describe("图标"),
  color: z.string().nullable().optional().describe("颜色"),
  enable: z.boolean().nullable().optional().describe("是否启用"),
  defaultType: z.boolean().nullable().optional().describe("是否默认类型"),
  systemDefault: z.boolean().nullable().optional().describe("是否系统默认"),
});

export const ListAllWorkItemTypesSchema = z.object({
  organizationId: z.string().describe("企业ID，可在组织管理后台的基本信息页面获取"),
});

export const ListWorkItemTypesSchema = z.object({
  organizationId: z.string().describe("企业ID，可在组织管理后台的基本信息页面获取"),
  projectId: z.string().describe("项目唯一标识"),
  category: z.string().optional().describe("工作项类型，可选值为 Req，Bug，Task 等。"),
});

export const GetWorkItemTypeSchema = z.object({
  organizationId: z.string().describe("企业ID，可在组织管理后台的基本信息页面获取"),
  id: z.string().describe("工作项类型ID"),
});

export const ListWorkItemRelationWorkItemTypesSchema = z.object({
  organizationId: z.string().describe("企业ID，可在组织管理后台的基本信息页面获取"),
  workItemTypeId: z.string().describe("工作项类型ID"),
  relationType: z.enum(["PARENT", "SUB", "ASSOCIATED", "DEPEND_ON", "DEPENDED_BY"]).optional().describe("关联类型，可选值为 PARENT、SUB、ASSOCIATED，DEPEND_ON, DEPENDED_BY 分别对应父项，子项，关联项，依赖项，支撑项。"),
});

// Work item comment related schemas
export const ListWorkItemCommentsSchema = z.object({
  organizationId: z.string().describe("企业ID，可在组织管理后台的基本信息页面获取"),
  workItemId: z.string().describe("工作项ID"),
  page: z.number().int().optional().default(1).describe("页码"),
  perPage: z.number().int().optional().default(20).describe("每页条数"),
});

export const CreateWorkItemCommentSchema = z.object({
  organizationId: z.string().describe("企业ID，可在组织管理后台的基本信息页面获取"),
  workItemId: z.string().describe("工作项ID"),
  content: z.string().describe("评论内容"),
});

// Work item type field configuration schemas
export const FieldOptionSchema = z.object({
  id: z.string().nullable().optional().describe("选项ID"),
  name: z.string().nullable().optional().describe("选项名称"),
  value: z.string().nullable().optional().describe("选项值"),
});

export const WorkItemTypeFieldConfigSchema = z.object({
  id: z.string().nullable().optional().describe("字段配置ID"),
  workItemTypeId: z.string().nullable().optional().describe("工作项类型ID"),
  fieldId: z.string().nullable().optional().describe("字段ID"),
  fieldName: z.string().nullable().optional().describe("字段名称"),
  fieldType: z.string().nullable().optional().describe("字段类型"),
  required: z.boolean().nullable().optional().describe("是否必填"),
  editable: z.boolean().nullable().optional().describe("是否可编辑"),
  visible: z.boolean().nullable().optional().describe("是否可见"),
  defaultValue: z.string().nullable().optional().describe("默认值"),
  options: z.array(FieldOptionSchema).nullable().optional().describe("选项列表"),
});

// Workflow schemas
export const WorkflowStateSchema = z.object({
  id: z.string().nullable().optional().describe("状态ID"),
  name: z.string().nullable().optional().describe("状态名称"),
  nameEn: z.string().nullable().optional().describe("状态英文名称"),
  color: z.string().nullable().optional().describe("状态颜色"),
  order: z.number().int().nullable().optional().describe("状态顺序"),
  initialState: z.boolean().nullable().optional().describe("是否初始状态"),
  finalState: z.boolean().nullable().optional().describe("是否最终状态"),
});

export const TransitionConditionSchema = z.object({
  fieldId: z.string().nullable().optional().describe("字段ID"),
  operator: z.string().nullable().optional().describe("操作符"),
  value: z.string().nullable().optional().describe("值"),
});

export const WorkflowTransitionSchema = z.object({
  id: z.string().nullable().optional().describe("转换ID"),
  fromStateId: z.string().nullable().optional().describe("起始状态ID"),
  toStateId: z.string().nullable().optional().describe("目标状态ID"),
  name: z.string().nullable().optional().describe("转换名称"),
  conditions: z.array(TransitionConditionSchema).nullable().optional().describe("转换条件列表"),
});

export const WorkItemWorkflowSchema = z.object({
  id: z.string().nullable().optional().describe("工作流ID"),
  name: z.string().nullable().optional().describe("工作流名称"),
  workItemTypeId: z.string().nullable().optional().describe("工作项类型ID"),
  states: z.array(WorkflowStateSchema).nullable().optional().describe("状态列表"),
  transitions: z.array(WorkflowTransitionSchema).nullable().optional().describe("转换列表"),
});

export const GetWorkItemTypeFieldConfigSchema = z.object({
  organizationId: z.string().describe("企业ID，可在组织管理后台的基本信息页面获取"),
  projectId: z.string().describe("项目唯一标识"),
  workItemTypeId: z.string().describe("工作项类型ID"),
});

export const GetWorkItemWorkflowSchema = z.object({
  organizationId: z.string().describe("企业ID，可在组织管理后台的基本信息页面获取"),
  projectId: z.string().describe("项目唯一标识"),
  workItemTypeId: z.string().describe("工作项类型ID"),
});

// Update work item schemas
export const UpdateWorkItemFieldSchema = z.object({
  subject: z.string().optional().describe("工作项标题"),
  description: z.string().optional().describe("工作项描述"),
  status: z.string().optional().describe("状态Id"),
  assignedTo: z.string().optional().describe("指派人userId"),
  priority: z.string().optional().describe("优先级Id"),
  labels: z.array(z.string()).optional().describe("关联的标签id列表"),
  sprint: z.string().optional().describe("关联的迭代Id"),
  trackers: z.array(z.string()).optional().describe("抄送人userId列表"),
  verifier: z.string().optional().describe("验证人userId"),
  participants: z.array(z.string()).optional().describe("参与人userId列表"),
  versions: z.array(z.string()).optional().describe("关联的版本Id列表"),
  customFieldValues: z.record(z.string(), z.any()).optional().describe("自定义字段值，格式为 {\"fieldId\": \"value\"} 或 {\"fieldId\": [\"value1\", \"value2\"]}"),
});

export const UpdateWorkItemSchema = z.object({
  organizationId: z.string().describe("Organization ID"),
  workItemId: z.string().describe("Work item ID"),
  updateWorkItemFields: UpdateWorkItemFieldSchema
});

// Effort related types
export const MiniUserSchema = z.object({
  id: z.string().nullable().optional().describe("用户id"),
  name: z.string().nullable().optional().describe("名称"),
});

export const EffortRecordSchema = z.object({
  actualTime: z.number().nullable().optional().describe("时间工时"),
  creator: MiniUserSchema.nullable().optional().describe("创建人"),
  description: z.string().nullable().optional().describe("描述"),
  gmtCreate: z.number().nullable().optional().describe("创建时间"),
  gmtEnd: z.number().nullable().optional().describe("工作的结束日期"),
  gmtModified: z.number().nullable().optional().describe("修改时间"),
  gmtStart: z.number().nullable().optional().describe("工作的开始日期"),
  id: z.string().nullable().optional().describe("id"),
  modifier: MiniUserSchema.nullable().optional().describe("修改人"),
  owner: MiniUserSchema.nullable().optional().describe("负责人"),
  workType: z.string().nullable().optional().describe("工作类别"),
  workitemId: z.string().nullable().optional().describe("工作项id"),
});

export const EstimatedEffortSchema = z.object({
  creator: MiniUserSchema.nullable().optional().describe("创建人"),
  description: z.string().nullable().optional().describe("描述"),
  gmtCreate: z.number().nullable().optional().describe("创建时间"),
  gmtModified: z.number().nullable().optional().describe("修改时间"),
  id: z.string().nullable().optional().describe("id"),
  modifier: MiniUserSchema.nullable().optional().describe("修改人"),
  owner: MiniUserSchema.nullable().optional().describe("负责人"),
  spentTime: z.number().nullable().optional().describe("预计工时"),
  workType: z.string().nullable().optional().describe("工作项类别"),
  workitemId: z.string().nullable().optional().describe("工作项id"),
});

export const IdentifierDTOSchema = z.object({
  id: z.string().nullable().optional().describe("id"),
});

export const CreateEffortRecordRequestSchema = z.object({
  actualTime: z.number().positive().describe("实际工时"),
  description: z.string().max(500).optional().describe("工作描述"),
  gmtEnd: z.string().describe("工作开始结束日期"),
  gmtStart: z.string().describe("工作开始日期"),
  operatorId: z.string().optional().describe("操作者的useId，个人token时该参数无效"),
  workType: z.string().optional().describe("工作类型"),
});

export const CreateEstimatedEffortRequestSchema = z.object({
  description: z.string().max(500).optional().describe("工作描述"),
  operatorId: z.string().optional().describe("操作者的useId，个人token时该参数无效"),
  owner: z.string().describe("负责人，填userId"),
  spentTime: z.number().positive().describe("预计工时"),
  workType: z.string().optional().describe("工作类别"),
});

// Effort related schemas
export const ListCurrentUserEffortRecordsSchema = z.object({
  organizationId: z.string().describe("organizationId"),
  startDate: z.string().describe("工作的开始时间，格式为yyyy-MM-dd"),
  endDate: z.string().describe("工作的结束时间，格式为yyyy-MM-dd"),
});

export const ListEffortRecordsSchema = z.object({
  id: z.string().describe("工作项唯一标识"),
  organizationId: z.string().describe("organizationId"),
});

export const CreateEffortRecordSchema = z.object({
  id: z.string().describe("工作项唯一标识"),
  organizationId: z.string().describe("organizationId"),
  actualTime: z.number().positive().describe("实际工时"),
  description: z.string().max(500).optional().describe("工作描述"),
  gmtEnd: z.string().describe("工作开始结束日期"),
  gmtStart: z.string().describe("工作开始日期"),
  operatorId: z.string().optional().describe("操作者的useId，个人token时该参数无效"),
  workType: z.string().optional().describe("工作类型"),
});

export const ListEstimatedEffortsSchema = z.object({
  id: z.string().describe("工作项唯一标识"),
  organizationId: z.string().describe("organizationId"),
});

export const CreateEstimatedEffortSchema = z.object({
  id: z.string().describe("工作项唯一标识"),
  organizationId: z.string().describe("organizationId"),
  description: z.string().max(500).optional().describe("工作描述"),
  operatorId: z.string().optional().describe("操作者的useId，个人token时该参数无效"),
  owner: z.string().describe("负责人，填userId"),
  spentTime: z.number().positive().describe("预计工时"),
  workType: z.string().optional().describe("工作类别"),
});

export const UpdateEffortRecordSchema = z.object({
  organizationId: z.string().describe("organizationId"),
  workitemId: z.string().describe("工作项唯一标识"),
  id: z.string().describe("工时记录唯一标识"),
  actualTime: z.number().positive().describe("实际工时"),
  description: z.string().max(500).optional().describe("工作描述"),
  gmtEnd: z.string().describe("工作开始结束日期"),
  gmtStart: z.string().describe("工作开始日期"),
  operatorId: z.string().optional().describe("操作者的useId，个人token时该参数无效"),
  workType: z.string().optional().describe("工作类型"),
});

export const UpdateEstimatedEffortSchema = z.object({
  organizationId: z.string().describe("organizationId"),
  workitemId: z.string().describe("工作项唯一标识"),
  id: z.string().describe("预计工时记录唯一标识"),
  description: z.string().max(500).optional().describe("工作描述"),
  operatorId: z.string().optional().describe("操作者的useId，个人token时该参数无效"),
  owner: z.string().describe("负责人，填userId"),
  spentTime: z.number().positive().describe("预计工时"),
  workType: z.string().optional().describe("工作类别"),
});

// Type exports
export type WorkItemTypeDetail = z.infer<typeof WorkItemTypeDetailSchema>;
export type ListAllWorkItemTypesParams = z.infer<typeof ListAllWorkItemTypesSchema>;
export type ListWorkItemTypesParams = z.infer<typeof ListWorkItemTypesSchema>;
export type GetWorkItemTypeParams = z.infer<typeof GetWorkItemTypeSchema>;
export type ListWorkItemRelationWorkItemTypesParams = z.infer<typeof ListWorkItemRelationWorkItemTypesSchema>;
export type ListWorkItemCommentsParams = z.infer<typeof ListWorkItemCommentsSchema>;
export type CreateWorkItemCommentParams = z.infer<typeof CreateWorkItemCommentSchema>;
export type FieldOption = z.infer<typeof FieldOptionSchema>;
export type WorkItemTypeFieldConfig = z.infer<typeof WorkItemTypeFieldConfigSchema>;
export type GetWorkItemTypeFieldConfigParams = z.infer<typeof GetWorkItemTypeFieldConfigSchema>;
export type WorkflowState = z.infer<typeof WorkflowStateSchema>;
export type TransitionCondition = z.infer<typeof TransitionConditionSchema>;
export type WorkflowTransition = z.infer<typeof WorkflowTransitionSchema>;
export type WorkItemWorkflow = z.infer<typeof WorkItemWorkflowSchema>;
export type GetWorkItemWorkflowParams = z.infer<typeof GetWorkItemWorkflowSchema>;
export type UpdateWorkItemParams = z.infer<typeof UpdateWorkItemSchema>;
export type UpdateWorkItemField = z.infer<typeof UpdateWorkItemFieldSchema>;
export type Status = z.infer<typeof StatusSchema>;
export type Space = z.infer<typeof SpaceSchema>;
export type Sprint = z.infer<typeof SprintSchema>;

// Effort type exports
export type MiniUser = z.infer<typeof MiniUserSchema>;
export type EffortRecord = z.infer<typeof EffortRecordSchema>;
export type EstimatedEffort = z.infer<typeof EstimatedEffortSchema>;
export type IdentifierDTO = z.infer<typeof IdentifierDTOSchema>;
export type CreateEffortRecordRequest = z.infer<typeof CreateEffortRecordRequestSchema>;
export type CreateEstimatedEffortRequest = z.infer<typeof CreateEstimatedEffortRequestSchema>;

export type ListCurrentUserEffortRecordsParams = z.infer<typeof ListCurrentUserEffortRecordsSchema>;
export type ListEffortRecordsParams = z.infer<typeof ListEffortRecordsSchema>;
export type CreateEffortRecordParams = z.infer<typeof CreateEffortRecordSchema>;
export type ListEstimatedEffortsParams = z.infer<typeof ListEstimatedEffortsSchema>;
export type CreateEstimatedEffortParams = z.infer<typeof CreateEstimatedEffortSchema>;
export type UpdateEffortRecordParams = z.infer<typeof UpdateEffortRecordSchema>;
export type UpdateEstimatedEffortParams = z.infer<typeof UpdateEstimatedEffortSchema>;