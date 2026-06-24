import path from 'node:path';
import {
  isMarkdownFileEmpty,
  hasMarkdownHeading,
  hasMarkdownSection,
  hasChecklistItem,
  getMarkdownSection,
  hasMarkdownField,
  getMarkdownFieldValue,
  readMarkdownFile,
} from './markdown-checks.js';

const REQUIRED_QUALITY_GATES = [
  'architecture_gate.md',
  'security_gate.md',
  'tests_gate.md',
  'performance_gate.md',
  'design_gate.md',
  'deploy_gate.md',
  'final_audit_gate.md',
];

const STATUS_OPTIONS = ['Aprovado com ressalvas', 'Aprovado', 'Reprovado', 'Bloqueado', 'Pendente'];
const REQUIRED_GATE_FIELDS = [
  {
    label: 'responsável',
    fieldNames: ['Responsável', 'Responsavel'],
  },
  {
    label: 'data',
    fieldNames: ['Data'],
  },
  {
    label: 'observações',
    fieldNames: ['Observações', 'Observacoes'],
  },
];

export function getRequiredQualityGates() {
  return [...REQUIRED_QUALITY_GATES];
}

/**
 * Structural checks for one quality gate: title, status options and required
 * responsible/date/observations fields. The field values may still be pending.
 */
export function validateQualityGateContent(content, label) {
  const errors = [];

  if (isMarkdownFileEmpty(content)) {
    errors.push(`Quality gate vazio: ${label}`);
    return errors;
  }
  if (!hasMarkdownHeading(content, 'Quality Gate')) {
    errors.push(`Quality gate sem título "# Quality Gate": ${label}`);
  }
  if (!hasMarkdownSection(content, '9. Status')) {
    errors.push(`Quality gate sem seção "## 9. Status": ${label}`);
  } else if (!hasChecklistItem(getMarkdownSection(content, '9. Status'))) {
    errors.push(`Quality gate sem opção de status (checkbox) em "## 9. Status": ${label}`);
  }

  for (const field of REQUIRED_GATE_FIELDS) {
    if (!hasRequiredGateField(content, field)) {
      errors.push(`Gate obrigatório sem ${field.label}: ${label}`);
    }
  }

  return errors;
}

export function validateRequiredQualityGates(gatesDir) {
  const errors = [];
  const gates = [];

  for (const gate of REQUIRED_QUALITY_GATES) {
    const label = `Docs/06_quality_gates/${gate}`;
    const filePath = path.join(gatesDir, gate);
    const read = readMarkdownFile(filePath, label);

    if (!read.ok) {
      errors.push(`Quality gate obrigatório ausente ou ilegível: ${label}`);
      gates.push({ gate, label, exists: false, status: null, errors: [read.error] });
      continue;
    }

    const gateErrors = validateQualityGateContent(read.content, label);
    errors.push(...gateErrors);
    gates.push({
      gate,
      label,
      exists: true,
      status: getQualityGateStatus(read.content),
      errors: gateErrors,
    });
  }

  return { errors, gates };
}

export function getQualityGateStatus(content) {
  const checkedStatus = STATUS_OPTIONS.find((option) => statusMarkedAs(content, option));
  if (checkedStatus) {
    return checkedStatus;
  }

  return getMarkdownFieldValue(content, 'Status');
}

/**
 * Reports which status checkbox or status field is present for each gate.
 */
export function scanQualityGateStatuses(gatesDir) {
  return REQUIRED_QUALITY_GATES.map((gate) => {
    const label = `Docs/06_quality_gates/${gate}`;
    const filePath = path.join(gatesDir, gate);
    const read = readMarkdownFile(filePath, label);
    if (!read.ok) {
      return { gate, exists: false, status: null };
    }
    return { gate, exists: true, status: getQualityGateStatus(read.content) };
  });
}

/**
 * Opinionated audit of the 7 quality gates: missing/empty files, incomplete
 * structure, pending status, or status values that indicate failure.
 */
export function auditQualityGates(gatesDir) {
  const errors = [];
  const warnings = [];
  const gates = [];

  for (const gate of REQUIRED_QUALITY_GATES) {
    const label = `Docs/06_quality_gates/${gate}`;
    const filePath = path.join(gatesDir, gate);
    const read = readMarkdownFile(filePath, label);

    if (!read.ok) {
      warnings.push(`Quality gate ausente: ${label}`);
      gates.push({ gate, label, exists: false, status: 'Ausente', state: 'Incompleto', issues: [read.error] });
      continue;
    }

    const content = read.content;
    const gateIssues = [];

    if (isMarkdownFileEmpty(content)) {
      warnings.push(`Quality gate vazio: ${label}`);
      gates.push({ gate, label, exists: true, status: 'Vazio', state: 'Incompleto', issues: ['Arquivo vazio'] });
      continue;
    }

    addWarnings(validateQualityGateContent(content, label), warnings, gateIssues);

    if (!hasMarkdownSection(content, '3. Checklist Obrigatório')) {
      warnings.push(`Quality gate sem checklist obrigatório: ${label}`);
      gateIssues.push('Checklist obrigatório ausente');
    }
    if (!hasMarkdownSection(content, '4. Critérios Mínimos de Aprovação')) {
      warnings.push(`Quality gate sem critérios mínimos de aprovação: ${label}`);
      gateIssues.push('Critérios mínimos ausentes');
    }
    if (!hasMarkdownSection(content, '5. Evidências Esperadas')) {
      warnings.push(`Quality gate sem evidências esperadas: ${label}`);
      gateIssues.push('Evidências esperadas ausentes');
    }

    const hasStatusSection = hasMarkdownSection(content, '9. Status');
    if (!hasStatusSection || !hasChecklistItem(getMarkdownSection(content, '9. Status'))) {
      warnings.push(`Quality gate sem opções de status: ${label}`);
      gateIssues.push('Opções de status ausentes');
      gates.push({ gate, label, exists: true, status: 'Indefinido', state: 'Incompleto', issues: gateIssues });
      continue;
    }

    const status = getQualityGateStatus(content);
    if (!status || status === 'Pendente') {
      warnings.push(`Quality gate com status pendente: ${label}`);
      gates.push({ gate, label, exists: true, status: 'Pendente', state: 'Pendente', issues: gateIssues });
    } else if (status === 'Reprovado' || status === 'Bloqueado') {
      errors.push(`Quality gate marcado como "${status}": ${label}`);
      gates.push({ gate, label, exists: true, status, state: 'Falhou', issues: gateIssues });
    } else {
      gates.push({
        gate,
        label,
        exists: true,
        status,
        state: gateIssues.length === 0 ? 'OK' : 'Incompleto',
        issues: gateIssues,
      });
    }
  }

  return { errors, warnings, gates };
}

function statusMarkedAs(content, optionLabel) {
  const statusSection = getMarkdownSection(content, '9. Status');
  const escaped = optionLabel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`-\\s*\\[[xX]\\]\\s*${escaped}`).test(statusSection);
}

function hasRequiredGateField(content, field) {
  return hasMarkdownField(content, field.fieldNames);
}

function addWarnings(messages, warnings, issues) {
  for (const message of messages) {
    warnings.push(message);
    issues.push(message);
  }
}
