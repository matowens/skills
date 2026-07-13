---
name: mat-refresh
description: Refresh an existing Mat `.mat/` project workflow to the current canonical version while preserving project-specific content. Use only when Mat explicitly selects or invokes the `mat-refresh` skill; never invoke it from ordinary conversational language. Do not use to initialize a repository with no `.mat/` workflow.
---

# Refresh the Private Workflow

## Load and compare

1. Read the root `AGENTS.md`, then `.mat/AGENTS.md`, then the full existing `.mat/` structure and all existing Task files.
2. Read [project structure](../mat-init/support/mat-shared/references/project-structure.md), [workflow rules](../mat-init/support/mat-shared/references/workflow-rules.md), and every [canonical template](../mat-init/support/mat-shared/templates/).
3. Inspect current repository facts, Git status, and `.git/info/exclude`.
4. Compare the installed workflow version and content to version `1`. Detect missing files or sections, outdated terminology, obsolete rules, broken references, missing exclusion, and project facts that changed.

If `.mat/` is absent, stop and recommend the `mat-init` skill.

## Plan before changing populated files

Present a concise plan covering additions, safe canonical updates, preserved customizations, and unresolved differences. Ask Mat only for context that cannot be derived or for a true conflict between intentional customization and the current standard. Do not modify populated files before presenting this plan.

## Apply an incremental refresh

- Add missing files or sections from the canonical templates.
- Upgrade workflow versions incrementally; version `1` establishes the structure and terminology in the shared references.
- Preserve project-specific facts, task index state, Task files, work logs, and intentional workflow customizations.
- Never blindly replace `CONTEXT.md`, `TASKS.md`, existing Task Specifications, or customized rules.
- Update canonical wording only where it does not erase an intentional decision.
- Ensure `.mat/` is listed in `.git/info/exclude`; do not change shared `.gitignore` solely for this workflow.
- Never change the root `AGENTS.md`, discard uncommitted work, create a worktree, or commit changes.

## Verify and report

Check internal references, required sections, `workflow_version: 1`, preserved task files, and `git check-ignore -v .mat/AGENTS.md`. Report added items, updated items, preserved customizations, unresolved differences, and verification evidence.
