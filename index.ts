#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import {
    CallToolRequestSchema,
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

// Check if we should run in SSE mode
const useSSE = process.argv.includes('--sse') || process.env.MCP_TRANSPORT === 'sse';

async function runServer() {
    if (useSSE) {
        // Import express only when needed for SSE mode
        const { default: express } = await import('express');
        const app: any = express();
        const port = process.env.PORT || 3000;
        
        // Store sessions - each session has its own Server instance and transport
        const sessions: Record<string, {
            transport: SSEServerTransport;
            server: Server;
            yunxiao_access_token?: string;
            yunxiao_api_base_url?: string;
        }> = {};
        
        // SSE endpoint - handles initial connection
        app.get('/sse', async (req: any, res: any) => {
            console.log(`New SSE connection from ${req.ip}`);
            
            // Get token from query parameters or headers
            const yunxiao_access_token = req.query.yunxiao_access_token || req.headers['x-yunxiao-token'] || process.env.YUNXIAO_ACCESS_TOKEN;
            
            // Get API base URL from query parameters or headers
            const yunxiao_api_base_url = req.query.yunxiao_api_base_url || req.headers['x-yunxiao-api-base-url'] || undefined;
            
            // Create a new Server instance for this session (required - server.connect() can only be called once)
            const sessionServer = createMcpServer();
            
            // Create transport with endpoint for POST messages
            const sseTransport = new SSEServerTransport('/messages', res);
            const sessionId = sseTransport.sessionId;
            
            if (sessionId) {
                sessions[sessionId] = { transport: sseTransport, server: sessionServer, yunxiao_access_token, yunxiao_api_base_url };
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
                console.error("Failed to start SSE server:", error);
                res.status(500).send("Server error");
            }
        });
        
        // POST endpoint - handles incoming messages
        app.use(express.json({ limit: '10mb' }));
        app.post('/messages', async (req: any, res: any) => {
            const sessionId = req.query.sessionId as string;
            const session = sessions[sessionId];
            
            if (!session) {
                res.status(404).send("Session not found");
                return;
            }
            
            try {
                // Set the session token before handling the message
                const utils = await import('./common/utils.js');
                utils.setCurrentSessionToken(session.yunxiao_access_token);
                utils.setCurrentSessionApiBaseUrl(session.yunxiao_api_base_url);
                
                await session.transport.handlePostMessage(req, res, req.body);
            } catch (error) {
                console.error("Error handling POST message:", error);
                res.status(500).send("Server error");
            }
        });
        
        // Start server
        const serverInstance: any = app.listen(port, () => {
            console.log(`Yunxiao MCP Server running in SSE mode on port ${port}`);
            console.log(`Connect via SSE at http://localhost:${port}/sse`);
            console.log(`Send messages to http://localhost:${port}/messages?sessionId=<session-id>`);
        });
        
        // Handle graceful shutdown
        process.on('SIGINT', () => {
            console.log('Shutting down SSE server...');
            // Close all active sessions
            for (const sid of Object.keys(sessions)) {
                try {
                    sessions[sid].server.close();
                    delete sessions[sid];
                } catch (e) {
                    // Ignore close errors during shutdown
                }
            }
            serverInstance.close(() => {
                console.log('Server closed.');
                process.exit(0);
            });
        });
    } else {
        // Stdio mode (default)
        const server = createMcpServer();
        const transport = new StdioServerTransport();
        await server.connect(transport);
    }
}

runServer().catch((error) => {
    // Only output error to stderr in SSE mode, not in stdio mode
    if (useSSE) {
        console.error("Fatal error in main():", error);
    }
    process.exit(1);
});