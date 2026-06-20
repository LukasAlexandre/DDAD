import fs from 'node:fs';
import path from 'node:path';

/**
 * Copies a single file to destination unless it already exists (unless force is set).
 * Records the outcome into the `created` / `skipped` arrays for reporting.
 */
export function copyFile(srcPath, destPath, { force, created, skipped }) {
  const exists = fs.existsSync(destPath);
  if (exists && !force) {
    skipped.push(destPath);
    return;
  }
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.copyFileSync(srcPath, destPath);
  created.push(destPath);
}

/**
 * Recursively copies a template directory to destination, file by file,
 * so each file independently respects the existing-file/force rule.
 */
export function copyDir(srcDir, destDir, { force, created, skipped }) {
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath, { force, created, skipped });
    } else {
      copyFile(srcPath, destPath, { force, created, skipped });
    }
  }
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
