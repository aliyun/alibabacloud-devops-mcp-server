# 项目管理 API 参考

## 目录
- [项目操作](#项目操作)
- [迭代管理](#迭代管理)
- [工作项管理](#工作项管理)
- [工作项类型](#工作项类型)
- [工时管理](#工时管理)

## 项目操作

### 获取项目
```
GET /oapi/v1/projex/organizations/{organizationId}/projects/{projectId}
```

### 搜索项目
```
GET /oapi/v1/projex/organizations/{organizationId}/projects
```
查询参数：
- `keyword`: 关键词
- `page`, `perPage`: 分页

## 迭代管理

### 获取迭代
```
GET /oapi/v1/projex/organizations/{organizationId}/projects/{projectId}/sprints/{sprintId}
```

### 列出迭代
```
GET /oapi/v1/projex/organizations/{organizationId}/projects/{projectId}/sprints
```
查询参数：
- `status`: 状态
- `page`, `perPage`: 分页

### 创建迭代
```
POST /oapi/v1/projex/organizations/{organizationId}/projects/{projectId}/sprints
```
请求体：
```json
{
  "name": "迭代名称",
  "startDate": "2024-01-01",
  "endDate": "2024-01-15",
  "description": "迭代描述"
}
```

### 更新迭代
```
PUT /oapi/v1/projex/organizations/{organizationId}/projects/{projectId}/sprints/{sprintId}
```

## 工作项管理

### 获取工作项
```
GET /oapi/v1/projex/organizations/{organizationId}/workitems/{workitemId}
```

### 搜索工作项
```
POST /oapi/v1/projex/organizations/{organizationId}/workitems/search
```
请求体：
```json
{
  "projectId": "项目ID",
  "workitemTypeId": "工作项类型ID",
  "status": "状态",
  "assignedTo": "负责人",
  "keyword": "关键词",
  "page": 1,
  "perPage": 20
}
```

### 创建工作项
```
POST /oapi/v1/projex/organizations/{organizationId}/workitems
```
请求体：
```json
{
  "projectId": "项目ID",
  "workitemTypeId": "工作项类型ID",
  "subject": "标题",
  "description": "描述",
  "assignedTo": "负责人ID",
  "sprintId": "迭代ID",
  "priority": "优先级"
}
```

### 更新工作项
```
PUT /oapi/v1/projex/organizations/{organizationId}/workitems/{workitemId}
```
请求体：
```json
{
  "subject": "新标题",
  "status": "新状态",
  "assignedTo": "新负责人"
}
```

### 工作项评论

#### 列出评论
```
GET /oapi/v1/projex/organizations/{organizationId}/workitems/{workitemId}/comments
```

#### 创建评论
```
POST /oapi/v1/projex/organizations/{organizationId}/workitems/{workitemId}/comments
```
请求体：
```json
{
  "content": "评论内容"
}
```

## 工作项类型

### 获取工作项类型
```
GET /oapi/v1/projex/organizations/{organizationId}/projects/{projectId}/workitemTypes/{workitemTypeId}
```

### 列出工作项类型
```
GET /oapi/v1/projex/organizations/{organizationId}/projects/{projectId}/workitemTypes
```

### 获取所有工作项类型
```
GET /oapi/v1/projex/organizations/{organizationId}/workitemTypes
```

### 获取字段配置
```
GET /oapi/v1/projex/organizations/{organizationId}/projects/{projectId}/workitemTypes/{workitemTypeId}/fieldConfig
```

### 获取工作流
```
GET /oapi/v1/projex/organizations/{organizationId}/projects/{projectId}/workitemTypes/{workitemTypeId}/workflow
```

## 工时管理

### 列出当前用户工时
```
GET /oapi/v1/projex/organizations/{organizationId}/effortRecords/currentUser
```
查询参数：
- `startTime`: 开始时间
- `endTime`: 结束时间
- `page`, `perPage`: 分页

### 列出工时记录
```
GET /oapi/v1/projex/organizations/{organizationId}/effortRecords
```

### 创建工时记录
```
POST /oapi/v1/projex/organizations/{organizationId}/effortRecords
```
请求体：
```json
{
  "workitemId": "工作项ID",
  "date": "2024-01-01",
  "hours": 8,
  "description": "工作描述"
}
```

### 更新工时记录
```
PUT /oapi/v1/projex/organizations/{organizationId}/effortRecords/{recordId}
```

### 预估工时

#### 列出预估工时
```
GET /oapi/v1/projex/organizations/{organizationId}/workitems/{workitemId}/estimatedEfforts
```

#### 创建预估工时
```
POST /oapi/v1/projex/organizations/{organizationId}/workitems/{workitemId}/estimatedEfforts
```
请求体：
```json
{
  "hours": 16,
  "description": "预估说明"
}
```

#### 更新预估工时
```
PUT /oapi/v1/projex/organizations/{organizationId}/workitems/{workitemId}/estimatedEfforts/{effortId}
```
