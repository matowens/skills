---
name: mat-next
description: Treat Mat's explicit invocation after personal code review as approval of the unchanged current `Review` Task, complete that Task, reconcile private workflow documentation, and identify the next eligible Task or feature wrap-up. Use only when Mat explicitly selects or invokes `mat-next`; never invoke it from ordinary conversational language. Do not use when feedback or uncertainty remains, and never implement changes, start another Task, commit, deploy, or release.
---

# Complete an Approved Task

## Confirm the completion gate

1. Read the root `AGENTS.md`, `.mat/AGENTS.md`, every file it routes for completion, `.mat/CONTEXT.md`, `.mat/WORKFLOW.md`, `.mat/TASKS.md`, the Active Task Specification, its parent Feature Specification, and [workflow rules](../mat-init/support/mat-shared/references/workflow-rules.md).
2. Confirm exactly one Task is active and that the Active Task pointer, its indexed state, and its Task Specification all identify that same Task as `Review`. Confirm no different Task is `In Progress` or `Review`.
3. Confirm the latest complete `mat-review` process returned `APPROVED`, required verification is complete, no retained `Blocking` or `Important` finding remains, and the Work Log contains the reviewed file-state evidence recorded by `mat-build`.
4. Recompute the relevant reviewed path states and confirm the implementation still matches that evidence. Stop and recommend another `mat-build` or `mat-review` pass when project files changed after approval or the current implementation cannot be proven to match the approved review boundary.
5. Treat Mat's explicit `mat-next` invocation as confirmation that he completed personal code review and approves the current unchanged implementation when the invocation contains no feedback, requested change, or uncertainty. Do not require a redundant approval message.
6. If the invocation includes feedback, a requested change, or uncertainty, do not treat it as approval and do not change workflow state. Route it to the existing `mat-build` correction path.

Do not infer approval from silence, ordinary conversation, or an invocation made before the completion gate is satisfied.

## Complete the current Task

1. Set the Task status to `Complete`. Record Mat's approval through `mat-next`, the completion transition, any accepted or deferred `Optional` observations, and unresolved follow-up in its Work Log.
2. Update `.mat/TASKS.md`: change that Task's inline state to `Complete` beneath its existing Feature and clear the matching Active Task pointer. Do not move, duplicate, reorder, or otherwise change another Task.
3. Update the parent Feature Specification only when the approved implementation established a Mat-approved product decision or behavior that would otherwise leave the document inaccurate. Preserve its identifier and `Ready for Tasking` status; do not rewrite it merely to record activity.
4. Update `.mat/CONTEXT.md` or `.mat/WORKFLOW.md` only when the completed Task established durable, verified project-level facts, commands, constraints, or conventions. Do not place feature-specific history in Project Context or rewrite stable documentation.
5. Do not modify production code, tests, or user-facing project documentation during completion. If those files require changes, stop and route them through `mat-build`.

Re-read the Task Specification and `.mat/TASKS.md`. Verify the Task is `Complete`, its single indexed entry is `Complete`, the Active Task is `None`, unrelated state is unchanged, and every updated durable document agrees before reporting success.

## Determine what follows

Use the completed Task's Feature group, listed implementation order, and declared dependencies in `.mat/TASKS.md`.

- If a later Task is `Ready`, select only the first eligible Task whose required predecessors and dependencies are complete. Report its path and concise Scope boundary. Do not change it to `In Progress`, make it Active, invoke `mat-build`, or begin implementation.
- If no Task is eligible because remaining Tasks are `Draft` or `Blocked`, report the blocking state and recommend the appropriate clarification or planning step without changing those Tasks.
- If every Task in the Feature is `Complete`, report that the Feature's Task set is complete. Leave the Feature Specification and indexed Feature status as `Ready for Tasking`; that status records planning readiness, while the Task states record delivery. Summarize deferred Optional observations or improvement candidates already preserved in Task Work Logs, recommend a feature-wide `mat-review` when risk warrants it, and identify unresolved release considerations.

Stop before committing, tagging, publishing, deploying, releasing, or beginning another Task. Report only the completed Task, durable documentation updated, next eligible Task or Feature status, and unresolved follow-up.
