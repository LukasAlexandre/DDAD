import fs from 'node:fs';
import path from 'node:path';

export function hasAccents(name) {
  return /[̀-ͯ]/.test(name.normalize('NFD'));
}

const CONVENTIONAL_NAMES = new Set(['README.md']);

export function isSnakeCase(name) {
  if (CONVENTIONAL_NAMES.has(name)) {
    return true;
  }
  return /^[a-z0-9_.]+$/.test(name);
}

/**
 * Recursively walks `root`, calling `onEntry(relativePath, name)` for every
 * file and directory found, with paths reported relative to `baseDir`.
 */
export function walk(root, baseDir, onEntry) {
  if (!fs.existsSync(root)) {
    return;
  }
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const fullPath = path.join(root, entry.name);
    const relPath = path.relative(baseDir, fullPath);
    onEntry(relPath, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, baseDir, onEntry);
    }
  }
}

/**
 * Walks `docsDir` looking for naming convention violations. Spaces and
 * accented characters are reported as errors, anything else outside
 * snake_case as a warning.
 */
export function scanNamingIssues(docsDir) {
  const errors = [];
  const warnings = [];
  walk(docsDir, docsDir, (relPath, name) => {
    if (name.includes(' ')) {
      errors.push(`Nome contém espaço: Docs/${relPath}`);
    } else if (hasAccents(name)) {
      errors.push(`Nome contém acentos: Docs/${relPath}`);
    } else if (!isSnakeCase(name)) {
      warnings.push(`Nome fora do padrão snake_case: Docs/${relPath}`);
    }
  });
  return { errors, warnings };
}
