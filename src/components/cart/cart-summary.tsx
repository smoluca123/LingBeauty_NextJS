'use client';

import { formatCurrency } from '@/lib/utils/utils';
import type { ICartSummaryType } from '@/lib/types/interfaces/cart.interfaces';

/** Free shipping threshold in VND */
const FREE_SHIPPING_THRESHOLD = 500_000;
/** Flat shipping fee in VND */
const SHIPPING_FEE = 30_000;

interface CartSummaryProps {
  summary: ICartSummaryType;
}

export function CartSummary({ summary }: CartSummaryProps) {
  const subtotal = Number(summary.subtotal);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;

  return (
    <div className="space-y-3 p-4 rounded-xl border bg-muted/30">
      <h3 className="font-semibold text-sm">Tổng đơn hàng</h3>

      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">
            Tạm tính ({summary.totalQuantity} sản phẩm)
          </span>
          <span className="font-medium">{formatCurrency(subtotal)}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Phí vận chuyển</span>
          <span className="font-medium">
            {shipping === 0 ? (
              <span className="text-green-600">Miễn phí</span>
            ) : (
              formatCurrency(shipping)
            )}
          </span>
        </div>
      </div>

      <div className="pt-3 border-t">
        <div className="flex items-center justify-between">
          <span className="font-semibold">Tổng cộng</span>
          <span className="text-lg font-bold text-primary-pink">
            {formatCurrency(total)}
          </span>
        </div>
      </div>

      {shipping === 0 ? (
        <p className="text-xs text-green-600 text-center pt-1">
          🎉 Bạn được miễn phí vận chuyển!
        </p>
      ) : (
        <p className="text-xs text-muted-foreground text-center pt-1">
          Mua thêm{' '}
          <span className="font-medium text-primary-pink">
            {formatCurrency(FREE_SHIPPING_THRESHOLD - subtotal)}
          </span>{' '}
          để được miễn phí vận chuyển
        </p>
      )}
    </div>
  );
}
