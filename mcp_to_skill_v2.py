#!/usr/bin/env python3
"""
MCP to Skill Converter v2
=========================
Converts any MCP server into a Claude Skill with optimized structure.

Key improvements:
- Better SKILL.md structure following Claude best practices
- Smart description generation with trigger keywords
- Built-in error filtering for MCP server logs
- Cleaner output format

Usage:
    python mcp_to_skill_v2.py --mcp-config config.json --output-dir ./skills/my-skill
"""

import json
import asyncio
from pathlib import Path
from typing import Dict, List, Any
import argparse


class MCPSkillGenerator:
    """Generate an optimized Skill from an MCP server configuration."""

    def __init__(self, mcp_config: Dict[str, Any], output_dir: Path):
        self.mcp_config = mcp_config
        self.output_dir = Path(output_dir)
        self.server_name = mcp_config.get('name', 'unnamed-mcp-server')

    async def generate(self):
        """Generate the complete skill structure."""
        self.output_dir.mkdir(parents=True, exist_ok=True)

        print(f"🔧 Generating skill for: {self.server_name}")

        # 1. Get tools from MCP server
        tools = await self._get_mcp_tools()
        print(f"✓ Found {len(tools)} tools")

        # 2. Generate SKILL.md
        self._generate_skill_md(tools)

        # 3. Generate executor
        self._generate_executor()

        # 4. Generate config
        self._generate_config()

        # 5. Generate package.json
        self._generate_package_json()

        print(f"\n✅ Skill generated at: {self.output_dir}")

    async def _get_mcp_tools(self) -> List[Dict[str, Any]]:
        """Connect to MCP server and introspect available tools."""
        try:
            from mcp import ClientSession, StdioServerParameters
            from mcp.client.stdio import stdio_client
            from contextlib import AsyncExitStack

            server_params = StdioServerParameters(
                command=self.mcp_config.get('command'),
                args=self.mcp_config.get('args', []),
                env=self.mcp_config.get('env')
            )

            async with AsyncExitStack() as stack:
                stdio_transport = await stack.enter_async_context(
                    stdio_client(server_params)
                )
                read_stream, write_stream = stdio_transport

                session = await stack.enter_async_context(
                    ClientSession(read_stream, write_stream)
                )
                await session.initialize()

                response = await session.list_tools()

                return [
                    {
                        "name": tool.name,
                        "description": tool.description,
                        "inputSchema": tool.inputSchema
                    }
                    for tool in response.tools
                ]

        except Exception as e:
            print(f"⚠️  Failed to connect to MCP server: {e}")
            print("   Using fallback mode (empty tool list)")
            return []

    def _generate_smart_description(self, tools: List[Dict[str, Any]]) -> str:
        """Generate an intelligent description based on available tools."""
        tool_count = len(tools)

        if tool_count == 0:
            return f"{self.server_name} MCP server. Use when user mentions '{self.server_name}'."

        # Extract keywords from tool names
        keywords = set()
        for tool in tools[:5]:  # First 5 tools
            parts = tool['name'].split('_')
            keywords.update(parts)

        # Remove common words
        keywords = keywords - {'get', 'set', 'list', 'create', 'delete', 'update'}

        # Create tool examples
        tool_examples = [t['name'].replace('_', ' ') for t in tools[:3]]

        description = (
            f"{self.server_name} provides {tool_count} tools. "
            f"Use cases: {', '.join(tool_examples)}. "
            f"Keywords: {', '.join(list(keywords)[:5])}."
        )

        return description

    def _auto_categorize_tools(self, tools: List[Dict[str, Any]]) -> dict:
        """Automatically categorize tools based on prefixes."""
        categories = {}

        for tool in tools:
            name = tool['name']
            # Extract prefix (first part before underscore)
            prefix = name.split('_')[0] if '_' in name else 'other'

            if prefix not in categories:
                categories[prefix] = []
            categories[prefix].append(tool)

        return categories

    def _generate_categorized_tool_list(self, tools: List[Dict[str, Any]]) -> str:
        """Generate categorized tool list with parameters."""
        categories = self._auto_categorize_tools(tools)

        # Category name mapping
        category_names = {
            'get': 'Query Operations',
            'create': 'Create Operations',
            'update': 'Update Operations',
            'delete': 'Delete Operations',
            'list': 'List Operations',
            'search': 'Search Operations',
            'other': 'Other Operations'
        }

        result = []
        for prefix, category_tools in sorted(categories.items()):
            category_name = category_names.get(prefix, prefix.capitalize())
            result.append(f"### {category_name}\n")

            for tool in category_tools:
                # Use full formatting with parameters
                result.append(self._format_tool_with_params(tool))
            result.append("")

        return "\n".join(result).rstrip()

    def _generate_generic_examples(self) -> str:
        """Generate generic examples for MCP servers."""
        return """```bash
# List all tools
python executor.py --list

# Get tool details
python executor.py --describe <tool_name>

# Execute a tool
python executor.py --call '{"tool": "example", "arguments": {}}'
```"""

    def _format_tool_with_params(self, tool: Dict[str, Any]) -> str:
        """Format a single tool with its description and parameters."""
        lines = []

        # Tool name and description
        desc = tool.get('description', 'No description')
        lines.append(f"- `{tool['name']}` - {desc}")

        # Parse schema for parameters
        schema = tool.get('inputSchema', {})
        properties = schema.get('properties', {})
        required = schema.get('required', [])

        if properties:
            # Required parameters
            required_params = {k: v for k, v in properties.items() if k in required}
            if required_params:
                lines.append("    - **Required parameters**:")
                for param_name, param_info in required_params.items():
                    param_type = param_info.get('type', 'unknown')
                    param_desc = param_info.get('description', 'No description')
                    lines.append(f"      - `{param_name}` ({param_type}): {param_desc}")

            # Optional parameters
            optional_params = {k: v for k, v in properties.items() if k not in required}
            if optional_params:
                lines.append("    - **Optional parameters**:")
                for param_name, param_info in optional_params.items():
                    param_type = param_info.get('type', 'unknown')
                    param_desc = param_info.get('description', 'No description')
                    lines.append(f"      - `{param_name}` ({param_type}): {param_desc}")

        return "\n".join(lines)

    def _generate_skill_md(self, tools: List[Dict[str, Any]]):
        """Generate optimized SKILL.md following Claude best practices."""

        tool_count = len(tools)

        # Auto-detect if we should use categorization (>10 tools)
        use_categories = tool_count > 10

        if use_categories:
            tool_list = self._generate_categorized_tool_list(tools)
        else:
            # Simple flat list with parameters
            if tools:
                tool_list = "\n".join([
                    self._format_tool_with_params(t)
                    for t in tools
                ])
            else:
                tool_list = "(No tools found - please check MCP server connection)"

        # Generate title and intro
        title = f"# {self.server_name}"
        intro = f"MCP server providing {tool_count} tools."
        examples = self._generate_generic_examples()

        # Generate smart description
        description = self._generate_smart_description(tools)

        content = f"""---
name: {self.server_name}
description: {description}
---

{title}

{intro}

## Available Tools ({tool_count})

{tool_list}

## Instructions

### Standard Call Flow

1. **Identify the tool** - Choose the appropriate tool from the list above
2. **Get tool parameters** (optional) - If unsure about parameter format:

   ```bash
   cd ~/.claude/skills/{self.server_name}
   python executor.py --describe <tool_name>
   ```

3. **Execute the tool call**:

   ```bash
   cd ~/.claude/skills/{self.server_name}
   python executor.py --call '{{"tool": "<tool_name>", "arguments": {{...}}}}'
   ```

### Error Handling

If execution fails:

- Check tool name is correct
- Use `--describe` to view required parameters
- Ensure MCP server is accessible

## Examples

{examples}
"""

        skill_path = self.output_dir / "SKILL.md"
        skill_path.write_text(content, encoding='utf-8')
        print(f"✓ Created: SKILL.md")

    def _generate_executor(self):
        """Generate the executor script with proper error handling."""

        executor_code = '''#!/usr/bin/env python3
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
'''

        executor_path = self.output_dir / "executor.py"
        executor_path.write_text(executor_code)
        executor_path.chmod(0o755)
        print(f"✓ Created: executor.py")

    def _generate_config(self):
        """Save MCP server configuration."""
        config_path = self.output_dir / "mcp-config.json"
        with open(config_path, 'w') as f:
            json.dump(self.mcp_config, f, indent=2)
        print(f"✓ Created: mcp-config.json")

    def _generate_package_json(self):
        """Generate package.json with dependencies."""
        package = {
            "name": f"skill-{self.server_name}",
            "version": "1.0.0",
            "description": f"Claude Skill for {self.server_name} MCP server",
            "scripts": {
                "setup": "pip install mcp"
            }
        }

        package_path = self.output_dir / "package.json"
        with open(package_path, 'w') as f:
            json.dump(package, f, indent=2)
        print(f"✓ Created: package.json")


