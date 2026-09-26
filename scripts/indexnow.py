#!/usr/bin/env python3
"""Tells Bing (and the other IndexNow engines) that URLs have changed.

    python3 scripts/indexnow.py                 # every URL in the sitemap
    python3 scripts/indexnow.py /blog/my-post/  # just these
    python3 scripts/indexnow.py --dry-run

WHY THIS EXISTS. Two reasons, and the second is the bigger one:

  1. Indexing lag. Waiting to be crawled can take days on a young domain.
     IndexNow is a push: the engine is told the URL changed instead of
     discovering it. It is free, and needs no account.

  2. ChatGPT. ChatGPT's browsing and citations lean heavily on Bing's
     index rather than a crawler of its own. A page Bing has not indexed is
     effectively invisible there, however good it is. Getting into Bing
     quickly is therefore an answer-engine play, not just a Bing play.

WHAT IT DOES NOT DO. Submitting is not indexing. It asks an engine to look
sooner; the engine still decides whether the page is worth keeping. If a
page stays unindexed after this, the problem is the page, not the crawl.

THE KEY. IndexNow verifies ownership by fetching a text file from the site
root whose name and contents are both the key. Ours is committed in
public/, so it deploys with the site — losing it means the key stops
verifying and submissions are rejected.
"""
import argparse
import json
import re
import sys
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
HOST = 'chakam.site'
SITEMAP = f'https://{HOST}/sitemap-0.xml'
ENDPOINT = 'https://api.indexnow.org/IndexNow'
# One submission may carry at most 10,000 URLs; we are nowhere near that,
# but batching keeps a future large run correct.
BATCH = 10_000


def find_key() -> str:
    """The key is whichever <32-hex>.txt sits in public/ — no second copy to
    keep in sync, and nothing secret to keep out of the repo."""
    keys = [p for p in (ROOT / 'public').glob('*.txt')
            if re.fullmatch(r'[0-9a-f]{8,128}', p.stem)]
    if not keys:
        sys.exit('No IndexNow key file in public/. Create one with:\n'
                 '  python3 -c "import secrets;k=secrets.token_hex(16);'
                 "open(f'public/{k}.txt','w').write(k)\"")
    if len(keys) > 1:
        sys.exit(f'More than one key file in public/: {[p.name for p in keys]}. '
                 'Delete the stale one — the engine fetches by name.')
    key = keys[0].read_text().strip()
    if key != keys[0].stem:
        sys.exit(f'{keys[0].name} must contain exactly its own filename '
                 f'without the extension. It contains {key!r}.')
    return key


def sitemap_urls() -> list[str]:
    try:
        with urllib.request.urlopen(SITEMAP, timeout=30) as res:
            xml = res.read().decode()
    except urllib.error.URLError as e:
        sys.exit(f'Could not read {SITEMAP}: {e}')
    urls = re.findall(r'<loc>\s*([^<\s]+)\s*</loc>', xml)
    if not urls:
        sys.exit(f'{SITEMAP} parsed but held no <loc> entries.')
    return urls


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    ap.add_argument('urls', nargs='*',
                    help='paths or full URLs; omit for the whole sitemap')
    ap.add_argument('--dry-run', action='store_true',
                    help='show what would be submitted, send nothing')
    a = ap.parse_args()

    key = find_key()
    if a.urls:
        urls = [u if u.startswith('http') else f'https://{HOST}/{u.lstrip("/")}'
                for u in a.urls]
        wrong = [u for u in urls if not u.startswith(f'https://{HOST}/')]
        if wrong:
            sys.exit(f'Every URL must be on {HOST}. Not: {wrong}')
    else:
        urls = sitemap_urls()

    print(f'{len(urls)} URL(s), key {key[:8]}...')
    if a.dry_run:
        for u in urls:
            print(f'  {u}')
        print('\nDRY RUN — nothing submitted.')
        return

    for i in range(0, len(urls), BATCH):
        chunk = urls[i:i + BATCH]
        body = json.dumps({
            'host': HOST,
            'key': key,
            'keyLocation': f'https://{HOST}/{key}.txt',
            'urlList': chunk,
        }).encode()
        req = urllib.request.Request(ENDPOINT, data=body, method='POST')
        req.add_header('Content-Type', 'application/json; charset=utf-8')
        try:
            with urllib.request.urlopen(req, timeout=60) as res:
                # 200 accepted, 202 accepted but key still being validated.
                print(f'  HTTP {res.status} — {len(chunk)} URL(s) accepted')
        except urllib.error.HTTPError as e:
            detail = e.read().decode(errors='replace')[:300]
            hint = {
                403: 'key file not reachable at the URL above yet — deploy first',
                422: 'URLs do not match the host, or the key is wrong',
                429: 'too many submissions; wait and retry',
            }.get(e.code, '')
            sys.exit(f'  HTTP {e.code}: {detail}\n  {hint}')
        except urllib.error.URLError as e:
            sys.exit(f'  Could not reach {ENDPOINT}: {e.reason}')

    print('\nSubmitted. This asks Bing to crawl sooner; it does not '
          'guarantee indexing.\nCheck progress in Bing Webmaster Tools.')


if __name__ == '__main__':
    main()
