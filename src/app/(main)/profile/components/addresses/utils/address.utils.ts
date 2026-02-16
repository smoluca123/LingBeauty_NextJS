import type { IAddressDataType } from '@/lib/types/interfaces/apis/address.interfaces';

/**
 * Generates a full address string from address object
 * Filters out empty/undefined values and joins with comma separator
 */
export function getFullAddress(address: IAddressDataType): string {
  const parts = [
    address.addressLine1,
    address.addressLine2,
    address.city,
    address.province,
    address.postalCode,
    address.country,
  ].filter(Boolean);

  return parts.join(', ');
}
