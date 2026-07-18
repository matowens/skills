---
name: mat-retro
description: After Mat confirms a finished Feature was merged, deployed, and validated in production, conduct its retrospective, reconcile approved follow-up, route deferred ideas, mark the Feature Complete, and collapse its Task index entry. Use only when Mat explicitly selects or invokes mat-retro for a Feature in Deployment; never invoke it from ordinary conversation. Do not implement, merge, deploy, or release.
---

# Complete a Feature Retrospective

## Confirm delivery and load history

1. Read the root `AGENTS.md`, `.mat/AGENTS.md`, `.mat/CONTEXT.md`, `.mat/WORKFLOW.md`, `.mat/TASKS.md`, `.mat/IDEAS.md`, the Feature Specification, its `RETROSPECTIVE.md`, every Task Specification and Work Log, applicable QA reports, and [workflow rules](../mat-init/support/mat-shared/references/workflow-rules.md).
2. Resolve the canonical workflow-wide Idea Bin by running `node scripts/resolve_workflow_ideas.mjs`. Read it when available; if it cannot be resolved, retain workflow-wide ideas in the retrospective and report the missing destination rather than losing them.
3. Confirm the Feature Specification and indexed Feature state are both `Deployment`, every Feature Task is `Complete`, no Task is Active, and the retrospective is not already `Complete`.
4. Require Mat's explicit confirmation that the review request was merged, the Feature was deployed, and production validation succeeded. Record the request URL, merge result, deployment result, validation result, and any late hotfix or deployment lesson. Do not infer delivery from a closed request or local Git state.

If delivery is not complete, leave the Feature in `Deployment` and stop with the missing human-owned step. If application work remains, move the Feature back to `In Progress`, add or restore one bounded Task with Mat's approval, keep the retrospective open, and recommend `mat-build`. Never modify production code or tests during retrospective.

## Enter the ceremony and build the agenda

After the delivery gate passes, move the Feature Specification and indexed state from `Deployment` to `Retrospective`. Use collected observations, Mat's additions, Task correction cycles, review findings, QA evidence, verification failures, documentation issues, elapsed effort, deployment outcomes, and workflow-state problems. Deduplicate related observations and do not invent topics merely to justify the ceremony.

Set the retrospective to `In Progress`, create the numbered agenda, and set progress to `0 of N`. A smooth Feature may have no material discussion beyond closure checks.

## Discuss one topic at a time

For each topic, establish the evidence, identify the underlying issue, give the Lead Engineer's concise recommendation, wait for Mat's decision, record the decision and follow-up immediately, and update the completed count before advancing.

Classify every approved follow-up as `Apply before next Feature`, `Trial during next Feature`, `Idea Bin`, or `No action required`.

## Reconcile approved follow-up

Apply immediate approved changes to private workflow state, project documentation, canonical workflow skills, templates, tests, or agent definitions when those repositories and paths are available and Mat authorized the boundary. Use the applicable creation or editing skill when required. Validate each affected repository and preserve unrelated work. Do not commit, push, publish, install packages, run paid QA benchmarks, or modify remote state without Mat's explicit approval.

Route deferred ideas without duplication. Project-specific ideas go to `.mat/IDEAS.md`; reusable workflow, agent, harness, or orchestration ideas go to the resolved workflow-wide Idea Bin. Every idea needs a stable identifier, status, concise reason, source retrospective, concrete `Revisit when` trigger, and `Last considered` Feature. Use `Parked` -> `Ready for Discovery` -> `Promoted` -> `Closed`; never delete history.

Read both Idea Bins during closure and report active counts. Surface only duplicates, missing triggers, and ideas whose revisit condition may now apply.

## Close the Feature

Close only when every agenda topic is addressed or deliberately deferred, all immediate approved actions are completed and validated, Idea Bin routing is complete, delivery is confirmed, and no application work remains.

1. Complete the Decision Log, Action Items, Ideas Routed, delivery outcome, and Final Outcome; set retrospective status to `Complete` and progress to `N of N`.
2. Set the Feature Specification to `Complete`.
3. In `.mat/TASKS.md`, remove the Feature's expanded group from Current Features and add exactly one linked `Complete` entry under Completed Features. Leave Active Task as `None` and preserve detailed history in the Feature directory.
4. Re-read every changed workflow document and verify lifecycle states, links, identifiers, decisions, actions, delivery evidence, and Idea Bins agree.

Report the completed Feature, delivery evidence, reconciled repositories and validation, deferred or trial follow-up, and active Idea Bin counts. State that the AI Feature workflow is complete; do not perform another merge, deployment, or release action.
