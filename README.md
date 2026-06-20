# DDAD — Document-Driven AI Development

DDAD is a lightweight methodology and CLI for keeping AI coding agents aligned with a project's intent. Instead of letting an agent infer scope from a prompt and the existing code, DDAD makes **documents the source of truth**: requirements, architecture, and decisions are written down first, and agents are configured to read and update them as they work.

## Why

AI agents are good at writing code and bad at remembering *why* it was written that way. Without a persistent, structured record of intent, every session re-derives context from scratch — and drifts a little further from the original design each time. DDAD fixes this by giving agents (and humans) a small, conventional set of documents to read before changing anything, and to update as part of every change.

## Quick start

```bash
npx ddad init
```

This scaffolds the following into your current project:

```
your-project/
├── ddad/
│   └── docs/
│       ├── README.md              # how this folder works
│       ├── 00-overview.md         # what the project is, who it's for
│       ├── 01-requirements.md     # functional & non-functional requirements
│       ├── 02-architecture.md     # system design
│       ├── 03-tasks.md            # task backlog, traced to requirements
│       └── decisions/             # Architecture Decision Records (ADRs)
├── CLAUDE.md                      # rules for Claude Code
├── AGENTS.md                      # provider-agnostic agent rules
├── .cursorrules                   # rules for Cursor
└── ddad.config.json
```

Existing files are never overwritten unless you pass `--force`.

## CLI reference

```
ddad init [--dir <path>] [--force]
ddad --help
ddad --version
```

| Option | Description |
|---|---|
| `--dir <path>` | Target directory to scaffold into (default: current directory) |
| `--force` | Overwrite files that already exist |

## The workflow

1. **Write the document first.** A new feature starts as an edit to `ddad/docs/01-requirements.md`, not as a code diff.
2. **Break it into tasks.** Tasks in `ddad/docs/03-tasks.md` reference the requirement they satisfy.
3. **Let the agent implement against the docs.** `CLAUDE.md`, `AGENTS.md`, and `.cursorrules` instruct any agent to read `ddad/docs/` before writing code.
4. **Record decisions that are expensive to reverse.** These go in `ddad/docs/decisions/` as ADRs.
5. **Keep docs and code in sync.** If an implementation diverges from a document, the document is updated in the same change.

See [ddad/docs/README.md](./src/templates/docs/README.md) for the full description of this workflow as it ships to scaffolded projects.

## Project status

This is the initial scaffold (`v0.1.0`) of the DDAD CLI: `init` is implemented, templates are in place, no other commands exist yet. Expect the document templates and agent rule files to evolve as the methodology is used on real projects.

## License

MIT — see [LICENSE](./LICENSE).
