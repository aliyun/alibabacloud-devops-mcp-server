# Test Management (test-management)

Tools in this toolset: **10**

## Tools

- `create_testcase_directory` - [test management] 创建测试用例目录
    - **Required parameters**:
      - `organizationId` (string): 组织ID
      - `testRepoId` (string): 用例库唯一标识
      - `name` (string): 目录名称
    - **Optional parameters**:
      - `parentIdentifier` (string): 父目录ID


- `create_testcase` - [test management] 创建测试用例
    - **Required parameters**:
      - `organizationId` (string): 组织ID
      - `testRepoId` (string): 用例库唯一标识
    - **Optional parameters**:
      - `subject` (string): 标题
      - `assignedTo` (string): 负责人userId
      - `directoryId` (string): 目录id
      - `preCondition` (string): 前置条件
      - `labels` (array): 标签ids
      - `customFieldValues` (object): 自定义字段值
      - `testSteps` (object): 测试步骤

### Delete Operations

- `delete_testcase` - [test management] 删除测试用例
    - **Required parameters**:
      - `organizationId` (string): 组织ID
      - `testRepoId` (string): 用例库唯一标识
      - `testcaseId` (string): 用例唯一标识

### Execute

- `get_testcase_field_config` - [test management] 获取测试用例字段配置
    - **Required parameters**:
      - `organizationId` (string): 组织ID
      - `testRepoId` (string): 用例库唯一标识


- `get_testcase` - [test management] 获取测试用例信息
    - **Required parameters**:
      - `organizationId` (string): 组织ID
      - `testRepoId` (string): 用例库唯一标识
      - `testcaseId` (string): 用例唯一标识


- `get_test_result_list` - [test management] 获取测试计划中测试用例列表
    - **Required parameters**:
      - `organizationId` (string): 组织ID
      - `testPlanIdentifier` (string): 测试计划id
      - `directoryIdentifier` (string): 目录id

### List Operations

- `list_testcase_directories` - [test management] 获取测试用例目录列表
    - **Required parameters**:
      - `organizationId` (string): 组织ID
      - `testRepoId` (string): 用例库唯一标识


- `list_test_plans` - [test management] 获取测试计划列表
    - **Required parameters**:
      - `organizationId` (string): 组织ID

### Other Operations

- `search_testcases` - [test management] 搜索测试用例
    - **Required parameters**:
      - `organizationId` (string): 组织ID
      - `testRepoId` (string): 用例库唯一标识
    - **Optional parameters**:
      - `page` (integer): 分页参数，第几页
      - `perPage` (integer): 分页参数，每页大小
      - `orderBy` (string): 排序字段
      - `sort` (string): 排序方式
      - `directoryId` (string): 目录id
      - `conditions` (string): 过滤条件，是一个json串

### Skip

- `update_test_result` - [test management] 更新测试结果
    - **Required parameters**:
      - `organizationId` (string): 组织ID
      - `testplanId` (string): 测试计划唯一标识
      - `testcaseId` (string): 测试用例唯一标识
    - **Optional parameters**:
      - `executor` (string): 执行人userId
      - `status` (string): 状态

## Instructions