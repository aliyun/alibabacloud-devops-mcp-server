import { zodToJsonSchema } from "zod-to-json-schema";
import {
  CreateFlowVariableGroupRequestSchema,
  ListFlowVariableGroupsRequestSchema,
  GetFlowVariableGroupRequestSchema,
  DeleteFlowVariableGroupRequestSchema,
  UpdateFlowVariableGroupRequestSchema,
} from "../operations/flow/variableGroups.js";

// Tool names are intentionally suffixed with `_flow_` to avoid collision
// with the existing AppStack variable group tools
// (`create_variable_group` / `delete_variable_group` / `get_variable_group`
// / `update_variable_group`).
export const getFlowVariableGroupTools = () => [
  {
    name: "create_flow_variable_group",
    description:
      "[Pipeline Management] Create an organization-level variable group for Flow (pipeline).",
    inputSchema: zodToJsonSchema(CreateFlowVariableGroupRequestSchema),
  },
  {
    name: "list_flow_variable_groups",
    description:
      "[Pipeline Management] List organization-level Flow (pipeline) variable groups with pagination.",
    inputSchema: zodToJsonSchema(ListFlowVariableGroupsRequestSchema),
  },
  {
    name: "get_flow_variable_group",
    description:
      "[Pipeline Management] Get a Flow (pipeline) variable group by numeric id.",
    inputSchema: zodToJsonSchema(GetFlowVariableGroupRequestSchema),
  },
  {
    name: "update_flow_variable_group",
    description:
      "[Pipeline Management] Update a Flow (pipeline) variable group by numeric id.",
    inputSchema: zodToJsonSchema(UpdateFlowVariableGroupRequestSchema),
  },
  {
    name: "delete_flow_variable_group",
    description:
      "[Pipeline Management] Delete a Flow (pipeline) variable group by numeric id.",
    inputSchema: zodToJsonSchema(DeleteFlowVariableGroupRequestSchema),
  },
];
