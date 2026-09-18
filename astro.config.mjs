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
  integrations: [
    sitemap({
      // /tools/ is an internal content-creation workspace, not a public
      // page — noindex'd (see ToolsLayout.astro) AND kept out of the
      // sitemap here, belt and suspenders, so it never shows up in search
      // or gets crawled.
      filter: (page) => !page.includes('/tools/'),
    }),
  ],
});
