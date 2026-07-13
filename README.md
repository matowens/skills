# Mat's Codex Development Skills

Six explicitly invoked personal skills provide a lightweight project workflow:

`mat-init` → `mat-discover` → `mat-task` → `mat-build` → `mat-review`

Use `mat-refresh` whenever an existing private workflow needs the current standard. `mat-build` always performs `mat-review` before completion.

## Skills

- `mat-init`: inspect a Git repository and create its private `.mat/` workflow.
- `mat-refresh`: incrementally refresh `.mat/` while preserving project content.
- `mat-discover`: explore a proposed Task without specification or implementation.
- `mat-task`: write one numbered Task Specification and update the Task index.
- `mat-build`: orchestrate one Ready Task through implementation, QA, correction, and final Review.
- `mat-review`: perform read-only specification, quality, and release-readiness review.

Every `agents/openai.yaml` sets `policy.allow_implicit_invocation: false`. Explicitly select or invoke the canonical `mat-init`, `mat-refresh`, `mat-discover`, `mat-task`, `mat-build`, or `mat-review` skill through the available Codex skill interface. Ordinary conversation must not activate these workflows. This repository does not document a textual invocation prefix or command syntax.

## Installation

After reviewing this repository, copy exactly the six skill directories into `$CODEX_HOME/skills` (normally `~/.codex/skills`). Shared references and templates are bundled as the non-discoverable `mat-init/support/mat-shared` directory, so do not install a separate top-level `mat-shared` directory.

This repository does not install or update Mat's active Codex environment automatically.

## Expected global agents

The build workflow uses the exact globally configured custom-agent names:

- `Software Engineer`: the only agent permitted to modify production project files and tests.
- `QA Engineer`: independent and read-only.

The primary Codex session remains the Lead Engineer. Only one Software Engineer writes at a time; no workflow uses Git worktrees.

## Project-local structure

`mat-init` creates:

```text
.mat/
  AGENTS.md
  CONTEXT.md
  WORKFLOW.md
  TASKS.md
  tasks/
    _template.md
```

The repository-root `AGENTS.md` remains authoritative and unchanged. `.mat/` is private through `.git/info/exclude`, not the shared `.gitignore`.

## Development and validation

Run all repository tests:

```text
python -m unittest discover -s tests -v
```

Validate a skill with the official validator:

```text
python C:/Users/mat/.codex/skills/.system/skill-creator/scripts/quick_validate.py mat-init
```
