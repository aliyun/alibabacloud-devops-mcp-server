<p align="center">English | <a href="quickstart.zh-CN.md">中文</a><br></p>

# Yunxiao DevOps MCP — Quick Start

## 1. Introduction

The [Yunxiao (AlibabaCloud DevOps)](https://www.aliyun.com/product/yunxiao) MCP Server gives AI assistants the ability to interact with the Yunxiao platform — project collaboration, code management, pipelines, artifact repositories, application delivery, and more. Enterprise development teams can use it to assist with code reviews, streamline task management, run builds and deployments, and stay focused on innovation and product delivery.

Once connected, you can drive it with **natural language** from your AI assistant (Cursor / Claude / Lingma, etc.) to query work items, read code, open merge requests, and run pipelines. It covers:

- **Organization**: organization list, org info, departments, roles, members, etc.
- **Code**: repositories, branches, merge requests, file tree, etc.
- **Project**: projects, work items, work item fields, comments, time tracking, etc.
- **Pipeline**: pipelines, jobs, resources, tags, deployment management, etc.
- **Artifacts**: package repositories, artifact lists, etc.
- **Application delivery**: deploy orders, applications, app tags, variable groups, etc.
- **Test**: test cases, test case directories, test plans, test results, etc.

This guide is for **end users** — you can be up and running in 5 minutes. Developers who want to self-host or dig into internals, see [Section 6](#6-self-hosting-and-developer-docs).

---

## 2. Setup

### 2.1 Create a Yunxiao Token

The MCP service holds **no identity of its own** — every operation runs as the Yunxiao identity of the Token you send with each request. Before you start, get a personal access token:

1. Go to [Obtain a personal access token](https://help.aliyun.com/zh/yunxiao/developer-reference/obtain-personal-access-token).
2. Grant the token **read/write** permissions for the APIs you need (least-privilege is fine): Organization, Project, Code, Pipeline, Packages, Application Delivery, Test.

> ⚠️ A Token is equivalent to your account permissions. Keep it safe: never commit it to a repo, and never paste it into chats or logs.

### 2.2 Connect to the MCP service

There are two ways to connect — **pick one**. Replace `<YOUR_TOKEN>` in the config with the token from the previous step, then restart your client; the Yunxiao tools will show up in its tool list.

#### Option A: Connect to the official hosted MCP Server (recommended, no install)

Yunxiao already runs the service online. Just point your client at the address below and pass your Token — **no** `npx`, **no** Docker.

```
https://openapi-rdc.aliyuncs.com/ai/mcp
```

**Generic config** — for clients that support remote MCP (`url` + custom `headers`), such as Cursor, Cline, Cherry Studio, Lingma. The syntax is the same across them:

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

**Cursor**: open `Settings → MCP → Add new global MCP server`, or edit `~/.cursor/mcp.json` directly, and paste the generic config above.

**Claude Code (CLI)**: add the remote server with a single command:

```bash
claude mcp add --transport http yunxiao https://openapi-rdc.aliyuncs.com/ai/mcp \
  --header "Authorization: Bearer <YOUR_TOKEN>"
```

Verify with `claude mcp list`, or type `/mcp` in a conversation to check the connection status.

**Lingma / other clients**: paste the generic config JSON into the client's MCP settings. If a client cannot set custom `headers`, you can fall back to passing the Token via query string (not recommended — the Token ends up in access logs): `https://openapi-rdc.aliyuncs.com/ai/mcp?yunxiao_access_token=<YOUR_TOKEN>`.

#### Option B: Connect via stdio mode (local npx)

For clients that don't support remote MCP, or that prefer a local process (e.g. Claude Desktop). Requires **Node.js ≥ 18** on your machine; the first run pulls the package automatically via `npx`.

Using Claude Desktop as an example, edit its config file:

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

> Other clients that support launching via `command` (Cursor, Lingma, etc.) can connect the same way using `command` / `args` / `env`.

---

## 3. Usage

Once connected, just ask your AI assistant in natural language. For example:

- "List the organizations I belong to"
- "Show the last 10 commits on the master branch of repo-name in org xxx"
- "Open a merge request from my current branch to master, titled ..."
- "Show the work items assigned to me in project yyy that aren't done yet"
- "Add a comment to work item #12345: integration testing complete"
- "Which pipeline failed most recently? Pull its failure logs"

The assistant picks the right tools automatically and runs them under your identity.

---

## 4. Extra configuration knobs

### 4.1 Trim toolsets (reduce context usage)

The service provides **194 tools** across 8 categories. Too many tools consume a large chunk of the model's context. If you only need some of them, specify **toolsets** so the server only exposes those (the base tools are always included).

- Hosted (remote): append the query `?toolsets=...`, or add the header `X-Devops-Toolsets: ...`
- stdio mode: add the CLI arg `--toolsets=...`, or the env var `DEVOPS_TOOLSETS=...`

Valid values (comma-separated): `code-management`, `organization-management`, `project-management`, `pipeline-management`, `packages-management`, `application-delivery`, `test-management`. If omitted, all tools are enabled by default.

Remote example:

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

> Example: enabling only `code-management` drops the tool count from 194 to about 26.

### 4.2 Other ways to pass the Token (hosted)

Besides the preferred `Authorization: Bearer <TOKEN>`, the service also accepts:

- Header `X-Yunxiao-Token: <TOKEN>`
- Query string `?yunxiao_access_token=<TOKEN>` (⚠️ ends up in access logs; not recommended — use only when the client cannot set custom headers)

---

## 5. Region Edition users

If you're on a **dedicated Region edition**, Yunxiao has already deployed the MCP service **independently in each region**. You don't need to go through the Central Station — just point your client at **your own region domain + `/ai/mcp`**. That domain is the organization-specific domain you use to access Yunxiao in your region (e.g. `https://your-org.devops.aliyuncs.com`), with `/ai/mcp` appended.

#### Option A: Connect directly to your Region MCP Server (recommended, no install)

Take the generic config from section 2.2 Option A and replace the `url` with your own region endpoint; authentication is exactly the same as the Central Station:

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

Claude Code (CLI):

```bash
claude mcp add --transport http yunxiao https://your-org.devops.aliyuncs.com/ai/mcp \
  --header "Authorization: Bearer <YOUR_TOKEN>"
```

#### Option B: stdio mode (local npx)

For local-process access, point the `YUNXIAO_API_BASE_URL` env var at your region domain:

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

> The service auto-detects the mode from the address: a domain containing `openapi-rdc.aliyuncs.com` uses the Central Station; anything else is treated as a Region edition.

---

## 6. Self-hosting and developer docs

To deploy it yourself locally or in a private environment (stdio / SSE / Streamable HTTP), run it with Docker, or learn about the internals, see the full docs on GitHub:

- Project home and full README: <https://github.com/aliyun/alibabacloud-devops-mcp-server>
- Detailed hosted-service guide (auth priority, curl self-test, concurrency isolation, full FAQ — in Chinese): [hosted-mcp-guide.zh-CN.md](hosted-mcp-guide.zh-CN.md)

---

## 7. Links

- [Yunxiao DevOps product page](https://www.aliyun.com/product/yunxiao)
- [MCP marketplace (ModelScope)](https://modelscope.cn/mcp/servers/@aliyun/alibabacloud-devops-mcp-server)
- [GitHub repository](https://github.com/aliyun/alibabacloud-devops-mcp-server)
- Questions? Join the Alibaba Cloud DevOps group (ID **134400004101**).
