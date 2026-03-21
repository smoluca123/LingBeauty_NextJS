import { IUserRoleAssignmentDataType } from '@/lib/types/interfaces/apis/user.interfaces';

// Roles allowed to access admin panel
export const ADMIN_ROLES = ['Quản trị viên', 'Quản lý'] as const;
export type AdminRole = (typeof ADMIN_ROLES)[number];

/**
 * Check if a user has admin role based on their role assignments.
 * This function checks the roleAssignments array to determine if the user
 * has any of the designated admin roles.
 *
 * @param roleAssignments - Array of user role assignments
 * @returns boolean indicating if user has admin privileges
 */
export function hasAdminRole(
  roleAssignments?: IUserRoleAssignmentDataType[],
): boolean {
  if (!roleAssignments || roleAssignments.length === 0) return false;
  return roleAssignments.some((ra) =>
    (ADMIN_ROLES as readonly string[]).includes(ra.role.name),
  );
}

/**
 * Check if a user has a specific role by name.
 *
 * @param roleAssignments - Array of user role assignments
 * @param roleName - The role name to check for
 * @returns boolean indicating if user has the specified role
 */
export function hasRole(
  roleAssignments: IUserRoleAssignmentDataType[] | undefined,
  roleName: string,
): boolean {
  if (!roleAssignments || roleAssignments.length === 0) return false;
  return roleAssignments.some((ra) => ra.role.name === roleName);
}

/**
 * Get all role names from a user's role assignments.
 *
 * @param roleAssignments - Array of user role assignments
 * @returns Array of role names
 */
export function getUserRoles(
  roleAssignments?: IUserRoleAssignmentDataType[],
): string[] {
  if (!roleAssignments || roleAssignments.length === 0) return [];
  return roleAssignments.map((ra) => ra.role.name);
}
