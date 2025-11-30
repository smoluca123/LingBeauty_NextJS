'use client';

import { ShoppingBag, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyCartProps {
  onClose: () => void;
  onResetCart?: () => void; // Optional callback to reset cart with demo data
}

export function EmptyCart({ onClose, onResetCart }: EmptyCartProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full py-12 px-6 text-center">
      <div className="mb-6 rounded-full bg-muted/50 p-6">
        <ShoppingBag className="h-12 w-12 text-muted-foreground" />
      </div>

      <h3 className="text-lg font-semibold mb-2">Giỏ hàng trống</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-xs">
        Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá và thêm sản phẩm
        yêu thích!
      </p>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Button
          onClick={onClose}
          className="bg-primary-pink hover:bg-primary-pink/90 text-white rounded-xl"
        >
          Tiếp tục mua sắm
        </Button>

        {onResetCart && (
          <Button
            onClick={onResetCart}
            variant="outline"
            className="rounded-xl"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Tải lại dữ liệu demo
          </Button>
        )}
      </div>
    </div>
  );
}
