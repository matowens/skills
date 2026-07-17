---
name: mat-discover
description: Conduct thorough, collaborative, read-only discovery for one proposed feature without creating specifications, Tasks, plans, or project files. Use only when Mat explicitly selects or invokes `mat-discover`; never invoke it from ordinary conversational language. Do not use when Mat wants a durable Feature plan or implementation.
---

# Discover a Proposed Feature

## Load context

1. Read the root `AGENTS.md`, `.mat/AGENTS.md`, and every file it routes for discovery, including `.mat/CONTEXT.md`, `.mat/WORKFLOW.md`, `.mat/TASKS.md`, and relevant existing Feature and Task Specifications.
2. Read [project structure](../mat-init/support/mat-shared/references/project-structure.md) and [workflow rules](../mat-init/support/mat-shared/references/workflow-rules.md).
3. Ask what problem or opportunity Mat wants to explore. Inspect relevant code, documentation, framework capabilities, and project conventions when repository awareness will sharpen the discussion.

If `.mat/` is absent or incomplete enough to prevent informed discovery, explain the gap and recommend `mat-init` or `mat-refresh`.

## Collaborate without rushing

Treat discovery as a working session between equal contributors. Mat contributes product intent, business context, priorities, and decisions. The Lead Engineer contributes technical judgment, repository evidence, alternatives, risks, questions, and respectful challenges. Neither participant merely interviews or approves the other.

Ask small, coherent groups of relevant questions. Explore only applicable dimensions: business purpose, stakeholders, intended outcome, current and proposed behavior, scope, Non-Goals, user flow, data, persistence, permissions, failure behavior, Edge Cases, security, performance, compatibility, migration, testing, delivery, and release implications.

Challenge vague terminology, contradictions, and hidden assumptions. Distinguish confirmed facts from assumptions and suggestions. Periodically summarize the shared understanding under `Decided`, `Assumed`, `Unresolved`, and `Out of scope` so Mat can correct, expand, or challenge it.

Do not create or modify any file, allocate a Feature or Task identifier, write a Feature or Task Specification, update `.mat/TASKS.md`, decompose implementation work, select exact implementation files, modify production code or tests, or invoke the Software Engineer or QA Engineer. Discovery remains conversational and read-only.

## Reach shared readiness

1. When the Lead Engineer believes all relevant dimensions have been explored and no material ambiguity is being overlooked, propose that discovery is complete. Explain why the feature appears ready and identify any known assumptions, low-impact unknowns, or deliberately deferred matters.
2. Ask Mat whether that assessment matches his understanding. Do not treat the proposal, silence, or a conversational summary as unilateral completion.
3. If either Mat or the Lead Engineer identifies a meaningful gap, continue discovery around that gap and revisit readiness collaboratively.
4. When both agree discovery is sufficient, provide a structured conversational handoff containing the problem or opportunity, desired outcome, users and stakeholders, current and proposed behavior, Scope, Non-Goals, requirements and business rules, important flows, data and permissions, Edge Cases and failure behavior, constraints and dependencies, success criteria, testing expectations, delivery considerations, decisions, assumptions, and any accepted open questions.
5. If Mat pauses before shared readiness, summarize the current understanding and unresolved topics without presenting discovery as complete.

After mutual agreement, recommend invoking `mat-feature` in the current conversation so it can turn the discovery handoff into the durable Feature Specification and ordered Task set. Do not invoke it or begin planning automatically.
