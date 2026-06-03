---
name: mcp_release
description: 发布新版本的完整流程。自动升级 package.json 版本号、构建项目、提交推送代码、创建 git tag、构建 Docker 镜像、创建 GitHub Release。当用户要求发布新版本、发版、release 时使用此 skill。
---

# 发布新版本

执行完整的版本发布流程，包括版本号升级、构建、提交、打标签、Docker 构建和 GitHub Release 创建。

## 前置条件

- 工作区干净或所有变更已暂存
- 已安装 `gh` CLI 并已登录
- 有远程仓库的推送权限

## 发布流程

按以下步骤顺序执行，每步完成后确认成功再继续：

### Step 1: 读取当前版本号

```bash
node -p "require('./package.json').version"
```

记录当前版本号，计算新版本号（patch 位 +1）。
例如：`0.3.17` → `0.3.18`

如果用户指定了版本号，使用用户指定的版本号。

### Step 2: 升级版本号

```bash
npm version patch --no-git-tag-version
```

如果用户指定了具体版本号，使用：
```bash
npm version <指定版本号> --no-git-tag-version
```

验证版本号已更新：
```bash
node -p "require('./package.json').version"
```

同步更新 `common/version.ts` 中的版本号（与 package.json 保持一致）：

使用 search_replace 工具将 `common/version.ts` 中的 `VERSION` 值替换为新版本号。
文件内容格式为：`export const VERSION = "<旧版本号>";`，替换为 `export const VERSION = "<新版本号>";`。

验证：
```bash
node -e "console.log(require('./common/version.ts'.replace('.ts','')))|| console.log('check common/version.ts manually')"
```
或直接读取 `common/version.ts` 确认版本号已更新。

### Step 3: 构建项目

```bash
npm run build
```

确认构建成功（退出码为 0）。

### Step 4: 提交代码并推送

```bash
git add -A
git commit -m "chore: release v<新版本号>"
git push
```

### Step 5: 创建 Git Tag 并推送

```bash
git tag v<新版本号>
git push origin v<新版本号>
```

### Step 6: 构建 Docker 镜像

```bash
bash build_docker.sh
```

确认脚本执行成功。

### Step 7: 创建 GitHub Release

```bash
gh release create v<新版本号> --title "v<新版本号>" --latest --generate-notes
```

使用 `--generate-notes` 自动生成 release notes，`--latest` 标记为最新 release。

## 完成确认

所有步骤完成后，输出发布摘要：

```
发布完成 ✅
- 版本: v<新版本号>
- Tag: v<新版本号>
- Docker: 构建完成
- Release: https://github.com/<owner>/<repo>/releases/tag/v<新版本号>
```

## 异常处理

- 构建失败：检查错误日志，修复后重新执行 Step 3
- 推送失败：检查远程仓库权限和网络连接
- Docker 构建失败：检查 Docker 是否运行、Dockerfile 配置
- gh 命令失败：检查 `gh auth status`，确保已登录
