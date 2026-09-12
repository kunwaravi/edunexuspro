// Import env FIRST so dotenv.config() runs before any other module reads
// process.env at import time (SECURITY #65 — required secrets must be present).
import './lib/env';
import express from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import prisma from './lib/prisma';
import { logger } from './lib/logger';
import authRoutes from './routes/auth';
import courseRoutes from './routes/course';
import quizRoutes from './routes/quiz';
import certificateRoutes from './routes/certificate';
// Two distinct internship surfaces share this file after the merge:
//  - /api/internships        → the Internship Management console (records +
//                              certificate issuance), imported as `internshipRoutes`
//  - /api/internship         → the programme catalogue + application workflow
//                              (browse → apply → admin review)
// They are separate features with separate models, so they keep separate
// imports rather than being folded into one router.
import internshipRoutes from './routes/internships';
import paymentRoutes from './routes/payment';
import practiceRoutes from './routes/practice';
import forumRoutes from './routes/forum';
import assignmentRoutes from './routes/assignment';
import projectRoutes from './routes/project';
import contactRoutes from './routes/contact';
import challengeRoutes from './routes/challenge';
import sandboxRoutes from './routes/sandbox';
import statsRoutes from './routes/stats';
import internshipProgramRoutes from './routes/internship';
import internshipAdminRoutes from './routes/internshipAdmin';
import { errorHandler } from './middleware/errorHandler';

// Required-secret validation now happens inside getRequiredEnv() at import time
// (src/lib/env.ts). These explicit guards remain as a clear, logged fatal stop
// in case a secret is removed from the environment after startup.
if (!process.env.JWT_SECRET) {
  logger.error("FATAL ERROR: JWT_SECRET environment variable is not defined.");
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

// Behind nginx, `req.ip` is the proxy's address unless Express is told how many
// hops to trust. Without this every visitor shares one rate-limit bucket, so a
// handful of bad logins from anyone locks out everyone — and no attacker is
// actually throttled. 1 = the single nginx hop in front of the app container.
app.set('trust proxy', 1);

// Security headers. The frontend keeps its JWT in localStorage, so a script
// injection is a token-theft path — the CSP is the backstop, not decoration.
// `crossOriginResourcePolicy` is relaxed because course banners are served from
// /static and consumed by the separate frontend origin.
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"], // Tailwind injects inline styles
      imgSrc: ["'self'", 'data:', 'blob:'],
      connectSrc: ["'self'"],
      objectSrc: ["'none'"],
      frameAncestors: ["'none'"],
      baseUri: ["'self'"],
    },
  },
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

app.use(cookieParser());

// CORS: accept a comma-separated list (CORS_ORIGIN="https://a.com,https://b.com").
// In development, localhost dev-server origins are added automatically so the
// browser can reach the API without the "blocked by CORS" failure on login.
const configuredOrigins = (process.env.CORS_ORIGIN || 'https://edunexus.kibm.in')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const allowedOrigins =
  process.env.NODE_ENV === 'development'
    ? [...configuredOrigins, 'http://localhost:5173', 'http://127.0.0.1:5173']
    : configuredOrigins;

app.use(cors({
  // Allow requests with no Origin header (curl, server-to-server, health checks).
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

// Restrict incoming payload sizes to prevent heap-exhaustion DoS.
// 1mb (was 10kb) — forum posts, quiz submissions, and assignment/project
// submissions legitimately exceed 10kb and were being rejected with a bare 413.
app.use(express.json({ limit: '1mb' }));

// TASK 6: static course-banner assets. Banner URLs are stored in the DB
// (`Course.banner`) and served from /static — the API stays the single source
// of truth for which banner belongs to which course. SVGs are ~1–4 KB each,
// resolution-independent, and need no external host.
app.use('/static', express.static(path.join(__dirname, '../public')));

// NOTE: No global CSRF middleware. Auth is JWT Bearer via the Authorization
// header (not a browser-auto-sent cookie), so classic cross-site request
// forgery does not apply — a cookie is never present on the wire. The previous
// `x-requested-with: XMLHttpRequest` check was trivially forgeable by any
// page's fetch() and gave only false confidence, so it was removed.

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/certificate', certificateRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/practice', practiceRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/sandbox', sandboxRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/internship', internshipProgramRoutes);
app.use('/api/internship/admin', internshipAdminRoutes);

// Health Check Instrumentation Endpoint
app.get('/health', async (req, res) => {
  try {
    // Assert active database connection
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: 'OK',
      database: 'CONNECTED',
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    logger.error('Health check database connection failure:', err);
    res.status(500).json({
      status: 'ERROR',
      database: 'DISCONNECTED',
      error: err.message || String(err)
    });
  }
});

app.get('/', (req, res) => {
  res.send('EduNexus Pro API is running');
});

// Centralized error handler
app.use(errorHandler);

const server = app.listen(PORT, () => {
  logger.info(`Server successfully started and listening on port ${PORT}`);
});

// Graceful Connection Teardown Handler
const gracefulShutdown = async (signal: string) => {
  logger.info(`Process received ${signal} signal. Starting graceful teardown...`);
  
  server.close(async () => {
    logger.info('Express server closed successfully.');
    try {
      await prisma.$disconnect();
      logger.info('Prisma database client disconnected cleanly.');
      process.exit(0);
    } catch (err) {
      logger.error('Failed to cleanly disconnect Prisma client during exit:', err);
      process.exit(1);
    }
  });

  // Force shutdown after timeout
  setTimeout(() => {
    logger.error('Graceful shutdown timeout exceeded. Forcing immediate exit.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

export { app };
