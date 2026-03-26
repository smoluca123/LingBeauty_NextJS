import { kyNextInstance } from '@/lib/kyInstance/kyNext'
import { extractErrorMessage } from '@/lib/utils/error-handler'
import type {
  IApiPaginationResponseWrapperType,
  IApiResponseWrapperType,
} from '@/lib/types/interfaces/apis/api.interfaces'
import type {
  IAdminRoleDataType,
  IAdminUserDataType,
  IUserFilters,
} from '@/lib/types/interfaces/apis/admin-user.interfaces'

// Helper: loại bỏ undefined trước khi truyền vào searchParams
const buildSearchParams = (
  options: Record<string, string | number | boolean | undefined>,
): Record<string, string | number | boolean> =>
  Object.fromEntries(
    Object.entries(options).filter(([, v]) => v !== undefined),
  ) as Record<string, string | number | boolean>

/**
 * Fetch all users with filters and pagination (Admin)
 * @param params - User filter parameters
 * @returns Promise with paginated user data
 * @throws Error with backend message
 */
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
      .json<IApiPaginationResponseWrapperType<IAdminUserDataType>>()
  } catch (error) {
    throw new Error(await extractErrorMessage(error, 'Failed to fetch users'))
  }
}

/**
 * Fetch all user roles (Admin)
 * @returns Promise with user roles array
 * @throws Error with backend message
 */
export const getAllUserRolesClientAPI = async () => {
  try {
    return await kyNextInstance
      .get('admin/users/roles')
      .json<IApiResponseWrapperType<IAdminRoleDataType[]>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to fetch user roles'),
    )
  }
}

/**
 * Ban or unban a user (Admin)
 * @param userId - User ID to ban/unban
 * @param isBanned - Ban status (true to ban, false to unban)
 * @returns Promise with updated user data
 * @throws Error with backend message
 */
export const banUserClientAPI = async (userId: string, isBanned: boolean) => {
  try {
    return await kyNextInstance
      .patch(`admin/users/${userId}/ban`, { json: { isBanned } })
      .json<IApiResponseWrapperType<IAdminUserDataType>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to ban/unban user'),
    )
  }
}

/**
 * Ban or unban multiple users in bulk (Admin)
 * @param items - Array of user IDs and ban status
 * @returns Promise with updated count
 * @throws Error with backend message
 */
export const banUserBulkClientAPI = async (
  items: { userId: string; isBanned: boolean }[],
) => {
  try {
    return await kyNextInstance
      .patch('admin/users/ban/bulk', { json: { items } })
      .json<IApiResponseWrapperType<{ updatedCount: number }>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to bulk ban/unban users'),
    )
  }
}

export interface IUpdateUserByAdminPayload {
  email?: string
  firstName?: string
  lastName?: string
  phone?: string
  username?: string
  roleIds?: string[]
  isActive?: boolean
  isVerified?: boolean
  isBanned?: boolean
  isEmailVerified?: boolean
  isPhoneVerified?: boolean
}

/**
 * Update user information (Admin)
 * @param userId - User ID to update
 * @param data - User update payload
 * @returns Promise with updated user data
 * @throws Error with backend message
 */
export const updateUserByAdminClientAPI = async (
  userId: string,
  data: IUpdateUserByAdminPayload,
) => {
  try {
    return await kyNextInstance
      .patch(`admin/users/${userId}`, { json: data })
      .json<IApiResponseWrapperType<IAdminUserDataType>>()
  } catch (error) {
    throw new Error(await extractErrorMessage(error, 'Failed to update user'))
  }
}

export interface ICreateUserByAdminPayload {
  email: string
  password: string
  firstName: string
  lastName: string
  phone: string
  username: string
  roleId?: string
  isActive?: boolean
  isEmailVerified?: boolean
  isPhoneVerified?: boolean
}

/**
 * Create a new user (Admin)
 * @param data - User creation payload
 * @returns Promise with created user data
 * @throws Error with backend message
 */
export const createUserClientAPI = async (data: ICreateUserByAdminPayload) => {
  try {
    return await kyNextInstance
      .post('admin/users', { json: data })
      .json<IApiResponseWrapperType<IAdminUserDataType>>()
  } catch (error) {
    throw new Error(await extractErrorMessage(error, 'Failed to create user'))
  }
}
