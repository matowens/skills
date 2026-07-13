---
name: mat-init
description: Initialize Mat's private, project-scoped `.mat/` development workflow in a Git repository. Use only when Mat explicitly selects or invokes the `mat-init` skill; never invoke it from ordinary conversational language. Do not use when a populated `.mat/` already exists—recommend the `mat-refresh` skill instead.
---

# Initialize the Private Workflow

## Load instructions and inspect

1. Read the root `AGENTS.md` when present. Never change it.
2. If `.mat/AGENTS.md` exists, read it and inspect the full `.mat/` structure. Stop and recommend the `mat-refresh` skill unless initialization is clearly incomplete and safe to resume.
3. Read [project structure](support/mat-shared/references/project-structure.md), [workflow rules](support/mat-shared/references/workflow-rules.md), and every file in [canonical templates](support/mat-shared/templates/).
4. Inspect repository structure, documentation, language/framework, build and test tooling, Git status, and relevant local development configuration.

## Establish Project Context

Derive reliable facts from the repository. Ask Mat only for missing purpose, users, business role, direction, constraints, non-goals, or other meaningful context. Ask a small coherent group at a time. Mark unknowns explicitly; never invent them.

## Initialize

1. Run `python scripts/init_project.py --repo <repository-root>` from this skill directory. Use `--resume-incomplete` only after verifying that the existing `.mat/` is an incomplete initialization; it creates missing files without overwriting existing ones.
2. Update the generated `.mat/CONTEXT.md` with verified repository facts and Mat's answers. Keep unresolved facts marked `Unknown`.
3. Keep `.mat/AGENTS.md` concise and retain `workflow_version: 1`.
4. Do not modify `.gitignore` solely for this workflow. Do not create a worktree.

## Verify and report

Confirm every required file exists, the root `AGENTS.md` is unchanged, `.git/info/exclude` contains `.mat/`, and `git check-ignore -v .mat/AGENTS.md` succeeds. Report created files, verified context, unresolved context, and any safe follow-up. Do not commit the workflow.
