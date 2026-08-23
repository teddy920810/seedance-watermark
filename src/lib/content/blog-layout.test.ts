import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const globalCss = readFileSync(new URL('../../styles/global.css', import.meta.url), 'utf8');

describe('blog article layout', () => {
  it('uses the reference article card and readable heading hierarchy', () => {
    expect(globalCss).toMatch(/\.article-body\s*\{[^}]*max-width:\s*900px[^}]*padding:\s*52px 58px[^}]*background:\s*var\(--card\)/s);
    expect(globalCss).toContain('.article-body > p:first-child');
    expect(globalCss).toContain('.article-body h3');
  });

  it('styles rich editorial tables, lists, quotes, links, and prompt blocks', () => {
    expect(globalCss).toContain('.article-body blockquote');
    expect(globalCss).toContain('.article-body ul, .article-body ol');
    expect(globalCss).toContain('.article-body li::marker');
    expect(globalCss).toMatch(/\.article-body table\s*\{[^}]*overflow-x:\s*auto/s);
    expect(globalCss).toContain('.article-body th, .article-body td');
    expect(globalCss).toContain('.article-body pre');
    expect(globalCss).toContain('.article-body pre code');
  });

  it('removes the desktop card edges and tightens typography on phones', () => {
    expect(globalCss).toMatch(/@media \(max-width: 620px\)[\s\S]*\.article-body\s*\{[^}]*border-right:\s*0[^}]*border-left:\s*0[^}]*border-radius:\s*0/s);
  });
});
