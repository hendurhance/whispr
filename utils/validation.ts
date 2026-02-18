/**
 * Shared validation constants and utilities for the Whispr app
 */

// Reserved usernames that cannot be claimed by users
export const RESERVED_USERNAMES = [
  'admin', 'administrator', 'root', 'system', 'support', 'help',
  'dashboard', 'settings', 'profile', 'auth', 'login', 'logout',
  'signup', 'register', 'api', 'static', 'public', 'private',
  'whispr', 'whisper', 'trywhispr', 'official', 'mod', 'moderator',
  'staff', 'team', 'security', 'abuse', 'null', 'undefined',
  'terms', 'privacy', 'about', 'contact', 'feedback', 'setup-profile'
] as const;

// Username constraints
export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 20;
export const USERNAME_PATTERN = /^[a-zA-Z0-9_]+$/;

// Bio constraints
export const BIO_MAX_LENGTH = 160;

/**
 * Validates if a username meets all requirements
 */
export const validateUsername = (username: string): { valid: boolean; error?: string } => {
  const normalized = username.toLowerCase().trim();

  if (!normalized) {
    return { valid: false, error: 'Username is required' };
  }

  if (normalized.length < USERNAME_MIN_LENGTH) {
    return { valid: false, error: `Username must be at least ${USERNAME_MIN_LENGTH} characters` };
  }

  if (normalized.length > USERNAME_MAX_LENGTH) {
    return { valid: false, error: `Username must be ${USERNAME_MAX_LENGTH} characters or less` };
  }

  if (!USERNAME_PATTERN.test(normalized)) {
    return { valid: false, error: 'Username can only contain letters, numbers, and underscores' };
  }

  if ((RESERVED_USERNAMES as readonly string[]).includes(normalized)) {
    return { valid: false, error: 'This username is reserved and cannot be used' };
  }

  return { valid: true };
};

/**
 * Sanitizes username input - removes invalid characters and enforces max length.
 * This filters on input so users see only valid characters in the input field.
 */
export const sanitizeUsername = (input: string): string => {
  return input.replace(/[^a-zA-Z0-9_]/g, '').slice(0, USERNAME_MAX_LENGTH);
};

// Blocked hostnames for security (internal/private networks)
const BLOCKED_HOSTNAMES = [
  'localhost',
  '127.0.0.1',
  '0.0.0.0',
  '::1',
  '[::1]'
];

// Patterns for private IPv4 ranges
const PRIVATE_IP_PATTERNS = [
  /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,           // 10.0.0.0/8
  /^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/, // 172.16.0.0/12
  /^192\.168\.\d{1,3}\.\d{1,3}$/               // 192.168.0.0/16
];

// Patterns for private/internal IPv6 ranges
const PRIVATE_IPV6_PATTERNS = [
  /^\[?fc[0-9a-f]{2}:/i,     // fc00::/7 - Unique local addresses
  /^\[?fd[0-9a-f]{2}:/i,     // fd00::/8 - Unique local addresses
  /^\[?fe80:/i,              // fe80::/10 - Link-local addresses
  /^\[?::1\]?$/i             // ::1 - Loopback
];

/**
 * Validates if a URL is properly formatted and safe
 */
export const isValidUrl = (urlString: string): boolean => {
  try {
    const url = new URL(urlString);

    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return false;
    }

    if (BLOCKED_HOSTNAMES.includes(url.hostname.toLowerCase())) {
      return false;
    }

    if (PRIVATE_IP_PATTERNS.some(pattern => pattern.test(url.hostname))) {
      return false;
    }

    if (PRIVATE_IPV6_PATTERNS.some(pattern => pattern.test(url.hostname))) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
};

export const VALID_WHISPR_TYPES = [
  'question',
  'compliment',
  'roast',
  'confession',
  'rumor',
  'suggestion',
  'secret',
  'hot_take',
  'dare'
] as const;

export type ValidWhisprType = typeof VALID_WHISPR_TYPES[number];

export const WHISPR_MIN_LENGTH = 1;
export const WHISPR_MAX_LENGTH = 500;

/**
 * Validates if a whispr type is valid
 */
export const isValidWhisprType = (type: string): type is ValidWhisprType => {
  return VALID_WHISPR_TYPES.includes(type as ValidWhisprType);
};

/**
 * Validates whispr content
 */
export const validateWhisprContent = (content: string): { valid: boolean; error?: string } => {
  const trimmed = content.trim();

  if (!trimmed) {
    return { valid: false, error: 'Whispr content cannot be empty' };
  }

  if (trimmed.length < WHISPR_MIN_LENGTH) {
    return { valid: false, error: `Whispr must be at least ${WHISPR_MIN_LENGTH} character` };
  }

  if (trimmed.length > WHISPR_MAX_LENGTH) {
    return { valid: false, error: `Whispr must be ${WHISPR_MAX_LENGTH} characters or less` };
  }

  return { valid: true };
};

/**
 * Validates a complete whispr submission
 */
export const validateWhisprSubmission = ({
  content,
  type,
  username
}: {
  content: string;
  type: string;
  username: string;
}): { valid: boolean; error?: string } => {
  const usernameValidation = validateUsername(username);
  if (!usernameValidation.valid) {
    return usernameValidation;
  }

  const contentValidation = validateWhisprContent(content);
  if (!contentValidation.valid) {
    return contentValidation;
  }

  if (!isValidWhisprType(type)) {
    return { valid: false, error: `Invalid whispr type: ${type}` };
  }

  return { valid: true };
};
