---
name: mcp_triage
description: 批量处理 GitHub 上的 open issues 和 pull requests。逐一分析、评审、修复，所有破坏性操作（merge、close、comment）均需用户确认。当用户说"处理 issue"、"处理 PR"、"triage"时使用。
---

# 处理 Issues 和 Pull Requests

批量处理当前仓库的所有 open issues 和 pull requests。

## 前置条件

- 已安装 `gh` CLI 并已登录（`gh auth status`）
- 当前目录是目标仓库的 git 工作区

## 处理流程

### Step 1: 获取概览

获取所有 open issues 和 PRs：

```bash
gh issue list --state open --json number,title,author,labels,createdAt,body --limit 50
gh pr list --state open --json number,title,author,labels,createdAt,isDraft,headRefName,baseRefName --limit 50
```

输出汇总表格，让用户了解当前工作量。

### Step 2: 排序

按以下优先级处理：

**Issues：**
1. 带 `bug` 标签的 issue
2. 带 `security` 标签的 issue
3. 其他 issue（按创建时间从旧到新）

**Pull Requests：**
1. dependabot PR — patch/minor 升级（最简单，快速处理）
2. dependabot PR — major 升级
3. 社区贡献的 PR（按创建时间从旧到新）

### Step 3: 逐一处理 Issue

对每个 issue 依次执行以下步骤：

#### 3a. 展示信息

```bash
gh issue view <number> --json title,body,author,labels,comments
```

展示 issue 标题、作者、创建时间、内容摘要。

#### 3b. 分析根因

- 在代码库中搜索 issue 中提到的关键字（函数名、参数名、错误信息）
- 追踪相关代码路径
- 如果 issue 涉及 API 行为，用 `.env` 中的 token 实际调用验证

#### 3c. 给出结论并询问用户

给出以下三类结论之一，**必须等用户确认后才执行操作**：

| 结论 | 操作 | 需要确认 |
|------|------|---------|
| 可修复 | 提出修复方案，修复代码 | 是 — 确认方案后修复 |
| 需要更多信息 | 草拟回复 comment 请求补充信息 | 是 — 确认内容后发送 |
| Won't fix / 非 bug | 草拟回复并建议关闭 | 是 — 确认后关闭 |

修复 issue 后，**不要自动发版**。代码修改完成后告知用户，由用户决定是否发版。

### Step 4: 逐一处理 Pull Request

对每个 PR 依次执行以下步骤：

#### 4a. 展示信息

```bash
gh pr view <number> --json title,body,author,labels,files,additions,deletions,commits
gh pr diff <number>
```

展示 PR 标题、作者、变更文件数、增删行数。

#### 4b. 代码评审

阅读 diff 内容，按以下维度评审：

- **TypeScript 类型安全**：类型是否正确，是否有 `any` 滥用
- **Zod schema 正确性**：新增字段的类型、optional/required 是否与 API 一致
- **API 兼容性**：tool name 或 inputSchema 是否有 breaking change
- **安全性**：有无凭证泄露、注入风险
- **依赖升级**（dependabot PR）：查看 changelog 确认无 breaking change

#### 4c. 给出结论并询问用户

| 结论 | 操作 | 需要确认 |
|------|------|---------|
| 建议合并 | `gh pr review --approve` + `gh pr merge --squash` | 是 |
| 需要修改 | 草拟 review comment 指出问题 | 是 — 确认内容后发送 |
| 建议关闭 | 说明理由，草拟关闭 comment | 是 — 确认后关闭 |

对于 dependabot 的 patch/minor PR，可以批量展示评审结果，询问用户是否一次性全部合并。

### Step 5: 汇总报告

所有 issue 和 PR 处理完毕后，输出汇总：

```
处理完成
Issues:
  - #74: 已修复并关闭
  - #65: 已回复，等待用户反馈
Pull Requests:
  - #73: 已合并 (qs 6.15.0 → 6.15.2)
  - #69: 已合并 (fast-uri 3.1.0 → 3.1.2)
  - #27: 已发送 review comment
待发版: 有 N 个修复待发版（需要手动执行发版）
```

## 核心原则

1. **所有破坏性操作必须等用户确认** — merge、close、comment 都需要明确同意
2. **不自动发版** — 修复代码后告知用户，由用户决定何时发版
3. **使用 `gh` CLI** — 所有 GitHub 交互通过 `gh` 命令完成
4. **逐一处理** — 不要跳过任何 issue 或 PR，按优先级依次处理
