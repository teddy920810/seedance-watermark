import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

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

test('mobile visitors can open navigation and a dropdown', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  const menuButton = page.locator('[data-mobile-menu-toggle]');
  await menuButton.click();
  await expect(menuButton).toHaveAttribute('aria-expanded', 'true');

  const dropdown = page.locator('[data-nav-dropdown-trigger]').first();
  await dropdown.click();
  await expect(dropdown).toHaveAttribute('aria-expanded', 'true');
  await expect(dropdown.locator('xpath=..').locator('a').first()).toBeVisible();
});

test('all public content routes and 404 have one H1 and no serious accessibility violations', async ({ page, request }) => {
  const sitemap = await (await request.get('/sitemap.xml')).text();
  const routes = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]).pathname);
  routes.push('/missing-page-for-404-check');

  for (const route of routes) {
    const response = await page.goto(route, { waitUntil: 'networkidle' });
    expect(response?.status(), `${route} should return its expected status`).toBe(route.includes('missing-page') ? 404 : 200);
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('main h1'), `${route} should have exactly one content H1`).toHaveCount(1);
    if (route.includes('missing-page')) {
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow');
    }
    const results = await new AxeBuilder({ page }).analyze();
    expect(
      results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? '')),
      `${route} should have no serious accessibility violations`,
    ).toEqual([]);
  }
});

test('does not load Google Analytics until this site has its own measurement ID', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('script[src*="googletagmanager.com/gtag/js"]')).toHaveCount(0);
  await expect(page.locator('script').filter({ hasText: "gtag('config'" })).toHaveCount(0);
});



