/**
 * Validation utilities for checking data formats and permissions
 */

/**
 * Validates if a string is a valid email format
 * @param email - The string to validate
 * @returns True if valid email format
 * @example
 * isValidEmail("test@example.com") // true
 * isValidEmail("invalid-email") // false
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Roles allowed to access admin panel
const ADMIN_ROLES = ['ADMINISTRATOR', 'MANAGER'] as const
type AdminRole = (typeof ADMIN_ROLES)[number]

/**
 * Check if user has admin role (ADMINISTRATOR or MANAGER)
 * @param roleAssignments - User's role assignments
 * @returns True if user has admin role
 * @example
 * hasAdminRole([{ role: { name: "ADMINISTRATOR" } }]) // true
 * hasAdminRole([{ role: { name: "USER" } }]) // false
 */
export function hasAdminRole(
  roleAssignments?: { role: { name: string } }[],
): boolean {
  if (!roleAssignments || roleAssignments.length === 0) return false
  return roleAssignments.some((ra) =>
    (ADMIN_ROLES as readonly AdminRole[]).includes(ra.role.name as AdminRole),
  )
}
