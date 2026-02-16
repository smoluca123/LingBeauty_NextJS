import { kyNextInstance } from '@/lib/kyInstance/kyNext';
import { IAddressDataType } from '@/lib/types/interfaces/apis/address.interfaces';
import {
  IApiPaginationResponseWrapperType,
  INextApiResponseWrapperType,
} from '@/lib/types/interfaces/apis/api.interfaces';
import { useQuery } from '@tanstack/react-query';

export const getMyAddressesQueryKey = (params?: {
  limit?: number;
  page?: number;
  search?: string;
}) => {
  return [
    'addresses',
    {
      limit: params?.limit || 10,
      page: params?.page || 1,
      search: params?.search,
    },
  ];
};

export const useGetMyAddressesQuery = (params?: {
  limit?: number;
  page?: number;
  search?: string;
}) => {
  const getMyAddresses = async () => {
    try {
      //   const response = await getMyAddressesAPI(params || {});
      const response = await kyNextInstance
        .get('me/address', {
          searchParams: {
            limit: params?.limit?.toString(),
            page: params?.page?.toString(),
            search: params?.search,
          },
        })
        .json<
          INextApiResponseWrapperType<
            IApiPaginationResponseWrapperType<IAddressDataType>
          >
        >();
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return useQuery({
    queryKey: getMyAddressesQueryKey(params),
    queryFn: getMyAddresses,
  });
};
