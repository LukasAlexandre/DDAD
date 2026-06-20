# CLAUDE.md

This project follows **DDAD — Document-Driven AI Development**. The full workflow is defined in [AGENTS.md](./AGENTS.md) — read it first, it applies to you as much as any other agent.

## Claude-specific notes

- Before starting a multi-step task, check `ddad/docs/03-tasks.md` for an existing entry. If one exists, work from it instead of re-deriving scope.
- When you use TodoWrite to plan a task, keep it consistent with `ddad/docs/03-tasks.md` — they describe the same work at different granularity (TodoWrite: this session; `03-tasks.md`: the project backlog).
- If a user asks for a change that isn't backed by a requirement in `ddad/docs/01-requirements.md`, say so before implementing, rather than silently expanding scope.
