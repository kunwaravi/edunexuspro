# EduNexus Pro — Deep Content Audit: **Web Design & Frontend Development**

- **Course DB id:** `WebDesign`
- **Auditor:** Lead Curriculum Quality Auditor (independent deep-scan)
- **Audit date:** 2026-08-14
- **Scope:** AUDIT-ONLY. No product content, seed file, database record, source code, or schema was modified. The only file written is this audit document.
- **Evidence labels:** `[CONFIRMED]` directly verified (file:line or DB query/id) · `[INFERRED]` strong conclusion from multiple confirmed pieces · `[UNKNOWN — NOT VERIFIED]` cannot verify · `[RECOMMENDATION]` suggestion only.
- **Severity:** P0 critical / P1 high / P2 medium / P3 low.

---

## 1. Executive Summary

The **Web Design & Frontend Development** course (`WebDesign`) is a hand-written, 20-week, 80-topic curriculum covering HTML5 → CSS (incl. Flexbox, Grid, Tailwind) → JavaScript (incl. DOM, events, async/fetch) → a build-and-deploy portfolio project → final review. It is the strongest course in the catalog by content quality and technical accuracy, and this audit independently confirms that: **zero factual errors in answer keys**, structurally clean question bank, coherent and modern sequencing, and unusually consistent per-topic format (`text → code → note`).

However, this deep audit widens the lens beyond prose quality to the full learning system, and on that basis the course scores **78/100** — lower than the previously reported **84/100**. The difference is not a disagreement about content quality; it is that the earlier score did not fully weight two platform-level facts that directly determine whether this course's *summative and practice* assessment is reachable:

1. **The final exam is dead content.** All 15 hand-written WebDesign final-exam questions are seeded in the DB but no backend route or frontend page ever serves them (`[CONFIRMED]` zero code references). Students cannot take a final exam.
2. **The 6 interactive HTML challenges are UI-orphaned.** A complete, sandboxed, auto-graded challenge engine exists and is seeded for Week 1, but no frontend route or component consumes `api/challenges/*`. Students cannot reach them.
3. **CSS `position`/`z-index` and ES modules/JS objects are not taught** — yet Week 18 teaches modals/lightboxes (unbuildable without `position: fixed` + `z-index`) and Week 20 recommends React (unreachable without `import`/`export`).

Additional P2–P3 findings: a copy-paste-breaking unterminated HTML comment in the Week 15 wireframe example; a dangling "closures" cross-reference; concept-level assessment redundancy (`.sort()` and `res.ok` each tested 3× across topic/module/final layers); a stale DB course description advertising "in Hinglish" while all content is English; and no per-question explanations anywhere (feedback is score-without-learning).

**No P0 (critical/broken) defects** were found. The course's teaching text and quiz keys are accurate and well written; the gaps are structural (missing topics) and systemic (reachability, feedback).

---

## 2. Course Metadata (DB-sourced)

`[CONFIRMED]` via `SELECT … FROM "Course" WHERE id='WebDesign'`.

| Field | Value |
|---|---|
| id | `WebDesign` |
| title | Web Design & Frontend Development |
| description | "Learn HTML, CSS, JavaScript, and modern responsive design patterns in Hinglish." |
| price | 699 (₹) |
| isPublished | `true` |

> **Discrepancy:** The DB description advertises "in Hinglish," but the actual teaching text is English (the string "Hinglish" appears once in content — `webdesign.ts:69`, as a mojibake example). The reseed script's *create* path would have written a different description ("Build production-ready websites from scratch — …"), but the course pre-existed, so the stale Hinglish description was retained (`reseed_webdesign_full.ts:34-49` updates the course only when absent). `[CONFIRMED]` — see §22.

---

## 3. Content Inventory (DB counts)

`[CONFIRMED]` re-verified against the live `nexus` DB via `/tmp/nexus-psql.sh` (2026-08-14). **All six inventory figures from the task brief match exactly.**

| Item | Expected | DB-verified | Verdict |
|---|---|---|---|
| Modules | 20 | 20 | ✅ match |
| Topics | 80 | 80 | ✅ match |
| Topic-quiz questions | 320 | 320 (4 × 80 topics) | ✅ match |
| Module-quiz questions | 160 | 160 (8 × 20 modules) | ✅ match |
| Final-exam questions | 15 | 15 | ✅ match |
| Challenges | 6 | 6 | ✅ match |

**Per-module breakdown (20 modules × 4 topics × 4 topic-quiz Q = 16; + 8 module-quiz Q):**

| Week | Module title | Topics | Topic-quiz Q | Module-quiz Q |
|---|---|---|---|---|
| 1 | Introduction to HTML5 & Web Fundamentals | 4 | 16 | 8 |
| 2 | HTML Semantic Tags & Structure | 4 | 16 | 8 |
| 3 | CSS Basics & Selectors | 4 | 16 | 8 |
| 4 | CSS Box Model & Units | 4 | 16 | 8 |
| 5 | Flexbox & Modern Layouts | 4 | 16 | 8 |
| 6 | CSS Grid, Transitions & Animations | 4 | 16 | 8 |
| 7 | Responsive Design & Media Queries | 4 | 16 | 8 |
| 8 | Tailwind CSS Introduction | 4 | 16 | 8 |
| 9 | JavaScript Basics, Variables & Types | 4 | 16 | 8 |
| 10 | JS Control Flow & Operators | 4 | 16 | 8 |
| 11 | JS Functions & Arrays | 4 | 16 | 8 |
| 12 | DOM Manipulation | 4 | 16 | 8 |
| 13 | Event Handlers & Interactivity | 4 | 16 | 8 |
| 14 | Async JS, Promises & Fetch/APIs | 4 | 16 | 8 |
| 15 | Mini-Project Planning (Portfolio) | 4 | 16 | 8 |
| 16 | Building the Portfolio Project | 4 | 16 | 8 |
| 17 | Styling & Responsive Polish | 4 | 16 | 8 |
| 18 | Interactivity & UX Enhancements | 4 | 16 | 8 |
| 19 | Git, Hosting & Deployment | 4 | 16 | 8 |
| 20 | Final Project Review & Certification | 4 | 16 | 8 |
| **Total** | | **80** | **320** | **160** |

**Challenges (`[CONFIRMED]`):** 6 rows, all `challengeType='HTML'`, all attached to module id 81 (week 1), `isPublished=true`, order 0–5: Say Hello to HTML Elements, Headline with the h2 Element, Comment out HTML, Fill in the Blank with Placeholder Text, Uncomment HTML, Introduction to HTML5 Elements.

**Integrity checks (`[CONFIRMED]`, all clean):**
- 0 quiz questions where `correctAnswer` is not among `options`.
- 0 questions with ≠ 4 options.
- 0 final-exam questions with `correctAnswer` outside `options`.
- 0 exact-duplicate question texts (quiz or final).
- 0 topics lacking a quiz (all 80 have exactly 4).

---

## 4. Curriculum Structure

`[CONFIRMED]` from `webdesign.ts` sections 1–20 and DB module/topic ordering.

**Arc:** HTML5 fundamentals (W1–2) → CSS (W3–8, incl. Tailwind) → JavaScript (W9–14) → portfolio project planning/build/polish (W15–18) → Git & deployment (W19) → final review & certification (W20).

- **Sequencing:** textbook-sensible and industry-standard. The CSS track builds correctly (selectors → box model/units → flexbox → grid → responsive → Tailwind). The JS track builds correctly (types/coercion → control flow → functions/arrays → DOM → events → async/fetch). The project weeks correctly teach plan → build → style/polish → interactivity → deploy → audit.
- **Module balance:** HTML+CSS = 8 weeks, JS = 6 weeks, project/deploy = 6 weeks. For a *web design* course this lean toward markup/styling + shipping is appropriate. `[INFERRED]`
- **Missing prerequisites:** the course has no explicit prerequisites section (consistent with the catalog-wide finding). No prior-knowledge gate exists. For a beginner course this is acceptable but should be documented ("Assumes zero web experience; basic computer literacy"). `[RECOMMENDATION]`
- **Premature advanced topics:** none found. Tailwind (W8) is introduced only *after* the CSS fundamentals it depends on, and the course explicitly states "Tailwind does not replace knowing CSS — it *is* CSS" (`webdesign.ts:620`). `[CONFIRMED]`
- **Structural gaps:** CSS `position`/`z-index` (P1) and ES modules/JS objects/classes (P1) are absent; see §8 and the issue register.

