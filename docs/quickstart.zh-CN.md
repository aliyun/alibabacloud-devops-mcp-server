<p align="center"><a href="quickstart.md">English</a> | 中文<br></p>

# 云效 DevOps MCP 快速上手

## 1. 简介

[云效](https://www.aliyun.com/product/yunxiao) MCP Server 为 AI 助手提供了与云效平台交互的能力，能够与项目协作、代码管理、流水线、制品仓库、应用交付等模块交互。企业研发团队可以用它协助代码审查、优化任务管理、完成构建与部署等任务，从而专注于更重要的创新和产品交付。

接入后，你可以直接用**自然语言**让 AI 助手（Cursor / Claude / 通义灵码 等）帮你查工作项、读代码、提合并请求、跑流水线，覆盖以下能力:

- **组织管理**:组织列表、组织信息、部门信息、组织角色、成员信息等
- **代码管理**:代码仓库、分支、合并请求、文件树等
- **项目协作**:项目、工作项、工作项字段、评论、工时管理等
- **流水线管理**:流水线、任务、资源、标签、部署管理等
- **制品仓库**:制品仓库、制品列表等
- **应用交付**:部署单、应用、应用标签、变量组管理等
- **测试管理**:测试用例、测试用例目录、测试计划、测试结果等

本文面向**使用者**，5 分钟即可接入。想自建部署或了解实现细节的开发者，请见 [第 6 节](#6-自建部署与开发者文档)。

---

## 2. 快速配置

### 2.1 创建云效 Token

MCP 服务本身不保存任何身份，**所有操作都以你请求里携带的 Token 对应的云效身份执行**。使用前先获取个人访问令牌:

1. 前往 [获取个人访问令牌](https://help.aliyun.com/zh/yunxiao/developer-reference/obtain-personal-access-token)。
2. 给令牌授予需要用到的 API **读写权限**（按需最小授权即可）:组织管理、项目协作、代码管理、流水线管理、制品仓库、应用交付、测试管理。

> ⚠️ Token 等同于你的账号权限，请妥善保管:不要提交到代码仓库，不要贴到聊天或日志里。

### 2.2 接入 MCP 服务

有两种接入方式，**任选其一**。把配置里的 `<YOUR_TOKEN>` 替换成上一步拿到的令牌，重启客户端即可在工具列表里看到云效工具。

#### 方式 A:直接接入云效官方 MCP Server（推荐，免安装）

云效已经把服务部署在线上，你只要把客户端指向下面这个地址、带上 Token 即可，**不需要** `npx`，也**不需要** Docker。

```
https://openapi-rdc.aliyuncs.com/ai/mcp
```

**通用配置** —— 适用于支持远程 MCP（`url` + 自定义 `headers`）的客户端（Cursor、Cline、Cherry Studio、通义灵码 等），写法一致:

```json
{
  "mcpServers": {
    "yunxiao": {
      "url": "https://openapi-rdc.aliyuncs.com/ai/mcp",
      "headers": {
        "Authorization": "Bearer <YOUR_TOKEN>"
      }
    }
  }
}
```

**Cursor**:打开 `Settings → MCP → Add new global MCP server`，或直接编辑 `~/.cursor/mcp.json`，填入上面的通用配置。

**Claude Code(命令行)**:一行命令即可添加远程服务:

```bash
claude mcp add --transport http yunxiao https://openapi-rdc.aliyuncs.com/ai/mcp \
  --header "Authorization: Bearer <YOUR_TOKEN>"
```

添加后用 `claude mcp list` 确认，或在对话里输入 `/mcp` 查看连接状态。

**通义灵码 / 其他国内客户端**:在其 MCP 配置里粘贴上面的通用配置 JSON 即可。若某客户端不支持自定义 `headers`，可退而用 Query String 传 Token（不推荐，Token 会进访问日志）:`https://openapi-rdc.aliyuncs.com/ai/mcp?yunxiao_access_token=<YOUR_TOKEN>`。

#### 方式 B:通过 stdio 模式接入(本地 npx)

适合不支持远程 MCP、或偏好本地进程的客户端(如 Claude Desktop)。需本机装有 **Node.js ≥ 18**,首次运行会通过 `npx` 自动拉取。

以 Claude Desktop 为例，编辑配置文件:

- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "yunxiao": {
      "command": "npx",
      "args": ["-y", "alibabacloud-devops-mcp-server"],
      "env": {
        "YUNXIAO_ACCESS_TOKEN": "<YOUR_TOKEN>"
      }
    }
  }
}
```

> 其他支持 `command` 启动的客户端(Cursor、通义灵码 等)也可用同样的 `command` / `args` / `env` 写法接入。

---

## 3. 快速使用指南

接入成功后，直接用自然语言让 AI 调用即可。例如:

- “列出我所在的组织”
- “查看 xxx 组织下 repo-name 仓库的 master 分支最近 10 次提交”
- “帮我把当前分支提一个合并请求到 master，标题写 …”
- “看看项目 yyy 里指派给我的、还没完成的工作项”
- “给工作项 #12345 加一条评论:已联调完成”
- “最近一次跑失败的流水线是哪条，把失败日志拉出来看看”

AI 会自动选择合适的工具并带上你的身份执行。

---

## 4. 一些额外的变量支持

### 4.1 按需裁剪工具集(降低上下文占用)

服务提供 **194 个工具**，覆盖 8 大类。工具太多会占用较大的模型上下文。如果你只用得到其中几类，可以指定**工具集**，服务端只下发对应工具(基础工具始终包含)。

- 官方托管(远程):在地址后加 Query `?toolsets=...`，或加请求头 `X-Devops-Toolsets: ...`
- stdio 模式:加命令行参数 `--toolsets=...`，或环境变量 `DEVOPS_TOOLSETS=...`

可选值(逗号分隔):`code-management`、`organization-management`、`project-management`、`pipeline-management`、`packages-management`、`application-delivery`、`test-management`。不填则默认启用全部工具。

远程接入示例:

```json
{
  "mcpServers": {
    "yunxiao": {
      "url": "https://openapi-rdc.aliyuncs.com/ai/mcp?toolsets=code-management,project-management",
      "headers": { "Authorization": "Bearer <YOUR_TOKEN>" }
    }
  }
}
```

> 例:只启用 `code-management` 时工具数从 194 降到约 26。

### 4.2 Token 的其它传递方式(官方托管)

除了首选的 `Authorization: Bearer <TOKEN>`，还支持:

- 请求头 `X-Yunxiao-Token: <TOKEN>`
- Query String `?yunxiao_access_token=<TOKEN>`（⚠️ 会进访问日志，不推荐，仅在客户端无法自定义请求头时临时用）

---

## 5. Region 站用户指南

如果你使用的是**专有 Region 站**，云效已在**每个 region 独立部署**了 MCP 服务。你无需对接中心站，直接把客户端指向**你自己 region 域名的 `/ai/mcp`** 即可——域名就是你平时访问云效 region 的组织专属域名（如 `https://your-org.devops.aliyuncs.com`），后面拼上 `/ai/mcp`。

#### 方式 A:直接接入你的 Region MCP Server（推荐，免安装）

把第 2.2 节方式 A 的通用配置里的 `url` 换成你自己的 region 端点即可，认证方式与中心站完全一致:

```json
{
  "mcpServers": {
    "yunxiao": {
      "url": "https://your-org.devops.aliyuncs.com/ai/mcp",
      "headers": {
        "Authorization": "Bearer <YOUR_TOKEN>"
      }
    }
  }
}
```

Claude Code(命令行):

```bash
claude mcp add --transport http yunxiao https://your-org.devops.aliyuncs.com/ai/mcp \
  --header "Authorization: Bearer <YOUR_TOKEN>"
```

#### 方式 B:stdio 模式(本地 npx)

本地进程接入时，通过环境变量 `YUNXIAO_API_BASE_URL` 指向你的 region 域名:

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

> 服务会根据地址自动判断:域名含 `openapi-rdc.aliyuncs.com` 走中心站，否则按 Region 站处理。

---

## 6. 自建部署与开发者文档

想自己在本机或私有环境部署（stdio / SSE / Streamable HTTP）、用 Docker 运行，或了解项目实现细节,请到 GitHub 查看完整文档:

- 项目主页与完整 README:<https://github.com/aliyun/alibabacloud-devops-mcp-server>
- 官方托管服务详细指南(认证优先级、curl 自测、并发隔离、完整 FAQ):[hosted-mcp-guide.zh-CN.md](hosted-mcp-guide.zh-CN.md)

---

## 7. 相关链接

- [云效 DevOps 产品主页](https://www.aliyun.com/product/yunxiao)
- [MCP 市场(ModelScope)](https://modelscope.cn/mcp/servers/@aliyun/alibabacloud-devops-mcp-server)
- [GitHub 仓库](https://github.com/aliyun/alibabacloud-devops-mcp-server)
- 有问题可加入阿里云云效交流群(群号 **134400004101**)讨论。
