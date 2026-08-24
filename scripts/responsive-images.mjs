/* global console, process */

import { existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { extname, join, relative, resolve, sep } from 'node:path';
import { pathToFileURL } from 'node:url';
import sharp from 'sharp';

const DEFAULT_WIDTHS = [320, 640, 960, 1280, 1600];
const RASTER_UPLOAD = /^\/uploads\/.+\.(?:png|jpe?g)(?:[?#].*)?$/i;

function publicUrl(path) {
  return `/${path.split(sep).join('/')}`;
}

async function walk(directory) {
  if (!existsSync(directory)) return [];
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  }));
  return files.flat();
}

export function isOptimizableUpload(src) {
  return RASTER_UPLOAD.test(src);
}

export async function generateResponsiveImages({
  publicDirectory = resolve(process.cwd(), 'public'),
  widths = DEFAULT_WIDTHS,
} = {}) {
  const uploadsDirectory = join(publicDirectory, 'uploads');
  const generatedDirectory = join(publicDirectory, 'generated');
  const sourceFiles = (await walk(uploadsDirectory))
    .filter((file) => /\.(?:png|jpe?g)$/i.test(file))
    .sort((left, right) => left.localeCompare(right));
  const images = {};
  let variantCount = 0;

  for (const sourceFile of sourceFiles) {
    const sourceBytes = await readFile(sourceFile);
    const contentHash = createHash('sha256').update(sourceBytes).digest('hex').slice(0, 10);
    const metadata = await sharp(sourceBytes).metadata();
    if (!metadata.width || !metadata.height) {
      throw new Error(`Cannot read image dimensions: ${relative(publicDirectory, sourceFile)}`);
    }
    const sourceRelative = relative(uploadsDirectory, sourceFile);
    const extension = extname(sourceRelative);
    const stem = sourceRelative.slice(0, -extension.length);
    const targetWidths = [...new Set([...widths.filter((width) => width < metadata.width), metadata.width])]
      .sort((left, right) => left - right);
    const variants = [];

    for (const width of targetWidths) {
      const targetRelative = `${stem}-${contentHash}-${width}.webp`;
      const targetFile = join(generatedDirectory, targetRelative);
      await mkdir(resolve(targetFile, '..'), { recursive: true });
      await sharp(sourceBytes)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 82 })
        .toFile(targetFile);
      variants.push({ src: publicUrl(join('generated', targetRelative)), width });
      variantCount += 1;
    }

    images[publicUrl(join('uploads', sourceRelative))] = {
      width: metadata.width,
      height: metadata.height,
      variants,
    };
  }

  await mkdir(generatedDirectory, { recursive: true });
  const manifest = { version: 1, images };
  await writeFile(join(generatedDirectory, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  return { manifest, sourceCount: sourceFiles.length, variantCount };
}

function attribute(tag, name) {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*(["'])(.*?)\\1`, 'i'));
  return match?.[2];
}

export function auditResponsiveHtml(html, manifest, fileName) {
  const issues = [];
  const pictures = [...html.matchAll(/<picture\b[^>]*>[\s\S]*?<\/picture>/gi)].map((match) => ({
    start: match.index ?? 0,
    end: (match.index ?? 0) + match[0].length,
    html: match[0],
  }));
  let references = 0;

  for (const match of html.matchAll(/<img\b[^>]*>/gi)) {
    const tag = match[0];
    const src = attribute(tag, 'src');
    if (!src || !isOptimizableUpload(src)) continue;
    references += 1;
    const cleanSrc = src.split(/[?#]/, 1)[0];
    const entry = manifest.images[cleanSrc];
    if (!entry) {
      issues.push(`${fileName}: ${cleanSrc} has no generated image manifest entry`);
      continue;
    }
    const offset = match.index ?? 0;
    const picture = pictures.find((candidate) => candidate.start <= offset && candidate.end >= offset + tag.length);
    const sourceTag = picture?.html.match(/<source\b[^>]*\btype\s*=\s*(["'])image\/webp\1[^>]*>/i)?.[0];
    const srcset = sourceTag ? attribute(sourceTag, 'srcset') : undefined;
    const expectedSources = entry.variants.map((variant) => variant.src);
    const hasMatchingSet = srcset && expectedSources.every((source) => srcset.includes(source));
    if (!picture || !hasMatchingSet) {
      issues.push(`${fileName}: ${cleanSrc} is not wrapped in a matching WebP picture`);
    }
  }

  return { references, issues };
}

export async function verifyResponsiveBuild({
  rootDirectory = process.cwd(),
  manifestPath = resolve(rootDirectory, 'public', 'generated', 'manifest.json'),
} = {}) {
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  const candidates = [
    resolve(rootDirectory, '.vercel', 'output', 'static'),
    resolve(rootDirectory, 'dist', 'client'),
    resolve(rootDirectory, 'dist'),
  ];
  const outputDirectory = candidates.find((candidate) => existsSync(candidate));
  if (!outputDirectory) throw new Error('No production HTML output directory was found.');
  const htmlFiles = (await walk(outputDirectory)).filter((file) => file.endsWith('.html'));
  if (htmlFiles.length === 0) throw new Error(`No static HTML files were found under ${outputDirectory}.`);
  const issues = [];
  let references = 0;
  for (const file of htmlFiles) {
    const result = auditResponsiveHtml(
      await readFile(file, 'utf8'),
      manifest,
      publicUrl(relative(outputDirectory, file)),
    );
    references += result.references;
    issues.push(...result.issues);
  }
  if (issues.length > 0) throw new Error(`Responsive image build gate failed:\n${issues.join('\n')}`);
  return { htmlCount: htmlFiles.length, references, outputDirectory };
}

async function main() {
  if (process.argv.includes('--verify')) {
    const result = await verifyResponsiveBuild();
    console.log(`responsive-images: verified html=${result.htmlCount} references=${result.references}`);
    return;
  }
  const result = await generateResponsiveImages();
  console.log(`responsive-images: generated sources=${result.sourceCount} variants=${result.variantCount}`);
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
