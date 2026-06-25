# CLAUDE.md

This project follows **DDAT — Document-Driven AI Tools**. The full workflow is defined in [AGENTS.md](./AGENTS.md) — read it first, it applies to you as much as any other agent. Methodology details: `Docs/00_ddat/metodologia.md` and `Docs/00_ddat/regras_ddat.md`.

## Claude-specific notes

- Before starting a multi-step task, check `Docs/05_sessions/<sessao>/05_blocks/` for an existing block describing it. If one exists, work from it instead of re-deriving scope. If one doesn't exist and the task is non-trivial, create it first (`ddat block create`).
- When you use TodoWrite to plan a task, keep it consistent with the active block — they describe the same work at different granularity (TodoWrite: this tool call sequence; block file: the documented unit of work).
- If a user asks for a change that isn't backed by a requirement in `Docs/01_product/requisitos_funcionais.md`, say so before implementing, rather than silently expanding scope.
- Respect `Docs/03_contracts/` and `Docs/07_design_system/` by default; treat changing either as a decision to surface, not a side effect of an unrelated task.
- Register pendencies you find using the P1–P4 scale (`Docs/00_ddat/metodologia.md`, section 12) in the block's feedback — don't leave them only in chat output.
- Never run `git commit`, `git push`, or any destructive git command without explicit confirmation from the user for that specific action — a suggested commit message in a feedback/prompt file is not pre-approval.
- Use `ddat validate` / `ddat audit` to sanity-check the `Docs/` structure after generating or editing session/block/prompt/feedback files.
