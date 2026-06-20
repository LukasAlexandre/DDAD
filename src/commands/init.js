import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { copyDir, copyFile, writeJson } from '../utils/fs-helpers.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = path.join(__dirname, '..', 'templates');
const pkg = JSON.parse(
  readFileSync(path.join(__dirname, '..', '..', 'package.json'), 'utf8'),
);

export async function initCommand({ dir, force }) {
  const created = [];
  const skipped = [];

  copyDir(path.join(TEMPLATES_DIR, 'docs'), path.join(dir, 'ddad', 'docs'), {
    force,
    created,
    skipped,
  });

  copyFile(
    path.join(TEMPLATES_DIR, 'agents', 'CLAUDE.md'),
    path.join(dir, 'CLAUDE.md'),
    { force, created, skipped },
  );
  copyFile(
    path.join(TEMPLATES_DIR, 'agents', 'AGENTS.md'),
    path.join(dir, 'AGENTS.md'),
    { force, created, skipped },
  );
  copyFile(
    path.join(TEMPLATES_DIR, 'agents', 'cursorrules'),
    path.join(dir, '.cursorrules'),
    { force, created, skipped },
  );

  writeJson(
    path.join(dir, 'ddad.config.json'),
    {
      version: pkg.version,
      docsDir: 'ddad/docs',
      createdAt: new Date().toISOString(),
    },
    { force, created, skipped },
  );

  report({ dir, created, skipped });
}

function report({ dir, created, skipped }) {
  if (created.length > 0) {
    console.log('Created:');
    for (const file of created) {
      console.log(`  ${path.relative(dir, file)}`);
    }
  }
  if (skipped.length > 0) {
    console.log('\nSkipped (already exist, use --force to overwrite):');
    for (const file of skipped) {
      console.log(`  ${path.relative(dir, file)}`);
    }
  }
  console.log('\nDDAD initialized. Next steps:');
  console.log('  1. Fill in ddad/docs/00-overview.md with your project vision.');
  console.log('  2. Review CLAUDE.md / AGENTS.md / .cursorrules and adjust to your workflow.');
  console.log('  3. Point your AI agent at ddad/docs before it starts implementing.');
}
