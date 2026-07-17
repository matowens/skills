---
name: mat-review
description: Perform independent Claude QA plus Lead Engineer review for exactly one bounded formal Task or one bounded one-off change set. Use only when Mat explicitly selects or invokes `mat-review`, or when `mat-build` explicitly loads it; never invoke it from ordinary conversational language. Always remain read-only; do not implement corrections or change workflow state.
---

# Review One Bounded Change Set

## Establish the review mode

1. Read the root `AGENTS.md` and applicable project guidance.
2. For a **formal Task review**, also read `.mat/AGENTS.md`, every file it routes for review, the exact Task Specification, its parent Feature Specification, the original Git boundary, all applicable Software Engineer handoffs, and the current relevant diff.
3. For a **one-off review**, require one concrete boundary identifying the change set, intended behavior or review objective, and any important exclusions. Inspect only the relevant code, tests, documentation, and repository guidance. Ask Mat when the target or intent is materially ambiguous.
4. Read [workflow rules](../mat-init/support/mat-shared/references/workflow-rules.md) when `.mat/` exists and the complete [review checklist](../mat-init/support/mat-shared/references/review-checklist.md) for every review.

Do not silently broaden a Task or one-off request into a repository-wide audit.

## Establish the Git boundary

Use a baseline supplied by `mat-build` or Mat when available. Otherwise:

- use `HEAD` for current staged, unstaged, and untracked work;
- use a commit's parent when Mat asks to review one specific commit; or
- use the relevant merge base for a branch comparison when it is unambiguous.

Ask Mat when no reliable baseline can be inferred. Before reviewing, state the exact baseline, included change set, relevant pre-existing changed paths, and explicit exclusions. A path that was already changed before the review boundary is not evidence against the reviewed work unless the reviewed work also changed it or depends on it.

## Run independent Claude QA

Invoke the installed Claude Code `qa-engineer` through [run_claude_qa.ps1](scripts/run_claude_qa.ps1). Pass:

- the repository root and exact Git baseline;
- the Task Specification path for a formal review;
- a `ReviewRequest` describing any additional formal-review focus or the complete one-off boundary;
- the pre-existing changed path list when one exists; and
- every applicable Software Engineer report.

Use Claude Sonnet at high effort by default. Use Claude Opus at high effort only when the Lead Engineer identifies an unusually risky, cross-cutting, security-sensitive, concurrency-heavy, or architecturally complex review. Do not run both automatically or escalate merely because Sonnet reports a finding.

The bridge runs Claude in plan mode, validates its JSON execution envelope, and returns review text, its recommendation, model usage, cost, and permission denials. Treat a nonzero exit, malformed response, Claude `BLOCKED` result, material permission failure, or invalid final recommendation as a blocked independent review. Do not silently substitute a Codex-only review.

## Perform the Lead Engineer review

Review the same boundary independently rather than summarizing Claude's report.

For a formal Task, map every Acceptance Criterion to implementation and test evidence and verify Scope, Non-Goals, Edge Cases, documentation, and release considerations. For a one-off review, evaluate the stated intended behavior and review objectives without inventing missing requirements.

For either mode, inspect correctness, failure behavior, regressions, tests, maintainability, project conventions, security, performance, compatibility, migration, documentation, and release readiness when relevant. Distinguish tests independently run, tests inspected, and results reported by an implementer.

Evaluate Claude's findings rather than accepting them mechanically. Reject style-only preferences, speculative abstractions, scope expansion, valueless refactoring, and file-count reduction. For every retained finding provide classification (`Blocking`, `Important`, or `Optional`), evidence, impact, and the required correction or recommendation. Lead with findings ordered by severity, then report evidence gaps and residual risks.

## Determine the recommendation

- Return `BLOCKED` when independent Claude QA did not complete reliably or the boundary, access, or evidence is insufficient for a responsible review.
- Return `CORRECTIONS REQUIRED` when any supported `Blocking` or `Important` finding remains after Lead Engineer evaluation.
- Return `APPROVED` only when Claude QA completed reliably, the Lead Engineer found sufficient evidence, and no retained `Blocking` or `Important` finding remains. `Optional` observations may remain without preventing approval.

Claude `ACCEPT` does not force Lead Engineer approval, and a Claude finding does not become required until the Lead Engineer retains it with evidence.

## Return the result

Present retained findings first, followed by verification and evidence gaps, residual risks or Optional observations, and a concise Claude execution summary containing the model, cost, and material permission denials.

When loaded by `mat-build`, return the result without changing files or workflow state. `mat-build` owns required correction routing and reruns this complete review afterward.

When invoked directly, remain read-only and do not change Task status or `.mat/` files. For a formal Task, recommend `mat-build` when required corrections remain. For a one-off review, recommend creating an approved Task before implementing required corrections. An `APPROVED` recommendation is an internal review outcome; it does not replace Mat's personal code review, approve Task completion, or authorize release work.

End with exactly one final recommendation on its own line: `APPROVED`, `CORRECTIONS REQUIRED`, or `BLOCKED`.
