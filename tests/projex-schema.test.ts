import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  CreateWorkItemCommentSchema,
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
});
