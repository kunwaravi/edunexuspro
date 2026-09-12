/**
 * JavaScript course — per-topic quizzes. Keyed by EXACT topic titles in
 * javascript.ts. 4 questions per topic, 4 options, 1 correct. Distinct from the
 * chapter-quiz texts in javascript.ts.
 */
import type { TopicQuizMap } from './types';

export const TOPIC_QUIZZES: TopicQuizMap = {
  // ── W1 ───────────────────────────────────────────────────────────────────
  'What JavaScript Does & Where It Runs': [
    { text: 'Beyond the browser, JavaScript runs on servers through…', options: ['Node.js', 'PHP', 'Apache', 'MySQL'], correctAnswer: 'Node.js' },
    { text: 'Where can you type your first JS expressions instantly?', options: ['a terminal only', 'the browser DevTools console', 'the file explorer', 'the address bar'], correctAnswer: 'the browser DevTools console' },
    { text: 'JavaScript is best described as…', options: ['a compiled systems language', 'the interactive language of the browser', 'a markup language', 'a database'], correctAnswer: 'the interactive language of the browser' },
    { text: 'Modern apps built with JavaScript can target…', options: ['web pages only', 'web, servers, mobile and desktop apps', 'servers only', 'embedded chips only'], correctAnswer: 'web, servers, mobile and desktop apps' },
  ],
  'Variables: let, const & var': [
    { text: 'Which keyword declares a variable that cannot be reassigned?', options: ['let', 'const', 'var', 'static'], correctAnswer: 'const' },
    { text: 'A const object…', options: ['cannot be changed at all', 'can have its properties changed', 'is a primitive', 'cannot exist'], correctAnswer: 'can have its properties changed' },
    { text: 'Which keyword should you never use in new code?', options: ['const', 'let', 'var', 'null'], correctAnswer: 'var' },
    { text: '`const x;` alone is…', options: ['valid', 'a SyntaxError (missing initializer)', 'a warning only', 'undefined forever'], correctAnswer: 'a SyntaxError (missing initializer)' },
  ],
  'Data Types & Operators': [
    { text: 'The type of `"hello"` is…', options: ['object', 'string', 'char', 'text'], correctAnswer: 'string' },
    { text: '`"1" - 2` evaluates to…', options: ['"12"', '-1', 'NaN', '"1-2"'], correctAnswer: '-1' },
    { text: 'Which values are falsy?', options: ['"0" and 1', '0, "", null, undefined and NaN', '[] and {}', 'all strings'], correctAnswer: '0, "", null, undefined and NaN' },
    { text: '`name || "Guest"` returns "Guest" when name is…', options: ['truthy', 'falsy (e.g. empty string)', 'a template literal', 'a number'], correctAnswer: 'falsy (e.g. empty string)' },
  ],
  'Strings, Template Literals & Console': [
    { text: 'Which syntax interpolates variables into a string?', options: ['"${x}"', '`${x}`', "'${x}'", '$x'], correctAnswer: '`${x}`' },
    { text: '`"hello".toUpperCase()` returns…', options: ['"HELLO"', '"hello"', '"Hello"', '5'], correctAnswer: '"HELLO"' },
    { text: 'Strings are immutable, so methods like trim()…', options: ['change the original', 'return a new string', 'return null', 'only work on numbers'], correctAnswer: 'return a new string' },
    { text: 'Which console method prints data in a table?', options: ['console.log', 'console.error', 'console.table', 'console.alert'], correctAnswer: 'console.table' },
  ],

  // ── W2 ───────────────────────────────────────────────────────────────────
  'Conditionals & Comparison': [
    { text: '`score >= 40 ? "Pass" : "Fail"` with score 50 gives…', options: ['Pass', 'Fail', 'undefined', 'NaN'], correctAnswer: 'Pass' },
    { text: 'The nullish operator ?? returns the right side when the left is…', options: ['false or 0', 'null or undefined', 'empty only', 'a string'], correctAnswer: 'null or undefined' },
    { text: '`count ?? 10` with count = 0 gives…', options: ['10', '0', 'undefined', 'null'], correctAnswer: '0' },
    { text: 'switch compares its cases using…', options: ['loose ==', 'strict ===', 'object identity only', 'regex'], correctAnswer: 'strict ===' },
  ],
  'Loops & Iteration': [
    { text: '`for (const item of items)` iterates…', options: ['property keys', 'values of the iterable', 'indexes', 'nothing'], correctAnswer: 'values of the iterable' },
    { text: '`break` inside a loop…', options: ['skips one item', 'exits the loop', 'restarts the loop', 'throws'], correctAnswer: 'exits the loop' },
    { text: '`[1,2,3].reduce((acc, n) => acc + n, 0)` returns…', options: ['6', '[1,2,3]', '0', '3'], correctAnswer: '6' },
    { text: 'The functional method that creates a new array with only matching items is…', options: ['map', 'filter', 'reduce', 'forEach'], correctAnswer: 'filter' },
  ],
  'Functions & Arrow Functions': [
    { text: '`const square = (x) => x * x;` is an example of…', options: ['a class', 'an arrow function', 'a loop', 'a template'], correctAnswer: 'an arrow function' },
    { text: 'An arrow function with a single expression…', options: ['needs braces always', 'implicitly returns the expression', 'returns undefined', 'cannot compile'], correctAnswer: 'implicitly returns the expression' },
    { text: 'Default parameters `function greet(name = "Guest")` handle…', options: ['type errors', 'missing arguments', 'null comparisons', 'async errors'], correctAnswer: 'missing arguments' },
    { text: 'A function that returns nothing returns…', options: ['0', 'undefined', 'null', 'this'], correctAnswer: 'undefined' },
  ],
  'Scope & Closures': [
    { text: 'Variables declared with let/const are…', options: ['function-scoped', 'block-scoped', 'globally scoped always', 'immutable'], correctAnswer: 'block-scoped' },
    { text: 'A closure is…', options: ['a closed file', 'a function that keeps its defining scope alive', 'an error', 'a loop'], correctAnswer: 'a function that keeps its defining scope alive' },
    { text: 'In the counter factory, `count` is…', options: ['global', 'private to each closure', 'deleted each call', 'static'], correctAnswer: 'private to each closure' },
    { text: 'The temporal dead zone means let/const…', options: ['are available before declaration', 'cannot be used before their declaration line runs', 'are always undefined', 'are hoisted as functions'], correctAnswer: 'cannot be used before their declaration line runs' },
  ],

  // ── W3 ───────────────────────────────────────────────────────────────────
  'Arrays & Array Methods': [
    { text: '`[10, 2].sort()` returns…', options: ['[2, 10]', '[10, 2] (string sort)', '[10]', 'an error'], correctAnswer: '[10, 2] (string sort)' },
    { text: 'To sort numbers ascending you must pass…', options: ['nothing', 'a comparator like (a, b) => a - b', 'a string', 'true'], correctAnswer: 'a comparator like (a, b) => a - b' },
    { text: '`items.slice(1, 3)` …', options: ['mutates items', 'returns a subarray without changing items', 'deletes items', 'sorts items'], correctAnswer: 'returns a subarray without changing items' },
    { text: '`const [first, ...rest] = [1,2,3]` gives…', options: ['first=1, rest=[2,3]', 'first=1, rest=2', 'an error', 'first=[1,2], rest=3'], correctAnswer: 'first=1, rest=[2,3]' },
  ],
  'Objects & Destructuring': [
    { text: '`const { name } = user;` extracts…', options: ['the whole user', 'the value of user.name into a variable name', 'an array', 'a copy of the object'], correctAnswer: 'the value of user.name into a variable name' },
    { text: '`user?.address?.city` returns…', options: ['a crash always', 'undefined if address is missing (no crash)', 'an empty object', 'a promise'], correctAnswer: 'undefined if address is missing (no crash)' },
    { text: '`const { age = 18 } = user;` sets age to 18 when…', options: ['user.age exists', 'user.age is undefined/missing', 'user is null always', 'age is negative'], correctAnswer: 'user.age is undefined/missing' },
    { text: '`Object.entries(obj)` returns…', options: ['an array of [key, value] pairs', 'only keys', 'only values', 'a string'], correctAnswer: 'an array of [key, value] pairs' },
  ],
  'Spread, Rest & the Modern Toolkit': [
    { text: '`{ ...a, ...b }` creates…', options: ['a mutated a', 'a new object merging a and b', 'an array', 'a string'], correctAnswer: 'a new object merging a and b' },
    { text: 'Spread `...` and rest `...`…', options: ['do the same thing', 'spread expands out, rest collects in', 'are only for objects', 'are deprecated'], correctAnswer: 'spread expands out, rest collects in' },
    { text: '`new Set([1,1,2,2,3])` contains…', options: ['5 items', '3 unique items', 'an error', 'strings'], correctAnswer: '3 unique items' },
    { text: 'Immutably updating state means…', options: ['mutating then copying', 'building a new value with spread instead of changing in place', 'using var', 'deleting objects'], correctAnswer: 'building a new value with spread instead of changing in place' },
  ],
  'The DOM — Selecting & Modifying Elements': [
    { text: '`document.querySelector(".card")` returns…', options: ['all .card elements', 'the first .card element', 'the last .card element', 'a NodeList of one'], correctAnswer: 'the first .card element' },
    { text: 'The safest way to set text without parsing HTML is…', options: ['innerHTML', 'textContent', 'insertHTML', 'setAttribute'], correctAnswer: 'textContent' },
    { text: '`el.classList.toggle("active")`…', options: ['adds active forever', 'adds it if absent, removes it if present', 'replaces all classes', 'clears classes'], correctAnswer: 'adds it if absent, removes it if present' },
    { text: 'NodeList returned by querySelectorAll is…', options: ['a real array', 'array-like — spread it to use array methods', 'an object with no length', 'a promise'], correctAnswer: 'array-like — spread it to use array methods' },
  ],

  // ── W4 ───────────────────────────────────────────────────────────────────
  'Events & Event Listeners': [
    { text: '`el.addEventListener("click", handler)` …', options: ['overwrites previous handlers', 'adds a handler without touching HTML', 'only works once', 'requires jQuery'], correctAnswer: 'adds a handler without touching HTML' },
    { text: '`event.target` is…', options: ['the element that fired the event', 'the parent element', 'the whole document', 'the handler'], correctAnswer: 'the element that fired the event' },
    { text: 'Event delegation means…', options: ['listening on every child', 'one listener on a parent that handles children via event.target', 'only click events', 'using inline onclick'], correctAnswer: 'one listener on a parent that handles children via event.target' },
    { text: 'To remove a listener you must pass…', options: ['a new arrow each time', 'the same named function reference', 'null', 'the event name only'], correctAnswer: 'the same named function reference' },
  ],
  'Forms & Validation': [
    { text: 'To keep a form from reloading the page you call…', options: ['event.preventDefault()', 'event.stop()', 'form.stop()', 'return false globally'], correctAnswer: 'event.preventDefault()' },
    { text: '`new FormData(form)` lets you…', options: ['style the form', 'read the form field values', 'delete the form', 'print the form'], correctAnswer: 'read the form field values' },
    { text: 'Frontend validation exists mainly for…', options: ['security', 'user experience — backend validation is for safety', 'speed', 'style'], correctAnswer: 'user experience — backend validation is for safety' },
    { text: 'The HTML attribute that makes a field mandatory is…', options: ['check', 'required', 'validate', 'must'], correctAnswer: 'required' },
  ],
  'Promises & async/await': [
    { text: 'A Promise represents…', options: ['a synchronous value', 'a future value: pending, fulfilled or rejected', 'an error only', 'a DOM node'], correctAnswer: 'a future value: pending, fulfilled or rejected' },
    { text: '`await` pauses the async function until…', options: ['the next loop', 'the promise settles', 'the page loads', 'the timer fires'], correctAnswer: 'the promise settles' },
    { text: 'Errors in async/await are handled with…', options: ['if/else', 'try/catch', 'switch', 'typeof'], correctAnswer: 'try/catch' },
    { text: '`Promise.all` is for…', options: ['running promises one after another', 'running promises in parallel and resolving when all settle', 'cancelling promises', 'making promises'], correctAnswer: 'running promises in parallel and resolving when all settle' },
  ],
  'Fetch & Working with APIs': [
    { text: 'fetch() does NOT reject on…', options: ['network failure', 'HTTP errors like 404 — you must check res.ok', 'invalid URLs', 'timeouts'], correctAnswer: 'HTTP errors like 404 — you must check res.ok' },
    { text: 'To send JSON you must include the header…', options: ['Accept: text', 'Content-Type: application/json', 'X-JSON: true', 'Method: POST'], correctAnswer: 'Content-Type: application/json' },
    { text: '`res.json()` parses…', options: ['the headers', 'the response body as JSON', 'the request URL', 'the status code'], correctAnswer: 'the response body as JSON' },
    { text: 'The recommended loading pattern is…', options: ['block the UI', 'track loading, error and data state and render each', 'show nothing until done', 'alert() the result'], correctAnswer: 'track loading, error and data state and render each' },
  ],

  // ── W5 ───────────────────────────────────────────────────────────────────
  'Debugging with DevTools': [
    { text: 'The `debugger;` statement…', options: ['removes code', 'pauses execution when DevTools is open', 'logs a message', 'sends an alert'], correctAnswer: 'pauses execution when DevTools is open' },
    { text: 'To inspect which requests a page makes, use the…', options: ['Network tab', 'Elements tab', 'Sources tab', 'Console tab'], correctAnswer: 'Network tab' },
    { text: 'Stepping "over" a line means…', options: ['entering every function call', 'running the line without entering functions', 'skipping the file', 'restarting the debugger'], correctAnswer: 'running the line without entering functions' },
    { text: 'The disciplined debugging order is…', options: ['fix then investigate', 'reproduce, isolate input, inspect state, form a hypothesis, fix, retest', 'delete and rewrite', 'add more logs forever'], correctAnswer: 'reproduce, isolate input, inspect state, form a hypothesis, fix, retest' },
  ],
  'Modules — import/export': [
    { text: 'A named export is imported as…', options: ['import name from ...', 'import { name } from ...', 'import * only', 'require(name)'], correctAnswer: 'import { name } from ...' },
    { text: 'Module scope means…', options: ['everything is global', 'only exported bindings are visible outside the file', 'nothing is private', 'imports are optional'], correctAnswer: 'only exported bindings are visible outside the file' },
    { text: 'Module scripts are loaded with…', options: ['<script>', '<script type="module">', '<link>', '<style>'], correctAnswer: '<script type="module">' },
    { text: 'The main benefit of modules is…', options: ['faster runtime', 'real encapsulation and smaller focused files', 'less typing', 'automatic testing'], correctAnswer: 'real encapsulation and smaller focused files' },
  ],
  'Mini Project — Interactive Quiz App': [
    { text: 'In the quiz app, the questions are stored as…', options: ['separate variables', 'an array of objects { q, options, answer }', 'a CSS class', 'a database'], correctAnswer: 'an array of objects { q, options, answer }' },
    { text: 'The recommended build order is…', options: ['write everything then debug', 'start with a tiny working loop, then extend', 'copy a full app', 'skip rendering'], correctAnswer: 'start with a tiny working loop, then extend' },
    { text: '`document.querySelector("#options").innerHTML = q.options.map(...).join("")` renders…', options: ['one button per option', 'a table', 'the whole quiz', 'a form'], correctAnswer: 'one button per option' },
    { text: 'Keeping render logic separate from score logic helps…', options: ['style', 'testing each part independently', 'compilation', 'loading'], correctAnswer: 'testing each part independently' },
  ],
  'Next Steps — TypeScript & Frameworks': [
    { text: 'TypeScript catches mistakes…', options: ['at runtime', 'at compile time', 'only in the browser', 'never'], correctAnswer: 'at compile time' },
    { text: 'React, Vue and Svelte are examples of…', options: ['databases', 'frontend frameworks/libraries', 'build tools only', 'CSS preprocessors'], correctAnswer: 'frontend frameworks/libraries' },
    { text: 'Frameworks update the DOM by…', options: ['manual querySelector everywhere', 'describing the UI for a state and letting the framework sync it', 'reloading the page', 'changing HTML files'], correctAnswer: 'describing the UI for a state and letting the framework sync it' },
    { text: 'The recommended learning path is…', options: ['framework first, then vanilla', 'vanilla JS first, then TypeScript, then one framework', 'TypeScript before any JS', 'never write vanilla'], correctAnswer: 'vanilla JS first, then TypeScript, then one framework' },
  ],
};
