<p align="center"><a href="README.md">English</a> | 中文<br></p>

# alibabacloud-devops-mcp-server
[云效](https://www.aliyun.com/product/yunxiao)mcp-server工具为 AI 助手提供了与云效平台交互的能力，能够与项目协作、代码管理、流水线、制品仓库、应用交付等模块等交互。企业研发团队可以使用它协助代码审查、优化任务管理、完成构建、部署等任务，从而专注于更重要的创新和产品交付。

## 功能特性

alibabacloud-devops-mcp-server提供了以下功能，让AI助手能够：

* **组织管理**：组织列表、组织信息、部门信息、组织角色、成员信息等
* **代码管理**：代码仓库管理、分支管理、合并请求管理、操作文件树等
* **项目管理**：项目管理、工作项管理、工作项字段、工作项评论、工时管理等
* **流水线管理**：流水线列表、流水线管理、资源管理、标签管理、部署管理等
* **制品仓库管理**：制品仓库、制品列表等
* **应用交付**：部署单管理、应用管理、应用标签、变量组管理等
* **测试管理**：测试用例管理、测试用例目录、测试计划、测试结果等

## 工具列表

alibabacloud-devops-mcp-server集成了多种工具，包括：

### 组织管理
- `get_current_organization_Info`: 获取当前用户所在组织信息
- `get_user_organizations`: 获取当前用户加入的组织列表
- `get_organization_role`: 获取组织角色信息
- `get_organization_departments`: 获取组织中的部门列表
- `get_organization_department_info`: 获取组织中某个部门的信息
- `get_organization_department_ancestors`: 获取组织中部门的上级部门
- `get_organization_members`: 获取组织成员列表
- `get_organization_member_info`: 获取组织成员信息
- `get_organization_member_info_by_user_id`: 通过用户ID获取组织成员信息
- `search_organization_members`: 搜索组织成员
- `list_organization_roles`: 列出组织角色
- `get_organization_role`: 获取组织角色信息

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
- `get_sprint`: 获取迭代详情
- `list_sprints`: 获取项目中的迭代列表
- `get_work_item`: 获取工作项详情
- `search_workitems`: 搜索工作项
- `get_work_item_types`: 获取工作项类型
- `create_work_item`: 创建工作项
- `list_all_work_item_types`: 列出组织中所有工作项类型
- `list_work_item_types`: 列出项目空间中工作项类型
- `get_work_item_type`: 获取特定工作项类型的详细信息
- `list_work_item_relation_work_item_types`: 列出可关联到特定工作项的工作项类型
- `get_work_item_type_field_config`: 获取工作项类型的字段配置
- `get_work_item_workflow`: 获取工作项类型的工作流信息
- `list_work_item_comments`: 列出特定工作项的评论
- `create_work_item_comment`: 为特定工作项创建评论
- `list_current_user_effort_records`: [项目管理] 获取用户的实际工时明细，结束时间和开始时间的间隔不能大于6个月
- `list_effort_records`: [项目管理] 获取实际工时明细
- `create_effort_record`: [项目管理] 登记实际工时
- `list_estimated_efforts`: [项目管理] 获取预计工时明细
- `create_estimated_effort`: [项目管理] 登记预计工时
- `update_effort_record`: [项目管理] 更新登记实际工时
- `update_estimated_effort`: [项目管理] 更新登记预计工时

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
- `create_pipeline_from_description`: 根据自然语言描述生成流水线 YAML 并创建流水线
- `update_pipeline`: 更新流水线YAML内容
- `create_resource_member`: 创建资源成员
- `delete_resource_member`: 删除资源成员
- `list_resource_members`: 获取资源成员列表
- `update_resource_member`: 更新资源成员
- `update_resource_owner`: 移交资源对象拥有者
- `create_tag`: 创建标签
- `create_tag_group`: 创建标签分类
- `list_tag_groups`: 获取流水线分类列表
- `delete_tag_group`: 删除标签分类
- `update_tag_group`: 更新标签分类
- `get_tag_group`: 获取标签分类
- `delete_tag`: 删除标签
- `update_tag`: 更新标签
- `stop_vm_deploy_order`: 终止机器部署
- `skip_vm_deploy_machine`: 跳过机器部署
- `retry_vm_deploy_machine`: 重试机器部署
- `resume_vm_deploy_order`: 继续部署单运行
- `get_vm_deploy_order`: 获取部署单详情
- `get_vm_deploy_machine_log`: 查询机器部署日志


### 应用交付工具

- `create_change_order`: [应用交付] 创建部署单
- `list_change_order_versions`: [应用交付] 查看部署单版本列表
- `get_change_order`: [应用交付] 读取部署单使用的物料和工单状态
- `list_change_order_job_logs`: [应用交付] 查询环境部署单日志
- `find_task_operation_log`: [应用交付] 查询部署任务执行日志，其中通常包含下游部署引擎的调度细节信息
- `execute_job_action`: [应用交付] 操作环境部署单
- `list_change_orders_by_origin`: [应用交付] 根据创建来源查询部署单
- `create_appstack_change_request`: [应用交付] 创建变更请求
- `get_appstack_change_request_audit_items`: [应用交付] 获取变更请求的审批项
- `list_appstack_change_request_executions`: [应用交付] 列出变更请求的执行记录
- `list_appstack_change_request_work_items`: [应用交付] 列出变更请求的工作项
- `cancel_appstack_change_request`: [应用交付] 取消变更请求
- `close_appstack_change_request`: [应用交付] 关闭变更请求
- `list_applications`: [应用交付] 分页获取组织中的应用列表
- `get_application`: [应用交付] 根据应用名获取应用详情
- `create_application`: [应用交付] 创建应用
- `update_application`: [应用交付] 更新应用
- `get_latest_orchestration`: [应用交付] 获取环境的最新编排
- `list_app_orchestration`: [应用交付] 列出应用编排
- `create_app_orchestration`: [应用交付] 创建应用编排
- `delete_app_orchestration`: [应用交付] 删除应用编排
- `get_app_orchestration`: [应用交付] 获取应用编排
- `update_app_orchestration`: [应用交付] 更新应用编排
- `get_env_variable_groups`: [应用交付] 获取环境的变量组
- `create_variable_group`: [应用交付] 创建变量组
- `delete_variable_group`: [应用交付] 删除变量组
- `get_variable_group`: [应用交付] 获取变量组
- `update_variable_group`: [应用交付] 更新变量组
- `get_app_variable_groups`: [应用交付] 获取应用的变量组
- `get_app_variable_groups_revision`: [应用交付] 获取应用变量组的版本
- `search_app_templates`: [应用交付] 搜索应用模板
- `create_app_tag`: [应用交付] 创建应用标签
- `update_app_tag`: [应用交付] 更新应用标签
- `search_app_tags`: [应用交付] 搜索应用标签
- `update_app_tag_bind`: [应用交付] 更新应用标签绑定
- `create_global_var`: [应用交付] 创建全局变量组
- `get_global_var`: [应用交付] 获取全局变量组
- `update_global_var`: [应用交付] 更新全局变量组
- `list_global_vars`: [应用交付] 列出全局变量组
- `get_machine_deploy_log`: [应用交付] 获取机器部署日志
- `add_host_list_to_host_group`: [应用交付] 添加主机列表到主机组
- `add_host_list_to_deploy_group`: [应用交付] 添加主机列表到部署组
- `list_app_release_workflows`: [应用交付] 查询应用下所有发布流程
- `list_app_release_workflow_briefs`: [应用交付] 查询应用下所有发布流程摘要
- `get_app_release_workflow_stage`: [应用交付] 获取发布流程阶段详情
- `list_app_release_stage_briefs`: [应用交付] 查询发布流程阶段摘要列表
- `update_app_release_stage`: [应用交付] 更新应用发布流程阶段
- `list_app_release_stage_runs`: [应用交付] 查询发布流程阶段执行记录列表
- `execute_app_release_stage`: [应用交付] 执行变更请求的发布流程阶段
- `cancel_app_release_stage_execution`: [应用交付] 取消发布流程阶段执行
- `retry_app_release_stage_pipeline`: [应用交付] 重试变更请求的发布流程阶段流水线
- `skip_app_release_stage_pipeline`: [应用交付] 跳过变更请求的发布流程阶段流水线
- `list_app_release_stage_metadata`: [应用交付] 查询研发阶段执行记录集成变更信息
- `get_app_release_stage_pipeline_run`: [应用交付] 获取研发阶段流水线运行实例
- `pass_app_release_stage_validate`: [应用交付] 通过发布流程阶段验证
- `get_app_release_stage_job_log`: [应用交付] 查询研发阶段流水线任务运行日志
- `refuse_app_release_stage_validate`: [应用交付] 拒绝发布流程阶段验证

### 制品仓库工具

- `list_package_repositories`: 查看制品仓库信息
- `list_artifacts`: 查询制品信息
- `get_artifact`: 查看单个制品信息

### 测试管理工具

- `list_testcase_directories`: [测试管理] 获取测试用例目录列表
- `create_testcase_directory`: [测试管理] 创建测试用例目录
- `get_testcase_field_config`: [测试管理] 获取测试用例字段配置
- `create_testcase`: [测试管理] 创建测试用例
- `search_testcases`: [测试管理] 搜索测试用例
- `get_testcase`: [测试管理] 获取测试用例信息
- `delete_testcase`: [测试管理] 删除测试用例
- `list_test_plans`: [测试管理] 获取测试计划列表
- `get_test_result_list`: [测试管理] 获取测试计划中测试用例列表
- `update_test_result`: [测试管理] 更新测试结果

## 用法



### 先决条件
* node 版本  >= 18.0.0
* 阿里云[云效](https://www.aliyun.com/product/yunxiao)个人访问令牌，[点击前往](https://help.aliyun.com/zh/yunxiao/developer-reference/obtain-personal-access-token)，授予组织管理、项目协作、代码管理、流水线、制品仓库、应用交付、测试管理下所有api的读写权限。令牌的到期时间注意选择一个长期有效的时间。
  
  ![个人令牌授权页面](https://agent-install-beijing.oss-cn-beijing.aliyuncs.com/alibabacloud-devops-mcp-server/img_8.jpg)

## 快速开始（推荐：使用 Stdio 模式）

**Stdio 模式**是最简单、最常用的方式，适合大多数 MCP 客户端（如 Cursor、Claude Desktop、iFlow 等）。无需安装 Docker，直接通过 npx 运行即可。

### 方式一：通过 npx 直接使用（最简单）

在 MCP 客户端配置文件中添加以下配置：

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

> **说明**: 
> - 将 `<YOUR_TOKEN>` 替换为您的云效访问令牌
> - `-y` 参数会自动确认安装，无需手动确认
> - 这种方式使用 **stdio 模式**，通过标准输入输出与 MCP 客户端通信

### 方式二：通过 MCP 市场安装

通义灵码内置的 MCP 市场中已经提供了云效的 MCP 服务，在通义灵码中进入 MCP 市场并且找到「云效DevOps」，直接安装即可。

---

## 使用 Docker（可选）

如果您需要使用 Docker 运行 MCP 服务器，可以选择 **stdio 模式** 或 **SSE 模式**。

### Docker 使用 Stdio 模式

这种方式与直接使用 npx 类似，但通过 Docker 容器运行。

#### 1. 获取 Docker 镜像

**方式一：使用官方镜像（推荐）**

```shell
docker pull build-steps-public-registry.cn-beijing.cr.aliyuncs.com/build-steps/alibabacloud-devops-mcp-server:v0.2.0
```

**方式二：自行构建镜像**

```shell
docker build -t alibabacloud/alibabacloud-devops-mcp-server .
```

#### 2. 配置 MCP 客户端

在 MCP 客户端配置文件中添加：

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
        "build-steps-public-registry.cn-beijing.cr.aliyuncs.com/build-steps/alibabacloud-devops-mcp-server:v0.2.0"
      ],
      "env": {
        "YUNXIAO_ACCESS_TOKEN": "<YOUR_TOKEN>"
      }
    }
  }
}
```

> **注意**: 
> - 如果使用自行构建的镜像，将镜像名称替换为 `alibabacloud/alibabacloud-devops-mcp-server`
> - 这种方式使用 **stdio 模式**，容器通过标准输入输出与 MCP 客户端通信

### Docker 使用 SSE 模式

SSE 模式通过 HTTP 提供服务，适合需要独立运行服务或支持多用户的场景。

#### 1. 启动 SSE 服务

**使用官方镜像：**

```shell
docker run -d --name yunxiao-mcp \
  -p 3000:3000 \
  -e YUNXIAO_ACCESS_TOKEN="your_token_here" \
  -e PORT=3000 \
  -e MCP_TRANSPORT=sse \
  build-steps-public-registry.cn-beijing.cr.aliyuncs.com/build-steps/alibabacloud-devops-mcp-server:v0.2.0 \
  node dist/index.js --sse
