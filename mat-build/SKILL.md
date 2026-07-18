---
name: mat-build
description: Implement one approved `Ready` Task or apply concrete review corrections to the current `Review` Task through Lead Engineer orchestration, one Codex Software Engineer, the complete `mat-review` process, and handoff for Mat's personal code review. Use only when Mat explicitly selects or invokes `mat-build`; never invoke it from ordinary conversational language. Stop with the Task in `Review`; never complete it, start another Task, or perform release actions.
---

# Build or Correct One Approved Task

## Load the complete boundary

1. Read the root `AGENTS.md`, `.mat/AGENTS.md`, and every file it routes for implementation, including `.mat/CONTEXT.md`, `.mat/WORKFLOW.md`, `.mat/TASKS.md`, the exact Task Specification, and its parent Feature Specification.
2. Read [workflow rules](../mat-init/support/mat-shared/references/workflow-rules.md) and [review checklist](../mat-init/support/mat-shared/references/review-checklist.md).
3. Identify the exact Task from Mat's invocation. Use the Active Task for a correction pass or the next eligible `Ready` Task only when the choice is unambiguous; otherwise ask Mat which Task to build.
4. Confirm the parent Feature Specification and indexed Feature state are both `In Progress`, the Task file and its indexed state agree, no different Task is active, required predecessors and declared dependencies are complete, and the selected Task respects the approved implementation order. Refuse a Feature in `Deployment`, `Retrospective`, or `Complete` and direct Mat to deployment, retrospective, or next planning workflow. A required pre-merge correction must first return the Feature to `In Progress` with one bounded approved Task. Stop and ask Mat before skipping an earlier eligible Task or changing that order.
5. Confirm exactly one valid entry mode:
   - **Initial build:** the selected Task is `Ready` and has no implementation awaiting review.
   - **Correction pass:** the selected Active Task is `Review` and concrete retained findings or Mat code-review feedback require implementation changes.
6. Inspect relevant implementation and tests. For an initial build, record the starting Git commit plus a concise list of pre-existing staged, unstaged, and untracked paths in the Task Work Log. For a correction pass, recover that original boundary from the Work Log; if it is missing, establish the best available boundary and record the limitation explicitly. Preserve the original review boundary throughout every pass. Never stash, reset, clean, overwrite, or absorb unrelated work; ask Mat only when overlap creates meaningful risk.
7. Confirm the configured Codex agent is named exactly `Software Engineer`. Use no worktree and only one code-writing agent.

If the workflow or Task boundary is absent, contradictory, or unsafe, stop and recommend the appropriate `mat-init`, `mat-refresh`, `mat-discover`, or `mat-feature` step rather than improvising scope.

When Mat explicitly identifies a post-Feature discussion point during implementation or review, append a concise observation to the parent Feature's `RETROSPECTIVE.md` without changing the active Task boundary or interrupting safe in-scope work.

## Prepare implementation

For an initial build, confirm implementability without rewriting approved requirements. Set the Task and its indexed state to `In Progress`, set the Active Task pointer to that Task, and record the start and Git boundary in its Work Log.

For a correction pass, keep the same Active Task, move its Task and indexed state from `Review` back to `In Progress`, and record the source and concise scope of the corrections in its Work Log. Preserve the original build baseline when it is available.

## Delegate to the Software Engineer

Delegate the entire bounded implementation or correction assignment to one `Software Engineer`. Start every initial Task in a fresh Software Engineer session with no inherited conversation history; reuse that same session only for corrections to its own Task. Point the concise delegation to the Feature and Task paths and add only the applicable instructions, ownership boundary, exceptional risk, verification requirement, relevant retained findings or Mat feedback, original Git boundary, known unrelated changes, and explicit prohibitions on worktrees, commits, tags, publishing, deployment, and release.

Require the Software Engineer to inspect before editing, implement the smallest production-quality solution, write or update required tests, run the smallest relevant tests plus broader tests for shared behavior, and run documented formatting or static analysis. Do not allow another agent to write concurrently, and do not let the Lead Engineer modify production code or tests directly.

