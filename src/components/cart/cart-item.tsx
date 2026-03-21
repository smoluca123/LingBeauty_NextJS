'use client';

import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/lib/utils/utils';
import { useState } from 'react';
import type { ICartItemType } from '@/lib/types/interfaces/cart.interfaces';

interface CartItemProps {
  item: ICartItemType;
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
  onRemove: (itemId: string) => void;
  isUpdating?: boolean;
  isRemoving?: boolean;
}

export function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
  isUpdating = false,
  isRemoving = false,
}: CartItemProps) {
  // Price: use variant price if available, otherwise product basePrice
  const price = item.variant
    ? Number(item.variant.price)
    : Number(item.product.basePrice);
  const lineTotal = Number(item.lineTotal);
  const imageUrl = item.product.thumbnailImage?.media?.url;

  // Local state for input value to handle typing without triggering API on every keystroke
  const [inputValue, setInputValue] = useState(item.quantity.toString());

  // Track the previous quantity to sync input when quantity changes from external source
  const [prevQuantity, setPrevQuantity] = useState(item.quantity);
  if (prevQuantity !== item.quantity) {
    setPrevQuantity(item.quantity);
    setInputValue(item.quantity.toString());
  }

  const handleIncrement = () => {
    onUpdateQuantity(item.id, item.quantity + 1);
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.id, item.quantity - 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      setInputValue('');
      return;
    }
    if (/^\d+$/.test(value)) {
      setInputValue(value);
    }
  };

  const handleInputBlur = () => {
    const numValue = parseInt(inputValue, 10);
    if (isNaN(numValue) || numValue < 1) {
      setInputValue(item.quantity.toString());
    } else if (numValue !== item.quantity) {
      onUpdateQuantity(item.id, numValue);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  };

  // ── Stock logic: always use item.stockInfo (never item.variant) ──────────────
  const { stockQuantity, minStockQuantity, stockStatus } = item.stockInfo;

  // canAddMore: adding one more must not push projected stock below the backorder floor
  const canAddMore = stockQuantity - (item.quantity + 1) >= minStockQuantity;

  // How many more units can still be ordered (may be > stockQuantity when in backorder)
  const remainingOrderable = stockQuantity - minStockQuantity - item.quantity;

  const isDisabled = isUpdating || isRemoving;

  return (
    <div className="flex gap-4 p-4 rounded-xl border bg-card hover:shadow-md transition-shadow">
      {/* Product Image */}
      <div className="relative h-24 w-24 shrink-0 rounded-lg overflow-hidden bg-muted">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={item.product.thumbnailImage?.alt ?? item.product.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground text-xs text-center px-1">
            No Image
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm line-clamp-2">
              {item.product.name}
            </h4>

            {/* Variant display fields — only shown when variant exists */}
            {item.variant && (
              <p className="text-xs text-muted-foreground mt-1">
                {item.variant.color && (
                  <>
                    Màu:{' '}
                    <span className="font-medium">{item.variant.color}</span>
                  </>
                )}
                {item.variant.color && item.variant.size && ' • '}
                {item.variant.size && (
                  <>
                    Size:{' '}
                    <span className="font-medium">{item.variant.size}</span>
                  </>
                )}
                {item.variant.type &&
                  !item.variant.color &&
                  !item.variant.size && (
                    <span className="font-medium">{item.variant.type}</span>
                  )}
              </p>
            )}

            {/* Stock warnings — sourced from stockInfo */}
            {stockStatus === 'OUT_OF_STOCK' && remainingOrderable <= 0 && (
              <p className="text-xs text-destructive mt-1 font-medium">
                Hết hàng
              </p>
            )}
            {stockStatus === 'OUT_OF_STOCK' && remainingOrderable > 0 && (
              <p className="text-xs text-amber-500 mt-1">
                Đang đặt trước · còn {remainingOrderable} suất
              </p>
            )}
            {stockStatus !== 'OUT_OF_STOCK' &&
              stockQuantity > 0 &&
              stockQuantity <= 10 && (
                <p className="text-xs text-amber-500 mt-1">
                  Còn {stockQuantity} sản phẩm
                </p>
              )}
          </div>

          {/* Remove Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(item.id)}
            disabled={isDisabled}
            className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
            aria-label="Xóa sản phẩm"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Price and Quantity Controls */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2 bg-muted rounded-lg">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDecrement}
              disabled={item.quantity <= 1 || isDisabled}
              className="h-8 w-8 rounded-lg hover:bg-primary-pink/10"
              aria-label="Giảm số lượng"
            >
              <Minus className="h-3 w-3" />
            </Button>

            <Input
              type="text"
              inputMode="numeric"
              value={isUpdating ? '...' : inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              onKeyDown={handleInputKeyDown}
              disabled={isDisabled}
              className="h-8 w-12 text-sm font-semibold text-center border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />

            <Button
              variant="ghost"
              size="icon"
              onClick={handleIncrement}
              disabled={isDisabled || !canAddMore}
              className="h-8 w-8 rounded-lg hover:bg-primary-pink/10"
              aria-label="Tăng số lượng"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          <div className="text-right">
            <p className="text-sm font-bold text-primary-pink">
              {formatCurrency(lineTotal)}
            </p>
            {item.quantity > 1 && (
              <p className="text-xs text-muted-foreground">
                {formatCurrency(price)} x {item.quantity}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
