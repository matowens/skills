# Private Project Structure

Use workflow version `1`.

## Loading order

For every operation:

1. Read the repository-root `AGENTS.md` when present.
2. Read `.mat/AGENTS.md` when present.
3. Read the `.mat/` files routed by `.mat/AGENTS.md` for the current operation.
4. Follow both instruction sets. Treat different areas of concern as complementary. If a genuine conflict cannot be reconciled, stop and ask Mat about that specific conflict.

Never replace, reorganize, or suppress the root `AGENTS.md`.

## Files

- `.mat/AGENTS.md`: concise router, roles, workflow version, and current-state pointers.
- `.mat/CONTEXT.md`: durable Project Context.
- `.mat/WORKFLOW.md`: durable working rules and role boundaries.
- `.mat/TASKS.md`: minimal index of active, ready, future, and completed tasks.
- `.mat/tasks/_template.md`: canonical Task Specification template.
- `.mat/tasks/NNN-short-task-name.md`: numbered Task Specifications.

Keep `.mat/` private. Add the exact line `.mat/` to `.git/info/exclude`; do not modify shared `.gitignore` solely for this workflow unless Mat explicitly requests it. Verify an actual `.mat` file is ignored with Git.

## Durable state

Do not rely on chat history as the only source of project state. Update the applicable `.mat` file when an explicitly invoked workflow changes task or project state. Preserve project-specific content during refreshes.
