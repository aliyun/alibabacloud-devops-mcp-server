# Application Delivery (application-delivery)

Tools in this toolset: **57**

## Tools

- `add_host_list_to_host_group` - [application delivery] Add host list to host group
    - **Required parameters**:
      - `organizationId` (string): 组织ID
      - `instanceName` (string): 主机集群名称（非主机集群显示名）
      - `hostSns` (array): ecs主机实例id列表(主机类型暂只支持ecs)


- `add_host_list_to_deploy_group` - [application delivery] Add host list to deploy group
    - **Required parameters**:
      - `organizationId` (string): 组织ID
      - `instanceName` (string): 主机集群名称（非主机集群显示名）
      - `groupName` (string): 部署组名称(非部署组显示名)
      - `hostSns` (array): ecs主机实例id列表(主机类型暂只支持ecs)

### Cancel

- `cancel_appstack_change_request` - [application delivery] Cancel a change request
    - **Required parameters**:
      - `organizationId` (string): 组织ID
      - `appName` (string): 应用名
      - `sn` (string): 变更标识符


- `cancel_app_release_stage_execution` - [application delivery] 取消发布流程阶段执行
    - **Required parameters**:
      - `organizationId` (string): 组织ID
      - `appName` (string): 应用名
      - `releaseWorkflowSn` (string): 发布流程唯一序列号
      - `releaseStageSn` (string): 发布流程阶段唯一序列号
      - `executionNumber` (string): 发布流程阶执行序号

### Close

- `close_appstack_change_request` - [application delivery] Close a change request
    - **Required parameters**:
      - `organizationId` (string): 组织ID
      - `appName` (string): 应用名
      - `sn` (string): 变更标识符

### Create Operations

- `create_application` - [application delivery] Create a new application
    - **Required parameters**:
      - `organizationId` (string): 组织id
      - `name` (string): 应用名
    - **Optional parameters**:
      - `appTemplateName` (string): 应用模板唯一名
      - `description` (string): 应用描述
      - `ownerId` (string): 应用 owner ID
      - `tags` (array): 应用标签


- `create_app_tag` - [application delivery] Create an application tag
    - **Required parameters**:
      - `organizationId` (string): 组织ID
      - `name` (string): 应用标签名称
      - `color` (string): 标签颜色：#66acab 蓝绿色, #7b9ab4 蓝灰色, #698cd4 明亮的蓝色, #4676e5 强烈的蓝色, #5c68c1 深蓝紫色, #9f76dA 紫色, #6bAe3f 绿色, #ae9e6b 土黄色, #a7bc60 浅绿, #ae785e 棕色, #eb933e 橙色, #d75644 红色


- `create_global_var` - [application delivery] Create a global variable group
    - **Required parameters**:
      - `organizationId` (string): 组织ID
      - `displayName` (string): 全局变量组显示名称
      - `name` (string): 全局变量组名称
    - **Optional parameters**:
      - `content` (array): 变量列表
      - `message` (string): 全局变量组信息
      - `ownerId` (string): 全局变量组拥有者


- `create_variable_group` - [application delivery] Create a variable group
    - **Required parameters**:
      - `organizationId` (string): 组织ID
      - `appName` (string): 应用名
      - `fromRevisionSha` (string): 变量组版本号
    - **Optional parameters**:
      - `branchName` (string): 版本分支，默认 master
      - `displayName` (string): 变量组展示名
      - `message` (string): 变量组描述信息
      - `name` (string): 变量组唯一名
      - `vars` (array): 变量列表


- `create_app_orchestration` - [application delivery] Create an application orchestration
    - **Required parameters**:
      - `organizationId` (string): 组织ID
      - `appName` (string): 应用名
      - `templateId` (string): 编排模板 ID
      - `templateType` (string): 编排模板类型


- `create_appstack_change_request` - [application delivery] Create a change request
    - **Required parameters**:
      - `organizationId` (string): 组织ID
      - `appName` (string): 应用名
      - `appCodeRepoSn` (string): 应用代码仓库标识符
      - `autoDeleteBranchWhenEnd` (boolean): 变更结束时候是否自动删除分支
      - `branchName` (string): 应用代码分支名称
      - `createBranch` (boolean): 是否创建分支
      - `title` (string): 变更标题
    - **Optional parameters**:
      - `ownerAccountId` (string): 变更负责人账号
      - `ownerId` (string): 变更负责人


