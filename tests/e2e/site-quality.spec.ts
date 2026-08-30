import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { publicContentRoutes } from './public-content-routes';

const siteSettings = JSON.parse(readFileSync(new URL('../../src/content/settings/site.json', import.meta.url), 'utf8')) as {
  analytics: { googleMeasurementId: string };
};
const sharedLanding = JSON.parse(readFileSync(new URL('../../src/content/landing-pages/seedance-watermark-from-image.json', import.meta.url), 'utf8')) as {
  slug: string;
  features: { heading: string; intro?: string; items: Array<{ heading: string }> };
};
const customLanding = JSON.parse(readFileSync(new URL('../../src/content/landing-pages/seedance-watermark-from-video.json', import.meta.url), 'utf8')) as {
  slug: string;
  features: { heading: string; intro?: string; items: Array<{ heading: string }> };
};

test('critical public routes and SEO files are available', async ({ page, request }) => {
  for (const path of ['/', '/blog', '/privacy', '/robots.txt', '/sitemap.xml']) {
    const response = await request.get(path);
    expect(response.ok(), `${path} should be available`).toBeTruthy();
  }
  await page.goto('/');
  await expect(page).toHaveTitle(/\S/);
  const canonicalHref = await page.locator('link[rel=canonical]').getAttribute('href');
  expect(canonicalHref).toBeTruthy();
  const canonical = new URL(canonicalHref!);
  expect(canonical.protocol).toBe('https:');
  expect(canonical.pathname).toBe('/');

  const sitemapResponse = await request.get('/sitemap.xml');
  const sitemap = await sitemapResponse.text();
  expect(sitemap).toContain('<urlset');
  expect(sitemap).toContain(`<loc>${new URL('/blog', canonical).toString()}</loc>`);
  expect(sitemap).toMatch(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/);
  expect(sitemap).toMatch(/<changefreq>[a-z]+<\/changefreq>/);
  expect(sitemap).toMatch(/<priority>\d\.\d<\/priority>/);
  expect(sitemap).not.toContain('sitemap-index.xml');
});

test('homepage is a static tool directory while landing pages own the workspace', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#tool')).toHaveCount(0);
  await expect(page.locator('#tool astro-island')).toHaveCount(0);
  await expect(page.locator('.tool-showcase-grid')).toBeVisible();

  await page.goto(`/${sharedLanding.slug}`);
  await expect(page.locator('#tool astro-island')).toBeVisible();
});

test('CMS raster images use generated WebP sources with original fallbacks', async ({ page, request }) => {
  await page.goto('/');
  const png = page.locator('.home-hero-visual img');
  await expect(png).toBeVisible();
  await expect(png.locator('xpath=..')).toHaveJSProperty('tagName', 'PICTURE');
  await expect(png.locator('xpath=..').locator('source[type="image/webp"]')).toHaveAttribute('srcset', /\/generated\/.*\.webp/);
  await expect(png).toHaveAttribute('src', /\/uploads\/.*\.png/);
  await expect.poll(() => png.evaluate((image: HTMLImageElement) => image.currentSrc)).toMatch(/\/generated\/.*\.webp/);

  await page.goto('/blog/ai-cartoon-avatar-seedance-2-0');
  const blogCover = page.locator('.blog-cover img');
  await expect(blogCover).toBeVisible();
  await expect(blogCover.locator('xpath=..')).toHaveJSProperty('tagName', 'PICTURE');
  await expect(blogCover).toHaveAttribute('src', /\/uploads\/.*\.png/);
  await expect.poll(() => blogCover.evaluate((image: HTMLImageElement) => image.currentSrc)).toMatch(/\/generated\/.*\.webp/);

  const manifest = await (await request.get('/generated/manifest.json')).json() as {
    images: Record<string, { variants: Array<{ src: string; width: number }> }>;
  };
  const jpegSource = Object.keys(manifest.images).find((src) => /\.jpe?g$/i.test(src));
  expect(jpegSource, 'an uploaded JPEG should exercise the same browser selection path').toBeTruthy();
  const jpegSrcset = manifest.images[jpegSource!].variants.map(({ src, width }) => `${src} ${width}w`).join(', ');
  await page.evaluate(({ src, srcset }) => {
    const picture = document.createElement('picture');
    const source = document.createElement('source');
    source.type = 'image/webp';
    source.srcset = srcset;
    const image = document.createElement('img');
    image.id = 'jpeg-responsive-fixture';
    image.src = src;
    image.alt = 'Uploaded JPEG responsive selection fixture';
    picture.append(source, image);
    document.body.append(picture);
  }, { src: jpegSource!, srcset: jpegSrcset });
  const jpeg = page.locator('#jpeg-responsive-fixture');
  await expect(jpeg.locator('xpath=..')).toHaveJSProperty('tagName', 'PICTURE');
  await expect(jpeg).toHaveAttribute('src', /\/uploads\/.*\.jpe?g/i);
  await expect.poll(() => jpeg.evaluate((image: HTMLImageElement) => image.currentSrc)).toMatch(/\/generated\/.*\.webp/);
});

