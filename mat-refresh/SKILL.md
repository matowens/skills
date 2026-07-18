---
name: mat-refresh
description: Refresh an existing Mat `.mat/` project workflow against the current canonical structure and guidance while preserving project-specific content. Use only when Mat explicitly selects or invokes the `mat-refresh` skill; never invoke it from ordinary conversational language. Do not use to initialize a repository with no `.mat/` workflow.
---

# Refresh the Private Workflow

## Load and compare

1. Read the root `AGENTS.md`, then `.mat/AGENTS.md`, then the full existing `.mat/` structure, Project Idea Bin, and all existing Feature, Task, and retrospective files.
2. Read [project structure](../mat-init/support/mat-shared/references/project-structure.md), [workflow rules](../mat-init/support/mat-shared/references/workflow-rules.md), and every [canonical template](../mat-init/support/mat-shared/templates/).
3. Inspect current repository facts, Git status, configured remotes, target branch conventions, provider CLI availability and authentication status, and `.git/info/exclude`. Compare the source-control facts to Project Context without printing credentials or tokens.
4. Compare the installed workflow's structure and guidance directly against the current canonical templates and references. Detect missing files or sections, outdated terminology, obsolete rules, broken references, missing exclusion, and project facts that changed. Consult the existing Command Map and Known Environment Behaviors before improvising diagnostics.

If `.mat/` is absent, stop and recommend the `mat-init` skill.

## Plan before changing populated files

Resolve only the gaps relevant to this refresh. Derive current facts from the repository first, then ask Mat in small groups only about missing context, contradictions, or conflicts between an intentional customization and the current standard. Do not repeat the complete `mat-init` onboarding interview. Require Mat to confirm newly needed local execution, command, team-workflow, hosting, or delivery facts that cannot be proven from the repository; retain `Unknown` only when Mat explicitly accepts the gap.

Present a concise refresh plan that identifies:

- each file to add or update and the intended change;
- canonical structure or guidance to reconcile;
- project-specific content and customizations that will be preserved;
- unresolved conflicts or decisions;
- any proposed move, rename, deletion, broad rewrite, or other structural change; and
- whether a recovery snapshot is required.

Wait for Mat's explicit approval of that plan. Do not modify `.mat/`, `.git/info/exclude`, or any other file before approval.

## Protect material structural changes

If the approved plan includes moves, renames, deletions, broad rewrites of populated files, or another material structural change, create a timestamped recovery copy of the complete existing `.mat/` directory outside the repository before applying changes. Verify that the copy is readable, report its location, and do not delete it automatically. Do not create a recovery copy for purely additive or narrowly targeted changes unless Mat requests one.

## Apply an incremental refresh

- Add missing canonical files and sections.
- Reconcile `.mat/AGENTS.md` and `.mat/WORKFLOW.md` with current role, routing, state, and safety rules while preserving approved project-specific additions.
- Add missing `.mat/CONTEXT.md` sections and populate them only with verified repository facts or Mat's confirmed answers. Preserve existing confirmed facts and never replace populated context wholesale. Reconcile GitLab or GitHub provider, remote, target branch, `glab` or `gh` readiness, Mat's assignee identity, review-request conventions, and final `mat-next` authority; retain explicit Unknowns when they cannot be safely verified.
- Preserve recurring, verified environment lessons and their dependable fallbacks. Add a new behavior only when it is confirmed and costly enough to avoid rediscovering; distinguish optional capabilities from required project tooling.
- Preserve every Feature and Task identifier, Feature Specification, Task membership, order, state, specification content, Work Log, Quick Todo, retrospective, and Idea Bin entry. Apply Feature-directory, Task-directory, or `.mat/TASKS.md` structural changes only when they were explicitly included in the approved plan.
- Reconcile `.mat/templates/feature.md`, `.mat/templates/task.md`, and `.mat/templates/retrospective.md` for future artifacts without silently discarding an intentional project customization. Add `.mat/IDEAS.md` when missing without fabricating ideas.
- Never blindly replace `CONTEXT.md`, `TASKS.md`, existing Feature or Task Specifications, or customized rules.
- Ensure `.mat/` is listed in `.git/info/exclude`; do not change shared `.gitignore` solely for this workflow.
- Never change the root `AGENTS.md`, discard uncommitted work, create a worktree, or commit changes.

## Verify and report

Re-read the complete refreshed `.mat/` directory. Confirm that only approved changes were applied, required files and sections exist, internal links resolve, the Task index agrees with every Feature and Task Specification, project context and customizations were preserved, the root `AGENTS.md` is unchanged, and `git check-ignore -v .mat/AGENTS.md` succeeds. Report added and updated items, preserved content, accepted unknowns, unresolved differences, verification evidence, and the recovery-copy location when one was created.
