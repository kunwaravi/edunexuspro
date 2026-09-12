/**
 * HTML & CSS — per-topic quizzes. Keyed by the EXACT topic titles in
 * html-css.ts (topic-lock flow). 4 questions per topic, 4 options, 1 correct.
 * Distinct from the chapter-quiz texts in html-css.ts.
 */
import type { TopicQuizMap } from './types';

export const TOPIC_QUIZZES: TopicQuizMap = {
  // ── W1 ───────────────────────────────────────────────────────────────────
  'How the Web Works & What HTML Is': [
    { text: 'The browser displays pages described in…', options: ['HTML markup', 'machine code', 'SQL', 'PDF'], correctAnswer: 'HTML markup' },
    { text: 'Which tag pair wraps the whole document?', options: ['<body></body>', '<html></html>', '<head></head>', '<div></div>'], correctAnswer: '<html></html>' },
    { text: 'An example of a self-closing tag is…', options: ['<p>', '<img>', '<a>', '<h1>'], correctAnswer: '<img>' },
    { text: 'To view a .html file you…', options: ['compile it first', 'open it in a browser', 'install Node.js', 'upload it'], correctAnswer: 'open it in a browser' },
  ],
  'Headings, Paragraphs & Text Elements': [
    { text: 'The largest heading is…', options: ['<h6>', '<h1>', '<heading>', '<title>'], correctAnswer: '<h1>' },
    { text: '<strong> carries the meaning…', options: ['bold for decoration', 'important content', 'italic', 'a link'], correctAnswer: 'important content' },
    { text: 'A line break inside a paragraph is…', options: ['<br>', '<hr>', '<p>', '<div>'], correctAnswer: '<br>' },
    { text: 'A horizontal rule between sections is…', options: ['<br>', '<hr>', '<li>', '<em>'], correctAnswer: '<hr>' },
  ],
  'Links & Images': [
    { text: 'The link destination is set by…', options: ['href', 'src', 'alt', 'name'], correctAnswer: 'href' },
    { text: 'A relative link points to…', options: ['another website', 'a page within your own site', 'a search engine', 'nothing'], correctAnswer: 'a page within your own site' },
    { text: 'The attribute that describes an image for screen readers is…', options: ['src', 'alt', 'title', 'href'], correctAnswer: 'alt' },
    { text: 'Link text should…', options: ['say "click here"', 'describe where it goes', 'be a URL', 'be uppercase'], correctAnswer: 'describe where it goes' },
  ],
  'Lists: Ordered, Unordered & Nested': [
    { text: 'A shopping list (no order) uses…', options: ['<ol>', '<ul>', '<li> only', '<p>'], correctAnswer: '<ul>' },
    { text: 'A recipe\'s numbered steps use…', options: ['<ol>', '<ul>', '<dl>', '<div>'], correctAnswer: '<ol>' },
    { text: 'To nest a list, you place it…', options: ['inside an <li>', 'outside the parent list', 'in the <head>', 'in a <p>'], correctAnswer: 'inside an <li>' },
    { text: 'A glossary pairs terms and definitions with…', options: ['<dl>/<dt>/<dd>', '<ul>/<li>', '<table>', '<nav>'], correctAnswer: '<dl>/<dt>/<dd>' },
  ],

  // ── W2 ───────────────────────────────────────────────────────────────────
  'CSS Selectors & How Styles Apply': [
    { text: 'A class selector is written…', options: ['#card', '.card', 'card', '<card>'], correctAnswer: '.card' },
    { text: 'The selector .card h2 targets…', options: ['any h2 anywhere', 'an h2 inside .card', 'a card inside h2', 'everything'], correctAnswer: 'an h2 inside .card' },
    { text: 'The specificity order (highest first) is…', options: ['id > class > element', 'element > class > id', 'class > id > element', 'all equal'], correctAnswer: 'id > class > element' },
    { text: 'The best way to add CSS site-wide is…', options: ['inline attributes', 'an external stylesheet via <link>', 'a <style> tag per page', 'JavaScript'], correctAnswer: 'an external stylesheet via <link>' },
  ],
  'Colors, Backgrounds & Typography': [
    { text: 'An example of a hex color is…', options: ['#2563eb', 'blue-500', '255,0,0,1', 'rgb-blue'], correctAnswer: '#2563eb' },
    { text: 'Contrast matters because…', options: ['it is trendy', 'text must be readable by everyone, including low-vision users', 'it makes files small', 'it is required by law for all sites'], correctAnswer: 'text must be readable by everyone, including low-vision users' },
    { text: 'A comfortable body line-height is…', options: ['0.5', '1.5', '3', '6'], correctAnswer: '1.5' },
    { text: 'A healthy font budget per site is…', options: ['ten families', 'two families max', 'one size only', 'the default only'], correctAnswer: 'two families max' },
  ],
  'The Box Model: Margin, Border, Padding & Content': [
    { text: 'Padding is…', options: ['space outside the border', 'space between content and the border', 'the border itself', 'the element width'], correctAnswer: 'space between content and the border' },
    { text: 'Margin is…', options: ['space inside the element', 'space outside the border, pushing away neighbors', 'the background', 'the content'], correctAnswer: 'space outside the border, pushing away neighbors' },
    { text: 'With box-sizing: border-box, width includes…', options: ['content only', 'content, padding and border', 'content, padding, border and margin', 'margin only'], correctAnswer: 'content, padding and border' },
    { text: 'margin: 10px 20px means…', options: ['top/bottom 10, left/right 20', 'all four 10', 'top/right 10, bottom/left 20', 'only top 10'], correctAnswer: 'top/bottom 10, left/right 20' },
  ],
  'Display: Block, Inline & Inline-Block': [
    { text: 'A <div> is by default…', options: ['inline', 'block', 'inline-block', 'grid'], correctAnswer: 'block' },
    { text: 'An inline element…', options: ['starts a new line', 'sits within text; width/height are ignored', 'takes full width', 'cannot be styled'], correctAnswer: 'sits within text; width/height are ignored' },
    { text: 'To remove an element from the layout entirely, use…', options: ['display: none', 'visibility: none', 'position: static', 'display: inline'], correctAnswer: 'display: none' },
    { text: 'display: none differs from visibility: hidden because…', options: ['none removes the element from layout too', 'hidden removes it from layout', 'they are identical', 'none is for images'], correctAnswer: 'none removes the element from layout too' },
  ],

  // ── W3 ───────────────────────────────────────────────────────────────────
  'Flexbox — One-Dimensional Layouts': [
    { text: 'To make a container flex, set…', options: ['display: flex', 'display: block', 'position: flex', 'flex: 1'], correctAnswer: 'display: flex' },
    { text: 'In a row flexbox, space between items horizontally is set with…', options: ['align-items', 'justify-content', 'flex-direction', 'padding'], correctAnswer: 'justify-content' },
    { text: 'To center content both ways, use…', options: ['justify-content: center; align-items: center;', 'text-align: center', 'margin: auto only', 'float: center'], correctAnswer: 'justify-content: center; align-items: center;' },
    { text: 'flex: 1 on items makes them…', options: ['share space equally', 'fixed at 100px', 'hide', 'wrap'], correctAnswer: 'share space equally' },
  ],
  'CSS Grid — Two-Dimensional Layouts': [
    { text: 'Grid is for…', options: ['aligning one row of items', 'layouts needing rows AND columns at once', 'text styling', 'images only'], correctAnswer: 'layouts needing rows AND columns at once' },
    { text: 'grid-template-columns: repeat(3, 1fr) creates…', options: ['three equal-width columns', 'three rows', 'a fixed grid', 'a sidebar'], correctAnswer: 'three equal-width columns' },
    { text: 'The unit 1fr means…', options: ['one fixed pixel', 'a fraction of the free space', 'one character', '100% always'], correctAnswer: 'a fraction of the free space' },
    { text: 'gap in grid controls…', options: ['space between tracks in both axes', 'the border width', 'the margin of the container', 'nothing'], correctAnswer: 'space between tracks in both axes' },
  ],
  'Responsive Design & Media Queries': [
    { text: 'Mobile-first means…', options: ['styling desktop first', 'styling the small screen first, then scaling up with min-width', 'no breakpoints', 'one fixed layout'], correctAnswer: 'styling the small screen first, then scaling up with min-width' },
    { text: '@media (min-width: 768px) applies when…', options: ['the viewport is narrower than 768px', 'the viewport is at least 768px wide', 'the device is a phone', 'the user scrolls'], correctAnswer: 'the viewport is at least 768px wide' },
    { text: 'The viewport meta tag…', options: ['stops phones zooming out your layout', 'adds Google Analytics', 'changes colors', 'fixes fonts'], correctAnswer: 'stops phones zooming out your layout' },
    { text: 'Fluid images use…', options: ['max-width: 100%; height: auto', 'width: 100vw', 'position: fixed', 'display: table'], correctAnswer: 'max-width: 100%; height: auto' },
  ],
  'Navigation & Modern Layout Patterns': [
    { text: 'A sticky header uses…', options: ['position: sticky; top: 0', 'position: fixed only', 'float: left', 'display: none'], correctAnswer: 'position: sticky; top: 0' },
    { text: 'The semantic tag for site navigation is…', options: ['<nav>', '<div>', '<menu>', '<link>'], correctAnswer: '<nav>' },
    { text: 'The page-level container for the main content is…', options: ['<main>', '<body>', '<article>', '<aside>'], correctAnswer: '<main>' },
    { text: 'A nav bar layout (logo left, links right) is naturally built with…', options: ['flexbox', 'a table', 'absolute positioning', 'float'], correctAnswer: 'flexbox' },
  ],

  // ── W4 ───────────────────────────────────────────────────────────────────
  'Forms: Inputs, Labels & Buttons': [
    { text: 'A label is linked to its input by…', options: ['matching for and id', 'the same name', 'the same class', 'position'], correctAnswer: 'matching for and id' },
    { text: 'Which type gives the browser an email keyboard?', options: ['type="text"', 'type="email"', 'type="password"', 'type="file"'], correctAnswer: 'type="email"' },
    { text: 'The server receives data keyed by…', options: ['the input\'s id', 'the input\'s name', 'the label text', 'the placeholder'], correctAnswer: 'the input\'s name' },
    { text: 'The button that submits a form has…', options: ['type="submit"', 'type="button"', 'role="submit"', 'href="#submit"'], correctAnswer: 'type="submit"' },
  ],
  'Form Validation & Better UX': [
    { text: 'The attribute that makes a field mandatory is…', options: ['required', 'check', 'mandatory', 'must'], correctAnswer: 'required' },
    { text: 'type="email" validation is…', options: ['for security', 'a UX convenience — the server must validate again', 'the only validation needed', 'not supported'], correctAnswer: 'a UX convenience — the server must validate again' },
    { text: 'A placeholder should be…', options: ['a label replacement', 'a hint in addition to a real label', 'the main text', 'required'], correctAnswer: 'a hint in addition to a real label' },
    { text: 'pattern="[0-9]{10}" on a phone field…', options: ['enforces a 10-digit format', 'makes the phone ring', 'validates server-side', 'hides the field'], correctAnswer: 'enforces a 10-digit format' },
  ],
  'Semantic HTML & Accessibility (a11y)': [
    { text: 'A self-contained blog post is best wrapped in…', options: ['<article>', '<div>', '<span>', '<footer>'], correctAnswer: '<article>' },
    { text: 'Screen readers rely on semantic HTML for…', options: ['announcing structure and navigation', 'loading images', 'network speed', 'styling'], correctAnswer: 'announcing structure and navigation' },
    { text: 'A keyboard-only user needs…', options: ['every interactive element reachable and operable with Tab', 'a mouse', 'a touchscreen', 'special CSS'], correctAnswer: 'every interactive element reachable and operable with Tab' },
    { text: 'The primary way to test accessibility is…', options: ['keyboard-only navigation and a screen reader', 'checking in a mirror', 'the file size', 'reading the code'], correctAnswer: 'keyboard-only navigation and a screen reader' },
  ],
  'CSS Beyond Basics: Pseudo-classes, Transitions & Transform': [
    { text: 'The hover state selector is…', options: [':hover', ':active', ':link', ':before'], correctAnswer: ':hover' },
    { text: 'To fade a color change instead of snapping, use…', options: ['transition', 'transform', 'animation always', 'transition-delay'], correctAnswer: 'transition' },
    { text: 'transform: translateY(-4px)…', options: ['lifts the element 4px without breaking layout', 'moves it in a circle', 'rotates it 90°', 'shrinks it'], correctAnswer: 'lifts the element 4px without breaking layout' },
    { text: 'The focus style for keyboard users is…', options: [':focus-visible', ':hover', ':active', ':visited'], correctAnswer: ':focus-visible' },
  ],

  // ── W5 ───────────────────────────────────────────────────────────────────
  'Project Setup: Content First, Structure Second': [
    { text: 'The project starts with…', options: ['writing the content and HTML structure', 'CSS styling', 'picking a domain', 'adding JavaScript'], correctAnswer: 'writing the content and HTML structure' },
    { text: 'The semantic skeleton of a landing page is…', options: ['header/nav, hero, features, pricing, contact/footer', 'div, div, div', 'table rows', 'a single <p>'], correctAnswer: 'header/nav, hero, features, pricing, contact/footer' },
    { text: 'Styling before content is bad because…', options: ['it looks better the other way', 'layout designed on empty boxes gets rebuilt when real text arrives', 'CSS is slower', 'content is optional'], correctAnswer: 'layout designed on empty boxes gets rebuilt when real text arrives' },
    { text: 'The first deliverable of the project is…', options: ['a styled page', 'a semantic HTML skeleton with real content', 'a deployed domain', 'an animation'], correctAnswer: 'a semantic HTML skeleton with real content' },
  ],
  'Styling the Hero, Cards & Sections': [
    { text: 'A hero section typically contains…', options: ['headline, subheading and a call-to-action', 'a full article', 'a form only', 'a footer'], correctAnswer: 'headline, subheading and a call-to-action' },
    { text: 'Cards get depth with…', options: ['subtle shadow and border', 'heavy 3D borders', 'animations', 'background images'], correctAnswer: 'subtle shadow and border' },
    { text: 'A max-width container plus margin: 0 auto…', options: ['centers and caps the content width', 'stretches content full screen', 'hides overflow', 'adds padding'], correctAnswer: 'centers and caps the content width' },
    { text: 'Sections feel breathable with…', options: ['generous padding (e.g. 64px)', 'no padding', 'negative margins', 'border-radius'], correctAnswer: 'generous padding (e.g. 64px)' },
  ],
  'Making It Responsive': [
    { text: 'The recommended feature grid behavior is…', options: ['1 column on mobile, more as the screen grows', 'fixed 4 columns everywhere', 'one column everywhere', 'horizontal scroll'], correctAnswer: '1 column on mobile, more as the screen grows' },
    { text: 'DevTools device mode lets you…', options: ['simulate phones and tablets in the browser', 'edit server code', 'buy a domain', 'send emails'], correctAnswer: 'simulate phones and tablets in the browser' },
    { text: 'A comfortable minimum touch target is…', options: ['about 44px', '10px', 'the text size', 'any size'], correctAnswer: 'about 44px' },
    { text: 'A responsive site is…', options: ['tested at each breakpoint, not just coded', 'only for phones', 'one fixed layout', 'unnecessary'], correctAnswer: 'tested at each breakpoint, not just coded' },
  ],
  'Publishing & Review Checklist': [
    { text: 'A free static hosting option is…', options: ['GitHub Pages', 'a local folder', 'a USB drive', 'a printer'], correctAnswer: 'GitHub Pages' },
    { text: 'The checklist item for images is…', options: ['every image has alt text', 'images are animated', 'images are huge', 'no images at all'], correctAnswer: 'every image has alt text' },
    { text: 'The meta description…', options: ['summarizes the page for search results', 'adds a header', 'changes the theme', 'is the page title'], correctAnswer: 'summarizes the page for search results' },
    { text: 'The recommended shipping mindset is…', options: ['ship after the checklist, then iterate', 'perfect forever, never ship', 'publish without checking', 'only publish for clients'], correctAnswer: 'ship after the checklist, then iterate' },
  ],
};
