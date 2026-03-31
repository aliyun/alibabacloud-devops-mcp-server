---
name: alibabacloud-devops
description: 阿里云云效 DevOps 平台 MCP Server，提供代码管理、项目管理、流水线、应用交付、测试管理等全面的 DevOps 能力
---

# 阿里云云效 DevOps MCP Server

这是阿里云云效 DevOps 平台的 MCP Server Skill，提供全面的 DevOps 工具集，包括代码管理、项目管理、流水线管理、应用交付、制品管理和测试管理等能力。

## 渐进式披露模式

本 Skill 采用渐进式披露模式，按需获取工具详情和调用工具。

### 查看工具列表和参数

获取所有工具及其详细参数信息：

```bash
npx -y mcporter list --stdio "npx -y alibabacloud-devops-mcp-server" --schema
```

如果已配置服务器，也可以直接使用：
```bash
npx -y mcporter list yunxiao --schema
```

### 调用工具

使用 key:value 或 key=value 格式传递参数：

```bash
npx -y mcporter call --stdio "npx -y alibabacloud-devops-mcp-server" <tool_name> param1:"value1" param2:"value2"
```

示例：
```bash
npx -y mcporter call --stdio "npx -y alibabacloud-devops-mcp-server" list_repositories organizationId:"your-org-id"
```

### 环境变量配置

MCP Server 需要配置以下环境变量：
- `YUNXIAO_ACCESS_TOKEN`: 云效访问令牌（必需）

可通过 `--env` 参数传递：
```bash
npx -y mcporter call --stdio "npx -y alibabacloud-devops-mcp-server" --env YUNXIAO_ACCESS_TOKEN=your-token <tool_name> ...
```

---

## 工具列表

共 165 个工具，按功能分类如下：

### 基础工具（Base）

| 工具名 | 描述 |
|--------|------|
| `get_current_organization_info` | 获取当前用户和组织信息（基于 token） |
| `get_user_organizations` | 获取当前用户所属的组织列表 |
| `get_current_user` | 获取当前用户信息（基于 token） |

### 代码管理（Code Management）

#### 分支管理

| 工具名 | 描述 |
|--------|------|
| `create_branch` | 创建代码仓库分支 |
| `get_branch` | 获取分支信息 |
| `delete_branch` | 删除分支 |
| `list_branches` | 列出仓库所有分支 |

#### 文件操作

| 工具名 | 描述 |
|--------|------|
| `get_file_blobs` | 获取文件内容 |
| `create_file` | 创建新文件 |
| `update_file` | 更新文件内容 |
| `delete_file` | 删除文件 |
| `list_files` | 列出目录下的文件 |
| `compare` | 代码比较 |

#### 仓库管理

| 工具名 | 描述 |
|--------|------|
| `get_repository` | 获取仓库详情 |
| `list_repositories` | 列出代码仓库 |

#### 变更请求（Merge Request）

| 工具名 | 描述 |
|--------|------|
| `get_change_request` | 获取变更请求详情 |
| `list_change_requests` | 列出变更请求 |
| `create_change_request` | 创建变更请求 |
| `create_change_request_comment` | 创建变更请求评论 |
| `list_change_request_comments` | 列出变更请求评论 |
| `update_change_request_comment` | 更新变更请求评论 |
| `list_change_request_patch_sets` | 列出变更请求的补丁集 |

#### 提交记录

| 工具名 | 描述 |
|--------|------|
| `list_commits` | 列出提交记录 |
| `get_commit` | 获取提交详情 |
| `create_commit_comment` | 创建提交评论 |

### 组织管理（Organization）

#### 部门管理

| 工具名 | 描述 |
|--------|------|
| `list_organization_departments` | 列出组织部门 |
| `get_organization_department_info` | 获取部门信息 |
| `get_organization_department_ancestors` | 获取部门的上级部门链 |

#### 成员管理

| 工具名 | 描述 |
|--------|------|
| `list_organization_members` | 列出组织成员 |
| `get_organization_member_info` | 获取成员信息 |
| `get_organization_member_info_by_user_id` | 通过用户 ID 获取成员信息 |
| `search_organization_members` | 搜索组织成员 |

#### 角色管理

| 工具名 | 描述 |
|--------|------|
| `list_organization_roles` | 列出组织角色 |
| `get_organization_role` | 获取角色详情 |

