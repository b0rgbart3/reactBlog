import katex from 'katex';

export function renderMath(html: string): string {
  if (!html || !html.includes('$')) return html;

  // Display math first: $$...$$ (must run before inline to avoid mis-matching)
  let result = html.replace(/\$\$([\s\S]+?)\$\$/g, (_, tex) => {
    try {
      return katex.renderToString(tex.trim(), { displayMode: true, throwOnError: false });
    } catch {
      return `<span class="math-error">${tex}</span>`;
    }
  });

  // Inline math: $...$ (single-line only, not preceded/followed by another $)
  result = result.replace(/\$([^$\n]+?)\$/g, (_, tex) => {
    try {
      return katex.renderToString(tex.trim(), { displayMode: false, throwOnError: false });
    } catch {
      return `<span class="math-error">${tex}</span>`;
    }
  });

  return result;
}

export function splitIntoLines(text: string): string[] {
  if (!text) return [];
  const normalized = text.replace(/\r\n/g, "\n");
  return normalized.split("\n");
}

export function splitIntoParagraphs(body: string): string[] {
  const text = JSON.stringify(body);
  if (!text) return [];
  const normalized = text.replace(/\r\n/g, "\n");
  const paragraphs = normalized.split(/\n{1,}/);
  return paragraphs.map((p) => p.trim()).filter(Boolean);
}
