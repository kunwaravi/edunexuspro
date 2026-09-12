# TASK 6 — Course Banner Cards + Share Course · Report

> Date: 2026-08-17 · Project: EduNexus Pro · Branch: `master` (local)
> Status: **COMPLETE — not deployed, not pushed to git, migration additive-only**
> Revised per feedback: course cards now use **real, professional, legally-licensed per-course images** — not the earlier generic icon/gradient compositions.

---

## A. Scope

Every course in the homepage **Courses** section and the **/courses** catalog now leads with its **own relevant professional banner image** — a real photo/screenshot sourced from Wikimedia Commons under free licenses (CC0 / Public Domain / CC-BY / CC-BY-SA, all permitting website use). The previous SVG "icon-on-gradient" banners were removed. Cards stay lean (banner + title + light metadata + price + Share + View Course); syllabus, duration, learning outcomes etc. live on the **course detail page**, not the card.

- **0 courses added / removed** (exactly 34). Course ids, slugs, prices, modules, topics, payments, enrollments, certificates, quiz, progress — untouched.
- **Migration ADDITIVE ONLY** — one new column from the previous Task 6 (`comingSoon`). No schema change this revision; only banner **asset content + DB paths** changed (`.svg` → `.webp`).
- No external image hosts, no hotlinked URLs, no Google Images scraping, no trademarked brand artwork. Every banner is a **local controlled copy** in the app (`backend/public/course-banners/<slug>.webp`), so the UI cannot randomly break.

## B. Banner / Asset Strategy

**Real licensed images, stored locally as optimized WebP.**

| Decision | Detail |
|---|---|
| Source | **Wikimedia Commons** (public-domain / CC0 / CC-BY / CC-BY-SA) — via its public API with per-file license + author + source recorded |
| License check | Downloader only accepts `CC0 / Public domain / CC-BY / CC-BY-SA` — all permit website display; we additionally **crop/convert locally** (a derivative), which these licenses allow. Attribution kept on-disk + in this report |
| Format | **WebP**, 1200×675 (16:9), cover-cropped (`ImageOps.fit`, LANCZOS), `quality=82` — ~30–135 KB per file, ~2.4 MB total for all 34 |
| Storage | `backend/public/course-banners/<slug>.webp`, served by the existing `/static` express route → `GET /static/course-banners/<slug>.webp` (verified HTTP 200 `image/webp`) |
| DB | `Course.banner = '/static/course-banners/<slug>.webp'` for all 34 (idempotent backfill; asset path derived from API, so it can never drift) |
| No-license concerns | No course uses trademarked logos (VS Code / LibreOffice screenshots are open-source software UI; Arduino/ESP32 are hardware photos) |
| Fallback | `CourseBanner` keeps its existing graceful fallback — a broken/missing image renders a clean category-gradient visual with an icon (never a broken-image icon) |

**Tooling (kept in repo for future courses):** `backend/scripts/fetch_course_banners.py` — searches Commons per slug, enforces the license allow-list + landscape/quality minimums, converts to WebP, and writes `banner_sources.json` + `ATTRIBUTION.md`. Adding a course later = add one line to the `COURSES` list and re-run.

## C. Courses Covered — source & license

