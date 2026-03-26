// ============ Address Interfaces ============

import { AddressType } from './address.interfaces'

/**
 * Address type - re-exported from forms for consistency
 */
export type { AddressType } from '../../forms/address.types'

export interface IAddressDataType {
  id: string
  userId: string
  fullName: string
  phone: string
  addressLine1: string
  addressLine2?: string
  city: string
  province: string
  postalCode: string
  country: string
  type: AddressType
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export interface ICreateAddressPayload {
  fullName: string
  phone: string
  addressLine1: string
  addressLine2?: string
  city: string
  province: string
  postalCode: string
  type: AddressType
  country?: string
  isDefault?: boolean
}

export type IUpdateAddressPayload = Partial<ICreateAddressPayload>