- `create_change_order` - [application delivery] 创建部署单
    - **Required parameters**:
      - `organizationId` (string): 组织ID
      - `appName` (string): 应用名
      - `changeOrder` (object): No description


- `delete_variable_group` - [application delivery] Delete a variable group
    - **Required parameters**:
      - `organizationId` (string): 组织ID
      - `appName` (string): 应用名
      - `variableGroupName` (string): 变量组名


- `delete_app_orchestration` - [application delivery] Delete an application orchestration
    - **Required parameters**:
      - `organizationId` (string): 组织ID
      - `appName` (string): 应用名
      - `sn` (string): 应用编排唯一序列号


- `execute_job_action` - [application delivery] 操作环境部署单
    - **Required parameters**:
      - `organizationId` (string): 组织ID
      - `appName` (string): 应用名
      - `changeOrderSn` (string): 部署单编号，即 changeOrder.sn
      - `jobSn` (string): 环境部署单编号，即 job.sn
      - `action` (object): No description


- `execute_app_release_stage` - [application delivery] 执行变更请求的发布流程阶段
    - **Required parameters**:
      - `organizationId` (string): 组织ID
      - `appName` (string): 应用名
      - `releaseWorkflowSn` (string): 发布流程唯一序列号
      - `releaseStageSn` (string): 发布流程阶段唯一序列号
      - `execution` (object): No description

### Find

- `find_task_operation_log` - [application delivery] 查询部署任务执行日志，其中通常包含下游部署引擎的调度细节信息
    - **Required parameters**:
      - `organizationId` (string): 组织ID
      - `appName` (string): No description
      - `changeOrderSn` (string): No description
      - `jobSn` (string): No description
      - `stageSn` (string): No description
      - `taskSn` (string): No description

### Generate

- `get_application` - [application delivery] Get application details by name
    - **Required parameters**:
      - `organizationId` (string): 组织id
      - `appName` (string): 应用名


- `get_global_var` - [application delivery] Get a global variable group
    - **Required parameters**:
      - `organizationId` (string): 组织ID
      - `name` (string): 全局变量组名称
    - **Optional parameters**:
      - `revisionSha` (string): 全局变量组版本


- `get_env_variable_groups` - [application delivery] Get variable groups for an environment
    - **Required parameters**:
      - `organizationId` (string): 组织ID
      - `appName` (string): 应用名
      - `envName` (string): 环境名


- `get_variable_group` - [application delivery] Get a variable group
    - **Required parameters**:
      - `organizationId` (string): 组织ID
      - `appName` (string): 应用名
      - `variableGroupName` (string): 变量组名


- `get_app_variable_groups` - [application delivery] Get variable groups for an application
    - **Required parameters**:
      - `organizationId` (string): 组织ID
      - `appName` (string): 应用名


- `get_app_variable_groups_revision` - [application delivery] Get the revision of variable groups for an application
    - **Required parameters**:
      - `organizationId` (string): 组织ID
      - `appName` (string): 应用名


- `get_latest_orchestration` - [application delivery] Get the latest orchestration for an environment
    - **Required parameters**:
      - `organizationId` (string): 组织ID
      - `appName` (string): 应用名
      - `envName` (string): 环境名


- `get_app_orchestration` - [application delivery] Get an application orchestration
    - **Required parameters**:
      - `organizationId` (string): 组织ID
      - `appName` (string): 应用名
      - `sn` (string): 应用编排唯一序列号，未指定 tag 和 sha 时将查找最新版本
    - **Optional parameters**:
      - `tagName` (string): 编排 tag
      - `sha` (string): 编排 commit sha


- `get_appstack_change_request_audit_items` - [application delivery] Get audit items for a change request
    - **Required parameters**:
      - `organizationId` (string): 组织ID
      - `appName` (string): 应用名
      - `sn` (string): 变更标识符
      - `refType` (string): 关联类型


- `get_machine_deploy_log` - [application delivery] Get machine deployment log
    - **Required parameters**:
      - `organizationId` (string): 组织ID
      - `tunnelId` (number): 隧道ID
      - `machineSn` (string): 主机序列号


- `get_change_order` - [application delivery] 读取部署单使用的物料和工单状态
    - **Required parameters**:
      - `organizationId` (string): 组织ID
      - `appName` (string): 应用名
      - `changeOrderSn` (string): 部署单编号


