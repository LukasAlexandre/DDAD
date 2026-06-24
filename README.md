# DDAD — Document-Driven AI Development

DDAD is a lightweight methodology and CLI for keeping AI coding agents aligned with a project's intent. Instead of letting an agent infer scope from a prompt and the existing code, DDAD makes **documents the source of truth**: product vision, architecture, contracts, governance, and session-by-session work are written down first, and agents are configured to read and update them as they work.

## Why

AI agents are good at writing code and bad at remembering *why* it was written that way. Without a persistent, structured record of intent, every session re-derives context from scratch — and drifts a little further from the original design each time. DDAD fixes this by giving agents (and humans) a conventional set of documents to read before changing anything, and to update as part of every change.

## Quick start

```bash
npx ddad init
```

This scaffolds the official DDAD structure into your current project:

```
your-project/
├── Docs/
│   ├── 00_ddad/                # methodology, rules, folder schema, glossary
│   ├── 01_product/             # vision, solution, audience, requirements
│   ├── 02_architecture/        # base architecture, stack, decisions, risks
│   ├── 03_contracts/           # frontend/backend, database, auth, env, deploy contracts
│   ├── 04_governance/          # code/commit/branch conventions, risk matrix, decisions log
│   ├── 05_sessions/            # one folder per session (see below)
│   │   ├── session_01_project_foundation/
│   │   ├── session_02_architecture_contracts/
│   │   ├── session_03_design_system/
│   │   ├── session_04_core_features/
│   │   ├── session_05_auth_security/
│   │   ├── session_06_tests_quality/
│   │   ├── session_07_performance/
│   │   ├── session_08_deploy_release/
│   │   ├── session_09_observability/
│   │   └── session_10_final_audit/
│   ├── 06_quality_gates/        # architecture/security/tests/performance/design/deploy/final_audit gates
│   ├── 07_design_system/        # visual identity, tokens, components, responsiveness, accessibility
│   ├── 08_deploy/               # local/homolog/production deploy notes, troubleshooting
│   ├── 09_observability/        # logs, metrics, monitoring, incidents
│   └── 99_archive/              # superseded documents
├── CLAUDE.md                    # rules for Claude Code
├── AGENTS.md                    # provider-agnostic agent rules
├── .cursorrules                 # rules for Cursor
└── ddad.config.json
```

> The 10 sessions above are a **base starting point, not a limit**. Create as many additional sessions as your project needs with `ddad session create`.

Each session contains the same internal structure: `01_intake`, `02_analysis`, `03_ideas`, `04_planning`, `05_blocks`, `06_prompts`, `07_bugs`, `08_feedbacks`, `09_validation`, `10_tests`, `11_security`, `12_performance`, `13_release`, plus a root `README.md`.

Existing files are never overwritten unless you pass `--force`.

## CLI reference

```
ddad init [--dir <path>] [--force]
ddad session create "<name>" [--dir <path>] [--force]
ddad block create "<name>" --session <session> [--dir <path>] [--force]
ddad prompt create --block <block> --session <session> [--dir <path>] [--force]
ddad feedback create --block <block> --session <session> [--dir <path>] [--force]
ddad validate [--dir <path>]
ddad audit [--dir <path>]
ddad --help
ddad --version
```

| Option | Description |
|---|---|
| `--dir <path>` | Target directory to operate in (default: current directory) |
| `--force` | Overwrite files that already exist |

### Examples

Create a new session (auto-numbered, name converted to snake_case):

```bash
npx ddad session create "dashboard admin"
# -> Docs/05_sessions/session_11_dashboard_admin/
```

Create the next block inside that session:

```bash
npx ddad block create "login administrativo" --session session_11_dashboard_admin
# -> Docs/05_sessions/session_11_dashboard_admin/05_blocks/bloco_01_login_administrativo.md
```

Generate the prompt for that block:

```bash
npx ddad prompt create --block bloco_01_login_administrativo --session session_11_dashboard_admin
# -> Docs/05_sessions/session_11_dashboard_admin/06_prompts/prompt_bloco_01_login_administrativo.md
```

