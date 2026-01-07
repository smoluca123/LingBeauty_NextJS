import { kyInstance } from '@/lib/kyInstance/ky';
import { IApiResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces';
import { ICategoryDataType } from '@/lib/types/interfaces/apis/header.interfaces';

export const getCategoriesServerAPI = async () => {
  try {
    const response = await kyInstance
      .get('category')
      .json<IApiResponseWrapperType<ICategoryDataType[]>>();
    return response.data;
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return [];
  }
};
