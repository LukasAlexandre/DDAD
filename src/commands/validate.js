import fs from 'node:fs';
import path from 'node:path';
import { scanNamingIssues } from '../utils/naming.js';
import { validateRequiredQualityGates } from '../utils/quality-gates.js';

const MAIN_SUBFOLDERS = [
  '00_ddae',
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

const ROOT_FILES = ['CLAUDE.md', 'AGENTS.md', '.cursorrules', 'ddae.config.json'];

export async function validateCommand({ dir }) {
  const errors = [];
  const warnings = [];
  const qualityGateErrors = [];
  let qualityGateStatus = 'SKIPPED';
  const docsDir = path.join(dir, 'Docs');

  if (!fs.existsSync(docsDir)) {
    errors.push('Docs/ não encontrado. Execute "ddae init" primeiro.');
  } else {
    for (const folder of MAIN_SUBFOLDERS) {
      if (!fs.existsSync(path.join(docsDir, folder))) {
        errors.push(`Pasta principal ausente: Docs/${folder}`);
      }
    }

    if (!fs.existsSync(path.join(docsDir, '00_ddae', 'metodologia.md'))) {
      errors.push('Arquivo ausente: Docs/00_ddae/metodologia.md');
    }

    const gatesValidation = validateRequiredQualityGates(path.join(docsDir, '06_quality_gates'));
    qualityGateErrors.push(...gatesValidation.errors);
    errors.push(...qualityGateErrors);
    qualityGateStatus = qualityGateErrors.length === 0 ? 'OK' : 'FAIL';

    const sessionsDir = path.join(docsDir, '05_sessions');
    if (fs.existsSync(sessionsDir)) {
      const sessionNumbers = fs.readdirSync(sessionsDir)
        .map((name) => name.match(/^session_(\d+)_/)?.[1])
        .filter(Boolean);
      for (let i = 1; i <= 10; i += 1) {
        if (!sessionNumbers.includes(String(i).padStart(2, '0'))) {
          warnings.push(`Sessão base ausente: session_${String(i).padStart(2, '0')}_* em Docs/05_sessions/`);
        }
      }
    }

    const naming = scanNamingIssues(docsDir);
    errors.push(...naming.errors);
    warnings.push(...naming.warnings);
  }

  for (const file of ROOT_FILES) {
    if (!fs.existsSync(path.join(dir, file))) {
      errors.push(`Arquivo de agente ausente na raiz: ${file}`);
    }
  }

  const status = errors.length === 0 ? 'OK' : 'FAILED';

  console.log('DDAE Validation Report\n');
  console.log(`Status: ${status}`);
  console.log(`Warnings: ${warnings.length}`);
  console.log(`Errors: ${errors.length}`);
  console.log(`[DDAE validate] Quality gates: ${qualityGateStatus}`);

  if (qualityGateErrors.length > 0) {
    for (const error of qualityGateErrors) {
      console.log(`  - ${error}`);
    }
  }

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

  process.exitCode = status === 'OK' ? 0 : 1;
}
