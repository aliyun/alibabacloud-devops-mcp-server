import { Tool } from "./toolsets.js";
import { Toolset, ToolsetConfig, ToolsetManager, DEFAULT_ENABLED_TOOLSETS } from "./toolsets.js";

// 导入所有工具集函数
import { getCodeManagementTools } from '../tool-registry/code-management.js';
import { getOrganizationTools } from '../tool-registry/organization.js';
import { getProjectManagementTools } from '../tool-registry/project-management.js';
import { getPipelineTools } from '../tool-registry/pipeline.js';
import { getPackageManagementTools } from '../tool-registry/packages.js';
import { getServiceConnectionTools } from '../tool-registry/service-connections.js';
import { getAppStackTools } from '../tool-registry/appstack.js';
import { getAppStackTagTools } from '../tool-registry/appstack-tags.js';
import { getAppStackTemplateTools } from '../tool-registry/appstack-templates.js';
import { getAppStackGlobalVarTools } from '../tool-registry/appstack-global-vars.js';
import { getAppStackVariableGroupTools } from '../tool-registry/appstack-variable-groups.js';
import { getAppStackOrchestrationTools } from '../tool-registry/appstack-orchestrations.js';
import { getAppStackChangeRequestTools } from '../tool-registry/appstack-change-requests.js';
import { getAppStackDeploymentResourceTools } from '../tool-registry/appstack-deployment-resources.js';
import { getAppStackChangeOrderTools } from '../tool-registry/appstack-change-orders.js';
import { getAppStackAppReleaseWorkflowTools } from '../tool-registry/appstack-app-release-workflows.js';
import { getEffortTools } from '../tool-registry/effort.js';
import { getResourceMemberTools } from '../tool-registry/resourceMember.js';
import { getVMDeployOrderTools } from '../tool-registry/vmDeployOrder.js';
import { getFlowVariableGroupTools } from '../tool-registry/flow-variable-groups.js';
import { getCommitTools } from '../tool-registry/commit.js';
import { getBaseTools } from '../tool-registry/base.js';
import { getTestManagementTools } from '../tool-registry/test-management.js';

// 定义所有工具集配置
const ALL_TOOLSET_CONFIGS: Record<Toolset, ToolsetConfig> = {
  [Toolset.BASE]: {
    name: Toolset.BASE,
    description: "Base tools that are always loaded",
    tools: getBaseTools as () => Tool[]
  },
  [Toolset.CODE_MANAGEMENT]: {
    name: Toolset.CODE_MANAGEMENT,
    description: "Code repository management tools",
    tools: (() => [
      ...getCodeManagementTools(),
      ...getCommitTools()
    ]) as () => Tool[]
  },
  [Toolset.ORGANIZATION_MANAGEMENT]: {
    name: Toolset.ORGANIZATION_MANAGEMENT,
    description: "Organization management tools",
    tools: (() => {
      const allOrgTools = getOrganizationTools();
      // 移除基础工具集中的三个常用工具
      const filteredOrgTools = allOrgTools.filter(tool => 
        tool.name !== "get_current_organization_info" &&
        tool.name !== "get_user_organizations" &&
        tool.name !== "get_current_user"
      );
      return filteredOrgTools;
    }) as () => Tool[]
  },
  [Toolset.PROJECT_MANAGEMENT]: {
    name: Toolset.PROJECT_MANAGEMENT,
    description: "Project management tools",
    tools: (() => [
      ...getProjectManagementTools(),
      ...getEffortTools()
    ]) as () => Tool[]
  },
  [Toolset.PIPELINE_MANAGEMENT]: {
    name: Toolset.PIPELINE_MANAGEMENT,
    description: "Pipeline management tools",
    tools: (() => [
      ...getPipelineTools(),
      ...getServiceConnectionTools(),
      ...getResourceMemberTools(),
      ...getVMDeployOrderTools(),
      ...getFlowVariableGroupTools()
    ]) as () => Tool[]
  },
  [Toolset.PACKAGES_MANAGEMENT]: {
    name: Toolset.PACKAGES_MANAGEMENT,
    description: "Package repository management tools",
    tools: getPackageManagementTools as () => Tool[]
  },
  [Toolset.APPLICATION_DELIVERY]: {
    name: Toolset.APPLICATION_DELIVERY,
    description: "Application delivery tools",
    tools: (() => [
      ...getAppStackTools(),
      ...getAppStackTagTools(),
      ...getAppStackTemplateTools(),
      ...getAppStackGlobalVarTools(),
      ...getAppStackVariableGroupTools(),
      ...getAppStackOrchestrationTools(),
      ...getAppStackChangeRequestTools(),
      ...getAppStackDeploymentResourceTools(),
      ...getAppStackChangeOrderTools(),
      ...getAppStackAppReleaseWorkflowTools()
    ]) as () => Tool[]
  },
  [Toolset.TEST_MANAGEMENT]: {
    name: Toolset.TEST_MANAGEMENT,
    description: "Test management tools",
    tools: getTestManagementTools as () => Tool[]
  }
};

// 工具集管理器实现
export class DefaultToolsetManager implements ToolsetManager {
  getAllTools(): Tool[] {
    return Object.values(ALL_TOOLSET_CONFIGS).flatMap(config => config.tools()) as Tool[];
  }

  getToolsByToolset(toolsetName: Toolset): Tool[] {
    const config = ALL_TOOLSET_CONFIGS[toolsetName];
    if (!config) {
      throw new Error(`Unknown toolset: ${toolsetName}`);
    }
    return config.tools() as Tool[];
  }

  getEnabledTools(enabledToolsets: Toolset[]): Tool[] {
    // 如果没有指定启用的工具集，则使用默认配置
    const toolsets = enabledToolsets.length > 0 ? enabledToolsets : DEFAULT_ENABLED_TOOLSETS;
    
    return toolsets.flatMap(toolsetName => {
      const config = ALL_TOOLSET_CONFIGS[toolsetName];
      if (!config) {
        console.warn(`Unknown toolset: ${toolsetName}, skipping...`);
        return [];
      }
      return config.tools() as Tool[];
    });
  }
}

// 创建默认工具集管理器实例
export const defaultToolsetManager = new DefaultToolsetManager();