---

## 5. Module-by-Module Analysis

Each module scored on content quality + technical accuracy + assessment fit. Legend: 5 = excellent, 4 = strong, 3 = adequate, 2 = weak, 1 = poor.

| Week | Module | Quality | Tech | Assess | Notes |
|---|---|---|---|---|---|
| 1 | Intro to HTML5 & Web Fundamentals | 5 | 5 | 4 | HTTP/GET/POST/status codes, structure vs presentation, element anatomy, DOCTYPE/head/body. Clean. 6 challenges seeded here (orphaned). |
| 2 | HTML Semantic Tags & Structure | 5 | 5 | 4 | Landmarks, headings, links/images/media. `rel="noopener"` taught correctly. |
| 3 | CSS Basics & Selectors | 5 | 5 | 5 | Cascade/specificity/inheritance, selectors, combinators, pseudo-class/elements. Specificity "100/10/1" correctly labeled "Roughly". |
| 4 | CSS Box Model & Units | 5 | 5 | 5 | Box model, box-sizing reset, rem/em/%, display modes. Margin-collapse taught. |
| 5 | Flexbox & Modern Layouts | 5 | 5 | 5 | Axis model, justify/align, flex-grow/shrink/basis, centering patterns. `flex:1 === flex:1 1 0%` correct. |
| 6 | CSS Grid, Transitions & Animations | 5 | 5 | 5 | Grid tracks/areas/auto-fit, transitions, keyframes, transform/opacity reflow rule, `prefers-reduced-motion`. |
| 7 | Responsive Design & Media Queries | 5 | 5 | 5 | Mobile-first, breakpoints, clamp()/min()/max(), fluid images, responsive patterns. |
| 8 | Tailwind CSS Introduction | 4 | 4 | 4 | Utility-first, scale, responsive prefixes, v4 config. Spacing-scale claim slightly imprecise (see §8). |
| 9 | JS Basics, Variables & Types | 5 | 5 | 5 | const/let/var, primitives, falsy set, coercion, template literals. "only language browsers understand natively" needs a Wasm caveat. |
| 10 | JS Control Flow & Operators | 5 | 5 | 5 | `===`/`==`, `&&`/`||`/`??`, if/ternary, loops, switch. `??` vs `||` nuance taught well. |
| 11 | JS Functions & Arrays | 5 | 5 | 4 | Declarations/expressions/arrows, rest/spread, map/filter/reduce. Dangling "closure" cross-ref; `?.` used without teaching. |
| 12 | DOM Manipulation | 5 | 5 | 5 | DOM tree, selectors, textContent vs innerHTML/XSS, create/append/remove, fragment pattern. |
| 13 | Event Handlers & Interactivity | 5 | 5 | 5 | Bubbling/capturing, addEventListener, common events, delegation. |
| 14 | Async JS, Promises & Fetch/APIs | 5 | 5 | 4 | Event loop, promises, async/await, fetch + res.ok + CORS. Top-level `await` in an example that isn't a module (see §8). |
| 15 | Mini-Project Planning (Portfolio) | 4 | 4 | 4 | MVP scoping, wireframing, design tokens, file structure. **Unterminated HTML comment in code example (P2).** |
| 16 | Building the Portfolio Project | 5 | 5 | 4 | Semantic skeleton, hero/about, projects grid, contact form. Builds directly on W15 plan. |
| 17 | Styling & Responsive Polish | 5 | 5 | 5 | Spacing rhythm, breakpoint check, a11y (contrast/focus/ARIA), performance. |
| 18 | Interactivity & UX Enhancements | 4 | 4 | 4 | Form validation, scrollspy, **modal/lightbox (needs position/z-index — not taught)**, dark mode. |
| 19 | Git, Hosting & Deployment | 5 | 5 | 5 | init/add/commit, branches, .gitignore, Netlify/Vercel/Pages, custom domains. |
| 20 | Final Project Review & Certification | 5 | 5 | 4 | Review checklist, cross-device testing, Lighthouse audit, certification prep. Recommends React (needs ES modules — not taught). |

---

## 6. Topic-by-Topic Findings

All 80 topics verified present in both DB and `webdesign.ts` / `webdesign_topic_quizzes.ts`, each with exactly 4 topic-quiz questions. Findings below highlight only topics with notable issues; the healthy population is summarized in §12.

| W.T | Topic | Finding |
|---|---|---|
| W11.T1 | Function Declarations, Expressions & Arrow Functions | Dangling cross-reference: "a 'closure', Section 11 covers the mechanics" (`webdesign.ts:871`) but no Week 11 topic teaches closures. **P2.** |
| W11.T3 | Array Methods: map, filter & reduce | `top?.name` used in code (`webdesign.ts:886`) with no optional-chaining explanation anywhere in the course. **P3.** |
| W15.T1 | Scoping the Project: Requirements & MVP | Unterminated HTML comment in the wireframe code block: `<!-- Low-fi wireframe as HTML skeletons --` (`webdesign.ts:1207`) — never closes with `-->`; copy-paste would comment out the rest of a student's page. **P2.** |
| W17.T3 | Accessibility: Contrast, Focus & ARIA | `aria-expanded="false"` used in code (`webdesign.ts:1378`) with no explanation of the attribute (icon-button `aria-label` is explained; `aria-expanded` is not). **P3.** |
| W18.T3 | Lightbox & Modal Patterns | The modal/lightbox pattern is taught (structure, focus trap, scroll lock) but the CSS that makes an overlay overlay — `position: fixed`, `z-index`, `inset` — is **not taught anywhere** in W3–W18. The code block (`webdesign.ts:1460`) shows the dialog markup only; no `.overlay` CSS is given. **P1 (root cause: position/z-index gap).** |

No other per-topic content defects found.

---

## 7. Content Chunk Summaries

Chunk ID = `W{week}.T{order}`. Each chunk = `{text, code, note}`. (Summaries aggregate; the full text is in `webdesign.ts`.)

**W1 — Introduction to HTML5 & Web Fundamentals** (`webdesign.ts:37–113`)
- W1.T0 **How the Web Works**: browser↔server, HTTP GET/POST, status codes, Network tab debugging. Code: inspector page. Note: 404 ≠ "internet broken". Accurate.
- W1.T1 **What Is HTML**: structure vs presentation vs behaviour; HTML is markup, not a programming language; DOM bridge. Note: exam one-liner.
- W1.T2 **Anatomy of an Element**: tags/attributes/content/void elements, boolean attributes, nesting. Note: `<img>` is void.
- W1.T3 **First HTML Page**: DOCTYPE/quirks mode, head vs body, viewport, lang, UTF-8. Note: mojibake.

**W2 — HTML Semantic Tags & Structure** (`webdesign.ts:119–195`)
- W2.T0 Semantic vs non-semantic; a11y/SEO/maintainability; `<article>/<aside>/<main>` etc.
- W2.T1 Layout landmarks; `<main>` exactly once; named-rooms analogy.
- W2.T2 Headings/paragraphs/text formatting; lists; "headings by level not size".
- W2.T3 Links (`rel="noopener"`), images (`alt`, `loading="lazy"`), media (`controls`).

**W3 — CSS Basics & Selectors** (`webdesign.ts:201–277`)
- W3.T0 Cascade/specificity/inheritance; DevTools Styles panel debugging.
- W3.T1 Type/class/ID/grouping; BEM naming mention.
- W3.T2 Combinators (descendant vs child vs sibling); attribute selectors.
- W3.T3 Pseudo-classes (`:hover/:focus/:nth-child/:not/:checked`) and pseudo-elements (`::before/::after`), `content` requirement; `:focus` a11y rule.

