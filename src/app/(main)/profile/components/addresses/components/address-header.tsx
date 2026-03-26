'use client';

import { CheckCircle2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import {
  ADDRESS_TYPE_LABELS,
  ADDRESS_TYPE_ICONS,
} from '@/app/(main)/profile/components/addresses/constants/address.constants';

import type { IAddressDataType } from '@/lib/types/interfaces/apis/address.interfaces';

interface AddressHeaderProps {
  fullName: string;
  isDefault: boolean;
  type: IAddressDataType['type'];
}

/**
 * Displays address header with name, default badge, and type badge
 * Pure presentational component
 */
export function AddressHeader({
  fullName,
  isDefault,
  type,
}: AddressHeaderProps) {
  const TypeIcon = ADDRESS_TYPE_ICONS[type];

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="font-semibold text-foreground">{fullName}</span>

      {isDefault && (
        <Badge className="bg-primary-pink/10 text-primary-pink border-0 text-xs">
          <CheckCircle2 className="mr-1 h-3 w-3" />
          Mặc định
        </Badge>
      )}

      <Badge variant="outline" className="text-xs gap-1 text-muted-foreground">
        <TypeIcon className="h-4 w-4" />
        {ADDRESS_TYPE_LABELS[type]}
      </Badge>
    </div>
  );
}
