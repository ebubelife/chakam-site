// One entry per internal content tool under /tools/ — drives the shared
// sidebar in ToolsLayout.astro so a new tool never has to be wired into
// the nav separately from adding its page. This is an internal workspace
// for generating TikTok/marketing content, not a public feature — see
// astro.config.mjs's sitemap filter and ToolsLayout.astro's noindex.
export interface Tool {
  slug: string; // URL: /tools/{slug}/
  label: string; // sidebar link text
  description: string; // shown under the label in the sidebar
}

export const tools: Tool[] = [
  {
    slug: 'chat-report',
    label: 'Chat Report Generator',
    description: 'Build a "chat wrapped"-style stat card grid, export as a TikTok-ready image.',
  },
  {
    slug: 'quiz-result',
    label: 'Quiz Result Generator',
    description: 'Craft a quiz-result reveal card — crazy, toxic, or wholesome — export as a TikTok-ready image.',
  },
];