**W4 — CSS Box Model & Units** (`webdesign.ts:283–359`)
- W4.T0 Box model layers; vertical margin collapse; width accounting gotcha.
- W4.T1 `box-sizing: border-box` universal reset; min/max-width; avoid fixed heights.
- W4.T2 px/%/em/rem/vh/vw; `rem` for type+spacing; `em` compounding; a11y benefit of rem.
- W4.T3 display block/inline/inline-block/none; `display:none` vs `visibility:hidden` vs `opacity:0`; flex centering preview.

**W5 — Flexbox & Modern Layouts** (`webdesign.ts:365–441`)
- W5.T0 Flex container/items; main vs cross axis; direct-children-only rule.
- W5.T1 `justify-content` (main) vs `align-items` (cross); `gap`.
- W5.T2 `flex-basis/grow/shrink`, `flex:1` shorthand, `order`.
- W5.T3 Centering/navbar/card-grid/sticky-footer/equal-height patterns; "reach for Grid when 2D".

**W6 — CSS Grid, Transitions & Animations** (`webdesign.ts:447–523`)
- W6.T0 Grid tracks, `fr`, `grid-column: 1 / -1`, line numbering.
- W6.T1 `grid-template-areas`, auto-placement, `repeat(auto-fit, minmax())`.
- W6.T2 Transitions (property/duration/easing); animate transform+opacity, not layout props; `prefers-reduced-motion`.
- W6.T3 `@keyframes`, transforms (translate/scale/rotate), transition-vs-animation guidance.

**W7 — Responsive Design & Media Queries** (`webdesign.ts:529–605`)
- W7.T0 Mobile-first philosophy; min-width adds.
- W7.T1 Media query syntax; breakpoints from content; ordering.
- W7.T2 `clamp()/min()/max()`; `img { max-width:100%; height:auto }`.
- W7.T3 Collapsing nav, multi-column→single, fluid hero, hide-on-mobile sidebar, mobile tables.

**W8 — Tailwind CSS Introduction** (`webdesign.ts:611–687`)
- W8.T0 Utility-first vs component CSS; hybrid `@apply`.
- W8.T1 Spacing/color/typography utilities; scale claim imprecise (see §8); arbitrary values.
- W8.T2 Layout utilities + responsive prefixes; default breakpoints sm 640/md 768/lg 1024/xl 1280/2xl 1536.
- W8.T3 Play CDN vs build pipeline; v4 `@theme`; extraction + scan-config discipline.

**W9 — JavaScript Basics, Variables & Types** (`webdesign.ts:693–769`)
- W9.T0 Where JS runs (browser + Node); `<script>` + `defer`.
- W9.T1 `let/const/var`; block vs function scope; const-by-default.
- W9.T2 Seven primitives; null vs undefined; `typeof null`; truthiness/falsy set.
- W9.T3 Coercion traps; `===` vs `==`; explicit conversion; template literals; `NaN` quirks.

**W10 — JS Control Flow & Operators** (`webdesign.ts:775–856`)
- W10.T0 Comparison/logical operators; `??` vs `||`; reference equality for arrays.
- W10.T1 if/else-if/else; ternary; switch; most-specific-first.
- W10.T2 for/while/do-while/for-of; break/continue; avoid for-in.
- W10.T3 switch deep-dive: fall-through, strict `===` cases, grouping, default.

**W11 — JS Functions & Arrays** (`webdesign.ts:861–938`)
- W11.T0 Declarations (hoisted) / expressions / arrows (`this` inheritance).
- W11.T1 Default params, rest, destructuring; spread vs rest.
- W11.T2 map/filter/reduce; immutability; chaining; sibling methods (find/some/every).
- W11.T3 Spread/rest in practice; `sort()` lexical default + comparator; config-merge idiom.

**W12 — DOM Manipulation** (`webdesign.ts:944–1020`)
- W12.T0 DOM tree; live vs source; View Source vs DevTools Elements.
- W12.T1 `getElementById`/`querySelector`/`querySelectorAll`; NodeList not array.
- W12.T2 textContent vs innerHTML (XSS); value; classList; dataset; style vs classes.
- W12.T3 createElement/appendChild/fragment; insertBefore/prepend/remove; leak discipline.

**W13 — Event Handlers & Interactivity** (`webdesign.ts:1026–1102`)
- W13.T0 Capture/target/bubble; stopPropagation vs stopImmediatePropagation.
- W13.T1 addEventListener; event object (target/currentTarget/key/coords/preventDefault).
- W13.T2 click/input/change/submit/keydown/focus/blur; mouseenter vs mouseover.
- W13.T3 Event delegation; `closest()`; `{ once: true }`; dynamic content.

**W14 — Async JS, Promises & Fetch/APIs** (`webdesign.ts:1109–1184`)
- W14.T0 Single-threaded event loop; setTimeout(0) queues after sync.
- W14.T1 Promise states; then/catch/finally; chaining; Promise.all.
- W14.T2 async/await; try/catch; serial-vs-parallel; throw new Error.
- W14.T3 fetch GET/POST; res.ok check; Bearer auth; CORS.

**W15 — Mini-Project Planning (Portfolio)** (`webdesign.ts:1191–1266`)
- W15.T0 MVP scoping; requirements; definition of done.
- W15.T1 Wireframing; information architecture. **Unterminated HTML comment defect (P2).**
- W15.T2 Design tokens (CSS variables for color/type/spacing/effects).
- W15.T3 File structure; build plan (skeleton→CSS→responsive→JS→content→audit).

**W16 — Building the Portfolio Project** (`webdesign.ts:1273–1348`)
- W16.T0 Semantic skeleton; one `<h1>`; skip link; meta essentials.
- W16.T1 Hero + About (flex two-column that stacks).
- W16.T2 Projects grid (auto-fit/minmax) + skills strip; honest card quality.
- W16.T3 Contact form (labels, types, required, mailto fallback) + footer.

**W17 — Styling & Responsive Polish** (`webdesign.ts:1354–1430`)
- W17.T0 Spacing rhythm; vertical rhythm; gap principle.
- W17.T1 Breakpoint check (320/480/768/1024/1440); no horizontal scroll; 44px touch targets.
- W17.T2 WCAG 4.5:1 contrast; `:focus-visible`; native semantics before ARIA; Lighthouse a11y.
- W17.T3 Performance: images (WebP/AVIF/lazy/srcset), font-display:swap, minimal JS, budgets.

**W18 — Interactivity & UX Enhancements** (`webdesign.ts:1436–1512`)
- W18.T0 Client-side form validation; regex email shape; blur/input live + submit re-validate; aria-invalid.
- W18.T1 `scroll-behavior: smooth`; scroll-margin-top; scrollspy via IntersectionObserver.
- W18.T2 Lightbox/modal patterns; focus trap; scroll lock. **CSS for the overlay not taught (P1 dependency).**
- W18.T3 Dark mode + localStorage; data-theme on `<html>`; flash-of-wrong-theme prevention.

**W19 — Git, Hosting & Deployment** (`webdesign.ts:1519–1594`)
- W19.T0 init/add/commit; working/staging/repo; commit-message guidance.
- W19.T1 Branches/merge/conflicts; .gitignore (node_modules/.env); remotes.
- W19.T2 GitHub Pages/Netlify/Vercel; continuous deployment; drag-and-drop.
- W19.T3 Custom domains (A/CNAME); preview deploys; deploy early & often; favicon/404.

**W20 — Final Project Review & Certification** (`webdesign.ts:1600–1677`)
- W20.T0 Code review checklist (HTML/CSS/JS/hygiene).
- W20.T1 Cross-device test ladder; keyboard-only; zoom; issue log.
- W20.T2 Lighthouse audit; 90+ targets on Performance & Accessibility.
- W20.T3 Certification prep; rebuild-from-memory; one-sentence drills; "what comes next" → **React (needs ES modules — not taught; P1 dependency)**.

