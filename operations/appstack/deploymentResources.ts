import { z } from 'zod';
import { yunxiaoRequest, buildUrl, isRegionEdition } from '../../common/utils.js';
import { resolveOrganizationId } from '../organization/organization.js';

// Define the referenced schemas based on their definitions in appstack.swagger.json
const DeployMachineLogSchema = z.object({
  aliyunRegion: z.string().optional(),
  deployBeginTime: z.number().optional(),
  deployEndTime: z.number().optional(),
  deployLog: z.string().optional(),
  deployLogPath: z.string().optional(),
}).describe("主机部署日志");

const ResourceClaimSchema = z.object({
  instanceName: z.string().describe("所引用的资源示例唯一名"),
  itemSnList: z.array(z.string()).describe("资源子项序列号列表"),
  refId: z.string().optional().describe("外部系统封装过的云资源唯一标识"),
  refType: z.enum(["FLOW"]).optional().describe("外部系统封装过的云资源类型"),
  sn: z.string().optional().describe("资源申请对象序列号"),
  specMap: z.record(z.object({}).passthrough()).describe("资源申请详情数据"),
  type: z.string().describe("资源子类型"),
}).describe("资源申请模型");

// Schema for the GetMachineDeployLog API
export const GetMachineDeployLogRequestSchema = z.object({
  organizationId: z.string().describe("组织ID"),
  tunnelId: z.number().describe("隧道ID"),
  machineSn: z.string().describe("主机序列号"),
});

export const GetMachineDeployLogResponseSchema = z.object({
  data: DeployMachineLogSchema.optional(),
  errorAdvice: z.string().optional(),
  errorCode: z.string().optional(),
  errorMap: z.record(z.object({}).passthrough()).optional(),
  errorMessage: z.string().optional(),
  showType: z.number().optional(),
  success: z.boolean().optional(),
  traceId: z.string().optional(),
});

// Schema for the AddHostListToHostGroup API
export const AddHostListToHostGroupRequestSchema = z.object({
  organizationId: z.string().describe("组织ID"),
  instanceName: z.string().describe("主机集群名称（非主机集群显示名）"),
  hostSns: z.array(z.string()).describe("ecs主机实例id列表(主机类型暂只支持ecs)"),
});

export const AddHostListToHostGroupResponseSchema = z.boolean().describe("是否成功");

// Schema for the AddHostListToDeployGroup API
export const AddHostListToDeployGroupRequestSchema = z.object({
  organizationId: z.string().describe("组织ID"),
  instanceName: z.string().describe("主机集群名称（非主机集群显示名）"),
  groupName: z.string().describe("部署组名称(非部署组显示名)"),
  hostSns: z.array(z.string()).describe("ecs主机实例id列表(主机类型暂只支持ecs)"),
});

export const AddHostListToDeployGroupResponseSchema = z.boolean().describe("是否成功");

// Schema for the DeleteHostListFromDeployGroup API
export const DeleteHostListFromDeployGroupRequestSchema = z.object({
  organizationId: z.string().describe("组织ID"),
  instanceName: z.string().describe("主机集群名称（非主机集群显示名）"),
  groupName: z.string().describe("部署组名称(非部署组显示名)"),
  hostSns: z.array(z.string()).describe("ecs主机实例id列表(主机类型暂只支持ecs)"),
});

export const DeleteHostListFromDeployGroupResponseSchema = z.boolean().describe("是否成功");

// Schema for the DeleteHostListFromHostGroup API
export const DeleteHostListFromHostGroupRequestSchema = z.object({
  organizationId: z.string().describe("组织ID"),
  instanceName: z.string().describe("主机集群名称（非主机集群显示名）"),
  hostSns: z.array(z.string()).describe("ecs主机实例id列表(主机类型暂只支持ecs)"),
});

export const DeleteHostListFromHostGroupResponseSchema = z.boolean().describe("是否成功");

// Schema for the GetDeployGroup API
export const GetDeployGroupRequestSchema = z.object({
  organizationId: z.string().describe("组织ID"),
  poolName: z.string().describe("资源池名称"),
  deployGroupName: z.string().describe("部署组名称"),
});

