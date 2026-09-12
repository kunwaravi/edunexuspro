#!/usr/bin/env python3
"""
TASK 6 (revised) — fetch real, professional, legally-usable course banners.

Sources: Wikimedia Commons (public-domain / CC0 / CC-BY / CC-BY-SA, all permit
website use). Every download records author + license + source for attribution.
No brand logos/trademarked artwork are used — search terms avoid product logos.

Output:
  backend/public/course-banners/<slug>.webp   (1200x675, 16:9 cover-crop, q82)
  backend/public/course-banners/ATTRIBUTION.md (per-image source + license)

Usage:  python3 scripts/fetch_course_banners.py
Re-run is safe: it only writes files it successfully licenses + converts.
"""
import io
import json
import os
import sys
import time
import urllib.parse
import urllib.request

from PIL import Image, ImageOps

HERE = os.path.dirname(os.path.abspath(__file__))
OUT_DIR = os.path.join(HERE, "..", "public", "course-banners")
API = "https://commons.wikimedia.org/w/api.php"
UA = "EduNexusPro-Task6/1.0 (banner curation; contact: site owner)"
MANIFEST_JSON = os.path.join(HERE, "banner_sources.json")

# course id -> (slug, search terms). Terms avoid trademarked logos.
COURSES = [
    ("FullStackWeb",  "full-stack-web",    ["programming code screen laptop", "web developer computer code"]),
    ("MSExcel",       "ms-excel",           ["libreoffice calc spreadsheet", "spreadsheet cells numbers"]),
    ("MSWord",        "ms-word",            ["typewriter document typing", "documents paper desk"]),
    ("MSPowerPoint",  "ms-powerpoint",      ["libreoffice impress presentation", "presentation projector screen"]),
    ("ComputerFundamentals", "computer-fundamentals", ["computer keyboard workspace desk", "desktop computer office"]),
    ("Java",          "java",               ["coffee laptop programming", "coffee beans cup programming"]),
    ("JavaScript",    "javascript",         ["javascript code screen", "javascript programming code"]),
    ("DSA",           "dsa",                ["binary tree data structure diagram", "algorithm flowchart diagram"]),
    ("HTMLCSS",       "html-css",           ["html css code browser", "web design code screen"]),
    ("React",         "react",              ["react web app ui", "web application interface design"]),
    ("NodeJS",        "node-js",            ["data center server rack", "server room racks"],),
    ("Linux",         "linux",              ["linux terminal command line", "linux shell terminal"]),
    ("Networking",    "networking",         ["network switch cables ethernet", "network server rack"]),
    ("Arduino",       "arduino",            ["arduino uno board", "arduino microcontroller board"]),
    ("ESP32",         "esp32",              ["esp32 development board", "esp32 microcontroller"]),
    ("EmbeddedC",     "embedded-c",         ["microcontroller chip closeup", "microcontroller board electronics"]),
    ("Microcontrollers", "microcontrollers", ["microcontroller circuit board", "microcontroller electronics"]),
    ("BasicElectronics", "basic-electronics", ["electronic components resistors", "electronic components circuit"]),
    ("DigitalElectronics", "digital-electronics", ["integrated circuit chips", "digital circuit chip"]),
    ("PCBDesign",     "pcb-design",         ["printed circuit board", "pcb circuit board green"]),
    ("AutoCAD2D",     "autocad-2d",         ["engineering blueprint technical drawing", "technical drawing drafting"]),
    ("ThreeDCAD",     "3d-cad",             ["3d printer cad model", "3d modeling software screen"]),
    ("C",             "c",                  ["c source code gcc screen", "c programming code"]),
    ("C++",           "cpp",                ["c plus plus code", "programming code editor screen"]),
    ("IoT",           "iot",                ["internet of things devices", "smart connected devices network"]),
    ("Embedded",      "embedded",           ["single board computer electronics", "embedded microcontroller electronics"]),
    ("WebDesign",     "web-design",         ["website mockup design screen", "browser website screenshot"]),
    ("Python",        "python",             ["python code screen editor", "python programming code"]),
    ("SQL",           "sql",                ["data center server racks", "database server storage"]),
    ("CADDED_Mech",   "cadded-mech",        ["mechanical engineering gears", "mechanical gears design"]),
    ("CADDED_Civil",  "cadded-civil",       ["civil engineering construction drawing", "construction blueprint building"]),
    ("ITICOPA",       "iti-copa",           ["computer operator office desk", "office computer workspace"]),
    ("ITIElectrician","iti-electrician",    ["electrician electrical wiring", "electrical installation work"]),
    ("ITIFitter",     "iti-fitter",         ["metal lathe machine workshop", "lathe machining metal"]),
]

# Licenses that permit website display (and our local conversion/cropping).
LICENSE_OK = ("cc0", "public domain", "pd", "cc by", "cc by-sa", "cc-by", "cc-by-sa")

def api_search(term, limit=20, retries=4):
    """Commons search with 429 backoff — be polite, retry on throttle."""
    q = urllib.parse.urlencode({
        "action": "query", "format": "json",
        "generator": "search",
        "gsrsearch": f"{term} filetype:bitmap",
        "gsrnamespace": 6, "gsrlimit": limit,
        "prop": "imageinfo",
        "iiprop": "url|extmetadata|size",
        "iiurlwidth": 1280,  # standard Wikimedia thumb size (avoids CDN robot policy)
        "maxlag": 5,
    })
    url = f"{API}?{q}"
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=45) as r:
                return json.loads(r.read().decode())
        except urllib.error.HTTPError as e:
            if e.code == 429 and attempt < retries - 1:
                wait = 6 * (2 ** attempt)
                print(f"    · 429 → backoff {wait}s (attempt {attempt + 1}/{retries})")
                time.sleep(wait)
                continue
            raise
    return {"query": {"pages": {}}}

