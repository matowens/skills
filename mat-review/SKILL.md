---
name: mat-review
description: Perform final specification, code-quality, standards, and release-readiness review for relevant existing work. Use only when Mat explicitly selects or invokes the `mat-review` skill, or when the `mat-build` skill explicitly loads this process for its mandatory final phase; never invoke it from ordinary conversational language. Do not modify files during a manual review unless Mat separately approves corrections.
---

# Perform Final Review

## Establish the review

1. Read the root `AGENTS.md`, `.mat/AGENTS.md`, and every file it routes for review, including `.mat/CONTEXT.md`, `.mat/WORKFLOW.md`, `.mat/TASKS.md`, and the originating Task Specification when one exists.
2. Read [workflow rules](../mat-init/support/mat-shared/references/workflow-rules.md) and the complete [review checklist](../mat-init/support/mat-shared/references/review-checklist.md).
3. Identify and state the baseline. Review only the relevant diff or Task Scope unless Mat requests a broader audit.

## Review two axes

### Specification

Map every Acceptance Criterion to evidence. Check missing required behavior, out-of-scope additions, respected Non-Goals, Edge Cases, and whether tests prove required behavior.

### Code quality and release readiness

Check relevant correctness, dead or abandoned code, duplication, debugging artifacts, unused elements, naming, abstraction and indirection, documentation/comments, project conventions, test quality, security, performance, migration/rollback, dependencies/configuration, compatibility, and release safety.

Do not recommend a change solely because another style or architecture is possible, fewer files might look cleaner, a hypothetical requirement may emerge, or code could be generalized.

## Findings and corrections

For every finding, provide classification (`Blocking`, `Important`, or `Optional`), evidence, why it matters, and a required correction or recommendation. Lead with findings ordered by severity, then note test/evidence gaps and residual risks.

When run manually, remain read-only and present findings before any correction work. Modify files only after Mat explicitly asks to proceed with corrections.

When loaded by the `mat-build` skill, return findings to the Lead Engineer. The Lead Engineer evaluates them, sends valid corrections to the same Software Engineer, and asks the QA Engineer to revalidate when functionality changes. Repeat until no Blocking or Important findings remain.

End with exactly one final recommendation on its own line: `APPROVED`, `CORRECTIONS REQUIRED`, or `BLOCKED`.
