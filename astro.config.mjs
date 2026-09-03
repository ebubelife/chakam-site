// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // IMPORTANT: update once the real domain is bought and DNS/CNAME is
  // pointed — this feeds every canonical URL, OG tag, the sitemap, and the
  // RSS feed. Using chakam.app as the placeholder per the domain discussion
  // (cha-kam.lol expired; chakam.com is already owned by an unrelated
  // business). Swap this AND the repo's CNAME file together, in one commit.
  site: 'https://chakam.app',
  integrations: [sitemap()],
});
