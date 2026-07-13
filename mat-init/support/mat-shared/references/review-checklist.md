# Review Checklist

Review only the relevant Task or diff unless Mat requests a broader audit. Establish the baseline explicitly.

## Specification

- Map every Acceptance Criterion to implementation and test evidence.
- Identify missing required behavior and added out-of-scope behavior.
- Verify Non-Goals, Edge Cases, documentation, and release considerations.
- Judge whether tests prove behavior rather than mirror implementation details.

## Quality and release readiness

- Dead, abandoned, unreachable, duplicate, or temporary debugging code.
- Unused files, imports, classes, configuration, dependencies, or tests.
- Misleading naming, comments, or documentation.
- Unnecessary abstraction, indirection, and project-convention violations.
- Correctness, regression, security, performance, migration, rollback, configuration, and compatibility risks when relevant.

Do not create findings merely because another style or architecture is possible, fewer files might look cleaner, or hypothetical generalization could be useful.

Every finding must state classification (`Blocking`, `Important`, or `Optional`), evidence, impact, and the required correction or recommendation.
