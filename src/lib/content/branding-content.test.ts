import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const contentFiles = [
  '../../content/homepage/home.json',
  '../../content/settings/images.json',
  '../../content/settings/site.json',
  '../../content/settings/blog.json',
  '../../content/settings/not-found.json',
  '../../content/settings/sitemap.json',
  '../../content/landing-pages/remove-seedance-watermark.json',
  '../../content/landing-pages/seedance-watermark-from-video.json',
  '../../content/landing-pages/seedance-watermark-from-image.json',
  '../../content/legal/privacy.md',
  '../../content/legal/terms.md',
  '../../content/blog/how-to-remove-watermarks-responsibly.md',
  '../../content/blog/seedance-watermark-removal-guide.md',
];

describe('public brand content', () => {
  it('uses the Seedance Watermark Remover identity without old-site branding', () => {
    const content = contentFiles.map((file) => readFileSync(new URL(file, import.meta.url), 'utf8')).join('\n');

    expect(content).toContain('Seedance Watermark Remover');
    expect(content).toContain('Seedance watermark');
    expect(content).not.toContain('ClearMark AI');
    expect(content).not.toContain('WatermarkGemini');
    expect(content).not.toContain('watermarkgemini.com');
    expect(content).not.toContain('Gemini watermark');
  });

  it('gives every tool landing page its own process steps and FAQ section', () => {
    const landingPages = contentFiles
      .filter((file) => file.includes('/landing-pages/'))
      .map((file) => JSON.parse(readFileSync(new URL(file, import.meta.url), 'utf8')));

    for (const page of landingPages) {
      expect(page.process.steps.length).toBeGreaterThan(0);
      expect(page.faq.items.length).toBeGreaterThan(0);
    }

    expect(new Set(landingPages.map((page) => JSON.stringify(page.process))).size).toBe(landingPages.length);
    expect(new Set(landingPages.map((page) => JSON.stringify(page.faq))).size).toBe(landingPages.length);
  });
});
