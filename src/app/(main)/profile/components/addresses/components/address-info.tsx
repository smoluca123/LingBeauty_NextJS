'use client';

import { MapPin, Phone } from 'lucide-react';
import type { IAddressDataType } from '@/lib/types/interfaces/apis/address.interfaces';
import { getFullAddress } from '../utils/address.utils';

interface AddressInfoProps {
  address: IAddressDataType;
}

/**
 * Displays contact information (phone and full address)
 * Pure presentational component
 */
export function AddressInfo({ address }: AddressInfoProps) {
  return (
    <div className="space-y-2">
      {/* Phone */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Phone className="h-3.5 w-3.5" />
        <span>{address.phone}</span>
      </div>

      {/* Address */}
      <div className="flex items-start gap-2 text-sm text-muted-foreground">
        <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
        <span>{getFullAddress(address)}</span>
      </div>
    </div>
  );
}
