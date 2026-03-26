/**
 * Email utility functions for masking and formatting email addresses
 */

/**
 * Masks an email address for privacy display
 * @param email - The email address to mask
 * @returns The masked email address
 * @example
 * maskEmail("test@example.com") // "t***@example.com"
 * maskEmail("ab@example.com") // "a*@example.com"
 * maskEmail("a@example.com") // "a@example.com"
 */
export function maskEmail(email: string): string {
  if (!email || !email.includes('@')) {
    return email
  }

  const [localPart, domain] = email.split('@')

  if (localPart.length <= 1) {
    return email
  }

  const firstChar = localPart[0]
  const maskedLength = localPart.length - 1
  const maskedPart = '*'.repeat(Math.min(maskedLength, 3))

  return `${firstChar}${maskedPart}@${domain}`
}
