import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

// Consumed by the Flutter app's home screen (see chakam repo's
// lib/core/content/blog_client.dart) for the "From the Chakam Blog"
// cards — a small, purpose-built JSON shape rather than repurposing
// rss.xml, since the app needs a thumbnail image URL per post that the
// RSS feed doesn't carry. Absolute URLs throughout (image/url) so the
// app never has to know chakam.site's domain itself.
export async function GET(context: APIContext) {
  const posts = (await getCollection('blog', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );

  const items = posts.slice(0, 10).map((post) => ({
    slug: post.id,
    title: post.data.title,
    excerpt: post.data.description,
    image: new URL(post.data.heroImage ?? '/assets/img/logo.png', context.site).toString(),
    url: new URL(`/blog/${post.id}/`, context.site).toString(),
    date: post.data.date.toISOString(),
  }));

  return new Response(JSON.stringify(items), {
    headers: {
      'Content-Type': 'application/json',
      // Static content, rebuilt on every deploy — an hour of CDN/browser
      // caching is a fine trade against a slightly stale card on the
      // rare deploy that lands mid-cache-window.
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
