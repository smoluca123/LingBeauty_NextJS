'use server';

import { kyInstance } from '@/lib/kyInstance/ky';
import { IAddressDataType } from '@/lib/types/interfaces/apis/address.interfaces';
import { IApiResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces';
import {
  AddressFormValues,
  UpdateAddressValues,
} from '@/lib/zod-schemas/addresses.schema';
import { HTTPError } from 'ky';

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
