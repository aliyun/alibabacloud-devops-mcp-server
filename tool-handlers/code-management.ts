import * as branches from '../operations/codeup/branches.js';
import * as files from '../operations/codeup/files.js';
import * as repositories from '../operations/codeup/repositories.js';
import * as changeRequests from '../operations/codeup/changeRequests.js';
import * as changeRequestComments from '../operations/codeup/changeRequestComments.js';
import * as compare from '../operations/codeup/compare.js';
import * as types from '../common/types.js';
import { z } from 'zod';

export const handleCodeManagementTools = async (request: any) => {
  switch (request.params.name) {
    // Branch Operations
    case "create_branch": {
      const args = types.CreateBranchSchema.parse(request.params.arguments);
      const branch = await branches.createBranchFunc(
        args.organizationId,
        args.repositoryId,
        args.branch,
        args.ref
      );
      return {
        content: [{ type: "text", text: JSON.stringify(branch, null, 2) }],
      };
    }

    case "get_branch": {
      const args = types.GetBranchSchema.parse(request.params.arguments);
      const branch = await branches.getBranchFunc(
        args.organizationId,
        args.repositoryId,
        args.branchName
      );
      return {
        content: [{ type: "text", text: JSON.stringify(branch, null, 2) }],
      };
    }

    case "delete_branch": {
      const args = types.DeleteBranchSchema.parse(request.params.arguments);
      const result = await branches.deleteBranchFunc(
        args.organizationId,
        args.repositoryId,
        args.branchName
      );
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }

    case "list_branches": {
      const args = types.ListBranchesSchema.parse(request.params.arguments);
      const branchList = await branches.listBranchesFunc(
        args.organizationId,
        args.repositoryId,
        args.page,
        args.perPage,
        args.sort,
        args.search ?? undefined
      );
      return {
        content: [{ type: "text", text: JSON.stringify(branchList, null, 2) }],
      };
    }

    // File Operations
    case "get_file_blobs": {
      const args = types.GetFileBlobsSchema.parse(request.params.arguments);
      const fileContent = await files.getFileBlobsFunc(
        args.organizationId,
        args.repositoryId,
        args.filePath,
        args.ref
      );
      return {
        content: [{ type: "text", text: JSON.stringify(fileContent, null, 2) }],
      };
    }

    case "create_file": {
      const args = types.CreateFileSchema.parse(request.params.arguments);
      const result = await files.createFileFunc(
        args.organizationId,
        args.repositoryId,
        args.filePath,
        args.content,
        args.commitMessage,
        args.branch,
        args.encoding
      );
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }

    case "update_file": {
      const args = types.UpdateFileSchema.parse(request.params.arguments);
      const result = await files.updateFileFunc(
        args.organizationId,
        args.repositoryId,
        args.filePath,
        args.content,
        args.commitMessage,
        args.branch,
        args.encoding
      );
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }

    case "delete_file": {
      const args = types.DeleteFileSchema.parse(request.params.arguments);
      const result = await files.deleteFileFunc(
        args.organizationId,
        args.repositoryId,
        args.filePath,
        args.commitMessage,
        args.branch
      );
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }

    case "list_files": {
      const args = types.ListFilesSchema.parse(request.params.arguments);
      const fileList = await files.listFilesFunc(
        args.organizationId,
        args.repositoryId,
        args.path,
        args.ref,
        args.type
      );
      return {
        content: [{ type: "text", text: JSON.stringify(fileList, null, 2) }],
      };
    }

    case "compare": {
      const args = types.GetCompareSchema.parse(request.params.arguments);
      const compareResult = await compare.getCompareFunc(
        args.organizationId,
        args.repositoryId,
        args.from,
        args.to,
        args.sourceType ?? undefined,
        args.targetType ?? undefined,
        args.straight ?? undefined
      );

      return {
        content: [{ type: "text", text: JSON.stringify(compareResult, null, 2) }],
      };
    }

    // Repository Operations
    case "get_repository": {
      const args = types.GetRepositorySchema.parse(request.params.arguments);
      const repository = await repositories.getRepositoryFunc(
        args.organizationId,
        args.repositoryId
      );
      return {
        content: [{ type: "text", text: JSON.stringify(repository, null, 2) }],
      };
    }

    case "list_repositories": {
      const args = types.ListRepositoriesSchema.parse(request.params.arguments);
      const repositoryList = await repositories.listRepositoriesFunc(
        args.organizationId,
        args.page,
        args.perPage,
        args.orderBy,
        args.sort,
        args.search ?? undefined,
        args.archived
      );
      return {
        content: [{ type: "text", text: JSON.stringify(repositoryList, null, 2) }],
      };
    }

    // Change Request Operations
    case "get_change_request": {
      const args = types.GetChangeRequestSchema.parse(request.params.arguments);
      const changeRequest = await changeRequests.getChangeRequestFunc(
        args.organizationId,
        args.repositoryId,
        args.localId
      );
      return {
        content: [{ type: "text", text: JSON.stringify(changeRequest, null, 2) }],
      };
    }

    case "list_change_requests": {
      const args = types.ListChangeRequestsSchema.parse(request.params.arguments);
      const changeRequestList = await changeRequests.listChangeRequestsFunc(
        args.organizationId,
        args.page,
        args.perPage,
        args.projectIds ?? undefined,
        args.authorIds ?? undefined,
        args.reviewerIds ?? undefined,
        args.state ?? undefined,
        args.search ?? undefined,
        args.orderBy,
        args.sort,
        args.createdBefore ?? undefined,
        args.createdAfter ?? undefined
      );
      return {
        content: [{ type: "text", text: JSON.stringify(changeRequestList, null, 2) }],
      };
    }

    case "create_change_request": {
      const args = types.CreateChangeRequestSchema.parse(request.params.arguments);
      const changeRequest = await changeRequests.createChangeRequestFunc(
        args.organizationId,
        args.repositoryId,
        args.title,
        args.sourceBranch,
        args.targetBranch,
        args.description ?? undefined,
        args.sourceProjectId,
        args.targetProjectId,
        args.reviewerUserIds ?? undefined,
        args.workItemIds ?? undefined,
        args.createFrom,
        args.triggerAIReviewRun ?? false
      );
      return {
        content: [{ type: "text", text: JSON.stringify(changeRequest, null, 2) }],
      };
    }

    case "create_change_request_comment": {
      const args = types.CreateChangeRequestCommentSchema.parse(request.params.arguments);
      const comment = await changeRequestComments.createChangeRequestCommentFunc(
        args.organizationId,
        args.repositoryId,
        args.localId,
        args.comment_type,
        args.content,
        args.draft,
        args.resolved,
        args.patchset_biz_id,
        args.file_path ?? undefined,
        args.line_number ?? undefined,
        args.from_patchset_biz_id ?? undefined,
        args.to_patchset_biz_id ?? undefined,
        args.parent_comment_biz_id ?? undefined
      );
      return {
        content: [{ type: "text", text: JSON.stringify(comment, null, 2) }],
      };
    }

    case "list_change_request_comments": {
      const args = types.ListChangeRequestCommentsSchema.parse(request.params.arguments);
      const comments = await changeRequestComments.listChangeRequestCommentsFunc(
        args.organizationId,
        args.repositoryId,
        args.localId,
        args.patchSetBizIds ?? undefined,
        args.commentType,
        args.state,
        args.resolved,
        args.filePath ?? undefined
      );
      return {
        content: [{ type: "text", text: JSON.stringify(comments, null, 2) }],
      };
    }

    case "update_change_request_comment": {
      const args = types.UpdateChangeRequestCommentSchema.parse(request.params.arguments);
      const result = await changeRequestComments.updateChangeRequestCommentFunc(
        args.organizationId,
        args.repositoryId,
        args.localId,
        args.commentBizId,
        args.content ?? undefined,
        args.resolved ?? undefined
      );
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }

    case "list_change_request_patch_sets": {
      const args = types.ListChangeRequestPatchSetsSchema.parse(request.params.arguments);
      const patchSets = await changeRequests.listChangeRequestPatchSetsFunc(
        args.organizationId,
        args.repositoryId,
        args.localId
      );

      return {
        content: [{ type: "text", text: JSON.stringify(patchSets, null, 2) }],
      };
    }

    default:
      return null;
  }
};