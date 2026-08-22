import { describe, expect, it } from 'vitest';
import { collectSiteValidationReport } from '../../../scripts/site-validator.mjs';

const validInput = {
  envExample: 'SITE_URL=https://www.example.com\nBETTER_AUTH_URL=https://www.example.com\n',
  canonicalOrigin: 'https://www.example.com',
  contentDocuments: [
    {
      path: 'src/content/settings/site.json',
      value: {
        logo: '/uploads/logo.svg',
        defaultShareImage: '/uploads/share.webp',
        header: { navigation: [{ href: '/blog' }] },
      },
    },
  ],
  landingSlugs: ['remove-background'],
  blogSlugs: ['first-guide'],
  availableAssets: ['/uploads/logo.svg', '/uploads/share.webp'],
};

describe('site content validation', () => {
  it('accepts a coherent forked-site configuration', () => {
    expect(collectSiteValidationReport(validInput)).toEqual({ errors: [], warnings: [] });
  });

  it('finds missing assets, repository blob URLs, origin mismatches, and reserved routes', () => {
    const report = collectSiteValidationReport({
      ...validInput,
      envExample: 'SITE_URL=https://www.example.com\nBETTER_AUTH_URL=https://example.com\n',
      canonicalOrigin: 'https://www.other-example.com',
      landingSlugs: ['blog'],
      contentDocuments: [{
        path: 'src/content/blog/broken.md',
        value: '![Missing](/uploads/missing.webp) https://github.com/acme/site/blob/main/public/uploads/file.jpg',
      }],
    });

    expect(report.errors).toEqual(expect.arrayContaining([
      expect.stringContaining('SITE_URL and BETTER_AUTH_URL'),
      expect.stringContaining('canonical origin'),
      expect.stringContaining('reserved route /blog'),
    ]));
    expect(report.warnings).toEqual(expect.arrayContaining([
      expect.stringContaining('/uploads/missing.webp'),
      expect.stringContaining('GitHub blob URL'),
    ]));
  });

  it('finds broken internal links in structured content', () => {
    const report = collectSiteValidationReport({
      ...validInput,
      contentDocuments: [{ path: 'home.json', value: { href: '/missing-page' } }],
    });
    expect(report.errors).toEqual([]);
    expect(report.warnings).toContain('home.json: internal link /missing-page does not match a public route.');
  });

  it('warns instead of failing when an editorial navigation item is incomplete', () => {
    const report = collectSiteValidationReport({
      ...validInput,
      contentDocuments: [{
        path: 'src/content/settings/site.json',
        value: { header: { navigation: [{ label: 'Coming soon', children: [] }] } },
      }],
    });

    expect(report.errors).toEqual([]);
    expect(report.warnings).toContain(
      'src/content/settings/site.json: navigation item "Coming soon" has no usable link and will be hidden.',
    );
  });
});
