import { z } from 'zod';

const linkedCardSchema = z.object({
  enabled: z.boolean().default(true),
  icon: z.string().default(''),
  badge: z.string().default(''),
  title: z.string().default(''),
  description: z.string().default(''),
  href: z.string().default(''),
  linkLabel: z.string().default(''),
  image: z.string().default(''),
  imageAlt: z.string().default(''),
});

const stepSchema = z.object({
  number: z.string().default(''),
  title: z.string().default(''),
  description: z.string().default(''),
});

const testimonialSchema = z.object({
  quote: z.string().min(1),
  name: z.string().min(1),
  role: z.string().min(1),
});

const workflowSchema = z.object({
  enabled: z.boolean().default(true),
  image: z.string().default(''),
  imageAlt: z.string().default(''),
  label: z.string().default(''),
  title: z.string().default(''),
});

export const homepageSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1).max(180),
  shareImage: z.string().min(1),
  hero: z.object({
    eyebrow: z.string().min(1),
    heading: z.string().min(1),
    highlightedHeading: z.string().min(1),
    intro: z.string().min(1),
    trustItems: z.array(z.string().min(1)).min(1),
    ctaLabel: z.string().default(''),
    ctaHref: z.string().default(''),
    image: z.string().default(''),
    imageAlt: z.string().default(''),
    imageBadge: z.string().default(''),
  }),
  useCases: z.array(linkedCardSchema).min(1),
  tools: z.object({
    eyebrow: z.string().min(1),
    heading: z.string().min(1),
    intro: z.string().min(1),
  }),
  why: z.object({
    eyebrow: z.string().min(1),
    heading: z.string().min(1),
    items: z.array(stepSchema).min(1),
  }),
  testimonials: z.object({
    rating: z.string().min(1),
    primary: testimonialSchema,
    secondary: testimonialSchema,
  }),
  workflows: z.object({
    eyebrow: z.string().min(1),
    heading: z.string().min(1),
    items: z.array(workflowSchema).min(1),
  }),
});

export type Homepage = z.infer<typeof homepageSchema>;
