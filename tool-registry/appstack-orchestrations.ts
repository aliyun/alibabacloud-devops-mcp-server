import { toInputSchema } from '../common/inputSchema.js';
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
    inputSchema: toInputSchema(GetLatestOrchestrationRequestSchema),
  },
  {
    name: 'list_app_orchestration',
    description: '[application delivery] List application orchestrations',
    inputSchema: toInputSchema(ListAppOrchestrationRequestSchema),
  },
  {
    name: 'create_app_orchestration',
    description: '[application delivery] Create an application orchestration',
    inputSchema: toInputSchema(CreateAppOrchestrationRequestSchema),
  },
  {
    name: 'delete_app_orchestration',
    description: '[application delivery] Delete an application orchestration',
    inputSchema: toInputSchema(DeleteAppOrchestrationRequestSchema),
  },
  {
    name: 'get_app_orchestration',
    description: '[application delivery] Get an application orchestration',
    inputSchema: toInputSchema(GetAppOrchestrationRequestSchema),
  },
  {
    name: 'update_app_orchestration',
    description: '[application delivery] Update an application orchestration. This is a full replacement — include all existing spec fields (componentList, labels, placeholderList, groupNameMap) to avoid data loss. Call get_app_orchestration first to retrieve the current state.',
    inputSchema: toInputSchema(UpdateAppOrchestrationRequestSchema),
  }
];