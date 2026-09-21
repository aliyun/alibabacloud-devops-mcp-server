import { toInputSchema } from '../common/inputSchema.js';
import { 
  ListSystemAllReleaseWorkflowsRequestSchema,
  CreateSystemReleaseWorkflowsRequestSchema,
  UpdateSystemReleaseStageRequestSchema,
  ExecuteReleaseStageRequestSchema
} from '../operations/appstack/releaseWorkflows.js';

// Export all appstack release workflow tools (system level)
export const getAppStackReleaseWorkflowTools = () => [
  {
    name: 'list_system_release_workflows',
    description: '[application delivery] 查询系统下所有发布流程',
    inputSchema: toInputSchema(ListSystemAllReleaseWorkflowsRequestSchema),
  },
  {
    name: 'create_system_release_workflow',
    description: '[application delivery] 创建系统发布流程',
    inputSchema: toInputSchema(CreateSystemReleaseWorkflowsRequestSchema),
  },
  {
    name: 'update_system_release_stage',
    description: '[application delivery] 更新系统发布流程阶段',
    inputSchema: toInputSchema(UpdateSystemReleaseStageRequestSchema),
  },
  {
    name: 'execute_system_release_stage',
    description: '[application delivery] 执行系统发布流程阶段',
    inputSchema: toInputSchema(ExecuteReleaseStageRequestSchema),
  }
];

