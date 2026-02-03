# Project Management (project-management)

Tools in this toolset: **26**

## Tools

- `create_sprint` - [Project Management] Create a new sprint
    - **Required parameters**:
      - `organizationId` (string): Organization ID
      - `projectId` (string): Project unique identifier
      - `name` (string): Sprint name
      - `owners` (array): Sprint owner user IDs
    - **Optional parameters**:
      - `startDate` (string): Date string in YYYY-MM-DD format
      - `endDate` (string): Date string in YYYY-MM-DD format
      - `description` (string): Sprint description
      - `capacityHours` (integer): Sprint capacity hours


- `create_work_item` - [Project Management] Create a work item
    - **Required parameters**:
      - `organizationId` (string): Organization ID
      - `spaceId` (string): Space ID, project unique identifier
      - `subject` (string): Work item title
      - `workitemTypeId` (string): Work item type ID
      - `assignedTo` (string): Assignee user ID
    - **Optional parameters**:
      - `customFieldValues` (object): Custom field values
      - `description` (string): Work item description
      - `labels` (array): Associated label IDs
      - `parentId` (string): Parent work item ID
      - `participants` (array): Participant user IDs
      - `sprint` (string): Associated sprint ID
      - `trackers` (array): CC user IDs
      - `verifier` (string): Verifier user ID
      - `versions` (array): Associated version IDs


- `create_work_item_comment` - [Project Management] Create a comment for a specific work item
    - **Required parameters**:
      - `organizationId` (string): 企业ID，可在组织管理后台的基本信息页面获取
      - `workItemId` (string): 工作项ID
      - `content` (string): 评论内容


- `create_effort_record` - [Project Management] 登记实际工时
    - **Required parameters**:
      - `id` (string): 工作项唯一标识
      - `organizationId` (string): organizationId
      - `actualTime` (number): 实际工时
      - `gmtEnd` (string): 工作开始结束日期
      - `gmtStart` (string): 工作开始日期
    - **Optional parameters**:
      - `description` (string): 工作描述
      - `operatorId` (string): 操作者的useId，个人token时该参数无效
      - `workType` (string): 工作类型


- `create_estimated_effort` - [Project Management] 登记预计工时
    - **Required parameters**:
      - `id` (string): 工作项唯一标识
      - `organizationId` (string): organizationId
      - `owner` (string): 负责人，填userId
      - `spentTime` (number): 预计工时
    - **Optional parameters**:
      - `description` (string): 工作描述
      - `operatorId` (string): 操作者的useId，个人token时该参数无效
      - `workType` (string): 工作类别


- `get_project` - [Project Management] Get information about a Yunxiao project
    - **Required parameters**:
      - `organizationId` (string): Organization ID
      - `id` (string): Project unique identifier


- `get_sprint` - [Project Management] Get information about a sprint
    - **Required parameters**:
      - `organizationId` (string): Organization ID
      - `projectId` (string): Project unique identifier
      - `id` (string): Sprint unique identifier


- `get_work_item` - [Project Management] Get information about a work item
    - **Required parameters**:
      - `organizationId` (string): Organization ID, can be found in the basic information page of the organization admin console
      - `workItemId` (string): Work item unique identifier, required parameter


- `get_work_item_types` - [Project Management] Get the list of work item types for a project
    - **Required parameters**:
      - `organizationId` (string): Organization ID
      - `id` (string): Project unique identifier
      - `category` (string): Work item type category, optional values: Req, Bug, Task, etc.


- `get_work_item_type` - [Project Management] Get details of a specific work item type
    - **Required parameters**:
      - `organizationId` (string): 企业ID，可在组织管理后台的基本信息页面获取
      - `id` (string): 工作项类型ID


- `get_work_item_type_field_config` - [Project Management] Get field configuration for a specific work item type
    - **Required parameters**:
      - `organizationId` (string): 企业ID，可在组织管理后台的基本信息页面获取
      - `projectId` (string): 项目唯一标识
      - `workItemTypeId` (string): 工作项类型ID


- `get_work_item_workflow` - [Project Management] Get workflow information for a specific work item type
    - **Required parameters**:
      - `organizationId` (string): 企业ID，可在组织管理后台的基本信息页面获取
      - `projectId` (string): 项目唯一标识
      - `workItemTypeId` (string): 工作项类型ID


- `list_sprints` - [Project Management] List sprints in a project
    - **Required parameters**:
      - `organizationId` (string): Organization ID
      - `id` (string): Project unique identifier
    - **Optional parameters**:
      - `status` (array): Filter by status: TODO, DOING, ARCHIVED
      - `page` (integer): Page number
      - `perPage` (integer): Page size


