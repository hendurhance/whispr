import { z } from 'zod';

export const RESERVED_USERNAMES = [
  'admin', 'administrator', 'root', 'system', 'support', 'help',
  'dashboard', 'settings', 'stats', 'profile', 'auth', 'login', 'logout',
  'signup', 'register', 'api', 'static', 'public', 'private',
  'whispr', 'whisper', 'trywhispr', 'official', 'mod', 'moderator',
  'staff', 'team', 'security', 'abuse', 'null', 'undefined',
  'terms', 'privacy', 'about', 'contact', 'feedback', 'setup-profile',
  'for', 'vs', 'blog', 'prompts', 'safety', 'for-creators', 'confessions', 'anonymous-questions', 'anonymous-feedback',
  'anonymous-compliments', 'anonymous-roasts', 'anonymous-dares', 'anonymous-secrets',
  'anonymous-hot-takes', 'ngl-alternative',
] as const;

const RESERVED = new Set<string>(RESERVED_USERNAMES);

export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 20;
export const USERNAME_PATTERN = /^[a-zA-Z0-9_]+$/;
export const BIO_MAX_LENGTH = 160;
export const WHISPR_MIN_LENGTH = 1;
export const WHISPR_MAX_LENGTH = 500;

export const VALID_WHISPR_TYPES = [
  'question', 'compliment', 'roast', 'confession', 'rumor', 'suggestion', 'secret', 'hot_take', 'dare',
] as const;
export type ValidWhisprType = (typeof VALID_WHISPR_TYPES)[number];

const BLOCKED_HOSTNAMES = ['localhost', '127.0.0.1', '0.0.0.0', '::1', '[::1]'];
const PRIVATE_IP_PATTERNS = [
  /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,
  /^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/,
  /^192\.168\.\d{1,3}\.\d{1,3}$/,
];
const PRIVATE_IPV6_PATTERNS = [
  /^\[?fc[0-9a-f]{2}:/i,
  /^\[?fd[0-9a-f]{2}:/i,
  /^\[?fe80:/i,
  /^\[?::1\]?$/i,
];

function isSafePublicUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return false;
    if (BLOCKED_HOSTNAMES.includes(url.hostname.toLowerCase())) return false;
    if (PRIVATE_IP_PATTERNS.some((p) => p.test(url.hostname))) return false;
    if (PRIVATE_IPV6_PATTERNS.some((p) => p.test(url.hostname))) return false;
    return true;
  } catch {
    return false;
  }
}

export const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(USERNAME_MIN_LENGTH, `Username must be at least ${USERNAME_MIN_LENGTH} characters`)
  .max(USERNAME_MAX_LENGTH, `Username must be ${USERNAME_MAX_LENGTH} characters or less`)
  .regex(USERNAME_PATTERN, 'Username can only contain letters, numbers, and underscores')
  .refine((u) => !RESERVED.has(u), 'This username is reserved and cannot be used');

export const bioSchema = z.string().trim().max(BIO_MAX_LENGTH, `Bio must be ${BIO_MAX_LENGTH} characters or less`);

export const whisprTypeSchema = z.enum(VALID_WHISPR_TYPES);

export const whisprContentSchema = z
  .string()
  .trim()
  .min(WHISPR_MIN_LENGTH, 'Whispr content cannot be empty')
  .max(WHISPR_MAX_LENGTH, `Whispr must be ${WHISPR_MAX_LENGTH} characters or less`);

export const whisprSubmissionSchema = z.object({
  username: usernameSchema,
  content: whisprContentSchema,
  type: whisprTypeSchema,
});

export const safeUrlSchema = z.string().trim().refine(isSafePublicUrl, 'Enter a valid public URL');

interface ValidationResult {
  valid: boolean;
  error?: string;
}

export const validateUsername = (username: string): ValidationResult => {
  if (!username.trim()) return { valid: false, error: 'Username is required' };
  const r = usernameSchema.safeParse(username);
  return r.success ? { valid: true } : { valid: false, error: r.error.issues[0]?.message };
};

export const validateWhisprContent = (content: string): ValidationResult => {
  const r = whisprContentSchema.safeParse(content);
  return r.success ? { valid: true } : { valid: false, error: r.error.issues[0]?.message };
};

export const validateWhisprSubmission = (input: { content: string; type: string; username: string }): ValidationResult => {
  const r = whisprSubmissionSchema.safeParse(input);
  return r.success ? { valid: true } : { valid: false, error: r.error.issues[0]?.message };
};

export const isValidWhisprType = (type: string): type is ValidWhisprType => whisprTypeSchema.safeParse(type).success;

export const isValidUrl = (urlString: string): boolean => safeUrlSchema.safeParse(urlString).success;

export const sanitizeUsername = (input: string): string =>
  input.replace(/[^a-zA-Z0-9_]/g, '').slice(0, USERNAME_MAX_LENGTH);
