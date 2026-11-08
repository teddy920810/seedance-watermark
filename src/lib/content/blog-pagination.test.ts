import { describe, expect, it } from 'vitest';
import { paginateBlogPosts } from './blog-pagination';

describe('blog pagination', () => {
  it('shows ten per page, preserves order and includes all 31 posts exactly once', () => {
    const posts = Array.from({ length: 31 }, (_, index) => `post-${index + 1}`);
    const pages = paginateBlogPosts(posts, 10);
    expect(pages.map((page) => page.posts.length)).toEqual([10, 10, 10, 1]);
    expect(pages.flatMap((page) => page.posts)).toEqual(posts);
    expect(pages[1]).toMatchObject({ number: 2, path: '/blog/page/2', previous: '/blog', next: '/blog/page/3', start: 11, end: 20 });
    expect(pages[0].previous).toBeUndefined();
    expect(pages[3].next).toBeUndefined();
  });
  it('starts page two at article eleven and never adds an empty trailing page', () => {
    expect(paginateBlogPosts(Array.from({ length: 10 }), 10)).toHaveLength(1);
    expect(paginateBlogPosts(Array.from({ length: 11 }), 10).map((page) => page.posts.length)).toEqual([10, 1]);
    expect(paginateBlogPosts(Array.from({ length: 20 }), 10)).toHaveLength(2);
    expect(paginateBlogPosts([], 10)[0]).toMatchObject({ posts: [], start: 0, end: 0, path: '/blog' });
    for (const size of [0, -1, 1.5]) expect(() => paginateBlogPosts([], size)).toThrow();
  });
});
