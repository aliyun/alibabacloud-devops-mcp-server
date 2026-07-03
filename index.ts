#!/usr/bin/env node
import { randomUUID } from "node:crypto";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { createMcpExpressApp } from "@modelcontextprotocol/sdk/server/express.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import {
    CallToolRequestSchema,
    isInitializeRequest,
    ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

import * as branches from './operations/codeup/branches.js';
import * as files from './operations/codeup/files.js';
import * as repositories from './operations/codeup/repositories.js';
import * as changeRequests from './operations/codeup/changeRequests.js';
import * as changeRequestComments from './operations/codeup/changeRequestComments.js';
import * as organization from './operations/organization/organization.js';
import * as members from './operations/organization/members.js';
import * as project from './operations/projex/project.js';
import * as workitem from './operations/projex/workitem.js';
import * as sprint from './operations/projex/sprint.js';
import * as compare from './operations/codeup/compare.js'
import * as pipeline from './operations/flow/pipeline.js'
import * as pipelineJob from './operations/flow/pipelineJob.js'
import * as serviceConnection from './operations/flow/serviceConnection.js'
import * as packageRepositories from './operations/packages/repositories.js'
import * as artifacts from './operations/packages/artifacts.js'
import {
    isYunxiaoError,
    YunxiaoError,
    YunxiaoValidationError
} from "./common/errors.js";
import { VERSION } from "./common/version.js";
import {config} from "dotenv";
import * as types from "./common/types.js";
import { getAllTools, getEnabledTools } from "./tool-registry/index.js";
import { handleToolRequest, handleEnabledToolRequest } from "./tool-handlers/index.js";
import { Toolset } from "./common/toolsets.js";
import { loadConfig, type ServerConfig } from "./common/config.js";
import { runWithCluster, setupWorkerGuards } from "./common/process-manager.js";
import { logger } from "./common/logger.js";
import { getCurrentToolsets } from "./common/utils.js";

/**
 * Create a new MCP Server instance with all request handlers configured.
 * Each SSE session needs its own Server instance since server.connect()
 * can only be called once per Server.
 */
function createMcpServer(): Server {
    const mcpServer = new Server(
        {
            name: "alibabacloud-devops-mcp-server",
            version: VERSION,
        },
        {
            capabilities: {
                tools: {},
            },
        }
    );

    mcpServer.setRequestHandler(ListToolsRequestSchema, async () => {
        let tools: any[];

        // 优先使用本次请求指定的工具集（缓解工具过多导致的 context 膨胀），
        // 未指定时回退到进程级默认 enabledToolsets。
        const effective = effectiveToolsets();
        if (effective.length > 0) {
            const baseTools = getEnabledTools([Toolset.BASE]);
            const enabledTools = getEnabledTools(effective);
            tools = [...baseTools, ...enabledTools];
        } else {
            tools = getAllTools();
        }

        return {
            tools,
        };
    });

    mcpServer.setRequestHandler(CallToolRequestSchema, async (request) => {
        try {
            if (!request.params.arguments) {
                throw new Error("Arguments are required");
            }

            const effective = effectiveToolsets();
            const result = effective.length > 0
                ? await handleEnabledToolRequest(request, effective)
                : await handleToolRequest(request);

            return result;
        } catch (error) {
            if (error instanceof z.ZodError) {
                throw new Error(`Invalid input: ${JSON.stringify(error.errors)}`);
            }
            if (isYunxiaoError(error)) {
                throw new Error(formatYunxiaoError(error));
            }
            throw error;
        }
    });

    return mcpServer;
}

