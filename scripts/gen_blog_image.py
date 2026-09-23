#!/usr/bin/env python3
"""Generates a blog image with Google's Gemini image model and saves it where
the blog expects it, already sized and compressed.

    python3 scripts/gen_blog_image.py --slug best-ai-dating-apps \
        --prompt "two phones facing each other with a heart between them"

Writes public/assets/img/blog/<slug>/hero.jpg (or --name something-else),
which is exactly what a post's `heroImage:` frontmatter points at. The
script prints that frontmatter line when it finishes.

WHY THIS EXISTS INSTEAD OF A PLUGIN. The image call itself is one HTTP
request; what matters for a blog is everything around it. Existing heroes
are 1376x768 flat illustrations in the brand's black/yellow/cream, and raw
model output is often 800KB+, which slows the page that Google measures.
So this pins the house style, forces 16:9, and compresses to a JPEG.

KEY. Read from the GEMINI_API_KEY environment variable, or from the file
~/.config/chakam/gemini_api_key. Deliberately NOT a command-line flag: an
argument shows up in the process list and in shell history.

SAFETY. Refuses to overwrite an existing image unless --force, so a stray
run cannot replace a hero that is already live. --dry-run prints the exact
prompt and target path and makes no network call (and costs nothing).

Requires Pillow (pip3 install pillow). Standard library otherwise.
"""
import argparse
import base64
import io
import json
import os
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    sys.exit('Missing dependency. Run:  pip3 install pillow')

ROOT = Path(__file__).resolve().parent.parent
IMG_DIR = ROOT / 'public' / 'assets' / 'img' / 'blog'
BLOG_DIR = ROOT / 'src' / 'content' / 'blog'
KEY_FILE = Path('~/.config/chakam/gemini_api_key').expanduser()

DEFAULT_MODEL = 'gemini-2.5-flash-image'
BASE_URL = os.environ.get(
    'GEMINI_BASE_URL', 'https://generativelanguage.googleapis.com/v1beta')

# Matches the existing hero images: flat vector, cream ground, black and
# yellow only, no text, generous empty space. Colors are the site's own
# tokens (src/styles/global.css).
HOUSE_STYLE = (
    'Flat minimal vector illustration in a clean editorial style. '
    'Solid cream background (#F1F0EB). Use ONLY near-black (#17171C) and '
    'warm yellow (#F8BC20) for shapes, with at most a few tiny accents of '
    'the same two colors. No gradients, no shadows, no textures, no 3D. '
    'Bold simple geometric shapes with generous empty space around the '
    'subject. Absolutely no text, letters, words, numbers or logos '
    'anywhere in the image. Wide 16:9 composition.'
)

TARGET_W, TARGET_H = 1376, 768  # 16:9, Gemini's native wide output size
JPEG_QUALITY = 82


class Fail(Exception):
    pass


def get_key():
    key = os.environ.get('GEMINI_API_KEY', '').strip()
    if not key and KEY_FILE.is_file():
        key = KEY_FILE.read_text().strip()
    if not key:
        raise Fail(
            'No Gemini API key found. Either\n'
            '    export GEMINI_API_KEY=...\n'
            f'  or save it to {KEY_FILE} (chmod 600).\n'
            '  Create one at https://aistudio.google.com/apikey')
    return key


def build_prompt(subject, style):
    subject = subject.strip()
    return subject if style == 'none' else f'{subject}\n\n{HOUSE_STYLE}'


def call_gemini(key, model, prompt, with_aspect=True):
    config = {'responseModalities': ['IMAGE']}
    if with_aspect:
        config['imageConfig'] = {'aspectRatio': '16:9'}
    body = json.dumps({
        'contents': [{'parts': [{'text': prompt}]}],
        'generationConfig': config,
    }).encode()
    url = f'{BASE_URL}/models/{model}:generateContent'

    last = None
    for attempt in range(1, 4):
        req = urllib.request.Request(url, data=body, method='POST')
        req.add_header('Content-Type', 'application/json')
        req.add_header('x-goog-api-key', key)
        try:
            with urllib.request.urlopen(req, timeout=120) as res:
                return json.loads(res.read())
        except urllib.error.HTTPError as e:
            detail = e.read().decode(errors='replace')
            last = (e.code, detail)
            # Rate limit / transient server trouble: wait and retry.
            if e.code in (429, 500, 502, 503, 504) and attempt < 3:
                wait = 2 ** attempt
                print(f'  HTTP {e.code}, retrying in {wait}s '
                      f'(attempt {attempt}/3)...', file=sys.stderr)
                time.sleep(wait)
                continue
            break
        except urllib.error.URLError as e:
            raise Fail(f'Could not reach the Gemini API: {e.reason}')

    code, detail = last
    # A model that does not accept imageConfig says so with a 400. Signal
    # that to the caller so it can retry without it and crop locally.
    if code == 400 and with_aspect and (
            'imageConfig' in detail or 'aspectRatio' in detail):
        return None
    try:
        msg = json.loads(detail)['error']['message']
    except Exception:
        msg = detail[:300]
    if code in (401, 403):
        msg += '  (check the API key and that the Gemini API is enabled)'
    raise Fail(f'Gemini API error {code}: {msg}')


