import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  CreateWorkitemRelationRecordSchema,
  CreateWorkItemCommentSchema,
  DeleteWorkitemRelationRecordSchema,
  ListWorkitemRelationRecordsSchema,
  ListWorkItemCommentsSchema,
} from '../operations/projex/types.js';

describe('Projex input schemas', () => {
  it('accepts numeric work item IDs for comment tools and normalizes them to strings', () => {
    const listArgs = ListWorkItemCommentsSchema.parse({
      organizationId: 'org-id',
      workItemId: 123456,
    });
    const createArgs = CreateWorkItemCommentSchema.parse({
      organizationId: 'org-id',
      workItemId: 123456,
      content: 'comment',
    });

    assert.equal(listArgs.workItemId, '123456');
    assert.equal(createArgs.workItemId, '123456');
  });

  it('still rejects missing and null work item IDs', () => {
    assert.equal(ListWorkItemCommentsSchema.safeParse({ organizationId: 'org-id' }).success, false);
    assert.equal(
      CreateWorkItemCommentSchema.safeParse({
        organizationId: 'org-id',
        workItemId: null,
        content: 'comment',
      }).success,
      false,
    );
  });

  it('validates work item relation record inputs and normalizes numeric IDs', () => {
    const listArgs = ListWorkitemRelationRecordsSchema.parse({
      organizationId: 'org-id',
      workItemId: 1001,
      relationType: 'ASSOCIATED',
    });
    const createArgs = CreateWorkitemRelationRecordSchema.parse({
      organizationId: 'org-id',
      workItemId: 1001,
      relatedWorkItemId: 1002,
      relationType: 'ASSOCIATED',
    });
    const deleteArgs = DeleteWorkitemRelationRecordSchema.parse({
      organizationId: 'org-id',
      workItemId: 1001,
      relatedWorkItemId: 1002,
      relationType: 'ASSOCIATED',
    });

    assert.equal(listArgs.workItemId, '1001');
    assert.equal(listArgs.relationType, 'ASSOCIATED');
    assert.equal(createArgs.relatedWorkItemId, '1002');
    assert.equal(deleteArgs.relatedWorkItemId, '1002');
    assert.equal(deleteArgs.relationType, 'ASSOCIATED');
    assert.equal(
      CreateWorkitemRelationRecordSchema.safeParse({
        organizationId: 'org-id',
        workItemId: '1001',
        relatedWorkItemId: '1002',
        relationType: 'RELATE',
      }).success,
      false,
    );
  });
});
