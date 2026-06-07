import {
  getLatestOrchestration,
  listAppOrchestration,
  createAppOrchestration,
  deleteAppOrchestration,
  getAppOrchestration,
  updateAppOrchestration,
  GetLatestOrchestrationRequestSchema,
  ListAppOrchestrationRequestSchema,
  CreateAppOrchestrationRequestSchema,
  DeleteAppOrchestrationRequestSchema,
  GetAppOrchestrationRequestSchema,
  UpdateAppOrchestrationRequestSchema
} from '../operations/appstack/appOrchestrations.js';

/**
 * Handle the appstack application orchestrations tool requests
 * 
 * @param request - The tool request
 * @returns The tool response or null if not handled
 */
export async function handleAppStackOrchestrationTools(request: any) {
  switch (request.params.name) {
    case 'get_latest_orchestration':
      const getLatestParams = GetLatestOrchestrationRequestSchema.parse(request.params.arguments);
      const getLatestResult = await getLatestOrchestration(getLatestParams);
      return {
        content: [{ type: "text", text: JSON.stringify(getLatestResult, null, 2) }],
      };
      
    case 'list_app_orchestration':
      const listParams = ListAppOrchestrationRequestSchema.parse(request.params.arguments);
      const listResult = await listAppOrchestration(listParams);
      return {
        content: [{ type: "text", text: JSON.stringify(listResult, null, 2) }],
      };
      
    case 'create_app_orchestration':
      const createParams = CreateAppOrchestrationRequestSchema.parse(request.params.arguments);
      const createResult = await createAppOrchestration(createParams);
      return {
        content: [{ type: "text", text: JSON.stringify(createResult, null, 2) }],
      };
      
    case 'delete_app_orchestration':
      const deleteParams = DeleteAppOrchestrationRequestSchema.parse(request.params.arguments);
      const deleteResult = await deleteAppOrchestration(deleteParams);
      return {
        content: [{ type: "text", text: JSON.stringify(deleteResult, null, 2) }],
      };
      
    case 'get_app_orchestration':
      const getAppParams = GetAppOrchestrationRequestSchema.parse(request.params.arguments);
      const getAppResult = await getAppOrchestration(getAppParams);
      return {
        content: [{ type: "text", text: JSON.stringify(getAppResult, null, 2) }],
      };
      
    case 'update_app_orchestration':
      const updateParams = UpdateAppOrchestrationRequestSchema.parse(request.params.arguments);
      const updateResult = await updateAppOrchestration(updateParams);
      return {
        content: [{ type: "text", text: JSON.stringify(updateResult, null, 2) }],
      };
      
    default:
      return null;
  }
}