import { zodToJsonSchema } from 'zod-to-json-schema';
import { 
  GetMachineDeployLogRequestSchema,
  AddHostListToHostGroupRequestSchema,
  AddHostListToDeployGroupRequestSchema,
  DeleteHostListFromDeployGroupRequestSchema,
  DeleteHostListFromHostGroupRequestSchema,
  GetDeployGroupRequestSchema,
  ListResourceInstancesRequestSchema,
  GetResourceInstanceRequestSchema,
  UpdateResourceInstanceRequestSchema
} from '../operations/appstack/deploymentResources.js';

// Export all appstack deployment resources tools
export const getAppStackDeploymentResourceTools = () => [
  {
    name: 'get_machine_deploy_log',
    description: '[application delivery] Get machine deployment log',
    inputSchema: zodToJsonSchema(GetMachineDeployLogRequestSchema),
  },
  {
    name: 'add_host_list_to_host_group',
    description: '[application delivery] Add host list to host group',
    inputSchema: zodToJsonSchema(AddHostListToHostGroupRequestSchema),
  },
  {
    name: 'add_host_list_to_deploy_group',
    description: '[application delivery] Add host list to deploy group',
    inputSchema: zodToJsonSchema(AddHostListToDeployGroupRequestSchema),
  },
  {
    name: 'delete_host_list_from_deploy_group',
    description: '[application delivery] Delete host list from deploy group',
    inputSchema: zodToJsonSchema(DeleteHostListFromDeployGroupRequestSchema),
  },
  {
    name: 'delete_host_list_from_host_group',
    description: '[application delivery] Delete host list from host group',
    inputSchema: zodToJsonSchema(DeleteHostListFromHostGroupRequestSchema),
  },
];