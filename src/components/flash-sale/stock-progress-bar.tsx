'use client';

import { cn } from '@/lib/utils/utils';
import {
  calculateStockPercent,
  getRemainingStock,
  isLowStock,
} from '@/lib/utils/flash-sale-utils';

interface StockProgressBarProps {
  soldQuantity: number;
  maxQuantity: number;
  className?: string;
}

export function StockProgressBar({
  soldQuantity,
  maxQuantity,
  className,
}: StockProgressBarProps) {
  const stockPercent = calculateStockPercent(soldQuantity, maxQuantity);
  const remaining = getRemainingStock(soldQuantity, maxQuantity);
  const lowStock = isLowStock(soldQuantity, maxQuantity);

  return (
    <div className={cn('w-full', className)}>
      <div className="relative h-5 w-full overflow-hidden rounded-full bg-pink-100">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-300',
            lowStock
              ? 'bg-linear-to-r from-orange-400 to-red-500'
              : 'bg-linear-to-r from-pink-400 to-primary-pink',
          )}
          style={{ width: `${stockPercent}%` }}
        />
        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-pink-800">
          còn {remaining} sản phẩm
        </span>
      </div>
    </div>
  );
}
