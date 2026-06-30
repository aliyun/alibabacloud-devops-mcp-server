import { Toolset } from "./toolsets.js";

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

    toolsets: parseEnabledToolsets(
      process.argv.find((arg) => arg.startsWith("--toolsets="))?.split("=")[1] ||
        process.env.DEVOPS_TOOLSETS,
    ),
  };
}