```

**使用自行构建的镜像：**

```shell
docker run -d --name yunxiao-mcp \
  -p 3000:3000 \
  -e YUNXIAO_ACCESS_TOKEN="your_token_here" \
  -e PORT=3000 \
  -e MCP_TRANSPORT=sse \
  alibabacloud/alibabacloud-devops-mcp-server \
  node dist/index.js --sse
```

#### 2. 配置 MCP 客户端

在 MCP 客户端配置文件中添加：

```json
{
  "mcpServers": {
    "yunxiao": {
      "url": "http://localhost:3000/sse"
    }
  }
}
```

如果需要在连接时传递自己的令牌（而不是使用服务启动时的默认令牌）：

```json
{
  "mcpServers": {
    "yunxiao": {
      "url": "http://localhost:3000/sse?yunxiao_access_token=YOUR_TOKEN_HERE"
    }
  }
}
```

#### 3. 管理 SSE 服务

查看日志：
```shell
docker logs -f yunxiao-mcp
```

停止服务：
```shell
docker stop yunxiao-mcp
```

### 使用 Docker Compose 运行 SSE 模式

1. **环境设置**
```shell
cd alibabacloud-devops-mcp-server
cp .env.example .env
# 编辑 .env 文件，设置 YUNXIAO_ACCESS_TOKEN
```

2. **启动服务**
```shell
docker compose up -d
```

3. **配置 MCP 客户端**
```json
{
  "mcpServers": {
    "yunxiao": {
      "url": "http://localhost:3000/sse"
    }
  }
}
```

---

## SSE 模式高级配置

### 使用独立令牌

在 SSE 模式下，每个用户可以通过以下方式传递自己的令牌：

1. **通过查询参数**（推荐）：
```
http://localhost:3000/sse?yunxiao_access_token=USER_SPECIFIC_TOKEN
```

2. **通过请求头**：
```
x-yunxiao-token: USER_SPECIFIC_TOKEN
```

这允许多个用户共享同一个 SSE 服务，同时使用各自独立的令牌进行身份验证。

### 在 Codex 中配置 SSE 模式

如果您的云效 MCP 服务器已经以 SSE 模式启动在 `http://localhost:3000`，可以在 Codex 中按以下方式配置：

