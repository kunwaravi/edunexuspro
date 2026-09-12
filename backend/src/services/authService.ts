import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import prisma from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { getRequiredEnv } from '../lib/env';

// SECURITY (#65): fail-fast — no hardcoded fallback secret.
const JWT_SECRET = getRequiredEnv('JWT_SECRET');

const generateReferralCode = (name: string) => {
  const cleanName = name.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 6);
  const randomSuffix = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `REF-${cleanName}-${randomSuffix}`;
};

// --- Password-reset token hardening (M-001) -------------------------------
// The raw reset token is short-lived, single-use and never persisted. Only a
// SHA-256 digest is stored (in the existing `resetToken` column) so a database
// leak never yields a usable token. The raw value is generated solely to be
// delivered to the user through a channel outside this function.
const RESET_TOKEN_EXPIRY_MS = 60 * 60 * 1000; // 1 hour (existing expiry window)

const generateResetToken = (): string => crypto.randomBytes(32).toString('hex');

const hashResetToken = (token: string): string =>
  crypto.createHash('sha256').update(token).digest('hex');

export const getReferralStats = async (referralCode: string | null) => {
  if (!referralCode) {
    return {
      referralCount: 0,
      referralPaidCount: 0,
      referralSuccess: false
    };
  }

  const referredUsers = await prisma.user.findMany({
    where: {
      referredBy: {
        equals: referralCode,
        mode: 'insensitive'
      }
    },
    include: {
      payments: {
        where: {
          status: 'VERIFIED'
        }
      }
    }
  });

  const referralCount = referredUsers.length;
  const referralPaidCount = referredUsers.filter(u => u.payments.length > 0).length;
  const referralSuccess = referralCount >= 15 && referralPaidCount >= 5;

  return {
    referralCount,
    referralPaidCount,
    referralSuccess
  };
};

export const registerUser = async (userData: any) => {
  const { email, password, name, fatherName, collegeName, branchName, referredBy } = userData;
  
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new AppError('User already exists', 400);
  }

  // Validate referredBy if provided
  let validReferredBy: string | null = null;
  if (referredBy) {
    const normalizedReferredBy = referredBy.trim().toUpperCase();
    const referrer = await prisma.user.findUnique({
      where: { referralCode: normalizedReferredBy }
    });
    if (referrer) {
      validReferredBy = normalizedReferredBy;
    } else {
      throw new AppError('The referral code entered does not exist. Please check the code or register without it.', 400);
    }
  }

  const referralCode = generateReferralCode(name);
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      fatherName,
      collegeName,
      branchName,
      referralCode,
      referredBy: validReferredBy
    },
    include: {
      progresses: true,
      results: true
    }
  });

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1d' });
  
  const stats = await getReferralStats(user.referralCode);
  
  // Omit password from return
  const { password: _, ...userWithoutPassword } = user;
  return { token, user: { ...userWithoutPassword, ...stats } };
};

// #86 + M-001: forgot-password flow. Anti-enumeration: the response is
// identical whether or not the account exists, and no reset credential is ever
// exposed in the HTTP response. Only a SHA-256 hash of the token is persisted.
// NOTE: there is no mailer in this deployment — the raw token must be delivered
// to the user's inbox by a real email send (follow-up task; M-001 report).
export const forgotPassword = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  // Token work is performed on both paths so the response timing does not
  // reveal whether the account exists (rate-limit 5/min also applies).
  const resetToken = generateResetToken();
  const resetTokenHash = hashResetToken(resetToken);
  const resetTokenExpires = new Date(Date.now() + RESET_TOKEN_EXPIRY_MS);

  if (user) {
    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken: resetTokenHash, resetTokenExpires }
    });
    // TODO(M-001 follow-up): deliver `resetToken` to `email` via a real email
    // send. Never log it, never return it in an API response.
  }

  return { sent: true };
};

export const resetPassword = async (token: string, newPassword: string) => {
  if (!token) throw new AppError('Reset token is required', 400);

  // Look up by the same digest used at issuance; the plaintext token itself is
  // never stored or queried.
  const user = await prisma.user.findFirst({
    where: { resetToken: hashResetToken(token) }
  });

  if (!user || !user.resetTokenExpires || user.resetTokenExpires < new Date()) {
    throw new AppError('This reset link is invalid or has expired. Please request a new one.', 400);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Single-use: clearing the stored hash makes the same token unusable again.
  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpires: null
    }
  });

  return { success: true };
};

// bcrypt digest of a random local password, compared against when the account
// does not exist so both login paths pay the same hashing cost. Without it the
// response time reveals whether an email is registered (user enumeration).
const ABSENT_USER_HASH = '$2b$10$gdh207ewUBP7et3MKymIUedHIGnUcgEJ.w1S1sY.SekRblN/aDNJG';

export const loginUser = async (credentials: any) => {
  const { email, password } = credentials;

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      progresses: true,
      results: true
    }
  });

  if (!user) {
    await bcrypt.compare(password, ABSENT_USER_HASH);
    throw new AppError('Invalid credentials', 400);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError('Invalid credentials', 400);
  }

  // Backfill referralCode if missing
  if (!user.referralCode) {
    const generatedCode = generateReferralCode(user.name);
    await prisma.user.update({
      where: { id: user.id },
      data: { referralCode: generatedCode }
    });
    user.referralCode = generatedCode;
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1d' });
  
  const stats = await getReferralStats(user.referralCode);

  // Omit password from return
  const { password: _, ...userWithoutPassword } = user;
  return { token, user: { ...userWithoutPassword, ...stats } };
};

