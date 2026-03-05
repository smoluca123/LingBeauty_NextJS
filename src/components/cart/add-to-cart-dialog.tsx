'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Minus, Plus, ShoppingBag } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn, formatCurrency } from '@/lib/utils';
import type {
  IProductDataType,
  IProductVariantDataType,
} from '@/lib/types/interfaces/apis/product.interfaces';
import { useAddToCartMutation } from '@/hooks/mutations/cart.mutation';

interface AddToCartDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: IProductDataType;
}

export function AddToCartDialog({
  open,
  onOpenChange,
  product,
}: AddToCartDialogProps) {
  const variants = product.variants ?? [];

  // Default to first in-stock variant
  const defaultVariant =
    variants.find((v) => v.inventory?.displayStatus !== 'OUT_OF_STOCK') ??
    variants[0];

  const [selectedVariant, setSelectedVariant] =
    useState<IProductVariantDataType | null>(defaultVariant ?? null);
  const [quantity, setQuantity] = useState(1);

  const addToCartMutation = useAddToCartMutation();

  const maxStock = selectedVariant?.inventory?.quantity ?? 0;
  const isOutOfStock =
    selectedVariant?.inventory?.displayStatus === 'OUT_OF_STOCK';

  const handleVariantSelect = (variant: IProductVariantDataType) => {
    setSelectedVariant(variant);
    // Reset quantity when variant changes so we don't exceed new stock
    setQuantity(1);
  };

  const handleDecrement = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncrement = () => {
    setQuantity((prev) => Math.min(maxStock, prev + 1));
  };

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    addToCartMutation.mutate(
      {
        productId: product.id,
        variantId: selectedVariant.id,
        quantity,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          // Reset state for next open
          setQuantity(1);
        },
      },
    );
  };

  // Resolve image for the selected variant or fall back to product primary
  const displayImageUrl =
    selectedVariant?.images?.[0]?.media?.url ??
    product.primaryImage?.media?.url;

  const displayPrice = selectedVariant
    ? Number(selectedVariant.price)
    : Number(product.basePrice);

  const comparePrice = product.comparePrice
    ? Number(product.comparePrice)
    : null;

  // Group variants by attribute type for labelling
  const hasColors = variants.some((v) => v.color);
  const hasSizes = variants.some((v) => v.size);
  const hasTypes = variants.some((v) => v.type && !v.color && !v.size);

  const variantLabel = hasColors
    ? 'Màu sắc'
    : hasSizes
      ? 'Kích cỡ'
      : hasTypes
        ? 'Loại'
        : 'Phiên bản';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-2xl">
        <div className="flex flex-col">
          {/* Product preview */}
          <div className="flex gap-4 p-5 border-b bg-muted/30">
            <div className="relative h-20 w-20 shrink-0 rounded-xl overflow-hidden bg-muted">
              {displayImageUrl ? (
                <Image
                  src={displayImageUrl}
                  alt={product.name}
                  fill
                  className="object-cover transition-all duration-300"
                  sizes="80px"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground text-xs">
                  No image
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">
                {product.brand?.name}
              </p>
              <DialogHeader>
                <DialogTitle className="text-sm font-semibold line-clamp-2 text-left mt-0.5">
                  {product.name}
                </DialogTitle>
              </DialogHeader>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-base font-bold text-primary-pink">
                  {formatCurrency(displayPrice)}
                </span>
                {comparePrice && comparePrice > displayPrice && (
                  <span className="text-xs text-muted-foreground line-through">
                    {formatCurrency(comparePrice)}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="p-5 space-y-5">
            {/* Variant selection */}
            {variants.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-semibold">{variantLabel}</p>
                <div className="flex flex-wrap gap-2">
                  {variants.map((variant) => {
                    const isSelected = selectedVariant?.id === variant.id;
                    const isVariantOutOfStock =
                      variant.inventory?.displayStatus === 'OUT_OF_STOCK';

                    return (
                      <button
                        key={variant.id}
                        type="button"
                        onClick={() =>
                          !isVariantOutOfStock && handleVariantSelect(variant)
                        }
                        disabled={isVariantOutOfStock}
                        title={variant.name}
                        className={cn(
                          'relative flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-all',
                          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-pink',
                          isSelected
                            ? 'border-primary-pink bg-primary-pink/5 text-primary-pink ring-1 ring-primary-pink'
                            : 'border-border hover:border-primary-pink/50 hover:bg-muted/50',
                          isVariantOutOfStock &&
                            'cursor-not-allowed opacity-40 line-through',
                        )}
                      >
                        {/* Color swatch */}
                        {variant.color && (
                          <span
                            className="h-4 w-4 rounded-full border border-muted-foreground/20 shrink-0"
                            style={{ backgroundColor: variant.color }}
                          />
                        )}
                        {/* Variant image thumb */}
                        {!variant.color && variant.images?.[0] && (
                          <span className="relative h-5 w-5 shrink-0 overflow-hidden rounded-full">
                            <Image
                              src={variant.images[0].media.url}
                              alt={variant.name}
                              fill
                              sizes="20px"
                              className="object-cover"
                            />
                          </span>
                        )}
                        <span>{variant.name}</span>
                        {isVariantOutOfStock && (
                          <span className="text-[10px]">• Hết hàng</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">Số lượng</p>
                {selectedVariant &&
                  selectedVariant.inventory?.displayStatus === 'LOW_STOCK' && (
                    <p className="text-xs text-amber-500">
                      Còn {maxStock} sản phẩm
                    </p>
                  )}
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 rounded-lg border bg-muted/30">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleDecrement}
                    disabled={quantity <= 1}
                    className="h-9 w-9 rounded-lg"
                    aria-label="Giảm số lượng"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </Button>
                  <span className="w-10 text-center text-sm font-semibold select-none">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleIncrement}
                    disabled={quantity >= maxStock || isOutOfStock}
                    className="h-9 w-9 rounded-lg"
                    aria-label="Tăng số lượng"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </Button>
                </div>
                {maxStock > 0 && (
                  <span className="text-xs text-muted-foreground">
                    / {maxStock} sản phẩm
                  </span>
                )}
              </div>
            </div>

            {/* Action button */}
            <Button
              onClick={handleAddToCart}
              disabled={
                !selectedVariant || isOutOfStock || addToCartMutation.isPending
              }
              className="w-full h-11 rounded-xl bg-primary-pink hover:bg-primary-pink/90 text-white font-semibold gap-2"
            >
              {addToCartMutation.isPending ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Đang thêm...
                </>
              ) : isOutOfStock ? (
                'Hết hàng'
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4" />
                  Thêm vào giỏ hàng
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
