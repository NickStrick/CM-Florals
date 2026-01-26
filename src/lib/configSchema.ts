// src/lib/configSchema.ts
import { z } from 'zod';

export const ThemeSchema = z.object({
  preset: z.string(),
  primary: z.string().optional(),
  accent: z.string().optional(),
  radius: z.enum(['sm', 'md', 'lg', 'xl', '2xl', 'full']).optional(),
});

export const MetaSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  favicon: z.string().optional(),
}).optional();

/**
 * Keep sections permissive (z.any()) so you can evolve quickly.
 * You can refine with unions later as your UI becomes field-based.
 */
export const SiteConfigSchema = z.object({
  theme: ThemeSchema,
  meta: MetaSchema,
  sections: z.array(z.any()),
});

export type SiteConfigParsed = z.infer<typeof SiteConfigSchema>;
