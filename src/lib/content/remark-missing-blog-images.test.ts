import { join } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import { omitMissingBlogImages } from './remark-missing-blog-images';

type TestNode = {
  type: string;
  url?: string;
  identifier?: string;
  value?: string;
  children?: TestNode[];
};

const blogDirectory = join('repo', 'src', 'content', 'blog');

function imageTree(...urls: string[]): TestNode {
  return {
    type: 'root',
    children: [{ type: 'paragraph', children: urls.map((url) => ({ type: 'image', url })) }],
  };
}

describe('missing blog image tolerance', () => {
  it('omits a missing relative body image and reports a non-fatal warning', () => {
    const warn = vi.fn();
    const tree = imageTree('missing/image.png');

    omitMissingBlogImages({ blogDirectory, exists: () => false, warn })(tree, {
      path: join(blogDirectory, 'post.md'),
    });

    expect(tree.children?.[0].children?.[0]).toEqual({
      type: 'html',
      value: '<!-- Missing blog image omitted: missing/image.png -->',
    });
    expect(warn).toHaveBeenCalledWith('[content] Missing blog image omitted: post.md -> missing/image.png');
  });

  it('preserves existing, public, remote, data, and non-blog images', () => {
    const warn = vi.fn();
    const urls = ['existing.png', '/uploads/public.png', 'https://example.com/remote.png', 'data:image/png;base64,AA'];
    const tree = imageTree(...urls);
    const transformer = omitMissingBlogImages({
      blogDirectory,
      exists: (path) => path.endsWith('existing.png'),
      warn,
    });

    transformer(tree, { path: join(blogDirectory, 'post.md') });
    transformer(imageTree('missing.png'), { path: join('repo', 'src', 'content', 'legal', 'privacy.md') });

    expect(tree.children?.[0].children?.map((node) => node.url)).toEqual(urls);
    expect(warn).not.toHaveBeenCalled();
  });

  it('omits a missing reference-style image using its definition URL', () => {
    const warn = vi.fn();
    const tree: TestNode = {
      type: 'root',
      children: [
        { type: 'paragraph', children: [{ type: 'imageReference', identifier: 'diagram' }] },
        { type: 'definition', identifier: 'diagram', url: 'missing/diagram.png' },
      ],
    };

    omitMissingBlogImages({ blogDirectory, exists: () => false, warn })(tree, {
      path: join(blogDirectory, 'post.md'),
    });

    expect(tree.children?.[0].children?.[0]).toEqual({
      type: 'html',
      value: '<!-- Missing blog image omitted: missing/diagram.png -->',
    });
    expect(warn).toHaveBeenCalledWith('[content] Missing blog image omitted: post.md -> missing/diagram.png');
  });
});
