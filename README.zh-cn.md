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

## 用法

### Region 站点支持

本工具支持云效中心站和 Region 站两种部署模式：

- **中心站**：使用 `https://openapi-rdc.aliyuncs.com` 作为 API 域名
- **Region 站**：使用组织专属域名，如 `https://your-org.devops.aliyuncs.com`

#### 自动判定机制

工具会根据配置的 API 基础 URL 自动判断部署模式：

- 如果 URL 包含 `openapi-rdc.aliyuncs.com`，则为中心站模式
- 否则为 Region 站模式

#### 配置 Region 站点

使用 Region 站点时，需要设置环境变量 `YUNXIAO_API_BASE_URL`。

### 先决条件
* node 版本  >= 20.0.0
* 阿里云[云效](https://www.aliyun.com/product/yunxiao)个人访问令牌，[点击前往](https://help.aliyun.com/zh/yunxiao/developer-reference/obtain-personal-access-token)，授予组织管理、项目协作、代码管理、流水线、制品仓库、应用交付、测试管理下所有api的读写权限。令牌的到期时间注意选择一个长期有效的时间。
  
  ![个人令牌授权页面](https://agent-install-beijing.oss-cn-beijing.aliyuncs.com/alibabacloud-devops-mcp-server/img_8.jpg)

## 官方托管服务（免安装，推荐）

云效提供**官方托管**的 MCP 端点，**无需本地安装或 Docker**——把客户端指向该地址、用你的云效令牌鉴权即可。

- **中心站**：`https://openapi-rdc.aliyuncs.com/ai/mcp`
- **Region 站（专有域名）**：你所在 region 的组织专属域名 + `/ai/mcp`，例如 `https://<your-org>.devops.aliyuncs.com/ai/mcp`——即你平时访问云效 region 的那个域名。
- 传输协议：Streamable HTTP（无状态）
- 鉴权：`Authorization: Bearer <YOUR_TOKEN>`（或请求头 `X-Yunxiao-Token: <YOUR_TOKEN>`）

客户端配置——**中心站**（原生支持远程的客户端，如 Cursor）：

```json
{
  "mcpServers": {
    "yunxiao": {
      "url": "https://openapi-rdc.aliyuncs.com/ai/mcp",
      "headers": { "Authorization": "Bearer <YOUR_TOKEN>" }
    }
  }
}
```

客户端配置——**Region 站**（把 URL 换成你自己的 region 域名）：

```json
{
  "mcpServers": {
    "yunxiao": {
      "url": "https://<your-org>.devops.aliyuncs.com/ai/mcp",
      "headers": { "Authorization": "Bearer <YOUR_TOKEN>" }
    }
  }
}
```

> 提示：只启用需要的工具集可显著降低 context 占用——`?toolsets=code-management,project-management` 或请求头 `X-Devops-Toolsets`。完整说明见 [docs/hosted-mcp-guide.zh-CN.md](docs/hosted-mcp-guide.zh-CN.md)。

---

## 快速开始（自建：使用 Stdio 模式）

**Stdio 模式**是最简单的自建方式，适合大多数 MCP 客户端（如 Cursor、Claude Desktop、iFlow 等）。无需安装 Docker，直接通过 npx 运行即可。

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
> - 默认调用云效中心站 OpenAPI（`https://openapi-rdc.aliyuncs.com`），无需额外配置
> - 如果您使用的是 **Region 站点**（专属域名），需要额外设置环境变量 `YUNXIAO_API_BASE_URL` 为您的云效实例地址，如 `https://your-org.devops.aliyuncs.com`。节
> - 这种方式使用 **stdio 模式**，通过标准输入输出与 MCP 客户端通信

---

## 使用 Docker（可选）

### 传输模式

| 模式 | CLI 参数 | 环境变量 | 端点 |
|------|---------|---------|------|
| Stdio | *(默认)* | — | stdin/stdout |
| SSE | `--sse` | `MCP_TRANSPORT=sse` | `/sse` + `/messages` |
| Streamable HTTP | `--streamable-http` | `MCP_TRANSPORT=streamable-http` | `/mcp` |
| 双传输 | `--sse --streamable-http` | `MCP_TRANSPORT=both` | `/sse` + `/mcp` |

> Streamable HTTP 是 MCP 规范推荐的远程传输方式。SSE 为旧版协议；迁移期可使用 `both` 同时提供两种端点。

### 1. 拉取镜像

```shell
docker pull build-steps-public-registry.cn-beijing.cr.aliyuncs.com/build-steps/alibabacloud-devops-mcp-server:latest
```

> 自行构建：`docker build -t alibabacloud/alibabacloud-devops-mcp-server .`

### 2. 启动服务

**Stdio：**
```shell
docker run -i --rm -e YUNXIAO_ACCESS_TOKEN \
  build-steps-public-registry.cn-beijing.cr.aliyuncs.com/build-steps/alibabacloud-devops-mcp-server:latest
```

**SSE / Streamable HTTP / 双传输** — 设置 `MCP_TRANSPORT` 并暴露 `PORT`：
```shell
docker run -d --name yunxiao-mcp -p 3000:3000 \
  -e YUNXIAO_ACCESS_TOKEN="your_token" -e PORT=3000 \
  -e MCP_TRANSPORT=streamable-http \   # sse | streamable-http | both
  build-steps-public-registry.cn-beijing.cr.aliyuncs.com/build-steps/alibabacloud-devops-mcp-server:latest
```

Streamable HTTP 可选环境变量：
- **`MCP_STREAMABLE_PATH`**：MCP 端点路径（默认 `/mcp`）
- **`MCP_HTTP_HOST`**：绑定 host（默认 `0.0.0.0`）
- **`MCP_ALLOWED_HOSTS`**：允许的 `Host` 头值（逗号分隔）

### 3. 配置 MCP 客户端

**Stdio：**
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

**SSE：** `http://localhost:3000/sse`

**Streamable HTTP：** `http://localhost:3000/mcp`

通过查询参数或请求头传递凭证：
```
http://localhost:3000/mcp?yunxiao_access_token=YOUR_TOKEN_HERE
```
或请求头：`x-yunxiao-token: YOUR_TOKEN_HERE`

指定 Region / 实例 OpenAPI 站点：
```
http://localhost:3000/mcp?yunxiao_access_token=TOKEN&yunxiao_api_base_url=https%3A%2F%2Fyour-org.devops.aliyuncs.com
```
或请求头：`x-yunxiao-api-base-url: https://your-org.devops.aliyuncs.com`

### Docker Compose

```shell
cp .env.example .env   # 设置 YUNXIAO_ACCESS_TOKEN
docker compose up -d
```

客户端 URL：`http://localhost:3000/sse`（SSE）或 `http://localhost:3000/mcp`（Streamable HTTP）

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
- `list_commits`: [代码管理] 列出代码库提交记录
- `get_commit`: [代码管理] 获取提交详情
- `create_commit_comment`: [代码管理] 创建提交评论

### 项目管理工具

- `get_project`: 获取项目详情
- `search_projects`: 搜索项目
- `get_sprint`: 获取迭代详情
- `list_sprints`: 获取项目中的迭代列表
- `create_sprint`: [项目管理] 创建迭代
- `update_sprint`: [项目管理] 更新迭代
- `search_programs`: [项目管理] 搜索项目集
- `list_program_versions`: [项目管理] 列出项目集版本
- `list_versions`: [项目管理] 列出项目版本
- `create_version`: [项目管理] 创建版本
- `update_version`: [项目管理] 更新版本
- `delete_version`: [项目管理] 删除版本
- `get_work_item`: 获取工作项详情
- `update_work_item`: [项目管理] 更新工作项
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
- `list_workitem_attachments`: 列出工作项的附件列表
- `get_workitem_file`: 获取工作项附件文件信息
- `create_workitem_attachment`: 上传本地文件作为工作项附件
- `list_workitem_activities`: 列出工作项的动态历史（字段变更、状态流转、关联变更）
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
- `generate_pipeline_yaml` - [流水线管理] 生成流水线YAML配置
- `create_pipeline_from_description` - 根据自然语言描述生成流水线 YAML 并创建流水线
- `update_pipeline` - [流水线管理] 更新流水线YAML内容
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
- `list_system_release_workflows`: [应用交付] 查询系统下所有发布流程
- `create_system_release_workflow`: [应用交付] 创建系统发布流程
- `update_system_release_stage`: [应用交付] 更新系统发布流程阶段
- `execute_system_release_stage`: [应用交付] 执行系统发布流程阶段
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

## 联系我们
如有任何疑问或疑虑，请通过钉钉群联系我们：134400004101

![Alibaba Cloud Devops MCP Server Group](https://agent-install-beijing.oss-cn-beijing.aliyuncs.com/alibabacloud-devops-mcp-server/1750147152464.png)

## 相关链接
- [阿里云云效](https://www.aliyun.com/product/yunxiao)
- [MCP 市场](https://modelscope.cn/mcp/servers/@aliyun/alibabacloud-devops-mcp-server)
- [使用场景示例](https://mp.weixin.qq.com/s/KQsN6dQlnNeCNATC-QD7pg)
- [使用云效进行项目管理](https://mp.weixin.qq.com/s/2lxa18OlnQ_ly7wgAkCKTw)
- [使用云效进行代码管理](https://mp.weixin.qq.com/s/pI5fbCK-nVDN7cLwx8K4Zg)
