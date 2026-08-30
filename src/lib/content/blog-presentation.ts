const italicParagraph = /^\*([^*\n]+)\*$/;

export function extractBlogLead(markdown: string): {
  heroDescription?: string;
  coverCaption?: string;
  hiddenParagraphs: number;
} {
  const paragraphs = markdown.replaceAll('\r\n', '\n').trimStart().split(/\n\s*\n/);
  const heroDescription = paragraphs[0]?.match(italicParagraph)?.[1]?.trim();
  const coverCaption = paragraphs[1]?.match(italicParagraph)?.[1]?.trim();
  if (!heroDescription || !coverCaption) return { hiddenParagraphs: 0 };
  return { heroDescription, coverCaption, hiddenParagraphs: 2 };
}

export function formatBlogDate(value: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
    year: 'numeric',
  }).format(new Date(`${value}T00:00:00Z`));
}
