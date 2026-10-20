// src/utils/ansi-parser.ts
/**
 * Simple ANSI color code parser to convert terminal/Jupyter color escape sequences into safe HTML spans.
 */
export function ansiToHtml(text: string): string {
  if (!text) return '';

  // ANSI escape sequence map
  const colorMap: Record<string, string> = {
    '30': '#475569', // black/gray
    '31': '#ef4444', // red
    '32': '#22c55e', // green
    '33': '#eab308', // yellow
    '34': '#3b82f6', // blue
    '35': '#a855f7', // magenta
    '36': '#06b6d4', // cyan
    '37': '#f8fafc', // white
    '90': '#64748b', // bright black
    '91': '#f87171', // bright red
    '92': '#4ade80', // bright green
    '93': '#fde047', // bright yellow
    '94': '#60a5fa', // bright blue
    '95': '#c084fc', // bright magenta
    '96': '#22d3ee', // bright cyan
  };

  // Escape raw HTML entities first to avoid XSS
  let escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Replace ANSI codes
  const ansiRegex = /\u001b\[([0-9;]+)m/g;
  let result = '';
  let lastIndex = 0;
  let openSpan = false;

  let match;
  while ((match = ansiRegex.exec(escaped)) !== null) {
    result += escaped.substring(lastIndex, match.index);
    const codes = match[1].split(';');

    if (openSpan) {
      result += '</span>';
      openSpan = false;
    }

    if (codes.includes('0')) {
      // Reset
    } else {
      let styles: string[] = [];
      for (const code of codes) {
        if (colorMap[code]) {
          styles.push(`color: ${colorMap[code]}`);
        }
        if (code === '1') {
          styles.push('font-weight: 600');
        }
        if (code === '4') {
          styles.push('text-decoration: underline');
        }
      }
      if (styles.length > 0) {
        result += `<span style="${styles.join('; ')}">`;
        openSpan = true;
      }
    }
    lastIndex = ansiRegex.lastIndex;
  }

  result += escaped.substring(lastIndex);
  if (openSpan) {
    result += '</span>';
  }

  return result;
}
