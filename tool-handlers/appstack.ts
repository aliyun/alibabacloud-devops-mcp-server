import { z } from 'zod';
import { 
  listApplications, 
  getApplication, 
  createApplication, 
  updateApplication,
  listApplicationSources,
  ListApplicationsRequestSchema, 
  GetApplicationRequestSchema,
  CreateApplicationRequestSchema,
  UpdateApplicationRequestSchema,
  ListApplicationSourcesRequestSchema
} from '../operations/appstack/applications.js';

/**
 * Handle the appstack tool requests
 * 
 * @param request - The tool request
 * @returns The tool response or null if not handled
 */
export async function handleAppStackTools(request: any) {
  switch (request.params.name) {
    case 'list_applications':
      const listParams = ListApplicationsRequestSchema.parse(request.params.arguments);
      const listResult = await listApplications(listParams);
      return {
        content: [{ type: "text", text: JSON.stringify(listResult, null, 2) }],
      };
      
    case 'get_application':
      const getParams = GetApplicationRequestSchema.parse(request.params.arguments);
      const getResult = await getApplication(getParams);
      return {
        content: [{ type: "text", text: JSON.stringify(getResult, null, 2) }],
      };
      
    case 'create_application':
      const createParams = CreateApplicationRequestSchema.parse(request.params.arguments);
      const createResult = await createApplication(createParams);
      return {
        content: [{ type: "text", text: JSON.stringify(createResult, null, 2) }],
      };
      
    case 'update_application':
      const updateParams = UpdateApplicationRequestSchema.parse(request.params.arguments);
      const updateResult = await updateApplication(updateParams);
      return {
        content: [{ type: "text", text: JSON.stringify(updateResult, null, 2) }],
      };
    
    case 'list_application_sources':
      const listSourcesParams = ListApplicationSourcesRequestSchema.parse(request.params.arguments);
      const listSourcesResult = await listApplicationSources(listSourcesParams);
      return {
        content: [{ type: "text", text: JSON.stringify(listSourcesResult, null, 2) }],
      };

    default:
      return null;
  }
}