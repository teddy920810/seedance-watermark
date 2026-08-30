import { describe, expect, it } from 'vitest';
import { createMarkdownProcessor } from '@astrojs/markdown-remark';
import { readFileSync } from 'node:fs';
import { rehypeBlogPrompt, type HastNode } from './rehype-blog-prompt';

describe('blog prompt code blocks', () => {
  it('turns labelled text prompts into the reference row structure without changing their words', () => {
    const tree: HastNode = {
      type: 'root',
      children: [{
        type: 'element',
        tagName: 'pre',
        properties: {},
        children: [{
          type: 'element',
          tagName: 'code',
          properties: { className: ['language-text'] },
          children: [{ type: 'text', value: 'IDENTITY LOCK: Keep the face.\nLIGHT/MATERIAL: Soft highlights.\nSHOT: Medium shot.\n' }],
        }],
      }],
    };

    rehypeBlogPrompt()(tree);

    expect(tree.children?.[0]).toMatchObject({
      tagName: 'div',
      properties: { className: ['blog-prompt-text'] },
    });
    expect(JSON.stringify(tree)).toContain('Identity lock');
    expect(JSON.stringify(tree)).toContain('Keep the face.');
    expect(JSON.stringify(tree)).toContain('Light/material');
    expect(JSON.stringify(tree)).toContain('Soft highlights.');
    expect(JSON.stringify(tree)).toContain('Medium shot.');
  });

  it('leaves ordinary code blocks unchanged', () => {
    const tree: HastNode = {
      type: 'root',
      children: [{ type: 'element', tagName: 'pre', properties: {}, children: [] }],
    };
    rehypeBlogPrompt()(tree);
    expect(tree.children?.[0]?.tagName).toBe('pre');
    expect(tree.children?.[0]?.properties).toMatchObject({ tabIndex: 0 });
  });

  it('recognizes Astro highlighted text blocks after Shiki adds nested spans', () => {
    const tree: HastNode = {
      type: 'root',
      children: [{
        type: 'element',
        tagName: 'pre',
        properties: { className: ['astro-code'] },
        children: [{
          type: 'element',
          tagName: 'code',
          properties: {},
          children: [
            { type: 'element', tagName: 'span', properties: { className: ['line'] }, children: [{ type: 'element', tagName: 'span', properties: {}, children: [{ type: 'text', value: 'IDENTITY LOCK: Keep the face.' }] }] },
            { type: 'text', value: '\n' },
            { type: 'element', tagName: 'span', properties: { className: ['line'] }, children: [{ type: 'element', tagName: 'span', properties: {}, children: [{ type: 'text', value: 'SHOT: Medium shot.' }] }] },
          ],
        }],
      }],
    };

    rehypeBlogPrompt()(tree);

    expect(tree.children?.[0]).toMatchObject({
      tagName: 'div',
      properties: { className: ['blog-prompt-text'] },
    });
    expect(JSON.stringify(tree)).toContain('Keep the face.');
    expect(JSON.stringify(tree)).toContain('Medium shot.');
  });

  it('runs through the same highlighted Markdown pipeline used by Astro', async () => {
    const processor = await createMarkdownProcessor({ rehypePlugins: [rehypeBlogPrompt] });
    const result = await processor.render('```text\nIDENTITY LOCK: Keep the face.\nSHOT: Medium shot.\n```');

    expect(result.code).toContain('class="blog-prompt-text"');
    expect(result.code).not.toContain('<pre');
  });

  it('keeps plain-text prompts out of Shiki so the row transformer owns their markup', () => {
    const config = readFileSync('astro.config.mjs', 'utf8');
    expect(config).toContain("excludeLangs: ['math', 'text']");
  });

  it('wraps Markdown tables in a contained horizontal scroller', () => {
    const tree: HastNode = {
      type: 'root',
      children: [{ type: 'element', tagName: 'table', properties: {}, children: [] }],
    };

    rehypeBlogPrompt()(tree);

    expect(tree.children?.[0]).toMatchObject({
      tagName: 'div',
      properties: { className: ['blog-table-scroll'] },
      children: [{ tagName: 'table' }],
    });
  });

  it('wraps a GFM table through the Astro Markdown pipeline', async () => {
    const processor = await createMarkdownProcessor({ rehypePlugins: [rehypeBlogPrompt] });
    const result = await processor.render('| Check | Result |\n| --- | --- |\n| Face | Stable |');

    expect(result.code).toMatch(/<div class="blog-table-scroll">\s*<table>/);
  });
});
