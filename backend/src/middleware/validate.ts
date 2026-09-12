import { Request, Response, NextFunction } from 'express';
import { logger } from '../lib/logger';

// Assignment weeks map onto a quarter of the course each (week 1 → 25%, … 4 → 100%).
export const ASSIGNMENT_WEEKS_PER_COURSE = 4;

/**
 * Accept only link values that are safe to hand back to a browser as an href:
 * absolute http(s) or a root-relative asset path. Everything else — most
 * importantly `javascript:`/`data:`/`vbscript:` and protocol-relative `//host`
 * — is rejected, because these URLs are stored verbatim and later rendered as
 * clickable links in the admin review console (stored XSS against admins).
 * Returns the trimmed URL, or null when the value is not a usable link.
 */
export const sanitizeLinkUrl = (value: unknown, maxLength = 2048): string | null => {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > maxLength) return null;
  if (!/^(https?:\/\/[^\s<>"']+|\/(?!\/)[^\s<>"']*)$/.test(trimmed)) return null;
  return trimmed;
};

/** Strip path separators / control characters so a client-supplied file name can
 *  never escape the upload path it is interpolated into. */
export const sanitizeFileName = (value: unknown, maxLength = 120): string | null => {
  if (typeof value !== 'string') return null;
  const cleaned = value.replace(/[^A-Za-z0-9._-]/g, '_').replace(/^\.+/, '').slice(0, maxLength);
  return cleaned || null;
};

export const validateBody = (requiredFields: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const missingFields: string[] = [];
    for (const field of requiredFields) {
      if (req.body[field] === undefined || req.body[field] === null || req.body[field] === '') {
        missingFields.push(field);
      }
    }
    if (missingFields.length > 0) {
      logger.error(`Validation Check: Missing required fields: ${missingFields.join(', ')}`);
      return res.status(400).json({
        message: `Validation Error: Missing required fields: ${missingFields.join(', ')}`
      });
    }
    next();
  };
};
