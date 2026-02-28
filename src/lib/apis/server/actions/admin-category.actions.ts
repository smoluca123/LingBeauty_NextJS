'use server';

import { kyInstance } from '@/lib/kyInstance/ky';
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

export const createCategoryAction = async (
  data: ICreateCategoryPayload,
): Promise<IApiResponseWrapperType<IAdminCategoryDataType>> => {
  try {
    const response = await kyInstance
      .post('category', { json: data })
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

export const createSubCategoryAction = async (
  parentId: string,
  data: ICreateCategoryPayload,
): Promise<IApiResponseWrapperType<IAdminCategoryDataType>> => {
  try {
    const response = await kyInstance
      .post(`category/${parentId}/sub-category`, { json: data })
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

export const updateCategoryAction = async (
  id: string,
  data: IUpdateCategoryPayload,
): Promise<IApiResponseWrapperType<IAdminCategoryDataType>> => {
  try {
    const response = await kyInstance
      .patch(`category/${id}`, { json: data })
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

export const deleteCategoryAction = async (
  id: string,
): Promise<IApiResponseWrapperType<IAdminCategoryDataType>> => {
  try {
    const response = await kyInstance
      .delete(`category/${id}`)
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
