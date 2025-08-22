import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
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
    description: '创建部署单',
    inputSchema: zodToJsonSchema(CreateChangeOrderRequestSchema),
  },
  {
    name: 'list_change_order_versions',
    description: '查看部署单版本列表',
    inputSchema: zodToJsonSchema(ListChangeOrderVersionsRequestSchema),
  },
  {
    name: 'get_change_order',
    description: '读取部署单使用的物料和工单状态',
    inputSchema: zodToJsonSchema(GetChangeOrderRequestSchema),
  },
  {
    name: 'list_change_order_job_logs',
    description: '查询环境部署单日志',
    inputSchema: zodToJsonSchema(ListChangeOrderJobLogsRequestSchema),
  },
  {
    name: 'find_task_operation_log',
    description: '查询部署任务执行日志，其中通常包含下游部署引擎的调度细节信息',
    inputSchema: zodToJsonSchema(FindTaskOperationLogRequestSchema),
  },
  {
    name: 'execute_job_action',
    description: '操作环境部署单',
    inputSchema: zodToJsonSchema(ExecuteJobActionRequestSchema),
  },
  {
    name: 'list_change_orders_by_origin',
    description: '根据创建来源查询部署单',
    inputSchema: zodToJsonSchema(ListChangeOrdersByOriginRequestSchema),
  }
];