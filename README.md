# Mat's Codex Development Skills

Seven explicitly invoked personal skills provide a lightweight project workflow:

`mat-init` → `mat-discover` → `mat-feature` → `mat-build` → Mat review → `mat-next`

Use `mat-refresh` whenever an existing private workflow needs the current standard. `mat-build` always performs `mat-review`, stops with the current Task in `Review`, and waits for Mat. `mat-next` completes an approved Task and identifies what follows without starting it.

## Skills

- `mat-init`: inspect a Git repository and create its private `.mat/` workflow.
- `mat-refresh`: incrementally refresh `.mat/` while preserving project content.
- `mat-discover`: collaboratively investigate one proposed feature without creating files or planning implementation.
- `mat-feature`: turn mutually completed discovery into one confirmed Feature Specification and its complete ordered Task set.
- `mat-build`: orchestrate one approved Task through initial implementation or review corrections, QA, and handoff for Mat's personal review.
- `mat-review`: perform independent Claude QA plus read-only Lead Engineer review for one formal Task or bounded one-off change set.
- `mat-next`: record Mat's approval of the unchanged reviewed Task, complete it, reconcile workflow state, and identify the next Task or feature wrap-up.

Every `agents/openai.yaml` sets `policy.allow_implicit_invocation: false`. Explicitly select or invoke the canonical `mat-init`, `mat-refresh`, `mat-discover`, `mat-feature`, `mat-build`, `mat-review`, or `mat-next` skill through the available Codex skill interface. Ordinary conversation must not activate these workflows.

## Availability

After reviewing this repository, make exactly the seven skill directories available to Codex through the chosen skill location. Shared references and templates are bundled as the non-discoverable `mat-init/support/mat-shared` directory, so do not expose a separate top-level `mat-shared` skill.

This repository does not install or update Mat's active Codex environment automatically.

## Expected agents

The build workflow uses these exact installed agent names:

- Codex `Software Engineer`: the only agent permitted to modify production project files and tests.
- Claude Code `qa-engineer`: independent and read-only, invoked by `mat-review` through `mat-review/scripts/run_claude_qa.ps1`.

The primary Codex session remains the Lead Engineer. Only one Software Engineer writes at a time; no workflow uses Git worktrees.

## Project-local structure

`mat-init` creates:

```text
.mat/
  AGENTS.md
  CONTEXT.md
  WORKFLOW.md
  TASKS.md
  templates/
    feature.md
    task.md
  features/
    0001-feature-name/
      FEATURE.md
      tasks/
        NNN-short-task-name.md
```

`TASKS.md` is the central index. It links each numbered Feature Specification, records whether it is `Draft` or `Ready for Tasking`, preserves Task implementation order, and shows each Task's current state. Feature directories use globally increasing four-digit prefixes such as `0001-feature-name`; Task numbers remain globally sequential across all Feature directories.

The repository-root `AGENTS.md` remains authoritative and unchanged. `.mat/` is private through `.git/info/exclude`, not the shared `.gitignore`.

## Development and validation

Run all repository tests:

```text
node --test tests/skills.test.mjs
```
