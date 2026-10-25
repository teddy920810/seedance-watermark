import { readFileSync } from 'node:fs';
import { createMarkdownProcessor } from '@astrojs/markdown-remark';
import { parse } from 'parse5';
import { describe, expect, it } from 'vitest';

const configSource = readFileSync(new URL('../../content.config.ts', import.meta.url), 'utf8');
const blogPageSource = readFileSync(new URL('../../pages/blog/[slug].astro', import.meta.url), 'utf8');
const astroConfigSource = readFileSync(new URL('../../../astro.config.mjs', import.meta.url), 'utf8');

describe('blog content mode', () => {
  it('models Markdown and HTML as explicit content choices', () => {
    expect(configSource).toContain('seoTitle: z.string().min(1).optional()');
    expect(configSource).toContain("contentMode: z.enum(['markdown', 'html']).default('markdown')");
    expect(configSource).toContain('bodyHtml: trustedHtmlSchema.optional()');
    expect(configSource).toContain("post.contentMode === 'html'");
  });

  it('renders trusted HTML only when HTML mode is selected', () => {
    expect(blogPageSource).toContain("post.data.contentMode === 'html'");
    expect(blogPageSource).toContain("transformResponsiveHtml(post.data.bodyHtml ?? '')");
    expect(blogPageSource).toContain('set:html={bodyHtml}');
    expect(blogPageSource).toContain('<Content />');
  });

  it('tolerates only missing images in Markdown blog bodies', () => {
    expect(astroConfigSource).toContain('omitMissingBlogImages');
    expect(astroConfigSource).toContain("new URL('./src/content/blog', import.meta.url)");
  });

  it('disables automatic punctuation rewriting in the actual unified processor', async () => {
    const processorOptions = astroConfigSource.match(/processor:\s*unified\(\{([\s\S]*?)\}\)/)?.[1];
    expect(processorOptions).toMatch(/smartypants:\s*false/);
    const processor = await createMarkdownProcessor({ smartypants: false });
    const source = `Kling's "approved" brief -- keep three dots... and 'literal' punctuation.`;
    const rendered = await processor.render(source);
    const visible = (node: { nodeName: string; value?: string; childNodes?: unknown[] }): string => node.nodeName === '#text'
      ? node.value ?? '' : (node.childNodes ?? []).map(child => visible(child as Parameters<typeof visible>[0])).join('');
    expect(visible(parse(rendered.code)).trim()).toBe(source);
  });
});
