import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { copyDir, copyFile, writeJson } from '../utils/fs-helpers.js';
import { BASE_SESSIONS, scaffoldSession, sessionFolderName } from '../utils/session.js';
import { projectNameOf, currentDate, renderTemplate } from '../utils/text.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = path.join(__dirname, '..', 'templates');
const pkg = JSON.parse(
  readFileSync(path.join(__dirname, '..', '..', 'package.json'), 'utf8'),
);

export async function initCommand({ dir, force }) {
  const created = [];
  const skipped = [];
  const docsDir = path.join(dir, 'Docs');
  const projectName = projectNameOf(dir);
  const today = currentDate();
  const docTransform = (content) => renderTemplate(content, { PROJECT_NAME: projectName, CURRENT_DATE: today });

  copyDir(path.join(TEMPLATES_DIR, 'docs_root'), docsDir, { force, created, skipped, transform: docTransform });
  copyDir(path.join(TEMPLATES_DIR, 'quality_gates'), path.join(docsDir, '06_quality_gates'), {
    force,
    created,
    skipped,
    transform: docTransform,
  });

  const sessionsDir = path.join(docsDir, '05_sessions');
  for (const session of BASE_SESSIONS) {
    const sessionDir = path.join(sessionsDir, sessionFolderName(session.number, session.slug));
    scaffoldSession(sessionDir, { ...session, projectName, currentDate: today }, { force, created, skipped });
  }

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
      docsDir: 'Docs',
      createdAt: new Date().toISOString(),
    },
    { force, created, skipped },
  );

  report({ dir, created, skipped });
}

function report({ dir, created, skipped }) {
  if (created.length > 0) {
    console.log(`Created: ${created.length} file(s)`);
  }
  if (skipped.length > 0) {
    console.log(`Skipped (already exist, use --force to overwrite): ${skipped.length} file(s)`);
  }
  console.log('\nDDAD initialized. Next steps:');
  console.log('  1. Fill in Docs/01_product/visao_produto.md with your project vision.');
  console.log('  2. Review CLAUDE.md / AGENTS.md / .cursorrules and adjust to your workflow.');
  console.log('  3. Create your first session: ddad session create "<nome>"');
  console.log(`  4. Run "ddad validate" to check the structure (from ${path.relative(process.cwd(), dir) || '.'}).`);
}
