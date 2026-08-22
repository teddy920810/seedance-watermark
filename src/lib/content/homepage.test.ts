import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { homepageSchema } from './homepage';
import { visibleItems } from './item-visibility';

const homepage = JSON.parse(
  readFileSync(new URL('../../content/homepage/home.json', import.meta.url), 'utf8'),
);

describe('homepage CMS content', () => {
  it('matches the homepage schema', () => {
    expect(homepageSchema.safeParse(homepage).success).toBe(true);
  });

  it('contains editable content for every homepage section', () => {
    const parsed = homepageSchema.parse(homepage);
    expect(parsed.hero.trustItems.length).toBeGreaterThan(0);
    expect(parsed.useCases.length).toBeGreaterThan(0);
    expect(parsed.process.steps.length).toBeGreaterThan(0);
    expect(parsed.features.items.length).toBeGreaterThan(0);
    expect(parsed.faq.items.length).toBeGreaterThan(0);
    expect(parsed.privacy.features.length).toBeGreaterThan(0);
  });

  it('defaults every true items entry to visible without changing stored content', () => {
    const parsed = homepageSchema.parse(homepage);
    expect(parsed.features.items.every((item) => item.enabled)).toBe(true);
    expect(parsed.faq.items.every((item) => item.enabled)).toBe(true);
  });

  it('accepts incomplete repeatable editorial items so renderers can omit only those items', () => {
    const edited = structuredClone(homepage);
    edited.features.items.push({ enabled: true });
    edited.faq.items.push({ enabled: true, question: '', answer: '' });

    const parsed = homepageSchema.parse(edited);

    expect(visibleItems(parsed.features.items, (item) => Boolean(item.heading && item.description))).toHaveLength(
      homepage.features.items.length,
    );
    expect(visibleItems(parsed.faq.items, (item) => Boolean(item.question && item.answer))).toHaveLength(
      homepage.faq.items.length,
    );
  });
});
