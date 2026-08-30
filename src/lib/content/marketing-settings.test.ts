import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  blogIndexSettingsSchema,
  notFoundSettingsSchema,
} from './marketing-settings';

function readJson(path: string) {
  return JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'));
}

describe('marketing page CMS settings', () => {
  it('validates the blog listing settings', () => {
    const parsed = blogIndexSettingsSchema.parse(readJson('../../content/settings/blog.json'));
    expect(parsed.postsPerPage).toBeGreaterThan(0);
    expect(parsed.articlePage.shareLabel).toMatch(/\S/);
    expect(parsed.articlePage.tocLabel).toMatch(/\S/);
    expect(parsed.articlePage.cta.href).toMatch(/^\//);
  });

  it('validates the 404 page settings', () => {
    const parsed = notFoundSettingsSchema.parse(readJson('../../content/settings/not-found.json'));
    expect(parsed.heading).toMatch(/\S/);
  });
});
