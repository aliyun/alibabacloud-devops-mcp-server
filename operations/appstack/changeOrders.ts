import { z } from 'zod';
import { yunxiaoRequest, buildUrl, isRegionEdition } from '../../common/utils.js';
import { resolveOrganizationId } from '../organization/organization.js';

// Schema for EnvDeployRequest
export const EnvDeployRequestSchema = z.object({
  values: z.record(z.string()).optional().describe("环境部署参数键值对"),
});

// Schema for CreateChangeOrderReq
export const CreateChangeOrderReqSchema = z.object({
  changeOrderName: z.string().describe("部署单名称"),
  description: z.string().optional().describe("描述"),
  envs: z.record(EnvDeployRequestSchema).describe("环境信息，key为环境名称，value为对应环境部署单参数（当前仅支持单环境部署）"),
  orchestrationRevisionSha: z.string().optional().describe("编排版本sha值，部署单类型为Deploy时必填"),
  rollbackChangeOrderVersion: z.string().optional().describe("部署单类型为Rollback时必填，指定回滚时使用的部署版本号"),
  type: z.string().describe("部署单类型：Deploy-部署，Scale-扩缩，Rollback-回滚，Destroy-删除资源"),
});

// Schema for JobSummary
export const JobSummarySchema = z.object({
  operator: z.string().nullable().optional().describe("操作人"),
  action: z.string().nullable().optional().describe("操作类型"),
  state: z.string().nullable().optional().describe("环境部署单状态"),
  jobSn: z.string().nullable().optional().describe("环境部署单编号"),
  message: z.string().nullable().optional().describe("消息"),
  gmtCreate: z.string().nullable().optional().describe("创建时间"),
  sn: z.string().nullable().optional().describe("环境部署单唯一标识"),
  envName: z.string().nullable().optional().describe("环境名称"),
});

// Schema for ChangeOrderSummary
export const ChangeOrderSummarySchema = z.object({
  creator: z.string().describe("创建人"),
  description: z.string().nullable().optional().describe("描述"),
  endedAt: z.string().nullable().optional().describe("部署单结束时间"),
  gmtCreate: z.string().describe("部署单最后修改时间"),
  jobs: z.array(JobSummarySchema).describe("环境部署单列表"),
  name: z.string().describe("部署单名称"),
  sn: z.string().describe("部署单唯一标识"),
  startedAt: z.string().nullable().optional().describe("部署单开始时间"),
  state: z.enum(["INIT", "PREPARING", "RUNNING", "SUSPENDED", "CANCELED", "SUCCESS", "FAILED"]).describe("部署单状态"),
  type: z.enum(["Deploy", "Scale", "Rollback", "Destroy"]).describe("部署单类型"),
  version: z.string().describe("使用版本"),
});

// Schema for ChangeOrderVersionRecord
export const ChangeOrderVersionRecordSchema = z.object({
  // Based on the reference in the swagger, we'll define a basic structure
  // You may need to update this with the actual fields from ChangeOrderVersionRecord
  version: z.string().optional().describe("部署单版本"),
  changeOrderSn: z.string().optional().describe("部署单编号"),
});

// Schema for JobLog
export const JobLogSchema = z.object({
  content: z.string().nullable().optional().describe("日志内容"),
  timestamp: z.string().nullable().optional().describe("日志时间戳"),
});

// Schema for ActionContext
export const ActionContextSchema = z.object({
  comment: z.string().describe("操作备注"),
});

// Schema for ChangeJobActionReq
export const ChangeJobActionReqSchema = z.object({
  actionType: z.string().describe("操作类型:SUSPEND-暂停，RESUME-恢复，ROLLBACK-回滚，STOP-终止"),
  context: ActionContextSchema.optional().describe("操作上下文，comment 为操作备注"),
});

// Schema for CreateChangeOrder API
export const CreateChangeOrderRequestSchema = z.object({
  organizationId: z.string().describe("组织ID"),
  appName: z.string().describe("应用名"),
  changeOrder: CreateChangeOrderReqSchema,
});