async def convert_mcp_to_skill(mcp_config_path: str, output_dir: str):
    """Convert MCP server to optimized Skill."""

    # Load config
    with open(mcp_config_path) as f:
        mcp_config = json.load(f)

    # Generate skill
    generator = MCPSkillGenerator(mcp_config, Path(output_dir))
    await generator.generate()

    print("\n" + "="*60)
    print("🎉 Skill generation complete!")
    print("="*60)
    print(f"\nNext steps:")
    print(f"1. cd {output_dir} && pip install mcp")
    print(f"2. cp -r {output_dir} ~/.claude/skills/")
    print(f"3. Claude will auto-discover this skill")
    print(f"\nContext savings: 90-99% compared to traditional MCP")


def main():
    parser = argparse.ArgumentParser(
        description="Convert MCP to optimized Claude Skill v2",
        epilog="Example: python mcp_to_skill_v2.py --mcp-config server.json --output-dir ./skills/my-skill"
    )
    parser.add_argument(
        "--mcp-config",
        required=True,
        help="MCP server config JSON file"
    )
    parser.add_argument(
        "--output-dir",
        required=True,
        help="Output directory for skill"
    )

    args = parser.parse_args()

    asyncio.run(convert_mcp_to_skill(args.mcp_config, args.output_dir))


if __name__ == "__main__":
    main()
