import { toInputSchema } from '../common/inputSchema.js';
import { 
  CreateGlobalVarRequestSchema,
  GetGlobalVarRequestSchema,
  UpdateGlobalVarRequestSchema,
  ListGlobalVarsRequestSchema
} from '../operations/appstack/globalVars.js';

// Export all appstack global variables tools
export const getAppStackGlobalVarTools = () => [
  {
    name: 'create_global_var',
    description: '[application delivery] Create a global variable group',
    inputSchema: toInputSchema(CreateGlobalVarRequestSchema),
  },
  {
    name: 'get_global_var',
    description: '[application delivery] Get a global variable group',
    inputSchema: toInputSchema(GetGlobalVarRequestSchema),
  },
  {
    name: 'update_global_var',
    description: '[application delivery] Update a global variable group',
    inputSchema: toInputSchema(UpdateGlobalVarRequestSchema),
  },
  {
    name: 'list_global_vars',
    description: '[application delivery] List global variable groups',
    inputSchema: toInputSchema(ListGlobalVarsRequestSchema),
  }
];