export const CreateChangeOrderResponseSchema = ChangeOrderSummarySchema;

// Schema for ListChangeOrderVersions API
export const ListChangeOrderVersionsRequestSchema = z.object({
  organizationId: z.string().describe("组织ID"),
  appName: z.string().describe("应用名"),
  envNames: z.array(z.string()).optional().describe("环境标识列表，如不需按环境过滤，请置空"),
  creators: z.array(z.string()).optional().describe("创建人云效账号id列表，如不需按创建人过滤，请置空"),
  current: z.number().default(1).describe("当前页号（从 1 开始，默认取 1）"),
  pageSize: z.number().default(10).describe("分页记录数（默认 10 条）"),
});

export const PaginationChangeOrderVersionRecordSchema = z.object({
  current: z.number().describe("当前页数"),
  pageSize: z.number().describe("每页大小"),
  pages: z.number().describe("总页数"),
  records: z.array(ChangeOrderVersionRecordSchema).describe("数据列表"),
  total: z.number().describe("总数"),
});

export const ListChangeOrderVersionsResponseSchema = PaginationChangeOrderVersionRecordSchema;

// Schema for GetChangeOrder API
export const GetChangeOrderRequestSchema = z.object({
  organizationId: z.string().describe("组织ID"),
  appName: z.string().describe("应用名"),
  changeOrderSn: z.string().describe("部署单编号"),
});

export const GetChangeOrderResponseSchema = ChangeOrderSummarySchema;

// Schema for ListChangeOrderJobLogs API
export const ListChangeOrderJobLogsRequestSchema = z.object({
  organizationId: z.string().describe("组织ID"),
  appName: z.string().describe("应用名"),
  changeOrderSn: z.string().describe("部署单号"),
  jobSn: z.string().describe("作业单号"),
  current: z.number().default(1),
  pageSize: z.number().default(10),
});

export const PaginationJobLogSchema = z.object({
  current: z.number().describe("当前页数"),
  pageSize: z.number().describe("每页大小"),
  pages: z.number().describe("总页数"),
  records: z.array(JobLogSchema).describe("数据列表"),
  total: z.number().describe("总数"),
});

export const ListChangeOrderJobLogsResponseSchema = PaginationJobLogSchema;

// Schema for FindTaskOperationLog API
export const FindTaskOperationLogRequestSchema = z.object({
  organizationId: z.string().describe("组织ID"),
  appName: z.string(),
  changeOrderSn: z.string(),
  jobSn: z.string(),
  stageSn: z.string(),
  taskSn: z.string(),
});

export const FindTaskOperationLogResponseSchema = z.string();

// Schema for ExecuteJobAction API
export const ExecuteJobActionRequestSchema = z.object({
  organizationId: z.string().describe("组织ID"),
  appName: z.string().describe("应用名"),
  changeOrderSn: z.string().describe("部署单编号，即 changeOrder.sn"),
  jobSn: z.string().describe("环境部署单编号，即 job.sn"),
  action: ChangeJobActionReqSchema,
});

export const ExecuteJobActionResponseSchema = ChangeOrderSummarySchema;

// Schema for ListChangeOrdersByOrigin API
export const ListChangeOrdersByOriginRequestSchema = z.object({
  organizationId: z.string().describe("组织ID"),
  originType: z.string().describe("创建来源类型"),
  originId: z.string().describe("创建来源标识"),
  appName: z.string().optional().describe("应用名"),
  envName: z.string().optional().describe("环境名"),
});

export const ListChangeOrdersByOriginResponseSchema = z.array(ChangeOrderSummarySchema);

