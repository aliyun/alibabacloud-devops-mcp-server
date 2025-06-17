[![MseeP.ai Security Assessment Badge](https://mseep.net/pr/aliyun-alibabacloud-devops-mcp-server-badge.png)](https://mseep.ai/app/aliyun-alibabacloud-devops-mcp-server)

<p align="center">English | <a href="README.zh-cn.md">中文</a><br></p>

# alibabacloud-devops-mcp-server
[![smithery badge](https://smithery.ai/badge/@aliyun/alibabacloud-devops-mcp-server)](https://smithery.ai/server/@aliyun/alibabacloud-devops-mcp-server)

[AlibabaCloud Devops](https://www.aliyun.com/product/yunxiao) MCP Server provides AI assistants with the ability to interact with the Yunxiao platform, enabling them to read work item contents in projects, automatically write code after understanding requirements, and submit code merge requests. Enterprise development teams can use it to assist with code reviews, optimize task management, reduce repetitive operations, and thus focus on more important innovation and product delivery.

## Features

alibabacloud-devops-mcp-server provides the following capabilities for AI assistants:

* **Code Repository Management**: Query code repositories and their branches, create branches
* **File Operations**: Create, update, delete, and retrieve code file content
* **Code Review**: Create and manage code review processes
* **Project Management**: Search projects, get project details
* **Pipeline Management**: Get pipeline details, get pipeline list, create a pipeline run instance, get the latest pipeline run instance, get pipeline run details, get pipeline run list, Query / Run a pipeline deployment task
* **Package Management**: Get package repository details list, Get artifacts details list, Get single artifact details

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

### Project Management Tools

- `get_project`: Get project details
- `search_projects`: Search projects
- `get_work_item`: Get work item details
- `search_workitems`: Search work items

### Pipeline Management Tools

- `get_pipeline`: Get pipeline details
- `list_pipelines`: Get pipeline list
- `smart_list_pipelines`: Smart pipeline search with natural language time references
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

### Packages Management Tools

- `list_package_repositories`: Get package repositories details list
- `list_artifacts`: Get artifacts details list
- `get_artifact`: Get single artifact details

## Usage

### Prerequisites
* node version >= 16.0.0
* [AlibabaCloud Devops](https://www.aliyun.com/product/yunxiao) Personal Access Token, [click here to obtain](https://help.aliyun.com/zh/yunxiao/developer-reference/obtain-personal-access-token). Grant read and write permissions to all APIs under organization management, project collaboration, code management, pipeline management, artifact repository management, application delivery and testing management.

  ![The personal token authorization page](https://agent-install-beijing.oss-cn-beijing.aliyuncs.com/alibabacloud-devops-mcp-server/img_8.jpg)

### Installing via Smithery

To install [AlibabaCloud DevOps](https://www.aliyun.com/product/yunxiao) Server for Claude Desktop automatically via [Smithery](https://smithery.ai/server/@aliyun/alibabacloud-devops-mcp-server):

```bash
npx -y @smithery/cli install @aliyun/alibabacloud-devops-mcp-server --client claude
```

### Install Yunxiao MCP server via MCP marketplace
The MCP market built into Lingma (AlibabaCloud Tongyi Lingma) has already provided the AlibabaCloud Devops MCP service. To install it, simply enter the MCP market in Lingma and search for "Yunxiao DevOps", then click install.

![Install AlibabaCloud Devops MCP Service from the MCP Market](https://agent-install-beijing.oss-cn-beijing.aliyuncs.com/alibabacloud-devops-mcp-server/img_9.png)

### Run MCP Server via NPX
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

### Run MCP Server via Docker Container
1. Docker build
```shell
docker build -t alibabacloud/alibabacloud-devops-mcp-server .
```
2. Configure MCP Server
```json
{
  "mcpServers": {
    "yunxiao": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "YUNXIAO_ACCESS_TOKEN",
        "alibabacloud/alibabacloud-devops-mcp-server"
      ],
      "env": {
        "YUNXIAO_ACCESS_TOKEN": "<YOUR_TOKEN>"
      }
    }
  }
}
```

## Related Links
- [AlibabaCloud DevOps](https://www.aliyun.com/product/yunxiao)
- [MCP market](https://modelscope.cn/mcp/servers/@aliyun/alibabacloud-devops-mcp-server)
- [Example Use Cases](https://mp.weixin.qq.com/s/KQsN6dQlnNeCNATC-QD7pg)
