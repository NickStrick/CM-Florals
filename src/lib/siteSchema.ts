// src/lib/siteSchema.ts
import { z } from 'zod';

// Minimal safety: ensure top-level structure looks like SiteConfig without using `any`.
export const SiteConfigSchema = z.object({
  theme: z.unknown(),
  sections: z.array(z.unknown()),
  meta: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
      favicon: z.string().optional(),
    })
    .optional(),
});

export type SiteConfigJson = z.infer<typeof SiteConfigSchema>;
