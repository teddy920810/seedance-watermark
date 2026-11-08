import { expect, test } from '@playwright/test';
import { readFileSync, readdirSync } from 'node:fs';
import { parse } from 'yaml';

const posts = readdirSync('src/content/blog').filter((file) => file.endsWith('.md')).map((file) => {
  const text = readFileSync(`src/content/blog/${file}`, 'utf8');
  return parse(text.split('---')[1]);
}).filter((post) => !post.draft).sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || String(b.publishedAt).localeCompare(String(a.publishedAt)));
const pageCount = Math.ceil(posts.length / 10);

test('every published article is reachable exactly once across ten-article pages', async ({ page }) => {
  const allLinks: string[] = [];
  for (let number = 1; number <= pageCount; number++) {
    const path = number === 1 ? '/blog' : `/blog/page/${number}`;
    await page.goto(path);
    const links = page.locator('.blog-list article h2 a');
    await expect(links).toHaveCount(Math.min(10, posts.length - (number - 1) * 10));
    const hrefs = await links.evaluateAll((elements) => elements.map((element) => element.getAttribute('href')!));
    expect(hrefs).toEqual(posts.slice((number - 1) * 10, number * 10).map((post) => `/blog/${post.slug}`));
    allLinks.push(...hrefs);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', new RegExp(`${path}$`));
    await expect(page.getByRole('navigation', { name: 'Blog pagination' }).locator('[aria-current="page"]')).toHaveText(String(number));
  }
  expect(new Set(allLinks).size).toBe(posts.length);
});

test('page controls work on mobile and unknown page URLs return 404', async ({ page, request }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/blog');
  const navigation = page.getByRole('navigation', { name: 'Blog pagination' });
  await expect(navigation.getByRole('link', { name: 'Previous', exact: true })).toHaveCount(0);
  await navigation.getByRole('link', { name: 'Next', exact: true }).click();
  await expect(page).toHaveURL(/\/blog\/page\/2$/);
  await page.getByRole('navigation', { name: 'Blog pagination' }).getByRole('link', { name: 'Previous', exact: true }).click();
  await expect(page).toHaveURL(/\/blog$/);
  await page.goto(`/blog/page/${pageCount}`);
  await expect(page.getByRole('navigation', { name: 'Blog pagination' }).getByRole('link', { name: 'Next', exact: true })).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('navigation', { name: 'Blog pagination' }).screenshot({ path: 'test-results/blog-pagination-mobile.png' });
  expect((await request.get(`/blog/page/${pageCount + 1}`)).status()).toBe(404);
  expect((await request.get('/blog/page/0')).status()).toBe(404);
  const xml = await (await request.get('/sitemap.xml')).text();
  for (let number = 2; number <= pageCount; number++) expect(xml).toContain(`/blog/page/${number}</loc>`);
});
