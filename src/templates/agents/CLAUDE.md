# CLAUDE.md

This project follows **DDAD — Document-Driven AI Development**. The full workflow is defined in [AGENTS.md](./AGENTS.md) — read it first, it applies to you as much as any other agent.

## Claude-specific notes

- Before starting a multi-step task, check `Docs/05_sessions/<sessao>/05_blocks/` for an existing block describing it. If one exists, work from it instead of re-deriving scope.
- When you use TodoWrite to plan a task, keep it consistent with the active block — they describe the same work at different granularity (TodoWrite: this tool call sequence; block file: the documented unit of work).
- If a user asks for a change that isn't backed by a requirement in `Docs/01_product/requisitos_funcionais.md`, say so before implementing, rather than silently expanding scope.
- Use `ddad validate` / `ddad audit` to sanity-check the `Docs/` structure after generating or editing session/block/prompt/feedback files.
