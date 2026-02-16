// ============ Address Interfaces ============
export interface IAddressDataType {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  type: 'HOME' | 'OFFICE' | 'OTHER';
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateAddressPayload {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  province: string;
  postalCode: string;
  type: 'HOME' | 'OFFICE' | 'OTHER';
  country?: string;
  isDefault?: boolean;
}

export type IUpdateAddressPayload = Partial<ICreateAddressPayload>;