### 项目管理（Project Management）

#### 项目与项目集

| 工具名 | 描述 |
|--------|------|
| `get_project` | 获取项目详情 |
| `search_projects` | 搜索项目 |
| `search_programs` | 搜索项目集 |
| `list_program_versions` | 列出项目集版本 |

#### 版本管理

| 工具名 | 描述 |
|--------|------|
| `list_versions` | 列出版本 |
| `create_version` | 创建版本 |
| `update_version` | 更新版本 |
| `delete_version` | 删除版本 |

#### 迭代管理

| 工具名 | 描述 |
|--------|------|
| `get_sprint` | 获取迭代详情 |
| `list_sprints` | 列出迭代 |
| `create_sprint` | 创建迭代 |
| `update_sprint` | 更新迭代 |

#### 工作项管理

| 工具名 | 描述 |
|--------|------|
| `get_work_item` | 获取工作项详情 |
| `create_work_item` | 创建工作项 |
| `search_workitems` | 搜索工作项 |
| `update_work_item` | 更新工作项 |
| `get_work_item_types` | 获取工作项类型列表 |
| `list_all_work_item_types` | 列出所有工作项类型 |
| `list_work_item_types` | 列出工作项类型 |
| `get_work_item_type` | 获取工作项类型详情 |
| `list_work_item_relation_work_item_types` | 列出工作项关联的工作项类型 |
| `get_work_item_type_field_config` | 获取工作项类型字段配置 |
| `get_work_item_workflow` | 获取工作项工作流 |
| `list_work_item_comments` | 列出工作项评论 |
| `create_work_item_comment` | 创建工作项评论 |
| `list_workitem_attachments` | 列出工作项附件 |
| `get_workitem_file` | 获取工作项附件文件 |
| `create_workitem_attachment` | 创建工作项附件 |

#### 工时管理

| 工具名 | 描述 |
|--------|------|
| `list_current_user_effort_records` | 列出当前用户的工时记录 |
| `list_effort_records` | 列出工时记录 |
| `create_effort_record` | 创建工时记录 |
| `update_effort_record` | 更新工时记录 |
| `list_estimated_efforts` | 列出预估工时 |
| `create_estimated_effort` | 创建预估工时 |
| `update_estimated_effort` | 更新预估工时 |

### 流水线管理（Pipeline）

#### 流水线基础操作

| 工具名 | 描述 |
|--------|------|
| `get_pipeline` | 获取流水线详情 |
| `list_pipelines` | 列出流水线 |
| `smart_list_pipelines` | 智能搜索流水线（支持自然语言时间） |
| `update_pipeline` | 更新流水线配置 |

#### 流水线生成

| 工具名 | 描述 |
|--------|------|
| `generate_pipeline_yaml` | 生成流水线 YAML 配置 |
| `create_pipeline_from_description` | 根据描述创建流水线 |

#### 流水线运行

| 工具名 | 描述 |
|--------|------|
| `create_pipeline_run` | 运行流水线 |
| `get_latest_pipeline_run` | 获取最近一次运行记录 |
| `get_pipeline_run` | 获取运行记录详情 |
| `list_pipeline_runs` | 列出运行记录 |

#### 流水线任务

| 工具名 | 描述 |
|--------|------|
| `list_pipeline_jobs_by_category` | 按类别列出流水线任务 |
| `list_pipeline_job_historys` | 列出任务执行历史 |
| `execute_pipeline_job_run` | 手动执行流水线任务 |
| `get_pipeline_job_run_log` | 获取任务执行日志 |

#### 服务连接

| 工具名 | 描述 |
|--------|------|
| `list_service_connections` | 列出服务连接 |

### 资源成员管理（Resource Member）

| 工具名 | 描述 |
|--------|------|
| `list_resource_members` | 列出资源成员 |
| `create_resource_member` | 添加资源成员 |
| `update_resource_member` | 更新资源成员 |
| `delete_resource_member` | 删除资源成员 |
| `update_resource_owner` | 转让资源所有者 |

### 主机部署（VM Deploy）

