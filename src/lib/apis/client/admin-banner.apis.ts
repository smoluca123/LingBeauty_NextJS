import { kyNextInstance } from '@/lib/kyInstance/kyNext';
import { HTTPError } from 'ky';
import type {
  IApiPaginationResponseWrapperType,
  IApiResponseWrapperType,
} from '@/lib/types/interfaces/apis/api.interfaces';
import type {
  IBannerGroupDataType,
  IBannerDataType,
} from '@/lib/types/interfaces/apis/banner.interfaces';

const handleError = async (error: unknown) => {
  if (error instanceof HTTPError) {
    const data = await error.response.json().catch(() => ({}));
    throw new Error((data as { message?: string }).message || error.message);
  }
  throw error;
};

// ============ Banner Group APIs ============

/**
 * Get all banner groups with pagination
 * Calls: GET /admin/banners
 */
export const getAllBannerGroupsClientAPI = async (params?: {
  page?: number;
  limit?: number;
}) => {
  try {
    const searchParams: Record<string, string> = {};
    if (params?.page) searchParams.page = String(params.page);
    if (params?.limit) searchParams.limit = String(params.limit);

    return await kyNextInstance
      .get('admin/banners', { searchParams })
      .json<IApiPaginationResponseWrapperType<IBannerGroupDataType>>();
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Get banner group by ID
 * Calls: GET /admin/banners/group/[id]
 */
export const getBannerGroupByIdClientAPI = async (id: string) => {
  try {
    return await kyNextInstance
      .get(`admin/banners/group/${id}`)
      .json<IApiResponseWrapperType<IBannerGroupDataType>>();
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Create new banner group
 * Calls: POST /admin/banners/group
 */
export const createBannerGroupClientAPI = async (data: {
  name: string;
  slug: string;
  description?: string;
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
}) => {
  try {
    return await kyNextInstance
      .post('admin/banners/group', { json: data })
      .json<IApiResponseWrapperType<IBannerGroupDataType>>();
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Update banner group
 * Calls: PATCH /admin/banners/group/[id]
 */
export const updateBannerGroupClientAPI = async (
  id: string,
  data: {
    name?: string;
    slug?: string;
    description?: string;
    isActive?: boolean;
    startDate?: string;
    endDate?: string;
  },
) => {
  try {
    return await kyNextInstance
      .patch(`admin/banners/group/${id}`, { json: data })
      .json<IApiResponseWrapperType<IBannerGroupDataType>>();
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Delete banner group
 * Calls: DELETE /admin/banners/group/[id]
 */
export const deleteBannerGroupClientAPI = async (id: string) => {
  try {
    return await kyNextInstance
      .delete(`admin/banners/group/${id}`)
      .json<IApiResponseWrapperType<{ message: string }>>();
  } catch (error) {
    return handleError(error);
  }
};

// ============ Banner Item APIs ============

/**
 * Get all banners with pagination
 * Calls: GET /admin/banners/items
 */
export const getAllBannersClientAPI = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  groupId?: string;
}) => {
  try {
    const searchParams: Record<string, string> = {};
    if (params?.page) searchParams.page = String(params.page);
    if (params?.limit) searchParams.limit = String(params.limit);
    if (params?.search) searchParams.search = params.search;
    if (params?.groupId) searchParams.groupId = params.groupId;

    return await kyNextInstance
      .get('admin/banners/items', { searchParams })
      .json<IApiPaginationResponseWrapperType<IBannerDataType>>();
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Create banner item in a group
 * Calls: POST /admin/banners/group/[id]/items
 */
export const createBannerClientAPI = async (
  groupId: string,
  data: {
    type: 'TEXT' | 'IMAGE';
    position: 'MAIN_CAROUSEL' | 'SIDE_TOP' | 'SIDE_BOTTOM';
    badge?: string;
    title?: string;
    description?: string;
    highlight?: string;
    ctaText?: string;
    ctaLink?: string;
    subLabel?: string;
    gradientFrom?: string;
    gradientTo?: string;
    sortOrder?: number;
    isActive?: boolean;
  },
) => {
  try {
    return await kyNextInstance
      .post(`admin/banners/group/${groupId}/items`, { json: data })
      .json<IApiResponseWrapperType<IBannerDataType>>();
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Create banner item with image upload
 * Calls: POST /admin/banners/group/[id]/items/upload
 */
export const createBannerWithUploadClientAPI = async (
  groupId: string,
  formData: FormData,
) => {
  try {
    return await kyNextInstance
      .post(`admin/banners/group/${groupId}/items/upload`, {
        body: formData,
      })
      .json<IApiResponseWrapperType<IBannerDataType>>();
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Update banner item
 * Calls: PATCH /admin/banners/item/[id]
 */
export const updateBannerClientAPI = async (
  bannerId: string,
  data: {
    type?: 'TEXT' | 'IMAGE';
    position?: 'MAIN_CAROUSEL' | 'SIDE_TOP' | 'SIDE_BOTTOM';
    badge?: string;
    title?: string;
    description?: string;
    highlight?: string;
    ctaText?: string;
    ctaLink?: string;
    subLabel?: string;
    gradientFrom?: string;
    gradientTo?: string;
    sortOrder?: number;
    isActive?: boolean;
  },
) => {
  try {
    return await kyNextInstance
      .patch(`admin/banners/item/${bannerId}`, { json: data })
      .json<IApiResponseWrapperType<IBannerDataType>>();
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Update banner item with image upload
 * Calls: PATCH /admin/banners/item/[id]/upload
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
      .json<IApiResponseWrapperType<IBannerDataType>>();
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Delete banner item
 * Calls: DELETE /admin/banners/item/[id]
 */
export const deleteBannerClientAPI = async (bannerId: string) => {
  try {
    return await kyNextInstance
      .delete(`admin/banners/item/${bannerId}`)
      .json<IApiResponseWrapperType<{ message: string }>>();
  } catch (error) {
    return handleError(error);
  }
};

// ============ Banner-Group Relationship APIs ============

/**
 * Get all groups of a banner
 * Calls: GET /admin/banners/item/[id]/groups
 */
export const getBannerGroupsClientAPI = async (bannerId: string) => {
  try {
    return await kyNextInstance
      .get(`admin/banners/item/${bannerId}/groups`)
      .json<
        IApiResponseWrapperType<
          Array<{
            id: string;
            bannerGroupId: string;
            bannerId: string;
            sortOrder: number;
            bannerGroup: {
              id: string;
              name: string;
              slug: string;
              description: string | null;
              isActive: boolean;
            };
          }>
        >
      >();
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Add banner to a group
 * Calls: POST /admin/banners/item/[id]/groups
 */
export const addBannerToGroupClientAPI = async (
  bannerId: string,
  data: { groupId: string; sortOrder?: number },
) => {
  try {
    return await kyNextInstance
      .post(`admin/banners/item/${bannerId}/groups`, { json: data })
      .json<IApiResponseWrapperType<{ message: string }>>();
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Remove banner from a group
 * Calls: DELETE /admin/banners/item/[id]/groups/[groupId]
 */
export const removeBannerFromGroupClientAPI = async (
  bannerId: string,
  groupId: string,
) => {
  try {
    return await kyNextInstance
      .delete(`admin/banners/item/${bannerId}/groups/${groupId}`)
      .json<IApiResponseWrapperType<{ message: string }>>();
  } catch (error) {
    return handleError(error);
  }
};
