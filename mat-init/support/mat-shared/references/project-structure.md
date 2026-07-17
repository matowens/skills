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
- `.mat/TASKS.md`: central Task index, grouped by feature, with implementation order and current state for every Task.
- `.mat/templates/feature.md`: canonical Feature Specification template.
- `.mat/templates/task.md`: canonical Task Specification template.
- `.mat/features/FFFF-feature-name/FEATURE.md`: shareable Feature Specification in a four-digit, globally sequential lowercase kebab-case feature directory, such as `0001-user-authentication`.
- `.mat/features/FFFF-feature-name/tasks/NNN-short-task-name.md`: numbered Task Specifications owned by that feature.

Feature numbers and Task numbers are independently, globally sequential. `mat-feature` assigns each new Feature and its Tasks above the highest known number in their respective sequences. Never reuse, fill a gap in, or renumber an existing Feature or Task ID. Keep each Feature listed exactly once in `.mat/TASKS.md` with a link to its Feature Specification and its `Draft` or `Ready for Tasking` status. Keep each Task listed exactly once beneath its Feature with an inline state matching its Task Specification. The Active Task section is a pointer to the single current Task and may duplicate that Task's Feature entry.

Keep `.mat/` private. Add the exact line `.mat/` to `.git/info/exclude`; do not modify shared `.gitignore` solely for this workflow unless Mat explicitly requests it. Verify an actual `.mat` file is ignored with Git.

## Durable state

`mat-discover` is a deliberately conversational, read-only process. Once Mat and the Lead Engineer agree discovery is sufficient, invoke `mat-feature` in that conversation or provide its complete discovery handoff explicitly. `mat-feature` converts that agreed context into the durable Feature and Task Specifications; after those files exist, do not rely on chat history as the only source of feature or project state. Update the applicable `.mat` file when an explicitly invoked workflow changes Feature, Task, or project state. Use the feature grouping and order in `.mat/TASKS.md` to determine which Tasks belong together and what follows. Keep a reviewed Task active until Mat invokes `mat-next` after personal review to confirm approval and reconcile completion. Preserve project-specific content during refreshes.