| 工具名 | 描述 |
|--------|------|
| `get_vm_deploy_order` | 获取主机部署单详情 |
| `stop_vm_deploy_order` | 停止主机部署 |
| `resume_vm_deploy_order` | 恢复主机部署 |
| `skip_vm_deploy_machine` | 跳过指定机器部署 |
| `retry_vm_deploy_machine` | 重试指定机器部署 |
| `get_vm_deploy_machine_log` | 获取机器部署日志 |

### 制品管理（Packages）

| 工具名 | 描述 |
|--------|------|
| `list_package_repositories` | 列出制品仓库 |
| `list_artifacts` | 列出制品 |
| `get_artifact` | 获取制品详情 |

### 应用交付（Application Delivery）

#### 应用管理

| 工具名 | 描述 |
|--------|------|
| `list_applications` | 列出应用 |
| `get_application` | 获取应用详情 |
| `create_application` | 创建应用 |
| `update_application` | 更新应用 |

#### 应用标签

| 工具名 | 描述 |
|--------|------|
| `create_app_tag` | 创建应用标签 |
| `update_app_tag` | 更新应用标签 |
| `search_app_tags` | 搜索应用标签 |
| `update_app_tag_bind` | 更新应用标签绑定 |

#### 应用模板

| 工具名 | 描述 |
|--------|------|
| `search_app_templates` | 搜索应用模板 |

#### 全局变量

| 工具名 | 描述 |
|--------|------|
| `create_global_var` | 创建全局变量组 |
| `get_global_var` | 获取全局变量组 |
| `update_global_var` | 更新全局变量组 |
| `list_global_vars` | 列出全局变量组 |

#### 变量组管理

| 工具名 | 描述 |
|--------|------|
| `get_env_variable_groups` | 获取环境变量组 |
| `create_variable_group` | 创建变量组 |
| `delete_variable_group` | 删除变量组 |
| `get_variable_group` | 获取变量组 |
| `update_variable_group` | 更新变量组 |
| `get_app_variable_groups` | 获取应用变量组 |
| `get_app_variable_groups_revision` | 获取应用变量组版本 |

#### 编排管理

| 工具名 | 描述 |
|--------|------|
| `get_latest_orchestration` | 获取最新编排 |
| `list_app_orchestration` | 列出应用编排 |
| `create_app_orchestration` | 创建应用编排 |
| `delete_app_orchestration` | 删除应用编排 |
| `get_app_orchestration` | 获取应用编排 |
| `update_app_orchestration` | 更新应用编排 |

#### 变更请求

| 工具名 | 描述 |
|--------|------|
| `create_appstack_change_request` | 创建变更请求 |
| `get_appstack_change_request_audit_items` | 获取变更请求审批项 |
| `list_appstack_change_request_executions` | 列出变更请求执行记录 |
| `list_appstack_change_request_work_items` | 列出变更请求关联的工作项 |
| `cancel_appstack_change_request` | 取消变更请求 |
| `close_appstack_change_request` | 关闭变更请求 |

#### 部署管理

| 工具名 | 描述 |
|--------|------|
| `get_machine_deploy_log` | 获取机器部署日志 |
| `add_host_list_to_host_group` | 添加主机到主机组 |
| `add_host_list_to_deploy_group` | 添加主机到部署组 |

#### 部署单管理

| 工具名 | 描述 |
|--------|------|
| `create_change_order` | 创建部署单 |
| `list_change_order_versions` | 查看部署单版本列表 |
| `get_change_order` | 获取部署单详情 |
| `list_change_order_job_logs` | 查询部署单日志 |
| `find_task_operation_log` | 查询部署任务执行日志 |
| `execute_job_action` | 操作部署单 |
| `list_change_orders_by_origin` | 根据来源查询部署单 |

#### 发布流程管理

| 工具名 | 描述 |
|--------|------|
| `list_app_release_workflows` | 查询应用发布流程 |
| `list_app_release_workflow_briefs` | 查询发布流程摘要 |
| `get_app_release_workflow_stage` | 获取发布流程阶段详情 |
| `list_app_release_stage_briefs` | 查询发布阶段摘要列表 |
| `update_app_release_stage` | 更新发布流程阶段 |
| `list_app_release_stage_runs` | 查询发布阶段执行记录 |
| `execute_app_release_stage` | 执行发布流程阶段 |
| `cancel_app_release_stage_execution` | 取消发布阶段执行 |
| `retry_app_release_stage_pipeline` | 重试发布阶段流水线 |
| `skip_app_release_stage_pipeline` | 跳过发布阶段流水线 |
| `list_app_release_stage_metadata` | 查询发布阶段集成变更信息 |
| `get_app_release_stage_pipeline_run` | 获取发布阶段流水线运行实例 |
| `pass_app_release_stage_validate` | 通过发布阶段验证 |
| `get_app_release_stage_job_log` | 查询发布阶段任务日志 |
| `refuse_app_release_stage_validate` | 拒绝发布阶段验证 |

