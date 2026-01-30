# 流水线管理 API 参考

## 目录
- [流水线操作](#流水线操作)
- [流水线运行](#流水线运行)
- [任务管理](#任务管理)
- [服务连接](#服务连接)
- [智能创建](#智能创建)

## 流水线操作

### 获取流水线
```
GET /oapi/v1/flow/organizations/{organizationId}/pipelines/{pipelineId}
```

### 列出流水线
```
GET /oapi/v1/flow/organizations/{organizationId}/pipelines
```
查询参数：
- `pipelineName`: 流水线名称
- `page`, `perPage`: 分页

### 更新流水线
```
PUT /oapi/v1/flow/organizations/{organizationId}/pipelines/{pipelineId}
```

## 流水线运行

### 运行流水线
```
POST /oapi/v1/flow/organizations/{organizationId}/pipelines/{pipelineId}/runs
```
请求体：
```json
{
  "params": {
    "branch": "master"
  }
}
```

### 获取最新运行
```
GET /oapi/v1/flow/organizations/{organizationId}/pipelines/{pipelineId}/runs/latest
```

### 获取运行详情
```
GET /oapi/v1/flow/organizations/{organizationId}/pipelines/{pipelineId}/runs/{pipelineRunId}
```

### 列出运行记录
```
GET /oapi/v1/flow/organizations/{organizationId}/pipelines/{pipelineId}/runs
```
查询参数：
- `status`: 状态（SUCCESS, RUNNING, FAIL, CANCELED, WAITING）
- `page`, `perPage`: 分页

## 任务管理

### 列出任务（按类别）
```
GET /oapi/v1/flow/organizations/{organizationId}/pipelines/{pipelineId}/jobs
```
查询参数：
- `category`: 类别（DEPLOY）

### 获取任务执行历史
```
GET /oapi/v1/flow/organizations/{organizationId}/pipelines/{pipelineId}/jobs/{jobId}/historys
```

### 执行任务
```
POST /oapi/v1/flow/organizations/{organizationId}/pipelines/{pipelineId}/runs/{pipelineRunId}/jobs/{jobId}/run
```

### 获取任务日志
```
GET /oapi/v1/flow/organizations/{organizationId}/pipelines/{pipelineId}/runs/{pipelineRunId}/jobs/{jobId}/log
```

## 服务连接

### 列出服务连接
```
GET /oapi/v1/flow/organizations/{organizationId}/serviceConnections
```
查询参数：
- `type`: 类型（codeup, ecs, k8s 等）

## 智能创建

### 根据描述创建流水线

通过检测项目技术栈自动生成流水线配置：

**技术栈检测规则：**
- `pom.xml` → Java Maven
- `build.gradle` → Java Gradle
- `package.json` + `package-lock.json` → Node.js npm
- `package.json` + `yarn.lock` → Node.js yarn
- `requirements.txt` → Python pip
- `go.mod` → Go
- `*.csproj` → .NET

**部署目标解析：**
- "部署到主机/VM/虚拟机" → deployTarget='vm'
- "部署到 Kubernetes/K8s" → deployTarget='k8s'
- "只构建/构建制品" → deployTarget='none'

**创建流程：**
1. 检测 git 仓库 URL：`git config --get remote.origin.url`
2. 检测当前分支：`git branch --show-current`
3. 检测项目文件确定技术栈
4. 调用创建 API

```
POST /oapi/v1/flow/organizations/{organizationId}/pipelines/smart
```
请求体：
```json
{
  "name": "流水线名称",
  "repoUrl": "git@codeup.aliyun.com:org/repo.git",
  "branch": "master",
  "buildLanguage": "java",
  "buildTool": "maven",
  "deployTarget": "vm"
}
```

## VM 部署操作

### 获取 VM 部署单
```
GET /oapi/v1/flow/organizations/{organizationId}/pipelines/{pipelineId}/vmDeployOrders/{deployOrderId}
```

### 停止 VM 部署
```
POST /oapi/v1/flow/organizations/{organizationId}/pipelines/{pipelineId}/vmDeployOrders/{deployOrderId}/stop
```

### 恢复 VM 部署
```
POST /oapi/v1/flow/organizations/{organizationId}/pipelines/{pipelineId}/vmDeployOrders/{deployOrderId}/resume
```

### 跳过机器
```
POST /oapi/v1/flow/organizations/{organizationId}/pipelines/{pipelineId}/vmDeployOrders/{deployOrderId}/machines/{machineId}/skip
```

### 重试机器
```
POST /oapi/v1/flow/organizations/{organizationId}/pipelines/{pipelineId}/vmDeployOrders/{deployOrderId}/machines/{machineId}/retry
```

## 标签管理

### 创建标签组
```
POST /oapi/v1/flow/organizations/{organizationId}/tagGroups
```

### 列出标签组
```
GET /oapi/v1/flow/organizations/{organizationId}/tagGroups
```

### 创建标签
```
POST /oapi/v1/flow/organizations/{organizationId}/tagGroups/{tagGroupId}/tags
```
