import assert from 'node:assert/strict';
import { it } from 'node:test';
import {
  CreateTestcaseRequestSchema,
  GetTestcaseResponseSchema,
  SearchTestcasesResponseSchema,
  TestStepsDTOSchema,
} from '../operations/testhub/testcases.js';

it('preserves explicit formats in create requests and query responses', () => {
  for (const format of ['TEXT', 'RICHTEXT'] as const) {
    const testSteps = {
      contentType: 'TEXT', stepContent: '<p>步骤</p>', expectedResult: '<p>预期</p>',
      stepContentFormat: format, expectedResultFormat: format,
    };
    const request = CreateTestcaseRequestSchema.parse({ organizationId: 'org', testRepoId: 'repo', testSteps });
    assert.deepEqual(request.testSteps, testSteps);
    const response = { id: 'case', subject: '用例', testSteps };
    assert.deepEqual(GetTestcaseResponseSchema.parse(response).testSteps, testSteps);
    assert.deepEqual(SearchTestcasesResponseSchema.parse([response])[0].testSteps, testSteps);
  }
});

it('keeps legacy missing formats, nullable content and TABLE steps unchanged', () => {
  for (const testSteps of [
    { contentType: 'TEXT', stepContent: null, expectedResult: null },
    { contentType: 'TABLE', content: [{ step: '步骤', expected: '预期' }] },
  ]) {
    assert.deepEqual(TestStepsDTOSchema.parse(testSteps), testSteps);
  }
});

it('rejects unsupported Markdown for either format field', () => {
  for (const field of ['stepContentFormat', 'expectedResultFormat']) {
    assert.equal(TestStepsDTOSchema.safeParse({ contentType: 'TEXT', [field]: 'MARKDOWN' }).success, false);
  }
});