export const GetDeployGroupResponseSchema = z.object({
  claimList: z.array(ResourceClaimSchema).optional().describe("部署组下辖的资源申请详情列表"),
  creatorId: z.string().optional().describe("资源实例创建者 ID"),
  description: z.string().optional().describe("部署组描述"),
  displayName: z.string().optional().describe("部署组的展示名"),
  name: z.string().optional().describe("部署组的唯一名，仅允许包含小写字母、中划线和数字，且开头、结尾均为小写字母或数字"),
  poolName: z.string().optional().describe("隶属资源池的唯一名"),
});

// Schema for the ListResourceInstances API
export const ListResourceInstancesRequestSchema = z.object({
  organizationId: z.string().describe("组织ID"),
  poolName: z.string().describe("资源池名称"),
  pagination: z.enum(["keyset"]).optional().describe("分页模式参数，目前只支持键集分页 keyset 模式"),
  perPage: z.number().min(1).max(100).default(20).optional().describe("分页尺寸参数，决定一页最多返回多少对象"),
  orderBy: z.enum(["id", "gmtCreate"]).optional().describe("分页排序属性，决定根据何种属性进行记录排序；推荐在实现严格遍历时，使用 id 属性"),
  sort: z.enum(["asc", "desc"]).optional().describe("分页排序升降序，asc 为升序，desc 为降序；推荐在实现严格遍历时，使用升序"),
  nextToken: z.string().optional().describe("键集分页 token，获取第一页数据时无需传入，否则需要传入前一页查询结果中的 nextToken 字段"),
  page: z.number().default(1).optional().describe("页码分页时使用，用于获取下一页内容"),
});

export const ListResourceInstancesResponseSchema = z.object({
  current: z.number().optional().describe("页码分页时存在该字段，表示当前页"),
  data: z.array(z.object({
    category: z.enum(["COMPUTE"]).optional().describe("资源类别（如计算、存储、网络等）"),
    cloudMetadata: z.string().optional().describe("云产品元数据"),
    cloudProvider: z.string().optional().describe("云产品提供方"),
    contextMap: z.record(z.string()).optional().describe("资源详情数据"),
    creatorId: z.string().optional().describe("资源实例创建者 ID"),
    description: z.string().optional().describe("资源描述"),
    displayName: z.string().optional().describe("资源展示名"),
    gmtCreate: z.string().optional().describe("使用本地时区呈现的应用创建时间"),
    name: z.string().optional().describe("资源实例的唯一名，仅允许包含小写字母、中划线和数字，且开头、结尾均为小写字母或数字"),
    poolName: z.string().optional().describe("资源池唯一名"),
    region: z.string().optional().describe("资源所处区域"),
    resourceGroupId: z.string().optional().describe("云产品提供方所使用的资源唯一 ID"),
    type: z.string().optional().describe("资源子类型"),
  })).optional().describe("分页结果数据"),
  nextToken: z.string().nullable().optional().describe("采用键值分页时存在该字段，用于传给分页接口，迭代获取下一页数据"),
  pages: z.number().optional().describe("页码分页时存在该字段，表示总页数"),
  perPage: z.number().optional().describe("页码分页时存在该字段，表示每页大小"),
  total: z.number().optional().describe("页码分页时存在该字段，表示结果总数"),
});

// Schema for the GetResourceInstance API
export const GetResourceInstanceRequestSchema = z.object({
  organizationId: z.string().describe("组织ID"),
  poolName: z.string().describe("资源池名称"),
  instanceName: z.string().describe("资源实例名称"),
});

export const GetResourceInstanceResponseSchema = z.object({
  category: z.enum(["COMPUTE"]).optional().describe("资源类别（如计算、存储、网络等）"),
  cloudMetadata: z.string().optional().describe("云产品元数据"),
  cloudProvider: z.string().optional().describe("云产品提供方"),
  contextMap: z.record(z.string()).optional().describe("资源详情数据"),
  creatorId: z.string().optional().describe("资源实例创建者 ID"),
  description: z.string().optional().describe("资源描述"),
  displayName: z.string().optional().describe("资源展示名"),
  gmtCreate: z.string().optional().describe("使用本地时区呈现的应用创建时间"),
  name: z.string().optional().describe("资源实例的唯一名，仅允许包含小写字母、中划线和数字，且开头、结尾均为小写字母或数字"),
  poolName: z.string().optional().describe("资源池唯一名"),
  region: z.string().optional().describe("资源所处区域"),
  resourceGroupId: z.string().optional().describe("云产品提供方所使用的资源唯一 ID"),
  type: z.string().optional().describe("资源子类型"),
});

