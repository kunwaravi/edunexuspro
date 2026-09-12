/**
 * Full Stack Web Development — MERN Projects — Task 5 starter curriculum.
 * 5 modules × 4 topics, per-topic quizzes in full-stack-web_topic_quizzes.ts,
 * plus a 4-question chapter quiz per module.
 */
import type { Section } from './types';

export const SECTIONS: Section[] = [
  // ── W1 · The Full Stack Architecture ─────────────────────────────────────
  {
    week: 1,
    title: 'The Full Stack Architecture',
    description: 'How the frontend, backend and database fit together — and the tools of the MERN stack.',
    topics: [
      {
        title: 'Frontend, Backend & Database — The Big Picture',
        text: 'A full-stack app has three layers. The frontend (React) renders the UI in the browser. The backend (Node/Express) exposes a REST API. The database (MongoDB) stores the data. The frontend talks to the backend over HTTP; the backend talks to the database.\n\nData flows one way on each hop: a user clicks → React calls POST /api/login → Express validates against MongoDB → returns a token → React stores it and renders the result.\n\nWhy split? Separation of concerns: the frontend owns presentation, the backend owns rules and safety, the database owns persistence. Each can be tested, scaled and replaced independently.',
        code: '// The request/response journey\nUser → React UI\n  → POST /api/login { email, password }   (HTTP)\n    → Express route\n      → mongoose query → MongoDB\n      ← { token, user }\n  ← UI stores token, shows Dashboard',
        note: 'Frontend talks only to your backend API, never straight to the database. That boundary is the security line.',
      },
      {
        title: 'The MERN Stack & Your Toolchain',
        text: 'MERN = MongoDB (database), Express (backend framework), React (frontend library), Node.js (runtime). It is one JavaScript language across all three layers — one mental model for the whole product.\n\nThe toolchain: npm manages packages; Vite scaffolds the React app; nodemon or node --watch restarts the backend during dev; MongoDB runs locally (or in the cloud via Atlas); Postman or the browser tests API calls.\n\nStructure the repo as two folders: client/ (React) and server/ (Express). Each has its own package.json and scripts.',
        code: 'my-app/\n├── client/          # React (Vite)\n│   ├── package.json\n│   └── src/\n└── server/          # Node + Express\n    ├── package.json\n    └── src/\n        ├── index.js\n        ├── routes/\n        └── models/',
        note: 'Two folders, one language, one repo. Monorepo discipline — client and server separate but versioned together.',
      },
      {
        title: 'Setting Up: Vite + Express + MongoDB',
        text: 'The setup: npm create vite@latest client -- --template react in the app folder, then npm install in server/ (express, mongoose, dotenv, jsonwebtoken, bcrypt, cors).\n\nStart both in dev: server on :5000 (node --watch), client on :5173 (vite). The client proxies /api to the server via its Vite config so requests stay same-origin in dev.\n\nConnect MongoDB: import mongoose, mongoose.connect(config.mongoUri), and verify with a health check on the server. A working "hello from the API" reaching the React page is the milestone of week 1.',
        code: '// server/src/index.js\nimport express from "express";\nimport mongoose from "mongoose";\nimport { config } from "./config.js";\n\nconst app = express();\napp.use(express.json());\n\nawait mongoose.connect(config.mongoUri);\napp.get("/api/health", (req, res) => res.json({ ok: true }));\n\napp.listen(config.port, () => console.log("API on :" + config.port));',
        note: 'Client :5173, server :5000, health check green. Once the browser fetches the health endpoint, the stack is wired.',
      },
      {
        title: 'Project Planning — Think Before You Code',
        text: 'A full-stack app starts with a plan: the feature list, the data model, the API endpoints, and the screens. Sketch these four before writing code — they are the blueprint.\n\nData model: what entities exist and how they relate (User has many Notes; Note has owner + text + done). Endpoints: map each feature to REST verbs (auth, CRUD). Screens: which pages exist and what data each needs.\n\nScope discipline: build the smallest complete slice first — one entity, full CRUD, one screen — then add auth, then features. A working 10% teaches more than a planned 100%.',
        code: '// Example blueprint for a notes app\n// Models:  User { name, email, passwordHash }\n//          Note  { text, done, owner }\n// API:     POST /api/auth/register\n//          POST /api/auth/login      → { token }\n//          GET    /api/notes  (auth)\n//          POST   /api/notes  (auth)\n//          PATCH  /api/notes/:id (auth)\n//          DELETE /api/notes/:id (auth)\n// Screens: Login/Register, Notes list, Add/Edit note',
        note: 'Models, endpoints, screens — plan all three on paper first. Half of project failures are unplanned scope, not bad code.',
      },
    ],
    quizzes: [
      { text: 'The full-stack data flow is…', options: ['React → Express → MongoDB, then back', 'MongoDB → React directly', 'Express only', 'React only'], correctAnswer: 'React → Express → MongoDB, then back' },
      { text: 'MERN stands for…', options: ['MongoDB, Express, React, Node', 'MySQL, Express, React, Next', 'MongoDB, Electron, Redis, Node', 'Mongo, EJS, React, Nginx'], correctAnswer: 'MongoDB, Express, React, Node' },
      { text: 'The frontend should talk to…', options: ['your backend API only', 'the database directly', 'every service', 'the browser'], correctAnswer: 'your backend API only' },
      { text: 'The first milestone of a MERN setup is…', options: ['a working health check from the API reaching React', 'a login page', 'a database with 1000 rows', 'deployment'], correctAnswer: 'a working health check from the API reaching React' },
    ],
  },

  // ── W2 · Frontend with React ─────────────────────────────────────────────
  {
    week: 2,
    title: 'Frontend with React',
    description: 'The React side of the stack: components, forms, API calls and routing.',
    topics: [
      {
        title: 'Component Architecture & State',
        text: 'Structure the React app as a tree: pages (Login, Dashboard), layout (AppLayout with nav), and reusable pieces (NoteCard, Button, Input). Data lives in the pages and flows down.\n\nState planning: page-level state for lists and forms, context for auth (the logged-in user is app-wide), and a small useFetch hook for API calls. Keep state as low as it can live.\n\nThe mental model: the page fetches data → holds it in state → renders pieces → receives events upward. If a component needs data that isn\'t passed to it, the data must live higher.',
        code: 'src/\n├── pages/         LoginPage, DashboardPage\n├── components/    NoteCard, Button, Input, AppLayout\n├── context/       AuthContext\n├── hooks/         useFetch, useAuth\n└── api/           client.js (fetch wrapper)',
        note: 'Pages own data; components render it. That single rule keeps a growing app navigable.',
      },
      {
        title: 'Forms & Client-Side Validation',
        text: 'A full-stack app\'s forms follow the controlled-input pattern: state for each field, update on change, validate on submit, then POST to the API.\n\nValidation on the client is for UX: required fields, email format, password length, matching confirm-password. The server validates AGAIN — the client never guards anything real.\n\nSubmission states matter: submitting (disable the button), success (navigate or show a message), and error (show the API\'s message inline). Never let a user double-submit.',
        code: 'function LoginForm() {\n  const [form, setForm] = useState({ email: "", password: "" });\n  const [error, setError] = useState(null);\n  const [submitting, setSubmitting] = useState(false);\n\n  const handleSubmit = async (e) => {\n    e.preventDefault();\n    setSubmitting(true); setError(null);\n    try {\n      const { token } = await api.login(form);\n      localStorage.setItem("token", token);\n      navigate("/dashboard");\n    } catch (err) {\n      setError(err.message);\n    } finally {\n      setSubmitting(false);\n    }\n  };\n  return (\n    <form onSubmit={handleSubmit}>\n      <Input label="Email" type="email" required\n        value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />\n      <Input label="Password" type="password" required\n        value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />\n      {error && <p className="error">{error}</p>}\n      <Button type="submit" disabled={submitting}>{submitting ? "Signing in…" : "Log in"}</Button>\n    </form>\n  );\n}',
        note: 'Controlled inputs + submitting state + inline errors. The double-submit guard is a small habit that prevents real bugs.',
      },
      {
        title: 'API Calls from React',
        text: 'Wrap fetch in an api client so every call shares base URL, headers and error handling. Attach the auth token: const headers = { "Content-Type": "application/json", Authorization: token ? \`Bearer \${token}\` : "" }.\n\nHandle responses uniformly: res.ok ? return data : parse the error message and throw. Components then use try/catch or the useFetch hook and never see raw fetch.\n\n401 handling: if the token is invalid/expired, the client should log the user out and return to the login page — one place in the client, not per call.',
        code: '// api/client.js\nexport async function request(path, options = {}) {\n  const token = localStorage.getItem("token");\n  const res = await fetch(\`/api\${path}\`, {\n    ...options,\n    headers: {\n      "Content-Type": "application/json",\n      ...(token ? { Authorization: \`Bearer \${token}\` } : {}),\n      ...options.headers,\n    },\n  });\n  if (res.status === 401) { logout(); throw new Error("Session expired"); }\n  const data = await res.json().catch(() => ({}));\n  if (!res.ok) throw new Error(data.error || "Request failed");\n  return data;\n}\n\nexport const api = {\n  login: (body) => request("/auth/login", { method: "POST", body: JSON.stringify(body) }),\n  getNotes: () => request("/notes"),\n};',
        note: 'One client, one error shape, one 401 logout. Ten components calling fetch directly is how error handling drifts.',
      },
      {
        title: 'Routing & Protected Routes',
        text: 'React Router structures the app: public routes (/, /login, /register) and protected routes (/dashboard, /notes) that require a login. Guard with a wrapper component: check the auth state, and either render <Outlet /> or redirect to /login.\n\nAuth state lives in context: on mount, check for a token (and optionally verify with the server). The guard reads the context — one source of truth for "are we logged in?".\n\nAfter login navigate to the protected page; after logout clear state and navigate home. Persist the session in localStorage so a refresh doesn\'t log the user out.',
        code: 'function RequireAuth() {\n  const { user } = useAuth();\n  const location = useLocation();\n  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;\n  return <Outlet />;\n}\n\n<Routes>\n  <Route path="/login" element={<LoginPage />} />\n  <Route path="/" element={<RequireAuth />}>\n    <Route path="/dashboard" element={<DashboardPage />} />\n    <Route path="/notes" element={<NotesPage />} />\n  </Route>\n</Routes>',
        note: 'The guard is a component, not scattered checks. Protected routes render through RequireAuth — one place to change.',
      },
    ],
    quizzes: [
      { text: 'The data model in React is…', options: ['pages own data and pass it down', 'every component fetches its own', 'the DOM owns data', 'the server owns all state'], correctAnswer: 'pages own data and pass it down' },
      { text: 'Client-side form validation is…', options: ['for UX — the server must validate again', 'the only validation needed', 'for security', 'optional'], correctAnswer: 'for UX — the server must validate again' },
      { text: 'The auth token is attached to requests via…', options: ['the Authorization header as Bearer', 'the URL', 'a cookie always', 'the response'], correctAnswer: 'the Authorization header as Bearer' },
      { text: 'A 401 from the API should…', options: ['log the user out app-wide', 'be ignored', 'crash the page', 'retry forever'], correctAnswer: 'log the user out app-wide' },
    ],
  },

  // ── W3 · Backend with Node & Express ─────────────────────────────────────
  {
    week: 3,
    title: 'Backend with Node & Express',
    description: 'The server side: REST APIs, Mongoose models, JWT auth and solid error handling.',
    topics: [
      {
        title: 'Designing the REST API',
        text: 'The API is the contract the frontend builds against. Design it before coding: collection paths (/api/notes), resource paths (/api/notes/:id), verbs (GET list, POST create, PATCH update, DELETE remove), and the JSON shape of each response.\n\nResponse shapes should be stable and minimal: for a note, { id, text, done, owner } — never the raw Mongoose doc with internal fields.\n\nConsistency: all errors are { error: "message" }, all lists are arrays, all single resources are objects. When the shape is predictable, the frontend client stays simple.',
        code: '// Endpoint contract\nGET    /api/notes          → [ { id, text, done } ]        (auth)\nPOST   /api/notes          → { id, text, done }            (auth)\nPATCH  /api/notes/:id      → { id, text, done }            (auth)\nDELETE /api/notes/:id      → 204                           (auth)\n\n// Error shape\n{ "error": "Note not found" }',
        note: 'Design the contract first, then implement. A documented endpoint list is the API\'s specification.',
      },
      {
        title: 'Mongoose Models & Validation',
        text: 'Mongoose maps MongoDB collections to schemas. Define the fields with types, required flags and defaults: const noteSchema = new Schema({ text: { type: String, required: true }, done: { type: Boolean, default: false }, owner: { type: ObjectId, ref: "User", required: true } });\n\nValidation lives in the schema (required, minlength, enum) AND in the route (check the request body). Schema validation stops bad writes; route validation produces clean 400s.\n\nAlways scope queries to the logged-in user: find({ owner: req.user.userId }) — a user must never read another user\'s notes, no matter what id they pass.',
        code: '// models/Note.js\nimport mongoose from "mongoose";\nconst noteSchema = new mongoose.Schema({\n  text: { type: String, required: true, trim: true, maxlength: 500 },\n  done: { type: Boolean, default: false },\n  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },\n}, { timestamps: true });\nexport default mongoose.model("Note", noteSchema);\n\n// scoped query in the route\nconst notes = await Note.find({ owner: req.user.userId });',
        note: 'Every query scoped to req.user. If the code says find({}) on user-owned data, it is a privacy bug.',
      },
      {
        title: 'JWT Auth End-to-End on the Server',
        text: 'The server auth flow: register (hash password with bcrypt, create user), login (compare password, sign a JWT with the userId), and a requireAuth middleware that verifies the Bearer token and attaches req.user.\n\nHash before storing, never return the hash to the client. Tokens: sign with { userId } and an expiry; verify in middleware; on failure return 401.\n\nDefense details: rate-limit auth routes, compare the same way for missing and wrong credentials (no "user not found" leak), and keep the JWT secret in the environment.',
        code: '// middleware/auth.js\nexport async function requireAuth(req, res, next) {\n  const header = req.headers.authorization || "";\n  const token = header.startsWith("Bearer ") ? header.slice(7) : null;\n  if (!token) return res.status(401).json({ error: "Sign in required" });\n  try {\n    req.user = jwt.verify(token, config.jwtSecret);\n    next();\n  } catch {\n    res.status(401).json({ error: "Invalid or expired token" });\n  }\n}\n\n// register:  const hash = await bcrypt.hash(password, 12);\n// login:     const ok = await bcrypt.compare(password, user.passwordHash);\n//            res.json({ token: jwt.sign({ userId: user.id }, config.jwtSecret, { expiresIn: "7d" }) })',
        note: 'bcrypt on signup, compare on login, verify in middleware, scope every query by req.user.userId.',
      },
      {
        title: 'Errors, Async & Structured Logging',
        text: 'One central error handler turns every thrown error into a consistent { error } response. Express 5 forwards async rejections automatically. Validation errors become 400s; missing records 404; the rest 500 with the detail in the server log, never to the client.\n\nHandle Mongoose errors: CastError (bad id format) → 400, duplicate key (E11000) → 409.\n\nLog with context: method, path, status, and error message — a timestamped structured line per request is enough to diagnose production issues.',
        code: '// index.js — after all routes\napp.use((err, req, res, next) => {\n  if (err.name === "CastError") return res.status(400).json({ error: "Invalid id" });\n  if (err.code === 11000) return res.status(409).json({ error: "Already exists" });\n  console.error(\`\${req.method} \${req.path} → \${err.message}\`);\n  res.status(err.status || 500).json({ error: err.status ? err.message : "Server error" });\n});\n\nprocess.on("SIGTERM", async () => {\n  await mongoose.disconnect();\n  process.exit(0);\n});',
        note: 'Known errors get precise codes (400/404/409); unknown errors get 500 and a log line. That is the whole error story.',
      },
    ],
    quizzes: [
      { text: 'The API is best treated as…', options: ['a contract designed before coding', 'an afterthought', 'the frontend\'s concern', 'a database'], correctAnswer: 'a contract designed before coding' },
      { text: 'Mongoose schemas define…', options: ['fields, types, required flags and defaults', 'the React state', 'the CSS', 'the routes'], correctAnswer: 'fields, types, required flags and defaults' },
      { text: 'A user-owned resource query must…', options: ['always scope by owner: find({ owner: req.user.userId })', 'return everything', 'skip the owner', 'be a global find'], correctAnswer: 'always scope by owner: find({ owner: req.user.userId })' },
      { text: 'A Mongoose CastError (bad id) should return…', options: ['400', '500', '404 always', '200'], correctAnswer: '400' },
    ],
  },

  // ── W4 · Connecting Frontend & Backend ───────────────────────────────────
  {
    week: 4,
    title: 'Connecting Frontend & Backend',
    description: 'Wiring the two halves together: auth flow, CORS, loading states and production deployment.',
    topics: [
      {
        title: 'The Auth Flow End-to-End',
        text: 'Follow one login from click to dashboard and back: the form posts credentials → the client sends POST /api/auth/login → Express compares the hash → signs a JWT → React stores it (localStorage) → AuthContext updates → the protected route renders the dashboard → every subsequent request carries the Bearer token → the server verifies and scopes queries to the user.\n\nLogout: clear the token, clear the auth context, navigate to /login. Refresh: on mount, AuthContext reads the stored token and re-hydrates the user (optionally verifying it via the API).\n\nDraw this flow and you will debug it in minutes rather than hours — most full-stack bugs live in a missing step of this chain.',
        code: '// AuthContext.jsx (skeleton)\nconst AuthContext = createContext(null);\nexport function AuthProvider({ children }) {\n  const [user, setUser] = useState(null);\n  const [loading, setLoading] = useState(true);\n\n  useEffect(() => {\n    const token = localStorage.getItem("token");\n    if (!token) { setLoading(false); return; }\n    api.me()            // GET /api/auth/me with the token\n      .then((me) => setUser(me))\n      .catch(() => localStorage.removeItem("token"))\n      .finally(() => setLoading(false));\n  }, []);\n\n  const login = async (credentials) => {\n    const { token, user } = await api.login(credentials);\n    localStorage.setItem("token", token);\n    setUser(user);\n  };\n  const logout = () => { localStorage.removeItem("token"); setUser(null); };\n  // provide { user, loading, login, logout }\n}',
        note: 'Store → hydrate → guard → send. A session that survives refresh is the full-stack auth requirement.',
      },
      {
        title: 'CORS & Environment Config in Both Apps',
        text: 'In dev, the Vite dev server proxies /api to the backend, so requests are same-origin and CORS is a non-issue. In production, the frontend and backend are often separate origins — the server must allow the frontend\'s origin with cors({ origin: [...] }).\n\nNever use cors("*") with credentials. Enumerate the allowed origins.\n\nEnvironment config: the frontend needs the API base URL (VITE_API_URL in .env, read via import.meta.env), the backend needs PORT, MONGO_URI and JWT_SECRET (process.env). Keep both documented in .env.example.',
        code: '// vite.config.js — dev proxy\nserver: { proxy: { "/api": "http://localhost:5000" } }\n\n// server — production CORS\nimport cors from "cors";\napp.use(cors({ origin: [config.frontendUrl] }));\n\n// client .env\nVITE_API_URL=https://api.example.com',
        note: 'Dev proxy removes CORS pain; production CORS allows exactly your frontend origin. Enumerate, never *.',
      },
      {
        title: 'Loading, Empty & Error States Across the Stack',
        text: 'Every API-driven screen has four states: loading, data, empty, and error. The pattern: useFetch returns { data, loading, error }; render a spinner/skeleton while loading, the data when present, a friendly empty message, and a retry button on error.\n\nApply it to lists, dashboards and single records. Mutations (create/update/delete) have their own states: pending (disable the button), success (update local state or refetch), failure (show the error, keep the form).\n\nState discipline is what separates a demo from a product: a user staring at a forever-spinner is a user who has already closed the tab.',
        code: 'function NotesPage() {\n  const { data: notes, loading, error, refetch } = useFetch("/notes");\n  if (loading) return <Spinner />;\n  if (error) return <ErrorBox message={error.message} onRetry={refetch} />;\n  if (!notes.length) return <EmptyState message="No notes yet — create your first!" />;\n  return notes.map((n) => <NoteCard key={n.id} note={n} />);\n}',
        note: 'Loading / data / empty / error — four renders, always. The empty state is easy to forget and impossible to miss when it\'s missing.',
      },
      {
        title: 'Deploying Both Halves',
        text: 'Deploy the backend first: provision MongoDB (Atlas cloud), set env vars, npm install --omit=dev, and run with PM2 behind a reverse proxy with SSL. Test the API against the production URL.\n\nDeploy the frontend as a static build: npm run build produces dist/, which Netlify/Vercel (or Nginx) serves. Point the client\'s VITE_API_URL at the deployed backend and rebuild.\n\nPost-deploy checklist: both health checks green, auth works from the public URL, CORS allows it, and the production logs are reachable. Deploy small, verify each piece, then combine.',
        code: '// server PM2\npm2 start src/index.js --name api --env production\n\n// client build + publish\nnpm run build   # → dist/\nnetlify deploy  # or: rsync dist/ to the web root\n\n// verify\ncurl https://api.example.com/api/health\n→ { "ok": true }',
        note: 'Backend first, then frontend, then CORS. Each milestone verified against the public URL before the next.',
      },
    ],
    quizzes: [
      { text: 'On page refresh, the session is restored by…', options: ['reading the stored token and re-hydrating the user', 'asking for the password again', 'clearing everything', 'a cookie always'], correctAnswer: 'reading the stored token and re-hydrating the user' },
      { text: 'cors("*") is wrong when…', options: ['credentials are involved — enumerate your origins', 'there is any frontend', 'the server is small', 'always'], correctAnswer: 'credentials are involved — enumerate your origins' },
      { text: 'The four states of an API screen are…', options: ['loading, data, empty, error', 'start, stop, pause, resume', 'red, green, blue, white', 'input, output, process, store'], correctAnswer: 'loading, data, empty, error' },
      { text: 'The correct deployment order is…', options: ['backend, then frontend, then CORS', 'frontend only', 'database only', 'any order'], correctAnswer: 'backend, then frontend, then CORS' },
    ],
  },

  // ── W5 · Two Complete Projects ───────────────────────────────────────────
  {
    week: 5,
    title: 'Two Complete Projects',
    description: 'Two full-stack builds — a task app and an e-commerce mini — plus the review that makes you an engineer.',
    topics: [
      {
        title: 'Project 1 — Full-Stack Task Manager',
        text: 'Build the task manager end to end: register/login, then a dashboard where users create, complete and delete their own tasks.\n\nBackend: User + Task models, auth routes, task routes all scoped to req.user.userId. Frontend: AuthContext, protected routes, task form, task list with the four-state pattern, and an api client with the Bearer token.\n\nWork in vertical slices: auth slice first (register → login → dashboard appears), then the task CRUD slice. Each slice is testable before the next starts.',
        code: '// Backend slice order\n1. POST /api/auth/register + login  → token\n2. GET  /api/tasks (auth, scoped)\n3. POST /api/tasks (auth)\n4. PATCH /api/tasks/:id (auth)\n5. DELETE /api/tasks/:id (auth)\n\n// Frontend slice order\n1. Login/Register pages → AuthContext → guard\n2. Task list (loading/data/empty/error)\n3. Add + toggle + delete wired to the API',
        note: 'Vertical slices: auth works end-to-end before tasks exist. Slice by feature, not by layer.',
      },
      {
        title: 'Project 2 — E-Commerce Mini',
        text: 'Build a storefront: a public product catalog, and authenticated users with a cart. Checkout is optional; the cart + order is the meat.\n\nBackend: Product (public reads), Cart (per user), Order (create on checkout). Frontend: catalog page (public), cart page (protected), and an orders view. Add a search or category filter on the catalog.\n\nThis project exercises everything: relations between models (Order references products), scoped queries (a cart belongs to one user), and public vs protected routes in the same app.',
        code: '// Models\nProduct { name, price, category, stock }\nCartItem { owner, product, qty }\nOrder   { owner, items: [{ product, qty, price }], total }\n\n// Endpoints\nGET  /api/products?category=&q=      (public)\nGET  /api/cart        (auth) → { items, total }\nPOST /api/cart/items  (auth) { productId, qty }\nPOST /api/orders      (auth) → creates order, clears cart',
        note: 'A public catalog + a scoped cart + an order is a real e-commerce core. Relations and scoping are the lesson.',
      },
      {
        title: 'Testing the Full Stack',
        text: 'Test both halves. Backend: supertest against the Express app — auth (register/login/401s), CRUD happy paths, and scoping (a user cannot read another\'s data). Frontend: test components with React Testing Library (a form submits with the right payload; a list renders items; error states show).\n\nTypeScript (optional but recommended) catches contract drift: shared types for the API response shapes keep client and server honest.\n\nThe highest-value test is the scoping test — the one that proves user A cannot see user B\'s notes. That is a security test, not a nicety.',
        code: '// Backend: scoping test\ntest("users cannot read another user\'s notes", async () => {\n  const a = await registerAndLogin("a@test.com");\n  const b = await registerAndLogin("b@test.com");\n  await request(app).post("/api/notes").set(auth(a)).send({ text: "A\'s note" });\n  const res = await request(app).get("/api/notes").set(auth(b));\n  assert.equal(res.body.length, 0);   // B sees nothing of A\n});',
        note: 'Backend: supertest. Frontend: React Testing Library. And the scoping test is the one you must not skip.',
      },
      {
        title: 'Review, Debugging & Your Career Path',
        text: 'The review checklist for a full-stack app: (1) passwords hashed, tokens expired; (2) every user-owned query scoped; (3) all errors consistent; (4) loading/empty/error states everywhere; (5) CORS restricted; (6) env config clean; (7) tests green; (8) deployed and healthy.\n\nDebugging across the stack: reproduce → check the browser Network tab (did the request go out?) → check the server log (did it arrive?) → isolate the layer (frontend bug, API bug, or data bug). Ninety percent of full-stack bugs are found by asking which hop failed.\n\nYou now own a complete stack. The road ahead: more TypeScript, a real database at scale, testing depth, and building products for users — the skills that carry a software career.',
        code: '// Debugging playbook\n1. Reproduce the exact action\n2. Network tab: request sent? status? response?\n3. Server log: did it arrive? what did the DB return?\n4. Isolate: frontend (render), API (logic), data (shape)\n5. Fix one layer, retest the whole flow',
        note: 'Your portfolio is these projects. Deploy them, document them, and the interview answers write themselves.',
      },
    ],
    quizzes: [
      { text: 'The build-by-feature approach is called…', options: ['vertical slices', 'horizontal layers', 'waterfall', 'random coding'], correctAnswer: 'vertical slices' },
      { text: 'A cart belongs to…', options: ['one user (scoped by owner)', 'everyone', 'no one', 'the frontend'], correctAnswer: 'one user (scoped by owner)' },
      { text: 'The highest-value security test is…', options: ['scoping: user A cannot see user B\'s data', 'a login page screenshot', 'a loading test', 'a CORS test'], correctAnswer: 'scoping: user A cannot see user B\'s data' },
      { text: 'Across the stack, a bug is usually found by…', options: ['asking which hop failed: frontend, API or data', 'rewriting everything', 'restarting the server', 'clearing the cache'], correctAnswer: 'asking which hop failed: frontend, API or data' },
    ],
  },
];
