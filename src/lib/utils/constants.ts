// App Configuration
export const APP_NAME = 'KeyVaultify';
export const APP_DESCRIPTION = 'Secure secrets management for modern teams';
export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

// File Upload
export const MAX_FILE_SIZE = 5 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
];

// Validation Limits
export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 128;
export const MIN_USERNAME_LENGTH = 3;
export const MAX_USERNAME_LENGTH = 30;
export const MIN_TEAM_NAME_LENGTH = 2;
export const MAX_TEAM_NAME_LENGTH = 50;
export const MIN_SLUG_LENGTH = 3;
export const MAX_SLUG_LENGTH = 50;

// Session & Auth
export const SESSION_COOKIE_NAME = 'better-auth.session_token';
export const OTP_LENGTH = 6;
export const OTP_EXPIRY_MINUTES = 10;
export const INVITATION_EXPIRY_DAYS = 7;

// Team Roles
export const TEAM_ROLES = {
  OWNER: 'owner',
  ADMIN: 'admin',
  MEMBER: 'member',
} as const;

export type TeamRole = (typeof TEAM_ROLES)[keyof typeof TEAM_ROLES];

// Billing Plans
export const PLANS = {
  FREE: 'free',
  STARTER: 'starter',
  PRO: 'pro',
} as const;

export type Plan = (typeof PLANS)[keyof typeof PLANS];

// Rate Limiting
export const RATE_LIMIT_WINDOW_MS = 60 * 1000;
export const RATE_LIMIT_MAX_REQUESTS = 10;
