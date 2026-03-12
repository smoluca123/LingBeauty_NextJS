import { kyNextInstance } from '@/lib/kyInstance/kyNext';
import { HTTPError } from 'ky';
import type {
  IApiPaginationResponseWrapperType,
  IApiResponseWrapperType,
} from '@/lib/types/interfaces/apis/api.interfaces';
import type { IAdminBrandDataType } from '@/lib/types/interfaces/apis/admin-brand.interfaces';

const handleError = async (error: unknown) => {
  if (error instanceof HTTPError) {
    const data = await error.response.json().catch(() => ({}));
    throw new Error((data as { message?: string }).message || error.message);
  }
  throw error;
};

// ============ Get All Brands (Admin - pagination + search) ============
export const getAllAdminBrandsPagedClientAPI = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  order?: 'asc' | 'desc';
}) => {
  try {
    const searchParams: Record<string, string> = {};
    if (params?.page) searchParams.page = String(params.page);
    if (params?.limit) searchParams.limit = String(params.limit);
    if (params?.search) searchParams.search = params.search;
    if (params?.order) searchParams.order = params.order;

    return await kyNextInstance
      .get('admin/brands', { searchParams })
      .json<IApiPaginationResponseWrapperType<IAdminBrandDataType>>();
  } catch (error) {
    return handleError(error);
  }
};

// ============ Create Brand (Admin - multipart/form-data) ============
export const createBrandClientAPI = async (formData: FormData) => {
  try {
    return await kyNextInstance
      .post('admin/brands', { body: formData })
      .json<IApiResponseWrapperType<IAdminBrandDataType>>();
  } catch (error) {
    return handleError(error);
  }
};

// ============ Update Brand (Admin - multipart/form-data) ============
export const updateBrandClientAPI = async (id: string, formData: FormData) => {
  try {
    return await kyNextInstance
      .patch(`admin/brands/${id}`, { body: formData })
      .json<IApiResponseWrapperType<IAdminBrandDataType>>();
  } catch (error) {
    return handleError(error);
  }
};

// ============ Delete Brand (Admin) ============
export const deleteBrandClientAPI = async (id: string) => {
  try {
    return await kyNextInstance
      .delete(`admin/brands/${id}`)
      .json<IApiResponseWrapperType<IAdminBrandDataType>>();
  } catch (error) {
    return handleError(error);
  }
};
