import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const globalCss = readFileSync(new URL('../../styles/global.css', import.meta.url), 'utf8');
const blogPage = readFileSync(new URL('../../pages/blog/[slug].astro', import.meta.url), 'utf8');
const shareComponent = readFileSync(new URL('../../components/blog/BlogShare.astro', import.meta.url), 'utf8');

describe('blog article layout', () => {
  it('uses the dark reference hero, breadcrumb, sticky contents, article, and CTA structure', () => {
    expect(blogPage).toContain('variant="marketing"');
    expect(blogPage).toContain('class="blog-hero"');
    expect(blogPage).toContain('class="blog-breadcrumb"');
    expect(blogPage).toContain('class="blog-layout"');
    expect(blogPage).toContain('class="blog-toc"');
    expect(blogPage).toContain("class:list={['blog-article-body'");
    expect(blogPage).toContain('class="blog-cta"');
    expect(globalCss).toMatch(/\.blog-layout\s*\{[^}]*grid-template-columns:\s*220px minmax\(0,760px\)/s);
    expect(globalCss).toMatch(/\.blog-toc\s*\{[^}]*position:\s*sticky/s);
    expect(globalCss).toMatch(/body\.page-marketing:has\(\.blog-page\)[^{]*\{[^}]*font-family:\s*Inter/s);
    expect(globalCss).toMatch(/\.blog-hero \.blog-dek\s*\{[^}]*color:\s*var\(--blog-muted\)/s);
  });

  it('styles rich editorial tables, lists, quotes, links, and structured prompt blocks', () => {
    expect(globalCss).toContain('.blog-article-body blockquote');
    expect(globalCss).toContain('.blog-article-body ul, .blog-article-body ol');
    expect(globalCss).toContain('.blog-article-body li::marker');
    expect(globalCss).toContain('.blog-article-body table');
    expect(globalCss).toMatch(/\.blog-article-body table\s*\{[^}]*min-width:\s*0[^}]*overflow-x:\s*auto/s);
    expect(globalCss).toMatch(/\.blog-article-body thead, \.blog-article-body tbody\s*\{[^}]*min-width:\s*560px/s);
    expect(globalCss).toContain('.blog-prompt-text');
  });

  it('exposes reusable social sharing and collapses the desktop contents column on small screens', () => {
    expect(blogPage).toContain("import BlogShare from '../../components/blog/BlogShare.astro'");
    expect(shareComponent).toContain('twitter.com/intent/tweet');
    expect(shareComponent).toContain('linkedin.com/sharing/share-offsite');
    expect(shareComponent).toContain('facebook.com/sharer/sharer.php');
    expect(shareComponent).toContain('navigator.clipboard.writeText');
    expect(globalCss).toMatch(/@media \(max-width: 960px\)[\s\S]*\.blog-toc\s*\{[^}]*display:\s*none/s);
  });
});