def license_name(em):
    v = (em.get("LicenseShortName", {}) or {}).get("value", "").strip()
    if not v:
        v = (em.get("License", {}) or {}).get("value", "").strip()
    return v

def artist_name(em):
    v = (em.get("Artist", {}) or {}).get("value", "")
    return "".join(c for c in v if c not in "<>" and not c.isspace() and c not in "[]{}\"")[:120] or "Wikimedia Commons"

def pick_best(pages, prefer_license):
    """Pick highest-quality landscape image with an allowed license."""
    best = None
    for p in pages.values():
        ii = (p.get("imageinfo") or [{}])[0]
        w, h = ii.get("width", 0), ii.get("height", 0)
        if w < 1200:
            continue
        lic = license_name(ii.get("extmetadata", {})).lower()
        if not any(ok in lic for ok in LICENSE_OK):
            continue
        thumb = ii.get("thumburl") or ii.get("url")
        if not thumb:
            continue
        # landscape strongly preferred (16:9 crop keeps the subject)
        is_land = w >= h and w / h >= 1.2
        # prefer target license tier: CC0/PD > CC-BY > CC-BY-SA
        tier = 3 if ("cc0" in lic or "public domain" in lic or lic == "pd") else (2 if "cc by " in lic or lic.startswith("cc-by") else 1)
        score = (w / h if is_land else 0.3) + tier * 100 + min(w, 5000) / 1e4
        if best is None or score > best["score"]:
            best = {
                "title": p.get("title", ""),
                "thumb": thumb,
                "width": w, "height": h,
                "license": license_name(ii.get("extmetadata", {})),
                "artist": artist_name(ii.get("extmetadata", {})),
                "desc_url": ii.get("descriptionurl", ""),
                "score": score,
            }
    return best

def dl(url, out_raw):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60) as r:
        data = r.read()
    with open(out_raw, "wb") as f:
        f.write(data)
    return data

def to_webp(raw_path, out_path, size=(1200, 675)):
    with Image.open(raw_path) as im:
        im = ImageOps.exif_transpose(im).convert("RGB")
        im = ImageOps.fit(im, size, Image.LANCZOS, centering=(0.5, 0.5))
        im.save(out_path, "WEBP", quality=82, method=4)

def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    only = None
    force = "--force" in sys.argv
    if "--only" in sys.argv:
        i = sys.argv.index("--only")
        only = set(sys.argv[i + 1].split(","))
    manifest = []
    if os.path.exists(MANIFEST_JSON):
        with open(MANIFEST_JSON) as f:
            manifest = json.load(f)
    known = {m["slug"]: m for m in manifest}
    failures = []
    for cid, slug, terms in COURSES:
        if only and slug not in only:
            continue
        out = os.path.join(OUT_DIR, f"{slug}.webp")
        if os.path.exists(out) and not force:
            print(f"SKIP  {slug} (already exists)")
            continue
        chosen = None
        for term in terms:
            try:
                pages = api_search(term).get("query", {}).get("pages", {})
            except Exception as e:
                print(f"  !! search failed ({term}): {e}")
                continue
            chosen = pick_best(pages, prefer_license=3)
            if chosen:
                print(f"  ✓ '{term}' → {chosen['title']} ({chosen['license']})")
                break
            print(f"  ✗ '{term}' → no licensed landscape ≥1200px")
            time.sleep(1.5)
        if not chosen:
            failures.append((cid, slug, "no usable image found"))
            print(f"FAIL  {slug}: no usable image")
            continue
        raw = out + ".raw"
        try:
            dl(chosen["thumb"], raw)
            to_webp(raw, out)
            os.remove(raw)
        except Exception as e:
            failures.append((cid, slug, f"download/convert error: {e}"))
            print(f"FAIL  {slug}: {e}")
            continue
        manifest.append({"id": cid, "slug": slug, "source": chosen["thumb"],
                         "license": chosen["license"], "artist": chosen["artist"],
                         "desc": chosen["desc_url"]})
        print(f"OK    {slug} ← {chosen['width']}x{chosen['height']} {chosen['license']}")
        time.sleep(1.5)  # be polite to Commons

    # attribution manifest (merge: keep entries whose file still exists)
    keep = [m for m in manifest if os.path.exists(os.path.join(OUT_DIR, f"{m['slug']}.webp"))]
    with open(MANIFEST_JSON, "w") as f:
        json.dump(keep, f, indent=2)
    if keep:
        lines = ["# Course banner attribution (Wikimedia Commons)", ""]
        for m in sorted(keep, key=lambda x: x["slug"]):
            lines.append(f"- `{m['slug']}.webp` ({m['id']}) — {m['license']} — {m['artist']} — {m['desc'] or m['source']}")
        with open(os.path.join(OUT_DIR, "ATTRIBUTION.md"), "w") as f:
            f.write("\n".join(lines) + "\n")

    print(f"\n=== {len(manifest)} banners written, {len(failures)} failures ===")
    for f in failures:
        print("  FAIL:", f)
    return 1 if failures else 0

if __name__ == "__main__":
    raise SystemExit(main())
