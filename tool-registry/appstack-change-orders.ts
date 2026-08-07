import { z } from 'zod';
import { toInputSchema } from '../common/inputSchema.js';
import { 
  CreateChangeOrderRequestSchema,
  ListChangeOrderVersionsRequestSchema,
  GetChangeOrderRequestSchema,
  ListChangeOrderJobLogsRequestSchema,
  FindTaskOperationLogRequestSchema,
  ExecuteJobActionRequestSchema,
  ListChangeOrdersByOriginRequestSchema
} from '../operations/appstack/changeOrders.js';

// Export all appstack change order tools
export const getAppStackChangeOrderTools = () => [
  {
    name: 'create_change_order',
    description: '[application delivery] 创建部署单',
    inputSchema: toInputSchema(CreateChangeOrderRequestSchema),
  },
  {
    name: 'list_change_order_versions',
    description: '[application delivery] 查看部署单版本列表',
    inputSchema: toInputSchema(ListChangeOrderVersionsRequestSchema),
  },
  {
    name: 'get_change_order',
    description: '[application delivery] 读取部署单使用的物料和工单状态',
    inputSchema: toInputSchema(GetChangeOrderRequestSchema),
  },
  {
    name: 'list_change_order_job_logs',
    description: '[application delivery] 查询环境部署单日志',
    inputSchema: toInputSchema(ListChangeOrderJobLogsRequestSchema),
  },
  {
    name: 'find_task_operation_log',
    description: '[application delivery] 查询部署任务执行日志，其中通常包含下游部署引擎的调度细节信息',
    inputSchema: toInputSchema(FindTaskOperationLogRequestSchema),
  },
  {
    name: 'execute_job_action',
    description: '[application delivery] 操作环境部署单',
    inputSchema: toInputSchema(ExecuteJobActionRequestSchema),
  },
  {
    name: 'list_change_orders_by_origin',
    description: '[application delivery] 根据创建来源查询部署单',
    inputSchema: toInputSchema(ListChangeOrdersByOriginRequestSchema),
  }
];