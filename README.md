<p align="center">English | <a href="README.zh-cn.md">中文</a><br></p>

# alibabacloud-devops-mcp-server

[AlibabaCloud Devops](https://www.aliyun.com/product/yunxiao) MCP Server provides AI assistants with the ability to interact with the Yunxiao platform, enabling them to read work item contents in projects, automatically write code after understanding requirements, and submit code merge requests. Enterprise development teams can use it to assist with code reviews, optimize task management, reduce repetitive operations, and thus focus on more important innovation and product delivery.

## Features

alibabacloud-devops-mcp-server provides the following capabilities for AI assistants:

- `organization-management`: Organization management tools (organization list, organization details, department information, organizational roles, member information, etc.)
- `code-management`: Code repository management tools (repository management, branch management, merge request management, file tree, etc.)
- `project-management`: Project management tools (project management, work item management, work item fields, work item comments, time tracking, etc.)
- `pipeline-management`: Pipeline management tools (pipeline list, pipeline configuration, resource management, tag management, deployment management, etc.)
- `application-delivery`: Application delivery tools (deployment order management, application management, application tags, variable group management, etc.)
- `packages-management`: Artifact repository management tools (artifact repositories, artifact lists, etc.)
- `test-management`: Test management tools (test case management, test case directories, test plans, test results, etc.)


## Usage

### Region Edition Support

This tool supports both Yunxiao central station and Region edition deployment modes:

- **Central Station**: Uses `https://openapi-rdc.aliyuncs.com` as the API domain
- **Region Edition**: Uses organization-specific domains, such as `https://your-org.devops.aliyuncs.com`

#### Automatic Mode Detection

The tool automatically determines the deployment mode based on the configured API base URL:

- If the URL contains `openapi-rdc.aliyuncs.com`, it operates in central station mode
- Otherwise, it operates in region edition mode

#### Configuring Region Edition

When using a Region edition, set the `YUNXIAO_API_BASE_URL` environment variable:

```json
{
  "mcpServers": {
    "yunxiao": {
      "command": "npx",
      "args": ["-y", "alibabacloud-devops-mcp-server"],
      "env": {
        "YUNXIAO_ACCESS_TOKEN": "<YOUR_TOKEN>",
        "YUNXIAO_API_BASE_URL": "https://your-org.devops.aliyuncs.com"
      }
    }
  }
}
```

### Prerequisites
* node version >= 18.0.0
* [AlibabaCloud Devops](https://www.aliyun.com/product/yunxiao) Personal Access Token, [click here to obtain](https://help.aliyun.com/zh/yunxiao/developer-reference/obtain-personal-access-token). Grant read and write permissions to all APIs under organization management, project collaboration, code management, pipeline management, artifact repository management, application delivery and testing management.

  ![The personal token authorization page](https://agent-install-beijing.oss-cn-beijing.aliyuncs.com/alibabacloud-devops-mcp-server/img_8.jpg)

## Quick Start (Recommended: Using Stdio Mode)

**Stdio mode** is the simplest and most common way, suitable for most MCP clients (like Cursor, Claude Desktop, iFlow, etc.). No Docker installation required, just run via npx.

### Option 1: Direct Use via NPX (Simplest)

Add the following configuration to your MCP client configuration file:

```json
{
  "mcpServers": {
    "yunxiao": {
      "command": "npx",
      "args": [
        "-y",
        "alibabacloud-devops-mcp-server"
      ],
      "env": {
        "YUNXIAO_ACCESS_TOKEN": "<YOUR_TOKEN>"
      }
    }
  }
}
```

> **Note**: 
> - Replace `<YOUR_TOKEN>` with your Yunxiao access token
> - The `-y` flag automatically confirms installation without manual confirmation
> - By default the tool calls the Yunxiao Central Station OpenAPI (`https://openapi-rdc.aliyuncs.com`); no extra configuration is required
> - If you are on a **Region edition** (organization-specific domain), set an additional environment variable `YUNXIAO_API_BASE_URL` to your Yunxiao instance URL, e.g. `https://your-org.devops.aliyuncs.com`. See the [Configuring Region Edition](#configuring-region-edition) section above for details
> - This method uses **stdio mode**, communicating with the MCP client via standard input/output

### Option 2: Install via MCP Marketplace

The MCP market built into Lingma (AlibabaCloud Tongyi Lingma) has already provided the AlibabaCloud Devops MCP service. To install it, simply enter the MCP market in Lingma and search for "Yunxiao DevOps", then click install.

---

## Using Docker (Optional)

### Transport Modes

| Mode | CLI Flag | Env Variable | Endpoints |
|------|----------|-------------|----------|
| Stdio | *(default)* | — | stdin/stdout |
| SSE | `--sse` | `MCP_TRANSPORT=sse` | `/sse` + `/messages` |
| Streamable HTTP | `--streamable-http` | `MCP_TRANSPORT=streamable-http` | `/mcp` |
| Both | `--sse --streamable-http` | `MCP_TRANSPORT=both` | `/sse` + `/mcp` |

> Streamable HTTP is the MCP specification's recommended remote transport. SSE is legacy; use `both` during migration.

### 1. Pull Image

```shell
docker pull build-steps-public-registry.cn-beijing.cr.aliyuncs.com/build-steps/alibabacloud-devops-mcp-server:latest
```

> Self-built: `docker build -t alibabacloud/alibabacloud-devops-mcp-server .`

### 2. Start Server

**Stdio:**
```shell
docker run -i --rm -e YUNXIAO_ACCESS_TOKEN \
  build-steps-public-registry.cn-beijing.cr.aliyuncs.com/build-steps/alibabacloud-devops-mcp-server:latest
```

**SSE / Streamable HTTP / Both** — set `MCP_TRANSPORT` and expose `PORT`:
```shell
docker run -d --name yunxiao-mcp -p 3000:3000 \
  -e YUNXIAO_ACCESS_TOKEN="your_token" -e PORT=3000 \
  -e MCP_TRANSPORT=streamable-http \   # sse | streamable-http | both
  build-steps-public-registry.cn-beijing.cr.aliyuncs.com/build-steps/alibabacloud-devops-mcp-server:latest
```

Optional Streamable HTTP env vars:
- **`MCP_STREAMABLE_PATH`**: MCP endpoint path (default `/mcp`)
- **`MCP_HTTP_HOST`**: Bind host (default `0.0.0.0`)
- **`MCP_ALLOWED_HOSTS`**: Allowed `Host` header values (comma-separated)

### 3. Configure MCP Client

**Stdio:**
```json
{
  "mcpServers": {
    "yunxiao": {
      "command": "docker",
      "args": ["run", "-i", "--rm", "-e", "YUNXIAO_ACCESS_TOKEN", "build-steps-public-registry.cn-beijing.cr.aliyuncs.com/build-steps/alibabacloud-devops-mcp-server:latest"],
      "env": { "YUNXIAO_ACCESS_TOKEN": "<YOUR_TOKEN>" }
    }
  }
}
```

**SSE:** `http://localhost:3000/sse`

**Streamable HTTP:** `http://localhost:3000/mcp`

Pass credentials via query parameter or header:
```
http://localhost:3000/mcp?yunxiao_access_token=YOUR_TOKEN_HERE
```
Or request header: `x-yunxiao-token: YOUR_TOKEN_HERE`

Region / instance OpenAPI base:
```
http://localhost:3000/mcp?yunxiao_access_token=TOKEN&yunxiao_api_base_url=https%3A%2F%2Fyour-org.devops.aliyuncs.com
```
Or request header: `x-yunxiao-api-base-url: https://your-org.devops.aliyuncs.com`

### Docker Compose

```shell
cp .env.example .env   # set YUNXIAO_ACCESS_TOKEN
docker compose up -d
```

Client URL: `http://localhost:3000/sse` (SSE) or `http://localhost:3000/mcp` (Streamable HTTP)

### Toolsets
The server now supports toolsets, allowing you to enable only the tools you need. This can reduce the number of tools presented to the AI assistant and improve performance.

Available toolsets:
- `organization-management`: Organization management tools (organization list, organization details, department information, organizational roles, member information, etc.)
- `code-management`: Code repository management tools (repository management, branch management, merge request management, file tree, etc.)
- `project-management`: Project management tools (project management, work item management, work item fields, work item comments, time tracking, etc.)
- `pipeline-management`: Pipeline management tools (pipeline list, pipeline configuration, resource management, tag management, deployment management, etc.)
- `packages-management`: Artifact repository management tools (artifact repositories, artifact lists, etc.)
- `application-delivery`: Application delivery tools (deployment order management, application management, application tags, variable group management, etc.)
- `test-management`: Test management tools (test case management, test case directories, test plans, test results, etc.)

To use toolsets, you can specify them via command line arguments or environment variables:

1. Via command line argument:
```bash
npx -y alibabacloud-devops-mcp-server --toolsets=code-management,project-management
```

2. Via environment variable:
```bash
DEVOPS_TOOLSETS=code-management,project-management npx -y alibabacloud-devops-mcp-server
```

If no toolsets are specified, all tools will be enabled by default.

## Tools

alibabacloud-devops-mcp-server integrates various tools, including:

### Organization Management

- `get_current_organization_Info`: Get current user's organization information
- `get_user_organizations`: Get the list of organizations the current user has joined
- `get_organization_role`: Get information about an organization role
- `get_organization_departments`: Get the list of departments in an organization
- `get_organization_department_info`: Get information about a department in an organization
- `get_organization_department_ancestors`: Get the ancestors of a department in an organization
- `get_organization_members`: Get the list of members in an organization
- `get_organization_member_info`: Get information about a member in an organization
- `get_organization_member_info_by_user_id`: Get information about a member in an organization by user ID
- `search_organization_members`: Search for organization members
- `list_organization_roles`: List organization roles
- `get_organization_role`: Get information about an organization role

### Code Management Tools

- `create_branch`: Create a branch
- `delete_branch`: Delete a branch
- `get_branch`: Get branch information
- `list_branches`: Get branch list
- `create_file`: Create a file
- `delete_file`: Delete a file
- `get_file_blobs`: Get file content
- `list_files`: Query file tree
- `update_file`: Update file content
- `create_change_request`: Create a merge request
- `create_change_request_comment`: Create a comment on a merge request
- `get_change_request`: Query merge request
- `list_change_request_patch_sets`: Query merge request version list
- `list_change_request`: Query merge request list
- `list_change_request_comments`: Query merge request comment list
- `get_compare`: Compare code
- `get_repository`: Get repository details
- `list_repositories`: Get repository list
- `list_commits`: [Code Management] List commits in a repository
- `get_commit`: [Code Management] Get commit details
- `create_commit_comment`: [Code Management] Create a comment on a commit

### Project Management Tools

- `get_project`: Get project details
- `search_projects`: Search projects
- `get_sprint`: Get sprint details
- `list_sprints`: List sprints in a project
- `create_sprint`: [Project Management] Create a sprint
- `update_sprint`: [Project Management] Update a sprint
- `search_programs`: [Project Management] Search for programs
- `list_program_versions`: [Project Management] List program versions
- `list_versions`: [Project Management] List project versions
- `create_version`: [Project Management] Create a version
- `update_version`: [Project Management] Update a version
- `delete_version`: [Project Management] Delete a version
- `get_work_item`: Get work item details
- `update_work_item`: [Project Management] Update a work item
- `search_workitems`: Search work items
- `get_work_item_types`: get work item types
- `create_work_item`: create work item
- `list_all_work_item_types`: List all work item types in an organization
- `list_work_item_types`: List work item types in a project space
- `get_work_item_type`: Get details of a specific work item type
- `list_work_item_relation_work_item_types`: List work item types that can be related to a specific work item
- `get_work_item_type_field_config`: Get field configuration for a specific work item type
- `get_work_item_workflow`: Get workflow information for a specific work item type
- `list_work_item_comments`: List comments for a specific work item
- `create_work_item_comment`: Create a comment for a specific work item
- `list_workitem_attachments`: List attachments for a specific work item
- `get_workitem_file`: Get file information for a specific work item attachment
- `create_workitem_attachment`: Upload a local file as an attachment to a work item
- `list_workitem_activities`: List activity history for a work item (field changes, status transitions, association changes)
- `list_current_user_effort_records`: [Project Management] 获取用户的实际工时明细，结束时间和开始时间的间隔不能大于6个月
- `list_effort_records`: [Project Management] 获取实际工时明细
- `create_effort_record`: [Project Management] 登记实际工时
- `list_estimated_efforts`: [Project Management] 获取预计工时明细
- `create_estimated_effort`: [Project Management] 登记预计工时
- `update_effort_record`: [Project Management] 更新登记实际工时
- `update_estimated_effort`: [Project Management] 更新登记预计工时

### Pipeline Management Tools

- `get_pipeline`: Get pipeline details
- `list_pipelines`: Get pipeline list
- `smart_list_pipelines`: Smart pipeline search with natural language time references
- `generate_pipeline_yaml`: [Pipeline Management] Generate pipeline YAML configuration
- `create_pipeline_from_description`: Create a pipeline from natural language description
- `update_pipeline`: [Pipeline Management] Update pipeline YAML content
- `create_pipeline_run`: Create a pipeline run instance
- `get_latest_pipeline_run`: Get the latest pipeline run instance
- `get_pipeline_run`: Get pipeline run details
- `list_pipeline_runs`: Get pipeline run list
- `list_pipeline_jobs_by_category`: Get pipeline execution tasks by category
- `list_pipeline_job_historys`: Get the execution history of a pipeline task
- `execute_pipeline_job_run`: Manually run a pipeline task
- `get_pipeline_job_run_log`: Get the execution logs of a pipeline job
- `list_service_connections`: List service connections in organization
- `create_pipeline_from_description`: Automatically generates YAML configuration and creates pipeline
- `update_pipeline`: Update an existing pipeline in Yunxiao by pipelineId. Use this to update pipeline YAML, stages, jobs, etc.
- `create_resource_member`: Create a resource member
- `delete_resource_member`: Delete a resource member
- `list_resource_members`: Get a list of resource members
- `update_resource_member`: Update a resource member
- `update_resource_owner`: Transfer resource owner
- `create_tag`: Create a tag
- `create_tag_group`: Create a tag group
- `list_tag_groups`: Get a list of tag groups
- `delete_tag_group`: Delete a tag group
- `update_tag_group`: Update a tag group
- `get_tag_group`: Get a tag group
- `delete_tag`: Delete a tag
- `update_tag`: Update a tag
- `stop_vm_deploy_order`: Stop VM deploy order
- `skip_vm_deploy_machine`: Skip VM deploy machine
- `retry_vm_deploy_machine`: Retry VM deploy machine
- `resume_vm_deploy_order`: Resume VM deploy order
- `get_vm_deploy_order`: Get VM deploy order details
- `get_vm_deploy_machine_log`: Get VM deploy machine log

### Application Delivery Tools

- `create_change_order`: [application delivery] 创建部署单
- `list_change_order_versions`: [application delivery] 查看部署单版本列表
- `get_change_order`: [application delivery] 读取部署单使用的物料和工单状态
- `list_change_order_job_logs`: [application delivery] 查询环境部署单日志
- `find_task_operation_log`: [application delivery] 查询部署任务执行日志，其中通常包含下游部署引擎的调度细节信息
- `execute_job_action`: [application delivery] 操作环境部署单
- `list_change_orders_by_origin`: [application delivery] 根据创建来源查询部署单
- `create_appstack_change_request`: [application delivery] 创建变更请求
- `get_appstack_change_request_audit_items`: [application delivery] 获取变更请求的审批项
- `list_appstack_change_request_executions`: [application delivery] 列出变更请求的执行记录
- `list_appstack_change_request_work_items`: [application delivery] 列出变更请求的工作项
- `cancel_appstack_change_request`: [application delivery] 取消变更请求
- `close_appstack_change_request`: [application delivery] 关闭变更请求
- `list_applications`: [application delivery] List applications in an organization with pagination
- `get_application`: [application delivery] Get application details by name
- `create_application`: [application delivery] Create a new application
- `update_application`: [application delivery] Update an existing application
- `get_latest_orchestration`: [application delivery] Get the latest orchestration for an environment
- `list_app_orchestration`: [application delivery] List application orchestrations
- `create_app_orchestration`: [application delivery] Create an application orchestration
- `delete_app_orchestration`: [application delivery] Delete an application orchestration
- `get_app_orchestration`: [application delivery] Get an application orchestration
- `update_app_orchestration`: [application delivery] Update an application orchestration
- `get_env_variable_groups`: [application delivery] Get variable groups for an environment
- `create_variable_group`: [application delivery] Create a variable group
- `delete_variable_group`: [application delivery] Delete a variable group
- `get_variable_group`: [application delivery] Get a variable group
- `update_variable_group`: [application delivery] Update a variable group
- `get_app_variable_groups`: [application delivery] Get variable groups for an application
- `get_app_variable_groups_revision`: [application delivery] Get the revision of variable groups for an application
- `search_app_templates`: [application delivery] Search application templates
- `create_app_tag`: [application delivery] Create an application tag
- `update_app_tag`: [application delivery] Update an application tag
- `search_app_tags`: [application delivery] Search application tags
- `update_app_tag_bind`: [application delivery] Update application tag bindings
- `create_global_var`: [application delivery] Create a global variable group
- `get_global_var`: [application delivery] Get a global variable group
- `update_global_var`: [application delivery] Update a global variable group
- `list_global_vars`: [application delivery] List global variable groups
- `get_machine_deploy_log`: [application delivery] Get machine deployment log
- `add_host_list_to_host_group`: [application delivery] Add host list to host group
- `add_host_list_to_deploy_group`: [application delivery] Add host list to deploy group
- `list_app_release_workflows`: [application delivery] List all release workflows for an application
- `list_app_release_workflow_briefs`: [application delivery] List release workflow briefs for an application
- `list_system_release_workflows`: [application delivery] List all system release workflows
- `create_system_release_workflow`: [application delivery] Create a system release workflow
- `update_system_release_stage`: [application delivery] Update system release workflow stage
- `execute_system_release_stage`: [application delivery] Execute system release workflow stage
- `get_app_release_workflow_stage`: [application delivery] Get release workflow stage details
- `list_app_release_stage_briefs`: [application delivery] List release stage briefs
- `update_app_release_stage`: [application delivery] Update application release workflow stage
- `list_app_release_stage_runs`: [application delivery] List release stage execution records
- `execute_app_release_stage`: [application delivery] Execute release workflow stage for a change request
- `cancel_app_release_stage_execution`: [application delivery] Cancel release workflow stage execution
- `retry_app_release_stage_pipeline`: [application delivery] Retry release workflow stage pipeline
- `skip_app_release_stage_pipeline`: [application delivery] Skip release workflow stage pipeline
- `list_app_release_stage_metadata`: [application delivery] List integrated metadata for stage execution
- `get_app_release_stage_pipeline_run`: [application delivery] Get release stage pipeline run instance
- `pass_app_release_stage_validate`: [application delivery] Pass release workflow stage validation
- `get_app_release_stage_job_log`: [application delivery] Get pipeline job execution log
- `refuse_app_release_stage_validate`: [application delivery] Refuse release workflow stage validation

### Packages Management Tools

- `list_package_repositories`: Get package repositories details list
- `list_artifacts`: Get artifacts details list
- `get_artifact`: Get single artifact details

### Test Management Tools

- `list_testcase_directories`: [test management] Get test case directory list
- `create_testcase_directory`: [test management] Create a test case directory
- `get_testcase_field_config`: [test management] Get test case field configuration
- `create_testcase`: [test management] Create a test case
- `search_testcases`: [test management] Search test cases
- `get_testcase`: [test management] Get test case information
- `delete_testcase`: [test management] Delete a test case
- `list_test_plans`: [test management] Get test plan list
- `get_test_result_list`: [test management] Get test case list in a test plan
- `update_test_result`: [test management] Update test result

## Contact Us
If you have any questions, please join the Alibaba Cloud Devops discussion group (134400004101) for discussion.

![Alibaba Cloud Devops MCP Server Group](https://agent-install-beijing.oss-cn-beijing.aliyuncs.com/alibabacloud-devops-mcp-server/1750147152464.png)


## Related Links
- [AlibabaCloud DevOps](https://www.aliyun.com/product/yunxiao)
- [MCP market](https://modelscope.cn/mcp/servers/@aliyun/alibabacloud-devops-mcp-server)
- [Example Use Cases](https://mp.weixin.qq.com/s/KQsN6dQlnNeCNATC-QD7pg)
- [使用云效进行项目管理](https://mp.weixin.qq.com/s/2lxa18OlnQ_ly7wgAkCKTw)
- [使用云效进行代码管理](https://mp.weixin.qq.com/s/pI5fbCK-nVDN7cLwx8K4Zg)
