import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const posts = [
  {
    slug: 'ai-cartoon-avatar-seedance-2-0',
    title: 'AI Cartoon Avatar With Seedance 2.0: Build a Character That Stays On-Brand',
    cover: 'ai-cartoon-avatar-seedance-2-0.png',
  },
  {
    slug: 'the-lion-king-seedance-2-0',
    title: 'The Lion King and Seedance 2.0: Recreating Epic Animal Storytelling Without Copying the Film',
    cover: 'the-lion-king-seedance-2-0.png',
  },
  {
    slug: 'seedance-2-0-pixar-level-animation',
    title: 'Pixar-Level Animation With Seedance 2.0: A Repeatable Quality Test',
    cover: 'seedance-2-0-pixar-level-animation.png',
  },
  {
    slug: 'seedance-2-0-animation-2d',
    title: 'Seedance 2.0 Animation 2D: Control Lines, Timing and Style',
    cover: 'seedance-2-0-animation-2d.png',
  },
] as const;

describe('operations Word blog batch', () => {
  it.each(posts)('publishes $slug with its original cover and complete article structure', ({ slug, title, cover }) => {
    const articlePath = new URL(`../../content/blog/${slug}.md`, import.meta.url);
    const coverPath = new URL(`../../../public/uploads/${cover}`, import.meta.url);

    expect(existsSync(articlePath)).toBe(true);
    expect(existsSync(coverPath)).toBe(true);

    const article = readFileSync(articlePath, 'utf8');
    expect(article).toContain(`slug: ${slug}`);
    expect(article).toContain(`title: "${title}"`);
    expect(article).toContain('publishedAt: 2026-08-23');
    expect(article).toContain(`coverImage: /uploads/${cover}`);
    expect(article).toContain('category: Seedance 2.0 Guides');
    expect(article).toContain('draft: false');
    expect(article).toMatch(/\n## [^\n]+/);
    expect(article).toContain('\n## FAQ\n');
    expect(article).toContain('\n## Sources and further reading\n');
    expect(article).toContain('https://seed.bytedance.com/en/blog/official-launch-of-seedance-2-0');
    expect(article).not.toMatch(/\n# [^#]/);
  });
});
