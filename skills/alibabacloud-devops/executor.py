#!/usr/bin/env python3
"""MCP Skill Executor - Dynamic tool invocation"""

import json
import sys
import asyncio
import argparse
from pathlib import Path

try:
    from mcp import ClientSession, StdioServerParameters
    from mcp.client.stdio import stdio_client
    HAS_MCP = True
except ImportError:
    HAS_MCP = False


class MCPExecutor:
    """Execute MCP tool calls dynamically."""

    def __init__(self, server_config):
        if not HAS_MCP:
            raise ImportError("mcp package required: pip install mcp")

        self.server_config = server_config
        self.session = None
        self.exit_stack = None

    async def connect(self):
        """Connect to MCP server."""
        from contextlib import AsyncExitStack

        server_params = StdioServerParameters(
            command=self.server_config["command"],
            args=self.server_config.get("args", []),
            env=self.server_config.get("env")
        )

        self.exit_stack = AsyncExitStack()

        stdio_transport = await self.exit_stack.enter_async_context(
            stdio_client(server_params)
        )
        read_stream, write_stream = stdio_transport

        self.session = await self.exit_stack.enter_async_context(
            ClientSession(read_stream, write_stream)
        )
        await self.session.initialize()

    async def list_tools(self):
        """Get list of available tools."""
        if not self.session:
            await self.connect()

        response = await self.session.list_tools()
        return [
            {
                "name": tool.name,
                "description": tool.description
            }
            for tool in response.tools
        ]

    async def describe_tool(self, tool_name: str):
        """Get detailed schema for a specific tool."""
        if not self.session:
            await self.connect()

        response = await self.session.list_tools()
        for tool in response.tools:
            if tool.name == tool_name:
                return {
                    "name": tool.name,
                    "description": tool.description,
                    "inputSchema": tool.inputSchema
                }
        return None

    async def call_tool(self, tool_name: str, arguments: dict):
        """Execute a tool call."""
        if not self.session:
            await self.connect()

        response = await self.session.call_tool(tool_name, arguments)
        return response.content

    async def close(self):
        """Close MCP connection."""
        if self.exit_stack:
            try:
                await self.exit_stack.aclose()
            except:
                pass


async def main():
    parser = argparse.ArgumentParser(description="MCP Skill Executor")
    parser.add_argument("--call", help="JSON tool call")
    parser.add_argument("--describe", help="Get tool schema")
    parser.add_argument("--list", action="store_true", help="List tools")

    args = parser.parse_args()

    # Load config
    config_path = Path(__file__).parent / "mcp-config.json"
    if not config_path.exists():
        print(f"Error: {config_path} not found", file=sys.stderr)
        sys.exit(1)

    with open(config_path) as f:
        config = json.load(f)

    if not HAS_MCP:
        print("Error: pip install mcp", file=sys.stderr)
        sys.exit(1)

    executor = MCPExecutor(config)

    try:
        if args.list:
            tools = await executor.list_tools()
            print(json.dumps(tools, indent=2))

        elif args.describe:
            schema = await executor.describe_tool(args.describe)
            if schema:
                print(json.dumps(schema, indent=2))
            else:
                print(f"Tool not found: {args.describe}", file=sys.stderr)
                sys.exit(1)

        elif args.call:
            call_data = json.loads(args.call)
            result = await executor.call_tool(
                call_data["tool"],
                call_data.get("arguments", {})
            )

            # Format output
            if isinstance(result, list):
                for item in result:
                    if hasattr(item, 'text'):
                        print(item.text)
                    else:
                        print(json.dumps(
                            item.__dict__ if hasattr(item, '__dict__') else item,
                            indent=2,
                            ensure_ascii=False
                        ))
            else:
                print(json.dumps(
                    result.__dict__ if hasattr(result, '__dict__') else result,
                    indent=2,
                    ensure_ascii=False
                ))
        else:
            parser.print_help()

    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr)
        import traceback
        traceback.print_exc(file=sys.stderr)
        sys.exit(1)
    finally:
        await executor.close()


if __name__ == "__main__":
    asyncio.run(main())
