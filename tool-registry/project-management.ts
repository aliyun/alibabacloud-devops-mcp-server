import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import * as types from '../common/types.js';

export const getProjectManagementTools = () => [
  // Project Operations
  {
    name: "get_project",
    description: "[Project Management] Get information about a Yunxiao project",
    inputSchema: zodToJsonSchema(types.GetProjectSchema),
  },
  {
    name: "search_projects",
    description: "[Project Management] Search for Yunxiao Project List. A Project is a project management unit that includes work items and sprints, and it is different from a code repository (Repository).\n\nUse Cases:\n\nQuery projects I am involved in\nQuery projects I have created",
    inputSchema: zodToJsonSchema(types.SearchProjectsSchema),
  },
  {
    name: "search_programs",
    description: "[Project Management] Search for Yunxiao Program (Project Set) List. A Program is a collection of multiple related projects, used for unified management and coordination of large projects.\n\nUse Cases:\n\nQuery programs by name\nQuery programs by status\nQuery programs by creator",
    inputSchema: zodToJsonSchema(types.SearchProgramsSchema),
  },

  // Version Operations
  {
    name: "list_program_versions",
    description: "[Project Management] List versions for a Yunxiao Program (Project Set). Versions are used to manage release plans and track delivery progress.\n\nUse Cases:\n\nList all versions in a program\nFilter versions by status (TODO, DOING, ARCHIVED)\nSearch versions by name",
    inputSchema: zodToJsonSchema(types.ListProgramVersionsSchema),
  },

  // Sprint Operations
  {
    name: "get_sprint",
    description: "[Project Management] Get information about a sprint",
    inputSchema: zodToJsonSchema(types.GetSprintSchema),
  },
  {
    name: "list_sprints",
    description: "[Project Management] List sprints in a project",
    inputSchema: zodToJsonSchema(types.ListSprintsSchema),
  },
  {
    name: "create_sprint",
    description: "[Project Management] Create a new sprint",
    inputSchema: zodToJsonSchema(types.CreateSprintSchema),
  },
  {
    name: "update_sprint",
    description: "[Project Management] Update an existing sprint",
    inputSchema: zodToJsonSchema(types.UpdateSprintSchema),
  },

  // Work Item Operations
  {
    name: "get_work_item",
    description: "[Project Management] Get information about a work item",
    inputSchema: zodToJsonSchema(types.GetWorkItemSchema),
  },
  {
    name: "create_work_item",
    description: "[Project Management] Create a work item",
    inputSchema: zodToJsonSchema(types.CreateWorkItemSchema),
  },
  {
    name: "search_workitems",
    description: "[Project Management] Search work items with various filter conditions",
    inputSchema: zodToJsonSchema(types.SearchWorkitemsSchema),
  },
  {
    name: "get_work_item_types",
    description: "[Project Management] Get the list of work item types for a project",
    inputSchema: zodToJsonSchema(z.object({
      organizationId: z.string().describe("Organization ID"),
      id: z.string().describe("Project unique identifier"),
      category: z.string().describe("Work item type category, optional values: Req, Bug, Task, etc.")
    })),
  },
  {
    name: "update_work_item",
    description: "[Project Management] Update a work item",
    inputSchema: zodToJsonSchema(types.UpdateWorkItemSchema),
  },

  // Work Item Type Operations
  {
    name: "list_all_work_item_types",
    description: "[Project Management] List all work item types in an organization",
    inputSchema: zodToJsonSchema(types.ListAllWorkItemTypesSchema),
  },
  {
    name: "list_work_item_types",
    description: "[Project Management] List work item types in a project space",
    inputSchema: zodToJsonSchema(types.ListWorkItemTypesSchema),
  },
  {
    name: "get_work_item_type",
    description: "[Project Management] Get details of a specific work item type",
    inputSchema: zodToJsonSchema(types.GetWorkItemTypeSchema),
  },
  {
    name: "list_work_item_relation_work_item_types",
    description: "[Project Management] List work item types that can be related to a specific work item",
    inputSchema: zodToJsonSchema(types.ListWorkItemRelationWorkItemTypesSchema),
  },
  {
    name: "get_work_item_type_field_config",
    description: "[Project Management] Get field configuration for a specific work item type",
    inputSchema: zodToJsonSchema(types.GetWorkItemTypeFieldConfigSchema),
  },
  {
    name: "get_work_item_workflow",
    description: "[Project Management] Get workflow information for a specific work item type",
    inputSchema: zodToJsonSchema(types.GetWorkItemWorkflowSchema),
  },
  {
    name: "list_work_item_comments",
    description: "[Project Management] List comments for a specific work item",
    inputSchema: zodToJsonSchema(types.ListWorkItemCommentsSchema),
  },
  {
    name: "create_work_item_comment",
    description: "[Project Management] Create a comment for a specific work item",
    inputSchema: zodToJsonSchema(types.CreateWorkItemCommentSchema),
  }
];