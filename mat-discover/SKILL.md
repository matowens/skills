---
name: mat-discover
description: Conduct thorough, conversational discovery for one proposed project Task without writing a specification or implementing code. Use only when Mat explicitly selects or invokes the `mat-discover` skill; never invoke it from ordinary conversational language. Do not use when Mat wants a finished Task Specification or implementation.
---

# Discover a Proposed Task

## Load context

1. Read the root `AGENTS.md`, `.mat/AGENTS.md`, and every file it routes for discovery, especially `.mat/CONTEXT.md` and `.mat/WORKFLOW.md`.
2. Read [project structure](../mat-init/support/mat-shared/references/project-structure.md) and [workflow rules](../mat-init/support/mat-shared/references/workflow-rules.md).
3. Ask what problem or opportunity Mat wants to explore. Inspect relevant code, documentation, framework capabilities, and project conventions when repository awareness will sharpen the discussion.

If `.mat/` is absent or incomplete enough to prevent discovery, explain the gap and recommend the `mat-init` or `mat-refresh` skill.

## Explore without rushing

Ask small, coherent groups of relevant questions. Explore only applicable dimensions: business purpose, stakeholder, intended outcome, current and proposed behavior, scope, Non-Goals, user flow, data, persistence, permissions, failure behavior, Edge Cases, security, performance, compatibility, migration, tests, and release implications.

Challenge vague terminology, contradictions, and hidden assumptions. Use existing framework and project conventions to inform questions. Periodically summarize understanding under `Decided`, `Assumed`, `Unresolved`, and `Out of scope` so Mat can correct it.

Do not create or update a Task Specification, modify code, plan implementation details, or invoke the Software Engineer or QA Engineer. The discovery conversation is the input to the `mat-task` skill.

## Complete discovery

Continue until Mat says discovery is complete or meaningful ambiguity is exhausted. Then provide a concise conversational summary containing the problem, intended outcome, key decisions, scope, Non-Goals, important Edge Cases, unresolved questions, and recommended next step. Recommend the `mat-task` skill when the work is ready for specification.
