import { z } from 'zod';
import { toInputSchema } from '../common/inputSchema.js';
import * as types from '../common/types.js';

export const getTagTools = () => [
  {
    name: "create_tag",
    description: "[Tag Management] Create a tag",
    inputSchema: toInputSchema(types.CreateTagSchema),
  },
  {
    name: "create_tag_group",
    description: "[Tag Management] Create a tag group",
    inputSchema: toInputSchema(types.CreateTagGroupSchema),
  },
  {
    name: "list_tag_groups",
    description: "[Tag Management] Get a list of tag groups",
    inputSchema: toInputSchema(types.BaseTagSchema),
  },
  {
    name: "delete_tag_group",
    description: "[Tag Management] Delete a tag group",
    inputSchema: toInputSchema(types.DeleteTagGroupSchema),
  },
  {
    name: "update_tag_group",
    description: "[Tag Management] Update a tag group",
    inputSchema: toInputSchema(types.UpdateTagGroupSchema),
  },
  {
    name: "get_tag_group",
    description: "[Tag Management] Get a tag group",
    inputSchema: toInputSchema(types.GetTagGroupSchema),
  },
  {
    name: "delete_tag",
    description: "[Tag Management] Delete a tag",
    inputSchema: toInputSchema(types.DeleteTagSchema),
  },
  {
    name: "update_tag",
    description: "[Tag Management] Update a tag",
    inputSchema: toInputSchema(types.UpdateTagSchema),
  },
];