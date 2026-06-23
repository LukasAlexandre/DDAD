import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { writeText } from '../utils/fs-helpers.js';
import { renderTemplate } from '../utils/text.js';
import { sessionDirOf, blockFilePath, parseBlockFile } from './block.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROMPT_TEMPLATE_PATH = path.join(__dirname, '..', 'templates', 'prompt', 'prompt_template.md');

export async function promptCreateCommand({ block, session, dir, force }) {
  if (!session) {
    throw new Error('prompt create requires --session <session_folder_name>');
  }
  if (!block) {
    throw new Error('prompt create requires --block <block_id>');
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
  const destPath = path.join(sessionDir, '06_prompts', `prompt_${blockId}.md`);

  const template = fs.readFileSync(PROMPT_TEMPLATE_PATH, 'utf8');
  const content = renderTemplate(template, { BLOCK_NUMBER: number, BLOCK_TITLE: title });

  const created = [];
  const skipped = [];
  writeText(destPath, content, { force, created, skipped });

  if (created.length === 0) {
    console.log(`Prompt already exists: Docs/05_sessions/${session}/06_prompts/prompt_${blockId}.md (use --force to overwrite)`);
    return;
  }
  console.log(`Created prompt: Docs/05_sessions/${session}/06_prompts/prompt_${blockId}.md`);
}
