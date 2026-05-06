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
        
        if (enabledToolsets.length > 0) {
            const baseTools = getEnabledTools([Toolset.BASE]);
            const enabledTools = getEnabledTools(enabledToolsets);
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

            const result = enabledToolsets.length > 0 
                ? await handleEnabledToolRequest(request, enabledToolsets)
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

// 解析启用的工具集
const parseEnabledToolsets = (input: string | undefined): Toolset[] => {
  if (!input) return [];
  
  return input.split(',').map(toolset => {
    const trimmed = toolset.trim() as Toolset;
    // 验证工具集名称是否有效
    if (!Object.values(Toolset).includes(trimmed)) {
      throw new Error(`Unknown toolset: ${trimmed}`);
    }
    return trimmed;
  });
};

// 获取启用的工具集（从命令行参数或环境变量）
const enabledToolsets = parseEnabledToolsets(
  process.argv.find(arg => arg.startsWith('--toolsets='))?.split('=')[1] || 
  process.env.DEVOPS_TOOLSETS
);

// Remote transports: SSE and/or Streamable HTTP (can run together on one port)
const mcpTransportEnv = process.env.MCP_TRANSPORT;
const wantSse =
    process.argv.includes('--sse') ||
    mcpTransportEnv === 'sse' ||
    mcpTransportEnv === 'both';
const wantStreamable =
    process.argv.includes('--streamable-http') ||
    mcpTransportEnv === 'streamable-http' ||
    mcpTransportEnv === 'both';
const useHttpRemote = wantSse || wantStreamable;

type StreamableSessionEntry = {
    transport: StreamableHTTPServerTransport;
    server: Server;
    yunxiao_access_token?: string;
    yunxiao_api_base_url?: string;
};

function getMcpSessionIdHeader(req: { headers: Record<string, string | string[] | undefined> }): string | undefined {
    const raw = req.headers['mcp-session-id'];
    return typeof raw === 'string' ? raw : undefined;
}

function resolveStreamableYunxiaoAuth(req: { query: Record<string, unknown>; headers: Record<string, string | string[] | undefined> }): {
    yunxiao_access_token?: string;
    yunxiao_api_base_url?: string;
} {
    const qTok = req.query['yunxiao_access_token'];
    const qBase = req.query['yunxiao_api_base_url'];
    const tokenFromQuery = typeof qTok === 'string' ? qTok : undefined;
    const baseFromQuery = typeof qBase === 'string' ? qBase : undefined;
    const hdrTok = req.headers['x-yunxiao-token'];
    const hdrBase = req.headers['x-yunxiao-api-base-url'];
    const tokenFromHeader = typeof hdrTok === 'string' ? hdrTok : undefined;
    const baseFromHeader = typeof hdrBase === 'string' ? hdrBase : undefined;

    return {
        yunxiao_access_token: tokenFromQuery || tokenFromHeader || process.env.YUNXIAO_ACCESS_TOKEN,
        yunxiao_api_base_url: baseFromQuery || baseFromHeader || undefined,
    };
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
};

async function registerSseRoutes(
    app: any,
    sessions: Record<string, SseSessionEntry>,
    options: { installJsonParser: boolean },
): Promise<void> {
    app.get('/sse', async (req: any, res: any) => {
        console.log(`New SSE connection from ${req.ip}`);
        console.log(`SSE query params: ${JSON.stringify(req.query)}`);
        console.log(`SSE headers x-yunxiao-token: ${req.headers['x-yunxiao-token'] ? 'present' : 'missing'}`);
        console.log(`SSE headers x-yunxiao-api-base-url: ${req.headers['x-yunxiao-api-base-url'] || 'missing'}`);

        const yunxiao_access_token =
            req.query.yunxiao_access_token || req.headers['x-yunxiao-token'] || process.env.YUNXIAO_ACCESS_TOKEN;
        const yunxiao_api_base_url =
            req.query.yunxiao_api_base_url || req.headers['x-yunxiao-api-base-url'] || undefined;

        console.log(`[SSE] Resolved token: ${yunxiao_access_token ? yunxiao_access_token.substring(0, 10) + '...' : 'none'}`);
        console.log(`[SSE] Resolved API base URL: ${yunxiao_api_base_url || 'none (will use default)'}`);

        const sessionServer = createMcpServer();
        const sseTransport = new SSEServerTransport('/messages', res);
        const sessionId = sseTransport.sessionId;

        if (sessionId) {
            sessions[sessionId] = {
                transport: sseTransport,
                server: sessionServer,
                yunxiao_access_token,
                yunxiao_api_base_url,
            };
        }

        try {
            await sessionServer.connect(sseTransport);
            console.info(`Yunxiao MCP Server connected via SSE with session ${sessionId}`);
            if (yunxiao_access_token) {
                console.error(`Session ${sessionId} using custom token`);
            } else {
                console.error(`Session ${sessionId} using default token from environment`);
            }
        } catch (error) {
            console.error('Failed to start SSE server:', error);
            res.status(500).send('Server error');
        }
    });

    if (options.installJsonParser) {
        const { default: express } = await import('express');
        app.use(express.json({ limit: '10mb' }));
    }

    app.post('/messages', async (req: any, res: any) => {
        const sessionId = req.query.sessionId as string;
        const session = sessions[sessionId];

        if (!session) {
            res.status(404).send('Session not found');
            return;
        }

        try {
            const utils = await import('./common/utils.js');
            console.log(
                `[POST] Session ${sessionId} - setting token: ${session.yunxiao_access_token ? session.yunxiao_access_token.substring(0, 10) + '...' : 'none'}`,
            );
            console.log(`[POST] Session ${sessionId} - setting API base URL: ${session.yunxiao_api_base_url || 'none'}`);
            utils.setCurrentSessionToken(session.yunxiao_access_token);
            utils.setCurrentSessionApiBaseUrl(session.yunxiao_api_base_url);

            await session.transport.handlePostMessage(req, res, req.body);
        } catch (error) {
            console.error('Error handling POST message:', error);
            res.status(500).send('Server error');
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
            'Content-Type, Accept, Mcp-Session-Id, Mcp-Protocol-Version, Authorization, X-Yunxiao-Token, X-Yunxiao-Api-Base-Url',
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
            utils.setCurrentSessionToken(entry.yunxiao_access_token);
            utils.setCurrentSessionApiBaseUrl(entry.yunxiao_api_base_url);
            const parsedBody = req.method === 'POST' ? req.body : undefined;
            await entry.transport.handleRequest(req, res, parsedBody);
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

        const { yunxiao_access_token, yunxiao_api_base_url } = resolveStreamableYunxiaoAuth(req);
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
                });
                console.info(`Streamable HTTP MCP session initialized: ${sid}`);
            },
            onsessionclosed: async (sid) => {
                streamSessions.delete(sid);
                console.info(`Streamable HTTP MCP session closed: ${sid}`);
            },
        });

        await sessionServer.connect(transport);
        utils.setCurrentSessionToken(yunxiao_access_token);
        utils.setCurrentSessionApiBaseUrl(yunxiao_api_base_url);

        console.log(`New Streamable HTTP connection from ${req.ip}`);
        if (yunxiao_access_token) {
            console.error(`Streamable HTTP session using custom token`);
        }

        await transport.handleRequest(req, res, req.body);
    });
}