- `get_app_release_workflow_stage` - [application delivery] 获取发布流程阶段详情
    - **Required parameters**:
      - `organizationId` (string): 组织ID
      - `appName` (string): 应用名
      - `releaseWorkflowSn` (string): 研发流程唯一标识符
      - `releaseStageSn` (string): 研发阶段唯一标识符


- `get_app_release_stage_pipeline_run` - [application delivery] 获取研发阶段流水线运行实例
    - **Required parameters**:
      - `organizationId` (string): 组织ID
      - `appName` (string): 应用名
      - `releaseWorkflowSn` (string): 发布流程唯一序列号
      - `releaseStageSn` (string): 发布流程阶段唯一序列号
      - `executionNumber` (string): 发布流程阶执行序号


- `get_app_release_stage_execution_pipeline_job_log` - [application delivery] 查询研发阶段流水线任务运行日志
    - **Required parameters**:
      - `organizationId` (string): 组织ID
      - `appName` (string): 应用名
      - `releaseWorkflowSn` (string): 发布流程唯一序列号
      - `releaseStageSn` (string): 发布流程阶段唯一序列号
      - `executionNumber` (string): 研发阶段的执行记录编号
      - `jobId` (string): 任务ID，可通过GetReleaseStagePipelineRun接口获取任务ID


- `list_applications` - [application delivery] List applications in an organization with pagination
    - **Required parameters**:
      - `organizationId` (string): 组织id
    - **Optional parameters**:
      - `pagination` (string): 分页模式参数，目前只支持键集分页 keyset 模式
      - `perPage` (number): 分页尺寸参数，决定一页最多返回多少对象
      - `orderBy` (string): 分页排序属性，决定根据何种属性进行记录排序；推荐在实现严格遍历时，使用 id 属性
      - `sort` (string): 分页排序为升降序，asc 为升序，desc 为降序；推荐在实现严格遍历时，使用升序
      - `nextToken` (string): 分页 token，获取第一页数据时无需传入，否则需要传入前一页查询结果中的 nextToken 字段


- `list_global_vars` - [application delivery] List global variable groups
    - **Required parameters**:
      - `organizationId` (string): 组织ID
      - `current` (number): 当前页码
      - `pageSize` (number): 每页大小
    - **Optional parameters**:
      - `search` (string): 查询关键字


- `list_app_orchestration` - [application delivery] List application orchestrations
    - **Required parameters**:
      - `organizationId` (string): 组织ID
      - `appName` (string): 应用名


- `list_appstack_change_request_executions` - [application delivery] List change request executions
    - **Required parameters**:
      - `organizationId` (string): 组织ID
      - `appName` (string): 应用名
      - `sn` (string): 变更标识符
      - `releaseWorkflowSn` (string): 流程唯一标识
      - `releaseStageSn` (string): 阶段唯一标识
    - **Optional parameters**:
      - `perPage` (number): 分页尺寸参数，决定一页最多返回多少对象
      - `page` (number): 页面分页时使用，用于获取下一页内容，默认第1页
      - `orderBy` (string): 分页排序属性，决定根据何种属性进行记录排序；推荐在实现严格遍历时，使用 id 属性
      - `sort` (string): 分页排序升降序，asc 为升序，desc 为降序；推荐在实现严格遍历时，使用升序


- `list_appstack_change_request_work_items` - [application delivery] List work items for a change request
    - **Required parameters**:
      - `organizationId` (string): 组织ID
      - `appName` (string): 应用名
      - `sn` (string): 变更标识符


- `list_change_order_versions` - [application delivery] 查看部署单版本列表
    - **Required parameters**:
      - `organizationId` (string): 组织ID
      - `appName` (string): 应用名
    - **Optional parameters**:
      - `envNames` (array): 环境标识列表，如不需按环境过滤，请置空
      - `creators` (array): 创建人云效账号id列表，如不需按创建人过滤，请置空
      - `current` (number): 当前页号（从 1 开始，默认取 1）
      - `pageSize` (number): 分页记录数（默认 10 条）


- `list_change_order_job_logs` - [application delivery] 查询环境部署单日志
    - **Required parameters**:
      - `organizationId` (string): 组织ID
      - `appName` (string): 应用名
      - `changeOrderSn` (string): 部署单号
      - `jobSn` (string): 作业单号
    - **Optional parameters**:
      - `current` (number): No description
      - `pageSize` (number): No description


