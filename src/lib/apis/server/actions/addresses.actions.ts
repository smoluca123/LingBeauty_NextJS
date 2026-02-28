'use server';

import { kyInstance } from '@/lib/kyInstance/ky';
import type { IAddressDataType } from '@/lib/types/interfaces/apis/address.interfaces';
import type { IApiResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces';
import type {
  AddressFormValues,
  UpdateAddressValues,
} from '@/lib/zod-schemas/addresses.schema';

// Let HTTPError bubble up naturally — proxyRoute in route handlers handles forwarding.

export const addMyAddressAPI = async (data: AddressFormValues) =>
  kyInstance
    .post('user/address', { json: data })
    .json<IApiResponseWrapperType<IAddressDataType>>();

export const deleteMyAddressAPI = async (id: string) =>
  kyInstance
    .delete(`user/address/${id}`)
    .json<IApiResponseWrapperType<{ message: string }>>();

export const updateMyAddressAPI = async ({
  id,
  data,
}: {
  id: string;
  data: UpdateAddressValues;
}) =>
  kyInstance
    .patch(`user/address/${id}`, { json: data })
    .json<IApiResponseWrapperType<IAddressDataType>>();
