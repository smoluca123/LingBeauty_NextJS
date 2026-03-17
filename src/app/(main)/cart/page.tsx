"use client";

import { useGetCartQuery } from "@/hooks/querys/cart.query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CartItem } from "@/components/cart/cart-item";
import { Input } from "@/components/ui/input";
import {
  useRemoveCartItemMutation,
  useUpdateCartItemMutation,
} from "@/hooks/mutations/cart.mutation";
import { useApplyCouponMutation } from "@/hooks/mutations/coupon.mutation";
import { useState } from "react";

export default function CartPage() {
  const { data: cartResponse, isLoading, error } = useGetCartQuery();
  const updateCartItemMutation = useUpdateCartItemMutation();
  const removeCartItemMutation = useRemoveCartItemMutation();
  const applyCouponMutation = useApplyCouponMutation();
  const cartData = cartResponse?.data;

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountAmount: number;
    finalTotal: number;
  } | null>(null);

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    updateCartItemMutation.mutate({
      itemId,
      payload: { quantity: newQuantity },
    });
  };

  const handleRemoveItem = (itemId: string) => {
    removeCartItemMutation.mutate(itemId);
  };

  const handleApplyCoupon = () => {
    if (!couponCode.trim() || !cartData) return;

    applyCouponMutation.mutate(
      {
        code: couponCode,
        subtotal: Number(cartData.summary.subtotal),
      },
      {
        onSuccess: (data) => {
          setAppliedCoupon({
            code: data.coupon.code,
            discountAmount: data.calculatedDiscount,
            finalTotal: data.finalTotal,
          });
        },
      },
    );
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
          <Card className="p-6 sticky top-24 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Tóm tắt đơn hàng</h2>

            <div className="space-y-3 text-sm mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Tạm tính</span>
                <span>{formatCurrency(Number(cartData.summary.subtotal))}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Giảm giá</span>
                <span
                  className={appliedCoupon ? "text-green-600 font-medium" : ""}
                >
                  {appliedCoupon
                    ? `-${formatCurrency(appliedCoupon.discountAmount)}`
                    : "0 ₫"}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Phí vận chuyển</span>
                <span>Chưa tính</span>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="mb-4 space-y-2">
              <label
                htmlFor="promo"
                className="text-sm font-medium text-gray-700"
              >
                Mã giảm giá
              </label>
              <div className="flex gap-2">
                <Input
                  id="promo"
                  placeholder="Nhập mã giảm giá..."
                  className="flex-1"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  disabled={applyCouponMutation.isPending}
                />
                <Button
                  variant="outline"
                  className="shrink-0 border-primary-pink text-primary-pink hover:bg-primary-pink/10"
                  onClick={handleApplyCoupon}
                  disabled={!couponCode.trim() || applyCouponMutation.isPending}
                >
                  {applyCouponMutation.isPending
                    ? "Đang áp dụng..."
                    : "Áp dụng"}
                </Button>
              </div>
              {appliedCoupon && (
                <p className="text-sm text-green-600 mt-2">
                  Đã áp dụng mã <strong>{appliedCoupon.code}</strong> thành
                  công!
                </p>
              )}
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-bold">Tổng cộng</span>
              <div className="text-right">
                <span className="text-2xl font-bold text-primary-pink block">
                  {formatCurrency(
                    appliedCoupon
                      ? appliedCoupon.finalTotal
                      : Number(cartData.summary.subtotal),
                  )}
                </span>
              </div>
            </div>

            <Link href="/checkout" className="w-full">
              <Button
                size="lg"
                className="w-full text-base font-semibold"
                variant="primary-pink"
              >
                Tiến hành thanh toán
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
