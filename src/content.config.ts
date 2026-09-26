import { defineCollection } from 'astro:content';
import { file } from 'astro/loaders';
import { z } from 'astro/zod';

const sourceSchema = z.object({
  label: z.string(),
  url: z.url(),
});

const knowledgePages = defineCollection({
  loader: file('./src/data/knowledge-pages.json'),
  schema: z.object({
    id: z.string(),
    path: z.string(),
    parent: z.string().nullable(),
    kind: z.enum(['hub', 'topic', 'guide']),
    title: z.string(),
    description: z.string(),
    heading: z.string(),
    intro: z.string(),
    image: z.string(),
    imageAlt: z.string(),
    sections: z.array(z.object({ heading: z.string(), body: z.string() })),
    relatedPages: z.array(z.string()),
    affiliateLinkId: z.string().optional(),
  }),
});

const faq = defineCollection({
  loader: file('./src/data/faq.json'),
  schema: z.object({
    id: z.string(),
    question: z.string(),
    slug: z.string(),
    answer: z.string(),
    category: z.string(),
    relatedPages: z.array(z.string()),
    sources: z.array(sourceSchema),
    priority: z.number().int().positive(),
    searchVolume: z.number().int().nonnegative(),
    affiliateLinkId: z.string().optional(),
  }),
});

export const collections = { knowledgePages, faq };