- `list_change_orders_by_origin` - [application delivery] 根据创建来源查询部署单
    - **Required parameters**:
      - `organizationId` (string): 组织ID
      - `originType` (string): 创建来源类型
      - `originId` (string): 创建来源标识
    - **Optional parameters**:
      - `appName` (string): 应用名
      - `envName` (string): 环境名


- `list_app_release_workflows` - [application delivery] 查询应用下所有发布流程
    - **Required parameters**:
      - `organizationId` (string): 组织ID
      - `appName` (string): 应用名


- `list_app_release_workflow_briefs` - [application delivery] 查询应用下所有发布流程摘要
    - **Required parameters**:
      - `organizationId` (string): 组织ID
      - `appName` (string): 应用名


- `list_app_release_stage_briefs` - [application delivery] 查询发布流程阶段摘要列表
    - **Required parameters**:
      - `organizationId` (string): 组织ID
      - `appName` (string): 应用名
      - `releaseWorkflowSn` (string): 研发流程唯一标识符


- `list_app_release_stage_runs` - [application delivery] 查询发布流程阶段执行记录列表
    - **Required parameters**:
      - `organizationId` (string): 组织ID
      - `appName` (string): 应用名
      - `releaseWorkflowSn` (string): 发布流程唯一序列号
      - `releaseStageSn` (string): 发布流程阶段唯一序列号
    - **Optional parameters**:
      - `pagination` (string): 分页模式参数：keyset表示键集分页，不传表示页码分页
      - `perPage` (number): 分页尺寸参数，决定一页最多返回多少对象
      - `orderBy` (string): 分页排序属性，决定根据何种属性进行记录排序；推荐在实现严格遍历时，使用 id 属性
      - `sort` (string): 分页排序升降序，asc 为升序，desc 为降序；推荐在实现严格遍历时，使用升序
      - `nextToken` (string): 键集分页 token，获取第一页数据时无需传入，否则需要传入前一页查询结果中的 nextToken 字段
      - `page` (number): 页码分页时使用，用于获取下一页内容


- `list_app_release_stage_execution_integrated_metadata` - [application delivery] 查询研发阶段执行记录集成变更信息
    - **Required parameters**:
      - `organizationId` (string): 组织ID
      - `appName` (string): 应用名
      - `releaseWorkflowSn` (string): 发布流程唯一序列号
      - `releaseStageSn` (string): 发布流程阶段唯一序列号
      - `executionNumber` (string): 研发阶段的执行记录编号


- `pass_app_release_stage_pipeline_validate` - [application delivery] 通过发布流程阶段验证
    - **Required parameters**:
      - `organizationId` (string): 组织ID
      - `appName` (string): 应用名
      - `releaseWorkflowSn` (string): 发布流程唯一序列号
      - `releaseStageSn` (string): 发布流程阶段唯一序列号
      - `executionNumber` (string): 发布流程阶执行序号
      - `jobId` (string): 任务ID

### Refuse

- `refuse_app_release_stage_pipeline_validate` - [application delivery] 拒绝发布流程阶段验证
    - **Required parameters**:
      - `organizationId` (string): 组织ID
      - `appName` (string): 应用名
      - `releaseWorkflowSn` (string): 研发流程唯一序列号
      - `releaseStageSn` (string): 研发流程阶段唯一序列号
      - `executionNumber` (string): 研发流程阶执行序号
      - `jobId` (string): 任务ID

### Resume

- `retry_app_release_stage_pipeline` - [application delivery] 重试变更请求的发布流程阶段流水线
    - **Required parameters**:
      - `organizationId` (string): 组织ID
      - `appName` (string): 应用名
      - `releaseWorkflowSn` (string): 发布流程唯一序列号
      - `releaseStageSn` (string): 发布流程阶段唯一序列号
      - `executionNumber` (string): 发布流程阶执行序号

### Search Operations

- `search_app_tags` - [application delivery] Search application tags
    - **Required parameters**:
      - `organizationId` (string): 组织ID
    - **Optional parameters**:
      - `current` (number): 页数，从1开始。默认值为1
      - `pageSize` (number): 本页返回的数量，默认值为10
      - `orderBy` (string): 排序方式，支持tagName和id，默认为id
      - `sort` (string): 排序方式，支持asc和desc，默认为desc
      - `search` (string): 应用标签名称的模糊搜索


