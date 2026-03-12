import { kyNextInstance } from '@/lib/kyInstance/kyNext';
import { HTTPError } from 'ky';
import type {
  IApiPaginationResponseWrapperType,
  IApiResponseWrapperType,
} from '@/lib/types/interfaces/apis/api.interfaces';
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

const handleError = async (error: unknown) => {
  if (error instanceof HTTPError) {
    const data = await error.response.json().catch(() => ({}));
    throw new Error((data as { message?: string }).message || error.message);
  }
  throw error;
};

// ============ Get All Users ============
export const getAllUsersClientAPI = async (params: IUserFilters = {}) => {
  try {
    return await kyNextInstance
      .get('admin/users', {
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
  } catch (error) {
    return handleError(error);
  }
};

// ============ Get All User Roles ============
export const getAllUserRolesClientAPI = async () => {
  try {
    return await kyNextInstance
      .get('admin/users/roles')
      .json<IApiResponseWrapperType<IAdminRoleDataType[]>>();
  } catch (error) {
    return handleError(error);
  }
};

// ============ Ban / Unban User ============
export const banUserClientAPI = async (userId: string, isBanned: boolean) => {
  try {
    return await kyNextInstance
      .patch(`admin/users/${userId}/ban`, { json: { isBanned } })
      .json<IApiResponseWrapperType<IAdminUserDataType>>();
  } catch (error) {
    return handleError(error);
  }
};

// ============ Bulk Ban / Unban Users ============
export const banUserBulkClientAPI = async (
  items: { userId: string; isBanned: boolean }[],
) => {
  try {
    return await kyNextInstance
      .patch('admin/users/ban/bulk', { json: { items } })
      .json<IApiResponseWrapperType<{ updatedCount: number }>>();
  } catch (error) {
    return handleError(error);
  }
};

// ============ Update User By Admin ============
export interface IUpdateUserByAdminPayload {
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
}

export const updateUserByAdminClientAPI = async (
  userId: string,
  data: IUpdateUserByAdminPayload,
) => {
  try {
    return await kyNextInstance
      .patch(`admin/users/${userId}`, { json: data })
      .json<IApiResponseWrapperType<IAdminUserDataType>>();
  } catch (error) {
    return handleError(error);
  }
};

// ============ Create User By Admin ============
export interface ICreateUserByAdminPayload {
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
}

export const createUserClientAPI = async (data: ICreateUserByAdminPayload) => {
  try {
    return await kyNextInstance
      .post('admin/users', { json: data })
      .json<IApiResponseWrapperType<IAdminUserDataType>>();
  } catch (error) {
    return handleError(error);
  }
};
