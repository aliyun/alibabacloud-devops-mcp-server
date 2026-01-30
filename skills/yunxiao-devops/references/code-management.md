# 代码管理 API 参考

## 目录
- [分支操作](#分支操作)
- [文件操作](#文件操作)
- [仓库操作](#仓库操作)
- [合并请求](#合并请求)
- [提交操作](#提交操作)

## 分支操作

### 创建分支
```
POST /oapi/v1/codeup/organizations/{organizationId}/repositories/{repositoryId}/branches?branch={branch}&ref={ref}
```
参数：
- `organizationId`: 组织 ID
- `repositoryId`: 仓库 ID（如 `123456` 或 `groupName%2FrepoName`）
- `branch`: 新分支名
- `ref`: 源分支或提交（默认 master）

### 获取分支
```
GET /oapi/v1/codeup/organizations/{organizationId}/repositories/{repositoryId}/branches/{branchName}
```

### 删除分支
```
DELETE /oapi/v1/codeup/organizations/{organizationId}/repositories/{repositoryId}/branches/{branchName}
```

### 列出分支
```
GET /oapi/v1/codeup/organizations/{organizationId}/repositories/{repositoryId}/branches
```
查询参数：
- `page`: 页码
- `perPage`: 每页数量
- `sort`: 排序（name_asc, name_desc, updated_asc, updated_desc）
- `search`: 搜索关键词

## 文件操作

### 获取文件内容
```
GET /oapi/v1/codeup/organizations/{organizationId}/repositories/{repositoryId}/files/{filePath}/blobs
```
查询参数：
- `ref`: 分支或提交

### 创建文件
```
POST /oapi/v1/codeup/organizations/{organizationId}/repositories/{repositoryId}/files
```
请求体：
```json
{
  "filePath": "path/to/file.txt",
  "content": "文件内容（Base64）",
  "branch": "master",
  "commitMessage": "提交信息"
}
```

### 更新文件
```
PUT /oapi/v1/codeup/organizations/{organizationId}/repositories/{repositoryId}/files
```

### 删除文件
```
DELETE /oapi/v1/codeup/organizations/{organizationId}/repositories/{repositoryId}/files
```

### 列出文件树
```
GET /oapi/v1/codeup/organizations/{organizationId}/repositories/{repositoryId}/files/tree
```

## 仓库操作

### 获取仓库信息
```
GET /oapi/v1/codeup/organizations/{organizationId}/repositories/{repositoryId}
```

### 列出仓库
```
GET /oapi/v1/codeup/organizations/{organizationId}/repositories
```
查询参数：
- `page`: 页码
- `perPage`: 每页数量
- `search`: 搜索关键词
- `orderBy`: 排序字段

## 合并请求

### 创建合并请求
```
POST /oapi/v1/codeup/organizations/{organizationId}/repositories/{repositoryId}/changeRequests
```
请求体：
```json
{
  "sourceBranch": "feature-branch",
  "targetBranch": "master",
  "title": "合并请求标题",
  "description": "描述",
  "reviewerIds": ["user1", "user2"]
}
```

### 获取合并请求
```
GET /oapi/v1/codeup/organizations/{organizationId}/repositories/{repositoryId}/changeRequests/{localId}
```

### 列出合并请求
```
GET /oapi/v1/codeup/organizations/{organizationId}/repositories/{repositoryId}/changeRequests
```
查询参数：
- `state`: 状态（opened, merged, closed）
- `page`, `perPage`: 分页
- `search`: 搜索

### 创建评论
```
POST /oapi/v1/codeup/organizations/{organizationId}/repositories/{repositoryId}/changeRequests/{localId}/comments
```
请求体：
```json
{
  "commentType": "GLOBAL_COMMENT",
  "content": "评论内容"
}
```
评论类型：
- `GLOBAL_COMMENT`: 全局评论
- `INLINE_COMMENT`: 行内评论（需要 filePath, lineNumber）

### 列出评论
```
GET /oapi/v1/codeup/organizations/{organizationId}/repositories/{repositoryId}/changeRequests/{localId}/comments
```

## 提交操作

### 列出提交
```
GET /oapi/v1/codeup/organizations/{organizationId}/repositories/{repositoryId}/commits
```

### 获取提交详情
```
GET /oapi/v1/codeup/organizations/{organizationId}/repositories/{repositoryId}/commits/{sha}
```

### 代码比较
```
GET /oapi/v1/codeup/organizations/{organizationId}/repositories/{repositoryId}/compare
```
查询参数：
- `from`: 源分支/提交
- `to`: 目标分支/提交

## 注意事项

1. **repositoryId 编码**: 如果仓库 ID 包含斜杠（如 `group/repo`），需要 URL 编码为 `group%2Frepo`
2. **branchName 编码**: 如果分支名包含斜杠（如 `feature/xxx`），需要 URL 编码
3. **文件内容**: 创建/更新文件时，内容需要 Base64 编码
