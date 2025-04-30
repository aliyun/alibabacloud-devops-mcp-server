# alibabacloud-devops-mcp-server

Yunxiao MCP Server provides AI assistants with the ability to interact with the Yunxiao platform, enabling them to read work item contents in projects, automatically write code after understanding requirements, and submit code merge requests. Enterprise development teams can use it to assist with code reviews, optimize task management, reduce repetitive operations, and thus focus on more important innovation and product delivery.

Enterprise development teams can use it to assist with code reviews, optimize task management, reduce repetitive operations, and focus on more important innovations and product delivery.

## Features

alibabacloud-devops-mcp-server provides the following capabilities for AI assistants:

* **Code Repository Management**: Query code repositories and their branches, create branches
* **File Operations**: Create, update, delete, and retrieve code file content
* **Code Review**: Create and manage code review processes
* **Project Management**: Search projects, get project details

## Tools

alibabacloud-devops-mcp-server integrates various tools, including:

### Organization
- `get_current_organization_Info`: Get current user's organization information
- `get_user_organizations`: Get the list of organizations the current user has joined

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

## Usage

### Prerequisites
* Alibaba Cloud Yunxiao Personal Access Token, [click here to obtain](https://help.aliyun.com/zh/yunxiao/developer-reference/obtain-personal-access-token?spm=a2c4g.11186623.help-menu-150040.d_5_0_1.5dc72af2GnT64i). It is recommended to grant read and write permissions for all APIs. 
* node version >= 16.0.0

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
- [Alibaba Cloud Yunxiao](https://devops.aliyun.com)

## Usage Experience (Example with Lingma-Alibaba Cloud AI Coding)
1.Local Config

![img6.png](https://agent-install-beijing.oss-cn-beijing.aliyuncs.com/alibabacloud-devops-mcp-server/img_6.png)

![img0.png](https://agent-install-beijing.oss-cn-beijing.aliyuncs.com/alibabacloud-devops-mcp-server/img_0.png)

success：

![img7.png](https://agent-install-beijing.oss-cn-beijing.aliyuncs.com/alibabacloud-devops-mcp-server/img_7.png)

2.Using AI Models to Call MCP Server for Completing Requirements in Yunxiao and Creating Merge Requests

![img.png](https://agent-install-beijing.oss-cn-beijing.aliyuncs.com/alibabacloud-devops-mcp-server/img.png)
![img1.png](https://agent-install-beijing.oss-cn-beijing.aliyuncs.com/alibabacloud-devops-mcp-server/img_1.png)
![img2.png](https://agent-install-beijing.oss-cn-beijing.aliyuncs.com/alibabacloud-devops-mcp-server/img_2.png)
![img3.png](https://agent-install-beijing.oss-cn-beijing.aliyuncs.com/alibabacloud-devops-mcp-server/img_3.png)
![img4.png](https://agent-install-beijing.oss-cn-beijing.aliyuncs.com/alibabacloud-devops-mcp-server/img_4.png)
![img5.png](https://agent-install-beijing.oss-cn-beijing.aliyuncs.com/alibabacloud-devops-mcp-server/img_5.png)