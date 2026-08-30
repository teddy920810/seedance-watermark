import { expect, test, type Page } from '@playwright/test';

const representativeArticle = '/blog/seedance-2-0-animation-2d';

async function installRichContentFixture(page: Page) {
  await page.goto(representativeArticle);
  await page.locator('article.blog-article-body').evaluate((article) => {
    article.innerHTML = `
      <h2>Rich editorial sample</h2>
      <h3>Lists and quotation</h3>
      <blockquote><p><strong>Editorial note.</strong> This quotation verifies the real article renderer.</p></blockquote>
      <ul><li>Unordered item</li><li>Second item</li></ul>
      <ol><li>First step</li><li>Second step</li></ol>
      <table>
        <thead><tr><th>Stage</th><th>Input</th><th>Constraint</th><th>Review</th><th>Outcome</th></tr></thead>
        <tbody><tr><td>Draft</td><td>Reference</td><td>Stable identity</td><td>Human check</td><td>Approved result</td></tr></tbody>
      </table>
      <pre><code>STYLE LOCK: preserve line weight and palette.</code></pre>
    `;
  });
}

test('risk sample covers homepage, tool, blog list, new article, and legacy article', async ({ page }) => {
  const samples = [
    { route: '/', marker: '.tool-showcase-grid' },
    { route: '/seedance-video-upscale', marker: '#tool astro-island' },
    { route: '/blog', marker: '.blog-list' },
    { route: representativeArticle, marker: 'article.blog-article-body' },
    { route: '/blog/how-to-remove-watermarks-responsibly', marker: 'article.blog-article-body' },
  ];

  for (const sample of samples) {
    await page.goto(sample.route);
    await expect(page.locator('main h1')).toHaveCount(1);
    await expect(page.locator(sample.marker)).toBeVisible();
  }
});

test('real article CSS renders rich blocks on desktop', async ({ page }) => {
  await installRichContentFixture(page);
  const article = page.locator('article.blog-article-body');
  const quote = article.locator('blockquote');
  const table = article.locator('table');

  await expect(quote).toBeVisible();
  await expect(article.locator('ul')).toHaveCSS('list-style-type', 'disc');
  await expect(article.locator('ol')).toHaveCSS('list-style-type', 'decimal');
  await expect(table).toHaveCSS('overflow-x', 'auto');
  await expect(article.locator('pre')).not.toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  expect(await quote.evaluate((element) => Number.parseFloat(getComputedStyle(element).borderLeftWidth))).toBeGreaterThanOrEqual(3);
});

test('wide rich content stays contained on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await installRichContentFixture(page);
  const table = page.locator('article.blog-article-body table');

  await expect(page.locator('article.blog-article-body blockquote')).toBeVisible();
  expect(await table.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
