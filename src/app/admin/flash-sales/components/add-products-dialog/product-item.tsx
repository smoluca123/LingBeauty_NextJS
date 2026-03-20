'use client';

import { ChevronDown } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleTrigger } from '@/components/ui/collapsible';
import { formatCurrency } from '@/app/admin/flash-sales/constants';
import { ProductImage } from './product-image';
import type { ProductItemProps } from './types';

export function ProductItem({
  product,
  isExpanded,
  isSelected,
  isAlreadyAdded,
  hasVariants,
  onToggleExpand,
  onToggleSelect,
}: ProductItemProps) {
  return (
    <Collapsible open={isExpanded} onOpenChange={onToggleExpand}>
      <div className='rounded-lg border bg-card'>
        <CollapsibleTrigger asChild>
          <div
            className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-muted/50 transition-colors ${
              isAlreadyAdded ? 'opacity-50' : ''
            }`}
          >
            {!hasVariants && !isAlreadyAdded && (
              <Checkbox
                checked={isSelected}
                onCheckedChange={onToggleSelect}
                onClick={(e) => e.stopPropagation()}
              />
            )}
            {hasVariants && (
              <ChevronDown
                className={`h-4 w-4 text-muted-foreground transition-transform ${
                  isExpanded ? '' : '-rotate-90'
                }`}
              />
            )}
            <ProductImage
              src={product.primaryImage?.media?.url}
              alt={product.name}
            />
            <div className='flex-1 min-w-0'>
              <p className='font-medium text-sm truncate'>{product.name}</p>
              <p className='text-xs text-muted-foreground'>
                {formatCurrency(parseFloat(product.basePrice))}
                {hasVariants && (
                  <span className='ml-2 text-primary'>
                    ({product.variants.length} biến thể)
                  </span>
                )}
              </p>
            </div>
            {isAlreadyAdded && (
              <Badge variant='outline' className='text-xs'>
                Đã thêm
              </Badge>
            )}
          </div>
        </CollapsibleTrigger>
      </div>
    </Collapsible>
  );
}
