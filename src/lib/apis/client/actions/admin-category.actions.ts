'use client';

import { kyNextInstance } from '@/lib/kyInstance/kyNext';
import { IApiResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces';
import { IAdminCategoryDataType } from '@/lib/types/interfaces/apis/admin-product.interfaces';
import { HTTPError } from 'ky';

export interface ICreateCategoryPayload {
  name: string;
  description?: string;
  parentId?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface IUpdateCategoryPayload {
  name?: string;
  description?: string;
  parentId?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export const getAdminCategoriesClientAPI = async (): Promise<
  IApiResponseWrapperType<IAdminCategoryDataType[]>
> => {
  try {
    const response = await kyNextInstance
      .get('admin/categories')
      .json<IApiResponseWrapperType<IAdminCategoryDataType[]>>();
    return response;
  } catch (error) {
    if (error instanceof HTTPError) {
      const errorData = await error.response.json();
      throw new Error(errorData.message || 'Failed to fetch categories');
    }
    throw error;
  }
};

export const createCategoryClientAPI = async (
  data: ICreateCategoryPayload,
): Promise<IApiResponseWrapperType<IAdminCategoryDataType>> => {
  try {
    const response = await kyNextInstance
      .post('admin/categories', { json: data })
      .json<IApiResponseWrapperType<IAdminCategoryDataType>>();
    return response;
  } catch (error) {
    if (error instanceof HTTPError) {
      const errorData = await error.response.json();
      throw new Error(errorData.message || 'Failed to create category');
    }
    throw error;
  }
};

export const createSubCategoryClientAPI = async (
  parentId: string,
  data: ICreateCategoryPayload,
): Promise<IApiResponseWrapperType<IAdminCategoryDataType>> => {
  try {
    const response = await kyNextInstance
      .post(`admin/categories/${parentId}/sub-category`, { json: data })
      .json<IApiResponseWrapperType<IAdminCategoryDataType>>();
    return response;
  } catch (error) {
    if (error instanceof HTTPError) {
      const errorData = await error.response.json();
      throw new Error(errorData.message || 'Failed to create sub-category');
    }
    throw error;
  }
};

export const updateCategoryClientAPI = async (
  id: string,
  data: IUpdateCategoryPayload,
): Promise<IApiResponseWrapperType<IAdminCategoryDataType>> => {
  try {
    const response = await kyNextInstance
      .patch(`admin/categories/${id}`, { json: data })
      .json<IApiResponseWrapperType<IAdminCategoryDataType>>();
    return response;
  } catch (error) {
    if (error instanceof HTTPError) {
      const errorData = await error.response.json();
      throw new Error(errorData.message || 'Failed to update category');
    }
    throw error;
  }
};

export const deleteCategoryClientAPI = async (
  id: string,
): Promise<IApiResponseWrapperType<IAdminCategoryDataType>> => {
  try {
    const response = await kyNextInstance
      .delete(`admin/categories/${id}`)
      .json<IApiResponseWrapperType<IAdminCategoryDataType>>();
    return response;
  } catch (error) {
    if (error instanceof HTTPError) {
      const errorData = await error.response.json();
      throw new Error(errorData.message || 'Failed to delete category');
    }
    throw error;
  }
};
