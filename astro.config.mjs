import react from '@astrojs/react';
import { unified } from '@astrojs/markdown-remark';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import { readFileSync } from 'node:fs';
import { fileURLToPath, URL } from 'node:url';
import { omitMissingBlogImages } from './src/lib/content/remark-missing-blog-images';
import { rehypeBlogPrompt } from './src/lib/content/rehype-blog-prompt';
import { rehypeResponsiveImages } from './src/lib/content/rehype-responsive-images';

const siteSettings = JSON.parse(readFileSync(new URL('./src/content/settings/site.json', import.meta.url), 'utf8'));
const blogContentDirectory = fileURLToPath(new URL('./src/content/blog', import.meta.url));

export default defineConfig({
  site: siteSettings.canonicalOrigin,
  trailingSlash: 'never',
  output: 'server',
  adapter: vercel(),
  integrations: [react()],
  markdown: {
    syntaxHighlight: { type: 'shiki', excludeLangs: ['math', 'text'] },
    processor: unified({
      remarkPlugins: [[omitMissingBlogImages, { blogDirectory: blogContentDirectory }]],
      rehypePlugins: [rehypeBlogPrompt, rehypeResponsiveImages],
    }),
  },
  vite: { plugins: [tailwindcss()] },
});

