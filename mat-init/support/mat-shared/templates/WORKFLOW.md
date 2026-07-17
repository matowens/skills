# Workflow

## Roles

- Mat owns product, scope, architectural approvals, Task completion, and release decisions.
- The Lead Engineer owns planning, orchestration, judgment, task state, and communication with Mat.
- The `Software Engineer` is the sole code-writing subagent and implements one approved Task at a time with tests.
- The Claude Code `qa-engineer` independently validates completed implementation and remains read-only.

## Task Lifecycle

`Draft` → `Ready` → `In Progress` → `Review` → `Complete`

`Review` includes Claude QA, Lead Engineer review, and Mat's personal code review. Required internal findings or Mat feedback may return the same Task from `Review` to `In Progress` for a correction pass, followed by another complete review. `mat-build` stops in `Review`; only `mat-next` may transition the Task to `Complete` after Mat explicitly approves it. Use `Blocked` only when a genuine blocker prevents safe progress. Work on one Task at a time.

## State Ownership

- `mat-discover` collaboratively explores one proposed Feature without writing files or planning implementation.
- `mat-feature` converts mutually completed discovery into one confirmed Feature Specification, its complete ordered Task set, and the corresponding Task index entry.
- `mat-build` moves exactly one Task from `Ready` into implementation or from `Review` into a correction pass, then returns it to `Review` after implementation and internal validation.
- `mat-review` remains read-only and never changes workflow state.
- `mat-next` moves an explicitly approved Task from `Review` to `Complete`, reconciles durable state, and identifies what follows without starting it.

## Feature and Task Organization

Treat `TASKS.md` as the central Task index. Store each shareable Feature Specification at `features/<FFFF-feature-name>/FEATURE.md` and its Task Specifications under `features/<FFFF-feature-name>/tasks/`. Use four-digit globally sequential Feature numbers and globally sequential Task numbers; never reuse or renumber either identifier. Link each Feature Specification from the index, show Feature readiness, list Tasks beneath it in implementation order, and show every Task's lifecycle state inline. Use the Active Task section as a pointer to the single current Task; keep it populated through `In Progress` and `Review` until `mat-next` completes the Task.

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