### 测试管理（Test Management）

#### 测试用例

| 工具名 | 描述 |
|--------|------|
| `list_testcase_directories` | 获取测试用例目录列表 |
| `create_testcase_directory` | 创建测试用例目录 |
| `get_testcase_field_config` | 获取测试用例字段配置 |
| `create_testcase` | 创建测试用例 |
| `search_testcases` | 搜索测试用例 |
| `get_testcase` | 获取测试用例信息 |
| `delete_testcase` | 删除测试用例 |

#### 测试计划

| 工具名 | 描述 |
|--------|------|
| `list_test_plans` | 获取测试计划列表 |
| `get_test_result_list` | 获取测试计划中的用例列表 |
| `update_test_result` | 更新测试结果 |

---

## 常见工作流示例

### 1. 代码审查工作流

查看待审核的变更请求并添加评论：

```bash
# 1. 获取当前组织信息
npx -y mcporter call --stdio "npx -y alibabacloud-devops-mcp-server" get_current_organization_info

# 2. 列出待审核的变更请求
npx -y mcporter call --stdio "npx -y alibabacloud-devops-mcp-server" list_change_requests organizationId:"your-org-id" repositoryId:"your-repo-id" state:"opened"

# 3. 获取变更请求详情
npx -y mcporter call --stdio "npx -y alibabacloud-devops-mcp-server" get_change_request organizationId:"your-org-id" repositoryId:"your-repo-id" localId:"123"

# 4. 添加审查评论
npx -y mcporter call --stdio "npx -y alibabacloud-devops-mcp-server" create_change_request_comment organizationId:"your-org-id" repositoryId:"your-repo-id" localId:"123" commentType:"GLOBAL_COMMENT" content:"LGTM! Code looks good."
```

### 2. 流水线运行工作流

运行流水线并查看执行结果：

```bash
# 1. 列出可用的流水线
npx -y mcporter call --stdio "npx -y alibabacloud-devops-mcp-server" list_pipelines organizationId:"your-org-id"

# 2. 运行流水线（使用指定分支）
npx -y mcporter call --stdio "npx -y alibabacloud-devops-mcp-server" create_pipeline_run organizationId:"your-org-id" pipelineId:"123456" branch:"main"

# 3. 获取最近一次运行状态
npx -y mcporter call --stdio "npx -y alibabacloud-devops-mcp-server" get_latest_pipeline_run organizationId:"your-org-id" pipelineId:"123456"

# 4. 查看任务执行日志
npx -y mcporter call --stdio "npx -y alibabacloud-devops-mcp-server" get_pipeline_job_run_log organizationId:"your-org-id" pipelineId:"123456" pipelineRunId:"789" jobId:"job-1"
```

### 3. 项目管理工作流

创建工作项并跟踪进度：

```bash
# 1. 搜索项目
npx -y mcporter call --stdio "npx -y alibabacloud-devops-mcp-server" search_projects organizationId:"your-org-id" keyword:"my-project"

# 2. 创建工作项（需求/任务/缺陷）
npx -y mcporter call --stdio "npx -y alibabacloud-devops-mcp-server" create_work_item organizationId:"your-org-id" workitemTypeId:"type-id" subject:"实现新功能"

# 3. 搜索工作项
npx -y mcporter call --stdio "npx -y alibabacloud-devops-mcp-server" search_workitems organizationId:"your-org-id" projectId:"project-id"

# 4. 更新工作项状态
npx -y mcporter call --stdio "npx -y alibabacloud-devops-mcp-server" update_work_item organizationId:"your-org-id" workitemId:"workitem-id" updateType:"STATUS"
```

---

## 相关资源

- [云效官方文档](https://help.aliyun.com/product/153China)
- [云效 API 文档](https://help.aliyun.com/document_detail/China)
