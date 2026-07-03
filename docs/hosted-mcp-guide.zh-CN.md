# 云效 DevOps MCP 官方托管服务使用指南

本文面向**使用者**，讲解如何把你的 AI 客户端（Cursor / Claude Desktop / Cline / 通义灵码 / 自研 Agent 等）接入云效官方托管的 MCP 服务。

> 与「自建」的区别：你**不需要** `npx` 安装、也**不需要** Docker 部署。官方已经把服务部署在线上，你只要把客户端指向服务地址、带上你的云效 Token 即可使用。

---

## 1. 服务地址

```
https://openapi-rdc.aliyuncs.com/ai/mcp
```

- **传输协议**：Streamable HTTP（MCP 官方推荐的远程传输）
- **会话模式**：Stateless（无状态）——无需维护会话，每个请求自包含
- 服务名：`alibabacloud-devops-mcp-server`

---

## 2. 前置准备：获取云效个人访问令牌（Token）

MCP 服务本身不持有任何身份，**所有操作都以你请求里携带的 Token 对应的云效身份执行**。使用前请先获取个人访问令牌：

1. 前往 [获取个人访问令牌](https://help.aliyun.com/zh/yunxiao/developer-reference/obtain-personal-access-token)。
2. 为令牌授予以下 API 的**读写权限**（按需最小授权亦可）：
   - 组织管理（Organization）
   - 项目协作（Projex）
   - 代码管理（Codeup）
   - 流水线管理（Flow）
   - 制品仓库管理（Packages）
   - 应用交付（AppStack）
   - 测试管理（Test）

> ⚠️ Token 等同于你的账号权限，请妥善保管，不要提交到代码仓库、不要贴到聊天/日志里。

---

## 3. 认证方式

服务支持 3 种传递 Token 的方式，**优先级从高到低**：

| 方式 | 写法 | 推荐度 |
|------|------|--------|
| 标准 Bearer 头 | `Authorization: Bearer <TOKEN>` | ✅ **首选**（生态兼容最好） |
| 自定义头 | `X-Yunxiao-Token: <TOKEN>` | ✅ 可用 |
| Query String | `?yunxiao_access_token=<TOKEN>` | ⚠️ 不推荐 |

> **为什么不推荐 Query String**：URL 会被网关 / 访问日志记录成明文，Token 有泄漏风险。仅在客户端无法自定义请求头的受限场景临时使用。

---

## 4. 客户端接入配置

远程 MCP 服务有两种主流接入姿势，按你的客户端能力选择其一。

### 方式 A：客户端原生支持远程 Streamable HTTP（推荐）

适用于 Cursor、以及其他支持 `url` + 自定义 `headers` 的新版客户端。在 MCP 配置文件中加入：

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

### 方式 B：客户端只支持 stdio，用 `mcp-remote` 做桥接

适用于仅支持 stdio、无法直接配置远程 URL 的客户端（部分版本的 Claude Desktop 等）。通过官方 `mcp-remote` 把远程服务桥接成本地 stdio：

```json
{
  "mcpServers": {
    "yunxiao": {
      "command": "npx",
      "args": [
        "-y", "mcp-remote",
        "https://openapi-rdc.aliyuncs.com/ai/mcp",
        "--header", "Authorization: Bearer <YOUR_TOKEN>"
      ]
    }
  }
}
```

> 把 `<YOUR_TOKEN>` 替换为第 2 步获取的令牌。配置完成后重启客户端，即可在工具列表里看到云效相关工具。

---

## 5. 提供的能力（工具）

服务当前提供 **194 个工具**，覆盖 8 大类：

| 工具集 | 内容 |
|--------|------|
| 基础（base） | 当前用户 / 组织信息等 |
| 代码管理（code-management） | 仓库、分支、文件、提交、合并请求（MR） |
| 组织管理（organization-management） | 组织、成员 |
| 项目协作（project-management） | 项目、工作项、迭代 |
| 流水线管理（pipeline-management） | 流水线、任务、服务连接 |
| 制品仓库（packages-management） | 制品仓库、制品 |
| 应用交付（application-delivery） | 应用、发布、编排、变更单等 |
| 测试管理（test-management） | 测试用例、测试计划、测试结果 |

接入后，直接用自然语言让 AI 调用即可，例如：
- “列出我所在的组织”
- “查看组织 xxx 下 repo-name 仓库的 master 分支”
- “给工作项 yyy 添加一条评论”

---

## 6. Region 站（专有域名）用户

官方托管服务默认对接云效**中心站**（`openapi-rdc.aliyuncs.com`）。若你使用的是**专有 Region 站**（组织独立域名，如 `https://your-org.devops.aliyuncs.com`），可在请求里额外带一个头，把后端指向你的实例：

```
X-Yunxiao-Api-Base-Url: https://your-org.devops.aliyuncs.com
```

在方式 A 里加到 `headers`，或在方式 B 里再加一组 `--header "X-Yunxiao-Api-Base-Url: https://your-org.devops.aliyuncs.com"`。

---

## 7. 自测（可选）

想在接入前用 `curl` 验证连通性与 Token 是否有效，可执行：

```bash
# 建议把 Token 放进环境变量，避免出现在命令历史/日志里
export YX_TOKEN='你的令牌'

curl -s "https://openapi-rdc.aliyuncs.com/ai/mcp" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -H "Authorization: Bearer $YX_TOKEN" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"get_current_user","arguments":{}}}'
```

返回你的用户信息（id / name / email）即表示接入正常。

---

## 8. 常见问题（FAQ）

**Q：调用返回 `405 Method Not Allowed: stateless mode only accepts POST`？**
A：MCP 请求必须用 **POST**。浏览器直接打开地址（GET）会得到 405，属正常现象。

**Q：返回 `Not Acceptable: Client must accept both application/json and text/event-stream`？**
A：请求头 `Accept` 必须**同时包含** `application/json` 和 `text/event-stream`。标准 MCP 客户端会自动带上；手写 HTTP 请求时容易漏掉。

**Q：返回 `401 Invalid token`？**
A：未携带 Token 或 Token 无效/过期。检查 `Authorization: Bearer` 是否正确、令牌是否有对应 API 权限。

**Q：`Unsupported Media Type: Content-Type must be application/json`？**
A：请求头需设置 `Content-Type: application/json`。

**Q：需要先调用 `initialize` 握手吗？需要管理 `Mcp-Session-Id` 吗？**
A：无状态模式下**都不需要**——可直接调用工具，服务端也不下发 session。标准客户端开箱即用；这条主要影响自研的裸 HTTP 客户端。

**Q：多个用户 / 多个 Token 并发调用，会串到别人的身份吗？**
A：不会。服务基于 Node.js `AsyncLocalStorage` 做请求级隔离，且无状态模式每个请求独立处理，Token 不会跨请求串号。

---

## 9. 安全须知

- Token 就是你的账号权限，切勿泄漏；建议用环境变量而非明文写入配置。
- 优先用 `Authorization: Bearer` / `X-Yunxiao-Token` 头传递 Token，**避免用 query string**（会进访问日志）。
- 如令牌疑似泄漏，请立即到云效控制台吊销并重新签发。
