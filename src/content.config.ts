import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod';
import { publishedAtSchema } from './lib/content/published-date';
import { homepageSchema } from './lib/content/homepage';
import { siteSettingsSchema } from './lib/content/site-settings';
import { imageSettingsSchema } from './lib/content/image-metadata';
import { trustedHtmlSchema } from './lib/content/trusted-html';
import { sitemapSettingsSchema } from './lib/content/sitemap-settings';
import {
  blogIndexSettingsSchema,
  legalPageSchema,
  notFoundSettingsSchema,
} from './lib/content/marketing-settings';

const siteSettings = defineCollection({
  loader: glob({ base: './src/content/settings', pattern: 'site.json' }),
  schema: siteSettingsSchema,
});

const imageSettings = defineCollection({
  loader: glob({ base: './src/content/settings', pattern: 'images.json' }),
  schema: imageSettingsSchema,
});

const blogIndexSettings = defineCollection({
  loader: glob({ base: './src/content/settings', pattern: 'blog.json' }),
  schema: blogIndexSettingsSchema,
});

const notFoundSettings = defineCollection({
  loader: glob({ base: './src/content/settings', pattern: 'not-found.json' }),
  schema: notFoundSettingsSchema,
});

const sitemapSettings = defineCollection({
  loader: glob({ base: './src/content/settings', pattern: 'sitemap.json' }),
  schema: sitemapSettingsSchema,
});

const legalPages = defineCollection({
  loader: glob({ base: './src/content/legal', pattern: '**/*.{md,mdx}' }),
  schema: legalPageSchema,
});

const homepage = defineCollection({
  loader: glob({ base: './src/content/homepage', pattern: '**/*.json' }),
  schema: homepageSchema,
});

const blogEntrySchema = z.object({
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    title: z.string().min(1),
    seoTitle: z.string().min(1).optional(),
    description: z.string().min(1),
    publishedAt: publishedAtSchema,
    updatedAt: publishedAtSchema.optional(),
    readTime: z.string().min(1),
    coverImage: z.string().min(1).optional(),
    coverAlt: z.string().min(1).optional(),
    author: z.string().min(1).optional(),
    category: z.string().min(1).optional(),
    contentMode: z.enum(['markdown', 'html']).default('markdown'),
    bodyHtml: trustedHtmlSchema.optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }).superRefine((post, context) => {
    if (post.contentMode === 'html' && !post.bodyHtml) {
      context.addIssue({ code: 'custom', path: ['bodyHtml'], message: 'HTML content is required in HTML mode.' });
    }
  });

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: blogEntrySchema,
});

const faqItem = z.object({
  enabled: z.boolean().default(true),
  question: z.string().default(''),
  answer: z.string().default(''),
});

const landingProcessSchema = z.object({
  eyebrow: z.string().min(1),
  heading: z.string().min(1),
  steps: z.array(z.object({
    number: z.string().default(''),
    icon: z.string().default(''),
    title: z.string().default(''),
    description: z.string().default(''),
  })).min(1),
});

const landingFaqSchema = z.object({
  eyebrow: z.string().default(''),
  heading: z.string().default(''),
  items: z.array(faqItem).default([]),
});

const landingFeatureItemSchema = z.object({
  enabled: z.boolean().default(true),
  number: z.string().default(''),
  eyebrow: z.string().default(''),
  heading: z.string().default(''),
  description: z.string().default(''),
  listItems: z.array(z.string().min(1)).default([]),
  image: z.string().default(''),
  imageAlt: z.string().default(''),
  imagePosition: z.enum(['left', 'right']).default('right'),
});

const landingFeaturesSchema = z.object({
  eyebrow: z.string().default(''),
  heading: z.string().default(''),
  highlightedHeading: z.string().default(''),
  intro: z.string().default(''),
  items: z.array(landingFeatureItemSchema).default([]),
});

const landingShowcaseSchema = z.object({
  eyebrow: z.string().default(''),
  heading: z.string().default(''),
  highlightedHeading: z.string().default(''),
  intro: z.string().default(''),
  mode: z.enum(['comparison', 'generator', 'watermark']).default('generator'),
  items: z.array(z.object({
    enabled: z.boolean().default(true),
    image: z.string().default(''),
    imageAlt: z.string().default(''),
    label: z.string().default(''),
    title: z.string().default(''),
    description: z.string().default(''),
  })).default([]),
});

const landingPages = defineCollection({
  loader: glob({ base: './src/content/landing-pages', pattern: '**/*.json' }),
  schema: z.object({
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    template: z.enum(['legacy', 'operations']).default('legacy'),
    title: z.string().min(1),
    description: z.string().min(1),
    eyebrow: z.string().min(1),
    heading: z.string().min(1),
    highlightedHeading: z.string().default(''),
    intro: z.string().min(1),
    benefits: z.array(z.string().min(1)).min(1),
    workspaceMode: z.enum(['image-upload', 'video-preview', 'prompt-preview']).default('image-upload'),
    workspace: z.object({
      eyebrow: z.string().default(''),
      heading: z.string().default(''),
      inputLabel: z.string().default(''),
      inputHelp: z.string().default(''),
      placeholder: z.string().default(''),
      options: z.array(z.string().min(1)).default([]),
      actionLabel: z.string().default(''),
      previewNote: z.string().default(''),
    }).default({
      eyebrow: '', heading: '', inputLabel: '', inputHelp: '', placeholder: '', options: [], actionLabel: '', previewNote: '',
    }),
    finalCta: z.object({
      heading: z.string().default(''),
      label: z.string().default(''),
    }).default({ heading: '', label: '' }),
    process: landingProcessSchema,
    showcase: landingShowcaseSchema.optional(),
    features: landingFeaturesSchema,
    faq: landingFaqSchema.default({ eyebrow: '', heading: '', items: [] }),
  }),
});

export const collections = {
  siteSettings,
  imageSettings,
  blogIndexSettings,
  notFoundSettings,
  sitemapSettings,
  legalPages,
  homepage,
  blog,
  landingPages,
};