Generate the feedback doc once the block is implemented:

```bash
npx ddad feedback create --block bloco_01_login_administrativo --session session_11_dashboard_admin
# -> Docs/05_sessions/session_11_dashboard_admin/08_feedbacks/feedback_bloco_01_login_administrativo.md
```

Check that the `Docs/` structure is compliant (exit code `0` if OK, `1` if failed):

```bash
npx ddad validate
```

Audit for orphaned/incomplete sessions, blocks, prompts, and feedbacks:

```bash
npx ddad audit
```

## The workflow

1. **Write the document first.** A new feature starts as an edit to `Docs/01_product/requisitos_funcionais.md`, not as a code diff.
2. **Work session by session, block by block.** Each unit of work is a block inside a session (`ddad block create`), with a generated prompt (`ddad prompt create`) and a closing feedback doc (`ddad feedback create`).
3. **Let the agent implement against the docs.** `CLAUDE.md`, `AGENTS.md`, and `.cursorrules` instruct any agent to read `Docs/` before writing code.
4. **Record decisions that are expensive to reverse.** These go in `Docs/04_governance/registro_decisoes.md`.
5. **Validate and audit regularly.** `ddad validate` checks structural compliance; `ddad audit` flags orphaned or incomplete work.
6. **Keep docs and code in sync.** If an implementation diverges from a document, the document is updated in the same change.

See `Docs/00_ddad/metodologia.md` for the full description of this workflow as it ships to scaffolded projects.

## Official templates

Every file `ddad` generates comes from a template in `src/templates/`. These aren't empty headers — each one ships with guiding questions, fill-in instructions, checklists, and (where useful) tables and examples, so a human or an AI agent has enough to act on without inventing structure on the spot. This applies across the board: product/architecture/contract/governance/design-system/deploy/observability docs in `Docs/`, the session skeleton (`05_sessions/<sessao>/`), the block/prompt/feedback/validation templates, the seven quality gates, and the agent rule files (`CLAUDE.md`, `AGENTS.md`, `.cursorrules`).

Templates share a consistent placeholder convention, rendered automatically at generation time:

| Placeholder | Filled with |
|---|---|
| `{{PROJECT_NAME}}` | Name of the target directory (`--dir`) |
| `{{CURRENT_DATE}}` | Generation date, `YYYY-MM-DD` |
| `{{SESSION_NUMBER}}` / `{{SESSION_TITLE}}` / `{{SESSION_SLUG}}` | Session metadata |
| `{{BLOCK_NUMBER}}` / `{{BLOCK_TITLE}}` / `{{BLOCK_SLUG}}` | Block metadata |

`{{NEXT_BLOCK}}` is reserved but intentionally not auto-rendered — there's no reliable way to know the next block's name when the current one is created. Fill it in by hand when you know it; see `Docs/00_ddad/glossario.md`.

## The full loop

DDAD is documentation + prompts + implementation + feedback + audit + validation — not just a folder generator. A block isn't done when the code works; it's done when:

1. The block document (`05_blocks/`) describes scope and acceptance criteria.
2. The prompt (`06_prompts/`) was generated and used to drive implementation.
3. The implementation matches what the block and prompt describe (or deviations were reported, not silently absorbed).
4. The feedback (`08_feedbacks/`) records what actually happened, including pendencies classified P1–P4.
5. `ddad validate` and `ddad audit` pass against the current `Docs/` structure.
6. The block's validation (status: approved / approved with caveats / rejected / blocked) decides whether the next block is released.

## Project status

`v0.1.0` of the DDAD CLI implements `init`, `session create`, `block create`, `prompt create`, `feedback create`, `validate`, and `audit`. As of this version, the official templates (`Docs/` content, session skeleton, block/prompt/feedback/validation templates, quality gates, and agent rule files) were substantially rewritten for documentation quality — not just structural placeholders, but content that guides real execution for both humans and AI agents (Claude Code, Codex, Cursor, Copilot). No new CLI commands were introduced in this pass; expect future versions to keep refining templates and rules as the methodology is used on real projects.

## License

MIT — see [LICENSE](./LICENSE).
