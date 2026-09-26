#!/usr/bin/env python3
"""Checks one blog post against the on-page SEO rules we hold every post to.

    python3 scripts/check_post.py ai-apps-for-couples --keyword "AI apps for couples"

Mechanical checks only. It cannot judge whether the post matches search
intent, whether a claim is true, or whether the writing is good; those
still need a human.

Some rules here are about answer engines (ChatGPT, Perplexity, AI
Overviews) rather than classic ranking: the 40-60 word `answer` block and
question-shaped H2s exist because an engine citing a page lifts a short,
self-contained passage out of it, and a heading phrased as a question is
what it matches a conversational query against. See docs/GEO.md. Exits 1 if anything FAILS, so it can gate a commit or
a CI step. WARN means worth a look but not blocking.

Standard library only.
"""
import argparse
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BLOG = ROOT / 'src' / 'content' / 'blog'

BANNED_WORDS = ('delve landscape testament leverage utilize robust seamless '
                'furthermore moreover additionally pivotal multifaceted '
                'harness embark navigate showcase streamline paramount '
                'culminate spearhead commence endeavor vibrant innovative '
                'comprehensive').split()
BANNED_PHRASES = ["it's worth noting", "in today's", "let's dive in",
                  'in conclusion', 'crucial role', 'vital role', 'pivotal role',
                  'it goes without saying', 'in the realm of']

results = []


def check(level, label, ok, detail=''):
    results.append((level if not ok else 'PASS', label, detail))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('slug')
    ap.add_argument('--keyword', required=True, help='primary target keyword')
    a = ap.parse_args()

    path = BLOG / f'{a.slug}.md'
    if not path.is_file():
        sys.exit(f'No such post: {path}')
    raw = path.read_text()
    _, fm, body = raw.split('---', 2)

    def field(k):
        m = re.search(rf'^{k}:\s*"?(.*?)"?\s*$', fm, re.M)
        return m.group(1).replace('\\"', '"') if m else ''

    kw = a.keyword.lower()
    title, desc, alt, hero = (field('title'), field('description'),
                              field('heroImageAlt'), field('heroImage'))
    # What actually lands in <title>: the template renders
    # `seoTitle ?? title`, so the length limit belongs to the effective one.
    # Measuring `title` here used to fail a post that was using seoTitle
    # exactly as intended — a longer, punchier H1 with a short SEO title.
    seo_title = field('seoTitle') or title
    words = re.findall(r"[A-Za-z0-9']+", body)
    low = body.lower()

    check('FAIL', 'keyword in slug', kw.replace(' ', '-') in a.slug, a.slug)
    check('FAIL', 'keyword in title', kw in title.lower(), title)
    check('FAIL', f'<title> fits with " — Chakam" (<=60)',
          len(seo_title) + 9 <= 60, f'{len(seo_title) + 9} chars')
    # An H1 can run longer than the SERP limit, but past this it stops
    # reading as a headline and starts reading as a sentence.
    check('WARN', 'H1 under 70 chars', len(title) <= 70, f'{len(title)} chars')
    check('WARN', 'keyword in <title>', kw in seo_title.lower(), seo_title)
    check('FAIL', 'keyword in description', kw in desc.lower())
    check('FAIL', 'description length 100-155', 100 <= len(desc) <= 155,
          f'{len(desc)} chars')
    check('FAIL', 'keyword in first 100 words',
          kw in ' '.join(words[:100]).lower())
    h2 = re.findall(r'^## (.+)$', body, re.M)
    n_h2 = sum(kw in h.lower() for h in h2)
    check('FAIL', 'keyword in 1+ H2', n_h2 >= 1, f'{n_h2} H2s')
    check('WARN', 'keyword in 2+ H2s', n_h2 >= 2, f'{n_h2} H2s')

    # --- answer engine rules -------------------------------------------
    answer = field('answer')
    a_words = len(answer.split())
    check('FAIL', 'answer block present', bool(answer))
    check('FAIL', 'answer block 40-60 words', 40 <= a_words <= 60,
          f'{a_words} words')
    # An engine lifts this passage on its own, so it has to read as a
    # complete answer with no page around it — a leading "This", "That" or
    # "It" almost always means the sentence is leaning on the title.
    check('WARN', 'answer block opens self-contained',
          not re.match(r'^(this|that|it|they|these|those|here)\b', answer,
                       re.I),
          answer[:40])
    check('WARN', 'keyword in answer block', kw in answer.lower())
    # Not a duplicate of the meta description, which serves a different job.
    check('WARN', 'answer block differs from description',
          answer.strip().lower() != desc.strip().lower())

    q_h2 = sum(h.rstrip().endswith('?') for h in h2)
    check('FAIL', 'at least 2 question-shaped H2s', q_h2 >= 2, f'{q_h2} of {len(h2)}')
    check('WARN', 'a third of H2s are questions',
          len(h2) == 0 or q_h2 / len(h2) >= 0.33,
          f'{q_h2} of {len(h2)}')

    check('FAIL', 'hero image declared', bool(hero))
    if hero:
        check('FAIL', 'hero file exists', (ROOT / 'public' / hero.lstrip('/')).is_file(), hero)
    check('FAIL', 'alt text written (not placeholder)',
          bool(alt) and 'placeholder' not in alt.lower() and '<' not in alt, alt[:50])
    check('FAIL', 'keyword in alt text', kw in alt.lower())
    check('WARN', 'alt under 125 chars', len(alt) <= 125, f'{len(alt)} chars')

    n = len(words)
    check('WARN', 'body at least 1000 words', n >= 1000, f'{n} words')
    density = 100 * low.count(kw) * len(kw.split()) / max(n, 1)
    check('WARN', 'keyword density 0.5-3%', 0.5 <= density <= 3, f'{density:.1f}%')

    links = re.findall(r'\]\((/blog/[a-z0-9-]+/)\)', body)
    broken = [l for l in links if not (BLOG / f'{l.split("/")[2]}.md').exists()]
    check('FAIL', 'internal links resolve', not broken, str(broken) if broken else f'{len(links)} links')
    check('WARN', 'at least 3 internal links', len(links) >= 3, f'{len(links)}')
    check('FAIL', 'no self-link', f'/blog/{a.slug}/' not in links)
    ext = re.findall(r'\]\((https?://[^)]+)\)', body)
    check('WARN', 'has an external source link', len(ext) >= 1, f'{len(ext)}')

    hits = [w for w in BANNED_WORDS if re.search(rf'\b{w}\b', low)]
    check('FAIL', 'no banned AI-tell words', not hits, ', '.join(hits))
    ph = [x for x in BANNED_PHRASES if x in low]
    check('FAIL', 'no banned phrases', not ph, ', '.join(ph))
    check('WARN', 'em dashes under 2 per 1000 words',
          body.count('—') <= max(2, n // 500), f'{body.count("—")}')
    check('FAIL', 'has FAQ section for FAQ schema',
          '## Frequently Asked Questions' in body)
    check('FAIL', 'date present and not in the future-only draft',
          bool(field('date')) and field('draft').lower() != 'true')

    order = {'FAIL': 0, 'WARN': 1, 'PASS': 2}
    for lvl, label, detail in sorted(results, key=lambda r: order[r[0]]):
        print(f'{lvl:5} {label}' + (f'   [{detail}]' if detail else ''))
    fails = sum(r[0] == 'FAIL' for r in results)
    warns = sum(r[0] == 'WARN' for r in results)
    print(f'\n{len(results) - fails - warns} passed, {warns} warnings, {fails} failed')
    sys.exit(1 if fails else 0)


if __name__ == '__main__':
    main()
