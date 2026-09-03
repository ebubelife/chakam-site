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
    description: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
