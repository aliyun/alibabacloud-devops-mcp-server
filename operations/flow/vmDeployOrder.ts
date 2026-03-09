import * as utils from "../../common/utils.js";
import { resolveOrganizationId } from "../organization/organization.js";
import { z } from "zod";

// 定义VM部署单相关的Zod模式
export const DeployOrderMachineActionSchema = z.object({
  type: z.string().nullable().optional().describe("类型 RetryVMDeployMachine重试机器部署 SkipVMDeployMachine跳过机器部署 LogVMDeployMachine查看机器部署日志"),
  disable: z.boolean().nullable().optional().describe("当前用户是否有权限进行后续 action"),
  params: z.object({}).nullable().optional().describe("参数"),
});

export const DeployOrderMachineSchema = z.object({
  createTime: z.number().int().nullable().optional().describe("创建时间"),
  updateTime: z.number().int().nullable().optional().describe("更新时间"),
  status: z.string().nullable().optional().describe("状态 Success成功 Pending待部署 Running部署中 Cancelled取消 Queued部署等待中 Failed失败 Skipped已跳过"),
  machineSn: z.string().nullable().optional().describe("机器sn"),
  clientStatus: z.string().nullable().optional().describe("机器状态 ok(正常) error(连接失败)"),
  ip: z.string().nullable().optional().describe("机器ip"),
  batchNum: z.number().int().nullable().optional().describe("部署批次"),
  actions: z.array(DeployOrderMachineActionSchema).nullable().optional().describe("操作列表"),
});

export const DeployOrderDeployMachinesSchema = z.object({
  hostGroupId: z.number().int().nullable().optional().describe("主机组Id"),
  batchNum: z.number().int().nullable().optional().describe("发布批次"),
  deployMachines: z.array(DeployOrderMachineSchema).nullable().optional().describe("部署机器列表"),
});

export const DeployOrderActionSchema = z.object({
  type: z.string().nullable().optional().describe("类型 StopVMDeployOrder 取消部署单 ResumeVMDeployOrder 继续部署单运行"),
  disable: z.boolean().nullable().optional().describe("当前用户是否有权限进行后续 action"),
  params: z.object({}).nullable().optional().describe("参数"),
});

export const DeployOrderSchema = z.object({
  deployOrderId: z.number().int().nullable().optional().describe("部署单id"),
  createTime: z.number().int().nullable().optional().describe("创建时间"),
  updateTime: z.number().int().nullable().optional().describe("更新时间"),
  creator: z.string().nullable().optional().describe("创建人"),
  currentBatch: z.number().int().nullable().optional().describe("当前发布批次"),
  totalBatch: z.number().int().nullable().optional().describe("总发布批次"),
  status: z.string().nullable().optional().describe("发布状态 Waiting暂停 Running部署中 Cancelled已取消 Success成功"),
  exceptionCode: z.string().nullable().optional().describe("错误码"),
  actions: z.array(DeployOrderActionSchema).nullable().optional().describe("操作列表"),
  deployMachineInfo: DeployOrderDeployMachinesSchema.nullable().optional().describe("部署机器信息"),
});

export const DeployOrderLogSchema = z.object({
  deployLog: z.string().nullable().optional().describe("部署日志"),
  aliyunRegion: z.string().nullable().optional().describe("部署地域"),
  deployLogPath: z.string().nullable().optional().describe("部署日志路径"),
  deployBeginTime: z.string().nullable().optional().describe("部署开始时间"),
  deployEndTime: z.string().nullable().optional().describe("部署结束时间"),
});

// 定义API请求参数的Zod模式
export const BaseVMDeployOrderSchema = z.object({
  organizationId: z.string().describe("企业Id"),
  pipelineId: z.string().describe("流水线Id"),
  deployOrderId: z.string().describe("部署单Id"),
});

export const StopVMDeployOrderSchema = BaseVMDeployOrderSchema;

export const SkipVMDeployMachineSchema = BaseVMDeployOrderSchema.extend({
  machineSn: z.string().describe("机器sn"),
});

export const RetryVMDeployMachineSchema = BaseVMDeployOrderSchema.extend({
  machineSn: z.string().describe("机器sn"),
});

export const ResumeVMDeployOrderSchema = BaseVMDeployOrderSchema;

export const GetVMDeployOrderSchema = BaseVMDeployOrderSchema;

export const GetVMDeployMachineLogSchema = BaseVMDeployOrderSchema.extend({
  machineSn: z.string().describe("机器sn"),
});

// 定义类型
export type DeployOrderMachineAction = z.infer<typeof DeployOrderMachineActionSchema>;
export type DeployOrderMachine = z.infer<typeof DeployOrderMachineSchema>;
export type DeployOrderDeployMachines = z.infer<typeof DeployOrderDeployMachinesSchema>;
export type DeployOrderAction = z.infer<typeof DeployOrderActionSchema>;
export type DeployOrder = z.infer<typeof DeployOrderSchema>;
export type DeployOrderLog = z.infer<typeof DeployOrderLogSchema>;
export type StopVMDeployOrderParams = z.infer<typeof StopVMDeployOrderSchema>;
export type SkipVMDeployMachineParams = z.infer<typeof SkipVMDeployMachineSchema>;
export type RetryVMDeployMachineParams = z.infer<typeof RetryVMDeployMachineSchema>;
export type ResumeVMDeployOrderParams = z.infer<typeof ResumeVMDeployOrderSchema>;
export type GetVMDeployOrderParams = z.infer<typeof GetVMDeployOrderSchema>;
export type GetVMDeployMachineLogParams = z.infer<typeof GetVMDeployMachineLogSchema>;

