import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('CI protects main with a read-only baseline', () => {
  const ci = readFileSync(new URL('../../.github/workflows/ci.yml', import.meta.url), 'utf8');
  assert.match(ci, /pull_request:/);
  assert.match(ci, /contents: read/);
  assert.match(ci, /npm run verify/);
});

test('Codex review is read-only and does not merge', () => {
  const review = readFileSync(new URL('../../.github/workflows/codex-review.yml', import.meta.url), 'utf8');
  assert.match(review, /permission-profile: ':read-only'/);
  assert.match(review, /safety-strategy: (unsafe|drop-sudo|unprivileged-user)/);
  assert.doesNotMatch(review, /gh pr merge/);
});
