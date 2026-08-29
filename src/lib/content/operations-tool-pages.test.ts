import { readFileSync, readdirSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const landingDirectory = new URL('../../content/landing-pages/', import.meta.url);
const landingPages = readdirSync(landingDirectory)
  .filter((name) => name.endsWith('.json'))
  .map((name) => JSON.parse(readFileSync(new URL(name, landingDirectory), 'utf8')) as {
    slug: string;
    template?: string;
    workspaceMode?: string;
    workspace?: { inputLabel?: string; actionLabel?: string };
    showcase?: { items?: unknown[] };
    features?: { items?: unknown[] };
    process?: { steps?: Array<{ icon?: string }> };
  });
const homepage = JSON.parse(readFileSync(new URL('../../content/homepage/home.json', import.meta.url), 'utf8')) as {
  useCases: Array<{ href: string }>;
};
const site = JSON.parse(readFileSync(new URL('../../content/settings/site.json', import.meta.url), 'utf8')) as {
  header: { navigation: Array<{ href?: string; children?: Array<{ href: string }> }> };
};

const operationsRoutes = [
  '/seedance-video-upscale',
  '/seedance-ai-generated',
  '/seedance-watermark-remover',
];

describe('operations tool pages', () => {
  it('publishes every operations-designed tool as an explicit preview route', () => {
    const bySlug = new Map(landingPages.map((page) => [`/${page.slug}`, page]));
    for (const route of operationsRoutes) {
      const page = bySlug.get(route);
      expect(page?.template).toBe('operations');
      expect(page?.workspaceMode).toMatch(/preview$/);
      expect(page?.workspace?.inputLabel).toBeTruthy();
      expect(page?.workspace?.actionLabel).toBeTruthy();
      expect(page?.showcase?.items).toHaveLength(4);
      expect(page?.features?.items).toHaveLength(3);
      expect(page?.process?.steps?.every((step) => Boolean(step.icon))).toBe(true);
    }
  });

  it('connects homepage cards and header navigation to those routes', () => {
    expect(homepage.useCases.map((item) => item.href)).toEqual(operationsRoutes);
    const navigationHrefs = site.header.navigation.flatMap((item) => [
      item.href,
      ...(item.children ?? []).map((child) => child.href),
    ]).filter(Boolean);
    expect(navigationHrefs).toEqual(expect.arrayContaining(operationsRoutes));
  });
});
