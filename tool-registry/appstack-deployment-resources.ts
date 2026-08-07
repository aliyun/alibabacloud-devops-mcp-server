import { toInputSchema } from '../common/inputSchema.js';
import { 
  GetMachineDeployLogRequestSchema,
  AddHostListToHostGroupRequestSchema,
  AddHostListToDeployGroupRequestSchema,
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
    inputSchema: toInputSchema(GetMachineDeployLogRequestSchema),
  },
  {
    name: 'add_host_list_to_host_group',
    description: '[application delivery] Add host list to host group',
    inputSchema: toInputSchema(AddHostListToHostGroupRequestSchema),
  },
  {
    name: 'add_host_list_to_deploy_group',
    description: '[application delivery] Add host list to deploy group',
    inputSchema: toInputSchema(AddHostListToDeployGroupRequestSchema),
  },
];