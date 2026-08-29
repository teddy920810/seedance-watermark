import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { homepageSchema } from './homepage';

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
    expect(parsed.useCases).toHaveLength(3);
    expect(parsed.why.items).toHaveLength(3);
    expect(parsed.testimonials.primary.quote).toBeTruthy();
    expect(parsed.testimonials.secondary.quote).toBeTruthy();
    expect(parsed.workflows.items).toHaveLength(4);
  });

  it('defaults every workflow item to visible without changing stored content', () => {
    const parsed = homepageSchema.parse(homepage);
    expect(parsed.workflows.items.every((item) => item.enabled)).toBe(true);
  });

  it('accepts incomplete workflow items so the renderer can omit only those entries', () => {
    const edited = structuredClone(homepage);
    edited.workflows.items.push({ enabled: true });

    const parsed = homepageSchema.parse(edited);
    expect(parsed.workflows.items.at(-1)).toMatchObject({ enabled: true, title: '', image: '' });
  });
});