function formatYunxiaoError(error: YunxiaoError): string {
    let message = `Yunxiao API Error: ${error.message}`;

    // 添加请求上下文信息
    if (error.method || error.url) {
        message += `\n Request: ${error.method || 'GET'} ${error.url || 'unknown'}`;
    }
    
    if (error.requestHeaders) {
        message += `\n Request Headers: ${JSON.stringify(error.requestHeaders, null, 2)}`;
    }
    
    if (error.requestBody) {
        message += `\n Request Body: ${JSON.stringify(error.requestBody, null, 2)}`;
    }

    if (error instanceof YunxiaoValidationError) {
        message = `Parameter validation failed: ${error.message}`;
        if (error.response) {
            message += `\n Response: ${JSON.stringify(error.response, null, 2)}`;
        }
        // 添加常见参数错误的提示
        if (error.message.includes('name')) {
            message += `\n Suggestion: Please check whether the pipeline name meets the requirements.`;
        }
        if (error.message.includes('content') || error.message.includes('yaml')) {
            message += `\n Suggestion: Please check whether the generated YAML format is correct.`;
        }
    } else {
        // 处理通用的Yunxiao错误
        message = `Yunxiao API error (${error.status}): ${error.message}`;
        if (error.response) {
            const response = error.response as any;
            if (response.errorCode) {
                message += `\n errorCode: ${response.errorCode}`;
            }
            if (response.errorMessage && response.errorMessage !== error.message) {
                message += `\n errorMessage: ${response.errorMessage}`;
            }
            if (response.data && typeof response.data === 'object') {
                message += `\n data: ${JSON.stringify(response.data, null, 2)}`;
            }
            
            // 如果响应体中有更多详细信息，也一并显示
            if (Object.keys(response).length > 0) {
                message += `\n Full Response: ${JSON.stringify(response, null, 2)}`;
            }
        }
        
        // 根据状态码提供通用建议
        switch (error.status) {
            case 400:
                message += `\n Suggestion: Please check whether the request parameters are correct, especially whether all required parameters have been provided.`;
                break;
            case 500:
                message += `\n Suggestion: Internal server error. Please try again later or contact technical support.`;
                break;
            case 502:
            case 503:
            case 504:
                message += `\n Suggestion: The service is temporarily unavailable. Please try again later.`;
                break;
        }
    }

    return message;
}

config({ quiet: true });

const serverConfig = loadConfig();
const enabledToolsets = serverConfig.toolsets;
const useHttpRemote = serverConfig.transport.sse || serverConfig.transport.streamableHttp;

type StreamableSessionEntry = {
    transport: StreamableHTTPServerTransport;
    server: Server;
    yunxiao_access_token?: string;
    yunxiao_api_base_url?: string;
    toolsets?: string[];
};

function getMcpSessionIdHeader(req: { headers: Record<string, string | string[] | undefined> }): string | undefined {
    const raw = req.headers['mcp-session-id'];
    return typeof raw === 'string' ? raw : undefined;
}

function parseBearerToken(authHeader: string | string[] | undefined): string | undefined {
    if (typeof authHeader !== 'string') return undefined;
    const match = authHeader.match(/^Bearer\s+(.+)$/i);
    return match ? match[1] : undefined;
}

function resolveYunxiaoAuth(
    req: { query: Record<string, unknown>; headers: Record<string, string | string[] | undefined> },
    sessionAuth?: { yunxiao_access_token?: string; yunxiao_api_base_url?: string },
): { token?: string; apiBaseUrl?: string } {
    const qTok = req.query['yunxiao_access_token'];
    const qBase = req.query['yunxiao_api_base_url'];
    const tokenFromQuery = typeof qTok === 'string' ? qTok : undefined;
    const baseFromQuery = typeof qBase === 'string' ? qBase : undefined;
    const hdrTok = req.headers['x-yunxiao-token'];
    const hdrBase = req.headers['x-yunxiao-api-base-url'];
    const tokenFromHeader = typeof hdrTok === 'string' ? hdrTok : undefined;
    const baseFromHeader = typeof hdrBase === 'string' ? hdrBase : undefined;
    const tokenFromBearer = parseBearerToken(req.headers['authorization']);

    return {
        token: tokenFromQuery || tokenFromHeader || tokenFromBearer || sessionAuth?.yunxiao_access_token || process.env.YUNXIAO_ACCESS_TOKEN,
        apiBaseUrl: baseFromQuery || baseFromHeader || sessionAuth?.yunxiao_api_base_url || undefined,
    };
}

