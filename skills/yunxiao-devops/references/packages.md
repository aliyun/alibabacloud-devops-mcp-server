# 制品仓库 API 参考

## 目录
- [仓库管理](#仓库管理)
- [制品查询](#制品查询)

## 仓库管理

### 列出制品仓库
```
GET /oapi/v1/packages/organizations/{organizationId}/repositories
```
查询参数：
- `page`: 页码
- `perPage`: 每页数量
- `type`: 仓库类型（maven, npm, pypi, docker 等）

返回示例：
```json
{
  "items": [
    {
      "id": "repo123",
      "name": "maven-releases",
      "type": "maven",
      "description": "Maven 发布仓库",
      "url": "https://packages.aliyun.com/maven/..."
    }
  ],
  "total": 10,
  "page": 1,
  "perPage": 20
}
```

## 制品查询

### 查询制品列表
```
GET /oapi/v1/packages/organizations/{organizationId}/repositories/{repositoryId}/artifacts
```
查询参数：
- `page`: 页码
- `perPage`: 每页数量
- `keyword`: 搜索关键词
- `groupId`: 组 ID（Maven）
- `artifactId`: 制品 ID（Maven）

### 获取制品详情
```
GET /oapi/v1/packages/organizations/{organizationId}/repositories/{repositoryId}/artifacts/{artifactId}
```

返回示例：
```json
{
  "id": "artifact123",
  "name": "my-library",
  "version": "1.0.0",
  "type": "jar",
  "size": 1024000,
  "downloadUrl": "https://...",
  "createdAt": "2024-01-01T00:00:00Z",
  "metadata": {
    "groupId": "com.example",
    "artifactId": "my-library"
  }
}
```

## 仓库类型

支持的制品仓库类型：

| 类型 | 说明 |
|------|------|
| `maven` | Maven 仓库 |
| `npm` | NPM 仓库 |
| `pypi` | Python PyPI 仓库 |
| `docker` | Docker 镜像仓库 |
| `generic` | 通用制品仓库 |
| `helm` | Helm Chart 仓库 |

## 使用场景

1. **查看可用仓库**: 列出组织下所有制品仓库
2. **搜索制品**: 在指定仓库中搜索特定制品
3. **获取下载链接**: 获取制品详情以获得下载 URL
4. **版本管理**: 查看制品的不同版本