- `list_all_work_item_types` - [Project Management] List all work item types in an organization
    - **Required parameters**:
      - `organizationId` (string): 企业ID，可在组织管理后台的基本信息页面获取


- `list_work_item_types` - [Project Management] List work item types in a project space
    - **Required parameters**:
      - `organizationId` (string): 企业ID，可在组织管理后台的基本信息页面获取
      - `projectId` (string): 项目唯一标识
    - **Optional parameters**:
      - `category` (string): 工作项类型，可选值为 Req，Bug，Task 等。


- `list_work_item_relation_work_item_types` - [Project Management] List work item types that can be related to a specific work item
    - **Required parameters**:
      - `organizationId` (string): 企业ID，可在组织管理后台的基本信息页面获取
      - `workItemTypeId` (string): 工作项类型ID
    - **Optional parameters**:
      - `relationType` (string): 关联类型，可选值为 PARENT、SUB、ASSOCIATED，DEPEND_ON, DEPENDED_BY 分别对应父项，子项，关联项，依赖项，支撑项。


- `list_work_item_comments` - [Project Management] List comments for a specific work item
    - **Required parameters**:
      - `organizationId` (string): 企业ID，可在组织管理后台的基本信息页面获取
      - `workItemId` (string): 工作项ID
    - **Optional parameters**:
      - `page` (integer): 页码
      - `perPage` (integer): 每页条数


- `list_current_user_effort_records` - [Project Management] 获取用户的实际工时明细，结束时间和开始时间的间隔不能大于6个月
    - **Required parameters**:
      - `organizationId` (string): organizationId
      - `startDate` (string): 工作的开始时间，格式为yyyy-MM-dd
      - `endDate` (string): 工作的结束时间，格式为yyyy-MM-dd


- `list_effort_records` - [Project Management] 获取实际工时明细
    - **Required parameters**:
      - `id` (string): 工作项唯一标识
      - `organizationId` (string): organizationId


- `list_estimated_efforts` - [Project Management] 获取预计工时明细
    - **Required parameters**:
      - `id` (string): 工作项唯一标识
      - `organizationId` (string): organizationId


- `search_projects` - [Project Management] Search for Yunxiao Project List. A Project is a project management unit that includes work items and sprints, and it is different from a code repository (Repository).

Use Cases:

Query projects I am involved in
Query projects I have created
    - **Required parameters**:
      - `organizationId` (string): Organization ID
    - **Optional parameters**:
      - `name` (['string', 'null']): Text contained in project name
      - `status` (['string', 'null']): Project status ID, multiple separated by commas
      - `createdAfter` (['string', 'null']): Created not earlier than, format: YYYY-MM-DD
      - `createdBefore` (['string', 'null']): Created not later than, format: YYYY-MM-DD
      - `creator` (['string', 'null']): Creator
      - `adminUserId` (['string', 'null']): Project administrator user ID, should use userId returned from getCurrentOrganizationInfoFunc or user-provided user ID, multiple IDs separated by commas
      - `logicalStatus` (['string', 'null']): Logical status, e.g., NORMAL
      - `scenarioFilter` (unknown): Predefined filter scenarios: 'manage' (projects I manage), 'participate' (projects I participate in), 'favorite' (projects I favorited). Will be used to construct appropriate extraConditions. Requires userId from getCurrentOrganizationInfoFunc.
      - `userId` (['string', 'null']): User ID to use with scenarioFilter, should be the userId returned from getCurrentOrganizationInfoFunc
      - `advancedConditions` (['string', 'null']): Advanced filter conditions, JSON format
      - `extraConditions` (['string', 'null']): Additional filter conditions as JSON string. Should be constructed similar to the conditions parameter. For common scenarios: 1) For 'projects I manage': use fieldIdentifier 'project.admin' with the user ID; 2) For 'projects I participate in': use fieldIdentifier 'users' with the user ID; 3) For 'projects I favorited': use fieldIdentifier 'collectMembers' with the user ID. Example: JSON.stringify({conditionGroups:[[{className:'user',fieldIdentifier:'project.admin',format:'multiList',operator:'CONTAINS',value:[userId]}]]})
      - `orderBy` (string): Sort field, default is gmtCreate, supports: gmtCreate (creation time), name (name)
      - `page` (integer): Pagination parameter, page number
      - `perPage` (integer): Pagination parameter, page size, 0-200, default value is 20
      - `sort` (string): Sort order, default is desc, options: desc (descending), asc (ascending)


