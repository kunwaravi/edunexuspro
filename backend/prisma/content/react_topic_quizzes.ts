/**
 * React — per-topic quizzes. Keyed by the EXACT topic titles in react.ts
 * (topic-lock flow). 4 questions per topic, 4 options, 1 correct.
 * Distinct from the chapter-quiz texts in react.ts.
 */
import type { TopicQuizMap } from './types';

export const TOPIC_QUIZZES: TopicQuizMap = {
  // ── W1 ───────────────────────────────────────────────────────────────────
  'What React Is & How It Thinks': [
    { text: 'React\'s core idea is…', options: ['imperatively editing the DOM', 'describing the UI for a state and letting React sync the DOM', 'writing HTML in files', 'server-side rendering only'], correctAnswer: 'describing the UI for a state and letting React sync the DOM' },
    { text: 'A React page is…', options: ['a tree of components', 'one giant function', 'a single HTML file', 'a stylesheet'], correctAnswer: 'a tree of components' },
    { text: 'State changes cause React to…', options: ['reload the page', 're-render the component and its children', 'save to disk', 'emit a warning'], correctAnswer: 're-render the component and its children' },
    { text: 'JSX is…', options: ['a template language separate from JS', 'syntax that mixes markup and JavaScript logic', 'a database query', 'a build tool'], correctAnswer: 'syntax that mixes markup and JavaScript logic' },
  ],
  'Components & the Component Tree': [
    { text: 'Components are conventionally named in…', options: ['camelCase', 'PascalCase', 'snake_case', 'UPPER_CASE'], correctAnswer: 'PascalCase' },
    { text: 'A component that has grown too large should…', options: ['stay as one block', 'be split into smaller components', 'be deleted', 'be copied'], correctAnswer: 'be split into smaller components' },
    { text: 'Small reusable pieces like Button and Input are…', options: ['repeated across pages', 'independent components any page can use', 'global variables', 'CSS classes'], correctAnswer: 'independent components any page can use' },
    { text: 'A component is best defined as…', options: ['a function returning JSX', 'a class that never renders', 'an HTML tag', 'a style sheet'], correctAnswer: 'a function returning JSX' },
  ],
  'JSX — Markup in JavaScript': [
    { text: 'To embed a value in JSX you use…', options: ['{value}', '(value)', '[value]', '<value>'], correctAnswer: '{value}' },
    { text: 'A multi-line JSX expression must return…', options: ['many elements', 'a single root (or fragment <>...</>)', 'a string', 'nothing'], correctAnswer: 'a single root (or fragment <>...</>)' },
    { text: 'JSX escapes values by default, meaning…', options: ['{userInput} renders as text, not HTML — an XSS defense', 'you cannot show strings', 'text is always bold', 'values are hidden'], correctAnswer: '{userInput} renders as text, not HTML — an XSS defense' },
    { text: 'A comment inside JSX is written…', options: ['{/* comment */}', '<!-- comment -->', '// comment', '# comment'], correctAnswer: '{/* comment */}' },
  ],
  'Props — Passing Data Down': [
    { text: 'Data flow in React is…', options: ['two-way', 'one way: down the component tree via props', 'only upward', 'random'], correctAnswer: 'one way: down the component tree via props' },
    { text: 'To change parent state, a child…', options: ['mutates the props', 'calls a callback passed via props', 'edits the DOM directly', 'reloads the page'], correctAnswer: 'calls a callback passed via props' },
    { text: 'Props are best described as…', options: ['read-only inputs', 'mutable local state', 'global data', 'class names'], correctAnswer: 'read-only inputs' },
    { text: 'A child should treat props as…', options: ['something it owns and mutates', 'reports from the parent it must not change', 'a place to store state', 'CSS styles'], correctAnswer: 'reports from the parent it must not change' },
  ],

  // ── W2 ───────────────────────────────────────────────────────────────────
  'useState — Memory for Components': [
    { text: 'useState returns…', options: ['a single value', '[value, setter]', '[setter, value]', 'an object'], correctAnswer: '[value, setter]' },
    { text: 'To update state you must…', options: ['mutate the variable', 'call the setter', 'reassign directly', 'use a global'], correctAnswer: 'call the setter' },
    { text: 'Two instances of the same component…', options: ['share state', 'have independent state', 'crash', 'sync automatically'], correctAnswer: 'have independent state' },
    { text: 'setCount(c => c + 1) is preferred because…', options: ['it is shorter', 'it uses the latest value even in batched updates', 'it mutates', 'it is faster'], correctAnswer: 'it uses the latest value even in batched updates' },
  ],
  'Events: onClick, onChange & Handlers': [
    { text: 'The correct way to attach a handler is…', options: ['onClick={handleClick}', 'onClick={handleClick()}', 'onclick="handleClick"', 'onClick="handleClick()"'], correctAnswer: 'onClick={handleClick}' },
    { text: 'In a form, to stop the page reload you call…', options: ['e.preventDefault()', 'e.stop()', 'return false globally', 'form.cancel()'], correctAnswer: 'e.preventDefault()' },
    { text: 'To pass an argument to a handler, you write…', options: ['onClick={() => handleDelete(item.id)}', 'onClick={handleDelete(item.id)}', 'onClick={handleDelete}', 'onClick="handleDelete(item.id)"'], correctAnswer: 'onClick={() => handleDelete(item.id)}' },
    { text: 'The current value of an input is available as…', options: ['e.target.value', 'e.value', 'this.value', 'input.value()'], correctAnswer: 'e.target.value' },
  ],
  'Forms & Controlled Inputs': [
    { text: 'In a controlled input, the value comes from…', options: ['the DOM directly', 'state, updated on change', 'a ref', 'localStorage'], correctAnswer: 'state, updated on change' },
    { text: 'A controlled input always matches…', options: ['state', 'the DOM', 'the server', 'the previous value'], correctAnswer: 'state' },
    { text: 'For a select dropdown, the controlled value comes from…', options: ['the selected option\'s value in state', 'the option index', 'the DOM only', 'a prop'], correctAnswer: 'the selected option\'s value in state' },
    { text: 'A common update pattern for a multi-field form is…', options: ['setForm({ ...form, [field]: value })', 'mutate form directly', 'reload the page', 'one setter per character'], correctAnswer: 'setForm({ ...form, [field]: value })' },
  ],
  'Conditional Rendering & Lists': [
    { text: '{unread > 0 && <span>New!</span>} renders the span…', options: ['always', 'only when unread is greater than 0', 'never', 'when unread is 0'], correctAnswer: 'only when unread is greater than 0' },
    { text: 'To render an array of items you…', options: ['loop with a for', 'map over it returning JSX', 'copy the array', 'use a table'], correctAnswer: 'map over it returning JSX' },
    { text: 'Each mapped item needs a…', options: ['style prop', 'unique key', 'class name', 'ref'], correctAnswer: 'unique key' },
    { text: 'For an empty filtered list you should…', options: ['render nothing at all', 'render a friendly empty-state message', 'crash', 'show a loader'], correctAnswer: 'render a friendly empty-state message' },
  ],

  // ── W3 ───────────────────────────────────────────────────────────────────
  'useEffect — Side Effects': [
    { text: 'Effects are for…', options: ['pure rendering', 'side effects: fetching, timers, subscriptions', 'styling', 'math'], correctAnswer: 'side effects: fetching, timers, subscriptions' },
    { text: 'The effect runs again when…', options: ['anything changes', 'a listed dependency changes', 'the component mounts only', 'the page loads'], correctAnswer: 'a listed dependency changes' },
    { text: 'The cleanup function is used to…', options: ['cancel timers/subscriptions before the next run and on unmount', 'delete the component', 'return data', 'stop re-renders'], correctAnswer: 'cancel timers/subscriptions before the next run and on unmount' },
    { text: 'An interval started in an effect without cleanup…', options: ['is fine', 'leaks and keeps running after unmount', 'throws an error', 'stops itself'], correctAnswer: 'leaks and keeps running after unmount' },
  ],
  'Fetching Data with fetch & async/await': [
    { text: 'The recommended place to fetch initial data is…', options: ['inside a useEffect', 'during render', 'in the JSX', 'in a CSS file'], correctAnswer: 'inside a useEffect' },
    { text: 'The cancelled flag in a fetch effect prevents…', options: ['stale responses overwriting newer state', 'the server responding', 'React crashing', 'unnecessary renders'], correctAnswer: 'stale responses overwriting newer state' },
    { text: 'A fetch failure should be handled by…', options: ['throwing silently', 'catching and setting an error state', 'reloading the page', 'ignoring it'], correctAnswer: 'catching and setting an error state' },
    { text: 'While loading, the component should render…', options: ['a loading indicator', 'nothing', 'the error', 'the old data'], correctAnswer: 'a loading indicator' },
  ],
  'Custom Hooks — Reusable Logic': [
    { text: 'A custom hook is…', options: ['a function starting with use that uses other hooks', 'a special component', 'a CSS class', 'a server file'], correctAnswer: 'a function starting with use that uses other hooks' },
    { text: 'Custom hooks follow the Rules of Hooks: called…', options: ['at the top level, never conditionally', 'inside loops', 'in the render body only sometimes', 'anywhere'], correctAnswer: 'at the top level, never conditionally' },
    { text: 'Extract a custom hook when…', options: ['you repeat the same logic in two components', 'you have one component', 'the logic is trivial', 'never'], correctAnswer: 'you repeat the same logic in two components' },
    { text: 'useFetch(url) returning { data, loading, error } is an example of…', options: ['a custom hook', 'a component', 'a reducer', 'a context'], correctAnswer: 'a custom hook' },
  ],
  'Context — Sharing State Without Prop Drilling': [
    { text: 'Context is mainly for…', options: ['app-wide state like theme or logged-in user', 'every piece of local data', 'form inputs', 'list keys'], correctAnswer: 'app-wide state like theme or logged-in user' },
    { text: 'The three parts of Context are…', options: ['createContext, Provider, useContext', 'state, props, effects', 'useState, useMemo, useRef', 'route, link, nav'], correctAnswer: 'createContext, Provider, useContext' },
    { text: 'Context solves…', options: ['prop drilling', 'fetching data', 'styling', 'routing'], correctAnswer: 'prop drilling' },
    { text: 'The Provider is placed…', options: ['around the subtree that needs the value', 'inside every consumer', 'in the CSS', 'in the router'], correctAnswer: 'around the subtree that needs the value' },
  ],

  // ── W4 ───────────────────────────────────────────────────────────────────
  'React Router — Multiple Pages': [
    { text: 'The component that matches a URL to a page is…', options: ['Route', 'Link', 'Nav', 'Page'], correctAnswer: 'Route' },
    { text: 'In-app navigation uses <Link> instead of <a href> because…', options: ['it is prettier', '<a href> causes a full page reload', 'Link is required by law', 'a tags are disabled'], correctAnswer: '<a href> causes a full page reload' },
    { text: 'The hook that reads a URL parameter (:id) is…', options: ['useParams()', 'useState()', 'useNavigate()', 'useLocation()'], correctAnswer: 'useParams()' },
    { text: 'To navigate programmatically (e.g. after submit) use…', options: ['useNavigate()', 'a Link', 'window.location always', 'useParams()'], correctAnswer: 'useNavigate()' },
  ],
  'Lifting State Up & Thinking in React': [
    { text: 'When two siblings need the same data, the state lives in…', options: ['each sibling', 'their closest common parent', 'a global variable', 'a ref'], correctAnswer: 'their closest common parent' },
    { text: 'The parent shares state with children via…', options: ['value + updater passed as props', 'duplication', 'CSS classes', 'the DOM'], correctAnswer: 'value + updater passed as props' },
    { text: 'The React thinking process starts with…', options: ['a static mock, then finding what changes and where state lives', 'writing CSS', 'deploying', 'adding a router'], correctAnswer: 'a static mock, then finding what changes and where state lives' },
    { text: 'State should live…', options: ['as high as possible always', 'as low as needed but shared where required', 'in every component', 'in a file'], correctAnswer: 'as low as needed but shared where required' },
  ],
  'Styling React Components': [
    { text: 'A popular utility-first styling approach is…', options: ['Tailwind CSS', 'plain <font> tags', 'inline style everywhere', 'no styling'], correctAnswer: 'Tailwind CSS' },
    { text: 'A dynamic class based on state is written…', options: ['className={`tab ${active ? "active" : ""}`}', 'class="tab active"', 'className="tab"', 'style=active'], correctAnswer: 'className={`tab ${active ? "active" : ""}`}' },
    { text: 'A repeated styled button should be…', options: ['a Button component', 'ten inline styles', 'a CSS reset', 'an image'], correctAnswer: 'a Button component' },
    { text: 'The styling discipline is…', options: ['one approach per project, used consistently', 'mix everything', 'inline styles only', 'a different library per component'], correctAnswer: 'one approach per project, used consistently' },
  ],
  'Composition vs Props — Flexible Components': [
    { text: 'To render whatever is placed between a component\'s tags, use…', options: ['{children}', '{props}', '{slot}', '{content}'], correctAnswer: '{children}' },
    { text: 'Composition is better than props for…', options: ['flexible layouts where content shape varies', 'passing a single string', 'numbers', 'nothing'], correctAnswer: 'flexible layouts where content shape varies' },
    { text: 'A generic Card that renders children can serve…', options: ['infinite content variations', 'only one use', 'text only', 'no one'], correctAnswer: 'infinite content variations' },
    { text: 'The guideline is…', options: ['compose first; add props only when children isn\'t enough', 'props first always', 'never use children', 'only use children'], correctAnswer: 'compose first; add props only when children isn\'t enough' },
  ],

  // ── W5 ───────────────────────────────────────────────────────────────────
  'Project — A Todo/Task App': [
    { text: 'The natural state shape for tasks is…', options: ['an array of {id, text, done} plus a filter', 'one boolean', 'a string', 'a CSS class'], correctAnswer: 'an array of {id, text, done} plus a filter' },
    { text: 'A reliable client-generated unique id is…', options: ['crypto.randomUUID()', 'the array index', 'Math.random() alone', 'a constant'], correctAnswer: 'crypto.randomUUID()' },
    { text: 'Toggling a task\'s done flag immutably is…', options: ['map to a new array with the changed item', 'mutate the array in place', 'delete the item', 'reload'], correctAnswer: 'map to a new array with the changed item' },
    { text: 'A great first extension after the basics is…', options: ['persist to localStorage', 'add a router', 'a global store', 'an animation'], correctAnswer: 'persist to localStorage' },
  ],
  'Project — Fetch & Render an API List': [
    { text: 'The custom hook that powers the list page is…', options: ['useFetch(url) returning { data, loading, error }', 'useState only', 'a for loop', 'useParams()'], correctAnswer: 'useFetch(url) returning { data, loading, error }' },
    { text: 'While fetching you render…', options: ['a loading skeleton', 'an empty page', 'the error', 'nothing forever'], correctAnswer: 'a loading skeleton' },
    { text: 'On error, a good UX is…', options: ['a retry button', 'a blank screen', 'an alert loop', 'a reload'], correctAnswer: 'a retry button' },
    { text: 'Client-side search filters…', options: ['the already-fetched data by query', 'the server database', 'the URL', 'the CSS'], correctAnswer: 'the already-fetched data by query' },
  ],
  'Performance & React Best Practices': [
    { text: 'The first performance step is…', options: ['measure with the Profiler', 'add memo everywhere', 'rewrite in a new framework', 'disable effects'], correctAnswer: 'measure with the Profiler' },
    { text: 'key={index} is risky for…', options: ['reorderable lists — items get reused incorrectly', 'static lists', 'any list', 'nothing'], correctAnswer: 'reorderable lists — items get reused incorrectly' },
    { text: 'React.lazy + Suspense…', options: ['loads heavy components only when needed', 'removes components', 'styles components', 'caches data'], correctAnswer: 'loads heavy components only when needed' },
    { text: 'The best habit among these is…', options: ['keep components small and keys stable', 'memoize everything', 'avoid re-renders entirely', 'use global state'], correctAnswer: 'keep components small and keys stable' },
  ],
  'Building & Deploying to Production': [
    { text: 'npm run build produces…', options: ['static files in dist/', 'a database', 'a server binary', 'source maps only'], correctAnswer: 'static files in dist/' },
    { text: 'Free hosts that deploy a Vite build include…', options: ['Netlify, Vercel and GitHub Pages', 'only paid servers', 'a USB drive', 'a local folder'], correctAnswer: 'Netlify, Vercel and GitHub Pages' },
    { text: 'The build and dev modes differ in that…', options: ['dev runs source, build is optimized/minified for production', 'they are identical', 'build is slower', 'dev is minified'], correctAnswer: 'dev runs source, build is optimized/minified for production' },
    { text: 'The production checklist includes…', options: ['no console errors and passing Lighthouse', 'just pushing the code', 'a faster internet', 'more images'], correctAnswer: 'no console errors and passing Lighthouse' },
  ],
};
