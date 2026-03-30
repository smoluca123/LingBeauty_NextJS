/**
 * User-related utility functions
 * Shared across components that display user information
 */

/**
 * Generate initials from user's first and last name
 * @param firstName - User's first name
 * @param lastName - User's last name
 * @returns Uppercase initials (e.g., "JD" for "John Doe")
 */
export function getUserInitials(firstName?: string, lastName?: string): string {
  const first = firstName?.[0] ?? ''
  const last = lastName?.[0] ?? ''
  return `${first}${last}`.toUpperCase() || '?'
}

/**
 * Get full name from user's first and last name
 * @param firstName - User's first name
 * @param lastName - User's last name
 * @param fallback - Fallback text if both names are empty
 * @returns Full name or fallback
 */
export function getUserFullName(
  firstName?: string,
  lastName?: string,
  fallback = 'Người dùng ẩn danh',
): string {
  const fullName = `${firstName ?? ''} ${lastName ?? ''}`.trim()
  return fullName || fallback
}

/**
 * Get avatar URL from user object
 * @param user - User object with nested avatar structure
 * @returns Avatar URL or empty string
 */
export function getUserAvatarUrl(user?: {
  avatar?: { media?: { url?: string } } | null
}): string {
  return user?.avatar?.media?.url ?? ''
}
