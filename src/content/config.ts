import { defineCollection, z } from 'astro:content';

const actionSchema = z.object({
  hp: z.string(),
  prediction: z.string(),
  charge: z.string(),
  guard: z.string(),
  action: z.string(),
  note: z.string().optional(),
});

const flowCollection = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    author: z.string(),
    updatedAt: z.string(),
    videoUrl: z.string().optional(),
    awareness: z.array(z.string()),
    actions: z.array(actionSchema),
  }),
});

export const collections = {
  'flows': flowCollection,
};