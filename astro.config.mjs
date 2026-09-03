// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Feeds every canonical URL, OG tag, the sitemap, and the RSS feed.
  // chakam.app and chakam.com were both taken — chakam.site is the domain
  // actually bought. Keep this in sync with public/CNAME (the file GitHub
  // Pages reads once it's deployed via Actions).
  site: 'https://chakam.site',
  integrations: [sitemap()],
});
