/**
 * Address Form Types
 * Types for address management forms
 */

export type AddressType = "HOME" | "OFFICE" | "OTHER";

export interface AddressFormValues {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  province: string;
  postalCode: string;
  type: AddressType;
  isDefault: boolean;
}

export interface UpdateAddressFormValues {
  fullName?: string;
  phone?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  type?: AddressType;
  isDefault?: boolean;
}
