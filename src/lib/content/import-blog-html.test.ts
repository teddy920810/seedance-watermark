import { describe, expect, it } from 'vitest';
import { importBlogHtml } from '../../../scripts/import-blog-html.mjs';
import { createMarkdownProcessor } from '@astrojs/markdown-remark';
import { parse } from 'parse5';

function visibleText(node: unknown): string {
  const value = node as { nodeName: string; value?: string; childNodes?: unknown[] };
  return value.nodeName === '#text' ? value.value ?? '' : (value.childNodes ?? []).map(visibleText).join('');
}

describe('editorial HTML import', () => {
  it('preserves editorial wording and semantic blocks without importing the page shell', () => {
    const html = `<html><head><title>Original SEO</title><meta name="description" content="Original summary"><link rel="canonical" href="https://seedances.co/blog/example"></head><body><header>Do not import navigation</header><h1>Original title</h1><p class="blogDek">Original introduction</p><article class="blogArticle"><h2>Original section</h2><p>Before publication: Add tested results. A &amp; B.</p><ul><li>One</li><li>Two</li></ul><blockquote><p>Keep this claim.</p></blockquote><table><thead><tr><th>Name</th><th>Value</th></tr></thead><tbody><tr><td>A</td><td>B</td></tr></tbody></table><figure><img src="assets/test.png"><figcaption>Figure 1. Original caption</figcaption></figure></article><section class="blogCta"><h2>Try it</h2><p>Original CTA explanation.</p><a href="/seedance-ai-generated">Start →</a></section><footer>Do not import footer</footer><script>untrusted()</script></body></html>`;
    const result = importBlogHtml(html, '2026-09-12');
    expect(result.metadata.slug).toBe('example');
    expect(result.metadata.title).toBe('Original title');
    expect(result.metadata.ctaHeading).toBe('Try it');
    expect(result.metadata.ctaLabel).toBe('Start →');
    expect(result.body).toContain('Before publication: Add tested results. A & B.');
    expect(result.body).toContain('## Original section');
    expect(result.body).toContain('- One\n- Two');
    expect(result.body).toContain('> Keep this claim.');
    expect(result.body).toContain('| Name | Value |');
    expect(result.body).toContain('Figure 1. Original caption');
    expect(result.body).toContain('Original CTA explanation.');
    expect(result.body).not.toMatch(/navigation|footer|untrusted|assets\//);
    expect(result.body).toContain('![](/uploads/blog/example/test.png)');
  });

  it('imports Applications as a Blog category as requested by the publisher', () => {
    const result = importBlogHtml('<link rel="canonical" href="https://seedances.co/applications/example"><h1>Title</h1><p class="blogEyebrow">SEEDANCE APPLICATIONS</p><article class="blogArticle"><p>Original application text.</p></article>', '2026-09-12');
    expect(result.metadata.slug).toBe('example');
    expect(result.metadata.eyebrow).toBe('SEEDANCE APPLICATIONS');
    expect(result.metadata.category).toBe('Seedance Applications');
  });

  it('imports the original hero and every body image, retaining alt, captions and order', () => {
    const source = `<link rel="canonical" href="https://seedances.co/blog/example"><h1>Title</h1><header><img src="assets/logo.svg"></header><figure class="blogCover"><img src="assets/hero.png" alt="Original hero"><figcaption>Original caption</figcaption></figure><article class="blogArticle"><p>Before.</p><figure><img src="assets/figure-1.jpg" alt="A &amp; [B]"><figcaption>Figure one.</figcaption></figure><p>After.</p><img src="assets/figure-2.jpeg" alt="Two"></article>`;
    const result = importBlogHtml(source, '2026-09-13');
    expect(result.metadata.coverImage).toBe('/uploads/blog/example/hero.png');
    expect(result.metadata.coverAlt).toBe('Original hero');
    expect(result.metadata.coverCaption).toBe('Original caption');
    expect(result.body).toContain('![A & \\[B\\]](/uploads/blog/example/figure-1.jpg)');
    expect(result.body).toContain('![Two](/uploads/blog/example/figure-2.jpeg)');
    expect(result.body.indexOf('figure-1.jpg')).toBeLessThan(result.body.indexOf('Figure one.'));
    expect(result.images).toEqual([
      { source: 'assets/hero.png', target: '/uploads/blog/example/hero.png', alt: 'Original hero', role: 'cover' },
      { source: 'assets/figure-1.jpg', target: '/uploads/blog/example/figure-1.jpg', alt: 'A & [B]', role: 'body' },
      { source: 'assets/figure-2.jpeg', target: '/uploads/blog/example/figure-2.jpeg', alt: 'Two', role: 'body' },
    ]);
    expect(result.bodyText).toBe('Before.Figure one.After.');
  });

  it.each(['../private.png', 'assets/../private.png', 'assets//x.png', 'https://example.com/x.png', 'data:image/png;base64,abc', 'assets/x.svg', 'assets/x.png?download=1'])('does not silently drop or copy unsupported image path %s', (src) => {
    expect(() => importBlogHtml(`<link rel="canonical" href="https://seedances.co/blog/example"><h1>Title</h1><article class="blogArticle"><img src="${src}"></article>`, '2026-09-13')).toThrow(/image/i);
  });

  it('renders literal brackets and punctuation without changing the source text', async () => {
    const source = '<link rel="canonical" href="https://seedances.co/blog/example"><h1>Title</h1><article class="blogArticle"><h2>Header</h2><p>Use [subject], A &amp; B, *literal* and a_b.</p><p>Before publication: Add results.</p></article>';
    const result = importBlogHtml(source, '2026-09-12');
    const processor = await createMarkdownProcessor();
    const rendered = await processor.render(result.body);
    expect(visibleText(parse(rendered.code)).replace(/\s/g, '')).toBe(result.bodyText.replace(/\s/g, ''));
  });
});
