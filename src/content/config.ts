import { defineCollection, } from 'astro:content';
import { flowSchema } from '@/types/models';
import { z } from 'astro:content';
import type { OrganizationSettings } from '@/types/settings';

const settingsSchema = z.custom<OrganizationSettings>();
const settingsCollection = defineCollection({
  type: 'data',
  schema: settingsSchema,
});

const flowCollection = defineCollection({
  type: 'data',
  schema: flowSchema,
});

export const collections = {
  'flows': flowCollection,
  'settings': settingsCollection,
};