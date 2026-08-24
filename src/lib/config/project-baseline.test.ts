import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const readProjectFile = (path: string) => readFileSync(new URL(`../../../${path}`, import.meta.url), 'utf8');

describe('project baseline configuration', () => {
  it('uses the Astro development origin for imported Google OAuth credentials', () => {
    const importer = readProjectFile('scripts/import-google-credentials.mjs');
    const guide = readProjectFile('docs/DEVELOPER_GUIDE.md');
    expect(importer).toContain("BETTER_AUTH_URL', 'http://localhost:4321'");
    expect(importer).toContain('http://localhost:4321/api/auth/callback/google');
    expect(guide).toContain('http://localhost:4321/api/auth/callback/google');
    expect(importer).not.toContain('localhost:3000');
  });

  it('does not register the chunked Astro sitemap integration', () => {
    const astroConfig = readProjectFile('astro.config.mjs');
    const packageJson = JSON.parse(readProjectFile('package.json')) as { dependencies: Record<string, string> };
    expect(astroConfig).not.toContain("from '@astrojs/sitemap'");
    expect(astroConfig).not.toContain('sitemap()');
    expect(packageJson.dependencies).not.toHaveProperty('@astrojs/sitemap');
  });

  it('audits every public sitemap route and the 404 page for accessibility and heading structure', () => {
    const e2e = readProjectFile('tests/e2e/site-quality.spec.ts');
    const routes = readProjectFile('tests/e2e/public-content-routes.ts');
    expect(e2e).toContain("request.get('/sitemap.xml')");
    expect(e2e).toContain('for (const route of publicContentRoutes)');
    expect(e2e).toContain("page.goto('/missing-page-for-404-check'");
    expect(routes).toContain("readdirSync(blogDirectory)");
    expect(routes).toContain("readdirSync(landingDirectory)");
    expect(e2e).toContain("page.locator('main h1')");
    expect(e2e).toContain('new AxeBuilder({ page }).analyze()');
  });

  it('isolates Playwright from local development servers', () => {
    const playwright = readProjectFile('playwright.config.ts');
    expect(playwright).toContain("baseURL: 'http://127.0.0.1:4323'");
    expect(playwright).toContain("command: 'npm run images:generate --silent && npx astro dev --host 127.0.0.1 --port 4323'");
    expect(playwright).toContain("url: 'http://127.0.0.1:4323'");
    expect(playwright).toContain('reuseExistingServer: false');
    expect(playwright).not.toContain('reuseExistingServer: true');
  });

  it('validates direct-main CMS saves without requiring operators to manage a draft branch', () => {
    const workflow = readProjectFile('.github/workflows/cms-content-check.yml');
    const packageJson = JSON.parse(readProjectFile('package.json')) as { scripts: Record<string, string> };

    expect(workflow).toContain('workflow_dispatch:');
    expect(workflow).toContain('branches: [main]');
    expect(workflow).toContain('npm run content:validate');
    expect(packageJson.scripts['content:validate']).toBe('astro sync');
    expect(existsSync(new URL('../../../.github/workflows/cms-publish.yml', import.meta.url))).toBe(false);
  });
});

