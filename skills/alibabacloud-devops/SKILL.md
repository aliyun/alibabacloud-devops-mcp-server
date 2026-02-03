---
name: alibabacloud-devops-mcp-server
description: alibabacloud-devops-mcp-server provides 156 tools. Use cases: get current organization info, get user organizations, get current user. Keywords: current, organization, info, branch, organizations.
---

# alibabacloud-devops-mcp-server

MCP server providing 156 tools, grouped by **Tool Set** (TOOLSET).

## Tool Sets

- [**Base**](base.md) — 3 tools
- [**Code Management**](code-management.md) — 22 tools
- [**Organization Management**](organization-management.md) — 9 tools
- [**Project Management**](project-management.md) — 26 tools
- [**Pipeline Management**](pipeline-management.md) — 26 tools
- [**Packages Management**](packages-management.md) — 3 tools
- [**Application Delivery**](application-delivery.md) — 57 tools
- [**Test Management**](test-management.md) — 10 tools

### Standard Call Flow

1. **Identify the tool set** - Choose the tool set from the links above (e.g. Code Management, Project Management).
2. **Identify the tool** - Open that tool set’s page and choose the appropriate tool
3. **Get tool parameters** (optional) - If unsure about parameter format:

   ```bash
   cd ~/.claude/skills/alibabacloud-devops-mcp-server
   python executor.py --describe <tool_name>
   ```

4. **Execute the tool call**:

   ```bash
   cd ~/.claude/skills/alibabacloud-devops-mcp-server
   python executor.py --call '{"tool": "<tool_name>", "arguments": {...}}'
   ```

### Error Handling

If execution fails:

- Check tool name is correct
- Use `--describe` to view required parameters
- Ensure MCP server is accessible

## Examples

```bash
# List all tools
python executor.py --list

# Get tool details
python executor.py --describe <tool_name>

# Execute a tool
python executor.py --call '{"tool": "example", "arguments": {}}'
```
