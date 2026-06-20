# ddad/docs

This folder is the source of truth for this project under **DDAD — Document-Driven AI Development**.

The core rule: **no implementation without a document.** Code follows docs, not the other way around.

## Structure

| File | Purpose |
|---|---|
| [00-overview.md](./00-overview.md) | What the project is, who it's for, why it exists |
| [01-requirements.md](./01-requirements.md) | Functional and non-functional requirements |
| [02-architecture.md](./02-architecture.md) | System design, components, data flow |
| [03-tasks.md](./03-tasks.md) | Task backlog derived from the documents above |
| [decisions/](./decisions/) | Architecture Decision Records (ADRs) — one significant decision per file |

## Workflow

1. **Write or update a document first.** A new feature starts as a change to `01-requirements.md` (and `02-architecture.md` if it affects design), not as a code diff.
2. **Break it into tasks.** Add entries to `03-tasks.md` referencing the requirement they satisfy.
3. **Let the AI agent implement against the docs.** Agents configured via `CLAUDE.md` / `AGENTS.md` / `.cursorrules` are instructed to read this folder before writing code.
4. **Record non-trivial decisions.** Anything that would make a future contributor ask "why was it done this way?" gets an ADR in `decisions/`.
5. **Keep docs and code in sync.** If an implementation diverges from a document, update the document in the same change — it is the source of truth, not a historical artifact.
