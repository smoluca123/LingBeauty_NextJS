'use client';

import type { VariantItemProps } from './types';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/app/admin/flash-sales/constants';

export function VariantItem({
  variant,
  isSelected,
  isAlreadyAdded,
  onToggleSelect,
}: VariantItemProps) {
  return (
    <div
      className={`flex items-center gap-3 p-2 pl-12 hover:bg-muted/30 ${
        isAlreadyAdded ? 'opacity-50' : ''
      }`}
    >
      {!isAlreadyAdded && (
        <Checkbox checked={isSelected} onCheckedChange={onToggleSelect} />
      )}
      <div className='flex-1'>
        <p className='text-sm'>
          {variant.name}
          {variant.color && (
            <span className='text-muted-foreground ml-1'>
              - {variant.color}
            </span>
          )}
          {variant.size && (
            <span className='text-muted-foreground ml-1'>- {variant.size}</span>
          )}
        </p>
        <p className='text-xs text-muted-foreground'>
          {formatCurrency(parseFloat(variant.price))}
        </p>
      </div>
      {isAlreadyAdded && (
        <Badge variant='outline' className='text-xs mr-2'>
          Đã thêm
        </Badge>
      )}
    </div>
  );
}
