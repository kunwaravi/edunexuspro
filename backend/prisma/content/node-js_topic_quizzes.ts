/**
 * Node.js — per-topic quizzes. Keyed by the EXACT topic titles in node-js.ts
 * (topic-lock flow). 4 questions per topic, 4 options, 1 correct.
 * Distinct from the chapter-quiz texts in node-js.ts.
 */
import type { TopicQuizMap } from './types';

export const TOPIC_QUIZZES: TopicQuizMap = {
  // ── W1 ───────────────────────────────────────────────────────────────────
  'What Node.js Is & The Event Loop': [
    { text: 'Node.js runs…', options: ['only in the browser', 'JavaScript outside the browser, powered by V8', 'PHP', 'only on Windows'], correctAnswer: 'JavaScript outside the browser, powered by V8' },
    { text: 'The event loop\'s key property is…', options: ['blocking I/O', 'never blocking on I/O', 'one thread per connection', 'synchronous everything'], correctAnswer: 'never blocking on I/O' },
    { text: 'A synchronous file read in the request path…', options: ['blocks the whole process', 'is the fastest option', 'only affects one user', 'is recommended'], correctAnswer: 'blocks the whole process' },
    { text: 'Blocking work in a single-threaded server means…', options: ['all other requests wait', 'only one request works', 'the CPU is free', 'nothing happens'], correctAnswer: 'all other requests wait' },
  ],
  'npm, package.json & Node Scripts': [
    { text: 'package.json is…', options: ['the app\'s manifest: dependencies, scripts, entry point', 'a database', 'a CSS file', 'a lock on node_modules'], correctAnswer: 'the app\'s manifest: dependencies, scripts, entry point' },
    { text: 'npm install -D is for…', options: ['production dependencies', 'dev-only tools like testing frameworks', 'global tools', 'nothing'], correctAnswer: 'dev-only tools like testing frameworks' },
    { text: 'node_modules should be…', options: ['committed to git', 'regenerated via npm install; never committed', 'hand-edited', 'deleted always'], correctAnswer: 'regenerated via npm install; never committed' },
    { text: 'package-lock.json should be…', options: ['committed, for reproducible installs', 'deleted', 'ignored forever', 'committed never'], correctAnswer: 'committed, for reproducible installs' },
  ],
  'Modules: require vs import': [
    { text: 'The modern module system uses…', options: ['import / export', 'require / module.exports', 'include', 'use'], correctAnswer: 'import / export' },
    { text: 'The package.json field that makes .js files ES modules is…', options: ['"type": "module"', '"module": true', '"esm": true', '"type": "commonjs"'], correctAnswer: '"type": "module"' },
    { text: 'The primary export of a module is declared with…', options: ['export default', 'export named', 'export all', 'module.export'], correctAnswer: 'export default' },
    { text: 'Modules provide…', options: ['encapsulation — only what you export is visible', 'faster code', 'automatic testing', 'styles'], correctAnswer: 'encapsulation — only what you export is visible' },
  ],
  'Your First HTTP Server': [
    { text: 'The module that creates an HTTP server is…', options: ['node:http', 'node:fs', 'node:path', 'node:os'], correctAnswer: 'node:http' },
    { text: 'The server starts listening with…', options: ['server.listen(PORT)', 'server.start()', 'server.open()', 'listen(server)'], correctAnswer: 'server.listen(PORT)' },
    { text: 'The URL of an incoming request is on…', options: ['req.url', 'res.url', 'req.path', 'res.path'], correctAnswer: 'req.url' },
    { text: 'Express is…', options: ['a database', 'sugar on top of Node\'s http module', 'a new language', 'a bundler'], correctAnswer: 'sugar on top of Node\'s http module' },
  ],

  // ── W2 ───────────────────────────────────────────────────────────────────
  'Express Basics — Your First API': [
    { text: 'To send a JSON response you use…', options: ['res.json(obj)', 'res.end(text)', 'res.html()', 'console.log'], correctAnswer: 'res.json(obj)' },
    { text: 'The :id in /users/:id is a…', options: ['route parameter', 'query parameter', 'body field', 'header'], correctAnswer: 'route parameter' },
    { text: 'Query string values are read from…', options: ['req.query', 'req.params', 'req.body', 'req.headers'], correctAnswer: 'req.query' },
    { text: 'express.json() parses…', options: ['JSON request bodies', 'query strings', 'URL parameters', 'headers'], correctAnswer: 'JSON request bodies' },
  ],
  'REST & Routes: GET, POST, PUT, DELETE': [
    { text: 'POST is for…', options: ['reading', 'creating resources', 'updating resources', 'deleting'], correctAnswer: 'creating resources' },
    { text: 'A RESTful collection path is…', options: ['noun-based: /courses, /courses/:id', 'verb-based: /getCourse', 'file-based: /course.html', 'random'], correctAnswer: 'noun-based: /courses, /courses/:id' },
    { text: 'The status for "resource not found" is…', options: ['200', '404', '500', '201'], correctAnswer: '404' },
    { text: 'A successful DELETE returns…', options: ['201 Created', '204 No Content', '200 with the body', '404'], correctAnswer: '204 No Content' },
  ],
  'Middleware — The Pipeline': [
    { text: 'Middleware runs…', options: ['after the route handler', 'between the request arriving and the route handler', 'only at startup', 'on the client'], correctAnswer: 'between the request arriving and the route handler' },
    { text: 'To continue to the next middleware you call…', options: ['next()', 'done()', 'continue()', 'res.end()'], correctAnswer: 'next()' },
    { text: 'Middleware order is…', options: ['top to bottom — order matters', 'random', 'alphabetical', 'bottom to top'], correctAnswer: 'top to bottom — order matters' },
    { text: 'An auth middleware can end a request by…', options: ['returning 401 instead of calling next()', 'calling next() twice', 'logging in', 'throwing'], correctAnswer: 'returning 401 instead of calling next()' },
  ],
  'Error Handling & Validation': [
    { text: 'The error-handling middleware has…', options: ['four args (err, req, res, next)', 'three args like normal', 'no args', 'two args'], correctAnswer: 'four args (err, req, res, next)' },
    { text: 'Invalid input should return…', options: ['400 with a clear message', '500 silently', '404', '200 with garbage'], correctAnswer: '400 with a clear message' },
    { text: 'The central error handler returns…', options: ['a consistent JSON error shape', 'a web page', 'the stack trace to clients', 'nothing'], correctAnswer: 'a consistent JSON error shape' },
    { text: 'Express 5 async route handlers…', options: ['forward rejections to the error handler automatically', 'crash the process', 'ignore errors', 'retry forever'], correctAnswer: 'forward rejections to the error handler automatically' },
  ],

  // ── W3 ───────────────────────────────────────────────────────────────────
  'Working with Files: the fs Module': [
    { text: 'The promise-based fs API is imported as…', options: ['import fs from "node:fs/promises"', 'import fs from "node:http"', 'require("fs").promise()', 'import file from "fs"'], correctAnswer: 'import fs from "node:fs/promises"' },
    { text: 'ENOENT means…', options: ['file exists', 'file does not exist', 'bad permission', 'disk full'], correctAnswer: 'file does not exist' },
    { text: 'A file is a reasonable data store when…', options: ['data is small and low-concurrency', 'you have millions of rows', 'users log in', 'you need relations'], correctAnswer: 'data is small and low-concurrency' },
    { text: 'For real application data you use…', options: ['a real database', 'a text file', 'the clipboard', 'a CDN'], correctAnswer: 'a real database' },
  ],
  'Databases & ORMs': [
    { text: 'An ORM lets you…', options: ['query the database with typed objects instead of raw SQL strings', 'style the UI', 'compile JavaScript', 'deploy the server'], correctAnswer: 'query the database with typed objects instead of raw SQL strings' },
    { text: 'A relational database example is…', options: ['PostgreSQL', 'a JSON file', 'a folder', 'the browser cache'], correctAnswer: 'PostgreSQL' },
    { text: 'MongoDB stores data as…', options: ['flexible JSON documents', 'spreadsheets', 'HTML', 'CSV'], correctAnswer: 'flexible JSON documents' },
    { text: 'The recommended pattern is…', options: ['thin routes, data access in a separate layer', 'all logic in routes', 'queries in the frontend', 'no data layer'], correctAnswer: 'thin routes, data access in a separate layer' },
  ],
  'Models & CRUD Operations': [
    { text: 'CRUD stands for…', options: ['Create, Read, Update, Delete', 'Copy, Run, Undo, Delete', 'Create, Read, Update, Drop', 'Compile, Run, Update, Debug'], correctAnswer: 'Create, Read, Update, Delete' },
    { text: 'A list endpoint should support…', options: ['filters and pagination', 'nothing', 'authentication only', 'file uploads'], correctAnswer: 'filters and pagination' },
    { text: 'A single-record read that finds nothing returns…', options: ['200 empty', '404', '500', '201'], correctAnswer: '404' },
    { text: 'Business rules and validation belong…', options: ['with the model, as the single source of truth', 'in every route copy-pasted', 'in the frontend', 'in the README'], correctAnswer: 'with the model, as the single source of truth' },
  ],
  'Environment Variables & Configuration': [
    { text: 'The file that documents config keys without secrets is…', options: ['.env.example', '.env', 'config.json', 'node_modules'], correctAnswer: '.env.example' },
    { text: 'The real .env file…', options: ['is committed', 'is never committed — it holds secrets', 'lives in the browser', 'is the database'], correctAnswer: 'is never committed — it holds secrets' },
    { text: 'Missing required config should…', options: ['fail fast with a clear error', 'use empty strings', 'start anyway', 'be ignored'], correctAnswer: 'fail fast with a clear error' },
    { text: 'The rest of the app should read config via…', options: ['a central config module, not process.env everywhere', 'process.env directly in each file', 'the UI', 'a JSON file in public/'], correctAnswer: 'a central config module, not process.env everywhere' },
  ],

  // ── W4 ───────────────────────────────────────────────────────────────────
  'Password Hashing — Never Store Plain Text': [
    { text: 'The recommended hashing algorithm is…', options: ['bcrypt (slow, salted)', 'MD5', 'SHA-1 alone', 'base64'], correctAnswer: 'bcrypt (slow, salted)' },
    { text: 'The salt…', options: ['makes identical passwords hash differently', 'is a password', 'is the username', 'does nothing'], correctAnswer: 'makes identical passwords hash differently' },
    { text: 'A typical bcrypt cost factor is…', options: ['10-12', '1', '1000', '0'], correctAnswer: '10-12' },
    { text: 'To check a login you use…', options: ['bcrypt.compare(password, hash)', 'password === stored', 'a hash of the hash', 'the database'], correctAnswer: 'bcrypt.compare(password, hash)' },
  ],
  'JWT Authentication': [
    { text: 'A JWT is…', options: ['a signed, self-contained token (header.payload.signature)', 'an encrypted password', 'a cookie', 'a user profile'], correctAnswer: 'a signed, self-contained token (header.payload.signature)' },
    { text: 'The client sends the token in…', options: ['the Authorization header as Bearer', 'the URL', 'the request body always', 'the Referer header'], correctAnswer: 'the Authorization header as Bearer' },
    { text: 'The server verifies a token with…', options: ['jwt.verify(token, secret)', 'jwt.decode(token)', 'a database lookup of the token string', 'the password'], correctAnswer: 'jwt.verify(token, secret)' },
    { text: 'Tokens should…', options: ['expire (expiresIn) and use a strong env secret', 'never expire', 'be stored in the console', 'be shared'], correctAnswer: 'expire (expiresIn) and use a strong env secret' },
  ],
  'Security Basics: CORS, Rate Limiting & Sanitization': [
    { text: 'CORS controls…', options: ['which origins may call your API', 'the database schema', 'the port', 'the fonts'], correctAnswer: 'which origins may call your API' },
    { text: 'The security middleware that sets safe HTTP headers is…', options: ['helmet', 'cors with *', 'express.json', 'body-parser'], correctAnswer: 'helmet' },
    { text: 'The SQL-injection-safe approach is…', options: ['parameterized queries / the ORM', 'string concatenation', 'template literals into SQL', 'stored procedures only'], correctAnswer: 'parameterized queries / the ORM' },
    { text: 'The security mindset is…', options: ['fail closed, deny by default', 'fail open for convenience', 'trust the client', 'log everything raw'], correctAnswer: 'fail closed, deny by default' },
  ],
  'Async Patterns & Avoiding Common Pitfalls': [
    { text: 'Forgetting await…', options: ['returns a Promise and silently breaks', 'throws immediately', 'is fine', 'doubles the data'], correctAnswer: 'returns a Promise and silently breaks' },
    { text: 'An unhandled promise rejection…', options: ['can crash the process', 'is always caught', 'is ignored', 'is good'], correctAnswer: 'can crash the process' },
    { text: 'Graceful shutdown handles…', options: ['SIGTERM: close the DB and exit cleanly', 'every request', 'the frontend', 'the logs'], correctAnswer: 'SIGTERM: close the DB and exit cleanly' },
    { text: 'In production, logs should be…', options: ['structured and timestamped so crashes are diagnosable', 'console.log with no timestamps', 'deleted', 'sent to the browser'], correctAnswer: 'structured and timestamped so crashes are diagnosable' },
  ],

  // ── W5 ───────────────────────────────────────────────────────────────────
  'Project — A Course Store API': [
    { text: 'The wiring file that groups a resource\'s routes is…', options: ['a Router', 'the error handler', 'the config', 'a middleware'], correctAnswer: 'a Router' },
    { text: 'The recommended project structure is…', options: ['routes/ + controllers/ + model layer', 'everything in index.js', 'one giant file', 'no structure'], correctAnswer: 'routes/ + controllers/ + model layer' },
    { text: 'A consistent JSON response shape matters because…', options: ['the frontend builds against it as a contract', 'it is prettier', 'the database needs it', 'it is faster'], correctAnswer: 'the frontend builds against it as a contract' },
    { text: 'Course objects should include…', options: ['id, title, price, category and module count', 'only the title', 'the whole database', 'the server uptime'], correctAnswer: 'id, title, price, category and module count' },
  ],
  'Testing Your API': [
    { text: 'supertest lets you…', options: ['hit your Express app in-process and assert responses', 'deploy the app', 'style responses', 'write SQL'], correctAnswer: 'hit your Express app in-process and assert responses' },
    { text: 'The minimum per route is…', options: ['one happy path and one failure path', 'a screenshot', 'an integration with the frontend', 'nothing'], correctAnswer: 'one happy path and one failure path' },
    { text: 'An auth test for a protected route expects…', options: ['401 without a token', '200 always', '500', 'a redirect'], correctAnswer: '401 without a token' },
    { text: 'Tests should run against…', options: ['a test database', 'production data', 'the live site', 'a spreadsheet'], correctAnswer: 'a test database' },
  ],
  'Deploying to a Server': [
    { text: 'The process manager that keeps the app running and restarts on crash is…', options: ['PM2', 'the browser', 'nodemon', 'Nginx alone'], correctAnswer: 'PM2' },
    { text: 'SSL is typically provided by…', options: ['a reverse proxy like Nginx (or the platform)', 'the app itself', 'a database', 'the client'], correctAnswer: 'a reverse proxy like Nginx (or the platform)' },
    { text: 'A health endpoint…', options: ['lets you monitor that the app is up', 'logs users in', 'deploys the app', 'replaces tests'], correctAnswer: 'lets you monitor that the app is up' },
    { text: 'Production installs skip dev tools with…', options: ['npm install --omit=dev', 'npm install -D', 'npm run dev', 'rm node_modules'], correctAnswer: 'npm install --omit=dev' },
  ],
  'Project — Full CRUD App & Review': [
    { text: 'The final review checklist includes…', options: ['hashed passwords, auth on protected routes, validation, config from env', 'only the UI', 'server uptime', 'the frontend design'], correctAnswer: 'hashed passwords, auth on protected routes, validation, config from env' },
    { text: 'npm audit checks…', options: ['dependency vulnerabilities', 'the frontend', 'the database', 'the password strength'], correctAnswer: 'dependency vulnerabilities' },
    { text: 'An API without documented endpoints…', options: ['is unusable — the README is part of the product', 'is fine', 'is faster', 'is more secure'], correctAnswer: 'is unusable — the README is part of the product' },
    { text: 'The natural next step after this course is…', options: ['connecting the API to a React frontend (full stack)', 'rewriting it in PHP', 'stopping', 'deleting the API'], correctAnswer: 'connecting the API to a React frontend (full stack)' },
  ],
};
