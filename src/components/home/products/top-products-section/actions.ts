import { getProductsAPI } from '@/lib/apis/server/product-apis';
import { IApiPaginationParams } from '@/lib/types/interfaces/apis/api.interfaces';

export const getProducts = async (options: IApiPaginationParams) => {
  try {
    const response = await getProductsAPI(options);
    return response;
  } catch (error) {
    throw error;
  }
};
