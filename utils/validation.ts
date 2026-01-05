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

  if (RESERVED_USERNAMES.includes(normalized as typeof RESERVED_USERNAMES[number])) {
    return { valid: false, error: 'This username is reserved and cannot be used' };
  }

  return { valid: true };
};

/**
 * Sanitizes username input - removes invalid characters and enforces max length
 */
export const sanitizeUsername = (input: string): string => {
  return input.replace(/[^a-zA-Z0-9_]/g, '').slice(0, USERNAME_MAX_LENGTH);
};

/**
 * Validates if a URL is properly formatted
 */
export const isValidUrl = (urlString: string): boolean => {
  try {
    const url = new URL(urlString);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};
