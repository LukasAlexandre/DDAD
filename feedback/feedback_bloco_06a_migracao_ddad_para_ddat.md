# Feedback — Bloco 06A — Migração de identidade DDAD para DDAT

## Status

Concluído.

## Resumo

O Bloco 06A migrou a identidade do projeto de **DDAD** (Document-Driven AI Development) para **DDAT** (Document-Driven AI Tools), motivado pelo bloqueio do nome `ddad` no registro npm por similaridade com pacotes existentes. A migração cobriu `package.json`, o binário do CLI, o texto de ajuda e mensagens de comando, todos os templates oficiais (incluindo a renomeação da pasta `Docs/00_ddad/` para `Docs/00_ddat/` e do arquivo `regras_ddad.md` para `regras_ddat.md`), o `README.md` principal e o `.gitignore`. Nenhuma funcionalidade do CLI foi alterada além do necessário para o rename; `init`, `validate` e `audit` foram revalidados de ponta a ponta sob o novo nome. O histórico dos Blocos 00–05 (sessões e feedbacks) foi preservado sem reescrita. Nenhuma publicação real no npm foi executada neste bloco.

## Nome anterior

`ddad` — Document-Driven AI Development.

## Nome novo

`ddat` — Document-Driven AI Tools.

## Motivo

O nome `ddad` foi bloqueado pelo npm por similaridade com pacotes existentes durante a tentativa de publicação no Bloco 06. A alternativa escolhida foi DDAT, com significado oficial Document-Driven AI Tools.

## Arquivos alterados/criados

**Alterados (rename + conteúdo):**
- `package.json` (`name`, `bin`, `description`, `scripts.start`, `keywords`)
- `bin/ddad.js` → `bin/ddat.js` (git mv; shebang e lógica preservados)
- `src/cli.js`
- `src/commands/{init,validate,audit,block,session}.js`
- `src/utils/{markdown-checks.js,session.js}`
- `src/templates/agents/{cursorrules,CLAUDE.md,AGENTS.md}`
- `src/templates/{prompt/prompt_template.md,block/bloco_template.md,validation/validacao_template.md,feedback/feedback_template.md}`
- `src/templates/session/{05_blocks/README.md,06_prompts/README.md,08_feedbacks/README.md,09_validation/fechamento_sessao.md}`
- `src/templates/docs_root/{02_architecture/estrutura_projeto.md,04_governance/convencoes_commits.md}`
- `src/templates/quality_gates/final_audit_gate.md`
- `src/templates/docs_root/00_ddad/` → `src/templates/docs_root/00_ddat/` (git mv da pasta; conteúdo de `folder_schema.md`, `glossario.md`, `metodologia.md` atualizado)
- `src/templates/docs_root/00_ddad/regras_ddad.md` → `src/templates/docs_root/00_ddat/regras_ddat.md` (git mv do arquivo)
- `README.md` (rebranding completo + nota de migração)
- `.gitignore` (adicionada entrada `tmp_ddat_*/`)

**Criados:**
- `docs/sessions/session_06_autenticacao_npm_publicacao_oficial_ddad_cli/migracao_ddad_para_ddat.md`
- `feedback/feedback_bloco_06a_migracao_ddad_para_ddat.md` (este arquivo)

**Preservados sem alteração (histórico):**
- `docs/sessions/session_00_framework_base/`, `session_01_expandir_estrutura_oficial_cli/`, `session_02_templates_oficiais_ddad/`, `session_03_reforco_validacao_auditoria_ddad/`, `session_04_empacotamento_distribuicao_inicial_ddad_cli/`, `session_05_versionamento_publicacao_controlada_ddad_cli/`, `session_06_autenticacao_npm_publicacao_oficial_ddad_cli/README.md`
- `feedback/feedback_bloco_00_framework_base.md` a `feedback_bloco_05_versionamento_publicacao_controlada_ddad_cli.md`

## Validações executadas

- `git status --short --branch` — branch `main`, sincronizado com `origin/main` antes do bloco.
- `npm pkg get name` — `"ddat"`.
- `npm pkg get bin` — `{"ddat": "./bin/ddat.js"}`.
- `node bin/ddat.js --help` — OK, exibe ajuda com branding DDAT.
- `node bin/ddat.js init --dir ./tmp_ddat_final` — OK, 259 arquivos criados, incluindo `Docs/00_ddat/` e `ddat.config.json`.
- `node bin/ddat.js validate --dir ./tmp_ddat_final` — OK, `Status: OK`, `Errors: 0`, `[DDAT validate] Quality gates: OK`.
- `node bin/ddat.js audit --dir ./tmp_ddat_final` — OK, `Status: OK`, `Errors: 0`, 7 warnings esperados (gates recém-gerados com status `Pendente`).
- Diretório `./tmp_ddat_final` removido após os testes.
- `npm view ddat name version` — `404 Not Found`, indicando que o nome `ddat` aparenta estar disponível no registro npm.
- Grep recursivo case-insensitive por `ddad` em `src/` após a migração — nenhuma ocorrência restante.

## Resultado do empacotamento

`npm pack --dry-run` aprovado: pacote `ddat@0.1.0`, 91 arquivos, 57.6 kB comprimido / 181.7 kB descomprimido, arquivo `ddat-0.1.0.tgz`. `bin/ddat.js` presente corretamente no conteúdo do tarball, sem aviso de bin inválido neste modo.

## Publicação npm

**Publicação real não executada neste bloco.**

`npm publish --dry-run` foi executado e concluído como dry-run (`Publishing to https://registry.npmjs.org/ with tag latest and default access (dry-run)` / `+ ddat@0.1.0`), confirmando que o pacote `ddat@0.1.0` está pronto para publicação futura. Foi observado o mesmo aviso cosmético já investigado no Bloco 06 (`"bin[ddat]" script name bin/ddat.js was invalid e removed` — autocorreção de exibição do npm; o campo `bin` real do `package.json` publicado permanece correto, conforme já verificado por inspeção direta de tarball em bloco anterior). Nenhum `npm publish` sem `--dry-run` foi executado.

## Pendências

- P2 — Publicação real do pacote `ddat@0.1.0` no npm ainda não foi realizada; depende de nova confirmação explícita do usuário (autenticação npm já validada em bloco anterior, mas OTP de publicação não foi fornecido).
- P3 — Eventual renomeação do repositório GitHub (`github.com/LukasAlexandre/DDAD`) e das URLs em `package.json` (`repository`, `homepage`, `bugs`) não foi tratada neste bloco — decisão deliberada, fora do escopo de código deste bloco.

Nenhuma pendência P1 identificada.

## Próxima ação recomendada

Publicar o pacote `ddat@0.1.0` no npm após validação final.
