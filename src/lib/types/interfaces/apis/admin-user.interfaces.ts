// ============ Admin User Types ============

/** Join table: roleAssignments[].role = the actual role object */
export interface IAdminRoleAssignmentDataType {
  id: string;
  userId: string;
  roleId: string;
  role: Pick<IAdminRoleDataType, 'id' | 'name' | 'createdAt' | 'updatedAt'>;
  createdAt: string;
  updatedAt: string;
}

export interface IAdminUserDataType {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  username: string;
  avatar: string | null;
  /**
   * BE trả về `roleAssignments` (join table), mỗi item có `.role` lồng trong.
   * Dùng helper `getUserRoles(user)` để lấy danh sách vai trò phẳng.
   */
  roleAssignments: IAdminRoleAssignmentDataType[];
  isActive: boolean;
  isVerified: boolean;
  isBanned: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  emailVerifiedAt: string | null;
  phoneVerifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Helper: trích xuất mảng roles phẳng từ roleAssignments của user */
export const getUserRoles = (
  user: IAdminUserDataType,
): Pick<IAdminRoleDataType, 'id' | 'name' | 'createdAt' | 'updatedAt'>[] =>
  (user.roleAssignments ?? []).map((ra) => ra.role);


export interface IAdminRoleDataType {
  id: string;
  name: string;
  description: string;
  permissions: IAdminPermissionDataType[];
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IAdminPermissionDataType {
  id: string;
  name: string;
  description: string;
  category: 'products' | 'categories' | 'inventory' | 'users' | 'roles';
}

// ============ Filter Types ============

export type UserSortBy =
  | 'createdAt'
  | 'updatedAt'
  | 'email'
  | 'firstName'
  | 'lastName';

export type UserSortOrder = 'asc' | 'desc';

export interface IUserFilters {
  search?: string;
  isActive?: boolean;
  isBanned?: boolean;
  isVerified?: boolean;
  sortBy?: UserSortBy;
  order?: UserSortOrder;
  page?: number;
  limit?: number;
}

// ============ Form Types ============

export interface IUserFormData {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  username: string;
  roleIds: string[];
  isActive: boolean;
}

export interface IRoleFormData {
  name: string;
  description: string;
  permissionIds: string[];
}
