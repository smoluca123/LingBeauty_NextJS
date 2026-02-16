import { DEFAULT_LIMIT, DEFAULT_PAGE } from '@/constants/api';
import { kyInstance } from '@/lib/kyInstance/ky';
import { IAddressDataType } from '@/lib/types/interfaces/apis/address.interfaces';
import {
  IApiPaginationParams,
  IApiPaginationResponseWrapperType,
  IApiResponseWrapperType,
} from '@/lib/types/interfaces/apis/api.interfaces';
import {
  AddressFormValues,
  UpdateAddressValues,
} from '@/lib/zod-schemas/addresses.schema';
import { HTTPError } from 'ky';

export const getMyAddressesAPI = async ({
  limit = DEFAULT_LIMIT,
  page = DEFAULT_PAGE,
  search,
}: IApiPaginationParams & { search?: string }): Promise<
  IApiPaginationResponseWrapperType<IAddressDataType>
> => {
  try {
    console.log('limit', limit);
    console.log('page', page);
    console.log('search', search);
    const response = await kyInstance
      .get('user/address', {
        searchParams: {
          limit,
          page,
          search,
        },
      })
      .json<IApiPaginationResponseWrapperType<IAddressDataType>>();
    return response;
  } catch (error) {
    if (error instanceof HTTPError) {
      const errorData = await error.response.json();
      throw new Error(errorData.message || 'Failed to fetch addresses');
    }
    throw error;
  }
};

export const addMyAddressAPI = async (data: AddressFormValues) => {
  try {
    const response = await kyInstance
      .post('user/address', {
        json: data,
      })
      .json<IApiResponseWrapperType<IAddressDataType>>();
    return response;
  } catch (error) {
    if (error instanceof HTTPError) {
      const errorData = await error.response.json();
      throw new Error(errorData.message || 'Failed to add address');
    }
    throw error;
  }
};

export const deleteMyAddressAPI = async (id: string) => {
  try {
    const response = await kyInstance.delete(`user/address/${id}`).json<
      IApiResponseWrapperType<{
        message: string;
      }>
    >();
    return response;
  } catch (error) {
    if (error instanceof HTTPError) {
      const errorData = await error.response.json();
      throw new Error(errorData.message || 'Failed to delete address');
    }
    throw error;
  }
};

export const updateMyAddressAPI = async ({
  id,
  data,
}: {
  id: string;
  data: UpdateAddressValues;
}) => {
  try {
    const response = await kyInstance
      .patch(`user/address/${id}`, { json: data })
      .json<IApiResponseWrapperType<IAddressDataType>>();
    return response;
  } catch (error) {
    if (error instanceof HTTPError) {
      const errorData = await error.response.json();
      throw new Error(errorData.message || 'Failed to update address');
    }
    throw error;
  }
};
