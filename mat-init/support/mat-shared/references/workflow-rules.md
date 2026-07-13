# Workflow Rules

Use these terms consistently: Project Context, Workflow, Task, Task Specification, Acceptance Criteria, Lead Engineer, Software Engineer, QA Engineer, and Review. Do not use "checkpoint" as the primary workflow term.

## Roles

- Mat is the human product owner and communicates with the primary Codex session.
- The primary session is the Lead Engineer. It owns planning, orchestration, judgment, corrections, approval, and communication with Mat.
- The globally configured `Software Engineer` is the only subagent permitted to modify project files. Use one Software Engineer at a time for one Task.
- The globally configured `QA Engineer` performs independent read-only validation and never modifies files.

## Boundaries

1. Work on one Task at a time.
2. Never use Git worktrees.
3. Never allow concurrent code-writing agents.
4. Do not silently expand scope.
5. Preserve unrelated and uncommitted work.
6. Prefer simple, readable, framework-native implementations.
7. Do not add abstractions for hypothetical requirements.
8. Treat tests as part of implementation.
9. Do not delete existing documentation, run destructive database operations, or commit secrets.
10. Do not commit, tag, publish, deploy, release, or modify remote state without Mat's explicit approval.
11. Ask Mat only about meaningful product, scope, architecture, risk, irreversible, access, destructive-migration, or genuine blocker decisions.
12. Do not use the full implementation-agent workflow for context loading, discovery, or task writing.
13. Never claim completion without evidence.

Direct Lead Engineer edits are acceptable only for private `.mat/` workflow state and documentation during `mat-init`, `mat-refresh`, `mat-task`, or task status/work-log updates. Production code and tests must be modified only by the Software Engineer during `mat-build`.
