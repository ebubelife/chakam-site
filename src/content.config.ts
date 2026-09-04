import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Every post is one Markdown file in src/content/blog/ — the frontmatter
// below is exactly what each post needs to write, nothing more. `date` and
// `description` both feed SEO/OG tags directly (see [...slug].astro), so
// they're required, not optional extras.
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    // Optional, shorter stand-in for the <title>/OG/Twitter tags when
    // `title` itself (used as the on-page H1, where a longer, punchier
    // headline reads better) would run past ~60 chars once " — Chakam"
    // is appended and start getting truncated in search results. Falls
    // back to `title` when omitted — most posts won't need this.
    seoTitle: z.string().optional(),
    description: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    // Both optional, same "ship now, upgrade later" pattern as the
    // platform pages' ScreenshotSlot — reused directly for the hero
    // image below. Omit both and the post just runs without a hero.
    heroImage: z.string().optional(),
    heroImageAlt: z.string().optional(),
  }),
});

export const collections = { blog };
