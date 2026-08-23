import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const homepageSource = readFileSync(new URL('../../pages/index.astro', import.meta.url), 'utf8');
const landingSource = readFileSync(new URL('../../components/LandingPage.astro', import.meta.url), 'utf8');
const layoutSource = readFileSync(new URL('../../layouts/SiteLayout.astro', import.meta.url), 'utf8');

describe('marketing page structure', () => {
  it('keeps the homepage static and sends visitors to tool pages', () => {
    expect(homepageSource).not.toContain("import ImageUploader");
    expect(homepageSource).not.toContain('client:load');
    expect(homepageSource).toContain('home-hero-visual');
    expect(homepageSource).toContain('tool-showcase-grid');
  });

  it('keeps the interactive workspace on landing pages only', () => {
    expect(landingSource).toContain("import ImageUploader");
    expect(landingSource).toContain('client:load');
    expect(landingSource).toContain('product-workspace');
    expect(landingSource).toContain('final-cta');
  });

  it('supports a marketing visual treatment without forcing it on editorial pages', () => {
    expect(layoutSource).toContain("variant?: 'marketing' | 'editorial'");
    expect(layoutSource).toContain('page-${variant}');
  });
});
