import {
  createFlowVariableGroupFunc,
  listFlowVariableGroupsFunc,
  getFlowVariableGroupFunc,
  updateFlowVariableGroupFunc,
  deleteFlowVariableGroupFunc,
  CreateFlowVariableGroupRequestSchema,
  ListFlowVariableGroupsRequestSchema,
  GetFlowVariableGroupRequestSchema,
  UpdateFlowVariableGroupRequestSchema,
  DeleteFlowVariableGroupRequestSchema,
} from "../operations/flow/variableGroups.js";

/**
 * Handle the Flow (pipeline) organization-level variable group tool requests.
 * Returns null for tool names this handler doesn't recognize.
 */
export async function handleFlowVariableGroupTools(request: any) {
  switch (request.params.name) {
    case "create_flow_variable_group": {
      const args = CreateFlowVariableGroupRequestSchema.parse(
        request.params.arguments
      );
      const result = await createFlowVariableGroupFunc(args);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }

    case "list_flow_variable_groups": {
      const args = ListFlowVariableGroupsRequestSchema.parse(
        request.params.arguments
      );
      const result = await listFlowVariableGroupsFunc(args);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }

    case "get_flow_variable_group": {
      const args = GetFlowVariableGroupRequestSchema.parse(
        request.params.arguments
      );
      const result = await getFlowVariableGroupFunc(args);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }

    case "update_flow_variable_group": {
      const args = UpdateFlowVariableGroupRequestSchema.parse(
        request.params.arguments
      );
      const result = await updateFlowVariableGroupFunc(args);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }

    case "delete_flow_variable_group": {
      const args = DeleteFlowVariableGroupRequestSchema.parse(
        request.params.arguments
      );
      const result = await deleteFlowVariableGroupFunc(args);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }

    default:
      return null;
  }
}
