/**
 * Node.js — Backend APIs with JavaScript — Task 5 starter curriculum.
 * 5 modules × 4 topics, per-topic quizzes in node-js_topic_quizzes.ts,
 * plus a 4-question chapter quiz per module.
 */
import type { Section } from './types';

export const SECTIONS: Section[] = [
  // ── W1 · Node Foundations ────────────────────────────────────────────────
  {
    week: 1,
    title: 'Node Foundations',
    description: 'What Node is, the event loop, npm and modules — the mental model behind every Node app.',
    topics: [
      {
        title: 'What Node.js Is & The Event Loop',
        text: 'Node.js runs JavaScript outside the browser, powered by the V8 engine. Its superpower is the event loop: a single thread handles thousands of connections by never blocking — I/O (files, network, databases) is scheduled and picked up when it finishes.\n\nA synchronous read blocks the whole process; an async operation returns immediately and runs a callback when done. That is why Node APIs are async and why you never write blocking code in the request path.\n\nThe single thread means: keep CPU-heavy work out of the hot path (or offload it), and prefer async versions of fs and http.',
        code: '// Blocking — freezes everything while reading\nconst data = fs.readFileSync("big.txt");\n\n// Non-blocking — the process keeps serving\nfs.readFile("big.txt", (err, data) => {\n  console.log("done");\n});',
        note: 'The event loop only does one thing at a time — so it must never wait. Async I/O is the whole game in Node.',
      },
      {
        title: 'npm, package.json & Node Scripts',
        text: 'npm is the package manager: npm init creates a package.json; npm install <pkg> adds a dependency; npm install -D <pkg> a dev dependency (tools like TypeScript, testing).\n\npackage.json is the app\'s manifest: dependencies, scripts, main entry. Scripts are shortcuts: "start": "node src/index.js", "dev": "node --watch src/index.js". Run them with npm start / npm run dev.\n\nnode_modules is where packages live — never commit or edit it; npm install reproduces it from package.json and package-lock.json (which you SHOULD commit).',
        code: '{ "name": "my-api", "version": "1.0.0", "type": "module",\n  "main": "src/index.js",\n  "scripts": { "start": "node src/index.js", "dev": "node --watch src/index.js" },\n  "dependencies": { "express": "^4.19.0" } }',
        note: 'Commit package-lock.json, ignore node_modules. Reproducible installs and clean diffs come free.',
      },
      {
        title: 'Modules: require vs import',
        text: 'Code is organized into modules — files that export and import pieces. Two systems: CommonJS (require / module.exports) and ES Modules (import / export).\n\npackage.json "type": "module" makes .js files ES modules. ESM is the modern default: import express from "express"; export function helper() {}. Named vs default exports: export default is the primary export; named exports (export const x) for several.\n\nModules give encapsulation: only what you export is visible. This is how a Node project stays navigable — one file per concern.',
        code: '// helpers.js\nimport fs from "node:fs/promises";\nexport function formatPrice(n) { return "₹" + n.toLocaleString("en-IN"); }\nexport default function greet(name) { return \`Hello, \${name}\`; }\n\n// index.js\nimport greet, { formatPrice } from "./helpers.js";',
        note: '"type": "module" + import/export is the modern default. Keep one file per concern and exports explicit.',
      },
      {
        title: 'Your First HTTP Server',
        text: 'Node can serve HTTP with zero dependencies. The http module\'s createServer receives a request and writes a response. Start it with server.listen(PORT).\n\nA response: set status and headers (res.writeHead), then end with the body (res.end). Request details live on req: req.url, req.method, req.headers.\n\nThis is the foundation — Express (next module) wraps exactly this, adding routing and middleware. Write a raw server once to see the mechanics, then use Express for real work.',
        code: 'import http from "node:http";\n\nconst server = http.createServer((req, res) => {\n  res.writeHead(200, { "Content-Type": "application/json" });\n  res.end(JSON.stringify({ path: req.url, method: req.method }));\n});\n\nserver.listen(3000, () => console.log("Listening on http://localhost:3000"));',
        note: 'createServer + listen is the whole skeleton. Express is sugar on top of this exact model.',
      },
    ],
    quizzes: [
      { text: 'The event loop lets Node handle many connections by…', options: ['spawning a thread per request', 'never blocking on I/O', 'queuing everything synchronously', 'using the GPU'], correctAnswer: 'never blocking on I/O' },
      { text: 'Node modules are organized using…', options: ['require/import with exports', 'HTML files', 'CSS classes', 'global variables'], correctAnswer: 'require/import with exports' },
      { text: 'The npm command to add a dev-only dependency is…', options: ['npm install -D <pkg>', 'npm install --global <pkg>', 'npm run <pkg>', 'npm init'], correctAnswer: 'npm install -D <pkg>' },
      { text: 'An HTTP response body is sent with…', options: ['res.end(body)', 'res.send() only', 'console.log', 'server.close()'], correctAnswer: 'res.end(body)' },
    ],
  },

  // ── W2 · Express & REST APIs ─────────────────────────────────────────────
  {
    week: 2,
    title: 'Express & REST APIs',
    description: 'Building real APIs: routes, middleware, JSON handling and errors that make sense.',
    topics: [
      {
        title: 'Express Basics — Your First API',
        text: 'Express is the standard Node web framework. A minimal app: import express, create the app, define routes with app.get("/path", handler), and app.listen to start.\n\nHandlers receive (req, res). res.json(obj) sends JSON — the universal API format. Route paths can be exact ("/users") or parametric ("/users/:id").\n\nThe request object: req.params (URL variables), req.query (query string), req.body (JSON body — needs express.json() middleware), req.headers.',
        code: 'import express from "express";\nconst app = express();\napp.use(express.json());  // parse JSON bodies\n\napp.get("/", (req, res) => {\n  res.json({ ok: true, message: "API running" });\n});\n\napp.get("/users/:id", (req, res) => {\n  res.json({ userId: req.params.id });\n});\n\napp.listen(3000, () => console.log("API on :3000"));',
        note: 'app.get("/users/:id") → req.params.id. That is 90% of routing. Express just makes the raw server ergonomic.',
      },
      {
        title: 'REST & Routes: GET, POST, PUT, DELETE',
        text: 'REST uses HTTP methods as verbs on resources: GET reads, POST creates, PUT/PATCH updates, DELETE removes. A clean API is noun-based: GET /courses, POST /courses, GET /courses/:id, DELETE /courses/:id.\n\nEach route handler does its job: GET with a param fetches one record; POST validates the body, saves, and returns 201 with the created resource; DELETE returns 204.\n\nStatus codes matter: 200 OK, 201 Created, 204 No Content, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Server Error.',
        code: 'app.post("/courses", (req, res) => {\n  const { title, price } = req.body;\n  if (!title || price === undefined) {\n    return res.status(400).json({ error: "title and price are required" });\n  }\n  const course = createCourse({ title, price });\n  res.status(201).json(course);\n});\n\napp.delete("/courses/:id", (req, res) => {\n  if (!removeCourse(req.params.id)) {\n    return res.status(404).json({ error: "Course not found" });\n  }\n  res.status(204).end();\n});',
        note: 'Verbs + nouns + correct status codes = a REST API. Get the 400/401/404/500 set right and clients understand every response.',
      },
      {
        title: 'Middleware — The Pipeline',
        text: 'Middleware is a function that runs between the request arriving and the route handler: logging, parsing, auth, CORS. app.use(fn) applies it to every route; a route-specific middleware can be the second argument.\n\nA middleware signature: (req, res, next). It does its work, then calls next() to continue the chain — or ends the response itself (e.g. rejecting an unauthorized request).\n\nOrder matters: middleware runs top-to-bottom. express.json() before your routes, auth before protected routes, error handler last.',
        code: '// Logger middleware\napp.use((req, res, next) => {\n  console.log(\`\${req.method} \${req.url}\`);\n  next();\n});\n\n// Protect a route\nfunction requireAuth(req, res, next) {\n  if (!req.user) return res.status(401).json({ error: "Sign in required" });\n  next();\n}\n\napp.get("/account", requireAuth, (req, res) => {\n  res.json(req.user);\n});',
        note: 'Middleware = "do something, then next()". Composition of small middlewares is how Express apps stay clean.',
      },
      {
        title: 'Error Handling & Validation',
        text: 'Handle errors in one place: a final error-handling middleware with four args (err, req, res, next) catches anything passed to next(err). Return a consistent JSON error shape.\n\nExpress 5 also handles rejected promises in async handlers automatically — a thrown error inside a route is caught and forwarded.\n\nValidate input early: check required fields, types and lengths; return 400 with a clear message. Validate the body, not the UI\'s word. Libraries (zod) make validation declarative and typed.',
        code: 'app.get("/courses/:id", async (req, res, next) => {\n  const course = await findCourse(req.params.id);\n  if (!course) return res.status(404).json({ error: "Course not found" });\n  res.json(course);\n});\n\n// Central error handler (must be LAST)\napp.use((err, req, res, next) => {\n  console.error(err);\n  res.status(500).json({ error: "Something went wrong" });\n});',
        note: 'Validation at the door (400), one central error handler (500), consistent JSON shapes. Errors become predictable.',
      },
    ],
    quizzes: [
      { text: 'The route parameter in /users/:id is read from…', options: ['req.params.id', 'req.query.id', 'req.body.id', 'req.url.id'], correctAnswer: 'req.params.id' },
      { text: 'To parse JSON request bodies you add…', options: ['app.use(express.json())', 'app.use(express.urlencoded())', 'a database', 'a router'], correctAnswer: 'app.use(express.json())' },
      { text: 'A successful creation should return…', options: ['200 OK', '201 Created', '204 No Content', '404'], correctAnswer: '201 Created' },
      { text: 'Middleware calls next() to…', options: ['end the request', 'continue to the next middleware/handler', 'restart the server', 'clear the body'], correctAnswer: 'continue to the next middleware/handler' },
    ],
  },

  // ── W3 · Data & Storage ──────────────────────────────────────────────────
  {
    week: 3,
    title: 'Data & Storage',
    description: 'Files, databases and environment config — persisting what your API works with.',
    topics: [
      {
        title: 'Working with Files: the fs Module',
        text: 'The fs module reads and writes files. Prefer the promise API: import fs from "node:fs/promises". await fs.readFile(path, "utf8"), await fs.writeFile(path, data), await fs.readdir(dir).\n\nUse paths relative to process.cwd() or better, resolve them from an absolute base so the app works from any directory. Handle ENOENT (file missing) gracefully.\n\nWhen is a file a good "database"? Small, low-concurrency data — JSON config, simple seeds. For real data, use a real database.',
        code: 'import fs from "node:fs/promises";\n\nexport async function readJson(path) {\n  try {\n    return JSON.parse(await fs.readFile(path, "utf8"));\n  } catch (err) {\n    if (err.code === "ENOENT") return [];  // missing file = empty\n    throw err;\n  }\n}\n\nexport async function writeJson(path, data) {\n  await fs.writeFile(path, JSON.stringify(data, null, 2));\n}',
        note: 'fs/promises + await + a try/catch for ENOENT is the complete file-handling pattern.',
      },
      {
        title: 'Databases & ORMs',
        text: 'For real applications, data lives in a database. Relational (PostgreSQL, MySQL, SQLite) with tables and SQL; document (MongoDB) with flexible JSON documents.\n\nAn ORM/ODM (Prisma, Sequelize, Mongoose) maps database records to JavaScript objects so you write type-checked queries instead of raw SQL strings. Prisma: define models in schema.prisma, run migrations, and query with a typed client.\n\nThe API pattern: route → controller/query → model → database. The route stays thin; data access lives in a layer you can test and change.',
        code: '// Prisma schema (schema.prisma)\nmodel Course {\n  id        String @id\n  title     String\n  price     Int\n  modules   Module[]\n}\n\n// query in code\nconst course = await prisma.course.findUnique({\n  where: { id: req.params.id },\n  include: { modules: true },\n});',
        note: 'Models in one file, queries in one layer, routes thin. An ORM keeps that layer typed and readable.',
      },
      {
        title: 'Models & CRUD Operations',
        text: 'CRUD is the life of an API: Create, Read, Update, Delete. Model your resource with a schema (required fields, defaults, relations), then write the four operations.\n\nRead paths: findMany (list, with filters/pagination), findUnique (one by id). Writes: create, update, delete. Always handle "not found" on single-record reads and updates.\n\nKeep the resource model and its validation as the single source of truth — routes stay thin, business rules live with the model.',
        code: '// controller pattern\nasync function listCourses(req, res) {\n  const { category, page = 1, take = 10 } = req.query;\n  const courses = await prisma.course.findMany({\n    where: category ? { category: { slug: category } } : {},\n    skip: (page - 1) * take, take,\n    orderBy: { title: "asc" },\n  });\n  res.json(courses);\n}\n\nasync function deleteCourse(req, res) {\n  try {\n    await prisma.course.delete({ where: { id: req.params.id } });\n    res.status(204).end();\n  } catch (e) {\n    if (e.code === "P2025") return res.status(404).json({ error: "Not found" });\n    throw e;\n  }\n}',
        note: 'Filter + pagination on list, not-found on single records, delete idempotently. CRUD covers most backend work.',
      },
      {
        title: 'Environment Variables & Configuration',
        text: 'Secrets and settings — DB URLs, ports, API keys — belong in the environment, not in code. Read them from process.env and fail fast if required ones are missing.\n\nThe .env file (with dotenv, or Node\'s built-in --env-file) holds local values; .env.example documents the keys without the secrets; and the real .env is never committed.\n\nCentralize config in one config.js that validates and exports a typed config object — the rest of the app imports config, never process.env directly.',
        code: '// .env\nPORT=3000\nDATABASE_URL="postgresql://user:pass@localhost:5432/nexus"\nJWT_SECRET=change-me\n\n// config.js\nimport "dotenv/config";\nexport const config = {\n  port: Number(process.env.PORT) || 3000,\n  databaseUrl: process.env.DATABASE_URL,\n  jwtSecret: process.env.JWT_SECRET,\n};\nif (!config.databaseUrl || !config.jwtSecret) {\n  throw new Error("DATABASE_URL and JWT_SECRET are required");\n}',
        note: 'Secrets in env, template in .env.example, config centralized and validated. Commit neither .env nor secrets.',
      },
    ],
    quizzes: [
      { text: 'The modern way to read a file in Node is…', options: ['fs.promises/readFile with await', 'fs.readFileSync always', 'XMLHttpRequest', 'a database'], correctAnswer: 'fs.promises/readFile with await' },
      { text: 'ENOENT means…', options: ['the file was found', 'the file does not exist', 'permission denied', 'disk full'], correctAnswer: 'the file does not exist' },
      { text: 'An ORM maps…', options: ['database records to JavaScript objects', 'URLs to routes', 'styles to elements', 'files to folders'], correctAnswer: 'database records to JavaScript objects' },
      { text: 'Secrets should be stored in…', options: ['the code', 'environment variables (.env, never committed)', 'comments', 'the README'], correctAnswer: 'environment variables (.env, never committed)' },
    ],
  },

  // ── W4 · Auth & Security ─────────────────────────────────────────────────
  {
    week: 4,
    title: 'Auth & Security',
    description: 'Passwords, tokens and the security habits that keep user data safe.',
    topics: [
      {
        title: 'Password Hashing — Never Store Plain Text',
        text: 'Never store passwords in plain text — a database leak would hand attackers every login. Hash them with a slow, salted algorithm: bcrypt is the standard (cost factor ~10-12).\n\nbcrypt.hash(password, 12) produces a string that embeds the salt and cost; bcrypt.compare(password, hash) checks a login — it handles the salt automatically.\n\nThe point of a salt + slow hash: even if the DB leaks, cracking each password takes long enough to be worthless. This is the one security feature that is genuinely your responsibility.',
        code: 'import bcrypt from "bcrypt";\n\n// signup\nconst hash = await bcrypt.hash(req.body.password, 12);\nawait prisma.user.create({ data: { email, passwordHash: hash } });\n\n// login\nconst user = await prisma.user.findUnique({ where: { email } });\nif (!user) return res.status(401).json({ error: "Invalid credentials" });\nconst ok = await bcrypt.compare(req.body.password, user.passwordHash);\nif (!ok) return res.status(401).json({ error: "Invalid credentials" });',
        note: 'Hash on signup, compare on login, never store or log the plain password. bcrypt cost 10-12 is the sweet spot.',
      },
      {
        title: 'JWT Authentication',
        text: 'After login, the client needs a token proving who it is. A JWT is a signed, self-contained token: header.payload.signature. The server signs it with a secret; clients send it in the Authorization header; the server verifies it on protected routes.\n\nFlow: login verifies credentials → server signs a token with { userId } → client stores it and sends it with requests → a verify middleware reads req.headers.authorization, verifies the token, and attaches req.user.\n\nKeep the JWT secret strong and env-based, expire tokens (expiresIn: "7d"), and treat tokens with the same care as passwords — they ARE access.',
        code: 'import jwt from "jsonwebtoken";\n\n// login\nconst token = jwt.sign({ userId: user.id }, config.jwtSecret, { expiresIn: "7d" });\nres.json({ token });\n\n// auth middleware\nfunction requireAuth(req, res, next) {\n  const header = req.headers.authorization || "";\n  const token = header.startsWith("Bearer ") ? header.slice(7) : null;\n  if (!token) return res.status(401).json({ error: "Sign in required" });\n  try {\n    req.user = jwt.verify(token, config.jwtSecret);\n    next();\n  } catch {\n    res.status(401).json({ error: "Invalid or expired token" });\n  }\n}',
        note: 'sign on login, verify in middleware, send as "Bearer <token>". That is the complete JWT loop.',
      },
      {
        title: 'Security Basics: CORS, Rate Limiting & Sanitization',
        text: 'An API has an attack surface. Core defenses: CORS (control which origins may call your API — restrict, don\'t use *), rate limiting (express-rate-limit) to blunt brute force, and header hardening (helmet).\n\nInput safety: validate types and lengths, never trust the body, never build SQL by string concat (use the ORM or parameterized queries), and escape/encode any user content you render.\n\nSecurity mindset: fail closed (deny by default), keep dependencies updated (npm audit), don\'t log secrets, and return the least information in errors.',
        code: 'import helmet from "helmet";\nimport rateLimit from "express-rate-limit";\n\napp.use(helmet());\napp.use(cors({ origin: ["https://myapp.com"] }));\napp.use("/api/auth", rateLimit({ windowMs: 15 * 60 * 1000, limit: 100 }));\n\n// never: `SELECT * FROM users WHERE id = \` + input\n// always: prisma or parameterized queries',
        note: 'helmet + restricted CORS + rate limit + parameterized queries covers the top threats. Security is configuration plus discipline.',
      },
      {
        title: 'Async Patterns & Avoiding Common Pitfalls',
        text: 'Async errors: a rejected promise in a route must be caught — in Express 5, async route handlers forward rejections to the error handler automatically; if you throw without handling, the process could crash.\n\nPitfalls: forgetting await (returns a Promise, silently broken), unhandled promise rejections (crash or hang), and doing blocking work in the request path.\n\nProcess hygiene: handle SIGTERM to close the DB and exit cleanly, use PM2 or a process manager in production, and log with structure (a timestamped JSON logger) so crashes are diagnosable.',
        code: '// Express 5: async handlers forward errors automatically\napp.get("/report", async (req, res) => {\n  const data = await generateReport(req.params.id); // throws → error handler\n  res.json(data);\n});\n\n// graceful shutdown\nprocess.on("SIGTERM", async () => {\n  await prisma.$disconnect();\n  server.close(() => process.exit(0));\n});',
        note: 'await everything, catch at the boundary, and exit gracefully. Unhandled rejections are how production crashes.',
      },
    ],
    quizzes: [
      { text: 'Passwords should be stored…', options: ['in plain text', 'as bcrypt hashes with salt', 'encrypted with the JWT secret', 'in logs'], correctAnswer: 'as bcrypt hashes with salt' },
      { text: 'After login, the client proves identity with…', options: ['a signed JWT token', 'its IP address', 'a cookie always', 'the password again'], correctAnswer: 'a signed JWT token' },
      { text: 'The token is sent in…', options: ['the Authorization header as "Bearer <token>"', 'the URL', 'the response body', 'the log'], correctAnswer: 'the Authorization header as "Bearer <token>"' },
      { text: 'To blunt brute-force login attempts you add…', options: ['rate limiting', 'a longer password field', 'a CDN', 'more logging'], correctAnswer: 'rate limiting' },
    ],
  },

  // ── W5 · Building & Deploying ────────────────────────────────────────────
  {
    week: 5,
    title: 'Building & Deploying',
    description: 'A complete API project, a CRUD app, testing and shipping to a real server.',
    topics: [
      {
        title: 'Project — A Course Store API',
        text: 'Build the API behind a course store: resources Course and Category. Endpoints: GET /courses (list, filter by category, paginate), GET /courses/:id, POST /courses (protected, validated), PUT/DELETE.\n\nStructure: routes/ (wiring), controllers or queries (logic), models in the schema. Config in config.js, validation at the door, errors centralized.\n\nDesign the response shape once — course objects include id, title, price, category and module count. Consistent JSON is a contract the frontend builds against.',
        code: '// routes/courses.js\nimport { Router } from "express";\nimport { listCourses, getCourse, createCourse, deleteCourse } from "../controllers/courses.js";\nimport { requireAuth } from "../middleware/auth.js";\n\nconst r = Router();\nr.get("/", listCourses);\nr.get("/:id", getCourse);\nr.post("/", requireAuth, createCourse);\nr.delete("/:id", requireAuth, deleteCourse);\nexport default r;\n\n// index.js mounts it\napp.use("/api/courses", coursesRouter);',
        note: 'One file per resource, Router for wiring, controller for logic. Mount and reuse — that is the professional shape.',
      },
      {
        title: 'Testing Your API',
        text: 'Tests protect the API as it grows. Node\'s built-in test runner + supertest can hit your Express app in-process: create the app, import it in a test, fire requests, assert responses.\n\nTest the contract, not the internals: status codes, response shape, validation errors, auth rejection (401 on protected routes), and not-found (404). Use a test database and seed what you need per test.\n\nThe rule: every route deserves at least one happy-path and one failure-path test. Coverage is a guide, not a goal.',
        code: 'import { test } from "node:test";\nimport assert from "node:assert/strict";\nimport request from "supertest";\nimport app from "./app.js";\n\ntest("GET /api/courses returns courses", async () => {\n  const res = await request(app).get("/api/courses");\n  assert.equal(res.status, 200);\n  assert.ok(Array.isArray(res.body));\n});\n\ntest("POST /api/courses requires auth", async () => {\n  const res = await request(app).post("/api/courses").send({ title: "X" });\n  assert.equal(res.status, 401);\n});',
        note: 'Happy path + failure path per route, asserted against the real app. That is a professional API test suite in miniature.',
      },
      {
        title: 'Deploying to a Server',
        text: 'Deployment moves the app to a machine that runs it forever. Options: a VPS (set up Node + PM2 + Nginx + SSL), or platforms that handle that for you (Render, Railway, Fly.io).\n\nPM2 is the process manager: pm2 start src/index.js keeps the app alive, restarts on crash, and manages logs. Nginx (or a platform reverse proxy) fronts it with SSL.\n\nBefore deploying: config via env on the server, the DB provisioned and migrated, npm install --omit=dev, a health endpoint (/api/health → { ok: true }), and a deploy checklist that includes log access.',
        code: '// pm2 ecosystem (ecosystem.config.cjs)\nmodule.exports = {\n  apps: [{\n    name: "edunexus-api",\n    script: "src/index.js",\n    instances: 1,\n    env: { NODE_ENV: "production" },\n  }],\n};\n\n// health endpoint\napp.get("/api/health", (req, res) => res.json({ ok: true, uptime: process.uptime() }));',
        note: 'Node + PM2 + a reverse proxy with SSL. The health endpoint is your monitoring; a crashed app with no logs is a guessing game.',
      },
      {
        title: 'Project — Full CRUD App & Review',
        text: 'Tie everything together: a full CRUD API with auth, validation, error handling and tests. Add a feature beyond CRUD — search, filtering, pagination or a simple dashboard route that aggregates.\n\nReview checklist: (1) passwords hashed; (2) auth middleware on protected routes; (3) input validated with 400s; (4) one central error handler; (5) config from env; (6) CORS restricted; (7) tests green; (8) npm audit clean; (9) docs: a README with the endpoints.\n\nYou now have the full backend stack: Node + Express + database + auth + deploy. The next step (Full Stack course) connects this API to a React frontend.',
        code: '// README snippet\n## API\n- GET    /api/courses          list (filter ?category=, paginate ?page=)\n- GET    /api/courses/:id      one course\n- POST   /api/courses          create (auth required)\n- DELETE /api/courses/:id      remove (auth required)\n- POST   /api/auth/login       { email, password } → { token }',
        note: 'Ship the README too. An API without documented endpoints is unusable; the docs ARE the product surface.',
      },
    ],
    quizzes: [
      { text: 'The Express class that wires a set of routes is…', options: ['Router', 'app.listen', 'middleware', 'mongoose'], correctAnswer: 'Router' },
      { text: 'A minimal API test suite covers…', options: ['happy path and failure path per route', 'only the database', 'only the frontend', 'nothing'], correctAnswer: 'happy path and failure path per route' },
      { text: 'The process manager that keeps a Node app alive is…', options: ['PM2', 'Nginx alone', 'nodemon in production', 'the browser'], correctAnswer: 'PM2' },
      { text: 'Passwords and auth rules appear in the review checklist as…', options: ['hashed passwords and auth middleware on protected routes', 'only the UI', 'database size', 'server uptime'], correctAnswer: 'hashed passwords and auth middleware on protected routes' },
    ],
  },
];
