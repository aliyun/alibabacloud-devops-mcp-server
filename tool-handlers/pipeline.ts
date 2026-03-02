import * as pipeline from '../operations/flow/pipeline.js';
import * as pipelineJob from '../operations/flow/pipelineJob.js';
import * as types from '../common/types.js';
import { z } from 'zod';

export const handlePipelineTools = async (request: any) => {
  switch (request.params.name) {
    case "get_pipeline": {
      const args = types.GetPipelineSchema.parse(request.params.arguments);
      const pipelineInfo = await pipeline.getPipelineFunc(
        args.organizationId,
        args.pipelineId
      );
      return {
        content: [{ type: "text", text: JSON.stringify(pipelineInfo, null, 2) }],
      };
    }

    case "list_pipelines": {
      const args = types.ListPipelinesSchema.parse(request.params.arguments);
      const pipelines = await pipeline.listPipelinesFunc(
        args.organizationId,
        {
          createStartTime: args.createStartTime,
          createEndTime: args.createEndTime,
          executeStartTime: args.executeStartTime,
          executeEndTime: args.executeEndTime,
          pipelineName: args.pipelineName,
          statusList: args.statusList,
          perPage: args.perPage,
          page: args.page
        }
      );
      return {
        content: [{ type: "text", text: JSON.stringify(pipelines, null, 2) }],
      };
    }

    case "generate_pipeline_yaml": {
      try {
        const args = types.CreatePipelineFromDescriptionSchema.parse(request.params.arguments);
        
        // 检查必需的参数
        if (!args.buildLanguage) {
          throw new Error("The build language parameter is missing.");
        }
        if (!args.buildTool) {
          throw new Error("The build tool parameter is missing.");
        }
        
        const yamlContent = await pipeline.generatePipelineYamlFunc({
          buildLanguage: args.buildLanguage,
          buildTool: args.buildTool,
          deployTarget: args.deployTarget,
          
          // Repository configuration  
          repoUrl: args.repoUrl,
          branch: args.branch,
          serviceName: args.serviceName,
          serviceConnectionId: args.serviceConnectionId,
          
          // Version configuration
          jdkVersion: args.jdkVersion,
          mavenVersion: args.mavenVersion,
          nodeVersion: args.nodeVersion,
          pythonVersion: args.pythonVersion,
          goVersion: args.goVersion,
          
          // Build configuration
          buildCommand: args.buildCommand,
          testCommand: args.testCommand,
          
          // Artifact upload configuration
          uploadType: args.uploadType,
          packagesServiceConnection: args.packagesServiceConnection,
          artifactName: args.artifactName,
          artifactVersion: args.artifactVersion,
          packagesRepoId: args.packagesRepoId,
          includePathInArtifact: args.includePathInArtifact,
          
          // VM deployment configuration
          machineGroupId: args.machineGroupId,
          executeUser: args.executeUser,
          artifactDownloadPath: args.artifactDownloadPath,
          deployCommand: args.deployCommand,
          pauseStrategy: args.pauseStrategy,
          batchNumber: args.batchNumber,
          
          // Kubernetes deployment configuration
          kubernetesClusterId: args.kubernetesClusterId,
          kubectlVersion: args.kubectlVersion,
          namespace: args.namespace,
          yamlPath: args.yamlPath,
          dockerImage: args.dockerImage,
        });
        
        return {
          content: [{ type: "text", text: yamlContent }],
        };
      } catch (error) {
        if (error instanceof Error && error.message.includes("build language parameter is missing")) {
          throw error; // 重新抛出我们自定义的错误
        }
        if (error instanceof Error && error.message.includes("build tool parameter is missing")) {
          throw error; // 重新抛出我们自定义的错误
        }
        
        // 处理YAML生成过程中的错误
        if (error instanceof Error) {
          throw new Error(`YAML generation failed: ${error.message}`);
        }
        throw error;
      }
    }

    case "create_pipeline_from_description": {
      try {
        const args = types.CreatePipelineFromDescriptionSchema.parse(request.params.arguments);
        
        // 检查必需的参数
        if (!args.name) {
          throw new Error("The Pipeline name cannot be empty.");
        }
        if (!args.buildLanguage) {
          throw new Error("The build language parameter is missing.");
        }
        if (!args.buildTool) {
          throw new Error("The build tool parameter is missing.");
        }
        
        const result = await pipeline.createPipelineWithOptionsFunc(
          args.organizationId,
          {
            name: args.name,
            repoUrl: args.repoUrl,
            branch: args.branch,
            serviceConnectionId: args.serviceConnectionId,
            
            // 技术栈参数
            buildLanguage: args.buildLanguage,
            buildTool: args.buildTool,
            deployTarget: args.deployTarget,
            
            // 版本相关参数
            jdkVersion: args.jdkVersion,
            mavenVersion: args.mavenVersion,
            nodeVersion: args.nodeVersion,
            pythonVersion: args.pythonVersion,
            goVersion: args.goVersion,
            kubectlVersion: args.kubectlVersion,
            
            // 构建物上传相关参数
            uploadType: args.uploadType,
            artifactName: args.artifactName,
            artifactVersion: args.artifactVersion,
            packagesServiceConnection:  args.packagesServiceConnection,
            packagesRepoId: args.packagesRepoId,
            includePathInArtifact: args.includePathInArtifact,
            
            // 部署相关参数
            executeUser: args.executeUser,
            artifactDownloadPath: args.artifactDownloadPath,
            machineGroupId: args.machineGroupId,
            pauseStrategy: args.pauseStrategy,
            batchNumber: args.batchNumber,
            kubernetesClusterId: args.kubernetesClusterId,
            yamlPath: args.yamlPath,
            namespace: args.namespace,
            dockerImage: args.dockerImage,
            
            // 自定义命令
            buildCommand: args.buildCommand,
            testCommand: args.testCommand,
            deployCommand: args.deployCommand,
          }
        );
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        if (error instanceof Error && error.message.includes("Pipeline name cannot be empty")) {
          throw error;
        }
        if (error instanceof Error && error.message.includes("build language parameter is missing")) {
          throw error;
        }
        if (error instanceof Error && error.message.includes("build language tool is missing")) {
          throw error;
        }
        
        // 处理流水线创建过程中的其他错误
        if (error instanceof Error) {
          throw new Error(`Create pipeline failed: ${error.message}\n Suggestion: Please check whether the organization ID, repository configuration, or other parameters are correct, and if generated YAML to check whether YAML content is invalid.`);
        }
        throw error;
      }
    }

    case "smart_list_pipelines": {
      // Parse arguments using the schema defined in the tool registration
      const args = z.object({
        organizationId: z.string(),
        timeReference: z.string().optional(),
        pipelineName: z.string().optional(),
        statusList: z.string().optional(),
        perPage: z.number().int().optional(),
        page: z.number().int().optional()
      }).parse(request.params.arguments);
      
      // Call the smart list function
      const pipelines = await pipeline.smartListPipelinesFunc(
        args.organizationId,
        args.timeReference,
        {
          pipelineName: args.pipelineName,
          statusList: args.statusList,
          perPage: args.perPage,
          page: args.page
        }
      );
      
      return {
        content: [{ type: "text", text: JSON.stringify(pipelines, null, 2) }],
      };
    }

    case "create_pipeline_run": {
      const args = types.CreatePipelineRunSchema.parse(request.params.arguments);
      
      // 调试日志：查看AI传递的原始参数
      console.log('[DEBUG] Handler - Raw request.params.arguments:', JSON.stringify(request.params.arguments, null, 2));
      console.log('[DEBUG] Handler - Parsed args:', JSON.stringify({
        organizationId: args.organizationId,
        pipelineId: args.pipelineId,
        params: args.params,
        branch: args.branch,
        tag: args.tag,
        branches: args.branches,
        repositories: args.repositories
      }, null, 2));
      
      const runId = await pipeline.createPipelineRunFunc(
        args.organizationId,
        args.pipelineId,
        {
          params: args.params,
          branch: args.branch,
          tag: args.tag,
          branches: args.branches,
          branchMode: args.branchMode,
          repositories: args.repositories,
          environmentVariables: args.environmentVariables,
          pipelineArtifacts: args.pipelineArtifacts,
          acrArtifacts: args.acrArtifacts,
          packagesArtifacts: args.packagesArtifacts,
          releaseBranch: args.releaseBranch,
          createReleaseBranch: args.createReleaseBranch,
          comment: args.comment,
          description: args.description
        }
      );
      return {
        content: [{ type: "text", text: JSON.stringify(runId, null, 2) }],
      };
    }

    case "get_latest_pipeline_run": {
      const args = types.GetLatestPipelineRunSchema.parse(request.params.arguments);
      const pipelineRun = await pipeline.getLatestPipelineRunFunc(
        args.organizationId,
        args.pipelineId
      );
      return {
        content: [{ type: "text", text: JSON.stringify(pipelineRun, null, 2) }],
      };
    }

    case "get_pipeline_run": {
      const args = types.GetPipelineRunSchema.parse(request.params.arguments);
      const pipelineRun = await pipeline.getPipelineRunFunc(
        args.organizationId,
        args.pipelineId,
        args.pipelineRunId
      );
      return {
        content: [{ type: "text", text: JSON.stringify(pipelineRun, null, 2) }],
      };
    }

    case "list_pipeline_runs": {
      const args = types.ListPipelineRunsSchema.parse(request.params.arguments);
      const pipelineRuns = await pipeline.listPipelineRunsFunc(
        args.organizationId,
        args.pipelineId,
        {
          perPage: args.perPage,
          page: args.page,
          startTime: args.startTime,
          endTime: args.endTime,
          status: args.status,
          triggerMode: args.triggerMode
        }
      );
      return {
        content: [{ type: "text", text: JSON.stringify(pipelineRuns, null, 2) }],
      };
    }

    case "list_pipeline_jobs_by_category": {
      const args = types.ListPipelineJobsByCategorySchema.parse(request.params.arguments);
      const jobs = await pipelineJob.listPipelineJobsByCategoryFunc(
        args.organizationId,
        args.pipelineId,
        args.category
      );
      return {
        content: [{ type: "text", text: JSON.stringify(jobs, null, 2) }],
      };
    }

    case "list_pipeline_job_historys": {
      const args = types.ListPipelineJobHistorysSchema.parse(request.params.arguments);
      const jobHistorys = await pipelineJob.listPipelineJobHistorysFunc(
        args.organizationId,
        args.pipelineId,
        args.category,
        args.identifier,
        args.page,
        args.perPage
      );
      return {
        content: [{ type: "text", text: JSON.stringify(jobHistorys, null, 2) }],
      };
    }

    case "execute_pipeline_job_run": {
      const args = types.ExecutePipelineJobRunSchema.parse(request.params.arguments);
      const result = await pipelineJob.executePipelineJobRunFunc(
        args.organizationId,
        args.pipelineId,
        args.pipelineRunId,
        args.jobId
      );
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }

    case "get_pipeline_job_run_log": {
      const args = types.GetPipelineJobRunLogSchema.parse(request.params.arguments);
      const log = await pipelineJob.getPipelineJobRunLogFunc(
        args.organizationId,
        args.pipelineId,
        args.pipelineRunId,
        args.jobId
      );
      return {
        content: [{ type: "text", text: JSON.stringify(log, null, 2) }],
      };
    }

    case "update_pipeline": {
      const args = types.UpdatePipelineSchema.parse(request.params.arguments);
      const result = await pipeline.updatePipelineFunc(
        args.organizationId,
        args.pipelineId,
        args.name,
        args.content
      );
      return {
        content: [{ type: "text", text: JSON.stringify({ success: result }) }]
      };
    }

    default:
      return null;
  }
};