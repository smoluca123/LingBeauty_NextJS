/**
 * Masks an email address for privacy display
 * Example: "test@example.com" -> "t***@example.com"
 * Example: "ab@example.com" -> "a*@example.com"
 * Example: "a@example.com" -> "a@example.com"
 *
 * @param email - The email address to mask
 * @returns The masked email address
 */
export function maskEmail(email: string): string {
  if (!email || !email.includes('@')) {
    return email;
  }

  const [localPart, domain] = email.split('@');

  if (localPart.length <= 1) {
    return email;
  }

  const firstChar = localPart[0];
  const maskedLength = localPart.length - 1;
  const maskedPart = '*'.repeat(Math.min(maskedLength, 3));

  return `${firstChar}${maskedPart}@${domain}`;
}

/**
 * Validates if a string is a valid email format
 *
 * @param email - The string to validate
 * @returns True if valid email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
