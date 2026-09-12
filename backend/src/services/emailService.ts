import nodemailer from 'nodemailer';
import { logger } from '../lib/logger';

/**
 * Outcome of a send attempt, discriminated on `sent`.
 *
 * Callers persist `responseEmailStatus` from this value, so it must never
 * overstate what happened: "no SMTP configured" and "the transport rejected it"
 * are both `sent: false`, and nothing else is allowed to look like success.
 */
export type MailResult =
  | { sent: true; messageId: string }
  | { sent: false; reason: 'NOT_CONFIGURED' | 'SEND_FAILED'; error?: string };

export interface MailOptions {
  to: string;
  subject: string;
  html: string;
  text: string;
}

interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  user?: string;
  pass?: string;
  from: string;
}

/**
 * SMTP settings come from the environment:
 * SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM (+ existing ADMIN_EMAIL
 * as the last-resort From address).
 *
 * `null` means this deployment has no mail transport configured. That is a
 * supported state, not an error — the API stays fully usable without an SMTP
 * account, and a missing configuration is reported instead of guessed at.
 */
const readSmtpConfig = (): SmtpConfig | null => {
  const host = process.env.SMTP_HOST;
  if (!host) return null;

  // SMTP_FROM wins, then the authenticated mailbox, then the site admin address,
  // so a configured deployment always sends from a real address.
  const from = process.env.SMTP_FROM || process.env.SMTP_USER || process.env.ADMIN_EMAIL;
  if (!from) {
    logger.error('[email] SMTP_HOST is set but no From address could be resolved (SMTP_FROM / SMTP_USER / ADMIN_EMAIL) — mail disabled.');
    return null;
  }

  // 465 is implicit TLS; every other port negotiates STARTTLS.
  const port = parseInt(process.env.SMTP_PORT || '587', 10);

  return {
    host,
    port,
    secure: port === 465,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from,
  };
};

/**
 * Send one mail. Never throws: a transport error is returned as
 * `{ sent: false, reason: 'SEND_FAILED' }` so the caller can record delivery
 * state and still keep the admin's decision.
 */
export const sendMail = async (options: MailOptions): Promise<MailResult> => {
  const config = readSmtpConfig();
  if (!config) {
    logger.info(`[email] SMTP not configured — not sent: "${options.subject}" -> ${options.to}`);
    return { sent: false, reason: 'NOT_CONFIGURED' };
  }

  try {
    // Built per send (no cached transporter): constructing a transport does no
    // network I/O, so this costs nothing measurable and avoids holding a stale
    // connection or environment across the process lifetime.
    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      // Some internal relays accept unauthenticated mail; only send credentials
      // when a full user/pass pair actually exists.
      auth: config.user && config.pass ? { user: config.user, pass: config.pass } : undefined,
    });

    const info = await transporter.sendMail({
      from: config.from,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });

    return { sent: true, messageId: info.messageId };
  } catch (error: any) {
    logger.error(`[email] send failed: "${options.subject}" -> ${options.to}`, error);
    return { sent: false, reason: 'SEND_FAILED', error: error?.message || String(error) };
  }
};

/** Human-readable label for an application status (emails must not show raw codes). */
const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pending review',
  UNDER_REVIEW: 'Under review',
  APPROVED: 'Approved',
  REJECTED: 'Not selected',
  NEED_MORE_INFO: 'More information needed',
};

const statusLabel = (status: string): string => STATUS_LABELS[status] || status;

/** Escape user/admin authored text before it goes into the HTML body. */
const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export interface InternshipResponseEmailInput {
  studentName: string;
  programTitle: string;
  status: string;
  adminResponse?: string | null;
}

/**
 * Notify a student of the decision on their internship application.
 * Returns the send outcome so the caller can record `responseEmailStatus`
 * truthfully — the admin's response is saved either way.
 */
export const sendInternshipResponseEmail = async (
  to: string,
  { studentName, programTitle, status, adminResponse }: InternshipResponseEmailInput
): Promise<MailResult> => {
  const label = statusLabel(status);
  const subject = `Update on your ${programTitle} application — ${label}`;

  const responseBlock = adminResponse?.trim();

  const text = [
    `Hello ${studentName},`,
    '',
    `Your application for the ${programTitle} internship has been reviewed.`,
    `Current status: ${label}.`,
    ...(responseBlock ? ['', 'Message from the EduNexus Pro team:', responseBlock] : []),
    '',
    'You can see the full status of this application any time in your dashboard at https://edunexus.kibm.in.',
    '',
    'Regards,',
    'EduNexus Pro',
  ].join('\n');

  const html = `<!doctype html>
<html>
  <body style="margin:0;padding:24px;background:#f4f5f7;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
    <div style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:8px;padding:32px;">
      <h1 style="margin:0 0 8px;font-size:20px;color:#111827;">EduNexus Pro</h1>
      <p style="margin:0 0 24px;font-size:14px;color:#6b7280;">Internship application update</p>

      <p style="margin:0 0 16px;font-size:15px;">Hello ${escapeHtml(studentName)},</p>
      <p style="margin:0 0 16px;font-size:15px;">
        Your application for the <strong>${escapeHtml(programTitle)}</strong> internship has been reviewed.
      </p>

      <p style="margin:0 0 24px;font-size:15px;">
        Current status:
        <span style="display:inline-block;padding:2px 10px;border-radius:12px;background:#eef2ff;color:#3730a3;font-weight:bold;">
          ${escapeHtml(label)}
        </span>
      </p>
      ${
        responseBlock
          ? `<div style="margin:0 0 24px;padding:16px;background:#f9fafb;border-left:4px solid #4f46e5;border-radius:4px;">
        <p style="margin:0 0 8px;font-size:13px;font-weight:bold;color:#374151;">Message from the EduNexus Pro team</p>
        <p style="margin:0;font-size:15px;white-space:pre-wrap;">${escapeHtml(responseBlock)}</p>
      </div>`
          : ''
      }

      <p style="margin:0 0 24px;font-size:14px;color:#4b5563;">
        You can see the full status of this application any time in your dashboard.
      </p>

      <p style="margin:0;font-size:14px;color:#6b7280;">Regards,<br />EduNexus Pro</p>
    </div>
  </body>
</html>`;

  return sendMail({ to, subject, html, text });
};
