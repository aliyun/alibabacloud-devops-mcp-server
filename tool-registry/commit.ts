import { toInputSchema } from '../common/inputSchema.js';
import { 
  ListCommitsRequestSchema,
  GetCommitRequestSchema,
  CreateCommitCommentRequestSchema
} from '../common/types.js';

// Export all commit tools
export const getCommitTools = () => [
  {
    name: 'list_commits',
    description: '[Code Management] List commits in a Codeup repository',
    inputSchema: toInputSchema(ListCommitsRequestSchema),
  },
  {
    name: 'get_commit',
    description: '[Code Management] Get information about a commit',
    inputSchema: toInputSchema(GetCommitRequestSchema),
  },
  {
    name: 'create_commit_comment',
    description: '[Code Management] Create a comment on a commit',
    inputSchema: toInputSchema(CreateCommitCommentRequestSchema),
  }
];