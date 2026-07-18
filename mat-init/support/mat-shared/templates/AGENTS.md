# Mat's Private Project Workflow

Read the repository-root `AGENTS.md` first when present; it remains authoritative repository guidance. Then use this file as the router for Mat's private workflow.

- Read `CONTEXT.md` for Project Context before discovery, specification, implementation, or review.
- Read `WORKFLOW.md` before changing workflow state or orchestrating implementation.
- Read `TASKS.md` to identify the active Task, Quick Todos, feature membership, implementation order, and current state.
- Read `IDEAS.md` when discovery, planning, or retrospective work may promote or defer project ideas.
- Read applicable existing Feature and Task Specifications under `features/` for discovery, feature planning, implementation, or review.
- Use `templates/feature.md`, `templates/task.md`, and `templates/retrospective.md` only when creating new workflow artifacts.

Mat is the human product owner. The primary Codex session is the Lead Engineer. The globally configured Codex `Software Engineer` is the only subagent permitted to modify production project files. The installed Claude Code `qa-engineer` validates independently and read-only through the `mat-review` process, whether invoked directly or by `mat-build`.

`mat-build` stops with the current Task in `Review`. Only an explicit `mat-next` invocation may mark the unchanged reviewed Task `Complete`; that invocation confirms Mat's personal review and approval when it contains no feedback or uncertainty.

Feature lifecycle, Task order, current Task state, Quick Todos, and completed Feature links are indexed in `TASKS.md`.
