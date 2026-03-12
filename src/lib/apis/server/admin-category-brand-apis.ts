'use server';

import { kyInstance } from '@/lib/kyInstance/ky';
import type { IApiResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces';
import type { ICategoryDataType } from '@/lib/types/interfaces/apis/header.interfaces';
import type {
  IApiPaginationResponseWrapperType,
  IApiPaginationParams,
} from '@/lib/types/interfaces/apis/api.interfaces';
import type { IBrandDataType } from '@/lib/types/interfaces/apis/header.interfaces';

// Helper: loại bỏ undefined trước khi truyền vào searchParams
const buildSearchParams = (
  options: Record<string, string | number | boolean | undefined>,
): Record<string, string | number | boolean> =>
  Object.fromEntries(
    Object.entries(options).filter(([, v]) => v !== undefined),
  ) as Record<string, string | number | boolean>;

// ============ Get All Categories (Admin - yêu cầu auth JWT) ============
export const getAllAdminCategoriesAPI = async () =>
  kyInstance
    .get('category')
    .json<IApiResponseWrapperType<ICategoryDataType[]>>();

// ============ Get All Brands (Admin - yêu cầu auth JWT) ============
export const getAllAdminBrandsAPI = async (
  params: IApiPaginationParams & { search?: string; order?: 'asc' | 'desc' } = {},
) =>
  kyInstance
    .get('brand', {
      searchParams: buildSearchParams({
        page: params.page ?? 1,
        limit: params.limit ?? 100, // Lấy nhiều để fill dropdown
        search: params.search,
        order: params.order,
      }),
    })
    .json<IApiPaginationResponseWrapperType<IBrandDataType>>();

// ============ Create Brand (Admin - yêu cầu auth JWT) ============
export const createBrandAPI = async (formData: FormData) =>
  kyInstance
    .post('brand', {
      body: formData,
    })
    .json<IApiPaginationResponseWrapperType<IBrandDataType>>();

// ============ Update Brand (Admin - yêu cầu auth JWT) ============
export const updateBrandAPI = async (id: string, formData: FormData) =>
  kyInstance
    .patch(`brand/${id}`, {
      body: formData,
    })
    .json<IApiPaginationResponseWrapperType<IBrandDataType>>();

// ============ Delete Brand (Admin - yêu cầu auth JWT) ============
export const deleteBrandAPI = async (id: string) =>
  kyInstance
    .delete(`brand/${id}`)
    .json<IApiPaginationResponseWrapperType<IBrandDataType>>();

// ============ Create Category (Admin - yêu cầu auth JWT) ============
export const createCategoryAPI = async (formData: FormData) =>
  kyInstance
    .post('category', {
      body: formData,
    })
    .json<IApiResponseWrapperType<ICategoryDataType>>();

// ============ Create Sub-Category (Admin - yêu cầu auth JWT) ============
export const createSubCategoryAPI = async (parentId: string, formData: FormData) =>
  kyInstance
    .post(`category/${parentId}/sub-category`, {
      body: formData,
    })
    .json<IApiResponseWrapperType<ICategoryDataType>>();

// ============ Update Category (Admin - yêu cầu auth JWT) ============
export const updateCategoryAPI = async (id: string, formData: FormData) =>
  kyInstance
    .patch(`category/${id}`, {
      body: formData,
    })
    .json<IApiResponseWrapperType<ICategoryDataType>>();

// ============ Delete Category (Admin - yêu cầu auth JWT) ============
export const deleteCategoryAPI = async (id: string) =>
  kyInstance
    .delete(`category/${id}`)
    .json<IApiResponseWrapperType<null>>();
