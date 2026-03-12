import { kyNextInstance } from '@/lib/kyInstance/kyNext';
import { HTTPError } from 'ky';
import type {
  IApiResponseWrapperType,
  IApiPaginationResponseWrapperType,
} from '@/lib/types/interfaces/apis/api.interfaces';
import type {
  ICategoryDataType,
  IBrandDataType,
} from '@/lib/types/interfaces/apis/header.interfaces';

const handleError = async (error: unknown) => {
  if (error instanceof HTTPError) {
    const data = await error.response.json().catch(() => ({}));
    throw new Error((data as { message?: string }).message || error.message);
  }
  throw error;
};

// ============ Get All Categories (Admin) ============
export const getAllAdminCategoriesClientAPI = async () => {
  try {
    return await kyNextInstance
      .get('admin/categories')
      .json<IApiResponseWrapperType<ICategoryDataType[]>>();
  } catch (error) {
    return handleError(error);
  }
};

// ============ Create Category (Admin) ============
export const createCategoryClientAPI = async (formData: FormData) => {
  try {
    return await kyNextInstance
      .post('admin/categories', { body: formData })
      .json<IApiResponseWrapperType<ICategoryDataType>>();
  } catch (error) {
    return handleError(error);
  }
};

// ============ Create Sub-Category (Admin - multipart/form-data) ============
export const createSubCategoryClientAPI = async (parentId: string, formData: FormData) => {
  try {
    return await kyNextInstance
      .post(`admin/categories/${parentId}/sub-category`, { body: formData })
      .json<IApiResponseWrapperType<ICategoryDataType>>();
  } catch (error) {
    return handleError(error);
  }
};

// ============ Update Category (Admin - multipart/form-data) ============
export const updateCategoryClientAPI = async (id: string, formData: FormData) => {
  try {
    return await kyNextInstance
      .patch(`admin/categories/${id}`, { body: formData })
      .json<IApiResponseWrapperType<ICategoryDataType>>();
  } catch (error) {
    return handleError(error);
  }
};

// ============ Delete Category (Admin) ============
export const deleteCategoryClientAPI = async (id: string) => {
  try {
    return await kyNextInstance
      .delete(`admin/categories/${id}`)
      .json<IApiResponseWrapperType<ICategoryDataType>>();
  } catch (error) {
    return handleError(error);
  }
};

// ============ Get All Brands (Admin) ============
export const getAllAdminBrandsClientAPI = async () => {
  try {
    return await kyNextInstance
      .get('admin/brands')
      .json<IApiPaginationResponseWrapperType<IBrandDataType>>();
  } catch (error) {
    return handleError(error);
  }
};
