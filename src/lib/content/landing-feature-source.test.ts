import { readFileSync, readdirSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const readLanding = (name: string) => JSON.parse(
  readFileSync(new URL(`../../content/landing-pages/${name}.json`, import.meta.url), 'utf8'),
) as { featuresSource?: string; features?: { items?: unknown[] } };

describe('landing-page feature source migration', () => {
  it('keeps feature copy inside every independently editable landing page', () => {
    const names = readdirSync(new URL('../../content/landing-pages/', import.meta.url))
      .filter((name) => name.endsWith('.json'))
      .map((name) => name.replace(/\.json$/, ''));
    for (const name of names) {
      const page = readLanding(name);
      expect(page.featuresSource).toBeUndefined();
      expect(page.features?.items?.length).toBeGreaterThan(0);
    }
  });
});