| Course (slug) | Source file (Wikimedia Commons) | License |
|---|---|---|
| 3D CAD (`3d-cad`) | `Blender 3D Models of Low Poly Box Trucks.png` | CC0 |
| Arduino (`arduino`) | `Arduino Uno board.jpg` | CC0 |
| AutoCAD 2D (`autocad-2d`) | `Engineering Drawing — DPLA` | Public domain |
| Basic Electronics (`basic-electronics`) | `Componentes.JPG` (resistors/components) | Public domain |
| C (`c`) | `VS Code (Insiders).png` (code editor) | Public domain |
| CADDED Civil (`cadded-civil`) | `Photocopy of engineering drawing (HAER)` | Public domain |
| CADDED Mech (`cadded-mech`) | `Involute Spur Gears External Meshing with Velocity Vectors.gif` | CC BY 4.0 |
| Computer Fundamentals (`computer-fundamentals`) | `Overhead desktop workspace (Unsplash)` | CC0 |
| C++ (`cpp`) | `C++ Code.png` | CC0 |
| Digital Electronics (`digital-electronics`) | `Wafer scale chip` | CC0 |
| DSA (`dsa`) | `New Flowchart Notation sample.jpg` | CC BY-SA 4.0 |
| Embedded (`embedded`) | `ADSL modem router internals labeled.jpg` | Public domain |
| Embedded C (`embedded-c`) | `Yamaha LM6405G controller by Sanyo` | CC0 |
| ESP32 (`esp32`) | `ESP32 on Lolin32 Lite clone board cropped.jpg` | CC0 |
| Full Stack Web (`full-stack-web`) | `VS Code Screenshot.png` | CC0 |
| HTML & CSS (`html-css`) | `Konquerormp.png` (browser/HTML view) | CC BY-SA 4.0 |
| IoT (`iot`) | `Internet of Things 2014 Conference` | CC BY 2.0 |
| ITI COPA (`iti-copa`) | `Hands-desk-office-working` | CC0 |
| ITI Electrician (`iti-electrician`) | `Electricians fixing electricity meter 5` | CC0 |
| ITI Fitter (`iti-fitter`) | `Machine workshop, railway workshops, Petone` | Public domain |
| Java (`java`) | `Java source code.png` | CC BY-SA 4.0 |
| JavaScript (`javascript`) | `Programming code.jpg` | CC BY-SA 4.0 |
| Linux (`linux`) | `Gentoo-sway-window-manager.png` (terminal/desktop) | CC BY-SA 4.0 |
| Microcontrollers (`microcontrollers`) | `Embedded World 2014 Arch Pro Developer Board` | CC0 |
| MS Excel (`ms-excel`) | `SUM formula in LibreOffice Calc.png` (spreadsheet) | CC0 |
| MS PowerPoint (`ms-powerpoint`) | `Libreoffice-impress.png` (presentation) | CC0 |
| MS Word (`ms-word`) | `Vintage Typewriter.jpg` | CC BY-SA 4.0 |
| Networking (`networking`) | `Raspberry Pi 4 on a network switch.jpg` | CC0 |
| Node.js (`node-js`) | `NOIRLab HQ Server Racks` | CC BY 4.0 |
| PCB Design (`pcb-design`) | `Circuit board with protective layer ready for etching.jpg` | CC0 |
| Python (`python`) | `Screen-python-code-matplotlib-physics-simulation.jpg` | CC BY-SA 4.0 |
| React (`react`) | `Online store on a screen (Unsplash)` | CC0 |
| SQL (`sql`) | `Technician with laptop working on server rack at NERSC` | CC0 |
| Web Design (`web-design`) | `Visual editor screen` (web page editor) | CC BY-SA 4.0 |

Full per-file author + source links: `backend/public/course-banners/ATTRIBUTION.md` and `backend/scripts/banner_sources.json`.

## D. Card Design (slim, banner-led)

```
[ COURSE BANNER  (real image, 16:9, object-cover, lazy) ]
[ Featured / Coming Soon badges (overlay, top-left)    ]
[ Category chip · Difficulty                            ]
[ Title  ·  Short description (2-line clamp)           ]
[ ⏱ duration · N Modules · Certificate · tags          ]
[ ₹ Price │ (Share icon) (VIEW COURSE)                 ]
```

- The previous inline **syllabus accordion was removed** from the card — cards are no longer information panels; syllabus/length/difficulty/outcomes/certificate details are viewed on the **course detail page** (spec requirement).
- Consistent: same 16:9 aspect (`aspect-[16/9]`), same card image height, `object-cover`, rounded top corners, legibility gradient overlay, no text touching edges, no content cut off.
- Everything on the card is API-driven (`GET /api/courses`): title, desc, category, difficulty, duration, moduleCount, certificate, price, banner, comingSoon. **No hardcoded course data in JSX**.
- Typography stays EduNexus (white/indigo/amber, uppercase micro-labels); long titles clamp without layout jump.

## E. Share Course

- **Web Share API** first (`navigator.share({ title, text, url: canonicalUrl })`); user dismissing the sheet (`AbortError`) is treated as success.
- **Fallback**: `navigator.clipboard.writeText(canonicalUrl)` → legacy `document.execCommand('copy')`; success toast **"Course link copied to clipboard."**
- **Canonical URL**: `${origin}/course/${slug || id}` — never exposes internal id when a slug exists (all 34 have slugs). Public course detail route, no enrolled/private content reachable.
- Share is its **own button** (stops propagation, 40px touch target, `aria-label="Share <Course Title>"` + `title`) and never triggers View Course.
- Verified: `GET /api/courses/full-stack-web` (the share target) resolves 200; live click shows the clipboard toast.

