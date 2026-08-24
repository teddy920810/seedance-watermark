import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export interface ResponsiveImageEntry {
  width: number;
  height: number;
  variants: Array<{ src: string; width: number }>;
}

interface ResponsiveImageManifest {
  version: number;
  images: Record<string, ResponsiveImageEntry>;
}

let cachedManifest: ResponsiveImageManifest | undefined;

function manifest(): ResponsiveImageManifest {
  if (cachedManifest) return cachedManifest;
  try {
    cachedManifest = JSON.parse(readFileSync(
      resolve(process.cwd(), 'public', 'generated', 'manifest.json'),
      'utf8',
    )) as ResponsiveImageManifest;
  } catch {
    cachedManifest = { version: 1, images: {} };
  }
  return cachedManifest;
}

export function getResponsiveImage(src: string): ResponsiveImageEntry | undefined {
  const cleanSrc = src.split(/[?#]/, 1)[0];
  if (!/^\/uploads\/.+\.(?:png|jpe?g)$/i.test(cleanSrc)) return undefined;
  return manifest().images[cleanSrc];
}

export function responsiveSrcset(entry: ResponsiveImageEntry): string {
  return entry.variants.map((variant) => `${variant.src} ${variant.width}w`).join(', ');
}

function escapeAttribute(value: string): string {
  return value.replaceAll('&', '&amp;').replaceAll('"', '&quot;');
}

export function transformResponsiveHtml(
  html: string,
  sizes = '(max-width: 960px) 100vw, 960px',
  resolveImage: (src: string) => ResponsiveImageEntry | undefined = getResponsiveImage,
): string {
  const pictureRanges = [...html.matchAll(/<picture\b[^>]*>[\s\S]*?<\/picture>/gi)].map((match) => ({
    start: match.index ?? 0,
    end: (match.index ?? 0) + match[0].length,
  }));
  return html.replace(/<img\b[^>]*\bsrc\s*=\s*(["'])(.*?)\1[^>]*>/gi, (tag, _quote, src, offset) => {
    if (pictureRanges.some((range) => range.start <= offset && range.end >= offset + tag.length)) return tag;
    const entry = resolveImage(src);
    if (!entry) return tag;
    return `<picture class="responsive-picture"><source type="image/webp" srcset="${escapeAttribute(responsiveSrcset(entry))}" sizes="${escapeAttribute(sizes)}">${tag}</picture>`;
  });
}
