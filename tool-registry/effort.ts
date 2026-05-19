import { zodToJsonSchema } from 'zod-to-json-schema';
import {
  ListCurrentUserEffortRecordsSchema,
  ListEffortRecordsSchema,
  CreateEffortRecordSchema,
  ListEstimatedEffortsSchema,
  CreateEstimatedEffortSchema,
  UpdateEffortRecordSchema,
  UpdateEstimatedEffortSchema
} from "../common/types.js";

export const getEffortTools = () => [
  {
    name: "list_current_user_effort_records",
    description: "[Project Management] 获取用户的实际工时明细，结束时间和开始时间的间隔不能大于6个月",
    inputSchema: zodToJsonSchema(ListCurrentUserEffortRecordsSchema),
  },
  {
    name: "list_effort_records",
    description: "[Project Management] 获取实际工时明细",
    inputSchema: zodToJsonSchema(ListEffortRecordsSchema),
  },
  {
    name: "create_effort_record",
    description: "[Project Management] 登记实际工时。云效中实际工时（fieldId 101587）为受控字段，不能通过 update_work_item 的 customFieldValues 修改，必须调用本工具。",
    inputSchema: zodToJsonSchema(CreateEffortRecordSchema),
  },
  {
    name: "list_estimated_efforts",
    description: "[Project Management] 获取预计工时明细",
    inputSchema: zodToJsonSchema(ListEstimatedEffortsSchema),
  },
  {
    name: "create_estimated_effort",
    description: "[Project Management] 登记预计工时。云效中预计工时（fieldId 101586）为受控字段，不能通过 update_work_item 的 customFieldValues 修改，必须调用本工具。",
    inputSchema: zodToJsonSchema(CreateEstimatedEffortSchema),
  },
  {
    name: "update_effort_record",
    description: "[Project Management] 更新已登记的实际工时（云效实际工时受控字段，不能走 update_work_item.customFieldValues）。",
    inputSchema: zodToJsonSchema(UpdateEffortRecordSchema),
  },
  {
    name: "update_estimated_effort",
    description: "[Project Management] 更新已登记的预计工时（云效预计工时受控字段，不能走 update_work_item.customFieldValues）。",
    inputSchema: zodToJsonSchema(UpdateEstimatedEffortSchema),
  }
];