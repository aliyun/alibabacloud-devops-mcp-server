# 用 Claude Code 打造开源项目的 AI DevOps 自动化

> 一个人维护一个 188 个工具的 MCP Server 开源项目，如何用 AI 自动化处理 Issue、PR Review、依赖升级和发版？

## 背景

[alibabacloud-devops-mcp-server](https://github.com/aliyun/alibabacloud-devops-mcp-server) 是一个 MCP（Model Context Protocol）Server，将阿里云云效 DevOps 的 OpenAPI 封装为 188 个 MCP 工具，覆盖代码管理、项目管理、流水线、应用交付、制品仓库、测试管理等领域。

作为开源项目的维护者，日常面临几个重复性很高的工作：

- **Dependabot PR 堆积**：每周自动创建的依赖升级 PR 需要逐一 review 和 merge
- **社区 Issue 响应**：用户提交的 bug report 需要定位原因、修复、发版、回复
- **发版流程繁琐**：每次发版涉及 version bump、build、git tag、Docker 构建、GitHub Release 创建，步骤多且容易遗漏
- **PR Review**：社区贡献的 feature PR 需要从类型安全、API 兼容性、安全性等多个角度评审

这些工作单独来看都不复杂，但叠加在一起就是相当大的维护负担。本文分享如何用 Claude Code 及其生态工具链，把这些工作自动化。

## 整体方案

```
┌──────────────────────────────────────────────────┐
│                GitHub Repository                  │
├────────────────┬─────────────┬────────────────────┤
│  Issues / PRs   │  发版指令    │  日常维护          │
│       ↓         │      ↓      │       ↓            │
│   /mcp_triage   │ /mcp_release│  Claude Code       │
│   Skill         │  Skill      │  + gh CLI          │
│   (本地)         │  (本地)     │   (本地)            │
│       ↓         │      ↓      │       ↓            │
│  逐一分析评审    │  7步自动化   │  对话式驱动         │
│  用户确认后执行   │  发版流程    │  灵活处理          │
└────────────────┴─────────────┴────────────────────┘
```

所有自动化都通过 Claude Code Skill 在本地执行，用 `gh` CLI 与 GitHub 交互。相比 GitHub Actions 的全自动方案，Skill 方案的核心优势是**每个操作都在用户确认后才执行**，维护者保持完全控制。

## 1. Issue/PR 批量处理：mcp_triage Skill

### 问题

Issue 和 PR 分散在 GitHub 上，需要逐一打开、阅读、分析、回复。Dependabot PR 尤其多，每个都需要看 diff、确认 changelog 无 breaking change、approve、merge。

### 方案：Claude Code Skill

创建 `.claude/skills/mcp_triage.md`，一句 `/mcp_triage` 触发批量处理：

```
Step 1: 获取概览
  gh issue list --state open ...
  gh pr list --state open ...
  → 输出汇总表格

Step 2: 按优先级排序
  bug issue > feature issue
  dependabot patch/minor > dependabot major > 社区 PR

Step 3: 逐一处理 Issue
  读取 → 搜索相关代码 → 分析根因 → 给出结论
  → 用户确认后执行（修复/回复/关闭）

Step 4: 逐一处理 PR
  读取 diff → 代码评审 → 给出结论
  → 用户确认后执行（merge/comment/close）

Step 5: 汇总报告
```

### 关键设计决策

**1. 逐一处理 + 用户确认**

与 GitHub Actions 全自动方案不同，Skill 方案在每个破坏性操作前都等待用户确认。这对开源项目更安全——你始终知道每个 merge 和 close 背后的原因。

**2. 评审标准固化在 Skill 中**

把 MCP Server 项目特有的评审维度写入 Skill 文件：

- TypeScript 类型安全和 Zod schema 正确性
- API 兼容性（tool name / inputSchema 变更 = breaking change）
- 安全性（凭证泄露、注入风险）
- 依赖升级的 changelog 检查

每次执行都按同一标准评审，不会因为对话上下文不同而遗漏。

**3. Dependabot PR 批量确认**

对于 dependabot 的 patch/minor PR，Skill 会批量展示评审结果，允许用户一次性确认全部合并，而不需要逐个确认。这在效率和控制之间取得了平衡。

**4. 不自动发版**

Issue 修复后只修改代码，不自动触发发版流程。维护者可以积累多个修复后统一发版，或者立即发版——这个决策权留给用户。

### 为什么选择 Skill 而不是 GitHub Actions？

| 维度 | GitHub Actions | Claude Code Skill |
|------|---------------|-------------------|
| 触发方式 | PR 创建/更新时自动触发 | 用户主动触发 |
| 控制力 | 全自动，事后查看结果 | 每步确认，实时控制 |
| 修复能力 | 只能评论，不能改代码 | 可以直接修复代码 |
| 成本 | 每个 PR 触发一次 API 调用 | 按需调用，更可控 |
| 适用场景 | 大团队、高频 PR | 个人/小团队维护 |

对于个人维护的开源项目，Skill 方案更实用：你不需要 7x24 的自动化，你需要的是在处理 Issue/PR 时的效率倍增器。

## 2. 发版流程自动化：mcp_release Skill

### 问题

每次发版需要执行 7+ 个步骤：

1. 读取当前版本号
2. `npm version patch`
3. 同步 `common/version.ts`
4. `npm run build`
5. git commit + push
6. git tag + push
7. Docker build + push
8. `gh release create`

步骤多，顺序严格，任何一步失败都需要回滚。手动执行容易遗漏（比如忘记同步 version.ts）。

### 方案：Claude Code Skill

Claude Code 的 Skill 机制允许定义可复用的工作流。创建 `.claude/skills/mcp_release.md`：

```markdown
---
name: mcp_release
description: 发布新版本的完整流程。当用户要求发版时使用此 skill。
---

# 发布新版本

## 发布流程

### Step 1: 读取当前版本号
node -p "require('./package.json').version"

### Step 2: 升级版本号
npm version patch --no-git-tag-version
# 同步更新 common/version.ts

### Step 3: 构建项目
npm run build

### Step 4: 提交代码并推送
git add -A && git commit -m "chore: release v<新版本号>" && git push

### Step 5: 创建 Git Tag 并推送
git tag v<新版本号> && git push origin v<新版本号>

### Step 6: 构建 Docker 镜像
bash build_docker.sh

### Step 7: 创建 GitHub Release
gh release create v<新版本号> --title "v<新版本号>" --latest --generate-notes
```

使用时只需在 Claude Code 中说"发版"，Skill 会按照定义的步骤顺序执行，每步验证后再继续下一步。

### 实际效果

一句"提交发版"，Claude Code 自动完成全部 7 步。输出：

```
发布完成
- 版本: v0.3.43
- Tag: v0.3.43
- Docker: 构建完成
- Release: https://github.com/aliyun/alibabacloud-devops-mcp-server/releases/tag/v0.3.43
```

**从 7 步手动操作缩减为 1 句话。**

## 3. Issue 自动分析与修复

### 实战案例：Issue #74

用户报告了一个 bug：`create_change_request` 使用 `createFrom=COMMAND_LINE` 时返回 `source commit can not be null`。

整个处理过程在 Claude Code 中完成：

**Step 1: 读取 Issue**

```bash
gh issue view 74 --repo aliyun/alibabacloud-devops-mcp-server
```

Claude Code 通过 `gh` CLI 读取 issue 的完整内容，理解问题描述和复现步骤。

**Step 2: 定位代码**

Claude Code 自动在代码库中搜索相关的 Schema 定义和 handler 实现，追踪从 `CreateChangeRequestSchema` 到 `createChangeRequestFunc` 的完整调用链。

**Step 3: 分析与验证**

先尝试了 auto-fetch sourceCommit 的修复方案，但通过实际 API 调用测试发现，这是 Codeup API 端的问题——即使传入了 `sourceCommit`，`COMMAND_LINE` 模式仍然报错。

**Step 4: 修正方案**

确认 API 端不支持 `COMMAND_LINE` 后，改为在 MCP 层移除这个不可用的选项，避免用户踩坑。

**Step 5: 回复 Issue 并关闭**

```bash
gh issue comment 74 --body "Fixed in v0.3.43. ..."
gh issue close 74
```

### 关键收获

这个案例展示了 AI 辅助 debug 的一个重要模式：**先假设、再验证、再修正**。

初始假设是"MCP 层没有传 sourceCommit"，于是写了 auto-fetch 逻辑。但通过实际 API 测试（在 Claude Code 中直接调用 API）发现假设错误。最终方案从"修复"变为"移除不可用选项"——这种判断需要真实的 API 交互来驱动，不能仅靠代码静态分析。

## 总结

| 场景 | 工具 | 自动化程度 |
|------|------|-----------|
| Issue/PR 批量处理 | `/mcp_triage` Skill + gh CLI | 半自动，逐一确认 |
| 发版 | `/mcp_release` Skill + gh CLI | 半自动，一句话触发 |
| Issue 修复 | Claude Code + gh CLI | 半自动，对话式驱动 |

### 核心理念

**用 Skill 而不是 CI 来做 AI 自动化**。GitHub Actions 适合确定性的流水线（构建、测试、部署），但 Issue/PR 的处理本质上需要判断力——哪个 PR 该合并、哪个 Issue 该修复、哪个可以关闭。这些判断应该由 AI 辅助、人来决策，而不是全自动执行。

Claude Code Skill 的价值在于：

- **固化流程**：评审维度、处理步骤、输出格式都预定义好，每次执行一致
- **保持控制**：所有破坏性操作需要用户确认，不会出现"AI 自动合并了一个有问题的 PR"
- **灵活应对**：遇到复杂 Issue 可以随时跳出 Skill 流程，进入对话式交互

### 适用场景

这套方案特别适合：

- **个人或小团队维护的开源项目**：人力有限，需要效率倍增器
- **API/SDK 类项目**：Schema 兼容性是核心关注点，AI review 可以针对性检查
- **频繁发版的项目**：标准化的发版流程适合用 Skill 封装

---

*本文基于 [alibabacloud-devops-mcp-server](https://github.com/aliyun/alibabacloud-devops-mcp-server) v0.3.43 的实际实践撰写。*
