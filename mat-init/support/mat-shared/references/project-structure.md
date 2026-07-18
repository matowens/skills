# Private Project Structure

## Loading order

For every operation:

1. Read the repository-root `AGENTS.md` when present.
2. Read `.mat/AGENTS.md` when present.
3. Read the `.mat/` files routed by `.mat/AGENTS.md` for the current operation.
4. Follow both instruction sets. Treat different areas of concern as complementary. If a genuine conflict cannot be reconciled, stop and ask Mat about that specific conflict.

Never replace, reorganize, or suppress the root `AGENTS.md`.

## Files

- `.mat/AGENTS.md`: concise router, roles, and current-state pointers.
- `.mat/CONTEXT.md`: durable Project Context.
- `.mat/WORKFLOW.md`: durable working rules and role boundaries.
- `.mat/TASKS.md`: current-work surface with the Active Task, lightweight Quick Todos, expanded active Feature groups, and a compact completed-Feature index.
- `.mat/IDEAS.md`: durable project-specific Idea Bin with explicit revisit triggers and preserved closed history.
- `.mat/templates/feature.md`: canonical Feature Specification template.
- `.mat/templates/task.md`: canonical Task Specification template.
- `.mat/templates/retrospective.md`: canonical Feature retrospective template.
- `.mat/features/FFFF-feature-name/FEATURE.md`: shareable Feature Specification in a four-digit, globally sequential lowercase kebab-case feature directory, such as `0001-user-authentication`.
- `.mat/features/FFFF-feature-name/RETROSPECTIVE.md`: one durable Feature retrospective that collects observations during delivery and owns final closure.
- `.mat/features/FFFF-feature-name/tasks/NNN-short-task-name.md`: numbered Task Specifications owned by that feature.
- `.mat/features/FFFF-feature-name/reviews/NNN-short-task-name-qa.md`: optional consolidated raw QA evidence for one Task when the QA-report trial is enabled.

Feature numbers and Task numbers are independently, globally sequential. `mat-feature` assigns each new Feature and its Tasks above the highest known number in their respective sequences. Never reuse, fill a gap in, or renumber an existing Feature or Task ID. Keep each non-complete Feature listed exactly once in the Current Features section of `.mat/TASKS.md` with its lifecycle state and its Tasks in implementation order. Keep every indexed Task state synchronized with its Task Specification. The Active Task section is a pointer to the single current Task and may duplicate that Task's Feature entry. Quick Todos are plain checkboxes for small, unambiguous, localized work and never receive Feature or Task identifiers or separate files. When the retrospective marks a Feature `Complete`, remove its expanded Task group from Current Features and add exactly one Feature link under Completed Features; preserve its detailed Specifications, Work Logs, and retrospective in the Feature directory.

Keep `.mat/` private. Add the exact line `.mat/` to `.git/info/exclude`; do not modify shared `.gitignore` solely for this workflow unless Mat explicitly requests it. Verify an actual `.mat` file is ignored with Git.

## Durable state

`mat-discover` is a deliberately conversational, read-only process. Once Mat and the Lead Engineer agree discovery is sufficient, invoke `mat-feature` in that conversation or provide its complete discovery handoff explicitly. `mat-feature` converts that agreed context into the durable Feature and Task Specifications and creates the Feature retrospective for observations; after those files exist, do not rely on chat history as the only source of state. Update the applicable `.mat` file when an explicitly invoked workflow changes Feature, Task, idea, or project state. Use the Feature grouping and order in `.mat/TASKS.md` to determine which Tasks belong together and what follows. Keep a reviewed Task active until Mat invokes `mat-next` after personal review to confirm approval and reconcile completion. The final `mat-next` moves the Feature to Deployment and prepares its remote review request. Use `mat-retro` only after Mat confirms merge, deployment, and production validation; it then returns the repository to the current target branch, closes the Feature, and routes deferred ideas. Preserve project-specific content during refreshes.
