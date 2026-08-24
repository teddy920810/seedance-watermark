import { afterEach, describe, expect, it } from 'vitest';
import { mkdtemp, mkdir, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import sharp from 'sharp';
import { auditResponsiveHtml, generateResponsiveImages } from '../../../scripts/responsive-images.mjs';
import { rehypeResponsiveImages, type HastNode } from './rehype-responsive-images';
import { responsiveSrcset, transformResponsiveHtml, type ResponsiveImageEntry } from './responsive-images';

const manifest = {
  version: 1,
  images: {
    '/uploads/example.png': {
      width: 1200,
      height: 800,
      variants: [
        { src: '/generated/example-640.webp', width: 640 },
        { src: '/generated/example-1200.webp', width: 1200 },
      ],
    },
  },
};

describe('responsive image build gate', () => {
  it('fails when WebP variants exist but the built HTML still uses a plain upload image', () => {
    const result = auditResponsiveHtml(
      '<main><img src="/uploads/example.png" alt="Example"></main>',
      manifest,
      'index.html',
    );

    expect(result.references).toBe(1);
    expect(result.issues).toEqual([
      expect.stringContaining('index.html: /uploads/example.png is not wrapped in a matching WebP picture'),
    ]);
  });

  it('accepts a matching WebP srcset while retaining the original fallback', () => {
    const html = '<picture><source type="image/webp" srcset="/generated/example-640.webp 640w, /generated/example-1200.webp 1200w"><img src="/uploads/example.png" alt="Example"></picture>';
    const result = auditResponsiveHtml(html, manifest, 'index.html');

    expect(result).toEqual({ references: 1, issues: [] });
    expect(html).toContain('<img src="/uploads/example.png"');
  });

  it('does not change the existing strategy for SVG, GIF, or WebP uploads', () => {
    const html = '<img src="/uploads/logo.svg"><img src="/uploads/demo.gif"><img src="/uploads/already.webp">';
    expect(auditResponsiveHtml(html, manifest, 'index.html')).toEqual({ references: 0, issues: [] });
  });

  it('reports a missing manifest entry separately from a missing picture', () => {
    const result = auditResponsiveHtml('<img src="/uploads/missing.jpg">', manifest, 'blog.html');
    expect(result.issues).toEqual(['blog.html: /uploads/missing.jpg has no generated image manifest entry']);
  });
});

const temporaryDirectories: string[] = [];
afterEach(async () => {
  await Promise.all(temporaryDirectories.splice(0).map((directory) => rm(directory, { recursive: true })));
});

describe('responsive image generation', () => {
  it('generates PNG and JPEG WebP variants without changing either original', async () => {
    const publicDirectory = await mkdtemp(join(tmpdir(), 'seedance-responsive-images-'));
    temporaryDirectories.push(publicDirectory);
    const uploads = join(publicDirectory, 'uploads');
    await mkdir(uploads);
    const pngPath = join(uploads, 'sample.png');
    const jpgPath = join(uploads, 'sample.jpg');
    await sharp({ create: { width: 800, height: 600, channels: 4, background: '#22d3ee' } }).png().toFile(pngPath);
    await sharp({ create: { width: 1024, height: 768, channels: 3, background: '#18243b' } }).jpeg().toFile(jpgPath);
    const [pngBefore, jpgBefore] = await Promise.all([readFile(pngPath), readFile(jpgPath)]);

    const result = await generateResponsiveImages({ publicDirectory, widths: [320, 640] });

    expect(result.sourceCount).toBe(2);
    expect(result.variantCount).toBe(6);
    expect(result.manifest.images['/uploads/sample.png'].variants).toHaveLength(3);
    expect(result.manifest.images['/uploads/sample.jpg'].variants).toHaveLength(3);
    expect(await readFile(pngPath)).toEqual(pngBefore);
    expect(await readFile(jpgPath)).toEqual(jpgBefore);
    const generatedJpeg = result.manifest.images['/uploads/sample.jpg'].variants.find(({ width }) => width === 640)!;
    await expect(readFile(join(publicDirectory, generatedJpeg.src))).resolves.toBeTruthy();
  });
});

const entry: ResponsiveImageEntry = manifest.images['/uploads/example.png'];
const resolveImage = (src: string) => src.endsWith('.png') || src.endsWith('.jpg') ? entry : undefined;

describe('CMS content rendering', () => {
  it('wraps trusted HTML raster images while preserving the original img tag', () => {
    const html = transformResponsiveHtml('<p><img class="wide" src="/uploads/example.jpg" alt="JPG"></p>', '50vw', resolveImage);
    expect(html).toContain('<picture class="responsive-picture">');
    expect(html).toContain('type="image/webp"');
    expect(html).toContain('<img class="wide" src="/uploads/example.jpg" alt="JPG">');
    expect(transformResponsiveHtml('<img src="/uploads/example.webp">', '100vw', resolveImage)).not.toContain('<picture');
  });

  it('turns Markdown image nodes into picture/source/img without rewriting the fallback', () => {
    const tree: HastNode = {
      type: 'root',
      children: [{
        type: 'element',
        tagName: 'p',
        children: [{ type: 'element', tagName: 'img', properties: { src: '/uploads/example.png', alt: 'PNG' }, children: [] }],
      }],
    };
    rehypeResponsiveImages({ resolveImage })(tree);
    const picture = tree.children![0].children![0];
    expect(picture.tagName).toBe('picture');
    expect(picture.children![0].properties).toMatchObject({ type: 'image/webp', srcSet: responsiveSrcset(entry) });
    expect(picture.children![1].properties).toMatchObject({ src: '/uploads/example.png', width: 1200, height: 800 });
  });
});
