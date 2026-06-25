# Bloco {{BLOCK_NUMBER}} — {{BLOCK_TITLE}}

> Sessão: {{SESSION_NUMBER}} ({{SESSION_SLUG}}) · Projeto: {{PROJECT_NAME}} · Atualizado em: {{CURRENT_DATE}}

## 1. Objetivo

_Uma frase direta: o que este bloco entrega quando concluído. Se não cabe em uma frase, o escopo provavelmente está grande demais._

_..._

## 2. Contexto

_Por que este bloco existe agora. Que sessão/análise/decisão o originou. Ligue a `Docs/01_product/requisitos_funcionais.md` ou `Docs/02_architecture/decisoes_tecnicas.md` quando aplicável._

_..._

## 3. Problema que Este Bloco Resolve

_O problema concreto — não a solução. Se não há um problema real sendo resolvido, questione se este bloco deveria existir._

_..._

## 4. Escopo

_Lista fechada do que será feito. Cada item deve ser verificável como feito/não feito ao final._

- _..._

## 5. Fora de Escopo

_O que pode parecer relacionado mas não será feito aqui — e onde será tratado, se souber._

- _..._

## 6. Arquivos e Pastas Envolvidos

_Caminhos esperados de criação/alteração. Um agente de IA deve poder usar esta lista para saber onde tem permissão de tocar._

- _..._

## 7. Dependências

_Outros blocos, contratos (`Docs/03_contracts/`), decisões ou serviços externos que precisam estar prontos antes deste bloco começar._

- _..._

## 8. Plano de Implementação

_Passos em ordem de execução, não uma descrição genérica. Se um agente seguir só esta lista, ele deve chegar ao resultado esperado._

1. _..._
2. _..._
3. _..._

## 9. Critérios de Aceite

_Verificáveis, não aspiracionais. Use checkboxes — cada um deve poder ser marcado como verdadeiro ou falso sem ambiguidade._

- [ ] _..._
- [ ] _..._

## 10. Validações Obrigatórias

_Comandos/testes que precisam passar antes do bloco ser considerado concluído (ex.: `ddae validate`, suíte de testes, lint)._

- [ ] _..._

## 11. Segurança

_Pontos de atenção de segurança específicos deste bloco (dados sensíveis, autenticação, autorização, entrada de usuário). Se nenhum se aplica, escreva "Não aplicável" explicitamente — não deixe em branco._

_..._

## 12. Performance

_Impacto de performance esperado (consultas novas, processamento pesado, tamanho de bundle). Se nenhum se aplica, escreva "Não aplicável" explicitamente._

_..._

## 13. Design System / UX

_Componentes, tokens ou padrões visuais que este bloco usa ou introduz — ver `Docs/07_design_system/`. Se nenhum se aplica, escreva "Não aplicável" explicitamente._

_..._

## 14. Riscos

_O que pode dar errado especificamente neste bloco (não o backlog geral de riscos do projeto)._

- _..._

## 15. Pendências Esperadas

_Pendências que já se sabe, antes de implementar, que provavelmente vão sobrar (classificadas P1–P4 conforme `Docs/00_ddae/metodologia.md`, seção 12)._

- _..._

## 16. Feedback Obrigatório

_Lembrete: ao final deste bloco, gerar e preencher o feedback via `ddae feedback create --block bloco_{{BLOCK_NUMBER}}_{{BLOCK_SLUG}} --session session_{{SESSION_NUMBER}}_{{SESSION_SLUG}}`. Sem feedback preenchido, o bloco não está concluído._

## 17. Commit Semântico Sugerido

_Sugestão de commit no padrão de `Docs/04_governance/convencoes_commits.md`. Nunca executado automaticamente — exige confirmação explícita do usuário._

```
feat({{BLOCK_SLUG}}): _..._
```
