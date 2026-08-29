import { z } from 'zod';

const canonicalOriginSchema = z.url().refine((value) => {
  const url = new URL(value);
  return url.protocol === 'https:' && url.pathname === '/' && !url.search && !url.hash;
}, 'Canonical origin must be an HTTPS origin without a path, query, or hash.');

const navigationLinkSchema = z.object({
  label: z.string().default(''),
  href: z.string().default(''),
});

const headerNavigationItemSchema = z.object({
  label: z.string().default(''),
  href: z.string().default(''),
  children: z.array(navigationLinkSchema).default([]),
});

type NavigationLink = z.infer<typeof navigationLinkSchema>;
type HeaderNavigationItem = z.infer<typeof headerNavigationItemSchema>;

export function isUsableEditorialHref(href: string, publicRoutes: ReadonlySet<string>): boolean {
  const value = href.trim();
  if (!value) return false;
  if (value.startsWith('#') || value.startsWith('//') || /^[a-z][a-z\d+.-]*:/i.test(value)) return true;
  if (!value.startsWith('/')) return false;
  const route = value.split(/[?#]/, 1)[0].replace(/\/$/, '') || '/';
  return route.startsWith('/api/') || route.startsWith('/uploads/') || publicRoutes.has(route);
}

function usableLink(link: NavigationLink, publicRoutes: ReadonlySet<string>): boolean {
  return Boolean(link.label.trim()) && isUsableEditorialHref(link.href, publicRoutes);
}

export function usableHeaderNavigation(
  items: readonly HeaderNavigationItem[],
  publicRoutes: ReadonlySet<string>,
): HeaderNavigationItem[] {
  return items.flatMap((item) => {
    if (!item.label.trim()) return [];
    const children = item.children.filter((child) => usableLink(child, publicRoutes));
    if (children.length > 0) return [{ ...item, children }];
    return isUsableEditorialHref(item.href, publicRoutes) ? [{ ...item, children: [] }] : [];
  });
}

const uploaderCopySchema = z.object({
  hero: z.object({
    eyebrow: z.string().min(1), heading: z.string().min(1), demoBadge: z.string().min(1), demoBadgeTitle: z.string().min(1),
  }),
  dropzone: z.object({
    dropLabel: z.string().min(1), browseLabel: z.string().min(1), formatLabel: z.string().min(1), maxSizeLabel: z.string().min(1), fileInputLabel: z.string().min(1),
  }),
  preview: z.object({
    altTemplate: z.string().min(1), processingLabel: z.string().min(1), readyLabel: z.string().min(1), removeButton: z.string().min(1), uploadingButton: z.string().min(1), processingButton: z.string().min(1), chooseAnotherButton: z.string().min(1),
  }),
  result: z.object({
    originalLabel: z.string().min(1), resultLabel: z.string().min(1), originalAlt: z.string().min(1), resultAlt: z.string().min(1), demoNote: z.string().min(1), downloadButton: z.string().min(1), processAnotherButton: z.string().min(1),
  }),
  auth: z.object({
    closeLabel: z.string().min(1), title: z.string().min(1), description: z.string().min(1), connectingButton: z.string().min(1), continueButton: z.string().min(1), dismissButton: z.string().min(1),
  }),
  privacyNote: z.string().min(1),
});

export type UploaderCopy = z.infer<typeof uploaderCopySchema>;

export const siteSettingsSchema = z.object({
  name: z.string().min(1),
  canonicalOrigin: canonicalOriginSchema,
  locale: z.string().min(2),
  themeColor: z.string().regex(/^#[0-9a-f]{6}$/i),
  themeColorFallback: z.string().regex(/^#[0-9a-f]{6}$/i),
  logo: z.string().min(1),
  defaultTitle: z.string().min(1),
  defaultDescription: z.string().min(1).max(180),
  favicon: z.string().min(1),
  defaultShareImage: z.string().min(1),
  analytics: z.object({
    googleMeasurementId: z.union([z.literal(''), z.string().regex(/^G-[A-Z0-9]+$/)]),
  }),
  structuredData: z.object({
    applicationCategory: z.string().min(1),
    operatingSystem: z.string().min(1),
    price: z.string().min(1),
    priceCurrency: z.string().regex(/^[A-Z]{3}$/),
  }),
  contentDefaults: z.object({
    author: z.string().min(1),
    category: z.string().min(1),
  }),
  uploader: uploaderCopySchema,
  announcement: z.object({
    enabled: z.boolean(),
    text: z.string().min(1),
    linkLabel: z.string(),
    linkHref: z.string(),
  }),
  header: z.object({
    logo: z.string().min(1),
    loginLabel: z.string().min(1),
    connectingLabel: z.string().min(1),
    navigation: z.array(headerNavigationItemSchema).min(1),
  }),
  footer: z.object({
    logo: z.string().min(1),
    tagline: z.string().min(1),
    groups: z.array(z.object({
      label: z.string().min(1),
      links: z.array(navigationLinkSchema).min(1),
    })).min(1),
    copyright: z.string().min(1),
  }),
});

export type SiteSettings = z.infer<typeof siteSettingsSchema>;
