import {
  listDirectories,
  createTestcaseDirectory,
  getTestcaseFieldConfig,
  createTestcase,
  searchTestcases,
  getTestcase,
  deleteTestcase,
  listTestcaseComments,
  createTestcaseComment,
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
  listTestPlan,
  getTestResultList,
  updateTestResult,
  getTestPlanProgress,
  getTestPlanResultDirectoryList,
  listTestRepoTags,
  listTestRepos,
  ListTestPlanRequestSchema,
  GetTestResultListRequestSchema,
  UpdateTestResultRequestSchema,
  GetTestPlanProgressRequestSchema,
  GetTestPlanResultDirectoryListRequestSchema,
  ListTestRepoTagsRequestSchema,
  ListTestReposRequestSchema,
} from '../operations/testhub/testplans.js';

/**
 * Handle the test management tool requests
 * 
 * @param request - The tool request
 * @returns The tool response or null if not handled
 */
export async function handleTestManagementTools(request: any) {
  switch (request.params.name) {
    case 'list_testcase_directories':
      const listDirsParams = ListDirectoriesRequestSchema.parse(request.params.arguments);
      const listDirsResult = await listDirectories(listDirsParams);
      return {
        content: [{ type: "text", text: JSON.stringify(listDirsResult, null, 2) }],
      };
      
    case 'create_testcase_directory':
      const createDirParams = CreateTestcaseDirectoryRequestSchema.parse(request.params.arguments);
      const createDirResult = await createTestcaseDirectory(createDirParams);
      return {
        content: [{ type: "text", text: JSON.stringify(createDirResult, null, 2) }],
      };
      
    case 'get_testcase_field_config':
      const getFieldConfigParams = GetTestcaseFieldConfigRequestSchema.parse(request.params.arguments);
      const getFieldConfigResult = await getTestcaseFieldConfig(getFieldConfigParams);
      return {
        content: [{ type: "text", text: JSON.stringify(getFieldConfigResult, null, 2) }],
      };
      
    case 'create_testcase':
      const createParams = CreateTestcaseRequestSchema.parse(request.params.arguments);
      const createResult = await createTestcase(createParams);
      return {
        content: [{ type: "text", text: JSON.stringify(createResult, null, 2) }],
      };
      
    case 'search_testcases':
      const searchParams = SearchTestcasesRequestSchema.parse(request.params.arguments);
      const searchResult = await searchTestcases(searchParams);
      return {
        content: [{ type: "text", text: JSON.stringify(searchResult, null, 2) }],
      };
      
    case 'get_testcase':
      const getParams = GetTestcaseRequestSchema.parse(request.params.arguments);
      const getResult = await getTestcase(getParams);
      return {
        content: [{ type: "text", text: JSON.stringify(getResult, null, 2) }],
      };
      
    case 'delete_testcase':
      const deleteParams = DeleteTestcaseRequestSchema.parse(request.params.arguments);
      const deleteResult = await deleteTestcase(deleteParams);
      return {
        content: [{ type: "text", text: JSON.stringify(deleteResult, null, 2) }],
      };
      
    case 'list_test_plans':
      const listTestPlanParams = ListTestPlanRequestSchema.parse(request.params.arguments);
      const listTestPlanResult = await listTestPlan(listTestPlanParams);
      return {
        content: [{ type: "text", text: JSON.stringify(listTestPlanResult, null, 2) }],
      };
      
    case 'get_test_result_list':
      const getTestResultListParams = GetTestResultListRequestSchema.parse(request.params.arguments);
      const getTestResultListResult = await getTestResultList(getTestResultListParams);
      return {
        content: [{ type: "text", text: JSON.stringify(getTestResultListResult, null, 2) }],
      };
      
    case 'update_test_result':
      const updateTestResultParams = UpdateTestResultRequestSchema.parse(request.params.arguments);
      const updateTestResultResult = await updateTestResult(updateTestResultParams);
      return {
        content: [{ type: "text", text: JSON.stringify(updateTestResultResult, null, 2) }],
      };

    case 'get_test_plan_progress': {
      const params = GetTestPlanProgressRequestSchema.parse(request.params.arguments);
      const result = await getTestPlanProgress(params);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }

    case 'list_test_plan_result_directories': {
      const params = GetTestPlanResultDirectoryListRequestSchema.parse(request.params.arguments);
      const result = await getTestPlanResultDirectoryList(params);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }

    case 'list_test_repo_tags': {
      const params = ListTestRepoTagsRequestSchema.parse(request.params.arguments);
      const result = await listTestRepoTags(params);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }

    case 'list_test_repos': {
      const params = ListTestReposRequestSchema.parse(request.params.arguments);
      const result = await listTestRepos(params);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }

    case 'list_testcase_comments': {
      const params = ListTestcaseCommentsRequestSchema.parse(request.params.arguments);
      const result = await listTestcaseComments(params);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }

    case 'create_testcase_comment': {
      const params = CreateTestcaseCommentRequestSchema.parse(request.params.arguments);
      const result = await createTestcaseComment(params);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }

    default:
      return null;
  }
}

