# IFLOW.md

This file provides guidance to iFlow Cli when working with code in this repository.

## Common Commands

### Building
- `npm run build` - Compiles TypeScript code to JavaScript in the `dist` directory
- `npm run watch` - Continuously watches and compiles TypeScript files

### Running
- `npm start` - Runs the compiled server from `dist/index.js` in stdio mode
- `npm run start:sse` - Runs the compiled server from `dist/index.js` in SSE mode
- `npm run start:streamable` - Runs the compiled server in MCP Streamable HTTP mode (`/mcp` by default)
- `npm run start:both` - Runs SSE and Streamable HTTP on the same port (`--sse --streamable-http`)

### Development
- Use `npm run watch` during development for automatic recompilation
- The server entry point is `index.ts` which exports all functionality as an MCP server
- To run in SSE mode during development: `node dist/index.js --sse`
- To run in Streamable HTTP mode: `node dist/index.js --streamable-http` or `MCP_TRANSPORT=streamable-http`
- To run **both** transports: `MCP_TRANSPORT=both node dist/index.js`, or `node dist/index.js --sse --streamable-http`, or `npm run start:both`
- To run with specific toolsets: `node dist/index.js --toolsets=code-management,project-management`
- To enforce HTTP 401 auth on remote transports: `node dist/index.js --streamable-http --auth-check` (or `MCP_AUTH_CHECK=true`). Off by default; gates `initialize` / `tools/list` / `tools/call` with HTTP 401 + `WWW-Authenticate: Bearer` when the Yunxiao token is missing/invalid (token validity checked against Yunxiao with a 60s cache, fail-open)
- To force central vs region detection when `YUNXIAO_API_BASE_URL` is an internal address (e.g. a K8s service that doesn't contain `openapi-rdc.aliyuncs.com`): set `YUNXIAO_EDITION=central` (or `region`); this overrides the URL-based auto-detection

## Architecture Overview

This is an MCP (Model Context Protocol) server implementation that provides AI assistants with the ability to interact with Alibaba Cloud DevOps (Yunxiao) platform. 

The server is structured into several modules:

1. **Core Entry Point** (`index.ts`):
   - Initializes the MCP server
   - Registers available tools based on enabled toolsets
   - Handles tool requests and maps them to appropriate functions
   - Supports stdio, legacy SSE, Streamable HTTP, and **dual** mode (SSE + Streamable on one port)
   - Optional HTTP auth gate (`MCP_AUTH_CHECK` / `--auth-check`, off by default): returns HTTP 401 + `WWW-Authenticate` for unauthenticated `initialize` / `tools/list` / `tools/call`, so OAuth-capable clients can discover the auth requirement
   - Region vs central detection via `isRegionEdition()` (`common/utils.ts`): prefers `YUNXIAO_EDITION` (`central` | `region`), otherwise falls back to whether the API base URL contains `openapi-rdc.aliyuncs.com`

2. **Operations Modules** (in `operations/` directory):
   - `codeup/` - Contains functions for code repository operations (branches, files, repositories, change requests)
   - `flow/` - Contains functions for pipeline operations and service connections
   - `organization/` - Contains functions for organization and member management
   - `packages/` - Contains functions for package/artifact repository operations
   - `projex/` - Contains functions for project and work item management

3. **Common Modules** (in `common/` directory):
   - `types.ts` - Defines all Zod schemas for input validation
   - `errors.ts` - Custom error handling for Yunxiao API responses
   - `version.ts` - Version information for the server
   - `toolsets.ts` - Toolset definitions and configuration
   - `toolsetManager.ts` - Toolset management implementation

The server implements a standard MCP server pattern where:
1. Tools are registered with their schemas in the ListTools handler based on enabled toolsets
2. Actual tool execution happens in the CallTool handler, routed to appropriate toolset handlers
3. Each operation has a dedicated function file that makes API calls to Yunxiao
4. All inputs are validated using Zod schemas before processing

The server exposes dozens of tools covering:
- Code repository management (branches, files, repositories)
- Code review operations (change requests, comments)
- Project management (projects, work items, work item types)
- Pipeline management (pipelines, runs, jobs)
- Package repository management (artifacts, repositories)
- Organization management (members, departments, roles)
- Service connections management

## Toolsets

The server now supports toolsets, allowing you to enable only the tools you need. This can reduce the number of tools presented to the AI assistant and improve performance.

Available toolsets:
- `code-management`: Code repository management tools (includes commit management tools)
- `organization-management`: Organization management tools
- `project-management`: Project management tools (includes effort management tools)
- `pipeline-management`: Pipeline management tools (includes service connections, resource member, and VM deploy order tools)
- `packages-management`: Package repository management tools
- `application-delivery`: Application delivery tools

To use toolsets, you can specify them via command line arguments or environment variables:

1. Via command line argument:
```bash
npm start -- --toolsets=code-management,project-management
```

2. Via environment variable:
```bash
DEVOPS_TOOLSETS=code-management,project-management npm start
```

If no toolsets are specified, all tools will be enabled by default.

## SSE Mode

The server can run in SSE (Server-Sent Events) mode, which allows it to be accessed over HTTP instead of stdio. This is useful when deploying the server as a remote service.

To run in SSE mode:
1. Use `npm run start:sse` or `node dist/index.js --sse`
2. The server will start an HTTP server on port 3000 (configurable with PORT environment variable)
3. Clients can connect via SSE at `http://localhost:3000/sse`
4. Messages are sent to `http://localhost:3000/messages?sessionId=<session-id>`

In SSE mode, the server maintains sessions for each connected client, allowing for proper request/response correlation.

## Streamable HTTP Mode

1. Use `npm run start:streamable` or `node dist/index.js --streamable-http` (or `MCP_TRANSPORT=streamable-http`).
2. Default MCP endpoint: `http://localhost:3000/mcp` (override with `MCP_STREAMABLE_PATH`).
3. First request must be JSON-RPC `initialize` without `Mcp-Session-Id`; optional `yunxiao_access_token` and `yunxiao_api_base_url` query params apply to that session (same idea as SSE query params).
4. Later requests must send `Mcp-Session-Id` (and protocol headers per MCP); the server routes each session to its stored Yunxiao credentials.

## Dual transport (SSE + Streamable HTTP)

When `MCP_TRANSPORT=both` or both `--sse` and `--streamable-http` are set, one HTTP server exposes:

- Legacy SSE at `/sse` and `/messages?sessionId=...` (same behavior as SSE-only mode)
- Streamable HTTP at `/mcp` (same behavior as Streamable-only mode)

Session maps are independent per transport.