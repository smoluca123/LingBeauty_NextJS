import { kyServerInstance } from '@/lib/kyInstance/kyServer';
import { IApiResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces';
import { ICategoryDataType } from '@/lib/types/interfaces/apis/header.interfaces';

export const getCategoriesServerAPI = async () => {
  try {
    const response = await kyServerInstance
      .get('category')
      .json<IApiResponseWrapperType<ICategoryDataType[]>>();
    return response.data;
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return [];
  }
};
