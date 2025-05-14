#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

import * as branches from './operations/codeup/branches.js';
import * as files from './operations/codeup/files.js';
import * as repositories from './operations/codeup/repositories.js';
import * as changeRequests from './operations/codeup/changeRequests.js';
import * as changeRequestComments from './operations/codeup/changeRequestComments.js';
import * as organization from './operations/organization/organization.js';
import * as project from './operations/projex/project.js';
import * as workitem from './operations/projex/workitem.js';
import * as compare from './operations/codeup/compare.js'
import * as pipeline from './operations/flow/pipeline.js'
import * as packageRepositories from './operations/packages/repositories.js'
import * as artifacts from './operations/packages/artifacts.js'
import {
    isYunxiaoError,
    YunxiaoAuthenticationError, YunxiaoConflictError,
    YunxiaoError, YunxiaoPermissionError, YunxiaoRateLimitError,
    YunxiaoResourceNotFoundError,
    YunxiaoValidationError
} from "./common/errors.js";
import { VERSION } from "./common/version.js";
import {config} from "dotenv";
import * as types from "./common/types.js";


const server = new Server(
    {
        name: "alibabacloud-devops-mcp-server",
        version: VERSION,
    },
    {
        capabilities: {
            tools: {},
        },
    }
);

function formatYunxiaoError(error: YunxiaoError): string {
    let message = `Yunxiao API Error: ${error.message}`;

    if (error instanceof YunxiaoValidationError) {
        message = `Validation Error: ${error.message}`;
        if (error.response) {
            message += `\nDetails: ${JSON.stringify(error.response)}`;
        }
    } else if (error instanceof YunxiaoResourceNotFoundError) {
        message = `Not Found: ${error.message}`;
    } else if (error instanceof YunxiaoAuthenticationError) {
        message = `Authentication Failed: ${error.message}`;
    } else if (error instanceof YunxiaoPermissionError) {
        message = `Permission Denied: ${error.message}`;
    } else if (error instanceof YunxiaoRateLimitError) {
        message = `Rate Limit Exceeded: ${error.message}\nResets at: ${error.resetAt.toISOString()}`;
    } else if (error instanceof YunxiaoConflictError) {
        message = `Conflict: ${error.message}`;
    }

    return message;
}