## F. Admin + Coming Soon (preserved from prior Task 6)

- Admin **PUT /api/courses/:courseId** accepts `banner` / `thumbnail` / `comingSoon`; CMS "Course Settings" panel can set/change a banner URL or toggle Coming Soon — no frontend edits needed to add a future banner.
- **Coming Soon**: card keeps an hourglass badge + disabled CTA (never implies availability), course stays visible in catalog, no separate page, toggle OFF restores View Course. No new course system — existing course/category architecture.
- Featured badge renders only from the API `featured` flag.

## G. Validation & Regression

| Gate | Result |
|---|---|
| `prisma validate` | ✅ PASS |
| Backend `tsc --noEmit` | ✅ PASS |
| Frontend `tsc --noEmit` | ✅ PASS |
| Frontend `vite build` | ✅ PASS |
| ESLint (8 changed files) | ✅ 0 errors (2 intentional warnings, pre-existing pattern) |
| **Task 4 security regression** | ✅ **17/17 PASS** |
| **Task 5 catalog regression** | ✅ **34/34 PASS** |
| **Task 6 banner suite** (updated for WebP) | ✅ **15/15 PASS** |
| **LIVE headed demo** (`~/playwright/run.sh task6-demo.js`) | ✅ **8/8 PASS** |

Task 6 checks: ① catalog exposes `banner`+`comingSoon` on 34/34; ② every course's banner asset exists on disk (path derived from API — no drift); ③ sample WebP assets serve HTTP 200 `image/webp`; ④ all 34 prices exact (25 spec prices + 9 legacy ₹699); ⑤ counts unchanged (course=34, module=305, topic=1205, quiz=6758); ⑥ admin Coming Soon ON/OFF on a throwaway course (default false → ON → OFF, cleanup in `finally`); ⑦ admin banner URL update reflected in catalog; ⑧ share target `/course/full-stack-web` resolves + source uses Web Share → clipboard → execCommand with canonical `/course/${slug || id}` + accessible label; ⑨ `CourseBanner` lazy/object-cover/onError fallback, card wires banner+share+Coming Soon disabled CTA, Home uses the new card; ⑩ `config/courses.ts` stays presentation-only (no banner/comingSoon/title/price).

**Data safety (verified live):** `Course=34 · Module=305 · Topic=1205 · QuizQuestion=6758` — prices exact, ids/slugs unchanged, no payment/enrollment/certificate/progress rows touched. Access control unchanged (Task 4 regression green).

**Live browser demo (headed, user-visible):** homepage shows 34 **distinct real banners** (Arduino board, Excel/Calc spreadsheet, ESP32 board, gear diagram, server rack, vintage typewriter, code screens, online-store UI…); 34 share buttons with accessible labels; Share click on MS Excel → clipboard toast; View Course on Full Stack Web → `/course/full-stack-web` detail page with the same banner in the hero.

### Files changed (revised Task 6)
**Backend** — `public/course-banners/*.svg` **deleted** (34) · `public/course-banners/*.webp` **added** (34) · `public/course-banners/ATTRIBUTION.md` (new) · `scripts/fetch_course_banners.py` (new) · `scripts/banner_sources.json` (new) · `prisma/generate_course_banners.ts` **deleted** · `prisma/backfill_course_banners.ts` (updated → `.webp`) · `tests/task6_banner_tests.ts` (updated → `.webp` assets)
**Frontend** — `components/molecules/CourseCard.tsx` (slimmed: removed inline syllabus accordion; kept banner/share/coming-soon/test literals)

### Remaining issues / notes
- Banners are center-cropped to 16:9; a few source photos are 4:3 (e.g. vintage typewriter) — the main subject stays centered, verified by crop logic, not visually re-inspected (image preview tooling unavailable this session; relevance was curated from the source file titles + license metadata).
- No WebP/AVIF raster upgrade needed — already WebP. A future course can drop a new image in `course-banners/` and update `Course.banner` from the CMS.
- Dev servers still running on :5000 / :5173 for the browser check. **Not deployed, not pushed.**
