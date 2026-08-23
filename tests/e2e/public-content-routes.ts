import { readdirSync, readFileSync } from 'node:fs';

const blogDirectory = new URL('../../src/content/blog/', import.meta.url);
const landingDirectory = new URL('../../src/content/landing-pages/', import.meta.url);

const blogRoutes = readdirSync(blogDirectory)
  .filter((name) => name.endsWith('.md'))
  .map((name) => {
    const source = readFileSync(new URL(name, blogDirectory), 'utf8');
    const slug = source.match(/^slug:\s*["']?([^"'\r\n]+)["']?\s*$/m)?.[1];
    if (!slug) throw new Error(`Missing blog slug in ${name}`);
    return `/blog/${slug}`;
  });

const landingRoutes = readdirSync(landingDirectory)
  .filter((name) => name.endsWith('.json'))
  .map((name) => {
    const source = JSON.parse(readFileSync(new URL(name, landingDirectory), 'utf8')) as { slug?: string };
    if (!source.slug) throw new Error(`Missing landing-page slug in ${name}`);
    return `/${source.slug}`;
  });

export const publicContentRoutes = [...new Set(['/', '/blog', '/privacy', '/terms', ...blogRoutes, ...landingRoutes])].sort();
