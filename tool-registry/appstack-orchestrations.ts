import { zodToJsonSchema } from 'zod-to-json-schema';
import { 
  GetLatestOrchestrationRequestSchema,
  ListAppOrchestrationRequestSchema,
  CreateAppOrchestrationRequestSchema,
  DeleteAppOrchestrationRequestSchema,
  GetAppOrchestrationRequestSchema,
  UpdateAppOrchestrationRequestSchema
} from '../operations/appstack/appOrchestrations.js';

// Export all appstack application orchestrations tools
export const getAppStackOrchestrationTools = () => [
  {
    name: 'get_latest_orchestration',
    description: '[application delivery] Get the latest orchestration for an environment',
    inputSchema: zodToJsonSchema(GetLatestOrchestrationRequestSchema),
  },
  {
    name: 'list_app_orchestration',
    description: '[application delivery] List application orchestrations',
    inputSchema: zodToJsonSchema(ListAppOrchestrationRequestSchema),
  },
  {
    name: 'create_app_orchestration',
    description: '[application delivery] Create an application orchestration',
    inputSchema: zodToJsonSchema(CreateAppOrchestrationRequestSchema),
  },
  {
    name: 'delete_app_orchestration',
    description: '[application delivery] Delete an application orchestration',
    inputSchema: zodToJsonSchema(DeleteAppOrchestrationRequestSchema),
  },
  {
    name: 'get_app_orchestration',
    description: '[application delivery] Get an application orchestration',
    inputSchema: zodToJsonSchema(GetAppOrchestrationRequestSchema),
  },
  {
    name: 'update_app_orchestration',
    description: '[application delivery] Update an application orchestration. This is a full replacement — fields not provided will be cleared. Always call get_app_orchestration first and include all existing fields (especially placeholderList, labelList, componentList, groupNameMap, labelPolicy) to avoid data loss.',
    inputSchema: zodToJsonSchema(UpdateAppOrchestrationRequestSchema),
  }
];