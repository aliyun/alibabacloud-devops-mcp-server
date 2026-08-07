import { z } from 'zod';
import { toInputSchema } from '../common/inputSchema.js';
import * as types from '../common/types.js';

export const getVMDeployOrderTools = () => [
  {
    name: "stop_vm_deploy_order",
    description: "[VM Deploy Order Management] Stop VM deploy order",
    inputSchema: toInputSchema(types.StopVMDeployOrderSchema),
  },
  {
    name: "skip_vm_deploy_machine",
    description: "[VM Deploy Order Management] Skip VM deploy machine",
    inputSchema: toInputSchema(types.SkipVMDeployMachineSchema),
  },
  {
    name: "retry_vm_deploy_machine",
    description: "[VM Deploy Order Management] Retry VM deploy machine",
    inputSchema: toInputSchema(types.RetryVMDeployMachineSchema),
  },
  {
    name: "resume_vm_deploy_order",
    description: "[VM Deploy Order Management] Resume VM deploy order",
    inputSchema: toInputSchema(types.ResumeVMDeployOrderSchema),
  },
  {
    name: "get_vm_deploy_order",
    description: "[VM Deploy Order Management] Get VM deploy order details",
    inputSchema: toInputSchema(types.GetVMDeployOrderSchema),
  },
  {
    name: "get_vm_deploy_machine_log",
    description: "[VM Deploy Order Management] Get VM deploy machine log",
    inputSchema: toInputSchema(types.GetVMDeployMachineLogSchema),
  },
];