// Schema for the UpdateResourceInstance API
export const UpdateResourceInstanceRequestSchema = z.object({
  organizationId: z.string().describe("组织ID"),
  name: z.string().describe("资源实例的唯一名，仅允许包含小写字母、中划线和数字，且开头、结尾均为小写字母或数字"),
  kubeconfig: z.string().describe("kubeconfig配置"),
});

export const UpdateResourceInstanceResponseSchema = z.object({
  data: z.object({
    instanceId: z.string().optional().describe("资源实例 ID"),
    name: z.string().optional().describe("资源实例的唯一名，仅允许包含小写字母、中划线和数字，且开头、结尾均为小写字母或数字"),
    displayName: z.string().optional().describe("资源展示名"),
    poolName: z.string().optional().describe("资源池唯一名"),
    category: z.enum(["COMPUTE"]).optional().describe("资源类别（如计算、存储、网络等）"),
    type: z.string().optional().describe("资源子类型"),
    cloudMetadata: z.string().optional().describe("云产品元数据"),
    cloudProvider: z.string().optional().describe("云产品提供方"),
    contextMap: z.record(z.string()).optional().describe("资源详情数据"),
    description: z.string().optional().describe("资源描述"),
    region: z.string().optional().describe("资源所处区域"),
    resourceItemList: z.array(z.object({}).passthrough()).optional().describe("资源项列表"),
    k8s: z.boolean().optional().describe("是否k8s"),
    host: z.boolean().optional().describe(""),
  }).optional().describe("资源实例"),
  errorAdvice: z.string().optional(),
  errorCode: z.string().optional(),
  errorMap: z.record(z.object({}).passthrough()).optional(),
  errorMessage: z.string().optional(),
  showType: z.number().optional(),
  success: z.boolean().optional(),
  traceId: z.string().optional(),
});

export type GetMachineDeployLogRequest = z.infer<typeof GetMachineDeployLogRequestSchema>;
export type GetMachineDeployLogResponse = z.infer<typeof GetMachineDeployLogResponseSchema>;
export type AddHostListToHostGroupRequest = z.infer<typeof AddHostListToHostGroupRequestSchema>;
export type AddHostListToHostGroupResponse = z.infer<typeof AddHostListToHostGroupResponseSchema>;
export type AddHostListToDeployGroupRequest = z.infer<typeof AddHostListToDeployGroupRequestSchema>;
export type AddHostListToDeployGroupResponse = z.infer<typeof AddHostListToDeployGroupResponseSchema>;
export type DeleteHostListFromDeployGroupRequest = z.infer<typeof DeleteHostListFromDeployGroupRequestSchema>;
export type DeleteHostListFromDeployGroupResponse = z.infer<typeof DeleteHostListFromDeployGroupResponseSchema>;
export type DeleteHostListFromHostGroupRequest = z.infer<typeof DeleteHostListFromHostGroupRequestSchema>;
export type DeleteHostListFromHostGroupResponse = z.infer<typeof DeleteHostListFromHostGroupResponseSchema>;
export type GetDeployGroupRequest = z.infer<typeof GetDeployGroupRequestSchema>;
export type GetDeployGroupResponse = z.infer<typeof GetDeployGroupResponseSchema>;
export type ListResourceInstancesRequest = z.infer<typeof ListResourceInstancesRequestSchema>;
export type ListResourceInstancesResponse = z.infer<typeof ListResourceInstancesResponseSchema>;
export type GetResourceInstanceRequest = z.infer<typeof GetResourceInstanceRequestSchema>;
export type GetResourceInstanceResponse = z.infer<typeof GetResourceInstanceResponseSchema>;
export type UpdateResourceInstanceRequest = z.infer<typeof UpdateResourceInstanceRequestSchema>;
export type UpdateResourceInstanceResponse = z.infer<typeof UpdateResourceInstanceResponseSchema>;

/**
 * Get machine deployment log
 * 
 * @param params - The request parameters
 * @returns The deployment log
 */
