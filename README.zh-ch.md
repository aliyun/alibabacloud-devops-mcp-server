# alibabacloud-devops-mcp-server
[云效](https://www.aliyun.com/product/yunxiao)mcp-server工具为 AI 助手提供了与云效平台交互的能力，能够让 AI 助手可以读取项目中工作项的内容，在理解需求后自动编写代码，并提交代码合并请求。企业研发团队可以使用它协助代码审查、优化任务管理、减少重复性操作，从而专注于更重要的创新和产品交付。

## 功能特性

alibabacloud-devops-mcp-server提供了以下功能，让AI助手能够：

* **代码仓库管理**：查询代码仓库及其分支、创建分支
* **文件操作**：创建、更新、删除和获取代码文件内容
* **代码评审**：创建和管理代码评审流程
* **项目管理**：搜索项目、获取项目详情
* **流水线管理**：获取流水线详情、获取流水线列表、运行流水线、获取最近一次流水线运行信息、获取流水线运行实例、获取流水线运行实例列表、查询/运行流水线部署任务
* **制品仓库管理**：查看制品仓库信息、查询制品信息、查看单个制品信息

## 工具列表

alibabacloud-devops-mcp-server集成了多种工具，包括：

### 组织
- `get_current_organization_Info`: 获取当前用户所在组织信息
- `get_user_organizations`: 获取当前用户加入的组织列表

### 代码管理工具

- `create_branch`: 创建分支
- `delete_branch`: 删除分支
- `get_branch`: 获取分支信息
- `list_branches`: 获取分支列表
- `create_file`: 创建文件
- `delete_file`: 删除文件
- `get_file_blobs`: 获取文件内容
- `list_files`: 查询文件树
- `update_file`: 更新文件内容
- `create_change_request`: 创建合并请求
- `create_change_request_comment`: 创建合并请求评论
- `get_change_request`: 查询合并请求
- `list_change_request_patch_sets`: 查询合并请求版本列表
- `list_change_request`: 查询合并请求列表
- `list_change_request_comments`: 查询合并请求评论列表
- `get_compare`: 代码比较
- `get_repository`: 获取仓库详情
- `list_repositories`: 获取仓库列表

### 项目管理工具

- `get_project`: 获取项目详情
- `search_projects`: 搜索项目
- `get_work_item`: 获取工作项详情
- `search_workitems`: 搜索工作项

###  流水线工具
- `get_pipeline` - 获取流水线详情
- `list_pipelines` - 获取流水线列表
- `smart_list_pipelines` - 智能查询流水线（支持自然语言时间）
- `create_pipeline_run` - 运行流水线
- `get_latest_pipeline_run` - 获取最新运行信息
- `get_pipeline_run` - 获取运行详情
- `list_pipeline_runs` - 获取运行历史
- `list_pipeline_jobs_by_category` - 获取流水线任务
- `list_pipeline_job_historys` - 获取任务历史
- `execute_pipeline_job_run` - 手动运行任务
- `get_pipeline_job_run_log` - 获取任务日志
- `list_service_connections` - 获取服务连接列表
- `generate_pipeline_yaml`:   生成流水线 YAML
- `create_pipeline_from_description`: 根据自然语言描述生成流水线 YAML 并创建流水线

### 制品仓库工具

- `list_package_repositories`: 查看制品仓库信息
- `list_artifacts`: 查询制品信息
- `get_artifact`: 查看单个制品信息

## 用法

### 先决条件
* node 版本  >= 16.0.0
* 阿里云[云效](https://www.aliyun.com/product/yunxiao)个人访问令牌，[点击前往](https://help.aliyun.com/zh/yunxiao/developer-reference/obtain-personal-access-token)，授予组织管理、项目协作、代码管理、流水线、制品仓库、应用交付、测试管理下所有api的读写权限。令牌的到期时间注意选择一个长期有效的时间。
  
  ![个人令牌授权页面](https://agent-install-beijing.oss-cn-beijing.aliyuncs.com/alibabacloud-devops-mcp-server/img_8.jpg)

### 在 Smithery.ai 中使用云效 MCP 服务

云效 MCP 服务已部署到 Smithery.ai 中，可以按照下列命令安装使用 [Smithery](https://smithery.ai/server/@aliyun/alibabacloud-devops-mcp-server):

```bash
npx -y @smithery/cli install @aliyun/alibabacloud-devops-mcp-server --client claude
```

### 通过 MCP市场 安装[云效](https://www.aliyun.com/product/yunxiao) MCP 服务
通义灵码内置的MCP市场中已经提供了云效的MCP服务，在通义灵码中进入MCP市场并且找到「云效DevOps」，直接安装即可。

![MCP市场安装云效MCP服务](https://agent-install-beijing.oss-cn-beijing.aliyuncs.com/alibabacloud-devops-mcp-server/img_9.png)

### 通过 NPX 运行 MCP 服务器
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
### 通过 Docker 容器运行 MCP 服务器
1.Docker build
```shell
docker build -t alibabacloud/alibabacloud-devops-mcp-server .
```
2.配置 MCP 服务器
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

## 相关链接
- [阿里云云效](https://www.aliyun.com/product/yunxiao)
- [MCP 市场](https://modelscope.cn/mcp/servers/@aliyun/alibabacloud-devops-mcp-server)
- [使用场景示例](https://mp.weixin.qq.com/s/KQsN6dQlnNeCNATC-QD7pg)