Require only the Software Engineer's established concise handoff:

- completion status;
- deviations, assumptions, or non-obvious decisions, only when present;
- exact verification commands and results; and
- unresolved concerns, only when present.

The Lead Engineer must determine the changed files and diff independently rather than requiring routine narration from the Software Engineer. For corrections, resume the same agent session when available; otherwise use the same configured `Software Engineer` role with the complete prior handoff and findings.

## Apply the Lead Engineer evidence gate

Before changing the Task to `Review`, inspect the current Git state and relevant diff against the recorded boundary. Confirm the Software Engineer completed the assignment, no unexplained or out-of-scope changes were introduced, temporary scaffolding is absent, required verification ran successfully or has an explicit acceptable limitation, and the implementation is ready for independent review.

If implementation is incomplete, verification is inadequate, or an ordinary correctable problem is visible, keep the Task `In Progress` and return one focused correction assignment to the Software Engineer. Return to Mat only for product ambiguity, required Scope change, irreversible architecture, security or data risk, missing access, destructive migration, unsafe overlapping work, or a genuine technical blocker.

## Run internal QA and Lead Engineer review

After the evidence gate passes, set the Task and its indexed state to `Review` while keeping it as the Active Task. Record the implementation handoff and state transition concisely in the Work Log.

Read and execute [the complete mat-review process](../mat-review/SKILL.md) against the exact Task, its Feature Specification, the original Git baseline and pre-existing path list, the current relevant diff, and every applicable Software Engineer handoff. `mat-review` owns Claude QA invocation and the independent Lead Engineer review; do not duplicate, bypass, or silently replace its QA bridge.

Do not hand the implementation to Mat for personal review unless `mat-review` returns `APPROVED`.

## Route the review result

- **`CORRECTIONS REQUIRED`:** retain only supported `Blocking` and `Important` findings. Move the Task and indexed state back to `In Progress`, log the correction cycle, and send all retained findings to the same Software Engineer as one focused assignment. After its handoff passes the evidence gate, return the Task to `Review` and rerun the complete `mat-review` process. Repeat as needed. Do not require `Optional` observations without Mat's approval.
- **`BLOCKED`:** do not automatically send the result to the Software Engineer. Identify whether the blocker is review infrastructure, an invalid boundary, missing evidence, access, unsafe repository state, or an implementation problem. Resolve safe in-scope review problems and rerun `mat-review`; delegate code corrections only when code is actually responsible. Return to Mat when the blocker requires his decision or access.
- **`APPROVED`:** keep the Task in `Review` and proceed to Mat's personal review.

When Mat supplies personal code-review feedback through a correction-pass invocation, evaluate it against the approved Feature and Task. Clarify any Scope or product change before implementation, route accepted corrections through the same Software Engineer, and rerun the complete `mat-review` process after project files change.

## Hand off for Mat review

After `mat-review` returns `APPROVED`, keep the Task in `Review` and keep it as the Active Task. Synchronize its indexed state and record the Claude QA and Lead Engineer outcomes in the Work Log. Also record a concise reviewed file-state manifest for every relevant production, test, and project-documentation path using its current Git status entry plus current `git hash-object` blob hash or a deleted marker. Include relevant untracked paths and exclude private `.mat/` state. This evidence allows `mat-next` to detect implementation changes made after internal approval.

Ask Mat to perform personal code review and report:

- the implementation outcome and relevant files changed;
- Acceptance Criteria evidence;
- exact verification commands and results;
- Claude QA and Lead Engineer review outcomes; and
- remaining risks, accepted limitations, or relevant Optional observations.

Provide a complete, simple list of every affected production, test, and project-documentation file with a clickable local-file link. Do not generate a separate mobile diff artifact or duplicate the patch in the handoff.

Never mark the Task `Complete`. After Mat explicitly approves the implementation, recommend `mat-next` for the completion transition. Do not begin another Task, commit, tag, publish, deploy, or release.
