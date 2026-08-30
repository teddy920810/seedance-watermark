import { describe, expect, it } from 'vitest';
import { extractBlogLead, formatBlogDate } from './blog-presentation';

describe('blog article presentation', () => {
  it('reuses the first two italic Markdown paragraphs as the hero dek and cover caption', () => {
    expect(extractBlogLead('*Hero dek.*\n\n*Cover caption.*\n\n**Quick answer.** Body')).toEqual({
      heroDescription: 'Hero dek.',
      coverCaption: 'Cover caption.',
      hiddenParagraphs: 2,
    });
  });

  it('falls back safely when an article does not start with presentation copy', () => {
    expect(extractBlogLead('Regular opening paragraph.')).toEqual({
      heroDescription: undefined,
      coverCaption: undefined,
      hiddenParagraphs: 0,
    });
  });

  it('formats canonical content dates without timezone drift', () => {
    expect(formatBlogDate('2026-08-23', 'en')).toBe('August 23, 2026');
  });
});
