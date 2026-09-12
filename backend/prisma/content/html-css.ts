/**
 * HTML & CSS — Build Your First Websites — Task 5 starter curriculum.
 * 5 modules × 4 topics, per-topic quizzes in html-css_topic_quizzes.ts,
 * plus a 4-question chapter quiz per module.
 */
import type { Section } from './types';

export const SECTIONS: Section[] = [
  // ── W1 · HTML Foundations ────────────────────────────────────────────────
  {
    week: 1,
    title: 'HTML Foundations',
    description: 'What HTML is, how a page is structured, and the elements that give content its meaning.',
    topics: [
      {
        title: 'How the Web Works & What HTML Is',
        text: 'The browser requests a page from a server; the server sends back HTML — the markup that describes the page\'s content and structure. CSS styles it; JavaScript makes it interactive.\n\nHTML is made of tags in angle brackets: <p>This is a paragraph.</p>. Most elements have an opening tag, content, and a closing tag (with /). Some, like <img>, are self-closing.\n\nYou write HTML in any text editor and view it in a browser. Open a .html file by double-clicking it — no server needed. The browser interprets the markup; you never see the tags, only the result.',
        code: '<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8">\n    <title>My first page</title>\n  </head>\n  <body>\n    <h1>Hello world</h1>\n    <p>My first paragraph.</p>\n  </body>\n</html>',
        note: 'Remember the skeleton: <!DOCTYPE html>, <html>, <head> (meta info), <body> (visible content).',
      },
      {
        title: 'Headings, Paragraphs & Text Elements',
        text: 'Headings give a page its outline: <h1> is the main title, down to <h6> for the smallest. Use ONE <h1> per page and a logical hierarchy — it helps readers and search engines.\n\nParagraphs use <p>; bold is <strong> (meaning: important), italic is <em> (emphasis). <br> is a line break inside a paragraph; <hr> draws a horizontal rule between sections.\n\nStructure follows meaning: use the element that describes the content, not the one that looks right. Want big text? That\'s a heading or CSS, not a huge <p>.',
        code: '<h1>My Report</h1>\n<h2>Chapter One</h2>\n<p>This is a paragraph with\n  <strong>important</strong> and\n  <em>emphasized</em> text.\n</p>',
        note: 'One <h1>, then <h2> for sections, <h3> for sub-sections. The outline is your page\'s table of contents.',
      },
      {
        title: 'Links & Images',
        text: 'Links are the glue of the web: <a href="https://example.com">Visit</a>. The href is the destination. Relative links point within your site (/about.html); absolute links include the full URL.\n\nImages: <img src="photo.jpg" alt="A sunset over the hills">. The alt text describes the image for screen readers and when the image fails to load — always write it.\n\nOpen links in a new tab with target="_blank" (and rel="noopener" for safety). Link text should say where it goes — "View our pricing" beats "click here".',
        code: '<a href="/about.html">About us</a>\n<a href="https://example.com" target="_blank" rel="noopener">External site</a>\n<img src="images/sunset.jpg" alt="Sunset over the hills" width="400">',
        note: 'Alt text is not optional — it is how blind users and search engines experience your images.',
      },
      {
        title: 'Lists: Ordered, Unordered & Nested',
        text: 'Lists structure collections: <ul> (unordered, bullets) for items without order, <ol> (ordered, numbers) for sequences like steps. Each item is an <li>.\n\nNest lists by placing a full list inside an <li> — the classic way to build menus and hierarchies (chapters → lessons).\n\nDefinition lists (<dl> with <dt> term + <dd> definition) are for glossaries. Choose the right list type: the browser renders bullets vs numbers, but the semantics matter for assistive tech.',
        code: '<h2>Steps to deploy</h2>\n<ol>\n  <li>Write the code</li>\n  <li>Test locally</li>\n  <li>Push to production</li>\n</ol>\n\n<h2>Stack</h2>\n<ul>\n  <li>Frontend\n    <ul>\n      <li>React</li>\n      <li>Tailwind</li>\n    </ul>\n  </li>\n</ul>',
        note: 'Lists are for structure, not just bullets. Screen readers announce list semantics, so choose <ol> vs <ul> by meaning.',
      },
    ],
    quizzes: [
      { text: 'Which tag holds the visible content of a page?', options: ['<head>', '<body>', '<title>', '<meta>'], correctAnswer: '<body>' },
      { text: 'A page should have how many <h1> tags?', options: ['many', 'one', 'none', 'six'], correctAnswer: 'one' },
      { text: 'The img attribute that describes the image is…', options: ['src', 'alt', 'href', 'title'], correctAnswer: 'alt' },
      { text: 'A numbered sequence of steps should use…', options: ['<ul>', '<ol>', '<p>', '<div>'], correctAnswer: '<ol>' },
    ],
  },

  // ── W2 · CSS Fundamentals ────────────────────────────────────────────────
  {
    week: 2,
    title: 'CSS Fundamentals',
    description: 'Selectors, colors, typography and the box model — the language of styling.',
    topics: [
      {
        title: 'CSS Selectors & How Styles Apply',
        text: 'CSS targets elements and styles them. A rule has a selector and a declaration block: p { color: blue; }. Selectors: element (p), class (.card), id (#header), and combinations (.card h2 = an h2 inside .card).\n\nClass is the workhorse — reusable, applies to many elements. An id is unique — one per page. Specificity decides which rule wins when they conflict: id > class > element.\n\nLink CSS with <link rel="stylesheet" href="style.css"> in the <head>. Three ways to add CSS: external file (best), <style> in the page (ok for small), inline style attribute (avoid).',
        code: '/* style.css */\nbody { font-family: Arial, sans-serif; }\n.card { border: 1px solid #ddd; padding: 16px; }\n.card h2 { color: #2563eb; }\n#header { background: #f8fafc; }',
        note: 'Class for reuse, id for unique, element for defaults. Specificity: id > class > element.',
      },
      {
        title: 'Colors, Backgrounds & Typography',
        text: 'Colors: hex (#2563eb), rgb (rgb(37, 99, 235)), or named (tomato). Use a consistent palette — 2-3 colors — and ensure text/background contrast for readability.\n\nBackgrounds: background-color for solid, background-image for photos, with background-size: cover to fill nicely.\n\nTypography: font-family with fallbacks (font-family: Georgia, serif;), font-size in px or rem, font-weight for bold (400 normal, 700 bold), line-height (1.5 is comfortable), text-align for alignment. Limit fonts to 2 families per site.',
        code: 'body {\n  color: #1e293b;\n  background-color: #f8fafc;\n  font-family: "Segoe UI", Arial, sans-serif;\n  line-height: 1.6;\n}\n.hero { background-color: #2563eb; color: white; }',
        note: 'Contrast is an accessibility requirement, not a style choice. Dark text on light background is the safest pairing.',
      },
      {
        title: 'The Box Model: Margin, Border, Padding & Content',
        text: 'Every element is a box: content in the middle, padding (space between content and border), border (the edge), and margin (space outside the border, pushing away neighbors).\n\nBorder-box vs content-box: with box-sizing: border-box (the modern default you should set), width includes padding and border — sizes behave predictably.\n\nShorthand: margin: 10px 20px sets top/bottom 10, left/right 20; padding: 10px sets all four. Spacing guidance: use margin for space BETWEEN elements, padding for space INSIDE an element.',
        code: '* { box-sizing: border-box; }\n.card {\n  width: 300px;\n  padding: 16px;          /* inside */\n  border: 1px solid #ddd; /* edge */\n  margin: 20px auto;      /* outside, centered */\n}',
        note: 'margin = outside space, padding = inside space. Both matter; confusing them is the #1 beginner layout bug.',
      },
      {
        title: 'Display: Block, Inline & Inline-Block',
        text: 'Every element has a display type. Block elements (div, p, h1) start on a new line and take full width — they stack. Inline elements (span, a, strong) sit within text — no line break, width/height ignored. Inline-block combines: inline flow but block sizing.\n\nThe display property changes this: display: block; inline; inline-block; or none (removes from layout). Flexbox and Grid (Week 4) are also display values.\n\nKnowing the default display of an element explains half of layout surprises: why a <div> spans the page, why a <span> won\'t take margin-top, why images and buttons behave like inline-block.',
        code: '<style>\n  .block { display: block; }\n  .inline { display: inline; }\n  .inline-block { display: inline-block; width: 120px; }\n</style>',
        note: 'A div stacks; a span flows inline. When layout misbehaves, check the display type first.',
      },
    ],
    quizzes: [
      { text: 'Which selector has the highest specificity?', options: ['p', '.card', '#header', 'h2'], correctAnswer: '#header' },
      { text: 'box-sizing: border-box makes width include…', options: ['only content', 'padding and border too', 'margin too', 'nothing'], correctAnswer: 'padding and border too' },
      { text: 'Space BETWEEN elements is best created with…', options: ['padding', 'margin', 'border', 'position'], correctAnswer: 'margin' },
      { text: 'A <span> is by default…', options: ['block', 'inline', 'inline-block', 'flex'], correctAnswer: 'inline' },
    ],
  },

  // ── W3 · Layout & Responsive Design ──────────────────────────────────────
  {
    week: 3,
    title: 'Layout & Responsive Design',
    description: 'Flexbox, Grid and media queries — building layouts that work on every screen.',
    topics: [
      {
        title: 'Flexbox — One-Dimensional Layouts',
        text: 'Flexbox lays out items in a row or column with powerful alignment. Set display: flex on a container; its direct children become flex items.\n\nMain controls: flex-direction (row or column), justify-content (main-axis: center, space-between, space-around), align-items (cross-axis: center, stretch), and gap for space between items.\n\nFlex items can grow: flex: 1 makes items share space equally. Flexbox is perfect for nav bars, cards in a row, and centering content.',
        code: '.toolbar {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 12px;\n}\n.cards { display: flex; gap: 16px; }\n.cards > .card { flex: 1; }',
        note: 'For a row: justify-content for horizontal, align-items for vertical. That one sentence answers most flexbox questions.',
      },
      {
        title: 'CSS Grid — Two-Dimensional Layouts',
        text: 'Grid controls rows AND columns at once. display: grid with grid-template-columns defines the column track sizes — grid-template-columns: repeat(3, 1fr) makes three equal columns.\n\nPlace items with grid-column and grid-row (or grid-area), or let them auto-flow. gap works in both axes. 1fr is a fraction — free space distributed equally.\n\nGrid is for page-level layouts (header/sidebar/main/footer) and galleries; Flexbox is for aligning a line of items. When you need both axes, reach for Grid.',
        code: '.layout {\n  display: grid;\n  grid-template-columns: 240px 1fr;  /* sidebar + main */\n  grid-template-rows: 64px 1fr 48px; /* header, content, footer */\n  min-height: 100vh;\n}\n.gallery { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }',
        note: 'Flexbox: one row/column of items. Grid: a whole page or gallery on both axes. Choose by the shape you need.',
      },
      {
        title: 'Responsive Design & Media Queries',
        text: 'Responsive design = one site that adapts to every screen. Start with a mobile-first approach: style the phone layout, then enhance for larger screens.\n\nMedia queries apply styles conditionally: @media (min-width: 768px) { ... } runs when the viewport is at least 768px. Common breakpoints: 640, 768, 1024, 1280.\n\nCombine with fluid units: max-width: 100% on images, width in % or fr instead of fixed px, and the viewport meta tag so phones don\'t zoom out your layout.',
        code: '/* Mobile first: single column */\n.cards { display: grid; grid-template-columns: 1fr; gap: 12px; }\n\n/* Tablet+ */\n@media (min-width: 768px) {\n  .cards { grid-template-columns: repeat(2, 1fr); }\n}\n@media (min-width: 1024px) {\n  .cards { grid-template-columns: repeat(4, 1fr); }\n}',
        note: 'Design for the small screen first, then scale up with min-width queries. Mobile-first keeps CSS simpler.',
      },
      {
        title: 'Navigation & Modern Layout Patterns',
        text: 'The classic site skeleton: header with a nav bar, main content, footer. Build the nav with flexbox (logo left, links right, gap between) and make links wrap nicely on mobile.\n\nModern patterns: sticky headers (position: sticky; top: 0), hero sections (big heading + button, centered), card grids, and two-column "feature" sections that stack on mobile.\n\nUse semantic tags — <header>, <nav>, <main>, <section>, <footer> — so both browsers and screen readers understand the skeleton.',
        code: '<header class="site-header">\n  <nav class="navbar">\n    <a href="/" class="logo">MySite</a>\n    <ul class="nav-links">\n      <li><a href="#features">Features</a></li>\n      <li><a href="#pricing">Pricing</a></li>\n      <li><a href="#contact">Contact</a></li>\n    </ul>\n  </nav>\n</header>\n\n.navbar { display: flex; justify-content: space-between; align-items: center; }',
        note: 'Semantic tags (<nav>, <main>, <footer>) are free accessibility and better SEO. Use them instead of naked <div>s.',
      },
    ],
    quizzes: [
      { text: 'display: flex is for…', options: ['two-dimensional grid layouts', 'one-dimensional row/column layouts', 'print layouts', 'image editing'], correctAnswer: 'one-dimensional row/column layouts' },
      { text: 'In a flex row, justify-content controls…', options: ['the vertical axis', 'the horizontal (main) axis', 'only the gap', 'nothing'], correctAnswer: 'the horizontal (main) axis' },
      { text: 'grid-template-columns: repeat(3, 1fr) makes…', options: ['three equal columns', 'three rows', 'one column', 'a sidebar'], correctAnswer: 'three equal columns' },
      { text: 'Mobile-first CSS means…', options: ['styling phones last', 'styling the small-screen layout first, then scaling up', 'no media queries', 'desktop first'], correctAnswer: 'styling the small-screen layout first, then scaling up' },
    ],
  },

  // ── W4 · Forms & Accessibility ───────────────────────────────────────────
  {
    week: 4,
    title: 'Forms & Accessibility',
    description: 'Building usable forms and making pages work for everyone.',
    topics: [
      {
        title: 'Forms: Inputs, Labels & Buttons',
        text: 'A form collects user input. Every input needs a <label> linked by for/id — click the label focuses the field, and screen readers announce it.\n\nInput types: text, email, password, number, date, tel, url, checkbox, radio, and select/textarea for multi-line text. The type activates built-in mobile keyboards and browser validation.\n\nSubmit with <button type="submit">. The name attribute on each input is what the server receives: <input name="email"> sends email=value.',
        code: '<form action="/signup" method="post">\n  <label for="name">Full name</label>\n  <input id="name" name="name" type="text" required>\n\n  <label for="email">Email</label>\n  <input id="email" name="email" type="email" required>\n\n  <button type="submit">Sign up</button>\n</form>',
        note: 'Every input gets a label (for/id pair), a sensible type, and a name. Those three rules make forms usable and functional.',
      },
      {
        title: 'Form Validation & Better UX',
        text: 'HTML gives you validation for free: required makes a field mandatory, type="email" checks format, min/max bound numbers, minlength/maxlength bound text, pattern enforces a regex.\n\nClient validation is for UX; the server must ALWAYS validate again — anyone can disable it.\n\nBetter forms: placeholder only as a hint (not a replacement for labels), inline error messages, autocomplete attributes (autocomplete="email") for autofill, and focus states so users know where they are.',
        code: '<input name="age" type="number" min="18" max="100" required>\n<input name="phone" type="tel" pattern="[0-9]{10}" title="10-digit number">\n<input name="password" type="password" minlength="8" required>',
        note: 'required + right input type = free validation. But validation in the browser is convenience, never security.',
      },
      {
        title: 'Semantic HTML & Accessibility (a11y)',
        text: 'Semantic HTML means using elements for their meaning: <nav> for navigation, <main> for the main content, <article> for a self-contained piece, <aside> for related content, <footer> for the page footer.\n\nAccessibility basics: alt text on images, labels on inputs, a logical heading outline, enough color contrast, and keyboard support — every interactive element must be reachable and operable with the Tab key.\n\nTest with a screen reader (NVDA/VoiceOver) and the keyboard only. If you can navigate a page without a mouse, it works for many more people.',
        code: '<main>\n  <article>\n    <h1>How to make coffee</h1>\n    <p>…</p>\n  </article>\n  <aside>Related reading…</aside>\n</main>',
        note: 'Accessibility is not a feature; it is the default bar. Semantic HTML + labels + alt + keyboard support covers most of it.',
      },
      {
        title: 'CSS Beyond Basics: Pseudo-classes, Transitions & Transform',
        text: 'Pseudo-classes style states: :hover, :focus, :active, :visited — the lifeblood of interactive-feeling buttons. Pseudo-elements create content: ::before/::after.\n\nTransitions animate changes: transition: background-color 0.2s ease makes a hover color fade instead of snap. Keep them short (0.15–0.3s) and purposeful.\n\nTransform moves, scales and rotates without breaking layout: transform: translateY(-4px) lifts a button on hover; rotate() spins; scale() grows.',
        code: '.btn {\n  background: #2563eb; color: white;\n  padding: 10px 18px; border: none; border-radius: 6px;\n  transition: background-color 0.2s ease, transform 0.15s ease;\n}\n.btn:hover { background: #1d4ed8; transform: translateY(-2px); }\n.btn:focus-visible { outline: 2px solid #2563eb; outline-offset: 2px; }',
        note: 'hover is for the mouse; :focus-visible is for keyboard users. Style both — it costs one extra selector.',
      },
    ],
    quizzes: [
      { text: 'A label is linked to its input by…', options: ['matching name', 'the for/id pair', 'the class', 'position'], correctAnswer: 'the for/id pair' },
      { text: 'What the server receives is determined by the input\'s…', options: ['id', 'name', 'class', 'type'], correctAnswer: 'name' },
      { text: 'Client-side validation is for…', options: ['security', 'user experience — the server must validate again', 'speed', 'styling'], correctAnswer: 'user experience — the server must validate again' },
      { text: 'The state style for keyboard users is…', options: [':hover', ':focus-visible', ':active', ':link'], correctAnswer: ':focus-visible' },
    ],
  },

  // ── W5 · The Project ─────────────────────────────────────────────────────
  {
    week: 5,
    title: 'The Project',
    description: 'Building and deploying a complete, responsive landing page — the capstone of this course.',
    topics: [
      {
        title: 'Project Setup: Content First, Structure Second',
        text: 'Before writing a line of code, write the content: the page\'s message, headline, subheading, features (3-6), a pricing table, testimonials and a contact section.\n\nThen draft the HTML skeleton with semantic structure: header/nav, hero, features, pricing, testimonial, contact/footer. Add the real content into the structure — no styling yet.\n\nWhy this order: structure with real content makes layout design concrete. Styling an empty skeleton leads to rebuilding it once the text arrives.',
        code: '<header>…nav…</header>\n<main>\n  <section class="hero">\n    <h1>Track your habits in minutes</h1>\n    <p>A simple app to build routines that stick.</p>\n    <a class="btn" href="#signup">Start free</a>\n  </section>\n  <section class="features">…3 cards…</section>\n  <section class="pricing">…3 plans…</section>\n</main>\n<footer>…</footer>',
        note: 'Content → semantic HTML → CSS. Each step has a reviewable result; skipping the first two is how pages collapse later.',
      },
      {
        title: 'Styling the Hero, Cards & Sections',
        text: 'Style the hero: a large centered headline, a supporting subheading, and a clear call-to-action button. Use a background color or image with good contrast.\n\nCards: consistent width, subtle border/shadow, generous padding, rounded corners (border-radius), and a gap. A hover lift (transform: translateY) makes cards feel interactive.\n\nSections need breathing room: generous padding (padding: 64px 16px), a max-width container (max-width: 1100px; margin: 0 auto) so content doesn\'t stretch on huge screens.',
        code: '.container { max-width: 1100px; margin: 0 auto; padding: 0 16px; }\n.hero { padding: 96px 16px; text-align: center; }\n.hero h1 { font-size: clamp(2rem, 5vw, 3.5rem); }\n.card {\n  background: white; border: 1px solid #e2e8f0;\n  border-radius: 12px; padding: 24px;\n  box-shadow: 0 2px 8px rgba(0,0,0,0.06);\n  transition: transform 0.15s ease;\n}\n.card:hover { transform: translateY(-4px); }',
        note: 'One container width, consistent card rhythm, and section padding are what make a page feel designed rather than stacked.',
      },
      {
        title: 'Making It Responsive',
        text: 'Test at phone, tablet and desktop widths. The grid collapses to one column on mobile, then 2, then 3-4 as the screen grows — via min-width media queries.\n\nFix the classic issues: images overflowing (img { max-width: 100%; }), text too large/small on mobile, nav links wrapping awkwardly, and touch targets too small (buttons at least 44px tall).\n\nUse browser DevTools device mode (F12 → device toggle) to simulate phones and tablets without leaving the browser.',
        code: 'img, video { max-width: 100%; height: auto; }\n.features { display: grid; grid-template-columns: 1fr; gap: 16px; }\n@media (min-width: 640px) { .features { grid-template-columns: repeat(2, 1fr); } }\n@media (min-width: 1024px) { .features { grid-template-columns: repeat(3, 1fr); } }\n.nav-links { display: flex; flex-wrap: wrap; gap: 12px; }',
        note: 'Test each breakpoint on the real content — a responsive site is tested, not just coded. DevTools device mode is your lab.',
      },
      {
        title: 'Publishing & Review Checklist',
        text: 'Publishing options: GitHub Pages (free, static), Netlify, Vercel, or any web host — upload the folder and the site is live.\n\nBefore publishing, run the checklist: (1) one <h1>, logical heading outline; (2) every image has alt; (3) every input has a label; (4) keyboard navigation works; (5) contrast passes; (6) responsive at phone/tablet/desktop; (7) no horizontal scroll; (8) page title and meta description set; (9) all links work; (10) spell-checked.\n\nShip, then iterate. A live imperfect site teaches more than a perfect one that never deploys.',
        code: '<title>HabitTrack — Build routines that stick</title>\n<meta name="description" content="A simple app to track habits and build routines.">\n\n<!-- accessibility spot-checks -->\n<button type="button" aria-label="Close menu">✕</button>',
        note: 'Ship and iterate. The checklist is the gate — pass it and publish; perfectionism is the enemy of shipping.',
      },
    ],
    quizzes: [
      { text: 'The first step of the project is…', options: ['writing CSS', 'writing the content and HTML skeleton', 'choosing a domain', 'adding animations'], correctAnswer: 'writing the content and HTML skeleton' },
      { text: 'A max-width container prevents…', options: ['content stretching across huge screens', 'images loading', 'responsive design', 'flexbox working'], correctAnswer: 'content stretching across huge screens' },
      { text: 'The universal image overflow fix is…', options: ['img { max-width: 100%; }', 'img { width: 500px; }', 'display: none', 'position: absolute'], correctAnswer: 'img { max-width: 100%; }' },
      { text: 'The right order is…', options: ['publish first, review later', 'review checklist, then ship', 'never ship', 'style before content'], correctAnswer: 'review checklist, then ship' },
    ],
  },
];