export type CreateChangeOrderRequest = z.infer<typeof CreateChangeOrderRequestSchema>;
export type CreateChangeOrderResponse = z.infer<typeof CreateChangeOrderResponseSchema>;
export type ListChangeOrderVersionsRequest = z.infer<typeof ListChangeOrderVersionsRequestSchema>;
export type ListChangeOrderVersionsResponse = z.infer<typeof ListChangeOrderVersionsResponseSchema>;
export type GetChangeOrderRequest = z.infer<typeof GetChangeOrderRequestSchema>;
export type GetChangeOrderResponse = z.infer<typeof GetChangeOrderResponseSchema>;
export type ListChangeOrderJobLogsRequest = z.infer<typeof ListChangeOrderJobLogsRequestSchema>;
export type ListChangeOrderJobLogsResponse = z.infer<typeof ListChangeOrderJobLogsResponseSchema>;
export type FindTaskOperationLogRequest = z.infer<typeof FindTaskOperationLogRequestSchema>;
export type FindTaskOperationLogResponse = z.infer<typeof FindTaskOperationLogResponseSchema>;
export type ExecuteJobActionRequest = z.infer<typeof ExecuteJobActionRequestSchema>;
export type ExecuteJobActionResponse = z.infer<typeof ExecuteJobActionResponseSchema>;
export type ListChangeOrdersByOriginRequest = z.infer<typeof ListChangeOrdersByOriginRequestSchema>;
export type ListChangeOrdersByOriginResponse = z.infer<typeof ListChangeOrdersByOriginResponseSchema>;

/**
 * Create a change order (deployment order)
 * 
 * @param params - The request parameters
 * @returns The created change order summary
 */
export async function createChangeOrder(params: CreateChangeOrderRequest): Promise<CreateChangeOrderResponse> {
  const { organizationId, appName, changeOrder } = params;
  const finalOrgId = await resolveOrganizationId(organizationId);
  
  try {
    const url = isRegionEdition()
      ? `/oapi/v1/appstack/apps/${appName}/changeOrders`
      : `/oapi/v1/appstack/organizations/${finalOrgId}/apps/${appName}/changeOrders`;
    const response = await yunxiaoRequest(
      url,
      {
        method: 'POST',
        body: changeOrder,
      }
    );
    return CreateChangeOrderResponseSchema.parse(response);
  } catch (error) {
    throw error;
  }
}

/**
 * List change order versions
 * 
 * @param params - The request parameters
 * @returns The paginated list of change order versions
 */
export async function listChangeOrderVersions(params: ListChangeOrderVersionsRequest): Promise<ListChangeOrderVersionsResponse> {
  const { organizationId, appName, envNames, creators, current, pageSize } = params;
  const finalOrgId = await resolveOrganizationId(organizationId);
  
  try {
    const query: Record<string, any> = {
      current,
      pageSize
    };
    
    if (envNames && envNames.length > 0) {
      query.envNames = envNames;
    }
    
    if (creators && creators.length > 0) {
      query.creators = creators;
    }
    
    const baseUrl = isRegionEdition()
      ? `/oapi/v1/appstack/apps/${appName}/changeOrders/versions`
      : `/oapi/v1/appstack/organizations/${finalOrgId}/apps/${appName}/changeOrders/versions`;
    const url = buildUrl(baseUrl, query);
    
    const response = await yunxiaoRequest(url, {
      method: 'GET',
    });
    return ListChangeOrderVersionsResponseSchema.parse(response);
  } catch (error) {
    throw error;
  }
}

/**
 * Get a change order by its serial number
 * 
 * @param params - The request parameters
 * @returns The change order summary
 */
export async function getChangeOrder(params: GetChangeOrderRequest): Promise<GetChangeOrderResponse> {
  const { organizationId, appName, changeOrderSn } = params;
  const finalOrgId = await resolveOrganizationId(organizationId);
  
  try {
    const url = isRegionEdition()
      ? `/oapi/v1/appstack/apps/${appName}/changeOrders/${changeOrderSn}`
      : `/oapi/v1/appstack/organizations/${finalOrgId}/apps/${appName}/changeOrders/${changeOrderSn}`;
    const response = await yunxiaoRequest(
      url,
      {
        method: 'GET',
      }
    );
    return GetChangeOrderResponseSchema.parse(response);
  } catch (error) {
    throw error;
  }
}

/**
 * List change order job logs
 * 
 * @param params - The request parameters
 * @returns The paginated list of job logs
 */
