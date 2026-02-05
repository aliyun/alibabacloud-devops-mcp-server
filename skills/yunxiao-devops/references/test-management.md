# 测试管理 API 参考

## 目录
- [测试用例](#测试用例)
- [测试计划](#测试计划)
- [测试结果](#测试结果)

## 测试用例

### 列出测试用例目录
```
GET /oapi/v1/testhub/organizations/{organizationId}/projects/{projectId}/testcases/directories
```
查询参数：
- `parentId`: 父目录 ID
- `page`, `perPage`: 分页

### 创建测试用例目录
```
POST /oapi/v1/testhub/organizations/{organizationId}/projects/{projectId}/testcases/directories
```
请求体：
```json
{
  "name": "目录名称",
  "parentId": "父目录ID"
}
```

### 获取测试用例字段配置
```
GET /oapi/v1/testhub/organizations/{organizationId}/projects/{projectId}/testcases/fieldConfig
```
返回测试用例可用的字段及其配置。

### 创建测试用例
```
POST /oapi/v1/testhub/organizations/{organizationId}/projects/{projectId}/testcases
```
请求体：
```json
{
  "name": "测试用例名称",
  "directoryId": "目录ID",
  "priority": "P0",
  "precondition": "前置条件",
  "steps": [
    {
      "step": "步骤1描述",
      "expectedResult": "预期结果1"
    },
    {
      "step": "步骤2描述",
      "expectedResult": "预期结果2"
    }
  ]
}
```

### 搜索测试用例
```
POST /oapi/v1/testhub/organizations/{organizationId}/projects/{projectId}/testcases/search
```
请求体：
```json
{
  "keyword": "搜索关键词",
  "directoryId": "目录ID",
  "priority": "P0",
  "page": 1,
  "perPage": 20
}
```

### 获取测试用例
```
GET /oapi/v1/testhub/organizations/{organizationId}/projects/{projectId}/testcases/{testcaseId}
```

### 删除测试用例
```
DELETE /oapi/v1/testhub/organizations/{organizationId}/projects/{projectId}/testcases/{testcaseId}
```

## 测试计划

### 列出测试计划
```
GET /oapi/v1/testhub/organizations/{organizationId}/projects/{projectId}/testPlans
```
查询参数：
- `status`: 状态
- `page`, `perPage`: 分页

返回示例：
```json
{
  "items": [
    {
      "id": "plan123",
      "name": "回归测试计划",
      "status": "进行中",
      "totalCases": 100,
      "passedCases": 80,
      "failedCases": 5,
      "blockedCases": 2,
      "pendingCases": 13
    }
  ]
}
```

## 测试结果

### 获取测试结果列表
```
GET /oapi/v1/testhub/organizations/{organizationId}/projects/{projectId}/testPlans/{testPlanId}/testResults
```
查询参数：
- `status`: 结果状态（passed, failed, blocked, pending）
- `page`, `perPage`: 分页

### 更新测试结果
```
PUT /oapi/v1/testhub/organizations/{organizationId}/projects/{projectId}/testPlans/{testPlanId}/testResults/{testResultId}
```
请求体：
```json
{
  "status": "passed",
  "comment": "测试通过备注",
  "actualResult": "实际结果描述"
}
```

## 优先级说明

测试用例优先级：

| 优先级 | 说明 |
|--------|------|
| P0 | 最高优先级，核心功能 |
| P1 | 高优先级，重要功能 |
| P2 | 中优先级，一般功能 |
| P3 | 低优先级，边缘功能 |

## 测试结果状态

| 状态 | 说明 |
|------|------|
| passed | 测试通过 |
| failed | 测试失败 |
| blocked | 测试被阻塞 |
| pending | 待测试 |
| skipped | 跳过 |

## 使用场景

1. **创建测试套件**: 创建目录结构组织测试用例
2. **编写测试用例**: 在目录中创建详细的测试步骤
3. **执行测试计划**: 在测试计划中执行测试并记录结果
4. **查看测试报告**: 获取测试计划的执行统计
