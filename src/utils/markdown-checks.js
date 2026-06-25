import fs from 'node:fs';

export function markdownFileExists(filePath) {
  return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
}

export function readMarkdownFile(filePath, label = filePath) {
  try {
    if (!markdownFileExists(filePath)) {
      return {
        ok: false,
        content: '',
        error: `Arquivo Markdown ausente: ${label}`,
      };
    }

    return {
      ok: true,
      content: fs.readFileSync(filePath, 'utf8'),
      error: null,
    };
  } catch (error) {
    return {
      ok: false,
      content: '',
      error: `Não foi possível ler Markdown: ${label} (${error.message})`,
    };
  }
}

export function isMarkdownFileEmpty(content) {
  return content.trim().length === 0;
}

export function hasMarkdownHeading(content, headingText) {
  return content
    .split('\n')
    .some((line) => line.startsWith('# ') && line.slice(2).trim().startsWith(headingText));
}

export function hasMarkdownSection(content, sectionTitle, marker = '##') {
  return findSectionStart(content, sectionTitle, marker) !== -1;
}

export function hasMarkdownField(content, fieldNames) {
  return normalizeFieldNames(fieldNames).some((fieldName) => {
    const escaped = escapeRegExp(fieldName);
    return new RegExp(`\\*\\*\\s*${escaped}\\s*:\\s*\\*\\*`, 'i').test(content);
  });
}

export function getMarkdownFieldValue(content, fieldNames) {
  for (const fieldName of normalizeFieldNames(fieldNames)) {
    const escaped = escapeRegExp(fieldName);
    const match = content.match(new RegExp(`^\\s*\\*\\*\\s*${escaped}\\s*:\\s*\\*\\*\\s*(.+?)\\s*$`, 'im'));
    if (match) {
      return match[1].trim();
    }
  }
  return null;
}

/**
 * Returns the body of a section (everything after its heading line, up to
 * the next heading of the same level or shallower). Empty string if the
 * section doesn't exist.
 */
export function getMarkdownSection(content, sectionTitle, marker = '##') {
  const lines = content.split('\n');
  const startIndex = findSectionStart(content, sectionTitle, marker);
  if (startIndex === -1) {
    return '';
  }
  const rest = lines.slice(startIndex + 1);
  const endOffset = rest.findIndex((line) => isHeadingAtOrAbove(line, marker));
  return (endOffset === -1 ? rest : rest.slice(0, endOffset)).join('\n');
}

export function hasChecklistItem(content) {
  return /^[-*]\s*\[[ xX]\]/m.test(content);
}

/**
 * True when a section has a real bullet item, as opposed to only the
 * unfilled `_..._` placeholder used across DDAE templates.
 */
export function hasFilledListItem(content) {
  return content.split('\n').some((line) => {
    const trimmed = line.trim();
    if (!trimmed.startsWith('-') && !trimmed.startsWith('*')) {
      return false;
    }
    const rest = trimmed.replace(/^[-*]\s*/, '').trim();
    return rest.length > 0 && rest !== '_..._' && rest !== '...';
  });
}

function findSectionStart(content, sectionTitle, marker) {
  const lines = content.split('\n');
  const prefix = `${marker} `;
  return lines.findIndex(
    (line) => line.startsWith(prefix) && line.slice(prefix.length).trim().startsWith(sectionTitle),
  );
}

function isHeadingAtOrAbove(line, marker) {
  const match = line.match(/^(#{1,6})\s/);
  if (!match) {
    return false;
  }
  return match[1].length <= marker.length;
}

function normalizeFieldNames(fieldNames) {
  return Array.isArray(fieldNames) ? fieldNames : [fieldNames];
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
