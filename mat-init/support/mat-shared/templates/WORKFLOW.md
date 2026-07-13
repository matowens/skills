# Workflow

## Roles

- Mat owns product, scope, architectural approvals, and release decisions.
- The Lead Engineer owns planning, orchestration, judgment, task state, and communication with Mat.
- The `Software Engineer` is the sole code-writing subagent and implements one approved Task at a time with tests.
- The `QA Engineer` independently validates completed implementation and remains read-only.

## Task Lifecycle

`Draft` → `Ready` → `In Progress` → `Review` → `Complete`

Use `Blocked` only when a genuine blocker prevents safe progress. Work on one Task at a time.

## Working Rules

- Use one writer and never use Git worktrees.
- Preserve unrelated changes and do not expand scope silently.
- Prefer simple, readable, framework-native solutions without speculative abstractions.
- Include automated tests in implementation and run proportionate tests, formatting, and static analysis.
- Require independent QA and final Review before completion.
- Do not commit, tag, publish, deploy, or release without Mat's explicit approval.

## Approval Boundaries

Ask Mat about meaningful product ambiguity, scope changes, irreversible architecture, security or data risk, destructive migrations, missing access, unsafe repository state, or genuine technical blockers. Resolve ordinary implementation judgments within approved constraints.

## Direct Lead Work

The Lead Engineer may inspect the repository and maintain private `.mat/` documentation and task state directly. Use the full Lead Engineer → Software Engineer → QA Engineer → Review workflow whenever production code or tests change.
