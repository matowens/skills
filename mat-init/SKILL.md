---
name: mat-init
description: Initialize Mat's private, project-scoped `.mat/` development workflow through repository inspection, a required context interview, generated documentation, and verification. Use only when Mat explicitly selects or invokes the `mat-init` skill; never invoke it from ordinary conversational language. Do not use when a populated `.mat/` already exists—recommend the `mat-refresh` skill instead.
---

# Initialize the Private Workflow

## Load instructions and inspect

1. Read the root `AGENTS.md` when present. Never change it.
2. If `.mat/AGENTS.md` exists, read it and inspect the full `.mat/` structure. Stop and recommend the `mat-refresh` skill unless initialization is clearly incomplete and safe to resume.
3. Read [project structure](support/mat-shared/references/project-structure.md), [workflow rules](support/mat-shared/references/workflow-rules.md), and every file in [canonical templates](support/mat-shared/templates/).
4. Inspect repository structure, documentation, language/framework, build and test tooling, Git status, and relevant local development configuration.

## Establish Project Context

Derive reliable facts from repository instructions, documentation, configuration, and code. Treat those findings as proposed context for Mat to confirm, not as a substitute for the interview.

Conduct a required, adaptive interview before initialization. Ask a small coherent group at a time, wait for Mat's answers, summarize what changed, and continue only with applicable gaps. Cover:

1. Project purpose, users or stakeholders, business role, current state and direction, constraints, and Non-Goals.
2. Local development: host requirements, Docker or other orchestration, startup and shutdown, service or container names, runtime versions, local URLs, required configuration, and whether each command runs on the host or inside a specific service or container.
3. Exact command map: dependency installation, framework CLI commands such as Artisan, targeted and full tests, formatting, static analysis, frontend tooling, builds, migrations, and other routine project operations. Record the working directory and complete invocation rather than a shorthand command that would fail from the host.
4. Team and delivery: work tracker, mapping between this workflow's Feature and Task terms and the team's agile terminology, branch and pull-request expectations, human review or Definition of Done, CI, hosting environments, deployment, release, and rollback practices.
5. Project-specific safety, data, access, integration, or operational risks that future feature work must know.

Do not ask Mat to repeat low-risk facts that the repository establishes clearly. Do ask for confirmation when local execution, container selection, credentials or access, delivery behavior, or team process cannot be proven from files. Before writing the final context, present a concise summary of `Verified`, `Confirmed by Mat`, and `Unknown` facts. Require Mat to confirm or correct the Local Development Environment, Command Map, Team Workflow and Terminology, and Hosting and Delivery sections; allow an item to remain `Unknown` only when Mat explicitly accepts that gap.

## Initialize

1. Run `node scripts/init_project.mjs --repo <repository-root>` from this skill directory. Use `--resume-incomplete` only after verifying that the existing `.mat/` is an incomplete initialization; it creates missing files without overwriting existing ones.
2. Update every section of the generated `.mat/CONTEXT.md` with verified repository facts and Mat's confirmed answers. Preserve the execution boundary and exact invocation for every important command. Keep explicitly accepted unresolved facts marked `Unknown`.
3. Keep `.mat/AGENTS.md` concise.
4. Do not modify `.gitignore` solely for this workflow. Do not create a worktree.

## Verify and report

Confirm every required file exists, the root `AGENTS.md` is unchanged, `.git/info/exclude` contains `.mat/`, and `git check-ignore -v .mat/AGENTS.md` succeeds. Re-read `.mat/CONTEXT.md` and verify that it preserves Mat's confirmed environment, commands, team terminology, and delivery facts without contradiction. Report created files, verified context, explicitly accepted unknowns, and any safe follow-up. Do not commit the workflow.