def extract_image(resp):
    block = (resp.get('promptFeedback') or {}).get('blockReason')
    if block:
        raise Fail(
            f'Prompt was blocked by the safety filter ({block}). Reword the '
            'prompt — keep it about objects and shapes, not about people.')
    for cand in resp.get('candidates') or []:
        parts = (cand.get('content') or {}).get('parts') or []
        for part in parts:
            blob = part.get('inlineData') or part.get('inline_data')
            if blob and blob.get('data'):
                return base64.b64decode(blob['data'])
        reason = cand.get('finishReason')
        texts = [p['text'] for p in parts if p.get('text')]
        if texts or reason:
            note = f' Model said: {texts[0][:200]!r}' if texts else ''
            raise Fail(f'No image returned (finishReason={reason}).{note}')
    raise Fail('The response contained no image and no explanation.')


def finalize(raw):
    """Crop to 16:9, cap the width, and compress to a web-friendly JPEG."""
    img = Image.open(io.BytesIO(raw))
    if img.mode != 'RGB':
        img = img.convert('RGB')
    w, h = img.size
    want = TARGET_W / TARGET_H
    if abs(w / h - want) > 0.01:
        if w / h > want:  # too wide: trim the sides
            new_w = int(h * want)
            left = (w - new_w) // 2
            img = img.crop((left, 0, left + new_w, h))
        else:  # too tall: trim top and bottom
            new_h = int(w / want)
            top = (h - new_h) // 2
            img = img.crop((0, top, w, top + new_h))
    if img.size[0] > TARGET_W:
        img = img.resize((TARGET_W, TARGET_H), Image.LANCZOS)
    out = io.BytesIO()
    img.save(out, 'JPEG', quality=JPEG_QUALITY, optimize=True, progressive=True)
    return out.getvalue(), img.size


def main():
    ap = argparse.ArgumentParser(
        description='Generate a blog image with Gemini, saved where posts expect it.')
    ap.add_argument('--slug', required=True,
                    help='post slug (its filename in src/content/blog, without .md)')
    ap.add_argument('--prompt', required=True,
                    help='what the image should show (the house style is added for you)')
    ap.add_argument('--name', default='hero',
                    help='output filename without extension (default: hero)')
    ap.add_argument('--style', choices=['house', 'none'], default='house',
                    help='"none" sends your prompt exactly as written')
    ap.add_argument('--model', default=os.environ.get(
        'GEMINI_IMAGE_MODEL', DEFAULT_MODEL))
    ap.add_argument('--force', action='store_true',
                    help='overwrite an existing image')
    ap.add_argument('--dry-run', action='store_true',
                    help='show the prompt and target, make no API call')
    args = ap.parse_args()

    if not all(c.isalnum() or c in '-_' for c in args.slug + args.name):
        raise Fail('slug and name may only contain letters, digits, - and _')

    target = IMG_DIR / args.slug / f'{args.name}.jpg'
    web_path = f'/assets/img/blog/{args.slug}/{args.name}.jpg'
    prompt = build_prompt(args.prompt, args.style)

    if not (BLOG_DIR / f'{args.slug}.md').is_file():
        print(f'Note: no post src/content/blog/{args.slug}.md yet — fine if '
              'you are making the image first.\n')

    if args.dry_run:
        print(f'DRY RUN — no API call made.\nModel:  {args.model}\n'
              f'Target: {target.relative_to(ROOT)}\n\nPrompt sent:\n{prompt}')
        return

    if target.exists() and not args.force:
        raise Fail(f'{target.relative_to(ROOT)} already exists. Pass --force '
                   'to replace it.')

    key = get_key()
    print(f'Generating with {args.model}...')
    resp = call_gemini(key, args.model, prompt, with_aspect=True)
    if resp is None:
        print('  Model rejected the aspect-ratio setting; retrying and '
              'cropping to 16:9 locally.')
        resp = call_gemini(key, args.model, prompt, with_aspect=False)
    raw = extract_image(resp)

    data, size = finalize(raw)
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_bytes(data)
    print(f'Saved {target.relative_to(ROOT)}  {size[0]}x{size[1]}  '
          f'{len(data) // 1024}KB (from {len(raw) // 1024}KB raw)')
    print('\nAdd to the post frontmatter:')
    print(f'heroImage: "{web_path}"')
    print('heroImageAlt: "<describe what the image shows, plainly>"')
    print('\nLook at the image before publishing — models still garble '
          'shapes and occasionally add text despite being told not to.')


if __name__ == '__main__':
    try:
        main()
    except Fail as e:
        print(f'\nError: {e}', file=sys.stderr)
        sys.exit(1)
