import { handleCodeManagementTools } from './code-management.js';
import { handleOrganizationTools } from './organization.js';
import { handleProjectManagementTools } from './project-management.js';
import { handlePipelineTools } from './pipeline.js';
import { handlePackageManagementTools } from './packages.js';
import { handleServiceConnectionTools } from './service-connections.js';
import { handleAppStackTools } from './appstack.js';
import { handleAppStackTagTools } from './appstack-tags.js';
import { handleAppStackTemplateTools } from './appstack-templates.js';
import { handleAppStackGlobalVarTools } from './appstack-global-vars.js';
import { handleAppStackVariableGroupTools } from './appstack-variable-groups.js';
import { handleAppStackOrchestrationTools } from './appstack-orchestrations.js';
import { handleAppStackChangeRequestTools } from './appstack-change-requests.js';
import { handleAppStackDeploymentResourceTools } from './appstack-deployment-resources.js';
import { handleAppStackChangeOrderTools } from './appstack-change-orders.js';
import { handleAppStackAppReleaseWorkflowTools } from './appstack-app-release-workflows.js';
import { handleEffortTools } from './effort.js';
import { handleResourceMemberTools } from './resourceMember.js';
import { handleVMDeployOrderTools } from './vmDeployOrder.js';
import { handleCommitTools } from './commit.js';
import { handleBaseTools } from './base.js';
import { handleTestManagementTools } from './test-management.js';
import { Toolset } from '../common/toolsets.js';

// 将多个 handler 串联：依次尝试，第一个返回非 null/undefined 的结果即返回；全部为 null 则返回 null
const composeHandlers =
  (...handlers: Array<(request: any) => Promise<any>>) =>
  async (request: any) => {
    for (const handler of handlers) {
      const result = await handler(request);
      if (result !== null && result !== undefined) {
        return result;
      }
    }
    return null;
  };

// 定义处理函数映射
// 注意：这里的映射必须与 common/toolsetManager.ts 中的工具注册保持一致——
// 一个 toolset 在 registry 中聚合了多个子模块的工具，分发时也必须串联对应的多个 handler，
// 否则在仅启用该 toolset 时调用其子模块工具会得到 "Unknown tool"。
const HANDLER_MAP: Record<Toolset, (request: any) => Promise<any>> = {
  [Toolset.BASE]: handleBaseTools,
  [Toolset.CODE_MANAGEMENT]: composeHandlers(
    handleCodeManagementTools,
    handleCommitTools
  ),
  [Toolset.ORGANIZATION_MANAGEMENT]: handleOrganizationTools,
  [Toolset.PROJECT_MANAGEMENT]: composeHandlers(
    handleProjectManagementTools,
    handleEffortTools
  ),
  [Toolset.PIPELINE_MANAGEMENT]: composeHandlers(
    handlePipelineTools,
    handleServiceConnectionTools,
    handleResourceMemberTools,
    handleVMDeployOrderTools
  ),
  [Toolset.PACKAGES_MANAGEMENT]: handlePackageManagementTools,
  [Toolset.APPLICATION_DELIVERY]: composeHandlers(
    handleAppStackTools,
    handleAppStackTagTools,
    handleAppStackTemplateTools,
    handleAppStackGlobalVarTools,
    handleAppStackVariableGroupTools,
    handleAppStackOrchestrationTools,
    handleAppStackChangeRequestTools,
    handleAppStackDeploymentResourceTools,
    handleAppStackChangeOrderTools,
    handleAppStackAppReleaseWorkflowTools
  ),
  [Toolset.TEST_MANAGEMENT]: handleTestManagementTools,
};

// 保持向后兼容的接口
export const handleToolRequest = async (request: any) => {
  // Try each handler in sequence until one returns a result
  const handlers = [
    handleBaseTools,
    handleCodeManagementTools,
    handleOrganizationTools,
    handleProjectManagementTools,
    handlePipelineTools,
    handlePackageManagementTools,
    handleServiceConnectionTools,
    handleAppStackTools,
    handleAppStackTagTools,
    handleAppStackTemplateTools,
    handleAppStackGlobalVarTools,
    handleAppStackVariableGroupTools,
    handleAppStackOrchestrationTools,
    handleAppStackChangeRequestTools,
    handleAppStackDeploymentResourceTools,
    handleAppStackChangeOrderTools,
    handleAppStackAppReleaseWorkflowTools,
    handleEffortTools,
    handleResourceMemberTools,
    handleVMDeployOrderTools,
    handleCommitTools,
    handleTestManagementTools
  ];

  for (const handler of handlers) {
    const result = await handler(request);
    if (result !== null) {
      return result;
    }
  }

  // If no handler matched, throw an error
  throw new Error(`Unknown tool: ${request.params.name}`);
};

// 新增按工具集处理工具请求的接口
export const handleToolRequestByToolset = async (request: any, toolsetName: Toolset) => {
  const handler = HANDLER_MAP[toolsetName];
  if (!handler) {
    throw new Error(`Unknown toolset: ${toolsetName}`);
  }
  return await handler(request);
};

// 新增处理启用工具集的接口
export const handleEnabledToolRequest = async (request: any, enabledToolsets: Toolset[]) => {
  // 总是先尝试处理基础工具集
  try {
    const baseResult = await handleToolRequestByToolset(request, Toolset.BASE);
    if (baseResult !== null) {
      return baseResult;
    }
  } catch (error) {
    // 如果工具不在基础工具集中，继续尝试其他工具集
    // 如果是其他错误，重新抛出
    if (!(error instanceof Error && error.message.includes("Unknown tool"))) {
      throw error;
    }
  }

  // 如果没有指定启用的工具集，则处理所有工具集（除了基础工具集，因为已经处理过了）
  const toolsets = enabledToolsets.length > 0 ? enabledToolsets : Object.values(Toolset).filter(t => t !== Toolset.BASE);

  // 按顺序尝试每个启用的工具集
  for (const toolset of toolsets) {
    // 跳过基础工具集，因为我们已经处理过了
    if (toolset === Toolset.BASE) {
      continue;
    }

    try {
      const result = await handleToolRequestByToolset(request, toolset);
      if (result !== null) {
        return result;
      }
    } catch (error) {
      // 如果工具不在当前工具集中，继续尝试下一个工具集
      // 如果是其他错误，重新抛出
      if (!(error instanceof Error && error.message.includes("Unknown tool"))) {
        throw error;
      }
    }
  }

  // 如果没有处理函数匹配，抛出错误
  throw new Error(`Unknown tool: ${request.params.name}`);
};
