# Pinta-Pinta agent team

1. Planner: issue labeled agent-ready -> publishes an implementation plan.
2. Implementer: Actions workflow_dispatch after plan approval -> implements, verifies, branches and opens a PR.
3. CI: tests, automation and build on every PR.
4. Reviewer: Codex review checks behavior, accessibility, responsiveness and security.

The implementer never merges. Human approval remains the final step.

Operation: open feature issue, add agent-ready, review plan, run Agent implement with issue number and base branch, review PR/checks, merge manually.