- `search_app_templates` - [application delivery] Search application templates
    - **Required parameters**:
      - `organizationId` (string): 组织ID
    - **Optional parameters**:
      - `pagination` (string): 分页模式参数，目前只支持键集分页 keyset 模式
      - `perPage` (number): 分页尺寸参数，决定一页最多返回多少对象
      - `orderBy` (string): 分页排序属性，决定根据何种属性进行记录排序；推荐在实现严格遍历时，使用 id 属性
      - `sort` (string): 分页排序升降序，asc 为升序，desc 为降序；推荐在实现严格遍历时，使用升序
      - `nextToken` (string): 键集分页 token，获取第一页数据时无需传入，否则需要传入前一页查询结果中的 nextToken 字段
      - `displayNameKeyword` (string): 按展示名进行模糊搜索的关键字
      - `page` (number): 页码分页时使用，用于获取下一页内容


- `skip_app_release_stage_pipeline` - [application delivery] 跳过变更请求的发布流程阶段流水线
    - **Required parameters**:
      - `organizationId` (string): 组织ID
      - `appName` (string): 应用名
      - `releaseWorkflowSn` (string): 发布流程唯一序列号
      - `releaseStageSn` (string): 发布流程阶段唯一序列号
      - `executionNumber` (string): 发布流程阶执行序号

### Smart

- `update_application` - [application delivery] Update an existing application
    - **Required parameters**:
      - `organizationId` (string): 组织id
      - `appName` (string): 应用名
    - **Optional parameters**:
      - `ownerId` (string): 应用 owner ID


- `update_app_tag` - [application delivery] Update an application tag
    - **Required parameters**:
      - `organizationId` (string): 组织ID
      - `name` (string): 应用标签名称
      - `newName` (string): 要修改为的新的应用标签名称，如无需修改，请确保与原name相同
    - **Optional parameters**:
      - `color` (string): 应用标签颜色：#66acab 蓝绿色, #7b9ab4 蓝灰色, #698cd4 明亮的蓝色, #4676e5 强烈的蓝色, #5c68c1 深蓝紫色, #9f76dA 紫色, #6bAe3f 绿色, #ae9e6b 土黄色, #a7bc60 浅绿, #ae785e 棕色, #eb933e 橙色, #d75644 红色。若不填写则保持原有颜色不变


- `update_app_tag_bind` - [application delivery] Update application tag bindings
    - **Required parameters**:
      - `organizationId` (string): 组织ID
      - `appName` (string): 应用名
      - `tagNames` (array): 要绑定的应用标签名称列表。注意：tagNames中不存在的应用标签将被忽略。如果tagNames中的所有应用标签都不存在，或者tagNames为空数组，则会清空当前应用的应用标签列表


- `update_global_var` - [application delivery] Update a global variable group
    - **Required parameters**:
      - `organizationId` (string): 组织ID
      - `name` (string): 全局变量组名称
      - `content` (array): 变量列表
      - `fromRevisionSha` (string): 更新源版本信息
    - **Optional parameters**:
      - `message` (string): 全局变量组信息


- `update_variable_group` - [application delivery] Update a variable group
    - **Required parameters**:
      - `organizationId` (string): 组织ID
      - `appName` (string): 应用名
      - `variableGroupName` (string): 变量组名
      - `fromRevisionSha` (string): 变量组版本号
    - **Optional parameters**:
      - `branchName` (string): 版本分支，默认 master
      - `displayName` (string): 变量组展示名
      - `message` (string): 变量组描述信息
      - `name` (string): 变量组唯一名
      - `vars` (array): 变量列表


- `update_app_orchestration` - [application delivery] Update an application orchestration
    - **Required parameters**:
      - `organizationId` (string): 组织ID
      - `appName` (string): 应用名
      - `sn` (string): 应用编排唯一序列号
      - `name` (string): 编排名
    - **Optional parameters**:
      - `branchName` (string): 本次提交的编排分支，不填写则使用默认主干
      - `commitMessage` (string): 本次提交的描述信息
      - `description` (string): 编排描述
      - `fromRevisionSha` (string): 本次提交的基线版本 SHA 值
      - `spec` (object): 编排规范


- `update_app_release_stage` - [application delivery] 更新应用发布流程阶段
    - **Required parameters**:
      - `organizationId` (string): 组织ID
      - `appName` (string): 应用名
      - `releaseWorkflowSn` (string): 发布流程唯一序列号
      - `releaseStageSn` (string): 发布流程阶段唯一序列号
      - `stage` (object): No description
