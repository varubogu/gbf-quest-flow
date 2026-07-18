import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { flowSchema } from '@/types/models';
import type { OrganizationSettings, SkillEffectSettings } from '@/types/settings';

const settingsSchema = z.custom<OrganizationSettings | SkillEffectSettings>();
const settingsCollection = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/settings' }),
  schema: settingsSchema,
});

const flowCollection = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/flows' }),
  schema: flowSchema,
});

export const collections = {
  flows: flowCollection,
  settings: settingsCollection,
};
