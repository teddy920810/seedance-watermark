import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { siteSettingsSchema, usableHeaderNavigation } from './site-settings';

const settings = JSON.parse(
  readFileSync(new URL('../../content/settings/site.json', import.meta.url), 'utf8'),
);

describe('site settings CMS content', () => {
  it('matches the site settings schema', () => {
    expect(siteSettingsSchema.safeParse(settings).success).toBe(true);
  });

  it('contains the CMS-managed site sections required to render the shared layout', () => {
    const parsed = siteSettingsSchema.parse(settings);
    expect(parsed.locale).toMatch(/\S/);
    expect(new URL(parsed.canonicalOrigin).protocol).toBe('https:');
    expect(parsed.themeColor).toMatch(/^#[0-9a-f]{6}$/i);
    expect(parsed.themeColorFallback).toMatch(/^#[0-9a-f]{6}$/i);
    expect(parsed.name).toMatch(/\S/);
    expect(parsed.logo).toMatch(/\S/);
    expect(parsed.defaultShareImage).toMatch(/\S/);
    expect(parsed.header.navigation.length).toBeGreaterThan(0);
    expect(parsed.footer.links.length).toBeGreaterThan(0);
    expect(parsed.uploader.hero.heading).toBeTruthy();
    expect(parsed.uploader.dropzone.fileInputLabel).toBeTruthy();
  });

  it('requires a canonical HTTPS origin without a path', () => {
    const invalid = structuredClone(settings);
    invalid.canonicalOrigin = 'https://www.watermarkgemini.com/blog';
    expect(siteSettingsSchema.safeParse(invalid).success).toBe(false);
  });

  it('allows analytics to be disabled but rejects malformed measurement IDs', () => {
    const disabled = structuredClone(settings);
    disabled.analytics.googleMeasurementId = '';
    expect(siteSettingsSchema.safeParse(disabled).success).toBe(true);

    const malformed = structuredClone(settings);
    malformed.analytics.googleMeasurementId = 'UA-123';
    expect(siteSettingsSchema.safeParse(malformed).success).toBe(false);
  });

  it('supports one-level dropdown links in the header navigation', () => {
    const dropdownSettings = structuredClone(settings);
    dropdownSettings.header.navigation[0].children = [
      { label: 'Remove logos', href: '/remove-logo-from-image' },
      { label: 'Remove text', href: '/remove-text-from-image' },
    ];

    const parsed = siteSettingsSchema.parse(dropdownSettings);
    expect(parsed.header.navigation[0].children).toHaveLength(2);
  });

  it('accepts an incomplete editorial navigation item and omits it at render time', () => {
    const incomplete = structuredClone(settings);
    incomplete.header.navigation.push({ label: 'Coming soon' });

    const parsed = siteSettingsSchema.parse(incomplete);

    expect(usableHeaderNavigation(parsed.header.navigation, new Set(['/blog']))).not.toContainEqual(
      expect.objectContaining({ label: 'Coming soon' }),
    );
  });

  it('omits unavailable internal links and keeps valid, fragment, and external links', () => {
    const navigation = [
      { label: 'Missing', href: '/missing', children: [] },
      { label: 'Blog', href: '/blog', children: [] },
      { label: 'Section', href: '#tool', children: [] },
      { label: 'External', href: 'https://example.com', children: [] },
      { label: 'Tools', href: '', children: [
        { label: 'Missing child', href: '/missing-child' },
        { label: 'Existing child', href: '/existing' },
      ] },
    ];

    expect(usableHeaderNavigation(navigation, new Set(['/blog', '/existing']))).toEqual([
      navigation[1], navigation[2], navigation[3],
      { ...navigation[4], children: [navigation[4].children[1]] },
    ]);
  });
});

