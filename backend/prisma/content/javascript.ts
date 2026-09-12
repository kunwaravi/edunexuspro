/**
 * JavaScript — The Language of the Web · Task 5 starter curriculum.
 * 5 modules × 4 topics, per-topic quizzes in javascript_topic_quizzes.ts,
 * plus a 4-question chapter quiz per module.
 */
import type { Section } from './types';

export const SECTIONS: Section[] = [
  // ── W1 · JS Foundations ──────────────────────────────────────────────────
  {
    week: 1,
    title: 'JavaScript Foundations',
    description: 'What JavaScript is, where it runs, and the variables, types and strings you will use all day.',
    topics: [
      {
        title: 'What JavaScript Does & Where It Runs',
        text: 'JavaScript is the programming language of the browser. Every page you visit runs JS to react to clicks, validate forms, fetch data and update content without reloading. It is single-threaded and event-driven: it runs one task at a time but queues events and callbacks so the page stays responsive.\n\nToday JavaScript also runs outside the browser: Node.js runs it on servers, and it powers mobile apps (React Native), desktop apps (Electron) and even databases. One language, everywhere.\n\nYour first experiments happen in the browser DevTools console — open any page, press F12, click Console, and type expressions there. No install needed.',
        code: '// Open DevTools Console on any page and type:\nconsole.log("Hello from JavaScript");\n2 + 3;      // 5\n"a" + "b";  // "ab"',
        note: 'Everything a page does interactively — modals, search suggestions, infinite scroll — is JavaScript talking to the browser.',
      },
      {
        title: 'Variables: let, const & var',
        text: 'Variables store values. `let` declares a variable you can reassign. `const` declares a constant — the binding cannot be reassigned (though if it holds an object, the object can still change). `var` is the old keyword: it is function-scoped, hoisted confusingly and leaks into loops. Modern code uses `const` by default and `let` when you must reassign.\n\nA `const` must be initialized when declared. Name variables in camelCase (`totalMarks`, not `total_marks`). JavaScript is dynamically typed: the same variable can hold a number now and a string later, but that freedom is exactly why tools like TypeScript exist.',
        code: 'const name = "Aisha";   // cannot reassign name\nlet score = 10;\nscore = 15;             // ok — let allows reassignment\n// const x;             // SyntaxError: missing initializer\n\nconst user = { role: "admin" };\nuser.role = "student";  // allowed — the object changed, not the binding',
        note: 'Rule of thumb: const by default, let only when you genuinely reassign, var never in new code.',
      },
      {
        title: 'Data Types & Operators',
        text: 'JavaScript has seven primitive types: `string`, `number`, `boolean`, `undefined`, `null`, `symbol` and `bigint`; everything else is an `object`. `typeof` tells you a value\'s type. Be careful: `typeof null` returns "object" — a famous legacy bug.\n\nArithmetic operators work like math: `+ - * / %`. The `+` sign also concatenates strings, which causes surprises: `"1" + 2` is `"12"`, but `"1" - 2` is `-1` (the minus forces numbers). Comparison: `==` coerces types (`"1" == 1` is true), while `===` requires same type and value — always prefer `===`.\n\nLogical operators: `&&`, `||`, `!`. `||` returns the first truthy value, useful for defaults: `name || "Guest"`.',
        code: 'typeof 42;          // "number"\ntypeof "hi";        // "string"\n"1" + 2;            // "12"\n"1" - 2;            // -1\n1 == "1";           // true (coerced)\n1 === "1";          // false (type matters)\nconst username = "" || "Guest";   // "Guest"',
        note: 'Falsy values are: false, 0, "" (empty string), null, undefined, NaN. Everything else is truthy.',
      },
      {
        title: 'Strings, Template Literals & Console',
        text: 'Strings hold text. Single quotes, double quotes and backticks all create strings; backticks create template literals that interpolate variables with `${}` and span multiple lines. That makes string building readable instead of a pile of plus signs.\n\nCommon string methods: `length`, `toUpperCase()`, `toLowerCase()`, `trim()`, `includes(sub)`, `split(sep)`, `slice(start, end)`. Strings are immutable — every method returns a NEW string; the original is unchanged.\n\nThe console is your best friend: `console.log(v)`, `console.error(v)`, and `console.table(array)` for tabular data.',
        code: 'const name = "Ravi";\nconst marks = 72;\nconsole.log(`${name} scored ${marks}`);   // "Ravi scored 72"\n\n"  hello  ".trim();                       // "hello"\n"a,b,c".split(",");                       // ["a","b","c"]\n"edunexus".includes("nex");               // true',
        note: 'Template literals with ${} are the default way to build strings — they beat string concatenation for readability and safety.',
      },
    ],
    quizzes: [
      { text: 'JavaScript runs in the browser to…', options: ['style pages only', 'react to events, fetch data and update the page', 'compile the HTML', 'run the server'], correctAnswer: 'react to events, fetch data and update the page' },
      { text: 'Which keyword should you prefer by default for a variable?', options: ['var', 'let', 'const', 'static'], correctAnswer: 'const' },
      { text: '`1 === "1"` evaluates to…', options: ['true', 'false', 'NaN', 'an error'], correctAnswer: 'false' },
      { text: 'Template literals are delimited by…', options: ['single quotes', 'double quotes', 'backticks', 'parentheses'], correctAnswer: 'backticks' },
    ],
  },

  // ── W2 · Control Flow & Functions ────────────────────────────────────────
  {
    week: 2,
    title: 'Control Flow & Functions',
    description: 'Conditionals, loops, functions and the scope rules that make JavaScript tick.',
    topics: [
      {
        title: 'Conditionals & Comparison',
        text: '`if`, `else if` and `else` run code based on truthiness. Unlike `===` comparisons, `if (someString)` checks whether the value is truthy — empty string is falsy, so `if (input)` skips blanks.\n\nThe switch statement compares one value against many cases with `===` semantics. Ternary `cond ? a : b` is a compact if/else that produces a value.\n\nShort-circuiting: `a && b` returns a if a is falsy (skipping b); `a || b` returns a if a is truthy. The nullish operator `??` returns the right side only when the left is null/undefined — better than `||` when `0` or `""` are legitimate values.',
        code: 'const score = 74;\nlet grade;\nif (score >= 75) grade = "A";\nelse if (score >= 60) grade = "B";\nelse grade = "C";\n\nconst result = score >= 40 ? "Pass" : "Fail";\n\nconst count = 0;\nconst shown = count ?? 10;   // 0 (nullish: 0 is kept)\nconst shown2 = count || 10;  // 10 (0 is falsy)',
        note: 'Use ?? for "default when null/undefined", || for "default when falsy". Knowing the difference prevents real bugs.',
      },
      {
        title: 'Loops & Iteration',
        text: 'The classic `for (let i = 0; i < n; i++)` runs a fixed count. `for...of` iterates values of an iterable (`for (const item of items)`). `for...in` iterates property keys — for arrays, avoid it; for objects it walks inherited keys.\n\n`while` loops on a condition; `do...while` runs at least once. `break` exits the loop; `continue` skips the rest of this iteration.\n\nPrefer array methods over manual loops for readability: `forEach`, `map`, `filter`, `reduce`, `find`. `items.map(x => x * 2)` returns a new array — this style dominates modern code.',
        code: 'for (let i = 0; i < 3; i++) console.log(i);       // 0 1 2\n\nconst nums = [1, 2, 3];\nfor (const n of nums) console.log(n);           // 1 2 3\n\nconst doubled = nums.map((n) => n * 2);          // [2,4,6]\nconst big = nums.filter((n) => n > 1);           // [2,3]\nconst sum = nums.reduce((acc, n) => acc + n, 0); // 6',
        note: 'Map/filter/reduce say what you want; a manual loop says how. The "what" version is shorter and harder to get wrong.',
      },
      {
        title: 'Functions & Arrow Functions',
        text: 'Functions package behavior. Classic form: `function add(a, b) { return a + b; }`. They are hoisted, so you can call them before their definition. Function expressions and arrow functions are not hoisted.\n\nArrow functions `const add = (a, b) => a + b;` are shorter and, crucially, do NOT bind their own `this` — they inherit the surrounding scope. That makes them the natural choice for callbacks and array methods.\n\nDefault parameters handle missing arguments: `function greet(name = "Guest")`. The `arguments` object exists in classic functions only; arrows have none. Always return intentionally — a missing return returns undefined.',
        code: 'function greet(name = "Guest") {\n  return `Hello, ${name}!`;\n}\n\nconst square = (x) => x * x;              // implicit return\nconst nums = [1, 2, 3];\nconst squares = nums.map(square);         // [1, 4, 9]\n\nsetTimeout(() => console.log("tick"), 1000);',
        note: 'Because arrows inherit this, they are the safest callback — a classic function inside a click handler would rebind this to the button.',
      },
      {
        title: 'Scope & Closures',
        text: 'Scope decides which variables a name refers to. `let`/`const` are block-scoped — a variable declared inside `{}` is invisible outside. `var` is function-scoped, which caused many leaks. A nested function can read variables of its outer function — this combination (function + its surrounding scope) is a closure.\n\nClosures are why the same function can remember different values per call: a counter factory returns a function that increments its own private variable. That privacy is used everywhere in real code.\n\nHoisting: function declarations and `var` are hoisted (moved to the top); `let`/`const` are hoisted but stay in the temporal dead zone until their declaration runs.',
        code: 'function makeCounter() {\n  let count = 0;              // private to the closure\n  return () => ++count;\n}\n\nconst a = makeCounter();\nconst b = makeCounter();\na(); a();                     // 1, 2\nb();                          // 1 — separate private state\n\nfunction outer() {\n  const x = 10;\n  return () => x * 2;         // closure remembers x\n}',
        note: 'A closure is just a function that keeps the variables of its defining scope alive — even after the outer function returns.',
      },
    ],
    quizzes: [
      { text: 'Which comparison avoids type coercion surprises?', options: ['==', '===', '=', '<=>'], correctAnswer: '===' },
      { text: '`const shown = count ?? 10;` with count = 0 gives…', options: ['10', '0', 'undefined', 'an error'], correctAnswer: '0' },
      { text: '`[1,2,3].map(n => n * 2)` returns…', options: ['[2,4,6]', '[1,2,3]', '6', '[]'], correctAnswer: '[2,4,6]' },
      { text: 'An arrow function does NOT…', options: ['return values', 'bind its own this', 'take parameters', 'be stored in a variable'], correctAnswer: 'bind its own this' },
    ],
  },

  // ── W3 · Arrays, Objects & the DOM ──────────────────────────────────────
  {
    week: 3,
    title: 'Arrays, Objects & the DOM',
    description: 'The data structures of JS and the first touch of the page through the DOM.',
    topics: [
      {
        title: 'Arrays & Array Methods',
        text: 'Arrays are ordered lists: `const items = [1, 2, 3]`. They are objects under the hood, so `typeof []` is "object". Indexing starts at 0; `length` gives the count. Arrays can hold mixed types.\n\nThe modern toolkit: `push`/`pop` (end), `unshift`/`shift` (front), `indexOf`/`includes` (search), `join` (string), `sort` (in place — beware it sorts strings by default). The functional trio `map`/`filter`/`reduce` transforms data without mutating.\n\n`slice(a, b)` copies a subarray without changing the original; `splice(i, n)` mutates by removing/inserting. Destructuring unpacks: `const [first, second] = items;`.',
        code: 'const items = [3, 1, 2];\nitems.sort();                        // [1, 2, 3] (string sort)\n[10, 2].sort();                     // [10, 2] — string sort surprise!\n\nconst nums = [1, 2, 3, 4];\nconst evens = nums.filter((n) => n % 2 === 0);   // [2, 4]\nconst [first, ...rest] = nums;     // first=1, rest=[2,3,4]\nnums.includes(3);                   // true',
        note: 'Array.sort() converts to strings first — for numbers pass a comparator: nums.sort((a, b) => a - b).',
      },
      {
        title: 'Objects & Destructuring',
        text: 'Objects map keys to values: `const user = { name: "Aisha", role: "student" }`. Access with dot (`user.name`) or bracket (`user["name"]`, needed for dynamic keys). Keys are strings; values can be any type including nested objects and functions (methods).\n\nDestructuring pulls values out cleanly: `const { name, role } = user;` — no repetitive `user.xxx`. Renaming: `const { name: userName } = user;`. Defaults: `const { age = 18 } = user;`.\n\nThe shorthand `{ name, role }` builds an object from variables. `Object.keys`, `Object.values` and `Object.entries` iterate objects. Use optional chaining `user?.profile?.bio` to avoid "cannot read of undefined" crashes.',
        code: 'const user = { name: "Aisha", role: "student", marks: { js: 85 } };\nconst { name, marks: { js } } = user;   // name="Aisha", js=85\n\nconst role = "admin";\nconst account = { name, role };         // shorthand\n\nconst city = user?.address?.city;       // undefined, no crash\nObject.entries(user).forEach(([k, v]) => console.log(k, v));',
        note: 'Optional chaining (?.) and destructuring turn defensive "if (a && a.b)" code into one clean expression.',
      },
      {
        title: 'Spread, Rest & the Modern Toolkit',
        text: 'Spread `...` copies arrays and objects into new ones: `const copy = [...items]` or `const merged = { ...a, ...b }`. This is the idiomatic way to create immutable updates — instead of mutating, build a new value. `const withNew = [...items, 4]`.\n\nRest `...` collects remaining values: in a function `function sum(...nums)`, or destructuring `const [head, ...tail] = items`. Spread spreads OUT; rest collects IN — same symbol, opposite jobs.\n\nThe modern toolkit also includes `Object.fromEntries`, `Array.from`, `new Set([...])` for uniqueness and `new Map()` for keyed data. These read like the data operations they perform.',
        code: 'const a = [1, 2];\nconst b = [3, 4];\nconst all = [...a, ...b];          // [1,2,3,4]\n\nconst user = { name: "A" };\nconst updated = { ...user, role: "admin" };  // new object, user unchanged\n\nfunction sum(...nums) { return nums.reduce((t, n) => t + n, 0); }\nsum(1, 2, 3);                      // 6',
        note: 'Treat state as immutable: spread to change it, never mutate in place. This is the mental model behind React and modern frameworks.',
      },
      {
        title: 'The DOM — Selecting & Modifying Elements',
        text: 'The DOM (Document Object Model) is the browser\'s live tree of your HTML. JavaScript reads and changes it. Select elements: `document.querySelector(".card")` (first match, any selector) and `querySelectorAll` (all matches as a NodeList).\n\nChange content: `el.textContent = "New text"` (safe — no HTML parsing) and `el.innerHTML = "<b>hi</b>"` (parses HTML — use only with trusted input). Change styles via `el.style.color = "red"`, classes via `el.classList.add/remove/toggle`. Create elements with `document.createElement` and attach with `appendChild`.\n\nNodeList from querySelectorAll is array-like — spread it to use array methods: `[...document.querySelectorAll(".x")].forEach(...)`.',
        code: 'const heading = document.querySelector("h1");\nheading.textContent = "Dashboard";\nheading.classList.add("active");\n\nconst cards = [...document.querySelectorAll(".card")];\ncards.forEach((card) => (card.style.borderColor = "teal"));\n\nconst li = document.createElement("li");\nli.textContent = "New item";\ndocument.querySelector("ul").appendChild(li);',
        note: 'textContent is the safe default; innerHTML only with content you fully control to avoid XSS.',
      },
    ],
    quizzes: [
      { text: 'Which method returns a NEW array with each item transformed?', options: ['forEach', 'map', 'push', 'sort'], correctAnswer: 'map' },
      { text: '`const { name } = user;` is called…', options: ['spreading', 'destructuring', 'looping', 'mapping'], correctAnswer: 'destructuring' },
      { text: '`[...items, 4]` creates…', options: ['a mutated items', 'a new array with 4 appended (items unchanged)', 'an error', 'a string'], correctAnswer: 'a new array with 4 appended (items unchanged)' },
      { text: 'Which selector returns the first matching element?', options: ['querySelectorAll', 'querySelector', 'getElementsById', 'selectFirst'], correctAnswer: 'querySelector' },
    ],
  },

  // ── W4 · Events & Async JavaScript ──────────────────────────────────────
  {
    week: 4,
    title: 'Events & Async JavaScript',
    description: 'Event listeners, forms, and the async patterns that fetch data without freezing the page.',
    topics: [
      {
        title: 'Events & Event Listeners',
        text: 'User actions — clicks, typing, scrolling — fire events. `addEventListener("click", handler)` registers a handler that runs when the event fires. It keeps your HTML clean (no onclick="..." attributes) and allows multiple handlers on one element.\n\nThe handler receives an `event` object: `event.target` is the element that fired it, `event.preventDefault()` stops the default (e.g., form submit reload), `event.stopPropagation()` stops bubbling up. Events bubble from the target up through parents — that is why delegation works: listen once on a parent and inspect `event.target`.\n\nRemove a listener when it is no longer needed: `el.removeEventListener("click", handler)` — which requires the handler be a named function, not an inline arrow.',
        code: 'const btn = document.querySelector("#save");\nbtn.addEventListener("click", (event) => {\n  event.preventDefault();\n  console.log("Saved", event.target);\n});\n\n// Delegation: one listener for many buttons\nconst list = document.querySelector("ul");\nlist.addEventListener("click", (e) => {\n  if (e.target.tagName === "LI") e.target.classList.toggle("done");\n});',
        note: 'Event delegation (one listener on a parent) is how you handle dynamic lists — new items work with no extra wiring.',
      },
      {
        title: 'Forms & Validation',
        text: 'Forms capture input. Prevent the default submit so the page does not reload, then read values: `new FormData(form)` gives entries; `form.elements.name.value` reads a named input. Controlled validation: check each field, show an error message, and only submit when everything is valid.\n\nBrowser-native validation with `required`, `min`, `max`, `pattern` and `type="email"` catches mistakes before JS — but you still validate on submit because native constraints are easily bypassed.\n\nCommon helpers: `input.value.trim()` for required text, `input.checkValidity()` for native rules, and `event.target.reportValidity()` to surface them.',
        code: 'const form = document.querySelector("#signup");\nform.addEventListener("submit", (event) => {\n  event.preventDefault();\n  const data = new FormData(form);\n  const email = data.get("email").trim();\n  if (!email.includes("@")) {\n    document.querySelector("#err").textContent = "Enter a valid email";\n    return;\n  }\n  console.log("Submitting", email);\n});',
        note: 'Never trust the browser or the user: validate on the server too. Frontend validation is for UX; backend validation is for safety.',
      },
      {
        title: 'Promises & async/await',
        text: 'Many operations — network calls, timers, file reads — finish later. A Promise represents that future value: pending, then fulfilled or rejected. `fetch(url)` returns a promise.\n\nChain with `.then(value => ...)` and catch errors with `.catch(err => ...)`. Cleaner: `async function` + `await`. `await` pauses the async function until the promise settles, then yields its value. Code reads top-to-bottom like synchronous code.\n\nError handling in async: wrap in try/catch. `Promise.all([p1, p2])` runs promises in parallel and resolves when all settle. A promise that never settles is a silent hang — time out your fetches with AbortController.',
        code: 'async function loadUser(id) {\n  try {\n    const res = await fetch(`/api/users/${id}`);\n    if (!res.ok) throw new Error(`HTTP ${res.status}`);\n    return await res.json();\n  } catch (err) {\n    console.error("Failed to load", err);\n    return null;\n  }\n}\n\nconst [a, b] = await Promise.all([loadUser(1), loadUser(2)]);',
        note: 'await only works inside an async function. A rejected promise you do not catch becomes an unhandled rejection — always handle errors.',
      },
      {
        title: 'Fetch & Working with APIs',
        text: '`fetch(url)` sends an HTTP request and returns a promise of the response. Default is GET; pass `{ method: "POST", headers, body }` for others. The body must be a string — use `JSON.stringify(data)` to send, and parse the reply with `res.json()`.\n\nCheck `res.ok` (200-299) — fetch does NOT reject on HTTP errors, only on network failure. That is a classic bug: a 404 still resolves the promise.\n\nRead query params and build URLs with `URL`/`URLSearchParams`. Set the `Content-Type: application/json` header when sending JSON so the server parses it. Loading states: track `loading`, `error` and `data` yourself — show skeletons, not blank screens.',
        code: 'const res = await fetch("/api/courses", {\n  method: "POST",\n  headers: { "Content-Type": "application/json" },\n  body: JSON.stringify({ title: "New Course" }),\n});\nif (!res.ok) throw new Error(`Failed: ${res.status}`);\nconst created = await res.json();',
        note: 'Treat fetch as: check res.ok → parse body → update state. Forgetting res.ok is the single most common fetch bug.',
      },
    ],
    quizzes: [
      { text: 'To stop a form submit from reloading the page, call…', options: ['event.stop()', 'event.preventDefault()', 'event.return(false)', 'return false only'], correctAnswer: 'event.preventDefault()' },
      { text: 'The `await` keyword is only valid inside…', options: ['a loop', 'an async function', 'a class', 'any function'], correctAnswer: 'an async function' },
      { text: 'fetch() rejects its promise on…', options: ['HTTP 404 responses', 'network failure only', 'every error', 'bad JSON always'], correctAnswer: 'network failure only' },
      { text: '`Promise.all([p1, p2])` resolves when…', options: ['p1 resolves', 'p2 resolves', 'both resolve (or any rejects)', 'the last timer fires'], correctAnswer: 'both resolve (or any rejects)' },
    ],
  },

  // ── W5 · Putting It Together ─────────────────────────────────────────────
  {
    week: 5,
    title: 'Putting It Together — Project & Next Steps',
    description: 'Debugging, modules, a real quiz-app project, and the road to TypeScript and frameworks.',
    topics: [
      {
        title: 'Debugging with DevTools',
        text: 'The browser DevTools are your microscope. Console tab: `console.log` traces, `console.error` marks problems. Sources tab: set breakpoints — click a line number, reload, and the script pauses so you can inspect every variable and step through.\n\nThe Elements tab shows the live DOM and lets you edit styles on the fly to test layout. The Network tab shows every request: status, timing, payloads — essential for debugging fetch calls.\n\nDebugger discipline: reproduce the bug, isolate the smallest input, inspect state at the failure point, form a hypothesis, fix, then re-test. The debugger (step over/into) beats a wall of console.logs for logic bugs.',
        code: 'function calculateTotal(items) {\n  debugger;            // pauses here in Sources when DevTools is open\n  return items.reduce((t, i) => t + i.price * i.qty, 0);\n}',
        note: 'If you can step through the exact lines where the data looks wrong, you will find the bug in minutes instead of hours.',
      },
      {
        title: 'Modules — import/export',
        text: 'Modules split code into files. Export a binding with `export` (named) or `export default` (the main thing). Import with `import { name } from "./path.js"` or `import thing from "./path.js"`.\n\nModule scope is file scope: everything not exported is private. This is real encapsulation — no more global variables colliding. Relative imports need the `.js` extension in browser module scripts.\n\nLoad modules with `<script type="module" src="main.js">` — modules are deferred, strict and run once. This structure — small focused files each exporting a clear API — is the foundation of every real frontend project.',
        code: '// utils.js\nexport const formatPrice = (n) => `₹${n}`;\nexport default function sum(a, b) { return a + b; }\n\n// main.js\nimport sum, { formatPrice } from "./utils.js";\nconsole.log(sum(2, 3), formatPrice(499));',
        note: 'One clear responsibility per module file — the same rule as small functions, one level up.',
      },
      {
        title: 'Mini Project — Interactive Quiz App',
        text: 'Build a quiz app that reads questions from a data array, shows one at a time, tracks the score and reveals the result. This pulls in every skill: arrays and objects for questions, functions for the logic, DOM selection and events for the UI, and template literals for rendering.\n\nPlan: (1) a `questions` array of objects `{ q, options, answer }`; (2) a `renderQuestion(i)` that fills the DOM; (3) a click listener that checks the answer, updates `score`, and advances or ends the quiz; (4) a result screen.\n\nStart with two questions hardcoded, get the flow working, then load from a larger array. Keep the render and the logic separate so you can test each.',
        code: 'const questions = [\n  { q: "2 + 2?", options: ["3", "4", "5", "6"], answer: "4" },\n  { q: "What color is the sky?", options: ["Blue", "Green", "Red", "Yellow"], answer: "Blue" },\n];\n\nfunction render(i) {\n  const q = questions[i];\n  document.querySelector("#question").textContent = q.q;\n  document.querySelector("#options").innerHTML = q.options\n    .map((o) => `<button class="opt">${o}</button>`)\n    .join("");\n}',
        note: 'A working 2-question quiz you fully understand beats a 20-question one you copied. Build up from the smallest loop.',
      },
      {
        title: 'Next Steps — TypeScript & Frameworks',
        text: 'You now understand the language; production teams then add guardrails and structure. TypeScript adds static types on top of JavaScript — it catches typos and wrong shapes at compile time and is the default for serious projects. The types you write are the documentation that never goes stale.\n\nFrameworks layer patterns over the DOM: React (components + a virtual DOM), Vue and Svelte. They make UI state predictable — instead of manual `querySelector` and `textContent` wiring, you describe the UI for a given state and the framework updates it.\n\nPath forward: build one more vanilla project with modules, then learn TypeScript on your existing code, then one framework. The JS you learned here — async, closures, immutability — is exactly what React and Node expect.',
        code: '// TypeScript adds types that catch mistakes before runtime\nfunction formatPrice(n: number): string {\n  return `₹${n}`;\n}\nformatPrice(499);       // ok\nformatPrice("499");     // compile error — caught early',
        note: 'Vanilla JS teaches the web; TypeScript + a framework teaches the team. Do the vanilla first — it makes the frameworks obvious.',
      },
    ],
    quizzes: [
      { text: 'In DevTools, breakpoints pause execution in the…', options: ['Console tab', 'Sources tab', 'Network tab', 'Elements tab'], correctAnswer: 'Sources tab' },
      { text: '`export default function sum(){}` is imported with…', options: ['import { sum }', 'import sum', 'import * as sum', 'require(sum)'], correctAnswer: 'import sum' },
      { text: 'In the quiz app, the click listener is responsible for…', options: ['styling the page', 'checking the answer and advancing/ending the quiz', 'compiling JS', 'fetching CSS'], correctAnswer: 'checking the answer and advancing/ending the quiz' },
      { text: 'TypeScript adds to JavaScript…', options: ['new runtime features', 'static types that catch errors at compile time', 'a database', 'CSS support'], correctAnswer: 'static types that catch errors at compile time' },
    ],
  },
];
