import { z } from 'zod';
import { toInputSchema } from '../common/inputSchema.js';
import { 
  CreateAppTagRequestSchema,
  UpdateAppTagRequestSchema,
  SearchAppTagRequestSchema,
  UpdateAppTagBindRequestSchema
} from '../operations/appstack/appTags.js';

// Export all appstack tag tools
export const getAppStackTagTools = () => [
  {
    name: 'create_app_tag',
    description: '[application delivery] Create an application tag',
    inputSchema: toInputSchema(CreateAppTagRequestSchema),
  },
  {
    name: 'update_app_tag',
    description: '[application delivery] Update an application tag',
    inputSchema: toInputSchema(UpdateAppTagRequestSchema),
  },
  {
    name: 'search_app_tags',
    description: '[application delivery] Search application tags',
    inputSchema: toInputSchema(SearchAppTagRequestSchema),
  },
  {
    name: 'update_app_tag_bind',
    description: '[application delivery] Update application tag bindings',
    inputSchema: toInputSchema(UpdateAppTagBindRequestSchema),
  }
];