- `search_workitems` - [Project Management] Search work items with various filter conditions
    - **Required parameters**:
      - `organizationId` (string): Organization ID
      - `category` (string): Search for work item types, such as Req (requirement), Task (task), Bug (defect), etc., multiple values separated by commas
      - `spaceId` (string): Project ID, project unique identifier
    - **Optional parameters**:
      - `subject` (['string', 'null']): Text contained in the title
      - `status` (['string', 'null']): Status ID, multiple separated by commas. Status names and their IDs: Pending Confirmation (28), Pending Processing (100005), Reopened (30), Deferred Fix (34), Confirmed (32), Selected (625489), In Analysis (154395), Analysis Complete (165115), In Progress (100010), In Design (156603), Design Complete (307012), In Development (142838), Development Complete (100011), In Testing (100012)
      - `createdAfter` (['string', 'null']): Created not earlier than, format: YYYY-MM-DD
      - `createdBefore` (['string', 'null']): Created not later than, format: YYYY-MM-DD
      - `updatedAfter` (['string', 'null']): Updated not earlier than, format: YYYY-MM-DD
      - `updatedBefore` (['string', 'null']): Updated not later than, format: YYYY-MM-DD
      - `creator` (['string', 'null']): Creator user ID, multiple values separated by commas. Special value 'self' can be used to represent the current user
      - `assignedTo` (['string', 'null']): Assignee user ID, multiple values separated by commas. Special value 'self' can be used to represent the current user
      - `sprint` (['string', 'null']): Sprint ID, multiple values separated by commas
      - `workitemType` (['string', 'null']): Work item type ID, multiple values separated by commas
      - `statusStage` (['string', 'null']): Status stage ID, multiple values separated by commas
      - `tag` (['string', 'null']): Tag ID, multiple values separated by commas
      - `priority` (['string', 'null']): Priority ID, multiple values separated by commas
      - `subjectDescription` (['string', 'null']): Text contained in title or description
      - `finishTimeAfter` (['string', 'null']): Finish time not earlier than, format: YYYY-MM-DD
      - `finishTimeBefore` (['string', 'null']): Finish time not later than, format: YYYY-MM-DD
      - `updateStatusAtAfter` (['string', 'null']): Status update time not earlier than, format: YYYY-MM-DD
      - `updateStatusAtBefore` (['string', 'null']): Status update time not later than, format: YYYY-MM-DD
      - `advancedConditions` (['string', 'null']): Advanced filter conditions, JSON format
      - `orderBy` (string): Sort field, default is gmtCreate. Possible values: gmtCreate, subject, status, priority, assignedTo
      - `sort` (string): Sort order, default is desc. Possible values: desc (descending), asc (ascending)
      - `page` (integer): Page number, starting from 1. Default is 1
      - `perPage` (integer): Number of items per page, range 0-200. Default is 20
      - `includeDetails` (boolean): Set to true when you need work item descriptions/detailed content. This automatically fetches missing descriptions instead of requiring separate get_work_item calls. RECOMMENDED: Use includeDetails=true when user asks for 'detailed content', 'descriptions', or 'full information' of work items. This is more efficient than calling get_work_item multiple times. Default is false


- `update_sprint` - [Project Management] Update an existing sprint
    - **Required parameters**:
      - `organizationId` (string): Organization ID
      - `projectId` (string): Project unique identifier
      - `id` (string): Sprint unique identifier
      - `name` (string): Sprint name
    - **Optional parameters**:
      - `owners` (array): Sprint owner user IDs
      - `startDate` (string): Date string in YYYY-MM-DD format
      - `endDate` (string): Date string in YYYY-MM-DD format
      - `description` (string): Sprint description
      - `capacityHours` (integer): Sprint capacity hours


- `update_work_item` - [Project Management] Update a work item
    - **Required parameters**:
      - `organizationId` (string): Organization ID
      - `workItemId` (string): Work item ID
      - `updateWorkItemFields` (object): No description


- `update_effort_record` - [Project Management] 更新登记实际工时
    - **Required parameters**:
      - `organizationId` (string): organizationId
      - `workitemId` (string): 工作项唯一标识
      - `id` (string): 工时记录唯一标识
      - `actualTime` (number): 实际工时
      - `gmtEnd` (string): 工作开始结束日期
      - `gmtStart` (string): 工作开始日期
    - **Optional parameters**:
      - `description` (string): 工作描述
      - `operatorId` (string): 操作者的useId，个人token时该参数无效
      - `workType` (string): 工作类型


- `update_estimated_effort` - [Project Management] 更新登记预计工时
    - **Required parameters**:
      - `organizationId` (string): organizationId
      - `workitemId` (string): 工作项唯一标识
      - `id` (string): 预计工时记录唯一标识
      - `owner` (string): 负责人，填userId
      - `spentTime` (number): 预计工时
    - **Optional parameters**:
      - `description` (string): 工作描述
      - `operatorId` (string): 操作者的useId，个人token时该参数无效
      - `workType` (string): 工作类别