test('homepage tool cards open the three operations tool pages', async ({ page, request }) => {
  const routes = ['/seedance-video-upscale', '/seedance-ai-generated', '/seedance-watermark-remover'];
  await page.goto('/');
  for (const route of routes) {
    await expect(page.locator(`.tool-showcase-grid a[href="${route}"]`)).toBeVisible();
    expect((await request.get(route)).ok(), `${route} should be published`).toBeTruthy();
  }
});

for (const route of [
  '/blog/ai-cartoon-avatar-seedance-2-0',
  '/blog/the-lion-king-seedance-2-0',
  '/blog/seedance-2-0-pixar-level-animation',
  '/blog/seedance-2-0-animation-2d',
]) {
  test(`publishes ${route} with its original cover`, async ({ page, request }) => {
    expect((await request.get(route)).ok(), `${route} should be published`).toBeTruthy();
    await page.goto(route);
    await expect(page.locator('article.blog-article-body')).toBeVisible();
    await expect(page.locator('.blog-cover img')).toBeVisible();
    await expect(page.locator('main h1')).toHaveCount(1);
  });
}

test('mobile visitors can open navigation while invalid editorial links stay hidden', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  const menuButton = page.locator('[data-mobile-menu-toggle]');
  await menuButton.click();
  await expect(menuButton).toHaveAttribute('aria-expanded', 'true');

  await expect(page.locator('#site-navigation')).toBeVisible();
  for (const route of ['/seedance-video-upscale', '/seedance-ai-generated', '/seedance-watermark-remover']) {
    await expect(page.locator(`#site-navigation a[href="${route}"]`)).toBeVisible();
  }
  await expect(page.locator('#site-navigation a')).toHaveCount(3);
});

test('landing pages own their feature content independently from the homepage', async ({ page }) => {
  await page.goto(`/${sharedLanding.slug}`);
  const sharedSection = page.locator('.landing-features-section');
  await expect(sharedSection.locator('h2')).toHaveText(sharedLanding.features.heading);
  await expect(sharedSection.locator('.feature-item h3').first()).toHaveText(sharedLanding.features.items[0].heading);

  await page.goto(`/${customLanding.slug}`);
  const customSection = page.locator('.landing-features-section');
  await expect(customSection.locator('h2')).toHaveText(customLanding.features.heading);
  await expect(customSection.locator('.section-heading p')).toHaveText(customLanding.features.intro ?? '');
  await expect(customSection.locator('.feature-item h3').first()).toHaveText(customLanding.features.items[0].heading);
});

for (const route of publicContentRoutes) {
  test(`${route} has one H1 and no serious accessibility violations`, async ({ page }) => {
    const response = await page.goto(route, { waitUntil: 'domcontentloaded' });
    expect(response?.status(), `${route} should return 200`).toBe(200);
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('main h1'), `${route} should have exactly one content H1`).toHaveCount(1);
    const results = await new AxeBuilder({ page }).analyze();
    expect(
      results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? '')),
      `${route} should have no serious accessibility violations`,
    ).toEqual([]);
  });
}

test('404 has one H1, noindex, and no serious accessibility violations', async ({ page }) => {
  const response = await page.goto('/missing-page-for-404-check', { waitUntil: 'domcontentloaded' });
  expect(response?.status()).toBe(404);
  await expect(page.locator('main h1')).toHaveCount(1);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
});

test('renders the CMS-configured Google Analytics state', async ({ request }) => {
  const html = await (await request.get('/')).text();
  const analyticsId = siteSettings.analytics.googleMeasurementId;

  if (!analyticsId) {
    expect(html).not.toContain('googletagmanager.com/gtag/js');
    expect(html).not.toContain("gtag('config'");
    return;
  }

  // Official contract and verification guidance: https://developers.google.com/tag-platform/gtagjs
  expect(html).toContain(`https://www.googletagmanager.com/gtag/js?id=${analyticsId}`);
  expect(html).toContain(`const analyticsId = ${JSON.stringify(analyticsId)}`);
  expect(html).toContain("gtag('config', analyticsId)");
});



