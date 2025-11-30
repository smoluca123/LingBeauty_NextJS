'use client';

import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  IProductDataType,
  IProductVariantDataType,
} from '@/lib/types/interfaces/apis/product.interfaces';
import { formatCurrency } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface CartItemProps {
  product: IProductDataType;
  variant?: IProductVariantDataType;
  quantity: number;
  onUpdateQuantity: (newQuantity: number) => void;
  onRemove: () => void;
}

export function CartItem({
  product,
  variant,
  quantity,
  onUpdateQuantity,
  onRemove,
}: CartItemProps) {
  const price = variant ? Number(variant.price) : Number(product.basePrice);
  const itemTotal = price * quantity;
  const imageUrl =
    variant?.images?.[0]?.media?.url || product.primaryImage?.media?.url;

  // Local state for input value to handle typing
  const [inputValue, setInputValue] = useState(quantity.toString());

  // Sync input value when quantity prop changes from external source
  useEffect(() => {
    setInputValue(quantity.toString());
  }, [quantity]);

  const handleIncrement = () => {
    onUpdateQuantity(quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      onUpdateQuantity(quantity - 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty string while typing
    if (value === '') {
      setInputValue('');
      return;
    }
    // Only allow numbers
    if (/^\d+$/.test(value)) {
      setInputValue(value);
    }
  };

  const handleInputBlur = () => {
    const numValue = parseInt(inputValue);
    // Validate and update quantity
    if (isNaN(numValue) || numValue < 1) {
      // Reset to current quantity if invalid
      setInputValue(quantity.toString());
    } else {
      // Update to new quantity
      onUpdateQuantity(numValue);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Submit on Enter key
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  };

  return (
    <div className="flex gap-4 p-4 rounded-xl border bg-card hover:shadow-md transition-shadow">
      {/* Product Image */}
      <div className="relative h-24 w-24 shrink-0 rounded-lg overflow-hidden bg-muted">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            No Image
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              {product.brand?.name}
            </p>
            <h4 className="font-semibold text-sm line-clamp-2">
              {product.name}
            </h4>
            {variant && (
              <p className="text-xs text-muted-foreground mt-1">
                Màu: <span className="font-medium">{variant.color}</span>
                {variant.size && (
                  <>
                    {' • '}
                    Size: <span className="font-medium">{variant.size}</span>
                  </>
                )}
              </p>
            )}
          </div>

          {/* Remove Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onRemove}
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Price and Quantity */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2 bg-muted rounded-lg">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDecrement}
              disabled={quantity <= 1}
              className="h-8 w-8 rounded-lg hover:bg-primary-pink/10"
            >
              <Minus className="h-3 w-3" />
            </Button>

            <Input
              type="text"
              inputMode="numeric"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              onKeyDown={handleInputKeyDown}
              className="h-8 w-12 text-sm font-semibold text-center border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />

            <Button
              variant="ghost"
              size="icon"
              onClick={handleIncrement}
              className="h-8 w-8 rounded-lg hover:bg-primary-pink/10"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          <div className="text-right">
            <p className="text-sm font-bold text-primary-pink">
              {formatCurrency(itemTotal)}
            </p>
            {quantity > 1 && (
              <p className="text-xs text-muted-foreground">
                {formatCurrency(price)} x {quantity}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
