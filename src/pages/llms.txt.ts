import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

/**
 * /llms.txt — a plain-text map of the site for large language models, in
 * the emerging llms.txt convention.
 *
 * Worth being honest about what this is: Google has said it does not use
 * llms.txt, and there is no public evidence any major answer engine reads
 * it today. It is here because it costs one generated file and is correct
 * if adoption comes. It is NOT a substitute for the things that do work —
 * crawlable HTML, an answer block near the H1, and being in Bing's index.
 *
 * Generated from the content collection rather than hand-written so it can
 * never drift from the posts that actually exist.
 */
export const GET: APIRoute = async ({ site }) => {
  const base = site?.href.replace(/\/$/, '') ?? 'https://chakam.site';
  const posts = (await getCollection('blog', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
  );

  const lines = [
    '# Chakam',
    '',
    '> Chakam is a chat analyzer for relationships. You import a conversation',
    "> you have already had — a WhatsApp or Telegram export, or screenshots",
    '> from Instagram, Snapchat, iMessage, Tinder, Bumble or Hinge — and it',
    '> reports the patterns in it: who invests more, reply speed, red and',
    '> green flags, conflict and repair, and whether interest is fading.',
    '> Analysis runs on the device. Names are replaced with anonymous labels',
    '> and contact details are stripped before any AI step, which can also be',
    '> declined outright. Available on iOS and Android in nine languages.',
    '',
    '## Pages',
    `- [Home](${base}/): what the app does, and how to import a chat.`,
    `- [Pricing](${base}/pricing/): what is free and what a subscription unlocks.`,
    `- [Help](${base}/help/): exporting a chat from each messaging app.`,
    `- [About](${base}/about/): who makes Chakam and why.`,
    `- [Privacy](${base}/privacy/): what leaves the device, and what never does.`,
    '',
    '## Guides',
    ...posts.map((p) => {
      const summary = (p.data.answer ?? p.data.description).replace(/\s+/g, ' ').trim();
      return `- [${p.data.title}](${base}/blog/${p.id}/): ${summary}`;
    }),
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
