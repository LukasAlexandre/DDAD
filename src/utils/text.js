/**
 * Converts arbitrary user input into a lowercase snake_case slug:
 * strips accents, replaces anything that isn't [a-z0-9] with underscores,
 * and collapses/trims repeated underscores.
 */
export function slugify(input) {
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

export function pad2(n) {
  return String(n).padStart(2, '0');
}

/**
 * Replaces {{KEY}} placeholders in a template string with values from `data`.
 */
export function renderTemplate(content, data) {
  return content.replace(/{{\s*([A-Z_]+)\s*}}/g, (match, key) => (
    key in data ? String(data[key]) : match
  ));
}
