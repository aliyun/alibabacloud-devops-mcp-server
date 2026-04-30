import { zodToJsonSchema } from 'zod-to-json-schema';
import {
  ListFlowVariableGroupsRequestSchema,
  GetFlowVariableGroupRequestSchema,
  CreateFlowVariableGroupRequestSchema,
  UpdateFlowVariableGroupRequestSchema,
  DeleteFlowVariableGroupRequestSchema,
} from '../operations/flow/variableGroups.js';

export const getFlowVariableGroupTools = () => [
  {
    name: 'list_flow_variable_groups',
    description: '[Pipeline Management] List Flow pipeline variable groups (common variable groups)',
    inputSchema: zodToJsonSchema(ListFlowVariableGroupsRequestSchema),
  },
  {
    name: 'get_flow_variable_group',
    description: '[Pipeline Management] Get a Flow pipeline variable group by ID',
    inputSchema: zodToJsonSchema(GetFlowVariableGroupRequestSchema),
  },
  {
    name: 'create_flow_variable_group',
    description: '[Pipeline Management] Create a Flow pipeline variable group',
    inputSchema: zodToJsonSchema(CreateFlowVariableGroupRequestSchema),
  },
  {
    name: 'update_flow_variable_group',
    description: '[Pipeline Management] Update a Flow pipeline variable group',
    inputSchema: zodToJsonSchema(UpdateFlowVariableGroupRequestSchema),
  },
  {
    name: 'delete_flow_variable_group',
    description: '[Pipeline Management] Delete a Flow pipeline variable group',
    inputSchema: zodToJsonSchema(DeleteFlowVariableGroupRequestSchema),
  },
];
