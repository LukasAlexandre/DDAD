# Validação — Bloco {{BLOCK_NUMBER}}: {{BLOCK_TITLE}}

> Sessão: {{SESSION_NUMBER}} ({{SESSION_SLUG}}) · Projeto: {{PROJECT_NAME}} · Atualizado em: {{CURRENT_DATE}}

## 1. Status

- [ ] Aprovado
- [ ] Aprovado com ressalvas
- [ ] Reprovado
- [ ] Bloqueado

## 2. Critérios de Aceite

_Copie os critérios de aceite do bloco (`05_blocks/bloco_{{BLOCK_NUMBER}}_{{BLOCK_SLUG}}.md`, seção 9) e marque cada um._

- [ ] _..._

## 3. Checklist Funcional

- [ ] Comportamento descrito no bloco funciona como especificado.
- [ ] Casos de borda relevantes foram verificados.
- [ ] _..._

## 4. Checklist Técnico

- [ ] Código segue `Docs/04_governance/convencoes_codigo.md`.
- [ ] `ddae validate` e `ddae audit` não reportam problema relacionado.
- [ ] _..._

## 5. Checklist de Segurança

- [ ] Nenhum dado sensível exposto em log, resposta de API ou repositório.
- [ ] Autenticação/autorização verificadas onde aplicável.
- [ ] Ver `Docs/06_quality_gates/security_gate.md` se o bloco toca área sensível.

## 6. Checklist de Performance

- [ ] Nenhuma regressão de performance perceptível introduzida.
- [ ] Ver `Docs/06_quality_gates/performance_gate.md` se aplicável.

## 7. Checklist de Design System / UX

- [ ] Componentes/tokens usados respeitam `Docs/07_design_system/`.
- [ ] Não aplicável a este bloco.

## 8. Checklist de Documentação

- [ ] Documentação afetada (`Docs/01_product/`, `Docs/02_architecture/`, contratos) foi atualizada.
- [ ] Feedback do bloco (`08_feedbacks/feedback_bloco_{{BLOCK_NUMBER}}_{{BLOCK_SLUG}}.md`) está preenchido.

## 9. Pendências

_Resumo das pendências P1–P4 abertas no feedback. Pendências P1 bloqueiam a aprovação._

- _..._

## 10. Evidências de Validação

_Comandos executados, resultados observados, prints/links que sustentam a decisão final._

_..._

## 11. Decisão Final

_Justificativa direta da decisão de status (seção 1)._

_..._

## 12. Liberação do Próximo Bloco

- [ ] Próximo bloco liberado
- [ ] Próximo bloco bloqueado até resolução de pendências P1 listadas acima
