import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import * as types from '../common/types.js';

export const getProjectManagementTools = () => [
  // Project Operations
  {
    name: "get_project",
    description: "[Project Management] Get information about a Yunxiao project",
    inputSchema: zodToJsonSchema(types.GetProjectSchema),
  },
  {
    name: "search_projects",
    description: "[Project Management] Search for Yunxiao Project List. A Project is a project management unit that includes work items and sprints, and it is different from a code repository (Repository).\n\nUse Cases:\n\nQuery projects I am involved in\nQuery projects I have created",
    inputSchema: zodToJsonSchema(types.SearchProjectsSchema),
  },
  {
    name: "search_programs",
    description: "[Project Management] Search for Yunxiao Program (Project Set) List. A Program is a collection of multiple related projects, used for unified management and coordination of large projects.\n\nUse Cases:\n\nQuery programs by name\nQuery programs by status\nQuery programs by creator",
    inputSchema: zodToJsonSchema(types.SearchProgramsSchema),
  },

  // Version Operations
  {
    name: "list_program_versions",
    description: "[Project Management] List versions for a Yunxiao Program (Project Set). Versions are used to manage release plans and track delivery progress.\n\nUse Cases:\n\nList all versions in a program\nFilter versions by status (TODO, DOING, ARCHIVED)\nSearch versions by name",
    inputSchema: zodToJsonSchema(types.ListProgramVersionsSchema),
  },
  {
    name: "list_versions",
    description: "[Project Management] List versions for a Yunxiao Project or Program. Versions are used to manage release plans and track delivery progress.\n\nUse Cases:\n\nList all versions in a project\nFilter versions by status (TODO, DOING, ARCHIVED)\nSearch versions by name",
    inputSchema: zodToJsonSchema(types.ListVersionsSchema),
  },
  {
    name: "create_version",
    description: "[Project Management] Create a new version in a Yunxiao Project. Versions are used to manage release plans and track delivery progress.\n\nUse Cases:\n\nCreate a new release version\nPlan project milestones\nSet version owners and dates",
    inputSchema: zodToJsonSchema(types.CreateVersionSchema),
  },
  {
    name: "update_version",
    description: "[Project Management] Update an existing version in a Yunxiao Project. Can update version name, owners, start date, and publish date.\n\nUse Cases:\n\nUpdate version name\nChange version owners\nModify version dates",
    inputSchema: zodToJsonSchema(types.UpdateVersionSchema),
  },
  {
    name: "delete_version",
    description: "[Project Management] Delete a version from a Yunxiao Project.\n\nUse Cases:\n\nRemove obsolete versions\nClean up project versions",
    inputSchema: zodToJsonSchema(types.DeleteVersionSchema),
  },

  // Sprint Operations
  {
    name: "get_sprint",
    description: "[Project Management] Get information about a sprint",
    inputSchema: zodToJsonSchema(types.GetSprintSchema),
  },
  {
    name: "list_sprints",
    description: "[Project Management] List sprints in a project",
    inputSchema: zodToJsonSchema(types.ListSprintsSchema),
  },
  {
    name: "create_sprint",
    description: "[Project Management] Create a new sprint",
    inputSchema: zodToJsonSchema(types.CreateSprintSchema),
  },
  {
    name: "update_sprint",
    description: "[Project Management] Update an existing sprint",
    inputSchema: zodToJsonSchema(types.UpdateSprintSchema),
  },

  // Work Item Operations
  {
    name: "get_work_item",
    description: "[Project Management] Get information about a work item",
    inputSchema: zodToJsonSchema(types.GetWorkItemSchema),
  },
  {
    name: "create_work_item",
    description: "[Project Management] Create a work item. \n描述字段使用提示：\n- description 支持 Markdown / 富文本，需配合 formatType（\"MARKDOWN\" 或 \"RICHTEXT\"）。\n- 描述中插入图片三步法：① 先建工作项（本工具， description 可先为空或占位）；② 调 create_workitem_attachment 上传图片拿到返回值中的 embedMarkdown 或 embedHtml；③ 调 update_work_item 把拼好的 description 写回。✅ 报错点：不要使用 create_workitem_attachment 返回的 url 字段，那是 30 秒过期的 OSS 临时签名。\n- 实际工时（fieldId 101587）与预计工时（fieldId 101586）为云效受控系统字段，不能通过本工具的 customFieldValues 修改；请改用 `create_effort_record` / `create_estimated_effort` 。",
    inputSchema: zodToJsonSchema(types.CreateWorkItemSchema),
  },
  {
    name: "search_workitems",
    description: "[Project Management] Search work items with various filter conditions",
    inputSchema: zodToJsonSchema(types.SearchWorkitemsSchema),
  },
  {
    name: "get_work_item_types",
    description: "[Project Management] Get the list of work item types for a project",
    inputSchema: zodToJsonSchema(z.object({
      organizationId: z.string().describe("Organization ID"),
      id: z.string().describe("Project unique identifier"),
      category: z.string().describe("Work item type category, optional values: Req, Bug, Task, etc.")
    })),
  },
  {
    name: "delete_work_item",
    description: "[Project Management] Delete a work item. This operation is irreversible.",
    inputSchema: zodToJsonSchema(types.DeleteWorkItemSchema),
  },
  {
    name: "update_work_item",
    description: "[Project Management] Update a work item. \n调用参数结构：除 organizationId / workItemId 外，所有要更新的字段必须放在 updateWorkItemFields 对象中（包括 subject / description / formatType / status / assignedTo / priority / labels / sprint / trackers / verifier / participants / versions / customFieldValues）。\n描述中插入图片：先调 create_workitem_attachment 拿到返回值的 embedMarkdown（formatType=\"MARKDOWN\"）或 embedHtml（formatType=\"RICHTEXT\"），拼进 updateWorkItemFields.description，同时 updateWorkItemFields.formatType 设为对应值。⚠️ 不要把 create_workitem_attachment 返回的 url 嵌入 description，那是 30 秒过期的 OSS 临时签名。\n受控字段提醒：实际工时（fieldId 101587）与预计工时（fieldId 101586）为云效受控系统字段，不能通过 updateWorkItemFields.customFieldValues 修改；请改用 `create_effort_record`/`update_effort_record` 与 `create_estimated_effort`/`update_estimated_effort`。",
    inputSchema: zodToJsonSchema(types.UpdateWorkItemSchema),
  },

  // Work Item Type Operations
  {
    name: "list_all_work_item_types",
    description: "[Project Management] List all work item types in an organization",
    inputSchema: zodToJsonSchema(types.ListAllWorkItemTypesSchema),
  },
  {
    name: "list_work_item_types",
    description: "[Project Management] List work item types in a project space",
    inputSchema: zodToJsonSchema(types.ListWorkItemTypesSchema),
  },
  {
    name: "get_work_item_type",
    description: "[Project Management] Get details of a specific work item type",
    inputSchema: zodToJsonSchema(types.GetWorkItemTypeSchema),
  },
  {
    name: "list_work_item_relation_work_item_types",
    description: "[Project Management] List work item types that can be related to a specific work item",
    inputSchema: zodToJsonSchema(types.ListWorkItemRelationWorkItemTypesSchema),
  },
  {
    name: "get_work_item_type_field_config",
    description: "[Project Management] Get field configuration for a specific work item type",
    inputSchema: zodToJsonSchema(types.GetWorkItemTypeFieldConfigSchema),
  },
  {
    name: "get_work_item_workflow",
    description: "[Project Management] Get workflow information for a specific work item type",
    inputSchema: zodToJsonSchema(types.GetWorkItemWorkflowSchema),
  },
  {
    name: "list_work_item_comments",
    description: "[Project Management] List comments for a specific work item",
    inputSchema: zodToJsonSchema(types.ListWorkItemCommentsSchema),
  },
  {
    name: "create_work_item_comment",
    description: "[Project Management] Create a comment for a specific work item",
    inputSchema: zodToJsonSchema(types.CreateWorkItemCommentSchema),
  },

  // Work item related testcase Operations
  {
    name: "list_workitem_testcase_relations",
    description: "[Project Management] List test cases related to a work item. Returns relation records including relationRecordId (used for deletion), testcaseId, subject and owner.",
    inputSchema: zodToJsonSchema(types.ListWorkitemTestcaseRelationsSchema),
  },
  {
    name: "create_workitem_testcase_relation",
    description: "[Project Management] Relate a test case to a work item. Returns the created relation record id.",
    inputSchema: zodToJsonSchema(types.CreateWorkitemTestcaseRelationSchema),
  },
  {
    name: "delete_workitem_testcase_relation",
    description: "[Project Management] Remove a test case relation from a work item by relationRecordId (obtained from list_workitem_testcase_relations).",
    inputSchema: zodToJsonSchema(types.DeleteWorkitemTestcaseRelationSchema),
    annotations: {
      destructiveHint: true,
    },
  },

  // Attachment Operations
  {
    name: "list_workitem_attachments",
    description: "[Project Management] List attachments for a specific work item. Returns attachment information including file name, size, suffix, download URL, and creator/modifier details.",
    inputSchema: zodToJsonSchema(types.ListWorkitemAttachmentsSchema),
  },
  {
    name: "get_workitem_file",
    description: "[Project Management] Get file information for a specific work item. Supports both file IDs (long hex for description-embedded images) and attachment IDs (numeric like 62487031). Returns file details including name, size, suffix, and a temporary download URL.",
    inputSchema: zodToJsonSchema(types.GetWorkitemFileSchema),
  },
  {
    name: "create_workitem_attachment",
    description: "[Project Management] Upload a local file as an attachment to a work item via multipart/form-data. MCP Server reads the file at the given absolute path and uploads it. Supports any file type (单文件 ≤ 10MB，云效不支持 svg/tiff)。\n返回 WorkitemFile 含以下关键字段：\n- `id`/`name`/`size`/`suffix`：文件基础信息\n- `url`：OSS 临时下载地址，约 30 秒过期。⚠️ 仅用于下载，不要嵌入工作项描述/评论\n- `embedUrl`：永久代理 URL，适用于在工作项描述/评论中嵌入图片\n- `embedMarkdown`：预拼好的 Markdown 图片标签，formatType=MARKDOWN 时拼接进 description 即可\n- `embedHtml`：预拼好的 HTML <img> 标签，formatType=RICHTEXT 时拼接进 description 即可\n在工作项描述中插入图片的标准三步法：① 创建工作项（如已有则跳过）；② 调本工具上传图片、读出 embedMarkdown / embedHtml；③ 调 update_work_item，在 updateWorkItemFields.description 中拼入该 embed* 字段，同时设置 updateWorkItemFields.formatType 为 \"MARKDOWN\" 或 \"RICHTEXT\"。\n应用 token 场景必传 operatorId，个人 token 必传可省略。",
    inputSchema: zodToJsonSchema(types.CreateWorkitemAttachmentSchema),
  },
  {
    name: "list_workitem_activities",
    description: "[Project Management] List activity history for a specific work item. Returns changes including field updates, status transitions, association changes, and attachment changes, with operator and timestamp details.",
    inputSchema: zodToJsonSchema(types.ListWorkitemActivitiesSchema),
  }
];