/**
 * 终止机器部署
 * @param organizationId 企业Id
 * @param pipelineId 流水线Id
 * @param deployOrderId 部署单Id
 * @returns 是否成功
 */
export async function stopVMDeployOrderFunc(
  organizationId: string | undefined,
  pipelineId: string,
  deployOrderId: string
): Promise<boolean> {
  const finalOrgId = await resolveOrganizationId(organizationId);
  const url = utils.isRegionEdition()
    ? `/oapi/v1/flow/pipelines/${pipelineId}/deploy/${deployOrderId}/stop`
    : `/oapi/v1/flow/organizations/${finalOrgId}/pipelines/${pipelineId}/deploy/${deployOrderId}/stop`;

  const response = await utils.yunxiaoRequest(url, {
    method: "PUT",
  });

  return Boolean(response);
}

/**
 * 跳过机器部署
 * @param organizationId 企业Id
 * @param pipelineId 流水线Id
 * @param deployOrderId 部署单Id
 * @param machineSn 机器sn
 * @returns 是否成功
 */
export async function skipVMDeployMachineFunc(
  organizationId: string | undefined,
  pipelineId: string,
  deployOrderId: string,
  machineSn: string
): Promise<boolean> {
  const finalOrgId = await resolveOrganizationId(organizationId);
  const url = utils.isRegionEdition()
    ? `/oapi/v1/flow/pipelines/${pipelineId}/deploy/${deployOrderId}/machine/${machineSn}/skip`
    : `/oapi/v1/flow/organizations/${finalOrgId}/pipelines/${pipelineId}/deploy/${deployOrderId}/machine/${machineSn}/skip`;

  const response = await utils.yunxiaoRequest(url, {
    method: "PUT",
  });

  return Boolean(response);
}

/**
 * 重试机器部署
 * @param organizationId 企业Id
 * @param pipelineId 流水线Id
 * @param deployOrderId 部署单Id
 * @param machineSn 机器sn
 * @returns 是否成功
 */
export async function retryVMDeployMachineFunc(
  organizationId: string | undefined,
  pipelineId: string,
  deployOrderId: string,
  machineSn: string
): Promise<boolean> {
  const finalOrgId = await resolveOrganizationId(organizationId);
  const url = utils.isRegionEdition()
    ? `/oapi/v1/flow/pipelines/${pipelineId}/deploy/${deployOrderId}/machine/${machineSn}/retry`
    : `/oapi/v1/flow/organizations/${finalOrgId}/pipelines/${pipelineId}/deploy/${deployOrderId}/machine/${machineSn}/retry`;

  const response = await utils.yunxiaoRequest(url, {
    method: "PUT",
  });

  return Boolean(response);
}

/**
 * 继续部署单运行
 * @param organizationId 企业Id
 * @param pipelineId 流水线Id
 * @param deployOrderId 部署单Id
 * @returns 是否成功
 */
export async function resumeVMDeployOrderFunc(
  organizationId: string | undefined,
  pipelineId: string,
  deployOrderId: string
): Promise<boolean> {
  const finalOrgId = await resolveOrganizationId(organizationId);
  const url = utils.isRegionEdition()
    ? `/oapi/v1/flow/pipelines/${pipelineId}/deploy/${deployOrderId}/resume`
    : `/oapi/v1/flow/organizations/${finalOrgId}/pipelines/${pipelineId}/deploy/${deployOrderId}/resume`;

  const response = await utils.yunxiaoRequest(url, {
    method: "PUT",
  });

  return Boolean(response);
}

/**
 * 获取部署单详情
 * @param organizationId 企业Id
 * @param pipelineId 流水线id
 * @param deployOrderId 部署Id
 * @returns 部署单详情
 */
export async function getVMDeployOrderFunc(
  organizationId: string | undefined,
  pipelineId: string,
  deployOrderId: string
): Promise<DeployOrder> {
  const finalOrgId = await resolveOrganizationId(organizationId);
  const url = utils.isRegionEdition()
    ? `/oapi/v1/flow/pipelines/${pipelineId}/deploy/${deployOrderId}`
    : `/oapi/v1/flow/organizations/${finalOrgId}/pipelines/${pipelineId}/deploy/${deployOrderId}`;

  const response = await utils.yunxiaoRequest(url, {
    method: "GET",
  });

  return DeployOrderSchema.parse(response);
}

/**
 * 查询机器部署日志
 * @param organizationId 企业Id
 * @param pipelineId 流水线Id
 * @param deployOrderId 部署单Id
 * @param machineSn 机器sn
 * @returns 机器部署日志
 */
export async function getVMDeployMachineLogFunc(
  organizationId: string | undefined,
  pipelineId: string,
  deployOrderId: string,
  machineSn: string
): Promise<DeployOrderLog> {
  const finalOrgId = await resolveOrganizationId(organizationId);
  const url = utils.isRegionEdition()
    ? `/oapi/v1/flow/pipelines/${pipelineId}/deploy/${deployOrderId}/machine/${machineSn}/log`
    : `/oapi/v1/flow/organizations/${finalOrgId}/pipelines/${pipelineId}/deploy/${deployOrderId}/machine/${machineSn}/log`;

  const response = await utils.yunxiaoRequest(url, {
    method: "GET",
  });

  return DeployOrderLogSchema.parse(response);
}
