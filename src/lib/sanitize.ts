/**
 * Input sanitization utilities to prevent XSS and injection attacks
 */

/**
 * Sanitizes a string by removing potentially harmful HTML/script tags
 * and encoding special characters
 */
export function sanitizeString(input: string): string {
  if (!input || typeof input !== 'string') return '';

  return input
    .trim()
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Encode special characters
    .replace(/[<>'"]/g, (char) => {
      const entities: { [key: string]: string } = {
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#x27;',
        '"': '&quot;'
      };
      return entities[char] || char;
    })
    // Limit length to prevent DoS
    .substring(0, 5000);
}

/**
 * Sanitizes an email address
 */
export function sanitizeEmail(email: string): string {
  if (!email || typeof email !== 'string') return '';

  return email
    .trim()
    .toLowerCase()
    .replace(/[<>'"]/g, '')
    .substring(0, 254); // RFC 5321 max length
}

/**
 * Sanitizes a phone number (keeps only digits, spaces, hyphens, parentheses, and + sign)
 */
export function sanitizePhone(phone: string): string {
  if (!phone || typeof phone !== 'string') return '';

  return phone
    .trim()
    .replace(/[^0-9\s\-()+ ]/g, '')
    .substring(0, 20);
}

/**
 * Sanitizes a number input
 */
export function sanitizeNumber(input: any): number {
  const num = typeof input === 'string' ? parseFloat(input) : input;
  return isNaN(num) ? 0 : num;
}

/**
 * Sanitizes an integer input
 */
export function sanitizeInteger(input: any): number {
  const num = typeof input === 'string' ? parseInt(input, 10) : input;
  return isNaN(num) ? 0 : num;
}

/**
 * Sanitizes a URL to ensure it's safe
 */
export function sanitizeUrl(url: string): string | null {
  if (!url || typeof url !== 'string') return null;

  try {
    const parsed = new URL(url);
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return null;
    }
    return url.substring(0, 2048); // Max URL length
  } catch {
    return null;
  }
}

/**
 * Sanitizes all string fields in an object
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized: any = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value);
    } else if (typeof value === 'number') {
      sanitized[key] = value;
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized as T;
}