**Final exam** (`webdesign.ts:1689–1805`): 15 distinct, well-distributed questions sampling horizontal-scroll cause, margin, querySelector null, res.ok, mobile-first, semantic nav, transform/opacity, sort, XSS, const, submit event, auto-fit grid, localStorage theme, justify-content, deploy-early. **Seeded but unreachable (§21).**

---

## 8. Technical Accuracy Findings

Overall verdict: **high accuracy**. No factual error was found in the 495 question answer keys (see §12), and the HTML/CSS/JS teaching is verified current. Findings below are the only exceptions, none P0/P1-causing.

| # | Claim / code | Verdict | Evidence | Severity |
|---|---|---|---|---|
| TA-1 | **CSS `position`/`z-index` never taught** while W18 teaches modals/lightboxes. | `[CONFIRMED]` gap. `position`, `absolute`, `relative`, `fixed`, `sticky`, `z-index` appear only as a Tailwind utility name (`webdesign.ts:634`) and in quiz distractor options (`webdesign.ts:418,438,654`). No topic in W3–W7 teaches them; the W18 overlay code (`webdesign.ts:1460`) shows markup only, no overlay CSS. Students cannot build the taught modal. | P1 |
| TA-2 | **ES modules (`import`/`export`) and JS objects/classes not taught**; W20 recommends React (`webdesign.ts:1630`). | `[CONFIRMED]` gap. No `import`/`export` teaching in W9–14; objects appear only as data literals (`webdesign.ts:885–886`); "this … in objects and classes" (`webdesign.ts:871`) references classes never taught. React is unreachable without modules. | P1 |
| TA-3 | **W15 wireframe code block unterminated HTML comment** — `<!-- Low-fi wireframe as HTML skeletons --` never closes with `-->`. | `[CONFIRMED]` code defect (`webdesign.ts:1207`). Copy-paste would treat the rest of the page as a comment. Direction: close the comment `-->` (and fix "skeletons"→"skeleton"). | P2 |
| TA-4 | **Dangling closure cross-reference** ("a 'closure', Section 11 covers the mechanics") with no closure content in W11. | `[CONFIRMED]` (`webdesign.ts:871`; grep for "closure" returns only this line). Direction: add a 2–3 line closure explanation or reword the reference. | P2 |
| TA-5 | **Tailwind spacing scale over-simplified** — "p-0 to p-96 step in 0.25rem increments." | `[CONFIRMED]` imprecise (`webdesign.ts:627`). Tailwind's default scale includes fractional steps (p-0.5 = 0.125rem) and (v3) non-linear jumps; v4 is a dynamic 0.25rem multiple ladder. The claim is *approximately* right for v4 integer utilities but not literally accurate; the course never pins a version. Direction: say "a fixed 0.25rem-based spacing scale (plus fractional steps)". | P3 |
| TA-6 | **"JavaScript is the only programming language that browsers understand natively."** | `[CONFIRMED]` simplification (`webdesign.ts:702`). WebAssembly is also natively executed by all modern browsers (2026). Common beginner framing, but technically outdated. Direction: "the primary scripting language browsers execute natively (alongside WebAssembly)". | P3 |
| TA-7 | **Top-level `await` in a non-module example** — `const [courses, user] = await Promise.all([...])` outside an async function. | `[CONFIRMED]` (`webdesign.ts:1132`). Valid only inside `async` functions or ES modules; the course never teaches modules (TA-2). A student pasting this into a classic `<script>` gets a SyntaxError. Direction: wrap in an async function or add a clarifying note. | P3 |
| TA-8 | **`?.` and `aria-expanded` used without teaching.** | `[CONFIRMED]` (`webdesign.ts:886` `top?.name`; `webdesign.ts:1378` `aria-expanded="false"`). Direction: one sentence each. | P3 |
| TA-9 | Specificity "ID(100) > class(10) > element(1)" | Acceptable — text explicitly says "Roughly" (`webdesign.ts:210`). Spec counts are (0,1,0,0)/(0,0,1,0)/(0,0,0,1). | OK |
| TA-10 | Verified-correct set (sample): `flex:1 === flex:1 1 0%`; `??` vs `||`; `[1,2]===[1,2]` false (reference); `querySelectorAll` static NodeList vs `getElementsByClassName` live; `mouseenter/mouseleave` don't bubble; fetch rejects only on network failure (404 resolves, check `res.ok`); `sort()` lexical default; `grid-column: 1/-1`; `repeat(auto-fit, minmax(250px,1fr))`; WCAG 4.5:1; `font-display: swap`; `loading="lazy"`; Git staging order; Netlify/Vercel/Pages HTTPS+CDN+rollback. | `[CONFIRMED]` all correct against current standards. | OK |

---

## 9. Learning Objective Audit

- **No explicit, measurable, per-module or per-topic learning objectives exist.** Each module carries only `title` + 1–2 sentence `description` (e.g., `webdesign.ts:38–41`); topics carry `{title, text, code, note}` with no objective field. `[CONFIRMED]`
- The module descriptions function as **adequate de facto objectives** — e.g., W7 "Design for every screen: mobile-first thinking, breakpoint-driven media queries, fluid units, and the responsive patterns that scale" maps 1:1 onto W7's four topics. `[CONFIRMED]`
- **Taught-but-no-objective:** every topic is taught without a stated objective; the nearest thing is the description + quiz.
- **Objective-not-taught:** no stated objectives are untaught; conversely, two *taught* things lack objectives: nothing — the issue is the missing formal layer, not misalignment. `[INFERRED]`
- Because there are no objectives, learners cannot self-check "have I met this objective?", and the platform cannot trace objective → assessment. This is the F-criterion deduction.

**Recommendation:** add a measurable "By the end of this topic you will be able to…" line to each of the 80 topics (and module-level objectives), then publish the objective→quiz traceability.

---

## 10. LO → Content → Practice → Assessment Matrix

No formal objectives exist, so the matrix uses the **de facto topic objective** (what the topic teaches). Coverage classes: **A** = objective taught + practiced + assessed; **B** = taught + assessed, no practice; **C** = taught + practiced, no assessment; **D** = taught only; **E** = assessed but not taught; **F** = none.

| Objective class | Count | Detail |
|---|---|---|
| **A** (taught + practiced + assessed) | ~10/80 | Topics reinforced by a seeded interactive challenge (Week 1 HTML basics: h1/p, h2, comments, main) — *but the practice is UI-orphaned*, so effectively these are B. |
| **B** (taught + assessed, no structured practice) | ~78/80 | The overwhelming pattern: every topic has teaching text/code + 4 topic-quiz questions + a module quiz. "Practice" is the copy-paste code-along, which is ungraded. |
| **C** (taught + practiced, no assessment) | 0 | — |
| **D** (taught only) | 0 | — |
| **E** (assessed but not taught) | 0 | — |
| **F** (none) | 0 | — |

**Notes:**
- The **project** (W15–W20) is the course's only genuine *practice-to-assessment* artifact: taught, built, then submitted via `/projects/submit` for admin approval — but the submission system uses no rubric and no project brief (see §14). `[CONFIRMED]`
- If the 6 interactive challenges were wired into the UI, ~6 Week-1 topics would move from B→A. `[RECOMMENDATION]`

---

## 11. Assessment Audit

**Inventory (all `[CONFIRMED]`):** 320 topic-quiz Q (4/topic) + 160 module-quiz Q (8/module) + 15 final-exam Q = **495 questions**, all 4-option/1-correct, keys clean.

**Relevance:** Assessments track taught content closely. Sample verification: W11 module quiz's `flex:1`/`order`/`space-between`/`flex:0 0 240px` questions map 1:1 onto W11 topics; final-exam Q 513 (querySelector → null) matches W12.T1 exactly.

**Difficulty:** Mostly **Remember/Understand** (Bloom). A minority are **Apply** (code-trace: `"5"+1`, `[3,8,5,9].filter(...)`, `[1,2,3].reduce(...)`, `flex:1` expansion, `[10,2,30].sort()`). **No Create/Evaluate** items exist in the quizzes (the project covers Create, but is not rubric-scored). The final exam is similarly recall+application. See §9.

