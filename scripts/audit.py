#!/usr/bin/env python3
"""Weekly site audit. Local only, no network, runs in under a second.

    python3 scripts/audit.py              # full report
    python3 scripts/audit.py --links      # just the internal link graph
    python3 scripts/audit.py --quiet      # only problems, for a pre-commit hook

WHY THIS EXISTS. Google finds pages by following links. A post nothing
links to is reachable only from the blog index, and on a site with no
authority that usually means it never gets crawled at all — which is
exactly what Search Console reports under "Discovered – currently not
indexed". Orphans are therefore not a tidiness problem, they are the
indexing problem.

None of these checks need traffic data, which is the point: they work on
day one, unlike anything built on impressions or click-through rate.

WHAT IT DELIBERATELY DOES NOT DO. It never edits a post and it never
merges anything. Near-duplicate titles are reported for a human to judge,
because similar titles routinely serve genuinely different searches — the
men's and women's anxious-attachment posts share most of their words and
should stay separate. Similarity is a prompt to look, not a verdict.

Exits 1 if any orphan exists, so it can gate a commit.
"""
import argparse
import re
import sys
from collections import defaultdict
from datetime import date, datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BLOG = ROOT / 'src' / 'content' / 'blog'

# A post older than this with no update is worth a second look. Not a
# failure: evergreen explainers age fine, roundups with prices do not.
STALE_DAYS = 365
# Jaccard overlap on title words above which two posts get flagged.
TITLE_OVERLAP = 0.30
STOPWORDS = {
    'the', 'a', 'an', 'to', 'and', 'of', 'for', 'in', 'you', 'your', 'how',
    'what', 'is', 'it', 'with', 'on', 'that', 'this', 'do', 'does', 'are',
    'be', 'or', 'not', 'they', 'them', 'my', 'me', 'i', '2026', 'vs',
}


def load():
    posts = {}
    for path in sorted(BLOG.glob('*.md')):
        raw = path.read_text(encoding='utf-8')
        _, fm, body = raw.split('---', 2)

        def field(key):
            m = re.search(rf'^{key}:\s*"?(.*?)"?\s*$', fm, re.M)
            return m.group(1) if m else ''

        posts[path.stem] = {
            'path': path,
            'title': field('title'),
            'tags': re.findall(r'"([^"]+)"', field('tags') or ''),
            'date': field('date'),
            'updated': field('updated'),
            'quizCta': field('quizCta'),
            'body': body,
        }
    return posts


def link_graph(posts):
    inbound, outbound, broken = defaultdict(set), defaultdict(set), []
    for slug, p in posts.items():
        for target in re.findall(r'\]\(/blog/([a-z0-9-]+)/\)', p['body']):
            if target == slug:
                broken.append((slug, target, 'self-link'))
            elif target not in posts:
                broken.append((slug, target, 'no such post'))
            else:
                outbound[slug].add(target)
                inbound[target].add(slug)
    return inbound, outbound, broken


def words(title):
    return {w for w in re.findall(r'[a-z]+|\d+', title.lower())} - STOPWORDS


def suggest(slug, posts, inbound, outbound):
    """Posts that could plausibly link TO `slug`, ranked by shared tags.

    Mechanical, and offered as candidates only — the link still has to be
    written into a real sentence by hand, because a "related posts" block
    bolted onto the end is worth far less than a contextual link and reads
    like filler.
    """
    tags = set(posts[slug]['tags'])
    scored = []
    for other, p in posts.items():
        if other == slug or other in inbound[slug]:
            continue
        shared = len(tags & set(p['tags']))
        if shared:
            # Prefer sources that currently link nowhere: one edit fixes
            # an orphan and a dead end at the same time.
            scored.append((shared, -len(outbound[other]), other))
    scored.sort(reverse=True)
    return [s for _, _, s in scored[:3]]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--links', action='store_true', help='link graph only')
    ap.add_argument('--quiet', action='store_true', help='problems only')
    a = ap.parse_args()

    posts = load()
    inbound, outbound, broken = link_graph(posts)
    orphans = sorted(s for s in posts if not inbound[s])
    thin = sorted(s for s in posts if len(inbound[s]) == 1)
    dead_ends = sorted(s for s in posts if not outbound[s])

    print(f'{len(posts)} posts\n')

    print(f'ORPHANS — no inbound links from any post ({len(orphans)})')
    if not orphans:
        print('  none')
    for slug in orphans:
        print(f'  {slug}')
        for cand in suggest(slug, posts, inbound, outbound):
            print(f'      link from: {cand}')

    print(f'\nDEAD ENDS — post links out to nothing ({len(dead_ends)})')
    print('  ' + ('none' if not dead_ends else ', '.join(dead_ends)))

    if not a.quiet:
        print(f'\nTHIN — only one inbound link ({len(thin)})')
        print('  ' + ('none' if not thin else ', '.join(thin)))

    print(f'\nBROKEN INTERNAL LINKS ({len(broken)})')
    if not broken:
        print('  none')
    for src, target, why in broken:
        print(f'  {src} -> /blog/{target}/  ({why})')

    print('\nNEAR-DUPLICATE TITLES — review, do not auto-merge')
    slugs = sorted(posts)
    pairs = 0
    for i, x in enumerate(slugs):
        for y in slugs[i + 1:]:
            wx, wy = words(posts[x]['title']), words(posts[y]['title'])
            if not wx or not wy:
                continue
            overlap = len(wx & wy) / len(wx | wy)
            if overlap >= TITLE_OVERLAP:
                pairs += 1
                print(f'  {overlap:.0%}  {x}\n        {y}')
    if not pairs:
        print('  none')

    if not a.quiet:
        print('\nSTALE — published over a year ago and never updated')
        stale = 0
        for slug, p in sorted(posts.items()):
            stamp = p['updated'] or p['date']
            try:
                age = (date.today() - datetime.fromisoformat(stamp[:10]).date()).days
            except ValueError:
                continue
            if age > STALE_DAYS:
                stale += 1
                print(f'  {age}d  {slug}')
        if not stale:
            print('  none')

    if a.links:
        print('\nLINK GRAPH')
        for slug in sorted(posts, key=lambda s: -len(inbound[s])):
            print(f'  in:{len(inbound[slug]):<3} out:{len(outbound[slug]):<3} {slug}')

    problems = len(orphans) + len(broken)
    print(f'\n{len(orphans)} orphan(s), {len(dead_ends)} dead end(s), '
          f'{len(broken)} broken link(s)')
    sys.exit(1 if problems else 0)


if __name__ == '__main__':
    main()
