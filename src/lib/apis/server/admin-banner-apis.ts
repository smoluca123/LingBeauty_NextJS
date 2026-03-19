'use server';

import { kyInstance } from '@/lib/kyInstance/ky';
import type {
  IApiResponseWrapperType,
  IApiPaginationResponseWrapperType,
  IApiPaginationParams,
} from '@/lib/types/interfaces/apis/api.interfaces';
import type {
  IBannerGroupDataType,
  IBannerDataType,
} from '@/lib/types/interfaces/apis/banner.interfaces';

// Helper: loại bỏ undefined trước khi truyền vào searchParams
const buildSearchParams = (
  options: Record<string, string | number | boolean | undefined>,
): Record<string, string | number | boolean> =>
  Object.fromEntries(
    Object.entries(options).filter(([, v]) => v !== undefined),
  ) as Record<string, string | number | boolean>;

// ============ Banner Group APIs ============

/**
 * Get all banner groups (Admin - requires JWT auth)
 * @param params - Pagination params and optional bannerId to filter groups containing that banner
 */
export const getAllBannerGroupsAPI = async (
  params: IApiPaginationParams & { bannerId?: string } = {},
) =>
  kyInstance
    .get('banner', {
      searchParams: buildSearchParams({
        page: params.page ?? 1,
        limit: params.limit ?? 50,
        bannerId: params.bannerId,
      }),
    })
    .json<IApiPaginationResponseWrapperType<IBannerGroupDataType>>();

/**
 * Get banner group by ID (Admin - requires JWT auth)
 */
export const getBannerGroupByIdAPI = async (id: string) =>
  kyInstance
    .get(`banner/group/${id}`)
    .json<IApiResponseWrapperType<IBannerGroupDataType>>();

/**
 * Create banner group (Admin - requires JWT auth)
 */
export const createBannerGroupAPI = async (data: {
  name: string;
  slug: string;
  description?: string;
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
}) =>
  kyInstance
    .post('banner/group', { json: data })
    .json<IApiResponseWrapperType<IBannerGroupDataType>>();

/**
 * Update banner group (Admin - requires JWT auth)
 */
export const updateBannerGroupAPI = async (
  id: string,
  data: {
    name?: string;
    slug?: string;
    description?: string;
    isActive?: boolean;
    startDate?: string;
    endDate?: string;
  },
) =>
  kyInstance
    .patch(`banner/group/${id}`, { json: data })
    .json<IApiResponseWrapperType<IBannerGroupDataType>>();

/**
 * Delete banner group (Admin - requires JWT auth)
 */
export const deleteBannerGroupAPI = async (id: string) =>
  kyInstance
    .delete(`banner/group/${id}`)
    .json<IApiResponseWrapperType<{ message: string }>>();

// ============ Banner Item APIs ============

/**
 * Get all banners with pagination (Admin - requires JWT auth)
 * Calls: GET /banner/items
 */
export const getAllBannersAPI = async (
  params: {
    page?: number;
    limit?: number;
    search?: string;
    groupId?: string;
  } = {},
) =>
  kyInstance
    .get('banner/items', {
      searchParams: buildSearchParams({
        page: params.page ?? 1,
        limit: params.limit ?? 50,
        search: params.search,
        groupId: params.groupId,
      }),
    })
    .json<IApiPaginationResponseWrapperType<IBannerDataType>>();

/**
 * Create banner item (Admin - requires JWT auth)
 * Note: groupId is now passed in the data body, not in URL
 */
export const createBannerAPI = async (data: {
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
  groupId?: string;
}) =>
  kyInstance
    .post('banner/items', { json: data })
    .json<IApiResponseWrapperType<IBannerDataType>>();

/**
 * Create banner item with image upload (Admin - requires JWT auth)
 * Note: groupId should be included in the FormData as 'groupId' field
 */
export const createBannerWithUploadAPI = async (formData: FormData) =>
  kyInstance
    .post('banner/items/upload', {
      body: formData,
    })
    .json<IApiResponseWrapperType<IBannerDataType>>();

/**
 * Update banner item (Admin - requires JWT auth)
 */
export const updateBannerAPI = async (
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
) =>
  kyInstance
    .patch(`banner/item/${bannerId}`, { json: data })
    .json<IApiResponseWrapperType<IBannerDataType>>();

/**
 * Update banner item with image upload (Admin - requires JWT auth)
 */
export const updateBannerWithUploadAPI = async (
  bannerId: string,
  formData: FormData,
) =>
  kyInstance
    .patch(`banner/item/${bannerId}/upload`, {
      body: formData,
    })
    .json<IApiResponseWrapperType<IBannerDataType>>();

/**
 * Delete banner item (Admin - requires JWT auth)
 */
export const deleteBannerAPI = async (bannerId: string) =>
  kyInstance
    .delete(`banner/item/${bannerId}`)
    .json<IApiResponseWrapperType<{ message: string }>>();

// ============ Banner-Group Relationship APIs ============

/**
 * Get all groups of a banner (Admin - requires JWT auth)
 */
export const getBannerGroupsAPI = async (bannerId: string) =>
  kyInstance.get(`banner/item/${bannerId}/groups`).json<
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

/**
 * Add banner to a group (Admin - requires JWT auth)
 * Note: BE endpoint is POST /banner/group/:groupId/items/:bannerId
 */
export const addBannerToGroupAPI = async (groupId: string, bannerId: string) =>
  kyInstance
    .post(`banner/group/${groupId}/items/${bannerId}`)
    .json<IApiResponseWrapperType<{ message: string }>>();

/**
 * Remove banner from a group (Admin - requires JWT auth)
 * Note: BE endpoint is DELETE /banner/group/:groupId/items/:bannerId
 */
export const removeBannerFromGroupAPI = async (
  groupId: string,
  bannerId: string,
) =>
  kyInstance
    .delete(`banner/group/${groupId}/items/${bannerId}`)
    .json<IApiResponseWrapperType<{ message: string }>>();

/**
 * Bulk remove banners from a group (Admin - requires JWT auth)
 * Note: BE endpoint is DELETE /banner/group/:groupId/items
 */
export const bulkRemoveBannersFromGroupAPI = async (
  groupId: string,
  bannerIds: string[],
) =>
  kyInstance
    .delete(`banner/group/${groupId}/items`, {
      json: { bannerIds },
    })
    .json<IApiResponseWrapperType<{ message: string; count: number }>>();

/**
 * Reorder banners within a group (Admin - requires JWT auth)
 * Note: BE endpoint is PATCH /banner/group/:groupId/reorder
 */
export const reorderBannersInGroupAPI = async (
  groupId: string,
  orderData: Array<{ bannerId: string; sortOrder: number }>,
) =>
  kyInstance
    .patch(`banner/group/${groupId}/reorder`, {
      json: { orderData },
    })
    .json<IApiResponseWrapperType<{ message: string }>>();
