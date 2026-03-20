'use client';

import { Loader2, Package, ChevronDown } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { formatCurrency } from '@/app/admin/flash-sales/constants';
import { ProductImage } from './product-image';
import { makeProductKey } from './types';
import type { ProductListProps } from './types';

export function ProductList({
  products,
  isLoading,
  expandedProducts,
  selectedProducts,
  existingProductKeys,
  onToggleExpand,
  onToggleSelection,
}: ProductListProps) {
  const isProductSelected = (productId: string, variantId?: string) =>
    selectedProducts.has(makeProductKey(productId, variantId));

  const isProductAlreadyAdded = (productId: string, variantId?: string) =>
    existingProductKeys.has(makeProductKey(productId, variantId));

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-32'>
        <Loader2 className='h-6 w-6 animate-spin text-muted-foreground' />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center h-32 text-muted-foreground'>
        <Package className='h-8 w-8 mb-2 opacity-50' />
        <p className='text-sm'>Không tìm thấy sản phẩm</p>
      </div>
    );
  }

  return (
    <div className='p-2 space-y-1'>
      {products.map((product) => {
        const hasVariants = product.variants && product.variants.length > 0;
        const isExpanded = expandedProducts.has(product.id);
        const productAlreadyAdded =
          !hasVariants && isProductAlreadyAdded(product.id);

        return (
          <Collapsible
            key={product.id}
            open={isExpanded}
            onOpenChange={() => onToggleExpand(product.id)}
          >
            <div className='rounded-lg border bg-card'>
              <CollapsibleTrigger asChild>
                <div
                  className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-muted/50 transition-colors ${
                    productAlreadyAdded ? 'opacity-50' : ''
                  }`}
                >
                  {!hasVariants && !productAlreadyAdded && (
                    <Checkbox
                      checked={isProductSelected(product.id)}
                      onCheckedChange={() => onToggleSelection(product)}
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
                    <p className='font-medium text-sm truncate'>
                      {product.name}
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      {formatCurrency(parseFloat(product.basePrice))}
                      {hasVariants && (
                        <span className='ml-2 text-primary'>
                          ({product.variants.length} biến thể)
                        </span>
                      )}
                    </p>
                  </div>
                  {productAlreadyAdded && (
                    <Badge variant='outline' className='text-xs'>
                      Đã thêm
                    </Badge>
                  )}
                </div>
              </CollapsibleTrigger>

              {hasVariants && (
                <CollapsibleContent>
                  <div className='border-t'>
                    {product.variants.map((variant) => {
                      const variantAdded = isProductAlreadyAdded(
                        product.id,
                        variant.id,
                      );
                      return (
                        <div
                          key={variant.id}
                          className={`flex items-center gap-3 p-2 pl-12 hover:bg-muted/30 ${
                            variantAdded ? 'opacity-50' : ''
                          }`}
                        >
                          {!variantAdded && (
                            <Checkbox
                              checked={isProductSelected(
                                product.id,
                                variant.id,
                              )}
                              onCheckedChange={() =>
                                onToggleSelection(product, variant)
                              }
                            />
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
                                <span className='text-muted-foreground ml-1'>
                                  - {variant.size}
                                </span>
                              )}
                            </p>
                            <p className='text-xs text-muted-foreground'>
                              {formatCurrency(parseFloat(variant.price))}
                            </p>
                          </div>
                          {variantAdded && (
                            <Badge variant='outline' className='text-xs mr-2'>
                              Đã thêm
                            </Badge>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CollapsibleContent>
              )}
            </div>
          </Collapsible>
        );
      })}
    </div>
  );
}
