// @ts-check
import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Real <lastmod> per blog post, read straight from the frontmatter.
//
// Google uses lastmod to decide what is worth re-crawling, but only while
// it trusts the value — a sitemap that stamps every URL with the build
// time gets the field ignored site-wide. So this sets it ONLY for posts,
// where there is a genuine date, and leaves every other URL without one
// rather than inventing a figure.
const BLOG_DIR = 'src/content/blog';
const postLastmod = new Map();
for (const file of fs.readdirSync(BLOG_DIR)) {
  if (!file.endsWith('.md')) continue;
  const frontmatter = fs.readFileSync(path.join(BLOG_DIR, file), 'utf8').split('---')[1] ?? '';
  const stamp =
    /^updated:\s*(\S+)/m.exec(frontmatter)?.[1] ?? /^date:\s*(\S+)/m.exec(frontmatter)?.[1];
  if (!stamp) continue;
  const parsed = new Date(stamp);
  if (!Number.isNaN(parsed.valueOf())) {
    postLastmod.set(`/blog/${file.replace(/\.md$/, '')}/`, parsed.toISOString());
  }
}

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
      serialize(item) {
        const lastmod = postLastmod.get(new URL(item.url).pathname);
        return lastmod ? { ...item, lastmod } : item;
      },
    }),
  ],
});
