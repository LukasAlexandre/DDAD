import fs from 'node:fs';
import path from 'node:path';
import { scanNamingIssues } from '../utils/naming.js';

const MAIN_SUBFOLDERS = [
  '00_ddad',
  '01_product',
  '02_architecture',
  '03_contracts',
  '04_governance',
  '05_sessions',
  '06_quality_gates',
  '07_design_system',
  '08_deploy',
  '09_observability',
  '99_archive',
];

const SESSION_SUBFOLDERS = [
  '01_intake',
  '02_analysis',
  '03_ideas',
  '04_planning',
  '05_blocks',
  '06_prompts',
  '07_bugs',
  '08_feedbacks',
  '09_validation',
  '10_tests',
  '11_security',
  '12_performance',
  '13_release',
];

const QUALITY_GATES = [
  'architecture_gate.md',
  'security_gate.md',
  'tests_gate.md',
  'performance_gate.md',
  'design_gate.md',
  'deploy_gate.md',
  'final_audit_gate.md',
];

const ROOT_FILES = ['CLAUDE.md', 'AGENTS.md', '.cursorrules'];

function mdFiles(dirPath) {
  if (!fs.existsSync(dirPath)) {
    return [];
  }
  return fs.readdirSync(dirPath).filter((name) => name.endsWith('.md') && name !== 'README.md');
}

function auditSessions(sessionsDir, warnings) {
  if (!fs.existsSync(sessionsDir)) {
    return;
  }
  for (const sessionName of fs.readdirSync(sessionsDir)) {
    const sessionDir = path.join(sessionsDir, sessionName);
    if (!fs.statSync(sessionDir).isDirectory()) {
      continue;
    }

    if (!fs.existsSync(path.join(sessionDir, 'README.md'))) {
      warnings.push(`Sessão sem README: Docs/05_sessions/${sessionName}`);
    }

    for (const subfolder of SESSION_SUBFOLDERS) {
      if (!fs.existsSync(path.join(sessionDir, subfolder))) {
        warnings.push(`Sessão sem estrutura interna padrão (falta ${subfolder}): Docs/05_sessions/${sessionName}`);
      }
    }

    const blocks = mdFiles(path.join(sessionDir, '05_blocks'))
      .map((name) => name.replace(/\.md$/, ''));
    const prompts = mdFiles(path.join(sessionDir, '06_prompts'))
      .map((name) => name.replace(/^prompt_/, '').replace(/\.md$/, ''));
    const feedbacks = mdFiles(path.join(sessionDir, '08_feedbacks'))
      .map((name) => name.replace(/^feedback_/, '').replace(/\.md$/, ''));

    for (const block of blocks) {
      if (!prompts.includes(block)) {
        warnings.push(`Bloco sem prompt correspondente: Docs/05_sessions/${sessionName}/05_blocks/${block}.md`);
      }
      if (!feedbacks.includes(block)) {
        warnings.push(`Bloco sem feedback correspondente: Docs/05_sessions/${sessionName}/05_blocks/${block}.md`);
      }
    }
    for (const prompt of prompts) {
      if (!blocks.includes(prompt)) {
        warnings.push(`Prompt órfão (sem bloco correspondente): Docs/05_sessions/${sessionName}/06_prompts/prompt_${prompt}.md`);
      }
    }
    for (const feedback of feedbacks) {
      if (!blocks.includes(feedback)) {
        warnings.push(`Feedback órfão (sem bloco correspondente): Docs/05_sessions/${sessionName}/08_feedbacks/feedback_${feedback}.md`);
      }
    }
  }
}

export async function auditCommand({ dir }) {
  const errors = [];
  const warnings = [];
  const suggestions = [];
  const docsDir = path.join(dir, 'Docs');

  if (!fs.existsSync(docsDir)) {
    console.log('DDAD Audit Report\n');
    console.log('Status: FAILED');
    console.log('Warnings: 0');
    console.log('Errors: 1');
    console.log('Suggestions: 0');
    console.log('\nErrors:');
    console.log('  - Docs/ não encontrado. Execute "ddad init" primeiro.');
    process.exitCode = 1;
    return;
  }

  for (const entry of fs.readdirSync(docsDir, { withFileTypes: true })) {
    if (entry.isDirectory() && !MAIN_SUBFOLDERS.includes(entry.name)) {
      suggestions.push(`Pasta fora do padrão principal: Docs/${entry.name}`);
    }
  }

  for (const gate of QUALITY_GATES) {
    if (!fs.existsSync(path.join(docsDir, '06_quality_gates', gate))) {
      warnings.push(`Quality gate ausente: Docs/06_quality_gates/${gate}`);
    }
  }

  for (const file of ROOT_FILES) {
    if (!fs.existsSync(path.join(dir, file))) {
      warnings.push(`Arquivo de agente IA ausente na raiz: ${file}`);
    }
  }

  auditSessions(path.join(docsDir, '05_sessions'), warnings);

  const naming = scanNamingIssues(docsDir);
  errors.push(...naming.errors);

  const status = errors.length === 0 ? 'OK' : 'FAILED';

  console.log('DDAD Audit Report\n');
  console.log(`Status: ${status}`);
  console.log(`Warnings: ${warnings.length}`);
  console.log(`Errors: ${errors.length}`);
  console.log(`Suggestions: ${suggestions.length}`);

  if (warnings.length > 0) {
    console.log('\nWarnings:');
    for (const warning of warnings) {
      console.log(`  - ${warning}`);
    }
  }
  if (errors.length > 0) {
    console.log('\nErrors:');
    for (const error of errors) {
      console.log(`  - ${error}`);
    }
  }
  if (suggestions.length > 0) {
    console.log('\nSuggestions:');
    for (const suggestion of suggestions) {
      console.log(`  - ${suggestion}`);
    }
  }

  process.exitCode = status === 'OK' ? 0 : 1;
}
