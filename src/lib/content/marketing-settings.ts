import { z } from 'zod';

export const blogIndexSettingsSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1).max(180),
  shareImage: z.string().min(1),
  eyebrow: z.string().min(1),
  heading: z.string().min(1),
  intro: z.string().min(1),
  postsPerPage: z.number().int().min(1).max(100),
  articlePage: z.object({
    authorMark: z.string().min(1),
    bylineLabel: z.string().min(1),
    updatedLabel: z.string().min(1),
    publishedLabel: z.string().min(1),
    shareLabel: z.string().min(1),
    copyLabel: z.string().min(1),
    copiedLabel: z.string().min(1),
    tocLabel: z.string().min(1),
    breadcrumbHomeLabel: z.string().min(1),
    breadcrumbBlogLabel: z.string().min(1),
    cta: z.object({
      heading: z.string().min(1),
      label: z.string().min(1),
      href: z.string().regex(/^\/[a-z0-9/-]*$/),
    }),
  }),
});

export const notFoundSettingsSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1).max(180),
  eyebrow: z.string().min(1),
  heading: z.string().min(1),
  intro: z.string().min(1),
  buttonLabel: z.string().min(1),
  buttonHref: z.string().min(1),
});

export const legalPageSchema = z.object({
  slug: z.enum(['privacy', 'terms']),
  title: z.string().min(1),
  description: z.string().min(1).max(180),
  eyebrow: z.string().min(1),
  heading: z.string().min(1),
});
