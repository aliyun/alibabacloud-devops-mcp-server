# MCP 配置使用说明

## 1. mcp-config 示例（项目根目录）

仓库内提供 **mcp-config.example.json** 作为模板。使用前请复制并重命名后填入真实配置：

```bash
cp mcp-config.example.json mcp-config.json
# 编辑 mcp-config.json，将 your_yunxiao_access_token 替换为你的云效访问令牌
```

用于 **MCP2Skills** 或本地通过 stdio 启动 MCP 服务器时，请指向你的 **mcp-config.json**（不要提交含真实 token 的该文件，已加入 .gitignore）。

- **对应启动方式**：与 `npm run start`（即 `node dist/index.js`）一致，MCP2Skills 会以 stdio 方式启动该进程。
- **前置条件**：在项目根目录执行 `npm run build` 或 `tnpm run build` 生成 `dist/index.js`。
- **运行目录**：使用本配置时，请在**项目根目录**下执行 MCP2Skills（如 `python mcp_to_skill_v2.py --mcp-config ...`），这样 `dist/index.js` 才能正确解析。

### 环境变量说明

| 变量名 | 必填 | 说明 |
|--------|------|------|
| `YUNXIAO_ACCESS_TOKEN` | 是 | 云效访问令牌，用于调用云效 Open API。 |
| `YUNXIAO_API_BASE_URL` | 否 | 云效 API 基地址，默认 `https://openapi-rdc.aliyuncs.com`。 |
| `DEVOPS_TOOLSETS` | 否 | 启用的工具集，逗号分隔，不设则启用全部。 |

### 使用 MCP2Skills 转换为 Claude Skill

```bash
# 1. 安装依赖
pip install mcp

# 2. 在项目根目录执行转换（请先 tnpm run build）
# 请先：cp mcp-config.example.json mcp-config.json 并填入 YUNXIAO_ACCESS_TOKEN
python mcp_to_skill_v2.py \
  --mcp-config /path/to/mcp-yunxiao/mcp-config.json \
  --output-dir ./skills/alibabacloud-devops

# 3. 安装到 Claude Code
cp -r ./skills/alibabacloud-devops ~/.claude/skills/
```

### 使用 npx 方式（已发布到 npm 时）

若已发布为 npm 包，可将 `mcp-config.json` 中的 `command` / `args` 改为：

```json
{
  "name": "alibabacloud-devops-mcp-server",
  "command": "npx",
  "args": ["-y", "alibabacloud-devops-mcp-server"],
  "env": {
    "YUNXIAO_ACCESS_TOKEN": "your_yunxiao_access_token"
  }
}
```

## 2. Claude Code / Cursor 中的 MCP 配置

在 Claude Code 或 Cursor 的 MCP 设置中，添加本服务器时可使用如下结构（将 `mcpServers` 合并到现有配置中）：

```json
{
  "mcpServers": {
    "alibabacloud-devops": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-yunxiao/dist/index.js"],
      "env": {
        "YUNXIAO_ACCESS_TOKEN": "your_yunxiao_access_token"
      }
    }
  }
}
```

- 请将 `/absolute/path/to/mcp-yunxiao` 替换为本地的项目绝对路径。
- 使用前请在项目根目录执行 `npm run build` 或 `tnpm run build`。

## 3. 安全提示

- 不要将包含真实 `YUNXIAO_ACCESS_TOKEN` 的配置文件提交到版本库。
- 建议将 `mcp-config.json` 加入 `.gitignore`，仅保留示例或通过 `mcp-config.example.json` 提供模板。
