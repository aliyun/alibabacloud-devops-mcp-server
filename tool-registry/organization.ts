import { z } from 'zod';
import { toInputSchema } from '../common/inputSchema.js';
import * as types from '../common/types.js';

export const getOrganizationTools = () => [
  {
    name: "get_current_organization_info",
    description: "Get information about the current user and organization based on the token. In the absence of an explicitly specified organization ID, this result will take precedence.",
    inputSchema: toInputSchema(z.object({})),
  },
  {
    name: "get_user_organizations",
    description: "Get the list of organizations the current user belongs to",
    inputSchema: toInputSchema(z.object({})),
  },
  {
    name: "get_current_user",
    description: "Get information about the current user based on the token. In the absence of an explicitly specified user ID, this result will take precedence.",
    inputSchema: toInputSchema(z.object({})),
  },
  {
    name: "list_organization_departments",
    description: "Get the list of departments in an organization",
    inputSchema: toInputSchema(types.GetOrganizationDepartmentsSchema),
  },
  {
    name: "get_organization_department_info",
    description: "Get information about a department in an organization",
    inputSchema: toInputSchema(types.GetOrganizationDepartmentInfoSchema),
  },
  {
    name: "get_organization_department_ancestors",
    description: "Get the ancestors of a department in an organization",
    inputSchema: toInputSchema(types.GetOrganizationDepartmentAncestorsSchema),
  },
  {
    name: "list_organization_members",
    description: "list user members in an organization",
    inputSchema: toInputSchema(types.GetOrganizationMembersSchema),
  },
  {
    name: "get_organization_member_info",
    description: "Get information about a member in an organization",
    inputSchema: toInputSchema(types.GetOrganizationMemberInfoSchema),
  },
  {
    name: "get_organization_member_info_by_user_id",
    description: "Get information about a member in an organization by user ID",
    inputSchema: toInputSchema(types.GetOrganizationMemberByUserIdInfoSchema),
  },
  {
    name: "search_organization_members",
    description: "[Organization Management] Search for organization members",
    inputSchema: toInputSchema(types.SearchOrganizationMembersSchema),
  },
  {
    name: "list_organization_roles",
    description: "[Organization Management] List organization roles",
    inputSchema: toInputSchema(types.ListOrganizationRolesSchema),
  },
  {
    name: "get_organization_role",
    description: "[Organization Management] Get information about an organization role",
    inputSchema: toInputSchema(types.GetOrganizationRoleSchema),
  },
];