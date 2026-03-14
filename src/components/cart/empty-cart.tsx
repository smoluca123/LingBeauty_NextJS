'use client';

import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyCartProps {
  onClose: () => void;
}

export function EmptyCart({ onClose }: EmptyCartProps) {
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

      <Button
        onClick={onClose}
        className="bg-primary-pink hover:bg-primary-pink/90 text-white rounded-xl w-full max-w-xs"
      >
        Tiếp tục mua sắm
      </Button>
    </div>
  );
}