async function runServer() {
    if (useHttpRemote) {
        const utils = await import('./common/utils.js');
        const port = Number(process.env.PORT) || 3000;
        const mcpPath = process.env.MCP_STREAMABLE_PATH || '/mcp';
        const mcpHttpHost = process.env.MCP_HTTP_HOST || '0.0.0.0';
        const allowedHostsEnv = process.env.MCP_ALLOWED_HOSTS;

        let app: any;
        if (wantStreamable) {
            app =
                allowedHostsEnv && allowedHostsEnv.trim().length > 0
                    ? createMcpExpressApp({
                          host: mcpHttpHost,
                          allowedHosts: allowedHostsEnv.split(',').map((s) => s.trim()).filter(Boolean),
                      })
                    : createMcpExpressApp({ host: mcpHttpHost });
        } else {
            const { default: express } = await import('express');
            app = express();
        }

        const sseSessions: Record<string, SseSessionEntry> = {};
        const streamSessions = new Map<string, StreamableSessionEntry>();

        if (wantSse) {
            await registerSseRoutes(app, sseSessions, { installJsonParser: !wantStreamable });
        }

        if (wantStreamable) {
            registerStreamableRoutes(app, utils, streamSessions, mcpPath);
        }

        const serverInstance: any = app.listen(port, () => {
            const modes: string[] = [];
            if (wantSse) modes.push('SSE (/sse, /messages)');
            if (wantStreamable) modes.push(`Streamable HTTP (${mcpPath})`);
            console.log(`Yunxiao MCP Server running on port ${port} — ${modes.join(' + ')}`);
            if (wantSse) {
                console.log(`  SSE: http://localhost:${port}/sse`);
                console.log(`  Messages: http://localhost:${port}/messages?sessionId=<session-id>`);
            }
            if (wantStreamable) {
                console.log(`  Streamable: http://localhost:${port}${mcpPath}`);
            }
        });

        process.on('SIGINT', () => {
            console.log('Shutting down HTTP server...');
            serverInstance.close(() => {
                console.log('Server closed.');
                process.exit(0);
            });
        });
    } else {
        const server = createMcpServer();
        const transport = new StdioServerTransport();
        await server.connect(transport);
    }
}

runServer().catch((error) => {
    if (useHttpRemote) {
        console.error('Fatal error in main():', error);
    }
    process.exit(1);
});