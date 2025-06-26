/**
 * Sanitizes user input to prevent XSS attacks
 * @param input - The user input to sanitize
 * @returns Sanitized string safe for display
 */
export function sanitizeText(input: string): string {
  if (!input || typeof input !== "string") {
    return "";
  }

  // Remove any HTML tags and escape special characters
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")
    .trim();
}

/**
 * Sanitizes an email address for safe display
 * @param email - The email address to sanitize
 * @returns Sanitized email string
 */
export function sanitizeEmail(email: string): string {
  if (!email || typeof email !== "string") {
    return "";
  }

  // Basic email validation and sanitization
  const sanitized = sanitizeText(email);

  // Simple email format check (basic validation)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(sanitized)) {
    return ""; // Return empty if not a valid email format
  }

  return sanitized;
}

/**
 * Sanitizes a date string for safe display
 * @param dateString - The date string to sanitize
 * @returns Sanitized date string
 */
export function sanitizeDate(dateString: string): string {
  if (!dateString || typeof dateString !== "string") {
    return "";
  }

  // Remove any HTML tags and escape special characters
  const sanitized = sanitizeText(dateString);

  // Basic date format validation (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(sanitized)) {
    return ""; // Return empty if not a valid date format
  }

  return sanitized;
}
