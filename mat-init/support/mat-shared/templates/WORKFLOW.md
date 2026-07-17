# Workflow

## Roles

- Mat owns product, scope, architectural approvals, Task completion, and release decisions.
- The Lead Engineer owns planning, orchestration, judgment, task state, and communication with Mat.
- The `Software Engineer` is the sole code-writing subagent and implements one approved Task at a time with tests.
- The Claude Code `qa-engineer` independently validates completed implementation and remains read-only.

## Task Lifecycle

`Draft` → `Ready` → `In Progress` → `Review` → `Complete`

`Review` includes Claude QA, Lead Engineer review, and Mat's personal code review. `mat-build` stops in `Review`; only `mat-next` may transition the Task to `Complete` after Mat explicitly approves it. Use `Blocked` only when a genuine blocker prevents safe progress. Work on one Task at a time.

## State Ownership

- `mat-task` creates the feature's ordered Task set and updates the Task index.
- `mat-build` moves exactly one Task through `Ready`, `In Progress`, and `Review`.
- `mat-review` remains read-only and never changes workflow state.
- `mat-next` moves an explicitly approved Task from `Review` to `Complete`, reconciles durable state, and identifies what follows without starting it.

## Task Organization

Treat `TASKS.md` as the central Task index. Group Tasks under their feature in implementation order and show each Task's current lifecycle state inline. Store specifications under `tasks/<FFFF-feature-name>/`, using a four-digit globally sequential feature number followed by a lowercase kebab-case name. Keep Task numbers globally sequential across the project independently of feature numbers. Never reuse or renumber either identifier. Use the Active Task section as a pointer to the single current Task; keep it populated through `In Progress` and `Review` until `mat-next` completes the Task.

## Working Rules

- Use one writer and never use Git worktrees.
- Preserve unrelated changes and do not expand scope silently.
- Prefer simple, readable, framework-native solutions without speculative abstractions.
- Include automated tests when required by the Task and run proportionate tests, formatting, and static analysis.
- Require independent QA, Lead Engineer review, and Mat's personal code review before completion.
- Do not commit, tag, publish, deploy, or release without Mat's explicit approval.

## Approval Boundaries

Ask Mat about meaningful product ambiguity, scope changes, irreversible architecture, security or data risk, destructive migrations, missing access, unsafe repository state, or genuine technical blockers. Resolve ordinary implementation judgments within approved constraints.

## Direct Lead Work

The Lead Engineer may inspect the repository and maintain private `.mat/` documentation and task state directly. Use the full Lead Engineer → Software Engineer → QA Engineer → Review workflow whenever production code or tests change.
