import { kyNextInstance } from '@/lib/kyInstance/kyNext'
import type {
  IApiPaginationResponseWrapperType,
  IApiResponseWrapperType,
} from '@/lib/types/interfaces/apis/api.interfaces'
import type {
  IBannerGroupDataType,
  IBannerDataType,
} from '@/lib/types/interfaces/apis/banner.interfaces'
import { extractErrorMessage } from '@/lib/utils/error-handler'

// ============ Banner Group APIs ============

/**
 * Get all banner groups with pagination
 * @param params - Pagination params and optional bannerId to filter groups containing that banner
 * @returns Promise with paginated banner group data
 * @throws Error with backend message
 */
export const getAllBannerGroupsClientAPI = async (params?: {
  page?: number
  limit?: number
  bannerId?: string
}) => {
  try {
    const searchParams: Record<string, string> = {}
    if (params?.page) searchParams.page = String(params.page)
    if (params?.limit) searchParams.limit = String(params.limit)
    if (params?.bannerId) searchParams.bannerId = params.bannerId

    return await kyNextInstance
      .get('admin/banners', { searchParams })
      .json<IApiPaginationResponseWrapperType<IBannerGroupDataType>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to fetch banner groups'),
    )
  }
}

/**
 * Get banner group by ID
 * @param id - Banner group ID
 * @returns Promise with banner group data
 * @throws Error with backend message
 */
export const getBannerGroupByIdClientAPI = async (id: string) => {
  try {
    return await kyNextInstance
      .get(`admin/banners/group/${id}`)
      .json<IApiResponseWrapperType<IBannerGroupDataType>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to fetch banner group'),
    )
  }
}

/**
 * Create new banner group
 * @param data - Banner group creation data
 * @returns Promise with created banner group data
 * @throws Error with backend message
 */
export const createBannerGroupClientAPI = async (data: {
  name: string
  slug: string
  description?: string
  isActive?: boolean
  startDate?: string
  endDate?: string
}) => {
  try {
    return await kyNextInstance
      .post('admin/banners/group', { json: data })
      .json<IApiResponseWrapperType<IBannerGroupDataType>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to create banner group'),
    )
  }
}

/**
 * Update banner group
 * @param id - Banner group ID to update
 * @param data - Banner group update data
 * @returns Promise with updated banner group data
 * @throws Error with backend message
 */
export const updateBannerGroupClientAPI = async (
  id: string,
  data: {
    name?: string
    slug?: string
    description?: string
    isActive?: boolean
    startDate?: string
    endDate?: string
  },
) => {
  try {
    return await kyNextInstance
      .patch(`admin/banners/group/${id}`, { json: data })
      .json<IApiResponseWrapperType<IBannerGroupDataType>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to update banner group'),
    )
  }
}

/**
 * Delete banner group
 * @param id - Banner group ID to delete
 * @returns Promise with success message
 * @throws Error with backend message
 */
export const deleteBannerGroupClientAPI = async (id: string) => {
  try {
    return await kyNextInstance
      .delete(`admin/banners/group/${id}`)
      .json<IApiResponseWrapperType<{ message: string }>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to delete banner group'),
    )
  }
}

// ============ Banner Item APIs ============

/**
 * Get all banners with pagination
 * @param params - Pagination and search parameters
 * @returns Promise with paginated banner data
 * @throws Error with backend message
 */
export const getAllBannersClientAPI = async (params?: {
  page?: number
  limit?: number
  search?: string
  groupId?: string
}) => {
  try {
    const searchParams: Record<string, string> = {}
    if (params?.page) searchParams.page = String(params.page)
    if (params?.limit) searchParams.limit = String(params.limit)
    if (params?.search) searchParams.search = params.search
    if (params?.groupId) searchParams.groupId = params.groupId

    return await kyNextInstance
      .get('admin/banners/items', { searchParams })
      .json<IApiPaginationResponseWrapperType<IBannerDataType>>()
  } catch (error) {
    throw new Error(await extractErrorMessage(error, 'Failed to fetch banners'))
  }
}

/**
 * Create banner item
 * @param data - Banner creation data
 * @returns Promise with created banner data
 * @throws Error with backend message
 */
export const createBannerClientAPI = async (data: {
  type: 'TEXT' | 'IMAGE'
  position: 'MAIN_CAROUSEL' | 'SIDE_TOP' | 'SIDE_BOTTOM'
  badge?: string
  title?: string
  description?: string
  highlight?: string
  ctaText?: string
  ctaLink?: string
  subLabel?: string
  gradientFrom?: string
  gradientTo?: string
  sortOrder?: number
  isActive?: boolean
  groupId?: string
}) => {
  try {
    return await kyNextInstance
      .post('admin/banners/items', { json: data })
      .json<IApiResponseWrapperType<IBannerDataType>>()
  } catch (error) {
    throw new Error(await extractErrorMessage(error, 'Failed to create banner'))
  }
}