export async function getMachineDeployLog(params: GetMachineDeployLogRequest): Promise<GetMachineDeployLogResponse> {
  const { organizationId, tunnelId, machineSn } = params;
  const finalOrgId = await resolveOrganizationId(organizationId);
  
  // Build query string properly
  const query: Record<string, string | number> = {};
  if (tunnelId) query.tunnelId = tunnelId;
  if (machineSn) query.machineSn = machineSn;
  
  try {
    const baseUrl = isRegionEdition()
      ? `/oapi/v1/appstack/host/deployLog`
      : `/oapi/v1/appstack/organizations/${finalOrgId}/host/deployLog`;
    const url = buildUrl(baseUrl, query);
    
    const response = await yunxiaoRequest(
      url,
      {
        method: 'GET',
      }
    );
    return GetMachineDeployLogResponseSchema.parse(response);
  } catch (error) {
    throw error;
  }
}

/**
 * Add host list to host group
 * 
 * @param params - The request parameters
 * @returns Whether the operation was successful
 */
export async function addHostListToHostGroup(params: AddHostListToHostGroupRequest): Promise<AddHostListToHostGroupResponse> {
  const { organizationId, instanceName, ...body } = params;
  const finalOrgId = await resolveOrganizationId(organizationId);
  
  try {
    const url = isRegionEdition()
      ? `/oapi/v1/appstack/pools/instances/${instanceName}/addHostList`
      : `/oapi/v1/appstack/organizations/${finalOrgId}/pools/instances/${instanceName}/addHostList`;
    const response = await yunxiaoRequest(
      url,
      {
        method: 'PUT',
        body: body,
      }
    );
    return AddHostListToHostGroupResponseSchema.parse(response);
  } catch (error) {
    throw error;
  }
}

/**
 * Add host list to deploy group
 * 
 * @param params - The request parameters
 * @returns Whether the operation was successful
 */
export async function addHostListToDeployGroup(params: AddHostListToDeployGroupRequest): Promise<AddHostListToDeployGroupResponse> {
  const { organizationId, instanceName, groupName, ...body } = params;
  const finalOrgId = await resolveOrganizationId(organizationId);
  
  try {
    const url = isRegionEdition()
      ? `/oapi/v1/appstack/pools/instances/${instanceName}/deployGroup/${groupName}/addHostList`
      : `/oapi/v1/appstack/organizations/${finalOrgId}/pools/instances/${instanceName}/deployGroup/${groupName}/addHostList`;
    const response = await yunxiaoRequest(
      url,
      {
        method: 'PUT',
        body: body,
      }
    );
    return AddHostListToDeployGroupResponseSchema.parse(response);
  } catch (error) {
    throw error;
  }
}

/**
 * Delete host list from deploy group
 * 
 * @param params - The request parameters
 * @returns Whether the operation was successful
 */
export async function deleteHostListFromDeployGroup(params: DeleteHostListFromDeployGroupRequest): Promise<DeleteHostListFromDeployGroupResponse> {
  const { organizationId, instanceName, groupName, ...body } = params;
  const finalOrgId = await resolveOrganizationId(organizationId);
  
  try {
    const url = isRegionEdition()
      ? `/oapi/v1/appstack/pools/instances/${instanceName}/deployGroup/${groupName}/removeHostList`
      : `/oapi/v1/appstack/organizations/${finalOrgId}/pools/instances/${instanceName}/deployGroup/${groupName}/removeHostList`;
    const response = await yunxiaoRequest(
      url,
      {
        method: 'PUT',
        body: body,
      }
    );
    return DeleteHostListFromDeployGroupResponseSchema.parse(response);
  } catch (error) {
    throw error;
  }
}

/**
 * Delete host list from host group
 * 
 * @param params - The request parameters
 * @returns Whether the operation was successful
 */
export async function deleteHostListFromHostGroup(params: DeleteHostListFromHostGroupRequest): Promise<DeleteHostListFromHostGroupResponse> {
  const {organizationId, instanceName, ...body} = params;
  const finalOrgId = await resolveOrganizationId(organizationId);

  try {
    const url = isRegionEdition()
      ? `/oapi/v1/appstack/pools/instances/${instanceName}/removeHostList`
      : `/oapi/v1/appstack/organizations/${finalOrgId}/pools/instances/${instanceName}/removeHostList`;
    const response = await yunxiaoRequest(
        url,
        {
          method: 'PUT',
          body: body,
        }
    );
    return DeleteHostListFromHostGroupResponseSchema.parse(response);
  } catch (error) {
    throw error;
  }
}