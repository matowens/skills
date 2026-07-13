---
name: mat-build
description: Execute one approved, Ready Task through Lead Engineer review, the configured Software Engineer, independent QA Engineer validation, corrections, and final Review. Use only when Mat explicitly selects or invokes the `mat-build` skill; never invoke it from ordinary conversational language. Do not use for Draft Tasks, discovery, or unapproved release actions.
---

# Build One Approved Task

## Load and confirm preconditions

1. Read the root `AGENTS.md`, `.mat/AGENTS.md`, and every file it routes for implementation, including `.mat/CONTEXT.md`, `.mat/WORKFLOW.md`, `.mat/TASKS.md`, and the exact Task Specification.
2. Read [workflow rules](../mat-init/support/mat-shared/references/workflow-rules.md) and [review checklist](../mat-init/support/mat-shared/references/review-checklist.md).
3. Confirm the exact Task is `Ready`. Inspect relevant implementation and tests, Git status, and unrelated existing changes. Preserve unrelated work and ask Mat only when repository state creates meaningful risk.
4. Confirm the configured agents are named exactly `Software Engineer` and `QA Engineer`. Use no worktree and only one code-writing agent.

## Phase 1: Lead Engineer review

Confirm implementability and the smallest sensible sequence without rewriting approved product requirements. Update the Task to `In Progress`, update `.mat/TASKS.md`, and record the start in its Work Log.

## Phase 2: Software Engineer implementation

Delegate the entire bounded implementation to one `Software Engineer`. Include the Task path, applicable root and local instructions, Scope, Acceptance Criteria, constraints, required tests, one-Task boundary, existing unrelated changes, and explicit prohibitions on worktrees, commits, tags, publishing, deployment, and release.

Require the Software Engineer to inspect before editing, implement production-quality code, write or update tests, run the smallest relevant tests plus broader tests for shared behavior, run required formatting/static analysis, and report files changed, decisions, commands, exact results, and remaining concerns. Do not allow another agent to write concurrently.

## Phase 3: independent QA

After implementation stops, delegate read-only validation to `QA Engineer`. Provide the original Task Specification, current relevant diff, Software Engineer report, and applicable instructions. Require Acceptance Criteria, correctness, Edge Cases, regression, coverage, test quality, Scope, readability, naming, complexity, documentation, and release review. Require Blocking, Non-blocking, and Optional findings plus exactly one recommendation: `ACCEPT`, `CORRECTIONS REQUIRED`, or `BLOCKED`.

## Phase 4: correction loop

Evaluate QA findings rather than accepting them mechanically. Reject style-only preferences, speculative abstractions, scope expansion, valueless refactoring, and file-count reduction. Send valid precise corrections to the same Software Engineer, require tests, then return revised work to QA. Repeat until QA accepts or a genuine blocker requires Mat.

## Phase 5: final Review

Set the Task to `Review`. Read and execute [the mat-review process](../mat-review/SKILL.md) against the relevant Task and diff. Do not mark the Task complete until its final recommendation is `APPROVED`. Route valid corrections through the same Software Engineer and re-run QA when behavior changes.

## Phase 6: complete and report

After approval, set the Task to `Complete`, update `.mat/TASKS.md`, and finish the Work Log. Report outcome, files changed, Acceptance Criteria evidence, exact test commands/results, QA outcome, final Review outcome, remaining risks, and suggested commit or release boundary.

Wait for Mat's explicit approval before committing, tagging, publishing, deploying, or releasing. Return to Mat earlier only for product ambiguity, required Scope change, irreversible architecture, security/data risk, missing access, destructive migration, unsafe unrelated state, or a genuine technical blocker.
