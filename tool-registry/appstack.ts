import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { 
  ListApplicationsRequestSchema,
  GetApplicationRequestSchema,
  CreateApplicationRequestSchema,
  UpdateApplicationRequestSchema,
  ListApplicationSourcesRequestSchema
} from '../operations/appstack/applications.js';

// Export all appstack tools
export const getAppStackTools = () => [
  {
    name: 'list_applications',
    description: '[application delivery] List applications in an organization with pagination',
    inputSchema: zodToJsonSchema(ListApplicationsRequestSchema),
  },
  {
    name: 'get_application',
    description: '[application delivery] Get application details by name',
    inputSchema: zodToJsonSchema(GetApplicationRequestSchema),
  },
  {
    name: 'create_application',
    description: '[application delivery] Create a new application',
    inputSchema: zodToJsonSchema(CreateApplicationRequestSchema),
  },
  {
    name: 'update_application',
    description: '[application delivery] Update an existing application',
    inputSchema: zodToJsonSchema(UpdateApplicationRequestSchema),
  },
  {
    name: 'list_application_sources',
    description: '[application delivery] List application sources with pagination',
    inputSchema: zodToJsonSchema(ListApplicationSourcesRequestSchema),
  }
];