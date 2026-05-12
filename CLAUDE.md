# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

`alibabacloud-devops-mcp-server` is an MCP (Model Context Protocol) server that exposes the Alibaba Cloud Yunxiao DevOps OpenAPI as ~165 tools across code, project, pipeline, application delivery, packages and test toolsets. TypeScript, ESM, Node ≥ 18, MCP SDK `@modelcontextprotocol/sdk`.

## Common commands

```bash
npm run build           # tsc → dist/, then chmod +x dist/*.js
npm run watch           # tsc --watch during development
npm start               # stdio transport (default)
npm run start:sse       # SSE: /sse + /messages
npm run start:streamable # Streamable HTTP: /mcp
npm run start:both      # SSE + Streamable HTTP on the same port

# Run a subset of toolsets (also via DEVOPS_TOOLSETS env)
node dist/index.js --toolsets=code-management,project-management

# Local debug helpers (start a server + MCP Inspector)
bash debug-sse.sh
bash debug-streamable-http.sh
bash debug-both.sh

# Regenerate tools.json snapshot (requires a prior build)
node export-tools.mjs            # writes tools.json
```

There is no test runner, lint, or formatter configured — `tsc` is the only static check (`npm run build`).

## Architecture

The codebase is organized around a **three-tier registry/handler/operation pattern**, one per MCP tool:

1. `operations/<area>/*.ts` — pure functions that call the Yunxiao OpenAPI via `common/utils.ts → yunxiaoRequest`. Validate responses with Zod. Areas: `codeup` (repos/branches/files/MRs/commits), `projex` (projects/work items/sprints/efforts/attachments/versions), `flow` (pipelines/jobs/service connections/VM deploy/tags), `appstack` (applications/orchestrations/change requests/release workflows/variable groups/tags/templates), `organization`, `packages`, `testhub`.
2. `tool-registry/<module>.ts` — exports a `get*Tools()` returning MCP tool descriptors (`name`, `description`, `inputSchema` from `zodToJsonSchema`). Schemas live in `common/types.ts` (re-exported from per-area `types.ts`).
3. `tool-handlers/<module>.ts` — exports `handle*Tools(request)` with a `switch (request.params.name)` that parses args with the matching Zod schema and calls the operation. **MUST return `null` when the tool name is not handled** — handlers are composed by chaining and `null` means "try the next one".

`common/toolsetManager.ts` maps each `Toolset` (enum in `common/toolsets.ts`) to the union of registry modules it bundles, and `tool-handlers/index.ts` mirrors that bundling with `composeHandlers(...)`. **These two mappings must stay in sync** — if a toolset's registry includes a sub-module's tools but its handler chain does not, calls to those tools fail with `Unknown tool` when only that toolset is enabled. The base toolset (`get_current_organization_info`, `get_user_organizations`, `get_current_user`) is always loaded.

`index.ts` is the entry point. It builds an MCP `Server` per session (required: `server.connect()` is one-shot per instance) and wires three transports:
- **stdio** (default)
- **SSE** at `/sse` + `/messages?sessionId=...` (legacy)
- **Streamable HTTP** at `/mcp` (preferred remote; first request must be JSON-RPC `initialize` without `Mcp-Session-Id`; later requests must send the header)

Per-session Yunxiao credentials come from query params (`yunxiao_access_token`, `yunxiao_api_base_url`) or headers (`x-yunxiao-token`, `x-yunxiao-api-base-url`), and are stashed in `common/utils.ts` module state (`setCurrentSessionToken`, `setCurrentSessionApiBaseUrl`) right before each request is dispatched. Stdio falls back to `YUNXIAO_ACCESS_TOKEN` / `YUNXIAO_API_BASE_URL` env vars.

### Region edition vs central station

`isRegionEdition()` (in `common/utils.ts`) is true when `YUNXIAO_API_BASE_URL` does **not** contain `openapi-rdc.aliyuncs.com`. Many operations use this to pick the URL shape:
- Central: `/oapi/v1/codeup/organizations/{orgId}/repositories/...`
- Region: `/oapi/v1/codeup/repositories/...` (no `organizations/{orgId}` segment)

In region mode, `organizationId` is optional and `resolveOrganizationId(undefined)` returns `getRegionDefaultOrganizationId()` (defaults to `"default"`, override via `YUNXIAO_REGION_DEFAULT_ORG_ID`). Any new operation that talks to `/oapi/...` should branch on `isRegionEdition()` if the central path embeds `organizationId`.

## Adding a tool

1. Add the operation in `operations/<area>/<file>.ts` and the input schema in `operations/<area>/types.ts`. Re-export the schema from `common/types.ts`.
2. Add the descriptor to `tool-registry/<module>.ts` (`get*Tools()` array).
3. Add a `case "<tool_name>":` to the matching `tool-handlers/<module>.ts` switch.
4. If the tool belongs to a toolset that's a *bundle* of registry modules (e.g. `application-delivery`, `pipeline-management`, `project-management`, `code-management`), confirm both `common/toolsetManager.ts` (registry side) and `tool-handlers/index.ts → HANDLER_MAP` (handler side) include your module. Otherwise the tool will 404 when only that toolset is enabled.
5. If the tool's path uses `repositoryId`, route it through `handleRepositoryIdEncoding()` to get correct slash encoding.
6. Run `npm run build` and (optionally) `node export-tools.mjs` to refresh `tools.json` and `skills/alibabacloud-devops/SKILL.md` if you want the docs in sync.

## Notes

- All internal logging goes to `stderr` via `console.error` so it does not corrupt stdio JSON-RPC framing.
- `common/types.ts` is the single source of truth for tool input shapes — registry and handler import from it; do not duplicate Zod schemas in handlers.
- `IFLOW.md` is a near-duplicate of this guide kept for the iFlow CLI; if you change architecture-relevant facts here, mirror them there.
- `docs/*.swagger.json` and `appstack/appstack.swagger.json` are reference OpenAPI specs for the upstream Yunxiao APIs — useful when adding new operations.