/**
 * 从请求中解析本次希望启用的工具集：
 * - query: ?toolsets=code-management,project-management
 * - header: X-Devops-Toolsets: code-management,project-management
 * 返回原始字符串数组（未做合法性校验），未指定则返回 undefined。
 */
function resolveToolsets(
    req: { query: Record<string, unknown>; headers: Record<string, string | string[] | undefined> },
): string[] | undefined {
    const q = req.query['toolsets'];
    const h = req.headers['x-devops-toolsets'];
    const raw = (typeof q === 'string' ? q : undefined) ?? (typeof h === 'string' ? h : undefined);
    if (!raw) return undefined;
    const parts = raw.split(',').map((s) => s.trim()).filter((s) => s.length > 0);
    return parts.length > 0 ? parts : undefined;
}

/** 将原始工具集字符串校验并转换为 Toolset 枚举，非法项忽略并告警。 */
function toValidToolsets(raw: string[] | undefined): Toolset[] {
    if (!raw || raw.length === 0) return [];
    const valid = Object.values(Toolset) as string[];
    const out: Toolset[] = [];
    for (const t of raw) {
        if (valid.includes(t)) {
            out.push(t as Toolset);
        } else {
            logger.warn({ toolset: t }, "ignoring unknown toolset from request");
        }
    }
    return out;
}

/**
 * 计算本次请求的有效工具集：优先用请求指定的（校验后），
 * 否则回退到进程级默认 enabledToolsets。返回空数组表示“全部工具”。
 */
function effectiveToolsets(): Toolset[] {
    const perReq = toValidToolsets(getCurrentToolsets());
    return perReq.length > 0 ? perReq : enabledToolsets;
}

function bodyLooksLikeInitialize(body: unknown): boolean {
    const messages = Array.isArray(body) ? body : [body];
    return messages.some((m) => typeof m === 'object' && m !== null && isInitializeRequest(m));
}

type SseSessionEntry = {
    transport: SSEServerTransport;
    server: Server;
    yunxiao_access_token?: string;
    yunxiao_api_base_url?: string;
    toolsets?: string[];
};

async function registerSseRoutes(
    app: any,
    sessions: Record<string, SseSessionEntry>,
    cfg: ServerConfig,
    options: { installJsonParser: boolean },
): Promise<void> {
    app.get(cfg.paths.sse, async (req: any, res: any) => {
        logger.info({ ip: req.ip }, "new SSE connection");

        const { token: yunxiao_access_token, apiBaseUrl: yunxiao_api_base_url } = resolveYunxiaoAuth(req);

        // 只记录是否携带 token，绝不打印 token 本身
        logger.debug({ hasToken: !!yunxiao_access_token, apiBaseUrl: yunxiao_api_base_url || null }, "SSE resolved auth");

        const sessionServer = createMcpServer();
        const sseTransport = new SSEServerTransport(cfg.paths.sseMessages, res);
        const sessionId = sseTransport.sessionId;

        if (sessionId) {
            sessions[sessionId] = {
                transport: sseTransport,
                server: sessionServer,
                yunxiao_access_token,
                yunxiao_api_base_url,
                toolsets: resolveToolsets(req),
            };
        }

        try {
            await sessionServer.connect(sseTransport);
            logger.info(
                { sessionId, auth: yunxiao_access_token ? "custom" : "env-default" },
                "MCP server connected via SSE",
            );
        } catch (error) {
            logger.error({ err: error }, "failed to start SSE server");
            res.status(500).send('Server error');
        }
    });

    if (options.installJsonParser) {
        const { default: express } = await import('express');
        app.use(express.json({ limit: '10mb' }));
    }

    app.post(cfg.paths.sseMessages, async (req: any, res: any) => {
        const sessionId = req.query.sessionId as string;
        const session = sessions[sessionId];

        if (!session) {
            res.status(404).send('Session not found');
            return;
        }

        try {
            const { runWithAuth } = await import('./common/utils.js');
            const auth = resolveYunxiaoAuth(req, session);
            const toolsets = resolveToolsets(req) ?? session.toolsets;
            logger.debug(
                { sessionId, hasToken: !!auth.token, apiBaseUrl: auth.apiBaseUrl || null },
                "SSE POST message",
            );

            await runWithAuth({ ...auth, toolsets }, () => session.transport.handlePostMessage(req, res, req.body));
        } catch (error) {
            logger.error({ err: error }, "error handling SSE POST message");
            if (!res.headersSent) {
                res.status(500).send('Server error');
            }
        }
    });
}

