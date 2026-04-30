import {
  listFlowVariableGroups,
  getFlowVariableGroup,
  createFlowVariableGroup,
  updateFlowVariableGroup,
  deleteFlowVariableGroup,
  ListFlowVariableGroupsRequestSchema,
  GetFlowVariableGroupRequestSchema,
  CreateFlowVariableGroupRequestSchema,
  UpdateFlowVariableGroupRequestSchema,
  DeleteFlowVariableGroupRequestSchema,
} from '../operations/flow/variableGroups.js';

/**
 * Handle the Flow pipeline variable groups tool requests
 *
 * @param request - The tool request
 * @returns The tool response or null if not handled
 */
export async function handleFlowVariableGroupTools(request: any) {
  switch (request.params.name) {
    case 'list_flow_variable_groups':
      const listParams = ListFlowVariableGroupsRequestSchema.parse(request.params.arguments);
      const listResult = await listFlowVariableGroups(listParams);
      return {
        content: [{ type: "text", text: JSON.stringify(listResult, null, 2) }],
      };

    case 'get_flow_variable_group':
      const getParams = GetFlowVariableGroupRequestSchema.parse(request.params.arguments);
      const getResult = await getFlowVariableGroup(getParams);
      return {
        content: [{ type: "text", text: JSON.stringify(getResult, null, 2) }],
      };

    case 'create_flow_variable_group':
      const createParams = CreateFlowVariableGroupRequestSchema.parse(request.params.arguments);
      const createResult = await createFlowVariableGroup(createParams);
      return {
        content: [{ type: "text", text: JSON.stringify({ id: createResult }, null, 2) }],
      };

    case 'update_flow_variable_group':
      const updateParams = UpdateFlowVariableGroupRequestSchema.parse(request.params.arguments);
      const updateResult = await updateFlowVariableGroup(updateParams);
      return {
        content: [{ type: "text", text: JSON.stringify({ success: updateResult }, null, 2) }],
      };

    case 'delete_flow_variable_group':
      const deleteParams = DeleteFlowVariableGroupRequestSchema.parse(request.params.arguments);
      const deleteResult = await deleteFlowVariableGroup(deleteParams);
      return {
        content: [{ type: "text", text: JSON.stringify({ success: deleteResult }, null, 2) }],
      };

    default:
      return null;
  }
}