**使用默认令牌（服务启动时已配置）：**
```json
{
  "mcpServers": {
    "yunxiao": {
      "url": "http://localhost:3000/sse"
    }
  }
}
```

**在 URL 中传递令牌：**
```json
{
  "mcpServers": {
    "yunxiao": {
      "url": "http://localhost:3000/sse?yunxiao_access_token=YOUR_TOKEN_HERE"
    }
  }
}
```

### 工具集（Toolsets）
服务器现在支持工具集功能，允许您只启用需要的工具。这可以减少提供给AI助手的工具数量，提高性能。

可用的工具集：
- `organization-management`: 组织管理工具（组织列表、组织信息、部门信息、组织角色、成员信息等）
- `code-management`: 代码仓库管理工具（代码仓库管理、分支管理、合并请求管理、文件树等）
- `project-management`: 项目管理工具（项目管理、工作项管理、工作项字段、工作项评论、工时管理等）
- `pipeline-management`: 流水线管理工具（流水线列表、流水线管理、资源管理、标签管理、部署管理等）
- `packages-management`: 制品仓库管理工具(制品仓库、制品列表等)
- `application-delivery`: 应用交付工具（部署单管理、应用管理、应用标签、变量组管理等）
- `test-management`: 测试管理工具（测试用例管理、测试用例目录、测试计划、测试结果等）

要使用工具集，您可以通过命令行参数或环境变量来指定：

1. 通过命令行参数，示例：
```bash
npx -y alibabacloud-devops-mcp-server --toolsets=code-management,project-management
```

2. 通过环境变量，示例：
```bash
DEVOPS_TOOLSETS=code-management,project-management npx -y alibabacloud-devops-mcp-server
```

如果没有指定工具集，将默认启用所有工具。

## 联系我们
如有任何疑问或疑虑，请通过钉钉群联系我们：134400004101

![Alibaba Cloud Devops MCP Server Group](https://agent-install-beijing.oss-cn-beijing.aliyuncs.com/alibabacloud-devops-mcp-server/1750147152464.png)

## 相关链接
- [阿里云云效](https://www.aliyun.com/product/yunxiao)
- [MCP 市场](https://modelscope.cn/mcp/servers/@aliyun/alibabacloud-devops-mcp-server)
- [使用场景示例](https://mp.weixin.qq.com/s/KQsN6dQlnNeCNATC-QD7pg)
