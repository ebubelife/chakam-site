# Answer engines (GEO)

Notes on the choices made for ChatGPT, Perplexity and Google AI Overviews,
so the reasoning survives the next person who wonders why posts are shaped
this way.

## The premise

An answer engine does not rank ten links. It answers, and cites a handful
of pages it lifted the answer from. Being citable is a different job from
ranking: it rewards a short, self-contained passage that can be quoted
without the page around it, and punishes an argument that only makes sense
if you read all 2,000 words.

This sits on top of ordinary SEO, it does not replace it. A page nobody can
crawl or index is not citable either.

## What we do, and why

**A 40-60 word `answer` in every post's frontmatter,** rendered immediately
under the H1 by `src/pages/blog/[...slug].astro`. This is the passage an
engine quotes. It is written to stand alone: no "this", no "it", nothing
leaning on the title. `scripts/check_post.py` fails a post without one.

**Question-shaped H2s.** An engine matches a conversational query against
headings. "Why Does Being Left on Read Hurt So Much?" matches how people
actually ask; "The Real Reasons" does not. At least two per post, enforced.
Numbered list items ("## 3. Gaslighting You Over Your Own Screenshots") are
left alone — forcing those into questions reads badly and helps nothing.

**Visible FAQs with matching FAQPage JSON-LD.** The schema is generated
from the post's own "Frequently Asked Questions" section at render time, so
the markup and what a reader sees can never drift apart. That is a
structured-data requirement, not just tidiness.

**Article + BreadcrumbList JSON-LD** on every post, with `dateModified`.

**Plain HTML.** No accordions, no `<details>`, nothing that needs JS to
reveal text. Content an engine has to expand or execute to reach is content
it skips.

**IndexNow** (`scripts/indexnow.py`). ChatGPT leans on Bing's index rather
than crawling independently, so a page Bing has not indexed is close to
invisible there. IndexNow pushes URLs instead of waiting to be discovered.
Run it after a deploy that adds or materially changes a page.

## What we deliberately do not do

**`llms.txt` is generated (`src/pages/llms.txt.ts`) but not counted on.**
Google has said it does not use it, and there is no public evidence any
major engine reads it today. It costs one generated file and is correct if
adoption comes. It is not a substitute for anything above.

**No author `Person` entity.** Posts credit the Chakam organization. A named
human byline is a genuine E-E-A-T signal, and the case study that prompted
this work normalized one across every post — but it permanently attaches a
real person to relationship advice, which is a business decision, not a
technical one. Open question, not an oversight.

## Measuring it

Referrer data barely works here: someone reads an answer in ChatGPT and
types the app name into the App Store later. The practical measure is an
in-app "how did you hear about us" question with an AI-assistant option,
which the app does not have yet. Without it, any claim that this worked is
a guess.

## Source

Prompted by GainFrame's GEO case study:
https://gainframe.app/blog/generative-engine-optimization-case-study/

Their headline number (ChatGPT as 31% of new users) came from n=115
self-reported answers in a niche with thin competition. The tactics are
sound; the percentage should not be treated as a forecast for a dating
site.
