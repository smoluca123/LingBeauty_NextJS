// ============ Admin User Types ============

export interface IAdminUserDataType {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  username: string;
  avatar: string | null;
  isActive: boolean;
  isVerified: boolean;
  isBanned: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  emailVerifiedAt: string | null;
  phoneVerifiedAt: string | null;
  roles: IAdminRoleDataType[];
  createdAt: string;
  updatedAt: string;
}

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

export interface IUserFilters {
  search?: string;
  roleId?: string;
  status?: 'all' | 'active' | 'inactive' | 'banned';
  verified?: 'all' | 'verified' | 'unverified';
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
