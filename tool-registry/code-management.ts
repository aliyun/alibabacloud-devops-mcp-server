import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import * as types from '../common/types.js';

export const getCodeManagementTools = () => [
  // Branch Operations
  {
    name: "create_branch",
    description: "[Code Management] Create a new branch in a Codeup repository",
    inputSchema: zodToJsonSchema(types.CreateBranchSchema),
  },
  {
    name: "get_branch",
    description: "[Code Management] Get information about a branch in a Codeup repository",
    inputSchema: zodToJsonSchema(types.GetBranchSchema),
  },
  {
    name: "delete_branch",
    description: "[Code Management] Delete a branch from a Codeup repository",
    inputSchema: zodToJsonSchema(types.DeleteBranchSchema),
  },
  {
    name: "list_branches",
    description: "[Code Management] List branches in a Codeup repository",
    inputSchema: zodToJsonSchema(types.ListBranchesSchema),
  },

  // File Operations
  {
    name: "get_file_blobs",
    description: "[Code Management] Get file content from a Codeup repository",
    inputSchema: zodToJsonSchema(types.GetFileBlobsSchema),
  },
  {
    name: "create_file",
    description: "[Code Management] Create a new file in a Codeup repository",
    inputSchema: zodToJsonSchema(types.CreateFileSchema),
  },
  {
    name: "update_file",
    description: "[Code Management] Update an existing file in a Codeup repository",
    inputSchema: zodToJsonSchema(types.UpdateFileSchema),
  },
  {
    name: "delete_file",
    description: "[Code Management] Delete a file from a Codeup repository",
    inputSchema: zodToJsonSchema(types.DeleteFileSchema),
  },
  {
    name: "list_files",
    description: "[Code Management] List file tree from a Codeup repository",
    inputSchema: zodToJsonSchema(types.ListFilesSchema),
  },
  {
    name: "compare",
    description: "[Code Management] Query code to compare content",
    inputSchema: zodToJsonSchema(types.GetCompareSchema),
  },

  // Repository Operations
  {
    name: "get_repository",
    description: "[Code Management] Get information about a Codeup repository",
    inputSchema: zodToJsonSchema(types.GetRepositorySchema),
  },
  {
    name: "list_repositories",
    description: "[Code Management] Get the CodeUp Repository List.\n" +
      "\n" +
      "A Repository serves as a unit for managing source code and is distinct from a Project.\n" +
      "\n" +
      "Use Case:\n" +
      "\n" +
      "View my repositories",
    inputSchema: zodToJsonSchema(types.ListRepositoriesSchema),
  },

  // Change Request Operations
  {
    name: "get_change_request",
    description: "[Code Management] Get information about a change request",
    inputSchema: zodToJsonSchema(types.GetChangeRequestSchema),
  },
  {
    name: "list_change_requests",
    description: "[Code Management] List change requests",
    inputSchema: zodToJsonSchema(types.ListChangeRequestsSchema),
  },
  {
    name: "create_change_request",
    description: "[Code Management] Create a new change request",
    inputSchema: zodToJsonSchema(types.CreateChangeRequestSchema),
  },
  {
    name: "create_change_request_comment",
    description: "[Code Management] Create a comment on a change request",
    inputSchema: zodToJsonSchema(types.CreateChangeRequestCommentSchema),
  },
  {
    name: "list_change_request_comments",
    description: "[Code Management] List comments on a change request",
    inputSchema: zodToJsonSchema(types.ListChangeRequestCommentsSchema),
  },
  {
    name: "list_change_request_patch_sets",
    description: "[Code Management] List patch sets for a change request",
    inputSchema: zodToJsonSchema(types.ListChangeRequestPatchSetsSchema),
  },
];