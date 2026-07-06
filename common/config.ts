import { Toolset } from "./toolsets.js";
import type { ClusterConfig } from "./process-manager.js";
import { resolveWorkerCount } from "./process-manager.js";

export interface ServerConfig {
  port: number;
  host: string;
  allowedHosts: string[];

  transport: {
    sse: boolean;
    streamableHttp: boolean;
  };

  paths: {
    sse: string;
    sseMessages: string;
    streamableHttp: string;
  };

  stateless: boolean;

  // HTTP 层鉴权 gate 开关：开启后对 tools/call 校验云效 token，
  // 无 token / token 无效时返回 HTTP 401（供上游 OAuth 发现使用）。
  // 默认关闭：自建 + env token 的单用户场景无需验证。
  authCheck: boolean;

  cluster: ClusterConfig;

  toolsets: Toolset[];
}

function parseEnabledToolsets(input: string | undefined): Toolset[] {
  if (!input) return [];
  return input.split(",").map((toolset) => {
    const trimmed = toolset.trim() as Toolset;
    if (!Object.values(Toolset).includes(trimmed)) {
      throw new Error(`Unknown toolset: ${trimmed}`);
    }
    return trimmed;
  });
}

export function loadConfig(): ServerConfig {
  const mcpTransportEnv = process.env.MCP_TRANSPORT;

  const wantSse =
    process.argv.includes("--sse") ||
    mcpTransportEnv === "sse" ||
    mcpTransportEnv === "both";

  const wantStreamable =
    process.argv.includes("--streamable-http") ||
    mcpTransportEnv === "streamable-http" ||
    mcpTransportEnv === "both";

  const allowedHostsEnv = process.env.MCP_ALLOWED_HOSTS;

  return {
    port: Number(process.env.PORT) || 3000,
    host: process.env.MCP_HTTP_HOST || "0.0.0.0",
    allowedHosts: allowedHostsEnv
      ? allowedHostsEnv.split(",").map((s) => s.trim()).filter(Boolean)
      : [],

    transport: {
      sse: wantSse,
      streamableHttp: wantStreamable,
    },

    paths: {
      sse: process.env.MCP_SSE_PATH || "/sse",
      sseMessages: process.env.MCP_SSE_MESSAGES_PATH || "/messages",
      streamableHttp: process.env.MCP_STREAMABLE_PATH || "/mcp",
    },

    stateless:
      process.argv.includes("--stateless") ||
      process.env.MCP_STATELESS === "true",

    authCheck:
      process.argv.includes("--auth-check") ||
      process.env.MCP_AUTH_CHECK === "true",

    cluster: {
      enabled:
        process.argv.includes("--cluster") ||
        process.env.MCP_CLUSTER === "true",
      workers: resolveWorkerCount(
        process.argv.find((a) => a.startsWith("--workers="))?.split("=")[1] ||
          process.env.MCP_CLUSTER_WORKERS,
      ),
    },

    toolsets: parseEnabledToolsets(
      process.argv.find((arg) => arg.startsWith("--toolsets="))?.split("=")[1] ||
        process.env.DEVOPS_TOOLSETS,
    ),
  };
}
