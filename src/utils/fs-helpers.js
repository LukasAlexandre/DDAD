import fs from 'node:fs';
import path from 'node:path';

/**
 * Copies a single file to destination unless it already exists (unless force is set).
 * Records the outcome into the `created` / `skipped` arrays for reporting.
 * If `transform` is given, it is applied to the source text content before writing.
 */
export function copyFile(srcPath, destPath, { force, created, skipped, transform }) {
  const exists = fs.existsSync(destPath);
  if (exists && !force) {
    skipped.push(destPath);
    return;
  }
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  if (transform) {
    const content = fs.readFileSync(srcPath, 'utf8');
    fs.writeFileSync(destPath, transform(content), 'utf8');
  } else {
    fs.copyFileSync(srcPath, destPath);
  }
  created.push(destPath);
}

/**
 * Recursively copies a template directory to destination, file by file,
 * so each file independently respects the existing-file/force rule.
 */
export function copyDir(srcDir, destDir, { force, created, skipped, transform }) {
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath, { force, created, skipped, transform });
    } else {
      copyFile(srcPath, destPath, { force, created, skipped, transform });
    }
  }
}

/**
 * Writes raw text content unless the file already exists (unless force is set).
 */
export function writeText(destPath, content, { force, created, skipped }) {
  if (fs.existsSync(destPath) && !force) {
    skipped.push(destPath);
    return;
  }
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, content.endsWith('\n') ? content : `${content}\n`, 'utf8');
  created.push(destPath);
}

/**
 * Returns the next available zero-padded two-digit sequence number for entries
 * matching `^prefix_(\d+)` inside `dirPath` (directories or files, non-recursive).
 * Returns 1 if the directory doesn't exist or has no matching entries.
 */
export function nextSequence(dirPath, prefix) {
  if (!fs.existsSync(dirPath)) {
    return 1;
  }
  const pattern = new RegExp(`^${prefix}_(\\d+)`);
  const entries = fs.readdirSync(dirPath);
  let max = 0;
  for (const entry of entries) {
    const match = entry.match(pattern);
    if (match) {
      max = Math.max(max, Number(match[1]));
    }
  }
  return max + 1;
}

/**
 * Writes a JSON file unless it already exists (unless force is set).
 */
export function writeJson(destPath, data, { force, created, skipped }) {
  if (fs.existsSync(destPath) && !force) {
    skipped.push(destPath);
    return;
  }
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  created.push(destPath);
}
