import { Request, Response, NextFunction } from 'express';
import { logger } from '../lib/logger';

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Background worker to periodically prune expired rate-limit records every 5 minutes to prevent memory leaks (Issue #9)
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(ip);
    }
  }
}, 5 * 60 * 1000).unref(); // unref() lets the process exit cleanly if idle

export const rateLimiter = (limit: number, windowMs: number) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // SECURITY: never fall back to the client-controlled X-Forwarded-For header —
    // a caller could rotate it and bypass the limiter entirely. req.ip respects
    // the trust-proxy setting (see index.ts) and is the only trustworthy source.
    const ip = (req.ip || req.socket.remoteAddress || 'unknown') as string;
    // Key on ip + ROUTE PATTERN (e.g. /verify/:credentialId), not the concrete
    // path, so each endpoint gets its own budget while dynamic segments share one:
    // keying on the concrete path gave every credential/challenge id a fresh
    // budget, which made enumeration and brute-force per id unthrottled.
    const routePath = (req as any).route?.path || req.path;
    const key = `${ip}:${req.baseUrl}${routePath}`;
    const now = Date.now();
    const record = rateLimitStore.get(key);

    if (!record || now > record.resetTime) {
      rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
      return next();
    }

    record.count++;
    if (record.count > limit) {
      logger.error(`Security Check: Rate limit exceeded for IP: ${ip} on path ${req.baseUrl}${req.path}`);
      return res.status(429).json({
        message: 'Too many requests from this device. Please try again later.'
      });
    }

    next();
  };
};
