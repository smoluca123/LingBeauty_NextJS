'use server'

import { kyInstance } from '@/lib/kyInstance/ky'
import type { IAddressDataType } from '@/lib/types/interfaces/apis/address.interfaces'
import type { IApiResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces'
import type {
  AddressFormValues,
  UpdateAddressFormValues,
} from '@/lib/types/forms'

// Let HTTPError bubble up naturally — proxyRoute in route handlers handles forwarding.

/**
 * Add new address for current user
 * @param data - Address form data
 * @returns Created address data
 * @throws Error with backend message if request fails
 */
export const addMyAddressAPI = async (data: AddressFormValues) =>
  kyInstance
    .post('user/address', { json: data })
    .json<IApiResponseWrapperType<IAddressDataType>>()

/**
 * Delete address by ID
 * @param id - Address ID to delete
 * @returns Success message
 * @throws Error with backend message if request fails
 */
export const deleteMyAddressAPI = async (id: string) =>
  kyInstance
    .delete(`user/address/${id}`)
    .json<IApiResponseWrapperType<{ message: string }>>()

/**
 * Update address by ID
 * @param params - Object containing address ID and update data
 * @returns Updated address data
 * @throws Error with backend message if request fails
 */
export const updateMyAddressAPI = async ({
  id,
  data,
}: {
  id: string
  data: UpdateAddressFormValues
}) =>
  kyInstance
    .patch(`user/address/${id}`, { json: data })
    .json<IApiResponseWrapperType<IAddressDataType>>()