function registerStreamableRoutes(
    app: any,
    utils: typeof import('./common/utils.js'),
    streamSessions: Map<string, StreamableSessionEntry>,
    mcpPath: string,
): void {
    app.use(mcpPath, (req: any, res: any, next: any) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
        res.setHeader(
            'Access-Control-Allow-Headers',
            'Content-Type, Accept, Mcp-Session-Id, Mcp-Protocol-Version, Authorization, X-Yunxiao-Token, X-Yunxiao-Api-Base-Url, X-Devops-Toolsets',
        );
        if (req.method === 'OPTIONS') {
            res.status(204).end();
            return;
        }
        next();
    });

    app.all(mcpPath, async (req: any, res: any) => {
        const sessionIdHeader = getMcpSessionIdHeader(req);

        if (sessionIdHeader) {
            const entry = streamSessions.get(sessionIdHeader);
            if (!entry) {
                res.status(404).json({
                    jsonrpc: '2.0',
                    error: { code: -32001, message: 'Session not found' },
                    id: null,
                });
                return;
            }
            const auth = resolveYunxiaoAuth(req, entry);
            const toolsets = resolveToolsets(req) ?? entry.toolsets;
            const parsedBody = req.method === 'POST' ? req.body : undefined;
            await utils.runWithAuth({ ...auth, toolsets }, () => entry.transport.handleRequest(req, res, parsedBody));
            return;
        }

        if (req.method !== 'POST') {
            res.status(400).json({
                jsonrpc: '2.0',
                error: {
                    code: -32600,
                    message: 'Bad Request: Mcp-Session-Id header is required except for POST initialize',
                },
                id: null,
            });
            return;
        }

        if (!bodyLooksLikeInitialize(req.body)) {
            res.status(400).json({
                jsonrpc: '2.0',
                error: {
                    code: -32600,
                    message: 'Bad Request: first request must be initialize without Mcp-Session-Id',
                },
                id: null,
            });
            return;
        }

        const { token: yunxiao_access_token, apiBaseUrl: yunxiao_api_base_url } = resolveYunxiaoAuth(req);
        const toolsets = resolveToolsets(req);
        const sessionServer = createMcpServer();

        let transport!: StreamableHTTPServerTransport;
        transport = new StreamableHTTPServerTransport({
            sessionIdGenerator: () => randomUUID(),
            onsessioninitialized: async (sid) => {
                streamSessions.set(sid, {
                    transport,
                    server: sessionServer,
                    yunxiao_access_token,
                    yunxiao_api_base_url,
                    toolsets,
                });
                logger.info({ sessionId: sid }, "Streamable HTTP MCP session initialized");
            },
            onsessionclosed: async (sid) => {
                streamSessions.delete(sid);
                logger.info({ sessionId: sid }, "Streamable HTTP MCP session closed");
            },
        });

        await sessionServer.connect(transport);

        logger.info(
            { ip: req.ip, auth: yunxiao_access_token ? "custom" : "env-default" },
            "new Streamable HTTP connection",
        );

        await utils.runWithAuth({ token: yunxiao_access_token, apiBaseUrl: yunxiao_api_base_url, toolsets }, () =>
            transport.handleRequest(req, res, req.body),
        );
    });
}

