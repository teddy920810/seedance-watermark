import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { buildSitemapEntries, renderSitemapXml } from '../lib/content/sitemap';

export const prerender = true;

export const GET: APIRoute = async ({ site }) => {
  if (!site) throw new Error('Astro site URL is required to generate sitemap.xml.');
  const [posts, landingPages, sitemapSettingsEntries, blogSettingsEntries] = await Promise.all([
    getCollection('blog'),
    getCollection('landingPages'),
    getCollection('sitemapSettings'),
    getCollection('blogIndexSettings'),
  ]);
  const [settings] = sitemapSettingsEntries;
  if (!settings) throw new Error('Sitemap CMS settings are missing.');
  const [blogSettings] = blogSettingsEntries;
  if (!blogSettings) throw new Error('Blog index CMS settings are missing.');
  const entries = buildSitemapEntries({
    posts: posts.map(({ data }) => data),
    landingPages: landingPages.map(({ data }) => data),
    settings: settings.data,
    postsPerPage: blogSettings.data.postsPerPage,
  });

  return new Response(renderSitemapXml(site, entries), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};

