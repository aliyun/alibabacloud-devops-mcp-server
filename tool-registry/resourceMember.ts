import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import * as types from '../common/types.js';

export const getResourceMemberTools = () => [
  {
    name: "delete_resource_member",
    description: "[Resource Member Management] Delete a resource member",
    inputSchema: zodToJsonSchema(types.DeleteResourceMemberSchema),
  },
  {
    name: "list_resource_members",
    description: "[Resource Member Management] Get a list of resource members",
    inputSchema: zodToJsonSchema(types.ResourceMemberBaseSchema),
  },
  {
    name: "update_resource_member",
    description: "[Resource Member Management] Update a resource member",
    inputSchema: zodToJsonSchema(types.UpdateResourceMemberSchema),
  },
  {
    name: "create_resource_member",
    description: "[Resource Member Management] Create a resource member",
    inputSchema: zodToJsonSchema(types.CreateResourceMemberSchema),
  },
  {
    name: "update_resource_owner",
    description: "[Resource Member Management] Transfer resource owner",
    inputSchema: zodToJsonSchema(types.UpdateResourceOwnerSchema),
  },
];