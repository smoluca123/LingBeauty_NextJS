'use server';

import { kyInstance } from '@/lib/kyInstance/ky';
import type {
  IApiPaginationResponseWrapperType,
  IApiResponseWrapperType,
} from '@/lib/types/interfaces/apis/api.interfaces';
import type { IUserDataType } from '@/lib/types/interfaces/apis/user.interfaces';
import type {
  IAdminRoleDataType,
  IAdminUserDataType,
  IUserFilters,
} from '@/lib/types/interfaces/apis/admin-user.interfaces';

// Helper: loại bỏ undefined trước khi truyền vào searchParams
const buildSearchParams = (
  options: Record<string, string | number | boolean | undefined>,
): Record<string, string | number | boolean> =>
  Object.fromEntries(
    Object.entries(options).filter(([, v]) => v !== undefined),
  ) as Record<string, string | number | boolean>;

// ============ Get Me ============
export const getMeApi = async () =>
  kyInstance.get('user/me').json<IApiResponseWrapperType<IUserDataType>>();

// ============ Get All Users (Admin) ============
export const getAllUsersAPI = async (params: IUserFilters = {}) =>
  kyInstance
    .get('user', {
      searchParams: buildSearchParams({
        page: params.page,
        limit: params.limit,
        search: params.search,
        isActive: params.isActive,
        isBanned: params.isBanned,
        isVerified: params.isVerified,
        sortBy: params.sortBy,
        order: params.order,
      }),
    })
    .json<IApiPaginationResponseWrapperType<IAdminUserDataType>>();

// ============ Get All User Roles (Admin) ============
export const getAllUserRolesAPI = async () =>
  kyInstance
    .get('user/roles')
    .json<IApiResponseWrapperType<IAdminRoleDataType[]>>();

// ============ Ban / Unban User ============
export const banUserAPI = async (userId: string, isBanned: boolean) =>
  kyInstance
    .patch(`user/${userId}/ban`, { json: { isBanned } })
    .json<IApiResponseWrapperType<IAdminUserDataType>>();

// ============ Bulk Ban / Unban Users ============
export const banUserBulkAPI = async (
  items: { userId: string; isBanned: boolean }[],
) =>
  kyInstance
    .patch('user/ban/bulk', { json: { items } })
    .json<IApiResponseWrapperType<{ updatedCount: number }>>();

// ============ Update User By Admin ============
export const updateUserByAdminAPI = async (
  userId: string,
  data: {
    email?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    username?: string;
    roleIds?: string[];
    isActive?: boolean;
    isVerified?: boolean;
    isBanned?: boolean;
    isEmailVerified?: boolean;
    isPhoneVerified?: boolean;
  },
) =>
  kyInstance
    .patch(`user/${userId}`, { json: data })
    .json<IApiResponseWrapperType<IAdminUserDataType>>();

// ============ Create User By Admin ============
export const createUserByAdminAPI = async (data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  username: string;
  roleId?: string;
  isActive?: boolean;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
}) =>
  kyInstance
    .post('user', { json: data })
    .json<IApiResponseWrapperType<IAdminUserDataType>>();


