'use server';

import { kyInstance } from '@/lib/kyInstance/ky';
import { IApiResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces';
import { IAdminCategoryDataType } from '@/lib/types/interfaces/apis/admin-product.interfaces';

export const getAdminCategoriesAPI = async (): Promise<
  IApiResponseWrapperType<IAdminCategoryDataType[]>
> => {
  try {
    const data = await kyInstance
      .get('category')
      .json<IApiResponseWrapperType<IAdminCategoryDataType[]>>();
    return data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error fetching admin categories:', error);
    if (error.response) {
      const errorData = await error.response.json();
      throw errorData.message;
    }
    throw error.message;
  }
};
