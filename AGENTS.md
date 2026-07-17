# Repository Guidance

This repository is the canonical source for Mat's reusable development-workflow skills. Skills describe how work is performed; durable agent roles and model configuration belong in the separate agents repository.

## Workflow language and boundaries

- Use the official terms defined in `mat-init/support/mat-shared/references/workflow-rules.md`, especially `Task`; do not use `checkpoint` as the primary workflow term.
- Keep each skill explicit, bounded, concise, and independently testable.
- Preserve `policy.allow_implicit_invocation: false` for every personal skill.
- Refer to installed agents through their stable public names: Codex `Software Engineer` and Claude Code `qa-engineer`.
- `mat-discover` performs collaborative, read-only Feature discovery. `mat-feature` converts mutually completed discovery into the confirmed Feature Specification and complete ordered Task set. `mat-build` implements exactly one Task and owns correction routing. `mat-review` owns independent Claude QA and Lead Engineer review. Mat's explicit `mat-next` invocation confirms approval of the unchanged reviewed Task, completes it, and never starts the next build.

## Tooling policy

- Use dependency-light modern JavaScript (`.mjs`) and Node.js for new cross-platform workflow tooling by default.
- Prefer Node built-ins, including `node:test`, before adding npm dependencies.
- Use thin `.cmd`, `.ps1`, or `.sh` launchers only when they materially improve platform ergonomics or integration.
- Do not rewrite working PowerShell tooling merely to change languages; migrate it only when the replacement has equivalent Windows behavior and cross-platform tests.
- Use Node.js exclusively for repository-owned tooling and validation.

## Change discipline

- Read the complete target `SKILL.md` and its directly referenced guidance before editing.
- Keep deterministic, fragile, or repeated operations in tested scripts rather than verbose skill prose.
- Make the smallest approved change and preserve unrelated work.
- Run repository tests and relevant script smoke tests before claiming completion.
- Do not commit, push, publish, install active skills, or alter remote state without Mat's explicit approval.
