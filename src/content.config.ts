import { defineCollection } from 'astro:content';
import { file } from 'astro/loaders';
import { z } from 'astro/zod';

const categories = defineCollection({
  loader: file('./src/data/categories.json'),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    path: z.string(),
    eyebrow: z.string(),
    heading: z.string(),
    description: z.string(),
    image: z.string(),
    imageAlt: z.string(),
    tone: z.enum(['coral', 'sage', 'yellow']),
  }),
});

const products = defineCollection({
  loader: file('./src/data/products.json'),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    category: z.string(),
    summary: z.string(),
    image: z.string(),
    imageAlt: z.string(),
    palette: z.string(),
    availabilityNote: z.string(),
  }),
});

export const collections = { categories, products };
