import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { writeText } from '../utils/fs-helpers.js';
import { renderTemplate, projectNameOf, currentDate } from '../utils/text.js';
import { sessionDirOf, blockFilePath, parseBlockFile, parseSessionFolderName } from './block.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FEEDBACK_TEMPLATE_PATH = path.join(__dirname, '..', 'templates', 'feedback', 'feedback_template.md');

export async function feedbackCreateCommand({ block, session, dir, force }) {
  if (!session) {
    throw new Error('feedback create requires --session <session_folder_name>');
  }
  if (!block) {
    throw new Error('feedback create requires --block <block_id>');
  }

  const sessionDir = sessionDirOf(dir, session);
  if (!fs.existsSync(sessionDir)) {
    throw new Error(`Session not found: Docs/05_sessions/${session}`);
  }

  const blockPath = blockFilePath(dir, session, block);
  if (!fs.existsSync(blockPath)) {
    throw new Error(`Block not found: Docs/05_sessions/${session}/05_blocks/${path.basename(blockPath)}`);
  }

  const { number, title } = parseBlockFile(blockPath);
  const blockId = path.basename(blockPath, '.md');
  const blockSlug = blockId.replace(/^bloco_\d+_/, '');
  const { number: sessionNumber, slug: sessionSlug } = parseSessionFolderName(session);
  const destPath = path.join(sessionDir, '08_feedbacks', `feedback_${blockId}.md`);

  const template = fs.readFileSync(FEEDBACK_TEMPLATE_PATH, 'utf8');
  const content = renderTemplate(template, {
    BLOCK_NUMBER: number,
    BLOCK_TITLE: title,
    BLOCK_SLUG: blockSlug,
    SESSION_NUMBER: sessionNumber,
    SESSION_SLUG: sessionSlug,
    PROJECT_NAME: projectNameOf(dir),
    CURRENT_DATE: currentDate(),
  });

  const created = [];
  const skipped = [];
  writeText(destPath, content, { force, created, skipped });

  if (created.length === 0) {
    console.log(`Feedback already exists: Docs/05_sessions/${session}/08_feedbacks/feedback_${blockId}.md (use --force to overwrite)`);
    return;
  }
  console.log(`Created feedback: Docs/05_sessions/${session}/08_feedbacks/feedback_${blockId}.md`);
}
