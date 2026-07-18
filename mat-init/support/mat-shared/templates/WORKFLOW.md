# Workflow

## Roles

- Mat owns product, scope, architectural approvals, Task completion, and release decisions.
- The Lead Engineer owns planning, orchestration, judgment, task state, and communication with Mat.
- The `Software Engineer` is the sole code-writing subagent and implements one approved Task at a time with tests.
- The Claude Code `qa-engineer` independently validates completed implementation and remains read-only.

## Engineering Standard

Optimize engineering decisions in this order:

1. Deliver the exact behavior Mat requested.
2. Make it correct, dependable, and easy to verify.
3. Implement it in the clearest, simplest way that fits the existing application.
4. Add flexibility or complexity only when the current requirement genuinely needs it.

Build the minimum complete design: the smallest clear implementation that completely and reliably delivers the requested behavior within the existing system. Specifications preserve shared intent; do not treat them as a checklist that requires visible machinery for every phrase. When multiple approaches satisfy the requirement, prefer fewer concepts, fewer layers, and fewer surprises. Before handoff, trace a representative real example through the result and remove anything that does not contribute to the requested outcome.

## Task Lifecycle

`Draft` → `Ready` → `In Progress` → `Review` → `Complete`

`Review` includes Claude QA, Lead Engineer review, and Mat's personal code review. Required internal findings or Mat feedback may return the same Task from `Review` to `In Progress` for a correction pass, followed by another complete review. `mat-build` stops in `Review`; only an explicit `mat-next` invocation may transition the unchanged reviewed Task to `Complete`. That invocation confirms Mat's personal review and approval when it contains no feedback or uncertainty. Use `Blocked` only when a genuine blocker prevents safe progress. Work on one Task at a time.

## Feature Lifecycle

`Draft` -> `Ready for Tasking` -> `In Progress` -> `Deployment` -> `Retrospective` -> `Complete`

`Ready for Tasking` is transitional while `mat-feature` assembles the approved Task set. Successful tasking moves the Feature to `In Progress`. The `mat-next` invocation that completes the final Task moves it to `Deployment` and prepares the configured remote review request. After Mat merges, deploys, and validates production, `mat-retro` returns the repository to the current target branch, moves the Feature to `Retrospective`, reconciles approved follow-up, marks it `Complete`, and collapses its expanded Task index entry.

## State Ownership

- `mat-discover` collaboratively explores one proposed Feature without writing files or planning implementation.
- `mat-feature` converts mutually completed discovery into one confirmed Feature Specification, its complete ordered Task set, and an `In Progress` Feature index entry.
- `mat-build` operates only on an `In Progress` Feature. It moves exactly one Task from `Ready` into implementation or from `Review` into a correction pass, then returns it to `Review` after implementation and internal validation. It refuses a Feature in `Deployment`, `Retrospective`, or `Complete`.
- `mat-review` remains read-only and never changes workflow state.
- `mat-next` moves an explicitly approved Task from `Review` to `Complete` and identifies what follows without starting it. It leaves the Feature `In Progress` when another Task remains. When the final Task completes, that same invocation moves the Feature to `Deployment`, pushes the Feature branch, and creates or updates the configured merge request or pull request. A rerun in `Deployment` resumes incomplete preparation without duplicating the request.
- Mat owns review-request approval, merge, deployment, and production validation.
- `mat-retro` starts only after Mat confirms merge, deployment, and production validation. It requires a clean worktree, fetches and prunes the configured remote, switches to and fast-forward-only pulls the target branch, and safely deletes the merged local Feature branch when Git permits. It then moves the Feature to `Retrospective`, discusses collected observations including deployment lessons, reconciles approved follow-up, routes deferred ideas, marks the Feature `Complete`, and collapses its Task index entry.

## Feature and Task Organization

Treat `TASKS.md` as the current-work surface. Store each shareable Feature Specification at `features/<FFFF-feature-name>/FEATURE.md` and its Task Specifications under `features/<FFFF-feature-name>/tasks/`. Use four-digit globally sequential Feature numbers and globally sequential Task numbers; never reuse or renumber either identifier. Keep non-complete Features expanded with Tasks in implementation order and synchronized lifecycle states. Use the Active Task section as a pointer to the single current Task; keep it populated through `In Progress` and `Review` until `mat-next` completes the Task. When a retrospective marks a Feature `Complete`, replace its expanded group with one link in the completed-Feature index; retain detailed history in its Feature directory.

## Quick Todos

Use plain checkboxes under `Quick Todos` in `TASKS.md` for small, unambiguous, localized fixes and quality-of-life improvements. They have no identifiers, separate files, lifecycle, mandatory branch type, or retrospective. They wait without interrupting active work and do not block Feature deployment unless Mat explicitly ties one to that Feature. A blocking Task defect stays in Task review; meaningful Feature scope becomes a Task.

When Mat asks to implement a Quick Todo, confirm its one-sentence outcome, delegate the bounded edit to the Software Engineer, run targeted verification, independently review it, and hand it to Mat with affected-file links. Claude QA is optional based on actual risk. Check the item off only after Mat approves, and promote it to a Task or Feature if scope or risk expands.

## Working Rules

- Use one writer and never use Git worktrees.
- Preserve unrelated changes and do not expand scope silently.
- Apply the Engineering Standard and prefer framework-native solutions.
- Include automated tests when required by the Task and run proportionate tests, formatting, and static analysis.
- Require independent QA, Lead Engineer review, and Mat's personal code review before completion.
- Use direct domain language for names, and require a representative outcome test for meaningful business logic when practical.
- Do not commit, tag, publish, deploy, or release without Mat's explicit approval. Final `mat-next` authorizes only its configured branch push and review-request preparation; it never merges or deploys.

## Approval Boundaries

Ask Mat about meaningful product ambiguity, scope changes, irreversible architecture, security or data risk, destructive migrations, missing access, unsafe repository state, or genuine technical blockers. Resolve ordinary implementation judgments within approved constraints.

## Direct Lead Work

The Lead Engineer may make clearly bounded mid-Feature Task additions while maintaining private workflow state. Renew discovery or planning when the change materially affects product purpose, workflow, architecture, dependencies, integrations, data risk, completed work, or Task order.

When Mat identifies a post-Feature discussion point, append it to that Feature's `RETROSPECTIVE.md` without derailing the active Task. Project ideas live in `.mat/IDEAS.md`; reusable workflow ideas live in the canonical workflow Idea Bin. Every deferred idea requires a concrete revisit trigger.

The Lead Engineer may inspect the repository and maintain private `.mat/` documentation and task state directly. Use the full Lead Engineer → Software Engineer → QA Engineer → Review workflow whenever production code or tests change.
