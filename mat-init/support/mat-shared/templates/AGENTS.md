# Mat's Private Project Workflow

Read the repository-root `AGENTS.md` first when present; it remains authoritative repository guidance. Then use this file as the router for Mat's private workflow.

- Read `CONTEXT.md` for Project Context before discovery, specification, implementation, or review.
- Read `WORKFLOW.md` before changing workflow state or orchestrating implementation.
- Read `TASKS.md` to identify the active Task, feature membership, implementation order, and current state.
- Read applicable existing Feature and Task Specifications under `features/` for discovery, feature planning, implementation, or review.
- Use `templates/feature.md` and `templates/task.md` only when creating new specifications.

Mat is the human product owner. The primary Codex session is the Lead Engineer. The globally configured Codex `Software Engineer` is the only subagent permitted to modify production project files. The installed Claude Code `qa-engineer` validates independently and read-only through the `mat-review` process, whether invoked directly or by `mat-build`.

`mat-build` stops with the current Task in `Review`. Only `mat-next` may mark it `Complete`, and only after Mat explicitly approves it following personal code review.

Feature Specifications, Feature readiness, Task order, and current Task state are indexed in `TASKS.md`.
