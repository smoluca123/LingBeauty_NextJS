'use client';

import { useState } from 'react';
import {
  ShoppingCart,
  Heart,
  Share2,
  Truck,
  ShieldCheck,
  Minus,
  Plus,
  CheckCircle2,
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { RatingStars } from '@/components/product/rating-stars';
import { ProductBadge } from '@/components/product/product-badge';
import {
  IProductDataType,
  IProductVariantDataType,
} from '@/lib/types/interfaces/apis/product.interfaces';
import { useAddToCartMutation } from '@/hooks/mutations/cart.mutation';
import { useIsAuthenticated } from '@/hooks/use-auth';

interface ProductDetailInfoProps {
  product: IProductDataType;
}

export function ProductDetailInfo({ product }: ProductDetailInfoProps) {
  const variants = product.variants ?? [];
  const hasVariants = variants.length > 0;

  // Default to first in-stock variant
  const defaultVariant =
    variants.find((v) => v.inventory?.displayStatus !== 'OUT_OF_STOCK') ??
    variants[0] ??
    null;

  const [selectedVariant, setSelectedVariant] =
    useState<IProductVariantDataType | null>(defaultVariant);
  const [quantity, setQuantity] = useState(1);

  const addToCartMutation = useAddToCartMutation();
  const isAuthenticated = useIsAuthenticated();

  // Price logic — use selected variant price if available
  const basePrice = selectedVariant
    ? Number(selectedVariant.price)
    : Number(product.basePrice);
  const comparePrice = product.comparePrice
    ? Number(product.comparePrice)
    : null;
  const discountPercent =
    comparePrice && comparePrice > Number(product.basePrice)
      ? Math.round(
          ((comparePrice - Number(product.basePrice)) / comparePrice) * 100,
        )
      : null;

  // ─── Inventory resolution ─────────────────────────────────────────────────
  // For products WITH variants: use selectedVariant.inventory
  // For products WITHOUT variants: use product.inventory (product-level stock)
  const activeInventory = hasVariants
    ? selectedVariant?.inventory
    : product.inventory;

  const maxStock = activeInventory?.quantity ?? 0;

  // isOutOfStock: OUT_OF_STOCK status OR quantity is zero
  const isOutOfStock = hasVariants
    ? // Variant products: selected variant out-of-stock OR all variants out-of-stock
      selectedVariant?.inventory?.displayStatus === 'OUT_OF_STOCK' ||
      selectedVariant?.inventory?.quantity === 0 ||
      variants.every(
        (v) =>
          v.inventory?.displayStatus === 'OUT_OF_STOCK' ||
          v.inventory?.quantity === 0,
      )
    : // No-variant product: use product-level inventory
      (product.inventory?.displayStatus === 'OUT_OF_STOCK' ||
        product.inventory?.quantity === 0) ??
        false;

  // isLowStock: quantity > 0 AND quantity <= lowStockThreshold
  // (LOW_STOCK is NOT a DB enum value — derived from runtime values)
  const isLowStock =
    !isOutOfStock &&
    maxStock > 0 &&
    activeInventory?.lowStockThreshold !== undefined &&
    maxStock <= activeInventory.lowStockThreshold;

  const avgRating = product.stats?.avgRating
    ? Number(product.stats.avgRating)
    : undefined;
  const reviewCount = product.stats?.reviewCount ?? 0;
  const totalSold = product.stats?.totalSold ?? 0;

  const brandName = product.brand?.name;
  const categoryNames = product.productCategories
    ?.map((pc) => pc.category?.name)
    .filter(Boolean)
    .join(', ');

  // Determine variant label
  const hasColors = variants.some((v) => v.color);
  const hasSizes = variants.some((v) => v.size);
  const variantLabel = hasColors
    ? 'Màu sắc'
    : hasSizes
      ? 'Kích cỡ'
      : 'Phân loại';

  const handleVariantSelect = (variant: IProductVariantDataType) => {
    setSelectedVariant(variant);
    setQuantity(1);
  };

  const handleDecrement = () => setQuantity((prev) => Math.max(1, prev - 1));
  const handleIncrement = () =>
    setQuantity((prev) => Math.min(maxStock, prev + 1));

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    if (hasVariants) {
      // Variant product: require a selected variant
      if (!selectedVariant) return;
      addToCartMutation.mutate({
        productId: product.id,
        variantId: selectedVariant.id,
        quantity,
      });
    } else {
      // No-variant product: add product directly without variantId
      // TODO: update cart mutation to support no-variant adds when BE is ready
      addToCartMutation.mutate({
        productId: product.id,
        variantId: '',
        quantity,
      });
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Brand + Category */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {brandName && (
          <span className="rounded-full bg-muted px-2.5 py-1 text-foreground">
            {brandName}
          </span>
        )}
        {categoryNames && <span>{categoryNames}</span>}
      </div>

      {/* Product name */}
      <h1 className="text-2xl font-bold leading-snug text-foreground md:text-3xl">
        {product.name}
      </h1>

      {/* Rating + sold count */}
      <div className="flex flex-wrap items-center gap-3">
        <RatingStars rating={avgRating} reviewCount={reviewCount} />
        {totalSold > 0 && (
          <span className="text-xs text-muted-foreground">
            | Đã bán <span className="font-semibold">{totalSold}</span>
          </span>
        )}
      </div>

      {/* Badges */}
      {product.badges && product.badges.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {discountPercent && (
            <ProductBadge label={`GIẢM ${discountPercent}%`} variant="INFO" />
          )}
          {product.badges.map((badge) => (
            <ProductBadge
              key={badge.id}
              label={badge.name}
              variant={badge.variant}
            />
          ))}
        </div>
      )}

      {/* Price */}
      <div className="flex items-baseline gap-3">
        <p className="text-3xl font-bold text-primary-pink">
          {formatCurrency(basePrice)}
        </p>
        {comparePrice && comparePrice > Number(product.basePrice) && (
          <p className="text-lg text-muted-foreground line-through">
            {formatCurrency(comparePrice)}
          </p>
        )}
        {discountPercent && (
          <span className="rounded-full bg-primary-pink/10 px-2 py-0.5 text-xs font-bold text-primary-pink">
            -{discountPercent}%
          </span>
        )}
      </div>

      {/* Short description */}
      {product.shortDesc && (
        <p className="text-sm leading-relaxed text-muted-foreground">
          {product.shortDesc}
        </p>
      )}

      {/* Stock status for no-variant products */}
      {!hasVariants && (
        <div className="flex items-center gap-2">
          {isOutOfStock ? (
            <span className="inline-flex items-center rounded-full bg-destructive/10 px-3 py-1 text-xs font-semibold text-destructive">
              Hết hàng
            </span>
          ) : isLowStock ? (
            <span className="inline-flex items-center rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-600">
              Sắp hết — còn {maxStock} sản phẩm
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600">
              Còn hàng
            </span>
          )}
        </div>
      )}

      {/* Variant selector */}
      {variants.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">
              {variantLabel}:
              {selectedVariant && (
                <span className="ml-1.5 font-normal text-primary-pink">
                  {selectedVariant.name}
                </span>
              )}
            </p>
            {/* Stock status badge */}
            {isOutOfStock ? (
              <span className="text-xs font-medium text-destructive">
                Hết hàng
              </span>
            ) : isLowStock ? (
              <span className="text-xs font-medium text-amber-500">
                Còn {maxStock} sản phẩm
              </span>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-2">
            {variants.map((variant) => {
              const isSelected = selectedVariant?.id === variant.id;
              const isVariantOutOfStock =
                variant.inventory?.displayStatus === 'OUT_OF_STOCK' ||
                variant.inventory?.quantity === 0;

              return (
                <button
                  key={variant.id}
                  type="button"
                  disabled={isVariantOutOfStock}
                  onClick={() =>
                    !isVariantOutOfStock && handleVariantSelect(variant)
                  }
                  className={cn(
                    'relative flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-all',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-pink',
                    isSelected
                      ? 'border-primary-pink bg-primary-pink/5 text-primary-pink ring-1 ring-primary-pink'
                      : 'border-border bg-card text-foreground hover:border-primary-pink/50 hover:bg-muted/50',
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
                  <span>{variant.name}</span>
                  {isSelected && (
                    <CheckCircle2 className="ml-0.5 h-3.5 w-3.5 text-primary-pink" />
                  )}
                  {isVariantOutOfStock && (
                    <span className="ml-1 text-[10px]">• Hết</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quantity selector */}
      {!isOutOfStock && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-foreground">Số lượng:</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center rounded-xl border bg-muted/30">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDecrement}
                disabled={quantity <= 1}
                className="h-10 w-10 rounded-xl"
                aria-label="Giảm số lượng"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center text-base font-semibold select-none">
                {quantity}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleIncrement}
                disabled={quantity >= maxStock || isOutOfStock}
                className="h-10 w-10 rounded-xl"
                aria-label="Tăng số lượng"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {maxStock > 0 && (
              <span className="text-xs text-muted-foreground">
                / {maxStock} sản phẩm có sẵn
              </span>
            )}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-col gap-3 pt-2 sm:flex-row">
        <Button
          onClick={handleAddToCart}
          disabled={
            isOutOfStock ||
            !selectedVariant ||
            !isAuthenticated ||
            addToCartMutation.isPending
          }
          className={cn(
            'flex-1 rounded-full py-6 text-base font-semibold text-white transition-all',
            isOutOfStock
              ? 'bg-muted text-muted-foreground'
              : 'bg-primary-pink hover:bg-primary-pink/90 hover:shadow-md',
          )}
          size="lg"
        >
          {addToCartMutation.isPending ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Đang thêm...
            </>
          ) : isOutOfStock ? (
            'Hết hàng'
          ) : !isAuthenticated ? (
            <>
              <ShoppingCart className="mr-2 h-5 w-5" />
              Đăng nhập để thêm giỏ
            </>
          ) : (
            <>
              <ShoppingCart className="mr-2 h-5 w-5" />
              Thêm vào giỏ hàng
            </>
          )}
        </Button>
        <Button
          variant="outline"
          className="rounded-full border-primary-pink py-6 text-primary-pink hover:bg-primary-pink/10"
          size="lg"
        >
          <Heart className="h-5 w-5" />
        </Button>
        <Button
          variant="outline"
          className="rounded-full py-6 hover:bg-muted"
          size="lg"
        >
          <Share2 className="h-5 w-5" />
        </Button>
      </div>

      {/* Benefits strip */}
      <div className="flex flex-col gap-2 rounded-xl border bg-muted/30 p-4 text-sm text-muted-foreground sm:flex-row sm:justify-around">
        <div className="flex items-center gap-2">
          <Truck className="h-4 w-4 text-primary-pink" />
          <span>Miễn phí vận chuyển</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-primary-pink" />
          <span>Hàng chính hãng 100%</span>
        </div>
      </div>
    </div>
  );
}