server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            // Branch Operations
            {
                name: "create_branch",
                description: "[Code Management] Create a new branch in a Codeup repository",
                inputSchema: zodToJsonSchema(types.CreateBranchSchema),
            },
            {
                name: "get_branch",
                description: "[Code Management] Get information about a branch in a Codeup repository",
                inputSchema: zodToJsonSchema(types.GetBranchSchema),
            },
            {
                name: "delete_branch",
                description: "[Code Management] Delete a branch from a Codeup repository",
                inputSchema: zodToJsonSchema(types.DeleteBranchSchema),
            },
            {
                name: "list_branches",
                description: "[Code Management] List branches in a Codeup repository",
                inputSchema: zodToJsonSchema(types.ListBranchesSchema),
            },

            // File Operations
            {
                name: "get_file_blobs",
                description: "[Code Management] Get file content from a Codeup repository",
                inputSchema: zodToJsonSchema(types.GetFileBlobsSchema),
            },
            {
                name: "create_file",
                description: "[Code Management] Create a new file in a Codeup repository",
                inputSchema: zodToJsonSchema(types.CreateFileSchema),
            },
            {
                name: "update_file",
                description: "[Code Management] Update an existing file in a Codeup repository",
                inputSchema: zodToJsonSchema(types.UpdateFileSchema),
            },
            {
                name: "delete_file",
                description: "[Code Management] Delete a file from a Codeup repository",
                inputSchema: zodToJsonSchema(types.DeleteFileSchema),
            },
            {
                name: "compare",
                description: "[Code Management] Query code to compare content",
                inputSchema: zodToJsonSchema(types.GetCompareSchema),
            },

            // Repository Operations
            {
                name: "get_repository",
                description: "[Code Management] Get information about a Codeup repository",
                inputSchema: zodToJsonSchema(types.GetRepositorySchema),
            },
            {
                name: "list_repositories",
                description: "[Code Management] Get the CodeUp Repository List.\n" +
                    "\n" +
                    "A Repository serves as a unit for managing source code and is distinct from a Project.\n" +
                    "\n" +
                    "Use Case:\n" +
                    "\n" +
                    "View my repositories",
                inputSchema: zodToJsonSchema(types.ListRepositoriesSchema),
            },

            // Change Request Operations
            {
                name: "get_change_request",
                description: "[Code Management] Get information about a change request",
                inputSchema: zodToJsonSchema(types.GetChangeRequestSchema),
            },
            {
                name: "list_change_requests",
                description: "[Code Management] List change requests",
                inputSchema: zodToJsonSchema(types.ListChangeRequestsSchema),
            },
            {
                name: "create_change_request",
                description: "[Code Management] Create a new change request",
                inputSchema: zodToJsonSchema(types.CreateChangeRequestSchema),
            },
            {
                name: "create_change_request_comment",
                description: "[Code Management] Create a comment on a change request",
                inputSchema: zodToJsonSchema(types.CreateChangeRequestCommentSchema),
            },
            {
                name: "list_change_request_comments",
                description: "[Code Management] List comments on a change request",
                inputSchema: zodToJsonSchema(types.ListChangeRequestCommentsSchema),
            },
            {
                name: "list_change_request_patch_sets",
                description: "[Code Management] List patch sets for a change request",
                inputSchema: zodToJsonSchema(types.ListChangeRequestPatchSetsSchema),
            },

            // Organization Operations
            {
                name: "get_current_organization_info",
                description: "Get information about the current user and organization based on the token. In the absence of an explicitly specified organization ID, this result will take precedence.",
                inputSchema: zodToJsonSchema(z.object({})),
            },
            {
                name: "get_user_organizations",
                description: "Get the list of organizations the current user belongs to",
                inputSchema: zodToJsonSchema(z.object({})),
            },

            // Project Operations
            {
                name: "get_project",
                description: "[Project Management] Get information about a Yunxiao project",
                inputSchema: zodToJsonSchema(types.GetProjectSchema),
            },
            {
                name: "search_projects",
                description: "[Project Management] Search for Yunxiao Project List. A Project is a project management unit that includes work items and sprints, and it is different from a code repository (Repository).\n" +
                    "\n" +
                    "Use Cases:\n" +
                    "\n" +
                    "Query projects I am involved in\n" +
                    "Query projects I have created",
                inputSchema: zodToJsonSchema(types.SearchProjectsSchema),
            },

            // Sprint Operations
            // {
            //     name: "get_sprint",
            //     description: "Get information about a sprint",
            //     inputSchema: zodToJsonSchema(sprint.GetSprintSchema),
            // },
            // {
            //     name: "list_sprints",
            //     description: "List sprints in a project",
            //     inputSchema: zodToJsonSchema(sprint.ListSprintsSchema),
            // },

            // Work Item Operations
            {
                name: "get_work_item",
                description: "[Project Management] Get information about a work item",
                inputSchema: zodToJsonSchema(types.GetWorkItemSchema),
            },
            {
                name: "search_workitems",
                description: "[Project Management] Search work items with various filter conditions",
                inputSchema: zodToJsonSchema(types.SearchWorkitemsSchema),
            },

            // Pipeline Operations
            {
                name: "get_pipeline",
                description: "[Pipeline Management] Get details of a specific pipeline in an organization",
                inputSchema: zodToJsonSchema(types.GetPipelineSchema),
            },
            {
                name: "list_pipelines",
                description: "[Pipeline Management] Get a list of pipelines in an organization with filtering options",
                inputSchema: zodToJsonSchema(types.ListPipelinesSchema),
            },
            {
                name: "smart_list_pipelines",
                description: "[Pipeline Management] Intelligently search pipelines with natural language time references (e.g., 'today', 'this week')",
                inputSchema: zodToJsonSchema(
                    z.object({
                        organizationId: z.string().describe("Organization ID"),
                        timeReference: z.string().optional().describe("Natural language time reference such as 'today', 'yesterday', 'this week', 'last month', etc."),
                        pipelineName: z.string().optional().describe("Pipeline name filter"),
                        statusList: z.string().optional().describe("Pipeline status list, comma separated (SUCCESS,RUNNING,FAIL,CANCELED,WAITING)"),
                        perPage: z.number().int().min(1).max(30).default(10).optional().describe("Number of items per page"),
                        page: z.number().int().min(1).default(1).optional().describe("Page number")
                    })
                ),
            },
            {
                name: "create_pipeline_run",
                description: "[Pipeline Management] Run a pipeline with optional parameters",
                inputSchema: zodToJsonSchema(types.CreatePipelineRunSchema),
            },
            {
                name: "get_latest_pipeline_run",
                description: "[Pipeline Management] Get information about the latest pipeline run",
                inputSchema: zodToJsonSchema(types.GetLatestPipelineRunSchema),
            },
            {
                name: "get_pipeline_run",
                description: "[Pipeline Management] Get details of a specific pipeline run instance",
                inputSchema: zodToJsonSchema(types.GetPipelineRunSchema),
            },
            {
                name: "list_pipeline_runs",
                description: "[Pipeline Management] Get a list of pipeline run instances with filtering options",
                inputSchema: zodToJsonSchema(types.ListPipelineRunsSchema),
            },
            
            // Package Repository Operations
            {
                name: "list_package_repositories",
                description: "[Packages Management] List package repositories in an organization with filtering options",
                inputSchema: zodToJsonSchema(types.ListPackageRepositoriesSchema),
            },
            
            // Package Artifact Operations
            {
                name: "list_artifacts",
                description: "[Packages Management] List artifacts in a package repository with filtering options",
                inputSchema: zodToJsonSchema(types.ListArtifactsSchema),
            },
            {
                name: "get_artifact",
                description: "[Packages Management] Get information about a single artifact in a package repository",
                inputSchema: zodToJsonSchema(types.GetArtifactSchema),
            }
        ],
    };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
    try {
        if (!request.params.arguments) {
            throw new Error("Arguments are required");
        }

        switch (request.params.name) {
            // Branch Operations
            case "create_branch": {
                const args = types.CreateBranchSchema.parse(request.params.arguments);
                const branch = await branches.createBranchFunc(
                    args.organizationId,
                    args.repositoryId,
                    args.branch,
                    args.ref
                );
                return {
                    content: [{ type: "text", text: JSON.stringify(branch, null, 2) }],
                };
            }

            case "get_branch": {
                const args = types.GetBranchSchema.parse(request.params.arguments);
                const branch = await branches.getBranchFunc(
                    args.organizationId,
                    args.repositoryId,
                    args.branchName
                );
                return {
                    content: [{ type: "text", text: JSON.stringify(branch, null, 2) }],
                };
            }

            case "delete_branch": {
                const args = types.DeleteBranchSchema.parse(request.params.arguments);
                const result = await branches.deleteBranchFunc(
                    args.organizationId,
                    args.repositoryId,
                    args.branchName
                );
                return {
                    content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
                };
            }

            case "list_branches": {
                const args = types.ListBranchesSchema.parse(request.params.arguments);
                const branchList = await branches.listBranchesFunc(
                    args.organizationId,
                    args.repositoryId,
                    args.page,
                    args.perPage,
                    args.sort,
                    args.search ?? undefined
                );
                return {
                    content: [{ type: "text", text: JSON.stringify(branchList, null, 2) }],
                };
            }

            // File Operations
            case "get_file_blobs": {
                const args = types.GetFileBlobsSchema.parse(request.params.arguments);
                const fileContent = await files.getFileBlobsFunc(
                    args.organizationId,
                    args.repositoryId,
                    args.filePath,
                    args.ref
                );
                return {
                    content: [{ type: "text", text: JSON.stringify(fileContent, null, 2) }],
                };
            }

            case "create_file": {
                const args = types.CreateFileSchema.parse(request.params.arguments);
                const result = await files.createFileFunc(
                    args.organizationId,
                    args.repositoryId,
                    args.filePath,
                    args.content,
                    args.commitMessage,
                    args.branch,
                    args.encoding
                );
                return {
                    content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
                };
            }

            case "update_file": {
                const args = types.UpdateFileSchema.parse(request.params.arguments);
                const result = await files.updateFileFunc(
                    args.organizationId,
                    args.repositoryId,
                    args.filePath,
                    args.content,
                    args.commitMessage,
                    args.branch,
                    args.encoding
                );
                return {
                    content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
                };
            }

            case "delete_file": {
                const args = types.DeleteFileSchema.parse(request.params.arguments);
                const result = await files.deleteFileFunc(
                    args.organizationId,
                    args.repositoryId,
                    args.filePath,
                    args.commitMessage,
                    args.branch
                );
                return {
                    content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
                };
            }

            case "list_files": {
                const args = types.ListFilesSchema.parse(request.params.arguments);
                const fileList = await files.listFilesFunc(
                    args.organizationId,
                    args.repositoryId,
                    args.path,
                    args.ref,
                    args.type
                );
                return {
                    content: [{ type: "text", text: JSON.stringify(fileList, null, 2) }],
                };
            }

            case "compare": {
                const args = types.GetCompareSchema.parse(request.params.arguments);
                const compareResult = await compare.getCompareFunc(
                    args.organizationId,
                    args.repositoryId,
                    args.from,
                    args.to,
                    args.sourceType ?? undefined,
                    args.targetType ?? undefined,
                    args.straight ?? undefined
                );

                return {
                    content: [{ type: "text", text: JSON.stringify(compareResult, null, 2) }],
                };
            }

            // Repository Operations
            case "get_repository": {
                const args = types.GetRepositorySchema.parse(request.params.arguments);
                const repository = await repositories.getRepositoryFunc(
                    args.organizationId,
                    args.repositoryId
                );
                return {
                    content: [{ type: "text", text: JSON.stringify(repository, null, 2) }],
                };
            }

            case "list_repositories": {
                const args = types.ListRepositoriesSchema.parse(request.params.arguments);
                const repositoryList = await repositories.listRepositoriesFunc(
                    args.organizationId,
                    args.page,
                    args.perPage,
                    args.orderBy,
                    args.sort,
                    args.search ?? undefined,
                    args.archived
                );
                return {
                    content: [{ type: "text", text: JSON.stringify(repositoryList, null, 2) }],
                };
            }

            // Change Request Operations
            case "get_change_request": {
                const args = types.GetChangeRequestSchema.parse(request.params.arguments);
                const changeRequest = await changeRequests.getChangeRequestFunc(
                    args.organizationId,
                    args.repositoryId,
                    args.localId
                );
                return {
                    content: [{ type: "text", text: JSON.stringify(changeRequest, null, 2) }],
                };
            }

            case "list_change_requests": {
                const args = types.ListChangeRequestsSchema.parse(request.params.arguments);
                const changeRequestList = await changeRequests.listChangeRequestsFunc(
                    args.organizationId,
                    args.page,
                    args.perPage,
                    args.projectIds ?? undefined,
                    args.authorIds ?? undefined,
                    args.reviewerIds ?? undefined,
                    args.state ?? undefined,
                    args.search ?? undefined,
                    args.orderBy,
                    args.sort,
                    args.createdBefore ?? undefined,
                    args.createdAfter ?? undefined
                );
                return {
                    content: [{ type: "text", text: JSON.stringify(changeRequestList, null, 2) }],
                };
            }

            case "create_change_request": {
                const args = types.CreateChangeRequestSchema.parse(request.params.arguments);
                const changeRequest = await changeRequests.createChangeRequestFunc(
                    args.organizationId,
                    args.repositoryId,
                    args.title,
                    args.sourceBranch,
                    args.targetBranch,
                    args.description ?? undefined,
                    args.sourceProjectId,
                    args.targetProjectId,
                    args.reviewerUserIds ?? undefined,
                    args.workItemIds ?? undefined,
                    args.createFrom
                );
                return {
                    content: [{ type: "text", text: JSON.stringify(changeRequest, null, 2) }],
                };
            }

            case "create_change_request_comment": {
                const args = types.CreateChangeRequestCommentSchema.parse(request.params.arguments);
                const comment = await changeRequestComments.createChangeRequestCommentFunc(
                    args.organizationId,
                    args.repositoryId,
                    args.localId,
                    args.comment_type,
                    args.content,
                    args.draft,
                    args.resolved,
                    args.patchset_biz_id,
                    args.file_path ?? undefined,
                    args.line_number ?? undefined,
                    args.from_patchset_biz_id ?? undefined,
                    args.to_patchset_biz_id ?? undefined,
                    args.parent_comment_biz_id ?? undefined
                );
                return {
                    content: [{ type: "text", text: JSON.stringify(comment, null, 2) }],
                };
            }

            case "list_change_request_comments": {
                const args = types.ListChangeRequestCommentsSchema.parse(request.params.arguments);
                const comments = await changeRequestComments.listChangeRequestCommentsFunc(
                    args.organizationId,
                    args.repositoryId,
                    args.localId,
                    args.patchSetBizIds ?? undefined,
                    args.commentType,
                    args.state,
                    args.resolved,
                    args.filePath ?? undefined
                );
                return {
                    content: [{ type: "text", text: JSON.stringify(comments, null, 2) }],
                };
            }

            case "list_change_request_patch_sets": {
                const args = types.ListChangeRequestPatchSetsSchema.parse(request.params.arguments);
                const patchSets = await changeRequests.listChangeRequestPatchSetsFunc(
                    args.organizationId,
                    args.repositoryId,
                    args.localId
                );

                return {
                    content: [{ type: "text", text: JSON.stringify(patchSets, null, 2) }],
                };
            }

            // Organization Operations
            case "get_current_organization_info": {
                const currentOrgInfo = await organization.getCurrentOrganizationInfoFunc();
                return {
                    content: [{ type: "text", text: JSON.stringify(currentOrgInfo, null, 2) }],
                };
            }

            case "get_user_organizations": {
                const userOrgs = await organization.getUserOrganizationsFunc();
                return {
                    content: [{ type: "text", text: JSON.stringify(userOrgs, null, 2) }],
                };
            }

            // Project Operations
            case "get_project": {
                const args = types.GetProjectSchema.parse(request.params.arguments);
                const projectInfo = await project.getProjectFunc(
                    args.organizationId,
                    args.id
                );
                return {
                    content: [{ type: "text", text: JSON.stringify(projectInfo, null, 2) }],
                };
            }

            case "search_projects": {
                const args = types.SearchProjectsSchema.parse(request.params.arguments);
                const projects = await project.searchProjectsFunc(
                    args.organizationId,
                    args.name ?? undefined,
                    args.status ?? undefined,
                    args.createdAfter ?? undefined,
                    args.createdBefore ?? undefined,
                    args.creator ?? undefined,
                    args.admin ?? undefined,
                    args.logicalStatus ?? undefined,
                    args.advancedConditions ?? undefined,
                    args.extraConditions ?? undefined,
                    args.orderBy,
                    args.page,
                    args.perPage,
                    args.sort
                );
                return {
                    content: [{ type: "text", text: JSON.stringify(projects, null, 2) }],
                };
            }

            // Sprint Operations
            // case "get_sprint": {
            //     const args = sprint.GetSprintSchema.parse(request.params.arguments);
            //     const sprintInfo = await sprint.getSprintFunc(
            //         args.organizationId,
            //         args.projectId,
            //         args.id
            //     );
            //     return {
            //         content: [{ type: "text", text: JSON.stringify(sprintInfo, null, 2) }],
            //     };
            // }

            // case "list_sprints": {
            //     const args = sprint.ListSprintsSchema.parse(request.params.arguments);
            //     const sprints = await sprint.listSprintsFunc(
            //         args.organizationId,
            //         args.id,
            //         args.status,
            //         args.page,
            //         args.perPage
            //     );
            //     return {
            //         content: [{ type: "text", text: JSON.stringify(sprints, null, 2) }],
            //     };
            // }

            // Work Item Operations
            case "get_work_item": {
                const args = types.GetWorkItemSchema.parse(request.params.arguments);
                const workItemInfo = await workitem.getWorkItemFunc(
                    args.organizationId,
                    args.workItemId
                );
                return {
                    content: [{ type: "text", text: JSON.stringify(workItemInfo, null, 2) }],
                };
            }

            case "search_workitems": {
                const args = types.SearchWorkitemsSchema.parse(request.params.arguments);
                const workItems = await workitem.searchWorkitemsFunc(
                    args.organizationId,
                    args.category,
                    args.spaceId,
                    args.subject ?? undefined,
                    args.status ?? undefined,
                    args.createdAfter ?? undefined,
                    args.createdBefore ?? undefined,
                    args.creator ?? undefined,
                    args.assignedTo ?? undefined,
                    args.advancedConditions ?? undefined,
                    args.orderBy
                );
                return {
                    content: [{ type: "text", text: JSON.stringify(workItems, null, 2) }],
                };
            }

            // Pipeline Operations
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
                const runId = await pipeline.createPipelineRunFunc(
                    args.organizationId,
                    args.pipelineId,
                    {
                        params: args.params,
                        description: args.description,
                        branches: args.branches,
                        branchMode: args.branchMode,
                        releaseBranch: args.releaseBranch,
                        createReleaseBranch: args.createReleaseBranch,
                        environmentVariables: args.environmentVariables,
                        repositories: args.repositories
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

            // Package Repository Operations
            case "list_package_repositories": {
                const args = types.ListPackageRepositoriesSchema.parse(request.params.arguments);
                const packageRepoList = await packageRepositories.listPackageRepositoriesFunc(
                    args.organizationId,
                    args.repoTypes ?? undefined,
                    args.repoCategories ?? undefined,
                    args.perPage,
                    args.page
                );
                return {
                    content: [{ type: "text", text: JSON.stringify(packageRepoList, null, 2) }],
                };
            }

            // Package Artifact Operations
            case "list_artifacts": {
                const args = types.ListArtifactsSchema.parse(request.params.arguments);
                const artifactsList = await artifacts.listArtifactsFunc(
                    args.organizationId,
                    args.repoId,
                    args.repoType,
                    args.page,
                    args.perPage,
                    args.search ?? undefined,
                    args.orderBy,
                    args.sort
                );
                return {
                    content: [{ type: "text", text: JSON.stringify(artifactsList, null, 2) }],
                };
            }
            
            case "get_artifact": {
                const args = types.GetArtifactSchema.parse(request.params.arguments);
                const artifact = await artifacts.getArtifactFunc(
                    args.organizationId,
                    args.repoId,
                    args.id,
                    args.repoType
                );
                return {
                    content: [{ type: "text", text: JSON.stringify(artifact, null, 2) }],
                };
            }

            default:
                throw new Error(`Unknown tool: ${request.params.name}`);
        }
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw new Error(`Invalid input: ${JSON.stringify(error.errors)}`);
        }
        if (isYunxiaoError(error)) {
            throw new Error(formatYunxiaoError(error));
        }
        throw error;
    }
});

// config();

async function runServer() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Yunxiao MCP Server running on stdio");
}

runServer().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});