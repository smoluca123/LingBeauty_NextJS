'use client';

import { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { IProductDataType } from '@/lib/types/interfaces/apis/product.interfaces';
import { useAddToCartMutation } from '@/hooks/mutations/cart.mutation';
import { AddToCartDialog } from '@/components/cart/add-to-cart-dialog';
import { useIsAuthenticated } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import { getIsOutOfStock } from '@/lib/utils/product-stock.utils';

interface AddToCartButtonProps {
  product: IProductDataType;
  className?: string;
}

/**
 * Smart "Add to Cart" button for product cards.
 *
 * - No variants (or exactly 1): adds directly with quantity=1.
 * - Multiple variants: opens a dialog to pick variant + quantity.
 * - Not authenticated: clicking triggers the auth flow (TODO: open login modal).
 */
export function AddToCartButton({ product, className }: AddToCartButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const isAuthenticated = useIsAuthenticated();
  const addToCartMutation = useAddToCartMutation();

  const variants = product.variants ?? [];
  const hasMultipleVariants = variants.length > 1;
  const singleVariant = variants.length === 1 ? variants[0] : null;

  // Out-of-stock resolution: trust displayStatus managed by server.
  // Use shared utility to stay in sync with product-card and other consumers.
  const isOutOfStock = getIsOutOfStock(product);

  const handleClick = (e: React.MouseEvent) => {
    // Prevent card click / link navigation
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      // TODO: trigger login modal when auth flow is refactored to context
      return;
    }

    if (isOutOfStock) return;

    if (hasMultipleVariants) {
      // Open variant selection dialog
      setDialogOpen(true);
      return;
    }

    if (singleVariant) {
      // Single-variant product
      addToCartMutation.mutate({
        productId: product.id,
        variantId: singleVariant.id,
        quantity: 1,
      });
      return;
    }

    // No-variant product — omit variantId so BE auto-resolves the first variant
    addToCartMutation.mutate({
      productId: product.id,
      quantity: 1,
    });
  };

  return (
    <>
      <Button
        onClick={handleClick}
        disabled={
          isOutOfStock || (addToCartMutation.isPending && !hasMultipleVariants)
        }
        className={cn(
          'mt-3 w-full h-9 rounded-full gap-2 text-sm font-semibold',
          'bg-primary-pink hover:bg-primary-pink/90 text-white',
          isOutOfStock &&
            'bg-muted text-muted-foreground cursor-not-allowed hover:bg-muted',
          className,
        )}
        aria-label={isOutOfStock ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
      >
        {addToCartMutation.isPending && !hasMultipleVariants ? (
          <>
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Đang thêm...
          </>
        ) : isOutOfStock ? (
          'Hết hàng'
        ) : (
          <>
            <ShoppingBag className="h-3.5 w-3.5" />
            {hasMultipleVariants ? 'Chọn & thêm vào giỏ' : 'Thêm vào giỏ hàng'}
          </>
        )}
      </Button>

      {/* Variant selection dialog (only rendered for multi-variant products) */}
      {hasMultipleVariants && (
        <AddToCartDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          product={product}
        />
      )}
    </>
  );
}
