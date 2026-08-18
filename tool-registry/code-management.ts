import { z } from 'zod';
import { toInputSchema } from '../common/inputSchema.js';
import * as types from '../common/types.js';

export const getCodeManagementTools = () => [
  // Branch Operations
  {
    name: "create_branch",
    description: "[Code Management] Create a new branch in a Codeup repository",
    inputSchema: toInputSchema(types.CreateBranchSchema),
  },
  {
    name: "get_branch",
    description: "[Code Management] Get information about a branch in a Codeup repository",
    inputSchema: toInputSchema(types.GetBranchSchema),
  },
  {
    name: "delete_branch",
    description: "[Code Management] Delete a branch from a Codeup repository",
    inputSchema: toInputSchema(types.DeleteBranchSchema),
  },
  {
    name: "list_branches",
    description: "[Code Management] List branches in a Codeup repository",
    inputSchema: toInputSchema(types.ListBranchesSchema),
  },

  // File Operations
  {
    name: "get_file_blobs",
    description: "[Code Management] Get file content from a Codeup repository",
    inputSchema: toInputSchema(types.GetFileBlobsSchema),
  },
  {
    name: "create_file",
    description: "[Code Management] Create a new file in a Codeup repository",
    inputSchema: toInputSchema(types.CreateFileSchema),
  },
  {
    name: "update_file",
    description: "[Code Management] Update an existing file in a Codeup repository",
    inputSchema: toInputSchema(types.UpdateFileSchema),
  },
  {
    name: "delete_file",
    description: "[Code Management] Delete a file from a Codeup repository",
    inputSchema: toInputSchema(types.DeleteFileSchema),
  },
  {
    name: "list_files",
    description: "[Code Management] List file tree from a Codeup repository",
    inputSchema: toInputSchema(types.ListFilesSchema),
  },
  {
    name: "compare",
    description: "[Code Management] Query code to compare content",
    inputSchema: toInputSchema(types.GetCompareSchema),
  },

  // Repository Operations
  {
    name: "get_repository",
    description: "[Code Management] Get information about a Codeup repository",
    inputSchema: toInputSchema(types.GetRepositorySchema),
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
    inputSchema: toInputSchema(types.ListRepositoriesSchema),
  },
  {
    name: "create_repository",
    description: "[Code Management] Create a new Codeup repository.\n" +
      "\n" +
      "Creates an empty code repository that can then be pushed to via git.\n" +
      "\n" +
      "Use Cases:\n" +
      "\n" +
      "Create a new repository for a project",
    inputSchema: toInputSchema(types.CreateRepositorySchema),
  },

  // Change Request Operations
  {
    name: "get_change_request",
    description: "[Code Management] Get detailed information about a specific change request (merge request) by its local ID.",
    inputSchema: toInputSchema(types.GetChangeRequestSchema),
  },
  {
    name: "list_change_requests",
    description: "[Code Management] List change requests with multi-condition filtering, pagination and sorting. Supports filtering by repository, author, reviewer, state (opened/merged/closed), search keywords, and creation time range.",
    inputSchema: toInputSchema(types.ListChangeRequestsSchema),
  },
  {
    name: "create_change_request",
    description: "[Code Management] Create a new change request (merge request). Supports specifying source/target branches, reviewers, associated work items, and optional AI review trigger.",
    inputSchema: toInputSchema(types.CreateChangeRequestSchema),
  },
  {
    name: "review_change_request",
    description: "[Code Management] Review a change request (merge request): submit a PASS / NOT_PASS opinion, optionally with a comment, and optionally submit pending draft comments at the same time.",
    inputSchema: toInputSchema(types.ReviewChangeRequestSchema),
  },
  {
    name: "merge_change_request",
    description: "[Code Management] Merge a change request (merge request) using a specific merge type (ff-only / no-fast-forward / squash / rebase), with an optional merge message and optional source-branch deletion. This rewrites the target branch and is not reversible.",
    inputSchema: toInputSchema(types.MergeChangeRequestSchema),
  },
  {
    name: "create_change_request_comment",
    description: "[Code Management] Create a comment on a change request. Supports two types: GLOBAL_COMMENT (global comment on the entire merge request) and INLINE_COMMENT (inline comment on specific code lines). For INLINE_COMMENT, you must provide file_path, line_number, from_patchset_biz_id, and to_patchset_biz_id parameters.",
    inputSchema: toInputSchema(types.CreateChangeRequestCommentSchema),
  },
  {
    name: "list_change_request_comments",
    description: "[Code Management] List comments on a change request. Supports filtering by comment type (GLOBAL_COMMENT or INLINE_COMMENT), state (OPENED or DRAFT), resolved status, and file path (for inline comments).",
    inputSchema: toInputSchema(types.ListChangeRequestCommentsSchema),
  },
  {
    name: "update_change_request_comment",
    description: "[Code Management] Update a comment on a change request. Can update the comment content and/or resolved status.",
    inputSchema: toInputSchema(types.UpdateChangeRequestCommentSchema),
  },
  {
    name: "list_change_request_patch_sets",
    description: "[Code Management] List patch sets (versions) for a change request. Patch sets represent different versions of the merge request as it evolves.",
    inputSchema: toInputSchema(types.ListChangeRequestPatchSetsSchema),
  },
];