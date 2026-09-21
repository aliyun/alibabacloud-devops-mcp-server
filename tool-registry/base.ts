import { z } from 'zod';
import { toInputSchema } from '../common/inputSchema.js';

export const getBaseTools = () => [
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
  }
];