export function splitIntoSentences(text: string): string[] {
  const normalized = text.replace(/\r\n/g, "\n").trim();
  if (!normalized) return [];

  const parts = normalized
    .split(/(?<=다\.)\s+|\n+/)
    .map((s) => s.trim())
    .filter(Boolean);

  return parts.length ? parts : [normalized];
}

export function getSentenceHighlightKeys(
  highlightMap: Record<string, string>,
  paragraphId: string,
): string[] {
  return Object.keys(highlightMap)
    .filter((key) => key.startsWith(`${paragraphId}:s-`))
    .sort((a, b) => {
      const aIndex = Number(a.split(":s-")[1] ?? 0);
      const bIndex = Number(b.split(":s-")[1] ?? 0);
      return aIndex - bIndex;
    });
}

export function buildSentenceId(paragraphId: string, sentenceIndex: number) {
  return `${paragraphId}:s-${sentenceIndex}`;
}

export function removeParagraphSentenceHighlights(
  highlightMap: Record<string, string>,
  paragraphId: string,
) {
  const next = { ...highlightMap };
  Object.keys(next).forEach((key) => {
    if (key.startsWith(`${paragraphId}:s-`)) {
      delete next[key];
    }
  });
  return next;
}
