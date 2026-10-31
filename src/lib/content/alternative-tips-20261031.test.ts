import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { createMarkdownProcessor } from '@astrojs/markdown-remark';
import { parse as parseHtml } from 'parse5';
import { parse as parseYaml } from 'yaml';
import { describe, expect, it } from 'vitest';

interface ExpectedArticle {
  number: number;
  slug: string;
  metadata: Record<string, string | boolean>;
  bodyTextSha256: string;
  bodyTextCharacters: number;
  structure: Record<string, number>;
  images: Array<{ target: string; alt: string; role: string; sha256: string }>;
  links: string[];
}

// Captured independently from the source ZIP HTML and original image bytes,
// without using the importer under test. Only layout whitespace is ignored.
const articles = JSON.parse(readFileSync(new URL('./fixtures/alternative-tips-20261031.json', import.meta.url), 'utf8')) as ExpectedArticle[];
const sha256 = (value: string | Buffer) => createHash('sha256').update(value).digest('hex');
type HtmlNode = { nodeName: string; tagName?: string; value?: string; attrs?: Array<{ name: string; value: string }>; childNodes?: HtmlNode[] };
const allNodes = (node: HtmlNode): HtmlNode[] => [node, ...(node.childNodes ?? []).flatMap(allNodes)];
const visibleText = (node: HtmlNode): string => node.nodeName === '#text' ? node.value ?? '' : (node.childNodes ?? []).map(visibleText).join('');

describe('2026-10-31 Alternative Tips editorial batch', () => {
  it.each(articles)('preserves article $number metadata, original text and complete media', async (expected) => {
    const articlePath = new URL(`../../content/blog/${expected.slug}.md`, import.meta.url);
    expect(existsSync(articlePath), 'the due article is published as CMS Markdown').toBe(true);
    const article = readFileSync(articlePath, 'utf8');
    const frontmatter = article.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
    expect(frontmatter).not.toBeNull();
    expect(parseYaml(frontmatter![1])).toEqual(expected.metadata);

    // Match the punctuation-preserving unified processor in astro.config.mjs.
    const processor = await createMarkdownProcessor({ smartypants: false });
    const rendered = await processor.render(frontmatter![2]);
    const document = parseHtml(rendered.code) as HtmlNode;
    const text = visibleText(document).replace(/\s/g, '');
    expect(text.length).toBe(expected.bodyTextCharacters);
    expect(sha256(text), 'all source wording, punctuation, numbers, captions and CTA explanation remain in order').toBe(expected.bodyTextSha256);

    const nodes = allNodes(document);
    for (const [tag, count] of Object.entries(expected.structure)) {
      expect(nodes.filter(node => node.tagName === tag), `original ${tag} structure`).toHaveLength(count);
    }
    const bodyImages = nodes.filter(node => node.tagName === 'img').map(node => ({
      target: node.attrs?.find(attr => attr.name === 'src')?.value,
      alt: node.attrs?.find(attr => attr.name === 'alt')?.value ?? '',
    }));
    expect(bodyImages).toEqual(expected.images.filter(image => image.role === 'body').map(({ target, alt }) => ({ target, alt })));
    for (const image of expected.images) {
      const imagePath = new URL(`../../../public${image.target}`, import.meta.url);
      expect(existsSync(imagePath), `original ${image.role} image ${image.target}`).toBe(true);
      expect(sha256(readFileSync(imagePath)), `unchanged source bytes ${image.target}`).toBe(image.sha256);
    }
    const links = nodes.filter(node => node.tagName === 'a').map(node => node.attrs?.find(attr => attr.name === 'href')?.value ?? '');
    expect(links, 'all original article links remain unchanged and in source order').toEqual(expected.links);
    expect(nodes.some(node => node.tagName === 'script' || node.tagName === 'style')).toBe(false);
  });
});
