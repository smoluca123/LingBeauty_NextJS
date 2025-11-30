'use client';

import { formatCurrency } from '@/lib/utils';

interface CartSummaryProps {
  subtotal: number;
  shipping: number;
  discount?: number;
}

export function CartSummary({
  subtotal,
  shipping,
  discount = 0,
}: CartSummaryProps) {
  const total = subtotal + shipping - discount;

  return (
    <div className="space-y-3 p-4 rounded-xl border bg-muted/30">
      <h3 className="font-semibold text-sm">Tổng đơn hàng</h3>

      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Tạm tính</span>
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

        {discount > 0 && (
          <div className="flex items-center justify-between text-green-600">
            <span>Giảm giá</span>
            <span className="font-medium">-{formatCurrency(discount)}</span>
          </div>
        )}
      </div>

      <div className="pt-3 border-t">
        <div className="flex items-center justify-between">
          <span className="font-semibold">Tổng cộng</span>
          <span className="text-lg font-bold text-primary-pink">
            {formatCurrency(total)}
          </span>
        </div>
      </div>

      {shipping === 0 && (
        <p className="text-xs text-muted-foreground text-center pt-2">
          🎉 Bạn được miễn phí vận chuyển!
        </p>
      )}
    </div>
  );
}
