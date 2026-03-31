import { zodToJsonSchema } from 'zod-to-json-schema';
import { 
  CreateChangeRequestRequestSchema,
  GetChangeRequestAuditItemsRequestSchema,
  ListChangeRequestExecutionsRequestSchema,
  ListChangeRequestWorkItemsRequestSchema,
  CancelChangeRequestRequestSchema,
  CloseChangeRequestRequestSchema,
  ListAppChangeRequestsRequestSchema,
  ListAttachedChangeRequestsRequestSchema
} from '../operations/appstack/changeRequests.js';

// Export all appstack change requests tools
export const getAppStackChangeRequestTools = () => [
  {
    name: 'create_appstack_change_request',
    description: '[application delivery] Create a change request',
    inputSchema: zodToJsonSchema(CreateChangeRequestRequestSchema),
  },
  {
    name: 'get_appstack_change_request_audit_items',
    description: '[application delivery] Get audit items for a change request',
    inputSchema: zodToJsonSchema(GetChangeRequestAuditItemsRequestSchema),
  },
  {
    name: 'list_appstack_change_request_executions',
    description: '[application delivery] List change request executions',
    inputSchema: zodToJsonSchema(ListChangeRequestExecutionsRequestSchema),
  },
  {
    name: 'list_appstack_change_request_work_items',
    description: '[application delivery] List work items for a change request',
    inputSchema: zodToJsonSchema(ListChangeRequestWorkItemsRequestSchema),
  },
  {
    name: 'cancel_appstack_change_request',
    description: '[application delivery] Cancel a change request',
    inputSchema: zodToJsonSchema(CancelChangeRequestRequestSchema),
  },
  {
    name: 'close_appstack_change_request',
    description: '[application delivery] Close a change request',
    inputSchema: zodToJsonSchema(CloseChangeRequestRequestSchema),
  },
  {
    name: 'list_appstack_change_requests',
    description: '[application delivery] Search change requests in an application with pagination and filtering',
    inputSchema: zodToJsonSchema(ListAppChangeRequestsRequestSchema),
  },
  {
    name: 'list_attached_change_requests',
    description: '[application delivery] List change requests attached to a release',
    inputSchema: zodToJsonSchema(ListAttachedChangeRequestsRequestSchema),
  }
];