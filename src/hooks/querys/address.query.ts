import { getMyAddressesAPI } from '@/lib/apis/client/address.apis';
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
      const response = await getMyAddressesAPI(params);
      return response;
    } catch (error) {
      throw new Error(error as string);
    }
  };

  return useQuery({
    queryKey: getMyAddressesQueryKey(params),
    queryFn: getMyAddresses,
  });
};
