#!/usr/bin/env python3
"""
Fetch authentic images (public domain / CC) from Wikimedia Commons for html-design-studio's content-design image workflow (Phase 3.5).

Why this script exists: content-led designs (parrots, coffee, Malaysia, etc.) require real imagery, not placeholder CSS color blocks.
Having the model rewrite the fetch logic every time is slow and error-prone (forgetting to clear proxies causes TLS failures; an invalid user agent causes 429s). This script captures the reliable workflow so only the keywords need to change.

Usage:
  python3 scripts/fetch_images.py --query "Petronas Towers" "Langkawi beach" "George Town street" \
      --out project/assets/img --count 2 --width 1600

For each query, download the first count images, resize them to width, save them under out, and print a provenance list (path | license | author | source page) for integrity review.
If every download fails, exit with code 1 and recommend the Phase 3.5 three-tier fallback (Unsplash/Pexels → image generation → an honest placeholder).
"""
import argparse, json, os, re, sys, urllib.parse, urllib.request

# ① Clear proxies: local curl/urllib requests fail TLS when routed through a proxy (see memory feedback_gemini_proxy).
for _k in ("ALL_PROXY", "all_proxy", "HTTP_PROXY", "http_proxy", "HTTPS_PROXY", "https_proxy"):
    os.environ.pop(_k, None)

API = "https://commons.wikimedia.org/w/api.php"
# ② A policy-compliant User-Agent is mandatory; otherwise Wikimedia returns 429.
UA = "html-design-studio-image-fetcher/1.0 (https://github.com/edan-fde/html-design-studio)"


def _api_get(params):
    url = API + "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)


def _safe(name):
    return re.sub(r"[^\w\-.]", "_", name)[:60]


def fetch(query, out, count, width):
    params = {
        "action": "query", "format": "json", "generator": "search",
        "gsrsearch": query, "gsrnamespace": 6, "gsrlimit": count,
        "prop": "imageinfo", "iiprop": "url|extmetadata", "iiurlwidth": width,
    }
    try:
        data = _api_get(params)
    except Exception as e:
        print(f"[FAIL search] {query}: {e}", file=sys.stderr)
        return []
    pages = (data.get("query", {}) or {}).get("pages", {})
    got = []
    for p in list(pages.values())[:count]:
        ii = (p.get("imageinfo") or [{}])[0]
        thumb = ii.get("thumburl") or ii.get("url")
        if not thumb:
            continue
        meta = ii.get("extmetadata", {}) or {}
        lic = (meta.get("LicenseShortName", {}) or {}).get("value", "?")
        artist = re.sub("<[^>]+>", "", (meta.get("Artist", {}) or {}).get("value", "?")).strip()
        ext = os.path.splitext(thumb)[1].split("?")[0] or ".jpg"
        fn = _safe(query) + "_" + _safe(p.get("title", "img").replace("File:", ""))
        fn = os.path.splitext(fn)[0][:55] + ext
        path = os.path.join(out, fn)
        try:
            req = urllib.request.Request(thumb, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=60) as r, open(path, "wb") as f:
                f.write(r.read())
            got.append(path)
            print(f"[OK] {path}  | {lic} | {artist} | {ii.get('descriptionurl','')}")
        except Exception as e:
            print(f"[FAIL dl] {thumb}: {e}", file=sys.stderr)
    if not got:
        print(f'[EMPTY] No results for "{query}" — try different keywords or use the Phase 3.5 fallback', file=sys.stderr)
    return got


def main():
    ap = argparse.ArgumentParser(description="Fetch authentic images from Wikimedia Commons (html-design-studio Phase 3.5)")
    ap.add_argument("--query", nargs="+", required=True, help="One or more English keywords (English queries perform best)")
    ap.add_argument("--out", required=True, help="Output directory (recommended: project/assets/img)")
    ap.add_argument("--count", type=int, default=2, help="Images per keyword (default: 2)")
    ap.add_argument("--width", type=int, default=1600, help="Resize width in px (default: 1600)")
    a = ap.parse_args()
    os.makedirs(a.out, exist_ok=True)
    allgot = []
    for q in a.query:
        allgot += fetch(q, a.out, a.count, a.width)
    print(f"\n=== Downloaded {len(allgot)} images to {a.out} ===")
    print("⚠️ Integrity check: would removing any image cause a loss of information? Does its license permit the intended use? Remove unsuitable images.")
    if not allgot:
        print("❌ All downloads failed → use the Phase 3.5 fallback (Unsplash/Pexels → image generation → an honest placeholder) and keep the workflow moving", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
