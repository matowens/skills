---
name: mat-feature
description: Convert mutually completed feature discovery into one confirmed, durable Feature Specification and its complete ordered set of implementation-ready Task Specifications. Use only when Mat explicitly selects or invokes `mat-feature`; never invoke it from ordinary conversational language. Do not use for open-ended discovery or implementation.
---

# Plan a Complete Feature

## Load and assess

1. Read the root `AGENTS.md`, `.mat/AGENTS.md`, and every file it routes for feature planning, including `.mat/CONTEXT.md`, `.mat/WORKFLOW.md`, `.mat/TASKS.md`, `.mat/IDEAS.md`, `.mat/templates/feature.md`, `.mat/templates/task.md`, `.mat/templates/retrospective.md`, and all existing Feature, Task, and retrospective files under `.mat/features/`.
2. Read [project structure](../mat-init/support/mat-shared/references/project-structure.md) and [workflow rules](../mat-init/support/mat-shared/references/workflow-rules.md).
3. Review the mutually agreed discovery handoff in the current conversation or one explicitly supplied by Mat. Confirm that Mat and the Lead Engineer agreed discovery was sufficient. If discovery is missing, incomplete, or still disputed, stop and recommend `mat-discover` rather than reconstructing or abbreviating discovery.
4. Inspect relevant code, documentation, framework capabilities, and project conventions deeply enough to create technically credible implementation Tasks. Verify repository facts instead of treating discovery assumptions as codebase facts.
5. Check for an existing Feature covering the same work. Do not create a duplicate Feature or overwrite an existing Task set. Stop and ask Mat how to handle an apparent planning revision.

If `.mat/` is absent or unusable, stop and recommend `mat-init` or `mat-refresh`.

## Build the proposed feature package

1. Convert the agreed discovery into a clear, comprehensive Feature Specification using every heading in `.mat/templates/feature.md`. Write it for business stakeholders, the product owner, and the engineering team. Keep its Executive Summary reusable in email, a work-tracking system, or stakeholder communication. Exclude internal AI-process commentary and implementation decomposition from the Feature Specification.
2. Decompose the Feature into the smallest ordered set of independently buildable, testable, and reviewable Tasks that preserves coherent implementation boundaries. Create one Task when further decomposition would add ceremony without improving reviewability. Do not split work mechanically by file or application layer when those pieces cannot be reviewed meaningfully on their own.
3. Create each proposed Task from `.mat/templates/task.md` as a substantially shorter technical execution specification for developers and engineering agents. Include only relevant codebase facts, the approved approach, technical requirements and constraints, representative behavior, observable Acceptance Criteria, dependencies, and proportionate verification. Do not repeat the Feature's explanatory narrative or force the Software Engineer to rediscover the agreed technical direction.
4. Ask only questions needed to resolve planning ambiguity revealed by repository inspection or decomposition. If a question changes product behavior, scope, success criteria, or another discovery decision, return that topic to `mat-discover` rather than deciding it silently.
5. Do not produce a partially ready package. Every Task must have a clear outcome, Scope, Non-Goals, testable Acceptance Criteria, blocking decisions, and constraints before it can be marked `Ready`.

## Confirm before writing

Present the complete proposed Feature Specification and an ordered Task outline containing each Task's purpose, boundary, Acceptance Criteria summary, dependencies, and testing expectations. Ask Mat to confirm or correct the complete package. Do not allocate identifiers, create directories, write files, or update workflow state until Mat explicitly approves it.

## Create the durable feature package

1. Find every known four-digit Feature number in `.mat/features/`, `.mat/TASKS.md`, and other durable local references. Assign one above the highest known number, starting with `0001`; never fill a gap, reuse, or renumber. Combine it with a concise lowercase kebab-case name as `FFFF-feature-name`.
2. Find every known Task number recursively under `.mat/features/`, in `.mat/TASKS.md`, and in other durable local references. Assign the new Tasks sequentially above the highest known Task number; never fill a gap, reuse, or renumber.
3. Create `.mat/features/<FFFF-feature-name>/FEATURE.md` from `.mat/templates/feature.md`, mark it `Ready for Tasking` while assembling the Task set, create its `tasks/` directory, and create `RETROSPECTIVE.md` from `.mat/templates/retrospective.md` with status `Collecting`.
4. Create every approved Task at `.mat/features/<FFFF-feature-name>/tasks/NNN-short-task-name.md` from `.mat/templates/task.md`, in the approved implementation order, and mark it `Ready`.
5. Add the Feature exactly once beneath Current Features in `.mat/TASKS.md` using the heading `### [FFFF Feature Name](features/FFFF-feature-name/FEATURE.md)`. List every Task beneath it exactly once in implementation order with its relative link and inline `Ready` state. After verifying the complete package and index agree, move the Feature Specification and indexed Feature state from `Ready for Tasking` to `In Progress`. Preserve unrelated Features, Tasks, states, and ordering. Do not populate Active Task or mark any Task `In Progress`.

Do not implement code or invoke the Software Engineer or QA Engineer.

## Report

Report the `In Progress` Feature Specification path, collecting retrospective path, ordered Task paths, index update, important dependencies, and confirmed scope boundary. Recommend `mat-build` for the first Task and state explicitly that implementation has not started.
