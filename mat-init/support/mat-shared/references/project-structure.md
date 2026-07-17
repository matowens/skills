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
- `.mat/tasks/_template.md`: canonical Task Specification template.
- `.mat/tasks/FFFF-feature-name/NNN-short-task-name.md`: numbered Task Specifications grouped into four-digit, globally sequential feature directories with lowercase kebab-case names, such as `0001-user-authentication`.

Feature numbers and Task numbers are independently, globally sequential. Assign each new feature one above the highest known feature number. Never reuse, fill a gap in, or renumber an existing Feature or Task ID. Keep each Task listed exactly once under its feature in `.mat/TASKS.md`, with an inline state matching its Task Specification. The Active Task section is a pointer to the single current Task and may duplicate that Task's feature entry.

Keep `.mat/` private. Add the exact line `.mat/` to `.git/info/exclude`; do not modify shared `.gitignore` solely for this workflow unless Mat explicitly requests it. Verify an actual `.mat` file is ignored with Git.

## Durable state

Do not rely on chat history as the only source of project state. Update the applicable `.mat` file when an explicitly invoked workflow changes task or project state. Use the feature grouping and order in `.mat/TASKS.md` to determine which Tasks belong together and what follows. Keep a reviewed Task active until Mat explicitly approves it, then use `mat-next` to reconcile completion. Preserve project-specific content during refreshes.