function registerStatelessStreamableRoutes(
    app: any,
    utils: typeof import('./common/utils.js'),
    mcpPath: string,
): void {
    app.use(mcpPath, (req: any, res: any, next: any) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
        res.setHeader(
            'Access-Control-Allow-Headers',
            'Content-Type, Accept, Mcp-Session-Id, Mcp-Protocol-Version, Authorization, X-Yunxiao-Token, X-Yunxiao-Api-Base-Url, X-Devops-Toolsets',
        );
        if (req.method === 'OPTIONS') {
            res.status(204).end();
            return;
        }
        next();
    });

    app.all(mcpPath, async (req: any, res: any) => {
        if (req.method !== 'POST') {
            res.status(405).json({
                jsonrpc: '2.0',
                error: { code: -32600, message: 'Method Not Allowed: stateless mode only accepts POST' },
                id: null,
            });
            return;
        }

        const auth = resolveYunxiaoAuth(req);
        const toolsets = resolveToolsets(req);
        const server = createMcpServer();
        const transport = new StreamableHTTPServerTransport({
            sessionIdGenerator: undefined,
            enableJsonResponse: true,
        });

        await server.connect(transport);

        try {
            await utils.runWithAuth({ ...auth, toolsets }, () => transport.handleRequest(req, res, req.body));
        } finally {
            await transport.close();
            await server.close();
        }
    });
}

async function runServer() {
    if (useHttpRemote) {
        const utils = await import('./common/utils.js');
        const { port, host, allowedHosts, transport, paths } = serverConfig;

        let app: any;
        if (transport.streamableHttp) {
            app =
                allowedHosts.length > 0
                    ? createMcpExpressApp({ host, allowedHosts })
                    : createMcpExpressApp({ host });
        } else {
            const { default: express } = await import('express');
            app = express();
        }

        // 轻量健康检查端点（供 ALB 后端健康检查 / K8s 存活就绪探针使用）。
        // 挂在根路径，不依赖任何 transport 或鉴权，始终返回 200。
        app.get('/healthz', (_req: any, res: any) => {
            res.status(200).json({ status: 'ok' });
        });

        const sseSessions: Record<string, SseSessionEntry> = {};
        const streamSessions = new Map<string, StreamableSessionEntry>();

        if (transport.sse) {
            await registerSseRoutes(app, sseSessions, serverConfig, { installJsonParser: !transport.streamableHttp });
        }

        if (transport.streamableHttp) {
            if (serverConfig.stateless) {
                registerStatelessStreamableRoutes(app, utils, paths.streamableHttp);
            } else {
                registerStreamableRoutes(app, utils, streamSessions, paths.streamableHttp);
            }
        }

        const serverInstance: any = app.listen(port, () => {
            const modes: string[] = [];
            if (transport.sse) modes.push(`SSE (${paths.sse}, ${paths.sseMessages})`);
            if (transport.streamableHttp) modes.push(`Streamable HTTP${serverConfig.stateless ? ' (stateless)' : ''} (${paths.streamableHttp})`);
            logger.info({ port, modes }, "Yunxiao MCP Server running");
        });

        process.on('SIGINT', () => {
            logger.info("shutting down HTTP server...");
            serverInstance.close(() => {
                logger.info("server closed");
                process.exit(0);
            });
        });
    } else {
        const server = createMcpServer();
        const transport = new StdioServerTransport();
        await server.connect(transport);
    }
}

if (useHttpRemote) {
    runWithCluster(serverConfig.cluster, runServer);
} else {
    setupWorkerGuards();
    runServer().catch((error) => {
        process.exit(1);
    });
}