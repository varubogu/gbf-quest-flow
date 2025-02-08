import { defineCollection, } from 'astro:content';
import { flowSchema } from '@/types/models';

const flowCollection = defineCollection({
  type: 'data',
  schema: flowSchema,
});

export const collections = {
  'flows': flowCollection,
};