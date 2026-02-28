// ============ Admin User Types ============

import { IUserDataType } from "./user.interfaces";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IAdminUserDataType extends IUserDataType {
  
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

