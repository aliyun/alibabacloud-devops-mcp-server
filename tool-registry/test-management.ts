import { toInputSchema } from '../common/inputSchema.js';
import {
  ListDirectoriesRequestSchema,
  CreateTestcaseDirectoryRequestSchema,
  GetTestcaseFieldConfigRequestSchema,
  CreateTestcaseRequestSchema,
  SearchTestcasesRequestSchema,
  GetTestcaseRequestSchema,
  DeleteTestcaseRequestSchema,
  ListTestcaseCommentsRequestSchema,
  CreateTestcaseCommentRequestSchema,
} from '../operations/testhub/testcases.js';
import {
  ListTestPlanRequestSchema,
  GetTestResultListRequestSchema,
  UpdateTestResultRequestSchema,
  GetTestPlanProgressRequestSchema,
  GetTestPlanResultDirectoryListRequestSchema,
  ListTestRepoTagsRequestSchema,
  ListTestReposRequestSchema,
  ListTestPlanTestcaseCommentsRequestSchema,
  CreateTestPlanTestcaseCommentRequestSchema,
} from '../operations/testhub/testplans.js';

// Export all test management tools
export const getTestManagementTools = () => [
  {
    name: 'list_testcase_directories',
    description: '[test management] 获取测试用例目录列表',
    inputSchema: toInputSchema(ListDirectoriesRequestSchema),
  },
  {
    name: 'create_testcase_directory',
    description: '[test management] 创建测试用例目录',
    inputSchema: toInputSchema(CreateTestcaseDirectoryRequestSchema),
  },
  {
    name: 'get_testcase_field_config',
    description: '[test management] 获取测试用例字段配置',
    inputSchema: toInputSchema(GetTestcaseFieldConfigRequestSchema),
  },
  {
    name: 'create_testcase',
    description: '[test management] 创建测试用例',
    inputSchema: toInputSchema(CreateTestcaseRequestSchema),
  },
  {
    name: 'search_testcases',
    description: '[test management] 搜索测试用例。分页有上限:page * perPage 不能超过 10000,超出会返回 400,需要更多结果时用 directoryId 或 conditions 缩小范围',
    inputSchema: toInputSchema(SearchTestcasesRequestSchema),
  },
  {
    name: 'get_testcase',
    description: '[test management] 获取测试用例信息',
    inputSchema: toInputSchema(GetTestcaseRequestSchema),
  },
  {
    name: 'delete_testcase',
    description: '[test management] 删除测试用例',
    inputSchema: toInputSchema(DeleteTestcaseRequestSchema),
    annotations: {
      destructiveHint: true,
    },
  },
  {
    name: 'list_test_plans',
    description: '[test management] 获取测试计划列表',
    inputSchema: toInputSchema(ListTestPlanRequestSchema),
  },
  {
    name: 'get_test_result_list',
    description: '[test management] 获取测试计划中测试用例列表',
    inputSchema: toInputSchema(GetTestResultListRequestSchema),
  },
  {
    name: 'update_test_result',
    description: '[test management] 更新测试结果',
    inputSchema: toInputSchema(UpdateTestResultRequestSchema),
  },
  {
    name: 'get_test_plan_progress',
    description: '[test management] 获取测试计划用例执行进度统计（通过/失败/延后/待执行）',
    inputSchema: toInputSchema(GetTestPlanProgressRequestSchema),
  },
  {
    name: 'list_test_plan_result_directories',
    description: '[test management] 获取测试计划结果目录列表，按用例库分组返回目录树及每个目录下的用例数量',
    inputSchema: toInputSchema(GetTestPlanResultDirectoryListRequestSchema),
  },
  {
    name: 'list_test_repo_tags',
    description: '[test management] 获取测试用例库标签列表，支持分页与按名称关键词过滤',
    inputSchema: toInputSchema(ListTestRepoTagsRequestSchema),
  },
  {
    name: 'list_test_repos',
    description: '[test management] 获取用例库列表，支持分页与按名称模糊筛选',
    inputSchema: toInputSchema(ListTestReposRequestSchema),
  },
  {
    name: 'list_testcase_comments',
    description: '[test management] 获取测试用例评论列表',
    inputSchema: toInputSchema(ListTestcaseCommentsRequestSchema),
  },
  {
    name: 'create_testcase_comment',
    description: '[test management] 创建测试用例评论，支持回复（通过parentId）',
    inputSchema: toInputSchema(CreateTestcaseCommentRequestSchema),
  },
  {
    name: 'list_test_plan_testcase_comments',
    description: '[test management] 获取测试计划中测试用例的评论列表（与用例库中的用例评论不同，这里是测试计划上下文）',
    inputSchema: toInputSchema(ListTestPlanTestcaseCommentsRequestSchema),
  },
  {
    name: 'create_test_plan_testcase_comment',
    description: '[test management] 创建测试计划中测试用例的评论，支持回复（通过parentId）。与用例库中的用例评论不同，这里是测试计划上下文',
    inputSchema: toInputSchema(CreateTestPlanTestcaseCommentRequestSchema),
  },
];

