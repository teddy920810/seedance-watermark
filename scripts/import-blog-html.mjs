import { parse } from 'parse5';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { pathToFileURL, URL } from 'node:url';
import process from 'node:process';
import console from 'node:console';
import { stringify } from 'yaml';

const children = (node) => node.childNodes ?? [];
const attr = (node, name) => node.attrs?.find((value) => value.name === name)?.value;
const all = (node) => [node, ...children(node).flatMap(all)];
const text = (node) => node.nodeName === '#text' ? node.value : children(node).map(text).join('');
const normalized = (value) => value.replace(/\s+/g, ' ').trim();
const hasClass = (node, name) => (attr(node, 'class') ?? '').split(/\s+/).includes(name);
const escapeText = (value) => value.replace(/([\\`*_[\]<>])/g, '\\$1');

function markdown(node, imagePath) {
  const tag = node.tagName;
  if (node.nodeName === '#text') return escapeText(node.value.replace(/\s+/g, ' '));
  if (node.nodeName === '#comment' || ['script', 'style'].includes(tag)) return '';
  if (tag === 'img') return `\n\n![${escapeText(attr(node, 'alt') ?? '')}](${imagePath(node)})\n\n`;
  const inner = () => children(node).map((child) => markdown(child, imagePath)).join('').trim();
  if (/^h[1-6]$/.test(tag)) return `\n\n${'#'.repeat(Number(tag[1]))} ${inner()}\n\n`;
  if (['p', 'figcaption'].includes(tag)) return `\n\n${inner()}\n\n`;
  if (['strong', 'b'].includes(tag)) return `**${inner()}**`;
  if (['em', 'i'].includes(tag)) return `*${inner()}*`;
  if (tag === 'br') return '\n';
  if (tag === 'a') {
    const href = attr(node, 'href') ?? '';
    if (!/^(https?:\/\/|\/|#)/.test(href)) throw new Error('Unsupported article link');
    return `[${inner()}](<${href}>)`;
  }
  if (tag === 'code') return `\`${text(node)}\``;
  if (tag === 'pre') return `\n\n\`\`\`\n${text(node).trim()}\n\`\`\`\n\n`;
  if (tag === 'blockquote') return `\n\n${inner().split('\n').map((line) => `> ${line}`).join('\n')}\n\n`;
  if (['ul', 'ol'].includes(tag)) {
    return '\n\n' + children(node).filter((child) => child.tagName === 'li').map((child, index) => {
      const prefix = tag === 'ul' ? '- ' : `${index + 1}. `;
      return prefix + markdown(child, imagePath).trim().replace(/\n/g, '\n' + ' '.repeat(prefix.length));
    }).join('\n') + '\n\n';
  }
  if (tag === 'table') {
    const rows = all(node).filter((child) => child.tagName === 'tr').map((row) =>
      children(row).filter((cell) => ['th', 'td'].includes(cell.tagName)).map((cell) => markdown(cell, imagePath).trim().replace(/\|/g, '\\|').replace(/\n+/g, ' ')));
    if (!rows.length) return '';
    const lines = rows.map((row) => `| ${row.join(' | ')} |`);
    lines.splice(1, 0, `| ${rows[0].map(() => '---').join(' | ')} |`);
    return `\n\n${lines.join('\n')}\n\n`;
  }
  return children(node).map((child) => markdown(child, imagePath)).join('');
}

export function importBlogHtml(html, publishedAt) {
  const nodes = all(parse(html));
  const first = (predicate) => nodes.find(predicate);
  const canonical = attr(first((node) => attr(node, 'rel') === 'canonical') ?? {}, 'href');
  const match = canonical && new URL(canonical).pathname.match(/^\/(?:blog|applications)\/([a-z0-9-]+)\/?$/);
  if (!match) throw new Error('Expected an explicit Blog canonical URL');
  const article = first((node) => node.tagName === 'article' && hasClass(node, 'blogArticle'));
  const heading = first((node) => node.tagName === 'h1');
  if (!article || !heading) throw new Error('Article or H1 missing');
  const meta = (name) => attr(first((node) => node.tagName === 'meta' && attr(node, 'name') === name) ?? {}, 'content');
  const byClass = (name) => first((node) => hasClass(node, name));
  const cta = byClass('blogCta');
  const ctaNodes = cta ? all(cta) : [];
  const ctaParagraphs = ctaNodes.filter((node) => node.tagName === 'p');
  const ctaLink = ctaNodes.find((node) => node.tagName === 'a');
  // Emit an explicit copy manifest: only article media, never the page shell.
  // Keep source bytes unchanged; /uploads routes use the existing CMS/WebP pipeline.
  const images = [];
  const imagePath = (node, role = 'body') => {
    const source = attr(node, 'src') ?? '';
    if (!/^assets\/(?:[a-z0-9_-]+\/)*[a-z0-9_-]+\.(?:png|jpe?g|webp|gif)$/i.test(source)) {
      throw new Error(`Unsupported article image path: ${source}`);
    }
    const target = `/uploads/blog/${match[1]}/${source.slice('assets/'.length)}`;
    images.push({ source, target, alt: attr(node, 'alt') ?? '', role });
    return target;
  };
  const cover = all(byClass('blogCover') ?? {}).find((node) => node.tagName === 'img');
  const coverImage = cover ? imagePath(cover, 'cover') : undefined;
  const metadata = {
    slug: match[1], title: normalized(text(heading)),
    seoTitle: normalized(text(first((node) => node.tagName === 'title') ?? {})),
    description: meta('description'), publishedAt,
    readTime: normalized(text(children(byClass('blogMeta') ?? {}).find((node) => node.tagName === 'span') ?? {})) || '8 min read',
    author: meta('author'), category: text(byClass('blogEyebrow') ?? {}).includes('APPLICATIONS') ? 'Seedance Applications' : 'Seedance Guides',
    eyebrow: normalized(text(byClass('blogEyebrow') ?? {})) || undefined,
    heroDescription: normalized(text(byClass('blogDek') ?? {})) || undefined,
    coverImage, coverAlt: cover ? attr(cover, 'alt') || undefined : undefined,
    coverCaption: normalized(text(all(byClass('blogCover') ?? {}).find((node) => node.tagName === 'figcaption') ?? {})) || undefined,
    ctaHeading: normalized(text(ctaNodes.find((node) => node.tagName === 'h2') ?? {})) || undefined,
    ctaLabel: ctaLink ? normalized(text(ctaLink)) : undefined,
    ctaHref: ctaLink ? attr(ctaLink, 'href') : undefined,
    featured: false, draft: false, contentMode: 'markdown',
  };
  const body = [markdown(article, imagePath), ...ctaParagraphs.map((node) => markdown(node, imagePath))].join('\n\n').replace(/\n[ \t]+\n/g, '\n\n').replace(/\n{3,}/g, '\n\n').trim();
  // Compare rendered text separately from Markdown syntax; preserve all editorial
  // body text, including figure captions and source editing notes.
  const bodyText = normalized([text(article), ...ctaParagraphs.map(text)].join(' '));
  return { metadata, body, images, sourceSha256: createHash('sha256').update(html).digest('hex'), bodyText,
    markdown: `---\n${stringify(metadata)}---\n\n${body}\n` };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [htmlPath, date] = process.argv.slice(2);
  if (!htmlPath || !/^\d{4}-\d{2}-\d{2}$/.test(date ?? '')) throw new Error('Usage: node scripts/import-blog-html.mjs <html-file> <publication-date>');
  console.log(JSON.stringify(importBlogHtml(readFileSync(htmlPath, 'utf8'), date)));
}
