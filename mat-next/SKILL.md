---
name: mat-next
description: Treat Mat's explicit invocation after personal code review as approval of the unchanged current Review Task, complete it, and either identify the next Task or prepare the finished Feature for deployment by pushing its branch and creating or updating the configured review request. Use only when Mat explicitly selects or invokes mat-next; never invoke it from ordinary conversation. Never implement, merge, deploy, or release.
---

# Complete an Approved Task and Prepare What Follows

## Load the boundary

Read the root `AGENTS.md`, `.mat/AGENTS.md`, every routed completion file, `.mat/CONTEXT.md`, `.mat/WORKFLOW.md`, `.mat/TASKS.md`, the Feature Specification, its retrospective, the Active Task Specification when present, and [workflow rules](../mat-init/support/mat-shared/references/workflow-rules.md).

Accept exactly one entry mode:

- **Task completion:** exactly one Task is Active and synchronized as `Review` while its Feature is `In Progress`.
- **Deployment-preparation resume:** no Task is Active, every Feature Task is `Complete`, and the Feature is already `Deployment` because an earlier final `mat-next` could not finish remote preparation.

Refuse every other state rather than guessing.

## Confirm the Task completion gate

For Task completion, confirm the latest complete `mat-review` process returned `APPROVED`, required verification is complete, no retained `Blocking` or `Important` finding remains, and the Work Log contains the reviewed file-state evidence recorded by `mat-build`. Recompute those path states and confirm the implementation still matches that evidence and the reviewed boundary.

Treat Mat's explicit `mat-next` invocation as confirmation that he completed personal code review and approves the unchanged implementation when it contains no feedback, requested change, or uncertainty. Do not require a redundant approval message. If the invocation includes feedback, a requested change, or uncertainty, leave state unchanged and route it through the existing `mat-build` correction path.

## Complete the current Task

1. Set the Task Specification and its single indexed entry to `Complete`.
2. Record Mat's approval, the completion transition, accepted or deferred `Optional` observations, and unresolved follow-up in the Work Log.
3. Clear the matching Active Task pointer. Do not move, duplicate, reorder, or otherwise change another Task.
4. Update the parent Feature Specification only when approved implementation established a durable product decision that would otherwise leave it inaccurate.
5. Update Project Context or Workflow only for durable, verified project facts or conventions.

Do not modify production code, tests, or user-facing project documentation. If those files need changes, stop and use `mat-build`.

## Identify the next Task

When a later Task remains, leave the Feature `In Progress` and select only the first eligible `Ready` Task whose predecessors and dependencies are complete. Do not change the next Task. Report its title, clickable path, and concise Scope boundary. Do not make it Active, move it to `In Progress`, invoke `mat-build`, or begin implementation. State explicitly that implementation has not started.

If no Task is eligible because remaining Tasks are `Draft` or `Blocked`, report the blocking state without changing those Tasks.

## Enter Deployment after the final Task

When every Feature Task is `Complete`, the same `mat-next` invocation that completed the final Task must:

1. Leave Active Task as `None`.
2. Move the Feature Specification and indexed Feature state from `In Progress` to `Deployment`.
3. Continue directly into deployment preparation below. Never require a second consecutive `mat-next` or a separate prep skill.

An explicit final `mat-next` invocation authorizes the configured Feature-branch push and creation or update of its merge request or pull request. Do not pause for a separate preview or confirmation before those actions when the documented gates pass. It does not authorize commits, merge, SSH, migration, deployment, production validation, or release.

## Prepare the review request idempotently

Read the provider, remote, target branch, CLI, authenticated identity or assignee, and conventions from Project Context. Do not infer missing values from preference alone.

1. Confirm the current branch is the Feature branch, is not the configured target branch or another protected branch, and matches the documented `feature/FFFF-feature-name` convention when that convention applies.
2. Require a clean working tree and confirm all intended application and shared documentation changes are committed. Private ignored `.mat/` changes do not make the Git worktree dirty.
3. Confirm the configured remote exists and points to the documented GitLab or GitHub project.
4. Confirm the provider CLI exists and is authenticated against the remote host: `glab auth status` for GitLab or `gh auth status --active --hostname <host>` for GitHub. Never print tokens.
5. Push only the current Feature branch with upstream tracking: `git push -u <remote> <branch>`.
6. Find an existing open request for the exact source branch and configured target before creating one. Use provider JSON output and match both branches; never rely only on a human-formatted list.
7. Build the title and Markdown description from the Feature summary, completed Tasks, verification evidence, migrations, configuration, release notes, deployment steps, rollback considerations, and known limitations. Keep it useful for a second code-review perspective and do not expose private workflow chatter.
8. If a request exists, update its title, description, target, and configured assignee rather than duplicating it. If none exists, create one. Default to ready for review, not draft, unless Project Context explicitly says otherwise.
9. Assign Mat using the configured provider identity. `@me` is acceptable only when Project Context confirms the authenticated account is Mat's intended assignee.
10. Record the request URL and preparation outcome in the retrospective's delivery notes, then report the URL as a clickable link.

Provider commands should use explicit non-interactive flags. For GitLab, use `glab mr list` JSON filtering, then `glab mr create` or `glab mr update`; for GitHub, use `gh pr list` JSON filtering, then `gh pr create` or `gh pr edit`. Follow the installed CLI's current help when a documented flag differs.

## Recover safely

If tooling, authentication, branch safety, cleanliness, push, lookup, creation, or update fails:

- Keep every completed Task `Complete`.
- Keep the Feature `Deployment` and Active Task `None`.
- Record the exact completed and incomplete preparation steps in the retrospective.
- Report the blocker and the smallest safe recovery action.
- On a later explicit `mat-next` while the Feature remains `Deployment`, resume deployment preparation from the missing step and find the existing request before attempting creation.

Never create a duplicate request, merge it, deploy the application, or mark the Feature `Retrospective` or `Complete`.

## Handle corrections and handoff

Mat owns request review, merge, deployment, and production validation. If he requires a pre-merge application correction, move the Feature back to `In Progress`, add one bounded correction Task with his approval, and use `mat-build`; the final `mat-next` for that correction returns to `Deployment` and updates the same request.

Finish by reporting the completed Task, durable state changes, either the next eligible Task or deployment-preparation result, the clickable request URL when available, and unresolved follow-up. During Deployment, direct Mat to review, merge, deploy, and validate. `mat-retro` is appropriate only after Mat confirms all three are complete.
