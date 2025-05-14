import { z } from "zod";
import { yunxiaoRequest } from "../../common/utils.js";
import {
  WorkItemSchema,
  FilterConditionSchema,
  ConditionsSchema
} from "../../common/types.js";

// Function implementations
export async function getWorkItemFunc(
  organizationId: string,
  workItemId: string
): Promise<z.infer<typeof WorkItemSchema>> {
  const url = `/oapi/v1/projex/organizations/${organizationId}/workitems/${workItemId}`;

  const response = await yunxiaoRequest(url, {
    method: "GET",
  });

  return WorkItemSchema.parse(response);
}

export async function searchWorkitemsFunc(
  organizationId: string,
  category: string,
  spaceId: string,
  subject?: string,
  status?: string,
  createdAfter?: string,
  createdBefore?: string,
  creator?: string,
  assignedTo?: string,
  advancedConditions?: string,
  orderBy: string = "gmtCreate" // Possible values: gmtCreate, subject, status, priority, assignedTo
): Promise<z.infer<typeof WorkItemSchema>[]> {
  const url = `/oapi/v1/projex/organizations/${organizationId}/workitems:search`;

  // Prepare payload
  const payload: Record<string, any> = {
    category: category,
    spaceId: spaceId,
  };

  // Process condition parameters
  const conditions = buildWorkitemConditions({
    subject,
    status,
    createdAfter,
    createdBefore,
    creator,
    assignedTo,
    advancedConditions
  });
  
  if (conditions) {
    payload.conditions = conditions;
  }

  // Add orderBy parameter
  payload.orderBy = orderBy;

  const response = await yunxiaoRequest(url, {
    method: "POST",
    body: payload,
  });

  // Ensure response is an array
  if (!Array.isArray(response)) {
    return [];
  }

  // Parse each work item object
  return response.map(workitem => WorkItemSchema.parse(workitem));
}

// Build work item search conditions
function buildWorkitemConditions(args: {
  subject?: string;
  status?: string;
  createdAfter?: string;
  createdBefore?: string;
  creator?: string;
  assignedTo?: string;
  advancedConditions?: string;
}): string | undefined {
  // If advanced conditions are provided directly, use them preferentially
  if (args.advancedConditions) {
    return args.advancedConditions;
  }

  // Build condition group
  const filterConditions: z.infer<typeof FilterConditionSchema>[] = [];

  // Process title
  if (args.subject) {
    filterConditions.push({
      className: "string",
      fieldIdentifier: "subject",
      format: "input",
      operator: "CONTAINS",
      toValue: null,
      value: [args.subject],
    });
  }

  // Process status
  if (args.status) {
    const statusValues = args.status.split(",");
    const values = statusValues.map(v => v.trim());

    filterConditions.push({
      className: "status",
      fieldIdentifier: "status",
      format: "list",
      operator: "CONTAINS",
      toValue: null,
      value: values,
    });
  }

  // Process creation time range
  if (args.createdAfter) {
    const createdBefore = args.createdBefore ? `${args.createdBefore} 23:59:59` : null;

    filterConditions.push({
      className: "date",
      fieldIdentifier: "gmtCreate",
      format: "input",
      operator: "BETWEEN",
      toValue: createdBefore,
      value: [`${args.createdAfter} 00:00:00`],
    });
  }

  // Process creator
  if (args.creator) {
    const creatorValues = args.creator.split(",");
    const values = creatorValues.map(v => v.trim());

    filterConditions.push({
      className: "user",
      fieldIdentifier: "creator",
      format: "list",
      operator: "CONTAINS",
      toValue: null,
      value: values,
    });
  }

  // Process assignee
  if (args.assignedTo) {
    const assignedToValues = args.assignedTo.split(",");
    const values = assignedToValues.map(v => v.trim());

    filterConditions.push({
      className: "user",
      fieldIdentifier: "assignedTo",
      format: "list",
      operator: "CONTAINS",
      toValue: null,
      value: values,
    });
  }

  // If there are no conditions, return undefined
  if (filterConditions.length === 0) {
    return undefined;
  }

  // Build complete condition object
  const conditions: z.infer<typeof ConditionsSchema> = {
    conditionGroups: [filterConditions],
  };

  // Serialize to JSON
  return JSON.stringify(conditions);
} 