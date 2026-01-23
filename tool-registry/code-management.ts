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
    description: "[Code Management] Get detailed information about a specific change request (merge request) by its local ID.",
    inputSchema: zodToJsonSchema(types.GetChangeRequestSchema),
  },
  {
    name: "list_change_requests",
    description: "[Code Management] List change requests with multi-condition filtering, pagination and sorting. Supports filtering by repository, author, reviewer, state (opened/merged/closed), search keywords, and creation time range.",
    inputSchema: zodToJsonSchema(types.ListChangeRequestsSchema),
  },
  {
    name: "create_change_request",
    description: "[Code Management] Create a new change request (merge request). Supports specifying source/target branches, reviewers, associated work items, and optional AI review trigger.",
    inputSchema: zodToJsonSchema(types.CreateChangeRequestSchema),
  },
  {
    name: "create_change_request_comment",
    description: "[Code Management] Create a comment on a change request. Supports two types: GLOBAL_COMMENT (global comment on the entire merge request) and INLINE_COMMENT (inline comment on specific code lines). For INLINE_COMMENT, you must provide file_path, line_number, from_patchset_biz_id, and to_patchset_biz_id parameters.",
    inputSchema: zodToJsonSchema(types.CreateChangeRequestCommentSchema),
  },
  {
    name: "list_change_request_comments",
    description: "[Code Management] List comments on a change request. Supports filtering by comment type (GLOBAL_COMMENT or INLINE_COMMENT), state (OPENED or DRAFT), resolved status, and file path (for inline comments).",
    inputSchema: zodToJsonSchema(types.ListChangeRequestCommentsSchema),
  },
  {
    name: "update_change_request_comment",
    description: "[Code Management] Update a comment on a change request. Can update the comment content and/or resolved status.",
    inputSchema: zodToJsonSchema(types.UpdateChangeRequestCommentSchema),
  },
  {
    name: "list_change_request_patch_sets",
    description: "[Code Management] List patch sets (versions) for a change request. Patch sets represent different versions of the merge request as it evolves.",
    inputSchema: zodToJsonSchema(types.ListChangeRequestPatchSetsSchema),
  },
];