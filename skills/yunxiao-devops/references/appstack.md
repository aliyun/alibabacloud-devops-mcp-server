# 应用交付 API 参考

## 目录
- [应用管理](#应用管理)
- [部署单管理](#部署单管理)
- [变更请求](#变更请求)
- [应用编排](#应用编排)
- [变量组](#变量组)
- [发布流程](#发布流程)

## 应用管理

### 列出应用
```
GET /oapi/v1/appstack/organizations/{organizationId}/applications
```
查询参数：
- `page`, `perPage`: 分页
- `keyword`: 搜索关键词

### 获取应用
```
GET /oapi/v1/appstack/organizations/{organizationId}/applications/{applicationId}
```

### 创建应用
```
POST /oapi/v1/appstack/organizations/{organizationId}/applications
```
请求体：
```json
{
  "name": "应用名称",
  "description": "应用描述",
  "templateId": "模板ID"
}
```

### 更新应用
```
PUT /oapi/v1/appstack/organizations/{organizationId}/applications/{applicationId}
```

## 部署单管理

### 创建部署单
```
POST /oapi/v1/appstack/organizations/{organizationId}/applications/{applicationId}/changeOrders
```
请求体：
```json
{
  "name": "部署单名称",
  "description": "部署描述",
  "envId": "环境ID",
  "version": "1.0.0"
}
```

### 获取部署单
```
GET /oapi/v1/appstack/organizations/{organizationId}/applications/{applicationId}/changeOrders/{changeOrderId}
```

### 列出部署单
```
GET /oapi/v1/appstack/organizations/{organizationId}/applications/{applicationId}/changeOrders
```

### 获取部署单版本列表
```
GET /oapi/v1/appstack/organizations/{organizationId}/applications/{applicationId}/changeOrders/{changeOrderId}/versions
```

### 获取部署任务日志
```
GET /oapi/v1/appstack/organizations/{organizationId}/applications/{applicationId}/changeOrders/{changeOrderId}/jobs/{jobId}/logs
```

### 执行任务操作
```
POST /oapi/v1/appstack/organizations/{organizationId}/applications/{applicationId}/changeOrders/{changeOrderId}/jobs/{jobId}/action
```
请求体：
```json
{
  "action": "retry"  // retry, skip, cancel
}
```

## 变更请求

### 创建变更请求
```
POST /oapi/v1/appstack/organizations/{organizationId}/applications/{applicationId}/changeRequests
```

### 获取审批项
```
GET /oapi/v1/appstack/organizations/{organizationId}/applications/{applicationId}/changeRequests/{changeRequestId}/auditItems
```

### 列出执行记录
```
GET /oapi/v1/appstack/organizations/{organizationId}/applications/{applicationId}/changeRequests/{changeRequestId}/executions
```

### 取消变更请求
```
POST /oapi/v1/appstack/organizations/{organizationId}/applications/{applicationId}/changeRequests/{changeRequestId}/cancel
```

### 关闭变更请求
```
POST /oapi/v1/appstack/organizations/{organizationId}/applications/{applicationId}/changeRequests/{changeRequestId}/close
```

## 应用编排

### 获取最新编排
```
GET /oapi/v1/appstack/organizations/{organizationId}/applications/{applicationId}/orchestrations/latest
```

### 列出编排
```
GET /oapi/v1/appstack/organizations/{organizationId}/applications/{applicationId}/orchestrations
```

### 创建编排
```
POST /oapi/v1/appstack/organizations/{organizationId}/applications/{applicationId}/orchestrations
```

### 获取编排
```
GET /oapi/v1/appstack/organizations/{organizationId}/applications/{applicationId}/orchestrations/{orchestrationId}
```

### 更新编排
```
PUT /oapi/v1/appstack/organizations/{organizationId}/applications/{applicationId}/orchestrations/{orchestrationId}
```

### 删除编排
```
DELETE /oapi/v1/appstack/organizations/{organizationId}/applications/{applicationId}/orchestrations/{orchestrationId}
```

## 变量组

### 获取环境变量组
```
GET /oapi/v1/appstack/organizations/{organizationId}/envs/{envId}/variableGroups
```

### 创建变量组
```
POST /oapi/v1/appstack/organizations/{organizationId}/variableGroups
```
请求体：
```json
{
  "name": "变量组名称",
  "variables": [
    {"key": "DB_HOST", "value": "localhost"},
    {"key": "DB_PORT", "value": "3306"}
  ]
}
```

### 获取变量组
```
GET /oapi/v1/appstack/organizations/{organizationId}/variableGroups/{variableGroupId}
```

### 更新变量组
```
PUT /oapi/v1/appstack/organizations/{organizationId}/variableGroups/{variableGroupId}
```

### 删除变量组
```
DELETE /oapi/v1/appstack/organizations/{organizationId}/variableGroups/{variableGroupId}
```

## 发布流程

### 列出发布流程
```
GET /oapi/v1/appstack/organizations/{organizationId}/applications/{applicationId}/releaseWorkflows
```

### 获取发布阶段
```
GET /oapi/v1/appstack/organizations/{organizationId}/applications/{applicationId}/releaseWorkflows/{workflowId}/stages/{stageId}
```

### 列出阶段运行记录
```
GET /oapi/v1/appstack/organizations/{organizationId}/applications/{applicationId}/releaseWorkflows/{workflowId}/stages/{stageId}/runs
```

### 执行发布阶段
```
POST /oapi/v1/appstack/organizations/{organizationId}/applications/{applicationId}/releaseWorkflows/{workflowId}/stages/{stageId}/execute
```

### 取消阶段执行
```
POST /oapi/v1/appstack/organizations/{organizationId}/applications/{applicationId}/releaseWorkflows/{workflowId}/stages/{stageId}/cancel
```

### 重试流水线
```
POST /oapi/v1/appstack/organizations/{organizationId}/applications/{applicationId}/releaseWorkflows/{workflowId}/stages/{stageId}/pipelines/{pipelineId}/retry
```

### 跳过流水线
```
POST /oapi/v1/appstack/organizations/{organizationId}/applications/{applicationId}/releaseWorkflows/{workflowId}/stages/{stageId}/pipelines/{pipelineId}/skip
```

### 通过/拒绝验证
```
POST /oapi/v1/appstack/organizations/{organizationId}/applications/{applicationId}/releaseWorkflows/{workflowId}/stages/{stageId}/pipelines/{pipelineId}/validate/pass
POST /oapi/v1/appstack/organizations/{organizationId}/applications/{applicationId}/releaseWorkflows/{workflowId}/stages/{stageId}/pipelines/{pipelineId}/validate/refuse
```

## 全局变量

### 创建全局变量
```
POST /oapi/v1/appstack/organizations/{organizationId}/globalVars
```

### 获取全局变量
```
GET /oapi/v1/appstack/organizations/{organizationId}/globalVars/{varId}
```

### 更新全局变量
```
PUT /oapi/v1/appstack/organizations/{organizationId}/globalVars/{varId}
```

### 列出全局变量
```
GET /oapi/v1/appstack/organizations/{organizationId}/globalVars
```

## 应用模板

### 搜索应用模板
```
GET /oapi/v1/appstack/organizations/{organizationId}/appTemplates
```
查询参数：
- `keyword`: 搜索关键词
- `page`, `perPage`: 分页
