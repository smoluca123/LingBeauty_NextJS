'use client';

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { CartItem } from '@/components/cart/cart-item';
import { CartSummary } from '@/components/cart/cart-summary';
import { EmptyCart } from '@/components/cart/empty-cart';
import { Loader2, Trash2 } from 'lucide-react';
import { useGetCartQuery } from '@/hooks/querys/cart.query';
import {
  useClearCartMutation,
  useRemoveCartItemMutation,
  useUpdateCartItemMutation,
} from '@/hooks/mutations/cart.mutation';
import { useIsAuthenticated } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();
  const { data, isLoading } = useGetCartQuery();

  const updateCartItemMutation = useUpdateCartItemMutation();
  const removeCartItemMutation = useRemoveCartItemMutation();
  const clearCartMutation = useClearCartMutation();

  const cart = data?.data;
  const items = cart?.items ?? [];
  const hasItems = items.length > 0;

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    updateCartItemMutation.mutate({
      itemId,
      payload: { quantity: newQuantity },
    });
  };

  const handleRemoveItem = (itemId: string) => {
    removeCartItemMutation.mutate(itemId);
  };

  const handleClearCart = () => {
    clearCartMutation.mutate();
  };

  const handleCheckout = () => {
    onOpenChange(false);
    router.push('/checkout');
  };

  const handleViewCart = () => {
    onOpenChange(false);
    router.push('/cart');
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="h-full w-full sm:w-[420px] lg:max-w-md flex flex-col">
        <DrawerHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <DrawerTitle>Giỏ hàng</DrawerTitle>
              <DrawerDescription>
                {hasItems
                  ? `${cart!.summary.itemCount} sản phẩm • ${cart!.summary.totalQuantity} món`
                  : 'Giỏ hàng của bạn'}
              </DrawerDescription>
            </div>

            {/* Clear cart button */}
            {hasItems && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearCart}
                disabled={clearCartMutation.isPending}
                className="text-muted-foreground hover:text-destructive text-xs gap-1"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Xóa tất cả
              </Button>
            )}
          </div>
        </DrawerHeader>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto">
          {!isAuthenticated ? (
            // Not logged in
            <div className="flex flex-col items-center justify-center h-full py-12 px-6 text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Vui lòng đăng nhập để xem giỏ hàng của bạn.
              </p>
              <Button
                onClick={() => onOpenChange(false)}
                className="bg-primary-pink hover:bg-primary-pink/90 text-white rounded-xl"
              >
                Đóng
              </Button>
            </div>
          ) : isLoading ? (
            // Loading state
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary-pink" />
            </div>
          ) : !hasItems ? (
            // Empty cart
            <EmptyCart onClose={() => onOpenChange(false)} />
          ) : (
            // Cart items list
            <div className="p-4 space-y-3">
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={handleRemoveItem}
                  isUpdating={
                    updateCartItemMutation.isPending &&
                    updateCartItemMutation.variables?.itemId === item.id
                  }
                  isRemoving={
                    removeCartItemMutation.isPending &&
                    removeCartItemMutation.variables === item.id
                  }
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer: Summary + Actions */}
        {hasItems && !isLoading && cart && (
          <DrawerFooter className="border-t pt-4 gap-3">
            <CartSummary summary={cart.summary} />

            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={handleViewCart}
                variant="outline"
                className="w-full h-11 rounded-xl text-primary-pink border-primary-pink hover:bg-primary-pink/10"
              >
                Xem giỏ hàng
              </Button>
              <Button
                onClick={handleCheckout}
                className="w-full h-11 rounded-xl bg-primary-pink hover:bg-primary-pink/90 text-white font-semibold"
              >
                Thanh toán
              </Button>
            </div>

            <DrawerClose asChild>
              <Button variant="outline" className="w-full rounded-xl">
                Tiếp tục mua sắm
              </Button>
            </DrawerClose>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
}
