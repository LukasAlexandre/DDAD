import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { copyDir } from './fs-helpers.js';
import { renderTemplate, pad2 } from './text.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const SESSION_TEMPLATE_DIR = path.join(__dirname, '..', 'templates', 'session');

// The 10 base sessions stamped out by `ddat init`. Not a limit — `ddat session
// create` continues the sequence from session_11 onward.
export const BASE_SESSIONS = [
  ['project_foundation', 'Project Foundation'],
  ['architecture_contracts', 'Architecture & Contracts'],
  ['design_system', 'Design System'],
  ['core_features', 'Core Features'],
  ['auth_security', 'Auth & Security'],
  ['tests_quality', 'Tests & Quality'],
  ['performance', 'Performance'],
  ['deploy_release', 'Deploy & Release'],
  ['observability', 'Observability'],
  ['final_audit', 'Final Audit'],
].map(([slug, title], index) => ({ number: pad2(index + 1), slug, title }));

export function sessionFolderName(number, slug) {
  return `session_${number}_${slug}`;
}

export function scaffoldSession(destDir, { number, title, slug, projectName, currentDate }, { force, created, skipped }) {
  copyDir(SESSION_TEMPLATE_DIR, destDir, {
    force,
    created,
    skipped,
    transform: (content) => renderTemplate(content, {
      SESSION_NUMBER: number,
      SESSION_TITLE: title,
      SESSION_SLUG: slug,
      PROJECT_NAME: projectName,
      CURRENT_DATE: currentDate,
    }),
  });
}
