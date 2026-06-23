# Agent Instructions — DDAD (Document-Driven AI Development)

This project follows DDAD: documents in `Docs/` are the source of truth. Code implements what the documents specify — not the other way around.

## Before writing any code

1. Read `Docs/01_product/visao_produto.md` and `Docs/01_product/requisitos_funcionais.md` for product context and the requirement you are implementing. If the task doesn't map to an existing requirement, stop and add/update the requirement first (or ask the user to).
2. Read `Docs/02_architecture/` and `Docs/04_governance/registro_decisoes.md` to check whether a prior decision already constrains your approach. Do not silently contradict a recorded decision — if you believe one should change, record a new decision that supersedes it.
3. Find or create the relevant session under `Docs/05_sessions/` (`ddad session create "<nome>"`) and the block describing the unit of work (`ddad block create "<nome>" --session <sessao>`).

## While implementing

- Work block by block. Each block lives at `Docs/05_sessions/<sessao>/05_blocks/bloco_NN_<nome>.md` and should have its scope, acceptance criteria, and risks filled in before implementation starts.
- Generate the execution prompt for a block with `ddad prompt create --block <bloco> --session <sessao>` when handing work to an agent.
- When a block is done, generate its closure feedback with `ddad feedback create --block <bloco> --session <sessao>` and fill it in — what was built, what changed, what's still pending (P1-P4).
- If you make a decision that would be expensive to reverse, record it in `Docs/04_governance/registro_decisoes.md`.
- Run `ddad validate` to check structural compliance and `ddad audit` to check for orphaned blocks/prompts/feedbacks before considering a session closed.

## What not to do

- Do not implement a feature that has no corresponding requirement in `Docs/01_product/requisitos_funcionais.md`.
- Do not invent architecture that contradicts `Docs/02_architecture/` or a recorded decision without registering a new one.
- Do not treat this file's instructions as optional context — they define the workflow for this repository.
