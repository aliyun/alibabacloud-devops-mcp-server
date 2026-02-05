# 组织管理 API 参考

## 目录
- [组织信息](#组织信息)
- [成员管理](#成员管理)
- [部门管理](#部门管理)
- [角色管理](#角色管理)

## 组织信息

### 获取当前组织
```
GET /oapi/v1/organization/current
```
返回当前令牌关联的组织信息。

### 获取用户组织列表
```
GET /oapi/v1/organization/userOrganizations
```
返回用户加入的所有组织。

## 成员管理

### 获取成员列表
```
GET /oapi/v1/organization/{organizationId}/members
```
查询参数：
- `page`: 页码
- `perPage`: 每页数量
- `departmentId`: 部门 ID（可选）

### 获取成员信息
```
GET /oapi/v1/organization/{organizationId}/members/{memberId}
```

### 通过用户 ID 获取成员
```
GET /oapi/v1/organization/{organizationId}/members/byUserId/{userId}
```

### 搜索成员
```
GET /oapi/v1/organization/{organizationId}/members/search
```
查询参数：
- `keyword`: 搜索关键词（姓名、邮箱等）
- `page`, `perPage`: 分页

## 部门管理

### 获取部门列表
```
GET /oapi/v1/organization/{organizationId}/departments
```
查询参数：
- `parentId`: 父部门 ID（不传则获取顶级部门）
- `page`, `perPage`: 分页

### 获取部门信息
```
GET /oapi/v1/organization/{organizationId}/departments/{departmentId}
```

### 获取部门上级
```
GET /oapi/v1/organization/{organizationId}/departments/{departmentId}/ancestors
```
返回从当前部门到根部门的完整路径。

## 角色管理

### 获取组织角色信息
```
GET /oapi/v1/organization/{organizationId}/role
```

### 列出组织角色
```
GET /oapi/v1/organization/{organizationId}/roles
```
查询参数：
- `page`, `perPage`: 分页

## 响应示例

### 组织信息
```json
{
  "id": "org123456",
  "name": "示例组织",
  "description": "组织描述",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### 成员信息
```json
{
  "id": "member123",
  "userId": "user456",
  "name": "张三",
  "email": "zhangsan@example.com",
  "avatar": "https://...",
  "departmentId": "dept789",
  "role": "developer"
}
```

### 部门信息
```json
{
  "id": "dept789",
  "name": "研发部",
  "parentId": "dept001",
  "path": "/公司/技术中心/研发部",
  "memberCount": 50
}
```
