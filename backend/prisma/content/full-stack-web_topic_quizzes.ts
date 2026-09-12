/**
 * Full Stack Web Development — MERN Projects — per-topic quizzes.
 * Keyed by the EXACT topic titles in full-stack-web.ts (topic-lock flow).
 * 4 questions per topic, 4 options, 1 correct.
 * Distinct from the chapter-quiz texts in full-stack-web.ts.
 */
import type { TopicQuizMap } from './types';

export const TOPIC_QUIZZES: TopicQuizMap = {
  // ── W1 ───────────────────────────────────────────────────────────────────
  'Frontend, Backend & Database — The Big Picture': [
    { text: 'The frontend talks to the backend via…', options: ['HTTP requests to your API', 'SQL directly', 'the filesystem', 'email'], correctAnswer: 'HTTP requests to your API' },
    { text: 'The backend talks to the database via…', options: ['a query layer (e.g. Mongoose)', 'the browser', 'HTTP', 'the UI'], correctAnswer: 'a query layer (e.g. Mongoose)' },
    { text: 'Why split the three layers?', options: ['separation of concerns: presentation, rules and persistence', 'it is the only way', 'it saves memory', 'it is required by law'], correctAnswer: 'separation of concerns: presentation, rules and persistence' },
    { text: 'The frontend must NEVER…', options: ['talk to the database directly', 'render HTML', 'use JavaScript', 'send HTTP'], correctAnswer: 'talk to the database directly' },
  ],
  'The MERN Stack & Your Toolchain': [
    { text: 'MERN is…', options: ['MongoDB, Express, React, Node', 'MySQL, EJS, Rust, Next', 'Mongo, Electron, Redis, Nest', 'Material, Express, React, Nginx'], correctAnswer: 'MongoDB, Express, React, Node' },
    { text: 'The classic project layout is…', options: ['client/ (React) + server/ (Express) with own package.json each', 'one single package.json', 'a database folder', 'a static site'], correctAnswer: 'client/ (React) + server/ (Express) with own package.json each' },
    { text: 'npm create vite@latest scaffolds…', options: ['the React frontend', 'the backend', 'the database', 'the server'], correctAnswer: 'the React frontend' },
    { text: 'One language across all layers means…', options: ['one mental model for the whole product', 'no backend', 'no database', 'only Node code'], correctAnswer: 'one mental model for the whole product' },
  ],
  'Setting Up: Vite + Express + MongoDB': [
    { text: 'The backend framework is…', options: ['Express', 'React', 'Vite', 'Mongoose only'], correctAnswer: 'Express' },
    { text: 'The Express module that connects MongoDB is…', options: ['mongoose', 'cors', 'express.json', 'jwt'], correctAnswer: 'mongoose' },
    { text: 'The dev proxy in vite.config.js forwards…', options: ['/api to the backend port', 'the CSS', 'the database', 'npm'], correctAnswer: '/api to the backend port' },
    { text: 'The health-check milestone proves…', options: ['the whole stack is wired: browser → API → DB', 'the app is deployed', 'the CSS is loaded', 'npm works'], correctAnswer: 'the whole stack is wired: browser → API → DB' },
  ],
  'Project Planning — Think Before You Code': [
    { text: 'The four things to sketch before coding are…', options: ['features, data model, endpoints, screens', 'colors, fonts, images, icons', 'servers, domains, ports, SSL', 'only the logo'], correctAnswer: 'features, data model, endpoints, screens' },
    { text: 'Each feature maps to…', options: ['REST endpoints + a screen', 'a CSS class', 'a new server', 'a backup'], correctAnswer: 'REST endpoints + a screen' },
    { text: 'The recommended build order is…', options: ['one vertical slice first, then auth, then features', 'all screens first', 'the database first only', 'deploy first'], correctAnswer: 'one vertical slice first, then auth, then features' },
    { text: 'Scope discipline prevents…', options: ['unplanned bloat — a working 10% teaches more', 'any work at all', 'planning', 'mistakes'], correctAnswer: 'unplanned bloat — a working 10% teaches more' },
  ],

  // ── W2 ───────────────────────────────────────────────────────────────────
  'Component Architecture & State': [
    { text: 'The React app is structured as…', options: ['a tree: pages, layout, and reusable components', 'one file', 'a database', 'a server folder'], correctAnswer: 'a tree: pages, layout, and reusable components' },
    { text: 'App-wide data like the logged-in user belongs in…', options: ['Context', 'a local form state', 'a prop on every page', 'the DOM'], correctAnswer: 'Context' },
    { text: 'If a component needs data it was not passed, the data must…', options: ['live higher up and be passed down', 'be fetched again', 'be deleted', 'move to CSS'], correctAnswer: 'live higher up and be passed down' },
    { text: 'The single state rule is…', options: ['pages own data; components render it', 'every component fetches its own', 'state lives everywhere', 'state never changes'], correctAnswer: 'pages own data; components render it' },
  ],
  'Forms & Client-Side Validation': [
    { text: 'Controlled inputs mean…', options: ['state holds the field value, updated on change', 'the DOM owns the value', 'no state', 'reads only'], correctAnswer: 'state holds the field value, updated on change' },
    { text: 'Client-side validation is…', options: ['UX only — the server re-validates', 'the security layer', 'optional everywhere', 'impossible'], correctAnswer: 'UX only — the server re-validates' },
    { text: 'During submission the button should…', options: ['be disabled to prevent double-submits', 'stay clickable', 'disappear', 'reload'], correctAnswer: 'be disabled to prevent double-submits' },
    { text: 'On failure, a good form…', options: ['shows the API error inline and keeps the form', 'clears everything', 'redirects', 'crashes'], correctAnswer: 'shows the API error inline and keeps the form' },
  ],
  'API Calls from React': [
    { text: 'All API calls should go through…', options: ['one shared client that sets base URL, headers and error handling', 'direct fetch scattered everywhere', 'a database', 'a form'], correctAnswer: 'one shared client that sets base URL, headers and error handling' },
    { text: 'The token is attached as…', options: ['Authorization: Bearer <token>', 'a cookie always', 'a URL query', 'the request body'], correctAnswer: 'Authorization: Bearer <token>' },
    { text: 'A 401 response should…', options: ['log the user out app-wide in one place', 'be ignored', 'retry forever', 'show HTML'], correctAnswer: 'log the user out app-wide in one place' },
    { text: 'The client exposes…', options: ['an api object with methods like login() and getNotes()', 'raw fetch only', 'the server code', 'SQL'], correctAnswer: 'an api object with methods like login() and getNotes()' },
  ],
  'Routing & Protected Routes': [
    { text: 'A protected route is implemented with…', options: ['a RequireAuth wrapper around <Outlet />', 'no guard', 'a CSS class', 'a redirect in the server'], correctAnswer: 'a RequireAuth wrapper around <Outlet />' },
    { text: 'If not logged in, the guard…', options: ['redirects to /login', 'renders the page anyway', 'crashes', 'shows a blank page'], correctAnswer: 'redirects to /login' },
    { text: 'The session persists across refresh because…', options: ['the token is stored and re-hydrated on mount', 'the server remembers', 'cookies are always set', 'it does not'], correctAnswer: 'the token is stored and re-hydrated on mount' },
    { text: 'The guard reads…', options: ['auth context — one source of truth for logged-in state', 'the DOM', 'localStorage directly', 'the URL only'], correctAnswer: 'auth context — one source of truth for logged-in state' },
  ],

  // ── W3 ───────────────────────────────────────────────────────────────────
  'Designing the REST API': [
    { text: 'The API is best treated as…', options: ['a contract designed before coding', 'an implementation detail', 'a database view', 'a frontend feature'], correctAnswer: 'a contract designed before coding' },
    { text: 'A collection path looks like…', options: ['/api/notes; a resource is /api/notes/:id', '/getNotes', '/notes.html', '/api.php?notes'], correctAnswer: '/api/notes; a resource is /api/notes/:id' },
    { text: 'Responses should be…', options: ['stable, minimal shapes like { id, text, done }', 'raw Mongoose documents', 'HTML pages', 'XML'], correctAnswer: 'stable, minimal shapes like { id, text, done }' },
    { text: 'All errors should return…', options: ['{ error: "message" }', 'a stack trace', 'nothing', 'a redirect'], correctAnswer: '{ error: "message" }' },
  ],
  'Mongoose Models & Validation': [
    { text: 'A Mongoose schema defines…', options: ['fields with types, required flags and defaults', 'the React state', 'the routes', 'the CSS'], correctAnswer: 'fields with types, required flags and defaults' },
    { text: 'Validation belongs…', options: ['in the schema AND the route', 'only in the frontend', 'nowhere', 'in the README'], correctAnswer: 'in the schema AND the route' },
    { text: 'A query for a user\'s own notes must be…', options: ['scoped: find({ owner: req.user.userId })', 'global: find({})', 'cached', 'sorted'], correctAnswer: 'scoped: find({ owner: req.user.userId })' },
    { text: 'The owner field is stored as…', options: ['an ObjectId ref to User', 'a string password', 'a boolean', 'a color'], correctAnswer: 'an ObjectId ref to User' },
  ],
  'JWT Auth End-to-End on the Server': [
    { text: 'Passwords are stored…', options: ['as bcrypt hashes, never plain text', 'in plain text', 'base64-encoded', 'in the URL'], correctAnswer: 'as bcrypt hashes, never plain text' },
    { text: 'The token is signed with…', options: ['{ userId } and an expiry, using a secret env var', 'the password', 'the email', 'a timestamp only'], correctAnswer: '{ userId } and an expiry, using a secret env var' },
    { text: 'The middleware that protects routes…', options: ['verifies the Bearer token and attaches req.user', 'logs the request', 'serves static files', 'renders HTML'], correctAnswer: 'verifies the Bearer token and attaches req.user' },
    { text: 'On a bad token the server returns…', options: ['401', '200', '201', '500 with the secret'], correctAnswer: '401' },
  ],
  'Errors, Async & Structured Logging': [
    { text: 'One central error handler…', options: ['turns every error into a consistent { error } response', 'hides all errors', 'is optional', 'crashes the server'], correctAnswer: 'turns every error into a consistent { error } response' },
    { text: 'A Mongoose CastError (malformed id) maps to…', options: ['400', '500', '404', '201'], correctAnswer: '400' },
    { text: 'A duplicate-key error (E11000) maps to…', options: ['409', '200', '301', '501'], correctAnswer: '409' },
    { text: 'Production logs should be…', options: ['structured with method, path and status', 'empty', 'in the browser console', 'plain text with no context'], correctAnswer: 'structured with method, path and status' },
  ],

  // ── W4 ───────────────────────────────────────────────────────────────────
  'The Auth Flow End-to-End': [
    { text: 'After a successful login the client…', options: ['stores the token and updates auth context', 'reloads the page', 'clears storage', 'sends the password again'], correctAnswer: 'stores the token and updates auth context' },
    { text: 'On refresh the session is restored by…', options: ['reading the stored token and verifying it', 'asking for the password', 'a fresh login always', 'the URL'], correctAnswer: 'reading the stored token and verifying it' },
    { text: 'Logout must…', options: ['clear the token, the context, and navigate to login', 'only hide the page', 'delete the user', 'call the server'], correctAnswer: 'clear the token, the context, and navigate to login' },
    { text: 'Most full-stack auth bugs come from…', options: ['a missing step in the click → store → verify → send chain', 'too much logging', 'too many tests', 'the CSS'], correctAnswer: 'a missing step in the click → store → verify → send chain' },
  ],
  'CORS & Environment Config in Both Apps': [
    { text: 'The dev proxy makes requests…', options: ['same-origin, so CORS is a non-issue in dev', 'cross-origin always', 'slower', 'uncached'], correctAnswer: 'same-origin, so CORS is a non-issue in dev' },
    { text: 'In production, CORS must…', options: ['allow exactly your frontend origin — never *', 'allow * for simplicity', 'be disabled', 'allow everything'], correctAnswer: 'allow exactly your frontend origin — never *' },
    { text: 'The client reads its API URL from…', options: ['import.meta.env.VITE_API_URL', 'a hardcoded string', 'the database', 'the server'], correctAnswer: 'import.meta.env.VITE_API_URL' },
    { text: 'The server reads PORT, MONGO_URI and JWT_SECRET from…', options: ['process.env via a central config module', 'process.env scattered everywhere', 'the frontend', 'a public JSON'], correctAnswer: 'process.env via a central config module' },
  ],
  'Loading, Empty & Error States Across the Stack': [
    { text: 'An API screen has four states:…', options: ['loading, data, empty, error', 'fast, slow, stuck, dead', 'start, run, stop, reboot', 'input, output, log, cache'], correctAnswer: 'loading, data, empty, error' },
    { text: 'A forever-spinner means…', options: ['the loading state is stuck — a UX bug', 'the app is fine', 'the database is fast', 'everything worked'], correctAnswer: 'the loading state is stuck — a UX bug' },
    { text: 'An empty result should render…', options: ['a friendly empty-state message', 'nothing', 'an error', 'a spinner'], correctAnswer: 'a friendly empty-state message' },
    { text: 'A failed fetch should show…', options: ['the error with a retry button', 'a blank screen', 'an endless spinner', 'the old cache'], correctAnswer: 'the error with a retry button' },
  ],
  'Deploying Both Halves': [
    { text: 'The backend is deployed…', options: ['first — then the frontend points at its URL', 'last', 'never', 'only in dev'], correctAnswer: 'first — then the frontend points at its URL' },
    { text: 'The frontend build outputs…', options: ['static files in dist/ for a host like Netlify/Vercel', 'a database', 'a server binary', 'source maps only'], correctAnswer: 'static files in dist/ for a host like Netlify/Vercel' },
    { text: 'PM2 is used to…', options: ['run the backend process and keep it alive', 'build the frontend', 'style the UI', 'query MongoDB'], correctAnswer: 'run the backend process and keep it alive' },
    { text: 'The final CORS step after deploying is…', options: ['point the client at the deployed backend and rebuild', 'delete the backend', 'disable HTTPS', 'skip it'], correctAnswer: 'point the client at the deployed backend and rebuild' },
  ],

  // ── W5 ───────────────────────────────────────────────────────────────────
  'Project 1 — Full-Stack Task Manager': [
    { text: 'The auth slice delivers…', options: ['register → login → a dashboard appears', 'a theme switcher', 'a database index', 'static pages'], correctAnswer: 'register → login → a dashboard appears' },
    { text: 'Task routes are scoped by…', options: ['req.user.userId so users see only their tasks', 'nothing', 'the frontend', 'a global id'], correctAnswer: 'req.user.userId so users see only their tasks' },
    { text: 'The recommended way to build is…', options: ['vertical slices, each testable before the next', 'all layers at once', 'frontend only', 'database first, nothing else'], correctAnswer: 'vertical slices, each testable before the next' },
    { text: 'The auth slice ends when…', options: ['a user can log in and reach a protected page', 'the CSS is done', 'the repo is pushed', 'the database is empty'], correctAnswer: 'a user can log in and reach a protected page' },
  ],
  'Project 2 — E-Commerce Mini': [
    { text: 'The product catalog is…', options: ['public; the cart is protected', 'protected; everything else public', 'private', 'server-side only'], correctAnswer: 'public; the cart is protected' },
    { text: 'A cart item belongs to…', options: ['one user (owner + product + qty)', 'everyone', 'no one', 'the product'], correctAnswer: 'one user (owner + product + qty)' },
    { text: 'Placing an order…', options: ['creates the order and clears the cart', 'deletes the products', 'logs out the user', 'only prints a receipt'], correctAnswer: 'creates the order and clears the cart' },
    { text: 'This project exercises…', options: ['relations between models, scoped queries and public vs protected routes', 'only CSS', 'only fonts', 'only images'], correctAnswer: 'relations between models, scoped queries and public vs protected routes' },
  ],
  'Testing the Full Stack': [
    { text: 'The backend is tested with…', options: ['supertest against the Express app', 'a browser', 'a spreadsheet', 'the frontend'], correctAnswer: 'supertest against the Express app' },
    { text: 'The frontend is tested with…', options: ['React Testing Library', 'SQL', 'curl', 'PM2'], correctAnswer: 'React Testing Library' },
    { text: 'The highest-value test proves…', options: ['user A cannot read user B\'s data (scoping)', 'the logo renders', 'a button has a color', 'the server uptime'], correctAnswer: 'user A cannot read user B\'s data (scoping)' },
    { text: 'A protected route without a token must return…', options: ['401', '200', '201', '301'], correctAnswer: '401' },
  ],
  'Review, Debugging & Your Career Path': [
    { text: 'The review checklist includes…', options: ['hashed passwords, scoped queries, consistent errors, all four states, restricted CORS', 'only the logo', 'the server uptime', 'the number of files'], correctAnswer: 'hashed passwords, scoped queries, consistent errors, all four states, restricted CORS' },
    { text: 'The first debugging step is…', options: ['check the browser Network tab — did the request go out?', 'rewrite the code', 'restart the server', 'clear the cache'], correctAnswer: 'check the browser Network tab — did the request go out?' },
    { text: 'Most full-stack bugs are found by…', options: ['asking which hop failed: frontend, API or data', 'reading the whole codebase', 'random changes', 'deleting files'], correctAnswer: 'asking which hop failed: frontend, API or data' },
    { text: 'The natural next step in your career is…', options: ['more TypeScript, testing depth, and shipping products for users', 'stopping', 'rewriting in a new stack', 'only learning tools'], correctAnswer: 'more TypeScript, testing depth, and shipping products for users' },
  ],
};
