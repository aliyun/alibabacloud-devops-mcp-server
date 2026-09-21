import { toInputSchema } from '../common/inputSchema.js';
import * as types from '../common/types.js';

export const getServiceConnectionTools = () => [
  // Service Connection Operations
  {
    name: "list_service_connections",
    description: "[Service Connection Management] List service connections in an organization with filtering options",
    inputSchema: toInputSchema(types.ListServiceConnectionsSchema),
  },
];