export async function listChangeOrderJobLogs(params: ListChangeOrderJobLogsRequest): Promise<ListChangeOrderJobLogsResponse> {
  const { organizationId, appName, changeOrderSn, jobSn, current, pageSize } = params;
  const finalOrgId = await resolveOrganizationId(organizationId);
  
  try {
    const baseUrl = isRegionEdition()
      ? `/oapi/v1/appstack/apps/${appName}/changeOrders/${changeOrderSn}/jobs/${jobSn}/logs`
      : `/oapi/v1/appstack/organizations/${finalOrgId}/apps/${appName}/changeOrders/${changeOrderSn}/jobs/${jobSn}/logs`;
    const url = buildUrl(baseUrl, {
      current,
      pageSize
    });
    
    const response = await yunxiaoRequest(url, {
      method: 'GET',
    });
    return ListChangeOrderJobLogsResponseSchema.parse(response);
  } catch (error) {
    throw error;
  }
}

/**
 * Find task operation log
 * 
 * @param params - The request parameters
 * @returns The task operation log content
 */
export async function findTaskOperationLog(params: FindTaskOperationLogRequest): Promise<FindTaskOperationLogResponse> {
  const { organizationId, appName, changeOrderSn, jobSn, stageSn, taskSn } = params;
  const finalOrgId = await resolveOrganizationId(organizationId);
  
  try {
    const url = isRegionEdition()
      ? `/oapi/v1/appstack/apps/${appName}/changeOrders/${changeOrderSn}/jobs/${jobSn}/stages/${stageSn}/tasks/${taskSn}/operationLog`
      : `/oapi/v1/appstack/organizations/${finalOrgId}/apps/${appName}/changeOrders/${changeOrderSn}/jobs/${jobSn}/stages/${stageSn}/tasks/${taskSn}/operationLog`;
    const response = await yunxiaoRequest(
      url,
      {
        method: 'GET',
      }
    );
    return FindTaskOperationLogResponseSchema.parse(response);
  } catch (error) {
    throw error;
  }
}

/**
 * Execute a job action
 * 
 * @param params - The request parameters
 * @returns The updated change order summary
 */
export async function executeJobAction(params: ExecuteJobActionRequest): Promise<ExecuteJobActionResponse> {
  const { organizationId, appName, changeOrderSn, jobSn, action } = params;
  const finalOrgId = await resolveOrganizationId(organizationId);
  
  try {
    const url = isRegionEdition()
      ? `/oapi/v1/appstack/apps/${appName}/changeOrders/${changeOrderSn}/jobs/${jobSn}:execute`
      : `/oapi/v1/appstack/organizations/${finalOrgId}/apps/${appName}/changeOrders/${changeOrderSn}/jobs/${jobSn}:execute`;
    const response = await yunxiaoRequest(
      url,
      {
        method: 'PUT',
        body: action,
      }
    );
    return ExecuteJobActionResponseSchema.parse(response);
  } catch (error) {
    throw error;
  }
}

/**
 * List change orders by origin
 * 
 * @param params - The request parameters
 * @returns The list of change orders
 */
export async function listChangeOrdersByOrigin(params: ListChangeOrdersByOriginRequest): Promise<ListChangeOrdersByOriginResponse> {
  const { organizationId, originType, originId, appName, envName } = params;
  const finalOrgId = await resolveOrganizationId(organizationId);
  
  try {
    const query: Record<string, any> = {
      originType,
      originId
    };
    
    if (appName) {
      query.appName = appName;
    }
    
    if (envName) {
      query.envName = envName;
    }
    
    const baseUrl = isRegionEdition()
      ? `/oapi/v1/appstack/changeOrders:byOrigin`
      : `/oapi/v1/appstack/organizations/${finalOrgId}/changeOrders:byOrigin`;
    const url = buildUrl(baseUrl, query);
    
    const response = await yunxiaoRequest(url, {
      method: 'GET',
    });
    return ListChangeOrdersByOriginResponseSchema.parse(response);
  } catch (error) {
    throw error;
  }
}