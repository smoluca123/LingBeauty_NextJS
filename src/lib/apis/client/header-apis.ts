import { kyClientInstance } from '@/lib/kyInstance/kyClient';
import { IApiResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces';
import { ICategoryDataType } from '@/lib/types/interfaces/apis/header.interfaces';

export const getCategoriesAPI = async () => {
  try {
    const response = await kyClientInstance
      .get('category')
      .json<IApiResponseWrapperType<ICategoryDataType[]>>();
    return response;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response) {
      const errorData = await error.response.json();
      throw errorData.message;
    }
    throw error.message;
  }
};
