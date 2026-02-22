import { kyNextInstance } from '@/lib/kyInstance/kyNext';
import { IAddressDataType } from '@/lib/types/interfaces/apis/address.interfaces';
import {
  IApiResponseWrapperType,
  INextApiResponseWrapperType,
} from '@/lib/types/interfaces/apis/api.interfaces';
import { AddressFormValues } from '@/lib/zod-schemas/addresses.schema';
import { HTTPError } from 'ky';

export const addMyAddressAPI = async (data: AddressFormValues) => {
  try {
    const response = await kyNextInstance
      .post('me/address', {
        json: data,
      })
      .json<
        INextApiResponseWrapperType<IApiResponseWrapperType<IAddressDataType>>
      >();
    return response.data;
  } catch (error) {
    if (error instanceof HTTPError) {
      const errorData = await error.response.json();
      throw new Error(errorData.message || 'Failed to fetch addresses');
    }
    throw error;
  }
};