/**
 * Create banner item with image upload
 * @param formData - Form data containing banner information and image file
 * @returns Promise with created banner data
 * @throws Error with backend message
 */
export const createBannerWithUploadClientAPI = async (formData: FormData) => {
  try {
    return await kyNextInstance
      .post('admin/banners/items/upload', {
        body: formData,
      })
      .json<IApiResponseWrapperType<IBannerDataType>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to create banner with upload'),
    )
  }
}

/**
 * Update banner item
 * @param bannerId - Banner ID to update
 * @param data - Banner update data
 * @returns Promise with updated banner data
 * @throws Error with backend message
 */
export const updateBannerClientAPI = async (
  bannerId: string,
  data: {
    type?: 'TEXT' | 'IMAGE'
    position?: 'MAIN_CAROUSEL' | 'SIDE_TOP' | 'SIDE_BOTTOM'
    badge?: string
    title?: string
    description?: string
    highlight?: string
    ctaText?: string
    ctaLink?: string
    subLabel?: string
    gradientFrom?: string
    gradientTo?: string
    sortOrder?: number
    isActive?: boolean
  },
) => {
  try {
    return await kyNextInstance
      .patch(`admin/banners/item/${bannerId}`, { json: data })
      .json<IApiResponseWrapperType<IBannerDataType>>()
  } catch (error) {
    throw new Error(await extractErrorMessage(error, 'Failed to update banner'))
  }
}

/**
 * Update banner item with image upload
 * @param bannerId - Banner ID to update
 * @param formData - Form data containing updated banner information and image file
 * @returns Promise with updated banner data
 * @throws Error with backend message
 */
export const updateBannerWithUploadClientAPI = async (
  bannerId: string,
  formData: FormData,
) => {
  try {
    return await kyNextInstance
      .patch(`admin/banners/item/${bannerId}/upload`, {
        body: formData,
      })
      .json<IApiResponseWrapperType<IBannerDataType>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to update banner with upload'),
    )
  }
}

/**
 * Delete banner item
 * @param bannerId - Banner ID to delete
 * @returns Promise with success message
 * @throws Error with backend message
 */
export const deleteBannerClientAPI = async (bannerId: string) => {
  try {
    return await kyNextInstance
      .delete(`admin/banners/item/${bannerId}`)
      .json<IApiResponseWrapperType<{ message: string }>>()
  } catch (error) {
    throw new Error(await extractErrorMessage(error, 'Failed to delete banner'))
  }
}

// ============ Banner-Group Relationship APIs ============

/**
 * Add banner to a group
 * @param groupId - Banner group ID
 * @param bannerId - Banner ID to add
 * @returns Promise with success message
 * @throws Error with backend message
 */
export const addBannerToGroupClientAPI = async (
  groupId: string,
  bannerId: string,
) => {
  try {
    return await kyNextInstance
      .post(`admin/banners/group/${groupId}/items/${bannerId}`)
      .json<IApiResponseWrapperType<{ message: string }>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to add banner to group'),
    )
  }
}

/**
 * Remove banner from a group
 * @param groupId - Banner group ID
 * @param bannerId - Banner ID to remove
 * @returns Promise with success message
 * @throws Error with backend message
 */
export const removeBannerFromGroupClientAPI = async (
  groupId: string,
  bannerId: string,
) => {
  try {
    return await kyNextInstance
      .delete(`admin/banners/group/${groupId}/items/${bannerId}`)
      .json<IApiResponseWrapperType<{ message: string }>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to remove banner from group'),
    )
  }
}

/**
 * Bulk remove banners from a group
 * @param groupId - Banner group ID
 * @param bannerIds - Array of banner IDs to remove
 * @returns Promise with success message and count of removed banners
 * @throws Error with backend message
 */
export const bulkRemoveBannersFromGroupClientAPI = async (
  groupId: string,
  bannerIds: string[],
) => {
  try {
    return await kyNextInstance
      .delete(`admin/banners/group/${groupId}/items`, {
        json: { bannerIds },
      })
      .json<IApiResponseWrapperType<{ message: string; count: number }>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(
        error,
        'Failed to bulk remove banners from group',
      ),
    )
  }
}

/**
 * Reorder banners within a group
 * @param groupId - Banner group ID
 * @param orderData - Array of banner IDs with their sort order
 * @returns Promise with success message
 * @throws Error with backend message
 */
export const reorderBannersInGroupClientAPI = async (
  groupId: string,
  orderData: Array<{ bannerId: string; sortOrder: number }>,
) => {
  try {
    return await kyNextInstance
      .patch(`admin/banners/group/${groupId}/reorder`, {
        json: { orderData },
      })
      .json<IApiResponseWrapperType<{ message: string }>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to reorder banners in group'),
    )
  }
}
