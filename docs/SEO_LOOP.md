# The weekly loop

Notes on how search work gets decided here, so the reasoning outlives any
one session. Modelled on GainFrame's published weekly audit loop, adapted
for a site with almost no traffic yet.

## The honest starting position

That loop is an optimization engine. Its best steps read Search Console
for queries in striking distance, compare click-through rate against
position benchmarks, and freeze keyword clusters whose volume is falling.
All of it needs impressions.

This site has ~24 posts, most of them not yet crawled. Feeding near-zero
data into those steps returns near-zero signal, so the loop here runs in
two halves: what works today, and what waits for data.

## Runs today, needs no traffic

**`python3 scripts/audit.py`** — orphans, dead ends, broken internal
links, near-duplicate titles, stale posts. Local, no network, under a
second. Exits 1 if any orphan or broken link exists.

Orphans are the priority and not a tidiness concern. Google finds pages by
following links; a post nothing links to is reachable only from the blog
index, and on a site with no authority that usually means it is never
crawled. That is exactly what Search Console reports as "Discovered –
currently not indexed".

**`python3 scripts/check_post.py <slug> --keyword "<kw>"`** — on-page rules
for a single post, including the answer block and question-shaped headings
that answer engines rely on. See GEO.md.

**`python3 scripts/indexnow.py`** — pushes URLs to Bing after a deploy.
Bing only; Google has no equivalent and ignores it.

## Waits for data

Striking-distance queries (positions 5–20), click-through benchmarks,
volume trends and title A/B tests. Revisit once Search Console shows
meaningful impressions.

## Rules

**Measurement windows. Do not touch a page inside its own window.**

| Change | Wait before judging |
|---|---|
| Title or meta description | 7–10 days |
| New post | 28 days before position data means anything |

**Fix automatically:** orphans, dead ends, broken internal links.

**Never automatic:** merging near-duplicate posts. Similar titles
routinely serve different searches. The men's and women's anxious
attachment posts share most of their title words and must stay separate.
Similarity is a prompt to look, not a verdict.

**Internal links go in sentences.** A contextual link inside a real
sentence is worth more than a "related posts" block, which reads as filler
and gets ignored by readers and crawlers alike.

**Volume is not a strategy.** 22 posts went out in September 2026 with no
loop deciding what to write, and none of them were indexed. The source
loop's author makes the same point: a month of high volume without the
loop produced nothing comparable to a month with it.

**Validate tools with data, not argument.** The source loop approved a new
tool on real figures: search volume, annual trend, difficulty, and who
already ranks. The anxious attachment test here was approved on judgement
instead. That was a guess, and the next one should be measured.

## Rules earned the hard way

Each of these cost something before it became a rule.

1. **Never stamp every sitemap URL with the build time.** An inaccurate
   `lastmod` gets the field distrusted site-wide. Only blog posts carry
   one, from real frontmatter dates.
2. **Check `/tools/` before putting anything there.** That path is
   `noindex, nofollow` and excluded from the sitemap. Public pages meant
   to rank go elsewhere; `/quiz/` is the precedent.
3. **Verify the IndexNow key is live before submitting.** A 403 from an
   unreachable key looks like a normal run. Someone else missed it for
   three months. `indexnow.py` now checks up front and exits.
4. **Deep pagination hides posts from crawlers.** At 6 posts a page the
   index reached `/blog/4/`, and those pagination pages were themselves
   uncrawled, so everything behind them was effectively orphaned.
5. **Declaring `heroImage` does not create the file.** Eight posts pointed
   at images that were never generated. Invisible until the card grid
   started leading with them. `check_post.py` now fails on a missing file.
6. **Astro scoped styles do not reach elements built in JavaScript.** The
   quiz answer buttons rendered unstyled until the block became
   `is:global`.
7. **Shared styles do not belong in a page's style block.** The `/quiz/`
   hub rendered with no layout because the chrome lived in the test page.
8. **An `<img>` stretched by flex falls back to its intrinsic height.**
   Wrap it in a div; a div has no intrinsic height.
9. **Do not stack commits onto a branch whose PR is already merged.** They
   land nowhere and the work looks shipped when it is not. One PR per
   deliverable.

## Cadence

Weekly is enough. Run the audit, read Search Console when there is
something to read, decide with evidence, ship, then submit to IndexNow and
leave it alone for the measurement window.
