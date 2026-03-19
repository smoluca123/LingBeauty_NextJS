"use client";

import { useGetCartQuery } from "@/hooks/querys/cart.query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { CartItem } from "@/components/cart/cart-item";
import { CartPageSummary } from "@/components/cart/cart-page-summary";
import {
  useRemoveCartItemMutation,
  useUpdateCartItemMutation,
} from "@/hooks/mutations/cart.mutation";

export default function CartPage() {
  const { data: cartResponse, isLoading, error } = useGetCartQuery();
  const updateCartItemMutation = useUpdateCartItemMutation();
  const removeCartItemMutation = useRemoveCartItemMutation();
  const cartData = cartResponse?.data;


  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    updateCartItemMutation.mutate({
      itemId,
      payload: { quantity: newQuantity },
    });
  };

  const handleRemoveItem = (itemId: string) => {
    removeCartItemMutation.mutate(itemId);
  };



  // Render Loading State
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <h1 className="text-2xl font-bold mb-6">Giỏ hàng của bạn</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full rounded-xl" />
            ))}
          </div>
          <div className="lg:col-span-1">
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  // Render Error or Empty State
  if (error || !cartData || cartData.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-7xl flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="bg-primary-pink/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto">
            <ShoppingBag className="w-12 h-12 text-primary-pink" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Giỏ hàng của bạn đang trống
          </h2>
          <p className="text-gray-500 max-w-md mx-auto">
            Có vẻ như bạn chưa thêm sản phẩm nào vào giỏ hàng. Hãy khám phá và
            mua sắm thêm những sản phẩm làm đẹp tuyệt vời nhé!
          </p>
          <Link href="/products">
            <Button size="lg" className="mt-4">
              Tiếp tục mua sắm
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">
        Giỏ hàng của bạn ({cartData.summary.totalQuantity} sản phẩm)
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cartData.items.map((item) => (
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

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <CartPageSummary subtotal={Number(cartData.summary.subtotal)} />
        </div>
      </div>
    </div>
  );
}