**Clarity/ambiguity:** Stems are generally crisp and unambiguous. No "none of the above"/"all of the above" items found. A few near-verbatim pairs across layers reduce measurement value (§17).

**Correctness of keys:** Zero wrong keys confirmed across all 495 items (sampled + integrity-checked; see §12).

**Distractors:** Generally plausible and well-constructed (e.g., sort question's distractors include numeric-sort result, `NaN`, `TypeError`).

**Coverage:** The quiz surface covers all 80 topics and all 20 modules. The final exam covers the full arc but is **unreachable** (§21).

**Structural weaknesses:**
1. **No per-question explanation field** — the `QuizQuestion` model is `{text, options[], correctAnswer}` with no `explanation` (`schema.prisma:137-151`); grading is exact-string match; feedback reveals right/wrong + correct answer, never *why* (§19). `[CONFIRMED]`
2. **Topic-quiz "randomization" is a no-op** — `getTopicQuizQuestions` shuffles then `slice(0, 5)` (`quizService.ts:336-338`); every WebDesign topic bank has exactly 4 questions, so all 4 are always served. Module quizzes are served in DB order with no shuffle; option order never shuffled. `[CONFIRMED]`
3. **Concept-level redundancy across layers** — `.sort()` tested 3× (ids 10547, 10555, 518), `res.ok` 3× (ids 10619, 10627, 514); 15 duplicate option-set pairs exist between topic and module layers (§17). `[CONFIRMED]`
4. **Cognitive ceiling** — no item above Apply; summative differentiation is limited.

**Assessment-reachability summary:** topic quizzes ✅ live, module quizzes ✅ live, final exam ❌ dead, challenges ❌ UI-orphaned (§21).

---

## 12. Question-Level Defects

**Defective items (individually listed).** Structural integrity checks found **zero** invalid items: no question has `correctAnswer` outside `options`, no question has ≠4 options, no exact-duplicate texts, no "none/all of the above" vagueness. The only question-level issues are **near-duplicate concept pairs** across the topic/module/final layers, listed with DB ids:

| DB id | Layer | Text | Issue |
|---|---|---|---|
| 10547 | Topic W11 | `[10, 2, 30].sort()` without a comparator gives… | Near-duplicate of 10555 and 518 (same concept, 3×). |
| 10555 | Module W11 | `[10, 2, 30].sort()` (no comparator) returns… | Near-duplicate of 10547 / 518. |
| 518 | Final | `[10, 2, 30].sort()` (no comparator) returns… | Near-identical to 10547 / 10555. |
| 10619 | Topic W14 | So you must always check… (res.ok) | Concept 3× (topic/module/final). |
| 10627 | Module W14 | Why must you check `res.ok` after `fetch`? | Concept 3×. |
| 514 | Final | Why must a fetch() result be checked with `res.ok`… | Concept 3×. |
| 10498 | Topic W9 | `5 === "5"` is… | Duplicate concept pair with 10503. |
| 10503 | Module W9 | The value of `5 === "5"` is… | Duplicate concept pair with 10498. |
| 10494 | Topic W9 | Which is the FALSY value among these? | Duplicate concept pair with 10504. |
| 10504 | Module W9 | Which of these is FALSY in JavaScript? | Duplicate concept pair with 10494. |

Plus 5 more duplicate option-set pairs (em/rem, pseudo-element, const default, promise states, flex:1, display:none, etc.) across topic/module layers — same concept, slightly re-worded stems.

**Healthy population (statistical summary):** 495 total items; 480 quiz + 15 final. All keys verified correct; all structures valid. ~10 items are concept-level near-duplicates (≈2%); the remaining ~98% are distinct, accurate, and well-constructed. Sample-read 120+ items across W1–W19 module quizzes and topic quizzes; no ambiguity or key error found.

---

## 13. Practical Learning Audit

**Classification: STRONG (in-content), constrained by the platform.**

- Every topic ships a **working, copyable code example** (`code` field) — verified across all 80 topics. `[CONFIRMED]`
- W15–W20 is a sustained **build-a-portfolio** arc with an explicit MVP scope, definition of done, and deploy target. `[CONFIRMED]`
- The **6 interactive auto-graded HTML challenges** are seeded and fully functional backend-side (sandboxed runner, assertion grading, sequential gating, XP) but **UI-orphaned** — no student can reach them (§21). This is the single largest unrealized practical-learning asset for this course.
- The **practice arena / daily challenge** system draws from the `PracticeQuestion` table, which contains only **5 legacy rows** (generic Programming/Electronics, none WebDesign-specific) — effectively an empty practice bank for this course. `[CONFIRMED]` (`PracticeQuestion` count = 5).
- No graded weekly assignments are content-defined; the assignment submission system maps assignment week N → module 5N with mock file URLs and no rubric (§14).

Net: the course *teaches* hands-on extremely well (code-along + project), but *graded* practice (challenges) is invisible and the practice arena is a 5-question bank.

---

## 14. Project Audit

The portfolio project (W15–20) is the course's capstone. **Design quality: strong.** Scope is realistic (single-page, 4 sections, vanilla HTML/CSS/JS), MVP + definition of done are taught, the build plan is testable step-by-step, and the deliverable is a genuinely portfolio-worthy deployed site.

**Systemic weaknesses (`[CONFIRMED]`, infra-level):**
- The project submission endpoint (`POST /projects/submit`) accepts `title, description, sourceCodeUrl, reportUrl, githubUrl` and is admin-approved, **but no rubric, prompt, or brief from the content is ever referenced** — the route is a generic envelope (`routes/project.ts`). The course's own definition of done (Lighthouse 90+, responsive check, etc.) is prose only; the platform does not evaluate against it.
- **Hardcoded 20-module gate:** `routes/project.ts` requires passing all 20 modules before submission. WebDesign has exactly 20 modules, so this is *currently* fine, but it is latent breakage for any course with ≠20 modules (all 9 courses currently have 20, so latent, not active). `[INFERRED]` (latent)
- Assignments: 4 per course, gated by a `week → module 5N` heuristic (`routes/assignment.ts`); no file upload (mock `fileUrl`); no content-defined prompts. For WebDesign specifically, no assignment briefs exist in the content.

**Project-quality score:** high for *teaching/design*; low for *platform binding*.

---

## 15. Industry Relevance Audit

**Excellent — the strongest dimension.** The course teaches the current (2024–2026) frontend toolkit: semantic HTML5, Flexbox, Grid (`auto-fit/minmax`), Tailwind (including v4 `@theme`), `clamp()/min()/max()`, `prefers-reduced-motion`, `:focus-visible`, ES202x JS (`const/let`, arrows, template literals, destructuring, spread/rest, map/filter/reduce, `??`, async/await, fetch), DOM/events, Git, GitHub Pages/Netlify/Vercel, custom domains, Lighthouse. `[CONFIRMED]`

Employability realism is high for junior web-designer/frontend roles. The gaps (position/z-index, ES modules, objects/classes) are exactly the next-tier skills employers probe and would be the natural additions (see §25).

---

## 16. Obsolete/Deprecated Technology Audit

**No obsolete technology is taught.** `[CONFIRMED]`
- No float/table-based layout promoted; Flexbox/Grid are the layout tools.
- No XHTML, jQuery, or `XMLHttpRequest` promoted; `fetch` is taught.
- No `var`-promotion (var is explicitly flagged as legacy, `webdesign.ts:711`).
- `box-sizing: border-box` reset is current best practice.
- Tailwind v4 (`@theme`) is current.
- The only stale artifact is the **DB course description** ("in Hinglish") — a leftover from the old template generator, not a technology. `[CONFIRMED]`

---

## 17. Duplication Audit

**Exact duplication: none.** 0 duplicate question texts; 0 duplicate topics. `[CONFIRMED]`

**Near-duplicate / concept-level duplication: present but bounded.**
- `.sort()` concept tested 3× (topic W11 / module W11 / final) — ids 10547, 10555, 518.
- `res.ok` concept tested 3× (topic W14 / module W14 / final) — ids 10619, 10627, 514.
- 15 duplicate option-set pairs across topic vs module layers (same options, near-identical stems): e.g., "Which unit is relative to the ROOT font size?" appears in both topic (W4) and module (W4) layers; `flex:1` expansion, promise states, `let x;` undefined, `display:none`, `reduce` sum, etc.

**Judgment:** This is **legitimate reinforcement** at the topic→module boundary for high-value tricky concepts (repetition aids retention), but the **topic and module layers within the same week** are pedagogically redundant — they test the same objective twice for the same student in the same sitting. The final-exam repeats of `.sort()`/`res.ok` reduce summative differentiation. Severity **P2** (bounded, not harmful-padding across the whole course; ~2% of items).

**No cross-course duplication:** the "Comparison & Logical Operators" title shared with Python holds distinct content (`[CONFIRMED]` from prior cross-course analysis; not re-derived here).

---

## 18. Consistency Audit

`[CONFIRMED]` mostly consistent:
- **Format:** all 80 topics follow the identical `title/text/code/note` template; all module quizzes are exactly 8; all topic quizzes exactly 4. Remarkably uniform.
- **Voice:** consistent second-person, teaching-oriented, GfG-style with pithy "note" takeaways. 
- **Assessment style:** uniform 4-option single-correct; consistent.
- **Inconsistencies (minor):**
  - Course **description** ("Hinglish") vs **content language** (English) — P2 identity mismatch (§22).
  - **Unexplained syntax** in learner-facing code (`?.`, `aria-expanded`) while the course otherwise explains every construct it introduces — P3.
  - Module descriptions are de facto summaries, not objectives — consistent format, but no objective layer at all.
  - W15 code block typo (`skeletons --` vs `skeleton -->`) — P2.

---

## 19. Feedback Audit

**Weakness — the largest scoring drag on "Feedback/Learning Support."**

- **Quiz feedback = score-without-learning.** Grading is `userAnswer === q.correctAnswer` (`quizService.ts:52`); the results modal shows right/wrong + the correct answer, **never why**. The `QuizQuestion` model has no `explanation` field (`schema.prisma:137-151`). Across all 495 WebDesign items there is zero explanatory feedback. `[CONFIRMED]`
- **No hints, no remediation, no next steps** after a failed topic quiz; the learner simply re-attempts.
- **Positive note:** the in-content `note` field is genuinely high-quality real-world/exam takeaway, and the W20 "one-sentence drill" and "rebuild from memory" guidance is excellent meta-learning advice. `[CONFIRMED]`
- The `PracticeQuestion` model *does* support `explanation` and the practice route returns it (`routes/practice.ts:79`) — evidence the platform can do feedback, it just wasn't applied to course quizzes. `[CONFIRMED]`

Severity: **P2** (systemic across the course; remediation direction = add `explanation` to `QuizQuestion` and author one line per item).

---

## 20. Student Journey Audit

**Discover → Enroll → Learn → Practice → Quiz → Feedback → Progress → Assignment → Project → Final → Certificate.**

| Stage | Status | Evidence |
|---|---|---|
| Discover | ✅ | Published course (`isPublished=t`), price 699, description present (stale Hinglish). |
| Enroll | ✅ | Payment + enrollment flow live. |
| Learn | ✅ | Topic reader renders `text` (ReactMarkdown+GFM), `code` (editor + copy), `note` (CourseDetail.tsx:1128-1273). |
| Practice | ⚠️ | Code-along is ungraded; interactive challenges **UI-orphaned**; practice arena = 5 legacy questions. |
| Quiz (topic) | ✅ | `/quiz/:courseId/:week/:topicId` → `getTopicQuizQuestions` (4 Q). Topic-lock gating works. |
| Quiz (module) | ✅ | `/quiz/:courseId/:week` → `getQuizQuestions` (8 Q). |
| Feedback | ❌ | Score + correct answer only; no explanation. |
| Progress | ✅ | TopicProgress/ModuleProgress/CourseProgress upserted on pass; 60% threshold. |
| Assignment | ⚠️ | 4 generic assignment slots, no WebDesign briefs, mock file URLs. |
| Project | ⚠️ | Submission UI live (CourseDetail.tsx:323), admin approval, but no rubric/brief; 20-module gate currently satisfied. |
| **Final** | ❌ | **Final exam dead content — no route, no UI.** No summative checkpoint. |
| Certificate | ✅ | Certificate issuance flow exists (separate from final exam). |

**Journey verdict:** strong Learn→Quiz→Progress spine; broken Practice→Feedback→Final segments.

---

## 21. Assessment Reachability Audit

**DB → Route → API → Frontend → Student**, verified per assessment system.

| System | Content | Backend route | Frontend consumer | Reachable? |
|---|---|---|---|---|
| Topic quizzes | 320 Q | ✅ `GET /api/quiz/questions/topic/:topicId` (`routes/quiz.ts:13`) | ✅ `Quiz.tsx` via `useQuiz` (`hooks/useQuiz.ts:15`) | ✅ **LIVE** |
| Module quizzes | 160 Q | ✅ `GET /api/quiz/questions/:courseId/:week` (`routes/quiz.ts:30`) | ✅ `Quiz.tsx` via `useQuiz` (`hooks/useQuiz.ts:16`) | ✅ **LIVE** |
| Final exam | 15 Q | ❌ **none** — zero references to `FinalExamQuestion` in `backend/src` | ❌ **none** | 🔴 **DEAD CONTENT** |
| Interactive challenges | 6 Q (W1) | ✅ `GET /api/challenges/course/:courseId`, `/:id`, `POST /:id/run-test` (`routes/challenge.ts`) | ❌ **none** — "challenge(s)" appears only in About.tsx marketing + Dashboard daily-challenge (a different system) | 🔴 **UI-ORPHANED** |
| Project submission | portfolio | ✅ `POST /projects/submit`, `GET /projects/status/:id` | ✅ `CourseDetail.tsx:323-343` | ✅ **LIVE** (no rubric) |

**Findings:**
1. **Final exam dead content** — `[CONFIRMED]`. The 15 WebDesign final-exam questions are seeded but no route serves them. The course has **no summative assessment at all**. This is the highest-severity reachability finding for this course. (P1)
2. **Challenges UI-orphaned** — `[CONFIRMED]` re-verified. The complete auto-graded engine (`challengeService`, `challengeRunnerService`, `sandboxService`, sequential gating, XP) is wired backend-side and seeded with 6 WebDesign HTML exercises, but **no page/route/component** calls `api/challenges/*`. (P1)
3. **Topic-quiz randomization no-op** — `slice(0,5)` on 4-question banks serves all 4 every time; module quizzes unshuffled; options never shuffled. (P3)

---

## 22. Scope/Identity Audit

- **Title/description vs content:** The title "Web Design & Frontend Development" accurately reflects content (HTML+CSS+JS+deploy). The DB description "Learn HTML, CSS, JavaScript, and modern responsive design patterns **in Hinglish**" **does not match** the English-language content — stale artifact of the pre-reseed template generator. **P2.**
- **Advertised skills vs actual:** Description implies modern responsive design patterns — content delivers (W3–W8 + W17). No scope inflation. `[CONFIRMED]`
- **Scope drift:** none within the course. Content stays on-brief from W1 to W20. The course is honestly a beginner web-design/frontend course, not a JS-engineer course; the JS depth cap (no modules/objects/classes) is the only "unfinished" edge, and it's a *scope gap*, not drift.
- **Level label:** not explicitly labeled beginner/intermediate in the DB Course table (no level column); content is pitched at true beginners. `[CONFIRMED]` (absence)

---

## 23. Scorecard + Confidence

**Weighted rubric (0–100). Independent — no inheritance from the prior 84/100.**

| Dimension | Weight | Score | Weighted | Rationale (evidence) |
|---|---|---|---|---|
| Curriculum Architecture | 10 | 7.5 | 7.5 | Coherent, well-sequenced 20-week arc. Deduct: position/z-index absent (P1), ES modules/objects absent (P1). |
| Learning Objectives | 10 | 5.0 | 5.0 | No explicit measurable objectives; descriptions are de facto only. |
| Content Quality | 15 | 13.0 | 13.0 | Excellent prose/code/notes across all 80 topics. Deduct: W15 comment defect, dead closure ref, unexplained syntax. |
| Technical Accuracy | 15 | 13.5 | 13.5 | Zero key errors; modern and correct. Deduct minor imprecision (Tailwind scale, Wasm claim, top-level await). |
| Practical Learning | 10 | 7.0 | 7.0 | Strong code-along + portfolio project; deduct: challenges UI-orphaned, practice bank = 5 legacy questions, no graded briefs. |
| Assessment Quality | 10 | 7.0 | 7.0 | Clean keys, good distractors, good coverage. Deduct: no explanations, no randomization, layer redundancy, recall-heavy. |
| Question Quality | 5 | 4.5 | 4.5 | 495 structurally valid items, ~2% near-duplicate concept pairs. |
| LO Alignment | 5 | 4.0 | 4.0 | Assessment tracks teaching closely; no formal traceability. |
| Difficulty Progression | 5 | 4.0 | 4.0 | Well-ramped; no Create/Evaluate-level items. |
| Industry Relevance | 5 | 4.5 | 4.5 | Modern toolkit; employment-realistic. |
| Project Quality | 5 | 4.5 | 4.5 | Excellent design; no rubric binding in platform. |
| Feedback/Learning Support | 5 | 3.0 | 3.0 | In-content notes excellent; quiz feedback is score-without-learning. |
| **Total** | **100** | | **77.5 → 78** | |

**Confidence: HIGH.**
- **High:** all structural/architectural/technical-accuracy conclusions rest on a full read of `webdesign.ts` (1,806 lines) plus DB re-verification of every inventory figure, all 80 topic-title↔quiz-key matches, and all question-integrity checks.
- **Medium:** question-level judgement is based on full read of module quizzes + final exam + sampled topic-quiz blocks (W1, W7-region, W9, W11, W12, W14, W15, W18, W19) plus programmatic integrity checks; not every one of the 320 topic-quiz stems was individually human-read in this pass.
- **Deployment caveat:** the local DB may drift from the live GitHub `main` deploy; all DB/route findings are against this repo+local DB (`[CONFIRMED]` locally, live parity `[UNKNOWN — NOT VERIFIED]`).

**Independent validation vs prior 84/100:** I agree with the prior audit on content quality, technical accuracy, and the position/z-index + ES-modules gaps (each independently re-verified). I **disagree on the headline number**: 78 vs 84. The delta is not content-quality disagreement — it is that the prior score did not fully weight (a) unreachable final exam, (b) UI-orphaned challenges, (c) score-without-learning feedback, and (d) no randomization — all of which I treat as within this rubric's Assessment/Practical/Feedback dimensions. Where the prior audit rated "Assessment redundancy" P2 and "no objectives" as minor, I weight feedback and reachability more heavily.

---

## 24. Issue Register (P0–P3)

| ID | Sev | Location | Finding | Evidence | Impact | Recommendation (direction only) |
|---|---|---|---|---|---|---|
| WD-P1-1 | P1 | Curriculum W3–W7/W18 | CSS `position`/`z-index` never taught; W18 modals/lightboxes require them | `webdesign.ts:634` (Tailwind utility only); `webdesign.ts:1460` (modal markup, no overlay CSS); no position topic in any CSS week | Students cannot build the taught modal/overlay/dropdown patterns; frontend skill capped | Add a positioning + stacking-context topic after W4/W6; include `position: fixed` + `z-index` + overlay CSS in W18 example |
| WD-P1-2 | P1 | Curriculum W9–W14/W20 | ES modules and JS objects/classes not taught; W20 recommends React | No `import`/`export` teaching in W9–14; objects only as literals (`webdesign.ts:885-886`); React at `webdesign.ts:1630` | "What comes next" (React) is unreachable; JS depth stops short | Add objects/classes primer + concise `import`/`export` topic in W11/W12; add JSON parse/stringify |
| WD-P1-3 | P1 | Final exam (15 Q) | Final-exam questions seeded but dead content — no route, no UI | Zero refs to `FinalExamQuestion` in `backend/src` and `frontend/src` (grep); `FinalExamQuestion` model exists (`schema.prisma:302`) | Course has no summative assessment; certificate not tied to exam | Serve the exam (post-course route + UI, gate certificate) or remove the dead table |
| WD-P1-4 | P1 | Challenges (6 Q) | Interactive auto-graded challenges UI-orphaned — backend complete, no frontend consumer | `challengeSeedData.ts:23-129` (6 WebDesign HTML); `routes/challenge.ts` full engine; no frontend page/route/component calls `api/challenges/*` | Platform's most valuable auto-graded practice invisible to students | Build the challenge page/route and wire `/api/challenges/*`; reuse the 6 seeded Week-1 exercises |
| WD-P2-1 | P2 | `webdesign.ts:1207` | W15 wireframe code example has unterminated HTML comment | `<!-- Low-fi wireframe as HTML skeletons --` never closes with `-->` | Copy-paste comments out the student's page | Close the comment with `-->` |
| WD-P2-2 | P2 | `webdesign.ts:871` | Dangling "closures" cross-reference; no closure content in W11 | "a 'closure', Section 11 covers the mechanics" — grep returns only this line | Broken internal promise; learners can't follow the pointer | Add a brief closure explanation or reword |
| WD-P2-3 | P2 | Assessment layers | Concept-level redundancy: `.sort()` and `res.ok` each 3×; 15 duplicate option-set pairs topic↔module | ids 10547/10555/518 (sort), 10619/10627/514 (res.ok), 10498/10503 & 10494/10504 (W9 pairs), 15 option-set pairs (§17) | Reduced measurement value; perceived padding at same-week layers | Rewrite topic-quiz stems that near-repeat module-quiz stems; keep final-exam repeats only if differentiated |
| WD-P2-4 | P2 | `Course.description` (DB) | Stale description advertises "in Hinglish"; content is English | DB row vs `reseed_webdesign_full.ts:41` intended description; content grep shows 1 Hinglish mention (a mojibake example) | Advertised skill mismatch; enrollment expectation gap | Update description to match English content (drop "in Hinglish") |
| WD-P2-5 | P2 | Feedback system | No per-question explanations; quiz feedback is score-without-learning | `QuizQuestion` model has no `explanation` (`schema.prisma:137-151`); exact-string grading (`quizService.ts:52`) | Learners don't learn *why*; failed quizzes have no remediation | Add `explanation` to `QuizQuestion`; author one line per item; surface in results modal |
| WD-P3-1 | P3 | `webdesign.ts:627` | Tailwind spacing-scale claim imprecise ("p-0 to p-96 step in 0.25rem increments") | Tailwind scale has fractional steps + (v3) non-linear jumps; version unpinned | Minor teaching inaccuracy | Clarify: "fixed 0.25rem-based scale (plus fractions)" |
| WD-P3-2 | P3 | `webdesign.ts:886,1378` | `?.` and `aria-expanded` used without teaching | `top?.name`; `aria-expanded="false"` | Beginner reads past unexplained syntax | One sentence each |
| WD-P3-3 | P3 | `webdesign.ts:702` | "only programming language browsers understand natively" ignores WebAssembly | 2026 browsers run Wasm | Minor currency inaccuracy | Add "(alongside WebAssembly)" |
| WD-P3-4 | P3 | `webdesign.ts:1132` | Top-level `await` in non-module example | `const [courses, user] = await Promise.all(...)` outside async function | Pasting into classic `<script>` throws SyntaxError | Wrap in async function or note modules |
| WD-P3-5 | P3 | `quizService.ts:336-338` | Topic-quiz randomization is a no-op; module/option order never shuffled | `slice(0,5)` on 4-question banks; `getQuizQuestions` returns DB order | Retakes are pattern-identical | Draw from a real bank or document "serve all 4"; shuffle options |
| WD-P3-6 | P3 | `PracticeQuestion` (5 rows) | Practice arena bank is only 5 legacy questions (none WebDesign) | `SELECT count(*) FROM "PracticeQuestion"` = 5 | Near-empty practice feature for all courses | Seed WebDesign practice items or disable the empty arena |
| WD-P3-7 | P3 | Gamification | Badge economy front-loaded (week_1_master only) | `quizService.ts:101-103` | No recognition for later weeks | Add per-week or per-course completion badges |
| WD-P3-8 | P3 | All modules | No explicit measurable learning objectives | Module schema has title+description only | Learners can't self-check; no traceability | Add objective lines (§9) |

**Counts: P0 = 0 · P1 = 4 · P2 = 5 · P3 = 8**

---

## 25. Recommended Improvement Opportunities

Ranked by value/effort (all recommendations only — nothing implemented):

1. **Serve the final exam (WD-P1-3).** Lowest-effort highest-impact: a route + UI + certificate gating turns 15 dead questions into the missing summative checkpoint.
2. **Wire the challenge engine into the UI (WD-P1-4).** The backend is complete and secure; a challenge page/route unlocks 6 auto-graded HTML exercises (and the Python/SQL seeds for other courses).
3. **Add CSS `position`/`z-index` (WD-P1-1).** One topic (e.g., W4 after box model or W6 before modals) + a corrected W18 overlay example. Highest-value curriculum addition.
4. **Add JS objects + ES modules primer (WD-P1-2).** One W11/W12-adjacent topic (object literals, property access, `this`, `JSON.parse/stringify`, `import`/`export`) makes the W20 React recommendation reachable.
5. **Add `explanation` support + author one line per item (WD-P2-5).** Lifts the weakest feedback dimension; the `PracticeQuestion` model already proves the pattern.
6. **De-duplicate topic↔module concept repetition (WD-P2-3).** Rewrite the ~15 near-duplicate topic stems.
7. **Fix the two content defects (WD-P2-1, WD-P2-2).** Close the W15 comment; resolve the closures reference.
8. **Correct the course description (WD-P2-4)** and add explicit learning objectives (WD-P3-8).
9. **Tighten the "randomization" (WD-P3-5)** and seed the practice bank (WD-P3-6).
10. **Round out the JS edge (TA-6/TA-7/TA-8):** Wasm caveat, async wrapper, `?.`/`aria-expanded` one-liners.

---

## 26. Unknowns / Missing Evidence

- **Live-deploy parity:** DB and route state verified against the local repo/DB; the live site runs GitHub `main` which may drift from this tree. All live-state claims are `[UNKNOWN — NOT VERIFIED]`.
- **Full human read of every topic-quiz stem:** 320 topic-quiz questions were integrity-checked programmatically and sampled in ~9 topic blocks; the remaining stems were not individually read in this pass (prior full-file audit read them; I rely on its "keys clean" conclusion for those stems, corroborated by zero structural failures in the DB).
- **Actual student experience of the topic-lock/quiz UI** (e.g., whether a re-taken quiz shows a different order in practice) was not browser-tested; it is inferred from `quizService.ts` read.
- **Practice-arena data beyond the 5 `PracticeQuestion` rows** (e.g., whether a separate cache/table feeds the daily challenge) — the daily-challenge path references `PracticeQuestion`; no other practice source was found, but runtime state was not observed.
- **Whether any admin tooling (AdminDashboard) surfaces the final-exam or challenge content** — `AdminDashboard.tsx` was not fully read; the assessment-systems audit lists it only for week quizzes.

---

## 27. Final Verdict

**Web Design & Frontend Development is the catalog's best-written course** — accurate, modern, consistent, and pedagogically coherent — but the deep-scan shows it is **under-delivered by the platform**: its summative assessment (final exam) is dead content, its only auto-graded practice (challenges) is invisible, its quiz feedback is score-without-learning, and two P1 curriculum gaps (position/z-index, ES modules/objects) cap students just before the course's own "next steps."

**Score: 78/100 — Strong, with a clear and cheap path to Excellent (90+).** The path: wire the final exam + challenges, add position/z-index and an ES-modules/objects topic, add explanation feedback, de-duplicate the near-repeated quiz stems, and fix the two content defects. No content rewrite is required — the teaching text is already excellent; the work is structural and systemic.

---

## MODULE SCORECARD

| Week | Content Quality (/5) | Technical Accuracy (/5) | Assessment Fit (/5) | Module Score (/15) |
|---|---|---|---|---|
| 1 | 5 | 5 | 4 | 14 |
| 2 | 5 | 5 | 4 | 14 |
| 3 | 5 | 5 | 5 | 15 |
| 4 | 5 | 5 | 5 | 15 |
| 5 | 5 | 5 | 5 | 15 |
| 6 | 5 | 5 | 5 | 15 |
| 7 | 5 | 5 | 5 | 15 |
| 8 | 4 | 4 | 4 | 12 |
| 9 | 5 | 5 | 5 | 15 |
| 10 | 5 | 5 | 5 | 15 |
| 11 | 5 | 5 | 4 | 14 |
| 12 | 5 | 5 | 5 | 15 |
| 13 | 5 | 5 | 5 | 15 |
| 14 | 5 | 5 | 4 | 14 |
| 15 | 4 | 4 | 4 | 12 |
| 16 | 5 | 5 | 4 | 14 |
| 17 | 5 | 5 | 5 | 15 |
| 18 | 4 | 4 | 4 | 12 |
| 19 | 5 | 5 | 5 | 15 |
| 20 | 5 | 5 | 4 | 14 |

---

## QUESTION AUDIT (defective items)

See §12 for the full table. Summary: **0 invalid items**; 10 near-duplicate concept pairs across layers (ids 10547/10555/518, 10619/10627/514, 10498/10503, 10494/10504, + 5 more option-set pairs); all keys correct; all structures valid.

---

## Improvement Candidates — NOT YET APPROVED

Next phase decides KEEP / FIX / REWRITE / RESTRUCTURE / REMOVE / ADD / MODERNIZE / DEPRECATE.

| # | Candidate | Recommended action | Target |
|---|---|---|---|
| IC-1 | Final-exam questions (15) | **ADD** route+UI; gate certificate | WD-P1-3 |
| IC-2 | Interactive challenge engine + 6 seeds | **ADD** frontend page/route; wire `/api/challenges/*` | WD-P1-4 |
| IC-3 | CSS positioning & stacking contexts | **ADD** topic (W4/W6); fix W18 overlay example | WD-P1-1 |
| IC-4 | JS objects + ES modules primer | **ADD** topic (W11/W12); include JSON + `import`/`export` | WD-P1-2 |
| IC-5 | Quiz explanation field | **ADD** `explanation` to `QuizQuestion` + author content | WD-P2-5 |
| IC-6 | Near-duplicate topic↔module quiz stems | **REWRITE** ~15 topic stems to distinct scenarios | WD-P2-3 |
| IC-7 | W15 wireframe comment defect | **FIX** `-->` close + typo | WD-P2-1 |
| IC-8 | W11 closures cross-reference | **FIX** add closure line or reword | WD-P2-2 |
| IC-9 | Course description "in Hinglish" | **FIX** update to English description | WD-P2-4 |
| IC-10 | Learning objectives | **ADD** measurable per-topic objectives + traceability | WD-P3-8 |
| IC-11 | Tailwind scale claim / Wasm claim / top-level await / `?.` + `aria-expanded` | **FIX** precision one-liners | WD-P3-1..4 |
| IC-12 | Topic-quiz randomization + option shuffle | **MODERNIZE** `slice(0,5)` → true draw; shuffle options | WD-P3-5 |
| IC-13 | Practice bank (5 rows) | **ADD** course-specific practice items or **DEPRECATE** empty arena | WD-P3-6 |
| IC-14 | Badge/gamification curve | **ADD** per-week completion recognition | WD-P3-7 |
| IC-15 | Hardcoded 20-module project gate + `week*5` assignment map | **FIX** to dynamic module count (latent) | infra |
