import { z } from 'zod';
import { toInputSchema } from '../common/inputSchema.js';
import * as types from '../common/types.js';

export const getResourceMemberTools = () => [
  {
    name: "delete_resource_member",
    description: "[Resource Member Management] Delete a resource member",
    inputSchema: toInputSchema(types.DeleteResourceMemberSchema),
  },
  {
    name: "list_resource_members",
    description: "[Resource Member Management] Get a list of resource members",
    inputSchema: toInputSchema(types.ResourceMemberBaseSchema),
  },
  {
    name: "update_resource_member",
    description: "[Resource Member Management] Update a resource member",
    inputSchema: toInputSchema(types.UpdateResourceMemberSchema),
  },
  {
    name: "create_resource_member",
    description: "[Resource Member Management] Create a resource member",
    inputSchema: toInputSchema(types.CreateResourceMemberSchema),
  },
  {
    name: "update_resource_owner",
    description: "[Resource Member Management] Transfer resource owner",
    inputSchema: toInputSchema(types.UpdateResourceOwnerSchema),
  },
];