export const getUserById = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      progresses: true,
      results: true
    }
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Backfill referralCode if missing
  if (!user.referralCode) {
    const generatedCode = generateReferralCode(user.name);
    await prisma.user.update({
      where: { id: user.id },
      data: { referralCode: generatedCode }
    });
    user.referralCode = generatedCode;
  }

  const stats = await getReferralStats(user.referralCode);

  // Auth-token columns are never part of an API response: this object is
  // returned by GET /auth/me and attached to req.user on every authenticated
  // request, so leaking them hands the caller its own reset/verification
  // credentials (and their expiry) for no product reason.
  const { password: _, resetToken: _resetToken, resetTokenExpires: _resetTokenExpires, verificationToken: _verificationToken, ...userWithoutPassword } = user;
  return { ...userWithoutPassword, ...stats };
};

export const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      collegeName: true,
      branchName: true,
      referralCode: true,
      referredBy: true,
      progresses: {
        select: {
          courseId: true,
          progress: true
        }
      },
      payments: {
        select: {
          courseId: true,
          status: true
        }
      }
    },
    orderBy: {
      id: 'asc'
    }
  });

  // Calculate referral and paid counts in memory to prevent N+1 queries
  const referralCounts = new Map<string, number>();
  const referralPaidCounts = new Map<string, number>();

  // Helper mapping of userId to whether they have a verified payment
  const userHasVerifiedPayment = new Map<number, boolean>();
  users.forEach(u => {
    const hasVerified = u.payments.some(p => p.status === 'VERIFIED');
    userHasVerifiedPayment.set(u.id, hasVerified);
  });

  users.forEach(u => {
    if (u.referredBy) {
      const code = u.referredBy.trim().toUpperCase();
      referralCounts.set(code, (referralCounts.get(code) || 0) + 1);
      
      const isPaid = userHasVerifiedPayment.get(u.id) || false;
      if (isPaid) {
        referralPaidCounts.set(code, (referralPaidCounts.get(code) || 0) + 1);
      }
    }
  });

  return users.map(u => {
    const code = u.referralCode ? u.referralCode.trim().toUpperCase() : '';
    const referralCount = code ? (referralCounts.get(code) || 0) : 0;
    const referralPaidCount = code ? (referralPaidCounts.get(code) || 0) : 0;
    const referralSuccess = referralCount >= 15 && referralPaidCount >= 5;
    return {
      ...u,
      referralCount,
      referralPaidCount,
      referralSuccess
    };
  });
};

export const deleteUser = async (userId: number) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError('User not found', 404);
  }
  return await prisma.user.delete({ where: { id: userId } });
};

export const updateUserByAdmin = async (userId: number, updateData: {
  name?: string;
  email?: string;
  fatherName?: string;
  collegeName?: string;
  branchName?: string;
  courseType?: string;
  role?: string;
  points?: number;
  grade?: string;
  certificateStartDate?: string;
  certificateEndDate?: string;
}) => {
  const existingUser = await prisma.user.findUnique({ where: { id: userId } });
  if (!existingUser) {
    throw new AppError('User not found', 404);
  }

  if (updateData.email && updateData.email.trim().toLowerCase() !== existingUser.email.toLowerCase()) {
    const emailCheck = await prisma.user.findUnique({
      where: { email: updateData.email.trim().toLowerCase() }
    });
    if (emailCheck) {
      throw new AppError('Email address is already in use by another candidate', 400);
    }
  }

  const dataToUpdate: any = {};
  if (updateData.name !== undefined) dataToUpdate.name = updateData.name.trim();
  if (updateData.email !== undefined) dataToUpdate.email = updateData.email.trim().toLowerCase();
  if (updateData.fatherName !== undefined) dataToUpdate.fatherName = updateData.fatherName.trim();
  if (updateData.collegeName !== undefined) dataToUpdate.collegeName = updateData.collegeName.trim();
  if (updateData.branchName !== undefined) dataToUpdate.branchName = updateData.branchName.trim();
  if (updateData.courseType !== undefined) dataToUpdate.courseType = updateData.courseType.trim();
  if (updateData.role !== undefined) dataToUpdate.role = updateData.role.trim();
  if (updateData.points !== undefined) dataToUpdate.points = Number(updateData.points);
  if (updateData.grade !== undefined) dataToUpdate.grade = updateData.grade.trim();
  if (updateData.certificateStartDate !== undefined) {
    dataToUpdate.certificateStartDate = updateData.certificateStartDate ? new Date(updateData.certificateStartDate) : null;
  }
  if (updateData.certificateEndDate !== undefined) {
    dataToUpdate.certificateEndDate = updateData.certificateEndDate ? new Date(updateData.certificateEndDate) : null;
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: dataToUpdate
  });

  const { password: _, ...userWithoutPassword } = updatedUser;
  return userWithoutPassword;
};

