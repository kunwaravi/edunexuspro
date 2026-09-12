/**
 * React — Build Modern Interfaces — Task 5 starter curriculum.
 * 5 modules × 4 topics, per-topic quizzes in react_topic_quizzes.ts,
 * plus a 4-question chapter quiz per module.
 */
import type { Section } from './types';

export const SECTIONS: Section[] = [
  // ── W1 · React Foundations ───────────────────────────────────────────────
  {
    week: 1,
    title: 'React Foundations',
    description: 'Why React exists, how components and JSX work, and the props that make components reusable.',
    topics: [
      {
        title: 'What React Is & How It Thinks',
        text: 'React is a JavaScript library for building user interfaces. Its core idea: you describe the UI for a given state, and React keeps the DOM in sync when state changes — you never hand-edit the DOM.\n\nReact is component-based: a page is a tree of components. A component is a function returning JSX, the declarative syntax that mixes markup with logic.\n\nReact 18/19 uses hooks to manage state and side effects. Unlike jQuery-style code that says "find this element and change it", React says "here is what the screen should show" — and React figures out the rest.',
        code: 'function App() {\n  return (\n    <div>\n      <Header />\n      <Main />\n    </div>\n  );\n}\n\nconst root = createRoot(document.getElementById("root"));\nroot.render(<App />);',
        note: 'Declarative, not imperative: describe the target screen; React handles the DOM surgery.',
      },
      {
        title: 'Components & the Component Tree',
        text: 'A component is a function that returns JSX. Name components in PascalCase (Header, Card). One component per responsibility, and components call other components to build a tree.\n\nComposition is the React way to reuse: build small pieces (Button, Card, Input) and combine them into pages. If a component grows past ~100 lines or does two jobs, split it.\n\nWhere a component lives decides its reusability: keep the generic pieces (buttons, inputs) independent so any page can use them.',
        code: 'function Greeting({ name }) {\n  return <p>Hello, {name}!</p>;\n}\n\nfunction Dashboard() {\n  return (\n    <section>\n      <h1>Dashboard</h1>\n      <Greeting name="Aisha" />\n      <StatCard label="Revenue" value="₹45,000" />\n    </section>\n  );\n}',
        note: 'PascalCase names, one job per component, compose small pieces. That is the whole component discipline.',
      },
      {
        title: 'JSX — Markup in JavaScript',
        text: 'JSX looks like HTML but is JavaScript: every tag compiles to a createElement call. Rules: return a single root (or use a fragment <>...</>), use className instead of class, and embed values with { }.\n\nComments in JSX go inside braces: {/* a comment */}. Inline styles are objects: style={{ color: "red" }}. Attribute names are camelCase (onClick, htmlFor).\n\nJSX escapes values by default — inserting {userInput} renders text, not HTML, which is your first line of XSS defense. It is optional (React works without JSX) but universal in practice.',
        code: 'export default function Profile() {\n  const name = "Avinash";\n  return (\n    <div className="profile">\n      {/* JSX comment */}\n      <h2>Hi, {name}</h2>\n      <button onClick={() => alert("Clicked")}>Go</button>\n    </div>\n  );\n}',
        note: 'className not class, { } for expressions, camelCase attributes. JSX escapes — never use dangerouslySetInnerHTML casually.',
      },
      {
        title: 'Props — Passing Data Down',
        text: 'Props (properties) are how a parent passes data to a child — read-only inputs, like function arguments. A child receives them as an object: function Card({ title, price }).\n\nData flows one way: down the tree. To change data, a parent passes a callback via props (onSave, onDelete), and the child calls it with new values — the state lives in the parent.\n\nDestructure props for readable code. Give components sensible defaults (defaultProps or destructuring defaults). The rule: children never mutate props; they report changes upward.',
        code: 'function Card({ title, price, onAdd }) {\n  return (\n    <div className="card">\n      <h3>{title}</h3>\n      <p>₹{price}</p>\n      <button onClick={() => onAdd(title)}>Add</button>\n    </div>\n  );\n}\n\n<Card title="DSA" price={799} onAdd={handleAdd} />',
        note: 'Props flow down, callbacks flow up. One-way data flow is what makes React apps predictable.',
      },
    ],
    quizzes: [
      { text: 'React is best described as…', options: ['a database', 'a JavaScript library for building user interfaces', 'a CSS framework', 'a bundler'], correctAnswer: 'a JavaScript library for building user interfaces' },
      { text: 'A component is…', options: ['a function that returns JSX', 'an HTML file', 'a style sheet', 'a server'], correctAnswer: 'a function that returns JSX' },
      { text: 'In JSX, the HTML attribute class is written as…', options: ['class', 'className', 'class-name', 'cssClass'], correctAnswer: 'className' },
      { text: 'Props are…', options: ['read-only inputs passed from parent to child', 'local mutable data', 'global variables', 'CSS classes'], correctAnswer: 'read-only inputs passed from parent to child' },
    ],
  },

  // ── W2 · State & Events ──────────────────────────────────────────────────
  {
    week: 2,
    title: 'State & Events',
    description: 'useState, events, forms and conditional rendering — making components interactive.',
    topics: [
      {
        title: 'useState — Memory for Components',
        text: 'State is a component\'s memory — data that changes over time and re-renders the component when it changes. useState returns [value, setValue]: const [count, setCount] = useState(0).\n\nNever mutate state directly — always use the setter. If you need the new value based on the old, use the updater form: setCount(c => c + 1).\n\nState is per-component-instance: two counters have independent counts. State changes trigger a re-render of that component and its children.',
        code: 'function Counter() {\n  const [count, setCount] = useState(0);\n  return (\n    <div>\n      <p>Count: {count}</p>\n      <button onClick={() => setCount(count + 1)}>+1</button>\n      <button onClick={() => setCount(c => c + 5)}>+5</button>\n    </div>\n  );\n}',
        note: 'Set, don\'t mutate. And prefer the updater form (setCount(c => c + 1)) when the new value depends on the old.',
      },
      {
        title: 'Events: onClick, onChange & Handlers',
        text: 'React events are camelCase: onClick, onChange, onSubmit. Handlers are functions passed to the attribute — not calls: onClick={handleClick}, never onClick={handleClick()}.\n\nThe event object gives details: e.target.value on inputs, e.preventDefault() in forms. For arguments, pass a function that calls your handler: onClick={() => handleDelete(item.id)}.\n\nInline arrows are fine for small handlers; extract named functions when a handler is more than a line or two.',
        code: 'function SearchBox() {\n  const [q, setQ] = useState("");\n  const handleSubmit = (e) => {\n    e.preventDefault();\n    console.log("Searching for", q);\n  };\n  return (\n    <form onSubmit={handleSubmit}>\n      <input value={q} onChange={(e) => setQ(e.target.value)} />\n      <button type="submit">Search</button>\n    </form>\n  );\n}',
        note: 'onClick={handleClick} not onClick={handleClick()}. The first passes the function; the second runs it immediately.',
      },
      {
        title: 'Forms & Controlled Inputs',
        text: 'In React, form inputs are usually controlled: the input value comes from state, and onChange updates it. value={q} onChange={(e) => setQ(e.target.value)} — one source of truth.\n\nText, textarea, select and checkbox all follow the same pattern. Radio groups: one state, each radio checked={value === choice}.\n\nWhy controlled inputs? Validation, formatting and submission all read from state, and you can pre-fill. For very long forms, libraries (react-hook-form) help, but the controlled pattern is the foundation.',
        code: 'function SignupForm() {\n  const [form, setForm] = useState({ name: "", email: "" });\n  const update = (field) => (e) =>\n    setForm({ ...form, [field]: e.target.value });\n  return (\n    <form onSubmit={(e) => { e.preventDefault(); submit(form); }}>\n      <input value={form.name} onChange={update("name")} placeholder="Name" />\n      <input value={form.email} onChange={update("email")} placeholder="Email" />\n      <button type="submit">Create account</button>\n    </form>\n  );\n}',
        note: 'One state object + one updater per field. Controlled inputs are predictable — value always equals state.',
      },
      {
        title: 'Conditional Rendering & Lists',
        text: 'Render different UI based on state: {isLoggedIn ? <Dashboard /> : <Login />}. The && shortcut shows a thing only when true: {unread > 0 && <span>New!</span>}. Match boolean logic to render options.\n\nLists: map over an array — items.map(item => <li key={item.id}>{item.name}</li>). The key must be a stable unique value per item (an id, not the index for reorderable lists) — keys let React track items efficiently.\n\nFilter first, then map: items.filter(i => i.stock > 0).map(...). For empty results, render a friendly "nothing found" state.',
        code: 'function ProductList({ products }) {\n  if (!products.length) return <p>No products match.</p>;\n  return (\n    <ul>\n      {products\n        .filter((p) => p.inStock)\n        .map((p) => <li key={p.id}>{p.name} — ₹{p.price}</li>)}\n    </ul>\n  );\n}',
        note: 'Filter, then map, with a key from a real id, and an empty-state message. That is 90% of list rendering.',
      },
    ],
    quizzes: [
      { text: 'To update count in setCount(count + 1) style safely, prefer…', options: ['setCount(c => c + 1)', 'count = count + 1', 'count++', 'setCount()'], correctAnswer: 'setCount(c => c + 1)' },
      { text: 'The correct event usage is…', options: ['onClick={handleClick()}', 'onClick={handleClick}', 'onclick={handleClick}', 'onClick="handleClick"'], correctAnswer: 'onClick={handleClick}' },
      { text: 'A controlled input\'s value comes from…', options: ['the DOM', 'state, updated via onChange', 'a global variable', 'localStorage'], correctAnswer: 'state, updated via onChange' },
      { text: 'A list item\'s key should be…', options: ['the array index always', 'a stable unique value like an id', 'the item text', 'a random number'], correctAnswer: 'a stable unique value like an id' },
    ],
  },

  // ── W3 · Effects & Data ──────────────────────────────────────────────────
  {
    week: 3,
    title: 'Effects & Data',
    description: 'useEffect, fetching from APIs, and the loading/error states every real app needs.',
    topics: [
      {
        title: 'useEffect — Side Effects',
        text: 'Effects run after render for things React can\'t handle in render: fetching data, timers, subscriptions, reading from storage. useEffect(() => { ... }, [dependencies]).\n\nWith an empty dependency array, the effect runs once after the first render. With dependencies, it runs again when they change. A cleanup function (return () => ...) runs before the next effect and on unmount — cancel timers and subscriptions there.\n\nModern React: not every re-render needs an effect. Fetching on mount is the classic case. SetState inside effects can loop — the dependency array must be stable.',
        code: 'useEffect(() => {\n  const id = setInterval(() => tick(), 1000);\n  return () => clearInterval(id);  // cleanup on unmount\n}, []);\n\nuseEffect(() => {\n  // re-fetch when userId changes\n  loadUser(userId);\n}, [userId]);',
        note: 'Dependencies decide when the effect runs; cleanup prevents leaks. An effect that never cleans up a timer will haunt your app.',
      },
      {
        title: 'Fetching Data with fetch & async/await',
        text: 'The data pattern: run fetch in an effect, store results in state. Guard against race conditions by ignoring stale responses when the request is superseded.\n\nA reusable shape:\nuseEffect(() => {\n  let cancelled = false;\n  fetch(url).then(res => res.json())\n    .then(data => { if (!cancelled) setData(data); })\n    .catch(err => { if (!cancelled) setError(err); })\n    .finally(() => { if (!cancelled) setLoading(false); });\n  return () => { cancelled = true; };\n}, [url]);\n\nThe cancelled flag stops old responses from overwriting new state when the effect re-runs.',
        code: 'function Products() {\n  const [data, setData] = useState(null);\n  const [loading, setLoading] = useState(true);\n  const [error, setError] = useState(null);\n\n  useEffect(() => {\n    let cancelled = false;\n    fetch("/api/products")\n      .then((r) => { if (!r.ok) throw new Error("Request failed"); return r.json(); })\n      .then((d) => !cancelled && setData(d))\n      .catch((e) => !cancelled && setError(e))\n      .finally(() => !cancelled && setLoading(false));\n    return () => { cancelled = true; };\n  }, []);\n\n  if (loading) return <p>Loading…</p>;\n  if (error) return <p>Error: {error.message}</p>;\n  return <ul>{data.map((p) => <li key={p.id}>{p.name}</li>)}</ul>;\n}',
        note: 'loading, error, data — three states, three renders. That is the entire fetch pattern; skip none of them.',
      },
      {
        title: 'Custom Hooks — Reusable Logic',
        text: 'A custom hook is a function starting with use that uses other hooks. It extracts reusable logic: useFetch(url), useLocalStorage(key), useWindowSize().\n\nRule: custom hooks follow the same Rules of Hooks — called at the top level, never conditionally, from React components or other hooks.\n\nExtract when you repeat the same logic in two components. Custom hooks make fetching, form handling and timers one-liners across the app.',
        code: 'function useFetch(url) {\n  const [data, setData] = useState(null);\n  const [loading, setLoading] = useState(true);\n  const [error, setError] = useState(null);\n  useEffect(() => {\n    let cancelled = false;\n    setLoading(true);\n    fetch(url)\n      .then((r) => r.json())\n      .then((d) => !cancelled && setData(d))\n      .catch((e) => !cancelled && setError(e))\n      .finally(() => !cancelled && setLoading(false));\n    return () => { cancelled = true; };\n  }, [url]);\n  return { data, loading, error };\n}\n\n// in a component:\nconst { data, loading, error } = useFetch("/api/courses");',
        note: 'use at the top, return a small object, and suddenly "fetch something" is one line anywhere.',
      },
      {
        title: 'Context — Sharing State Without Prop Drilling',
        text: 'When many components need the same data (theme, logged-in user), prop drilling gets painful. Context shares state without passing it through every level.\n\nThree parts: createContext, a Provider that holds the value, and useContext to read it. Wrap the app (or a subtree) in the provider, then any descendant reads the value.\n\nContext replaces prop drilling, not state management: it is for app-wide settings, not for every piece of data. React 19 can render context directly as a provider, but the pattern is the same.',
        code: 'const ThemeContext = createContext("light");\n\nfunction App() {\n  return (\n    <ThemeContext.Provider value="dark">\n      <Toolbar />   {/* reads it anywhere below */}\n    </ThemeContext.Provider>\n  );\n}\n\nfunction Toolbar() {\n  const theme = useContext(ThemeContext);\n  return <div className={`theme-${theme}`}>…</div>;\n}',
        note: 'Context for global-ish state (theme, user, locale); props and lifting state for local data. Use it deliberately.',
      },
    ],
    quizzes: [
      { text: 'An effect with [] as dependencies runs…', options: ['every render', 'once after the first render', 'never', 'on every click'], correctAnswer: 'once after the first render' },
      { text: 'The cleanup function in an effect…', options: ['cleans up timers/subscriptions before the next run and on unmount', 'deletes state', 'returns data', 'is optional always'], correctAnswer: 'cleans up timers/subscriptions before the next run and on unmount' },
      { text: 'The three fetch states every component should track are…', options: ['loading, error, data', 'start, pause, stop', 'input, output, process', 'red, green, blue'], correctAnswer: 'loading, error, data' },
      { text: 'A custom hook is…', options: ['a function starting with use that uses other hooks', 'a component returning JSX', 'a CSS class', 'a database query'], correctAnswer: 'a function starting with use that uses other hooks' },
    ],
  },

  // ── W4 · Routing & Composition ───────────────────────────────────────────
  {
    week: 4,
    title: 'Routing & Composition',
    description: 'Multi-page apps with React Router, composition patterns, styling and state lifting.',
    topics: [
      {
        title: 'React Router — Multiple Pages',
        text: 'React Router turns a single-page app into a multi-page experience without page reloads. BrowserRouter wraps the app; Routes matches a URL path to a Route; the matched component renders in place.\n\nNav links use Link (or NavLink with active styling) — not <a href>, which reloads. useParams reads URL variables (:id), useNavigate navigates programmatically.\n\nLayouts: nest routes so a <Layout> with header/footer wraps its child pages via <Outlet />.',
        code: '// App.jsx\n<BrowserRouter>\n  <Routes>\n    <Route path="/" element={<Home />} />\n    <Route path="/courses" element={<Courses />} />\n    <Route path="/course/:id" element={<CourseDetail />} />\n    <Route path="*" element={<NotFound />} />\n  </Routes>\n</BrowserRouter>\n\n// inside a page\nconst { id } = useParams();          // :id from the URL\n<Link to={`/course/${id}`}>Details</Link>\n<button onClick={() => navigate(-1)}>Back</button>',
        note: 'Link not <a>, Routes/Route for matching, useParams for dynamic segments. The catch-all "*" route is for 404s.',
      },
      {
        title: 'Lifting State Up & Thinking in React',
        text: 'When two sibling components need the same data, the data must live in their closest common parent — lifting state up. The parent owns the state and passes value + updater down.\n\nThink in React: start from a static mock, find the pieces that change, choose where state lives, add data flow. If a component renders different things for the same props, it is stateful — the state must be lifted.\n\nControlled patterns: input state in the parent, filter state in the parent, selected item in the parent. The higher state lives, the more it can be shared — but keep it as low as needed.',
        code: 'function App() {\n  const [query, setQuery] = useState("");\n  return (\n    <div>\n      <SearchBar query={query} onChange={setQuery} />\n      <Results query={query} />\n    </div>\n  );\n}\n// SearchBar calls onChange; Results reads query. State lives in App.}',
        note: 'Find the component that needs the data and the component that changes it — state lives in their lowest common parent.',
      },
      {
        title: 'Styling React Components',
        text: 'Styling options: plain CSS files imported into components (import "./card.css"), CSS Modules (scoped class names), inline styles for dynamic values, and utility-first CSS with Tailwind — the industry\'s current default.\n\nKeep styling consistent: one approach per project. A styled button should be a Button component, not ten inline styles repeated.\n\nDynamic styles: className={isActive ? "tab active" : "tab"} or conditional template strings. Libraries (styled-components, CSS-in-JS) exist but are optional — Tailwind or CSS Modules cover most projects.',
        code: 'import "./card.css";\n\nfunction Card({ title, active }) {\n  return (\n    <div className={`card ${active ? "card--active" : ""}`}>\n      <h3>{title}</h3>\n    </div>\n  );\n}\n\n/* card.css */\n.card { border: 1px solid #ddd; padding: 16px; border-radius: 8px; }\n.card--active { border-color: #2563eb; box-shadow: 0 2px 8px rgba(37,99,235,.2); }',
        note: 'Pick one styling approach per project. The className with a state variant is the pattern to master.',
      },
      {
        title: 'Composition vs Props — Flexible Components',
        text: 'Props pass data; children pass structure. A component can render whatever is placed between its tags: <Card><p>Any content</p></Card> — Card renders {children}.\n\nComposition beats prop-drilling for layout: a Modal doesn\'t need to know its content\'s shape — it just renders children. Slots pattern: pass children or named props for header/footer sections.\n\nGeneric + specific: build a generic Card that renders children, then specific cards that pass the right content. This keeps components small and the page tree readable.',
        code: 'function Card({ title, children }) {\n  return (\n    <div className="card">\n      {title && <h3>{title}</h3>}\n      {children}\n    </div>\n  );\n}\n\n<Card title="Order summary">\n  <p>2 items · ₹1,298</p>\n  <button>Checkout</button>\n</Card>',
        note: 'children lets one layout component serve infinite content. Compose first; only add props when children isn\'t enough.',
      },
    ],
    quizzes: [
      { text: 'For in-app navigation without reload, use…', options: ['<a href>', '<Link>', 'window.location', 'an iframe'], correctAnswer: '<Link>' },
      { text: 'The hook to read the :id URL parameter is…', options: ['useParams()', 'useState()', 'useRoute()', 'useEffect()'], correctAnswer: 'useParams()' },
      { text: 'When two siblings need the same data, you…', options: ['duplicate the data', 'lift state to their closest common parent', 'use a global variable', 'delete one sibling'], correctAnswer: 'lift state to their closest common parent' },
      { text: 'A component renders whatever is placed between its tags via…', options: ['{children}', '{props}', '{state}', '{children() and wait}'], correctAnswer: '{children}' },
    ],
  },

  // ── W5 · Building & Deploying ────────────────────────────────────────────
  {
    week: 5,
    title: 'Building & Deploying',
    description: 'Two complete projects, performance fundamentals, and shipping your app to the world.',
    topics: [
      {
        title: 'Project — A Todo/Task App',
        text: 'Build a task manager: add tasks, mark complete, delete, and filter (All/Active/Done). State: one array of {id, text, done} plus the filter. Lift it to App and pass handlers down.\n\nComponent tree: App (state) → TaskForm (add) → FilterBar (filter) → TaskList (map) → Task (toggle/delete). Add with a controlled input and a unique id (crypto.randomUUID()).\n\nNice-to-haves after the basics: persist to localStorage with a custom useLocalStorage hook, empty state ("You\'re all caught up!"), and counts per filter.',
        code: 'function App() {\n  const [tasks, setTasks] = useState([]);\n  const [filter, setFilter] = useState("all");\n\n  const addTask = (text) =>\n    setTasks([...tasks, { id: crypto.randomUUID(), text, done: false }]);\n  const toggle = (id) =>\n    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));\n  const visible = tasks.filter((t) =>\n    filter === "all" ? true : filter === "done" ? t.done : !t.done\n  );\n  // render TaskForm, FilterBar, TaskList with visible tasks\n}',
        note: 'One state array, four handlers, three components. Build it tiny first — add, then list — and extend.',
      },
      {
        title: 'Project — Fetch & Render an API List',
        text: 'Build a data-driven page: fetch a real API (e.g. a public JSON API or your backend), render a loading skeleton, handle errors, and display a searchable list.\n\nPattern: useFetch(url) custom hook → data/loading/error. A search input filters client-side; a dropdown sorts. Each item is a Card component with a stable key.\n\nPolish: retry button on error, empty results message, and cache the fetch (or at least not refetch on every keystroke). This is the exact shape of most production list pages.',
        code: 'function CourseBrowser() {\n  const { data, loading, error } = useFetch("/api/courses");\n  const [q, setQ] = useState("");\n  if (loading) return <SkeletonCards />;\n  if (error) return <button onClick={retry}>Retry</button>;\n  const filtered = (data || []).filter((c) =>\n    c.title.toLowerCase().includes(q.toLowerCase())\n  );\n  return (\n    <div>\n      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" />\n      {filtered.length === 0 ? <p>Nothing found</p> :\n        filtered.map((c) => <Card key={c.id} course={c} />)}\n    </div>\n  );\n}',
        note: 'Fetch → loading → error → filter → render. Every real list page is this, plus your domain details.',
      },
      {
        title: 'Performance & React Best Practices',
        text: 'React is fast by default; premature optimization is a trap. Measure first (React DevTools Profiler).\n\nWorthwhile habits: stable keys, batching state updates, extracting repeated JSX into components, and lazy-loading routes/components that are heavy (React.lazy + Suspense).\n\nCommon mistakes to avoid: giant effects with many setStates, key={index} on reorderable lists, mutating state objects, and creating new objects in render (unnecessary re-renders of memoized children). Keep components small and re-renders are usually a non-issue.',
        code: 'const HeavyChart = lazy(() => import("./HeavyChart"));\n\nfunction Dashboard() {\n  return (\n    <Suspense fallback={<p>Loading chart…</p>}>\n      <HeavyChart />\n    </Suspense>\n  );\n}',
        note: 'Profile before optimizing. Stable keys, small components, and lazy loading pay off; micro-memoization usually doesn\'t.',
      },
      {
        title: 'Building & Deploying to Production',
        text: 'A React app is source code until you build it: Vite (npm run build) bundles, minifies and emits static files into dist/. The build is what you deploy — a set of static HTML/CSS/JS.\n\nDeploy targets: Netlify, Vercel, GitHub Pages — each free tier supports a Vite build. The steps are usually: connect the repo, build command (npm run build), publish dist.\n\nProduction checklist: no console errors, lazy loading works, the 404 route is set, environment variables are configured, and the site passes Lighthouse (accessibility, performance, SEO). Deploy early; the URL is the real testing environment.',
        code: '// package.json\n"scripts": {\n  "dev": "vite",\n  "build": "vite build",\n  "preview": "vite preview"\n}\n\n// netlify.toml (example)\n[build]\n  command = "npm run build"\n  publish = "dist"',
        note: 'You develop in dev mode and deploy the build. A broken production build is normal once — read the build log, fix, rebuild.',
      },
    ],
    quizzes: [
      { text: 'For unique task ids in a browser, a quick reliable choice is…', options: ['crypto.randomUUID()', 'the array index', 'Math.random() alone', 'a timestamp'], correctAnswer: 'crypto.randomUUID()' },
      { text: 'The production build of a Vite app outputs to…', options: ['dist/', 'src/', 'node_modules/', 'public/'], correctAnswer: 'dist/' },
      { text: 'Heavy components can be loaded only when needed with…', options: ['React.lazy + Suspense', 'useState', 'a global variable', 'conditional props'], correctAnswer: 'React.lazy + Suspense' },
      { text: 'Before optimizing performance you should…', options: ['measure with the Profiler', 'add memo everywhere', 'rewrite the app', 'disable re-renders'], correctAnswer: 'measure with the Profiler' },
    ],
  },
];
