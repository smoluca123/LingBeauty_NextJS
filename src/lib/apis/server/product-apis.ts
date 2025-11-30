import { kyServerInstance } from '@/lib/kyInstance/kyServer';
import {
  IApiPaginationParams,
  IApiPaginationResponseWrapperType,
} from '@/lib/types/interfaces/apis/api.interfaces';
import { IProductDataType } from '@/lib/types/interfaces/apis/product.interfaces';

export const getProductsAPI = async (
  options: IApiPaginationParams = { page: 1, limit: 10 }
) => {
  try {
    const data = await kyServerInstance
      .get('product', {
        searchParams: {
          page: options.page,
          limit: options.limit,
        },
        next: {
          revalidate: 60,
        },
      })
      .json<IApiPaginationResponseWrapperType<IProductDataType>>();
    return data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error);
    if (error.response) {
      const errorData = await error.response.json();
      throw errorData.message;
    }
    throw error.message;
  }
};
