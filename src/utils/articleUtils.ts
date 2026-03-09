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
