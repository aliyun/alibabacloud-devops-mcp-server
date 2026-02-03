import * as project from '../operations/projex/project.js';
import * as workitem from '../operations/projex/workitem.js';
import * as sprint from '../operations/projex/sprint.js';
import * as types from '../common/types.js';
import { z } from 'zod';

export const handleProjectManagementTools = async (request: any) => {
  switch (request.params.name) {
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
        args.adminUserId ?? undefined,
        args.logicalStatus ?? undefined,
        args.advancedConditions ?? undefined,
        args.extraConditions ?? undefined,
        args.orderBy,
        args.page,
        args.perPage,
        args.sort,
        args.scenarioFilter ?? undefined,
        args.userId ?? undefined,
      );
      return {
        content: [{ type: "text", text: JSON.stringify(projects, null, 2) }],
      };
    }

    // Sprint Operations
    case "get_sprint": {
      const args = types.GetSprintSchema.parse(request.params.arguments);
      const sprintInfo = await sprint.getSprintFunc(
        args.organizationId,
        args.projectId,
        args.id
      );
      return {
        content: [{ type: "text", text: JSON.stringify(sprintInfo, null, 2) }],
      };
    }

    case "list_sprints": {
      const args = types.ListSprintsSchema.parse(request.params.arguments);
      const sprints = await sprint.listSprintsFunc(
        args.organizationId,
        args.id,
        args.status,
        args.page,
        args.perPage
      );
      return {
        content: [{ type: "text", text: JSON.stringify(sprints, null, 2) }],
      };
    }

    case "create_sprint": {
      const args = types.CreateSprintSchema.parse(request.params.arguments);
      const sprintResult = await sprint.createSprintFunc(
        args.organizationId,
        args.projectId,
        args.name,
        args.owners,
        args.startDate,
        args.endDate,
        args.description,
        args.capacityHours
      );
      return {
        content: [{ type: "text", text: JSON.stringify(sprintResult, null, 2) }],
      };
    }

    case "update_sprint": {
      const args = types.UpdateSprintSchema.parse(request.params.arguments);
      await sprint.updateSprintFunc(
        args.organizationId,
        args.projectId,
        args.id,
        args.name,
        args.owners,
        args.startDate,
        args.endDate,
        args.description,
        args.capacityHours
      );
      return {
        content: [{ type: "text", text: "Sprint updated successfully" }],
      };
    }

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

    case "create_work_item": {
      const args = types.CreateWorkItemSchema.parse(request.params.arguments);
      const workItemInfo = await workitem.createWorkItemFunc(args.organizationId, args.assignedTo, args.spaceId, args.subject, args.workitemTypeId, args.customFieldValues, args.description, args.labels, args.parentId, args.participants, args.sprint, args.trackers, args.verifier, args.versions);
      return {
        content: [{ type: "text", text: JSON.stringify(workItemInfo, null, 2) }],
      };
    }

    case "search_workitems": {
      const args = types.SearchWorkitemsSchema.parse(request.params.arguments);
      const result = await workitem.searchWorkitemsFunc(
        args.organizationId,
        args.category,
        args.spaceId,
        args.subject ?? undefined,
        args.status ?? undefined,
        args.createdAfter ?? undefined,
        args.createdBefore ?? undefined,
        args.updatedAfter ?? undefined,
        args.updatedBefore ?? undefined,
        args.creator ?? undefined,
        args.assignedTo ?? undefined,
        args.sprint ?? undefined,
        args.workitemType ?? undefined,
        args.statusStage ?? undefined,
        args.tag ?? undefined,
        args.priority ?? undefined,
        args.subjectDescription ?? undefined,
        args.finishTimeAfter ?? undefined,
        args.finishTimeBefore ?? undefined,
        args.updateStatusAtAfter ?? undefined,
        args.updateStatusAtBefore ?? undefined,
        args.advancedConditions ?? undefined,
        args.orderBy ?? "gmtCreate",
        args.sort ?? "desc",
        args.page,
        args.perPage,
        args.includeDetails ?? false
      );
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }

    case "get_work_item_types": {
      const args = z.object({
        organizationId: z.string().describe("organization id"),
        id: z.string().describe("project id or space id"),
        category: z.string().describe("Req、Task、Bug etc.")
      }).parse(request.params.arguments);
      
      const workItemTypes = await workitem.getWorkItemTypesFunc(
        args.organizationId,
        args.id,
        args.category
      );
      
      return {
        content: [{ type: "text", text: JSON.stringify(workItemTypes, null, 2) }],
      };
    }

    case "update_work_item": {
      const args = types.UpdateWorkItemSchema.parse(request.params.arguments);
      await workitem.updateWorkItemFunc(
        args.organizationId,
        args.workItemId,
        args.updateWorkItemFields
      );
      return {
        content: [{ type: "text", text: JSON.stringify({ success: true, message: "Work item updated successfully" }, null, 2) }],
      };
    }

    // Work Item Type Operations
    case "list_all_work_item_types": {
      const args = types.ListAllWorkItemTypesSchema.parse(request.params.arguments);
      const workItemTypes = await workitem.listAllWorkItemTypesFunc(
        args.organizationId
      );
      return {
        content: [{ type: "text", text: JSON.stringify(workItemTypes, null, 2) }],
      };
    }
    
    case "list_work_item_types": {
      const args = types.ListWorkItemTypesSchema.parse(request.params.arguments);
      const workItemTypes = await workitem.listWorkItemTypesFunc(
        args.organizationId,
        args.projectId,
        args.category
      );
      return {
        content: [{ type: "text", text: JSON.stringify(workItemTypes, null, 2) }],
      };
    }
    
    case "get_work_item_type": {
      const args = types.GetWorkItemTypeSchema.parse(request.params.arguments);
      const workItemType = await workitem.getWorkItemTypeFunc(
        args.organizationId,
        args.id
      );
      return {
        content: [{ type: "text", text: JSON.stringify(workItemType, null, 2) }],
      };
    }
    
    case "list_work_item_relation_work_item_types": {
      const args = types.ListWorkItemRelationWorkItemTypesSchema.parse(request.params.arguments);
      const workItemTypes = await workitem.listWorkItemRelationWorkItemTypesFunc(
        args.organizationId,
        args.workItemTypeId,
        args.relationType
      );
      return {
        content: [{ type: "text", text: JSON.stringify(workItemTypes, null, 2) }],
      };
    }
    
    case "get_work_item_type_field_config": {
      const args = types.GetWorkItemTypeFieldConfigSchema.parse(request.params.arguments);
      const fieldConfig = await workitem.getWorkItemTypeFieldConfigFunc(
        args.organizationId,
        args.projectId,
        args.workItemTypeId
      );
      return {
        content: [{ type: "text", text: JSON.stringify(fieldConfig, null, 2) }],
      };
    }
    
    case "get_work_item_workflow": {
      const args = types.GetWorkItemWorkflowSchema.parse(request.params.arguments);
      const workflow = await workitem.getWorkItemWorkflowFunc(
        args.organizationId,
        args.projectId,
        args.workItemTypeId
      );
      return {
        content: [{ type: "text", text: JSON.stringify(workflow, null, 2) }],
      };
    }
    
    case "list_work_item_comments": {
      const args = types.ListWorkItemCommentsSchema.parse(request.params.arguments);
      const comments = await workitem.listWorkItemCommentsFunc(
        args.organizationId,
        args.workItemId,
        args.page,
        args.perPage
      );
      return {
        content: [{ type: "text", text: JSON.stringify(comments, null, 2) }],
      };
    }
    
    case "create_work_item_comment": {
      const args = types.CreateWorkItemCommentSchema.parse(request.params.arguments);
      const comment = await workitem.createWorkItemCommentFunc(
        args.organizationId,
        args.workItemId,
        args.content
      );
      return {
        content: [{ type: "text", text: JSON.stringify(comment, null, 2) }],
      };
    }

    default:
      return null;
  }
};