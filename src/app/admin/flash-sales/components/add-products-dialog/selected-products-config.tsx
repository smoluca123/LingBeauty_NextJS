'use client';

import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  FLASH_SALE_VALIDATION,
  formatCurrency,
} from '@/app/admin/flash-sales/constants';
import { ProductImage } from './product-image';

import type { SelectedProductsConfigProps } from './types';

export function SelectedProductsConfig({
  selectedProducts,
  products,
  onUpdate,
  onRemove,
}: SelectedProductsConfigProps) {
  const selectedCount = selectedProducts.size;

  if (selectedCount === 0) {
    return (
      <div className='flex flex-col items-center justify-center h-32 text-muted-foreground p-4 text-center'>
        <Check className='h-8 w-8 mb-2 opacity-50' />
        <p className='text-sm'>
          Chọn sản phẩm từ danh sách bên trên để cấu hình
        </p>
      </div>
    );
  }

  return (
    <div className='p-2 space-y-2'>
      {Array.from(selectedProducts.entries()).map(([key, product]) => {
        const originalProduct = products.find(
          (p) => p.id === product.productId,
        );
        const variant = originalProduct?.variants?.find(
          (v) => v.id === product.variantId,
        );
        const discountPct =
          product.originalPrice > 0
            ? Math.round(
                ((product.originalPrice - product.flashPrice) /
                  product.originalPrice) *
                  100,
              )
            : 0;

        return (
          <div key={key} className='p-3 rounded-lg border bg-card space-y-3'>
            <div className='flex items-start gap-2'>
              <ProductImage
                src={originalProduct?.primaryImage?.media?.url}
                alt={originalProduct?.name ?? ''}
                size='sm'
              />
              <div className='flex-1 min-w-0'>
                <p className='font-medium text-sm truncate'>
                  {originalProduct?.name}
                </p>
                {variant && (
                  <p className='text-xs text-muted-foreground'>
                    {variant.name}
                    {variant.color && ` - ${variant.color}`}
                    {variant.size && ` - ${variant.size}`}
                  </p>
                )}
              </div>
              <Button
                variant='ghost'
                size='sm'
                className='h-6 px-2 text-destructive'
                onClick={() =>
                  onRemove(
                    originalProduct!,
                    product.variantId ? variant : undefined,
                  )
                }
              >
                ×
              </Button>
            </div>

            <div className='grid grid-cols-4 gap-4'>
              <div>
                <label className='text-xs text-muted-foreground'>Giá gốc</label>
                <p className='text-sm font-medium line-through text-muted-foreground'>
                  {formatCurrency(product.originalPrice)}
                </p>
              </div>
              <div>
                <label className='text-xs text-muted-foreground'>
                  Giá flash <span className='text-destructive'>*</span>
                </label>
                <Input
                  type='number'
                  value={product.flashPrice}
                  onChange={(e) =>
                    onUpdate(key, {
                      flashPrice: parseInt(e.target.value) || 0,
                    })
                  }
                  className='h-8 text-sm'
                  min={FLASH_SALE_VALIDATION.MIN_FLASH_PRICE}
                />
              </div>
              <div>
                <label className='text-xs text-muted-foreground'>
                  Số lượng tối đa <span className='text-destructive'>*</span>
                </label>
                <Input
                  type='number'
                  value={product.maxQuantity}
                  onChange={(e) =>
                    onUpdate(key, {
                      maxQuantity: parseInt(e.target.value) || 0,
                    })
                  }
                  className='h-8 text-sm'
                  min={FLASH_SALE_VALIDATION.MAX_QUANTITY_MIN}
                />
              </div>
              <div>
                <label className='text-xs text-muted-foreground'>
                  Giới hạn/đơn <span className='text-destructive'>*</span>
                </label>
                <Input
                  type='number'
                  value={product.limitPerOrder}
                  onChange={(e) =>
                    onUpdate(key, {
                      limitPerOrder: parseInt(e.target.value) || 0,
                    })
                  }
                  className='h-8 text-sm'
                  min={FLASH_SALE_VALIDATION.LIMIT_PER_ORDER_MIN}
                  max={FLASH_SALE_VALIDATION.LIMIT_PER_ORDER_MAX}
                />
              </div>
            </div>

            <div className='flex items-center justify-between text-xs'>
              <span className='text-muted-foreground'>Giảm giá:</span>
              <span className='font-medium text-green-600'>
                -{discountPct}%
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
