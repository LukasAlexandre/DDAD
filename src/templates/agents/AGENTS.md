# Agent Instructions — DDAD (Document-Driven AI Development)

This project follows DDAD: documents in `ddad/docs/` are the source of truth. Code implements what the documents specify — not the other way around.

## Before writing any code

1. Read `ddad/docs/00-overview.md` for project context.
2. Read `ddad/docs/01-requirements.md` for the requirement you are implementing. If the task doesn't map to an existing requirement, stop and add/update the requirement first (or ask the user to).
3. Read `ddad/docs/02-architecture.md` and `ddad/docs/decisions/` to check whether a prior decision already constrains your approach. Do not silently contradict an accepted ADR — if you believe one should change, write a new ADR that supersedes it.

## While implementing

- Keep `ddad/docs/03-tasks.md` in sync: update task status as you progress, and reference the task/requirement ID in commit messages or PR descriptions when practical.
- If you make a decision that would be expensive to reverse (a dependency choice, a data model, a public API shape), write an ADR in `ddad/docs/decisions/` using the existing files as a template. Number it sequentially.
- If implementation reveals that a document is wrong, outdated, or ambiguous, update the document in the same change. Do not let code and docs drift.

## What not to do

- Do not implement a feature that has no corresponding requirement in `01-requirements.md`.
- Do not invent architecture that contradicts `02-architecture.md` or an accepted ADR without recording a new decision.
- Do not treat this file's instructions as optional context — they define the workflow for this repository.
