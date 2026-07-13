---
name: mat-task
description: Convert the current discovery conversation and repository context into one numbered, implementation-ready Task Specification and update `.mat/TASKS.md`. Use only when Mat explicitly selects or invokes the `mat-task` skill; never invoke it from ordinary conversational language. Do not use for broad discovery or implementation.
---

# Create One Task Specification

## Load and assess

1. Read the root `AGENTS.md`, `.mat/AGENTS.md`, and every file it routes for task specification, including `.mat/CONTEXT.md`, `.mat/WORKFLOW.md`, `.mat/TASKS.md`, and existing `.mat/tasks/*.md` files.
2. Read [project structure](../mat-init/support/mat-shared/references/project-structure.md), [workflow rules](../mat-init/support/mat-shared/references/workflow-rules.md), and the [canonical Task template](../mat-init/support/mat-shared/templates/task-template.md).
3. Review the complete current conversation and extract discovery decisions.
4. Ask only questions needed to remove implementation-blocking ambiguity. Do not restart broad discovery.

If the workflow is absent or unusable, stop and recommend the `mat-init` or `mat-refresh` skill.

## Write exactly one Task

1. Find every known Task number in `.mat/tasks/`, `.mat/TASKS.md`, and other durable local Task references. Choose one greater than the highest known number, never fill a gap, and never reuse or renumber a number.
2. Use `NNN-short-task-name.md` with lowercase kebab-case and a concise descriptive name.
3. Create the specification from the canonical template. Preserve all headings and distinguish requirements from implementation preferences.
4. Mark it `Ready` only when outcome, Scope, Non-Goals, testable Acceptance Criteria, blocking decisions, and constraints are clear. Otherwise mark it `Draft` and record only non-blocking items under Open Questions.
5. Add or update the corresponding entry in `.mat/TASKS.md` under the correct section without disturbing unrelated Task state.

Do not implement code or invoke the Software Engineer or QA Engineer.

## Report

Report the Task path, status, index update, key scope boundary, and any unresolved question. Recommend the `mat-build` skill only for a `Ready` Task.
