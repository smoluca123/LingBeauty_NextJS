"use client";

import { useGetCartQuery } from "@/hooks/querys/cart.query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MapPin, Truck, CreditCard, ChevronLeft } from "lucide-react";
import { useState } from "react";
import { useApplyCouponMutation } from "@/hooks/mutations/coupon.mutation";

export default function CheckoutPage() {
  const { data: cartResponse, isLoading } = useGetCartQuery();
  const cartData = cartResponse?.data;
  const applyCouponMutation = useApplyCouponMutation();

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountAmount: number;
    finalTotal: number;
  } | null>(null);

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
        <Skeleton className="h-8 w-48 mb-6 rounded-md" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <Skeleton className="h-64 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-96 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  // Redirect or show error if cart is empty
  if (!cartData || cartData.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center max-w-xl">
        <h2 className="text-2xl font-bold mb-4">Giỏ hàng của bạn đang trống</h2>
        <p className="text-gray-500 mb-8">
          Không có sản phẩm nào để thanh toán. Vui lòng thêm sản phẩm vào giỏ
          hàng trước.
        </p>
        <Link href="/products">
          <Button>Quay về cửa hàng</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Link
          href="/cart"
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary-pink mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Quay lại Giỏ hàng
        </Link>

        <h1 className="text-3xl font-bold mb-8 text-gray-900">Thanh toán</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Form & Options */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            {/* 1. Thông tin giao hàng */}
            <Card className="p-6 border-none shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-primary-pink/10 p-2 rounded-full">
                  <MapPin className="w-5 h-5 text-primary-pink" />
                </div>
                <h2 className="text-xl font-semibold">
                  1. Thông tin giao hàng
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullname">Họ và tên</Label>
                  <Input id="fullname" placeholder="Nhập họ và tên đầy đủ" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input id="phone" placeholder="Nhập số điện thoại của bạn" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Địa chỉ</Label>
                  <Input
                    id="address"
                    placeholder="Số nhà, Tên đường, Phường/Xã..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="province">Tỉnh / Thành phố</Label>
                  <Input id="province" placeholder="Chọn tỉnh/thành phố" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="district">Quận / Huyện</Label>
                  <Input id="district" placeholder="Chọn quận/huyện" />
                </div>
              </div>
            </Card>

            {/* 2. Phương thức vận chuyển */}
            <Card className="p-6 border-none shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-primary-pink/10 p-2 rounded-full">
                  <Truck className="w-5 h-5 text-primary-pink" />
                </div>
                <h2 className="text-xl font-semibold">
                  2. Phương thức vận chuyển
                </h2>
              </div>

              <RadioGroup defaultValue="standard" className="space-y-3">
                <div className="flex items-center justify-between border border-gray-200 p-4 rounded-lg has-checked:border-primary-pink has-checked:bg-primary-pink/5 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="standard" id="standard" />
                    <Label
                      htmlFor="standard"
                      className="font-medium cursor-pointer"
                    >
                      Giao hàng tiêu chuẩn
                      <span className="block text-sm font-normal text-gray-500 mt-1">
                        Dự kiến giao: 2-4 ngày làm việc
                      </span>
                    </Label>
                  </div>
                  <span className="font-semibold text-gray-900">Miễn phí</span>
                </div>

                <div className="flex items-center justify-between border border-gray-200 p-4 rounded-lg has-checked:border-primary-pink has-checked:bg-primary-pink/5 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="express" id="express" />
                    <Label
                      htmlFor="express"
                      className="font-medium cursor-pointer"
                    >
                      Giao hàng hỏa tốc
                      <span className="block text-sm font-normal text-gray-500 mt-1">
                        Giao trong 2 giờ (Chỉ áp dụng nội thành HCM)
                      </span>
                    </Label>
                  </div>
                  <span className="font-semibold text-gray-900">40.000 ₫</span>
                </div>
              </RadioGroup>
            </Card>

            {/* 3. Phương thức thanh toán */}
            <Card className="p-6 border-none shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-primary-pink/10 p-2 rounded-full">
                  <CreditCard className="w-5 h-5 text-primary-pink" />
                </div>
                <h2 className="text-xl font-semibold">
                  3. Phương thức thanh toán
                </h2>
              </div>

              <RadioGroup defaultValue="cod" className="space-y-3">
                <div className="flex items-center justify-between border border-gray-200 p-4 rounded-lg has-checked:border-primary-pink has-checked:bg-primary-pink/5 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="font-medium cursor-pointer">
                      Thanh toán khi nhận hàng (COD)
                      <span className="block text-sm font-normal text-gray-500 mt-1">
                        Thanh toán bằng tiền mặt khi hàng được giao đến.
                      </span>
                    </Label>
                  </div>
                </div>

                <div className="flex items-center justify-between border border-gray-200 p-4 rounded-lg has-checked:border-primary-pink has-checked:bg-primary-pink/5 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="banking" id="banking" />
                    <Label
                      htmlFor="banking"
                      className="font-medium cursor-pointer"
                    >
                      Chuyển khoản ngân hàng
                      <span className="block text-sm font-normal text-gray-500 mt-1">
                        Chuyển khoản nhanh 24/7 qua QR Code.
                      </span>
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </Card>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5 xl:col-span-4">
            <Card className="p-6 border-none shadow-sm sticky top-24">
              <h2 className="text-lg font-bold mb-4">
                Đơn hàng của bạn ({cartData.summary.itemCount})
              </h2>

              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {cartData.items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative w-16 h-16 bg-gray-100 rounded-md overflow-hidden shrink-0 border border-gray-100">
                      {item.product.thumbnailImage?.media?.url ? (
                        <Image
                          src={item.product.thumbnailImage.media.url}
                          alt={
                            item.product.thumbnailImage.alt || item.product.name
                          }
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">
                          Ảnh
                        </div>
                      )}
                      <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full z-10">
                        {item.quantity}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <p className="text-sm font-medium text-gray-900 line-clamp-2">
                        {item.product.name}
                      </p>
                      {item.variant && (
                        <p className="text-xs text-gray-500 mt-1">
                          {item.variant.size} - {item.variant.color}
                        </p>
                      )}
                      <p className="text-sm font-semibold text-primary-pink mt-1">
                        {formatCurrency(Number(item.lineTotal))}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-6" />

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(Number(cartData.summary.subtotal))}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Phí vận chuyển</span>
                  <span className="font-medium text-gray-900">Miễn phí</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Giảm giá</span>
                  <span
                    className={
                      appliedCoupon
                        ? "text-green-600 font-medium"
                        : "font-medium text-gray-900"
                    }
                  >
                    {appliedCoupon
                      ? `-${formatCurrency(appliedCoupon.discountAmount)}`
                      : "0 ₫"}
                  </span>
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
                    disabled={
                      !couponCode.trim() || applyCouponMutation.isPending
                    }
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
                  <span className="text-xs text-gray-500 font-normal">
                    Đã bao gồm VAT (nếu có)
                  </span>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full text-base font-semibold"
                variant="primary-pink"
              >
                Đặt hàng
              </Button>
              <p className="text-xs text-center text-gray-500 mt-4 leading-relaxed">
                Bằng việc tiến hành Đặt hàng, bạn đồng ý với
                <br />
                <Link
                  href="#"
                  className="underline text-gray-700 hover:text-primary-pink"
                >
                  Điều khoản dịch vụ
                </Link>{" "}
                và{" "}
                <Link
                  href="#"
                  className="underline text-gray-700 hover:text-primary-pink"
                >
                  Chính sách bảo mật
                </Link>{" "}
                của chúng tôi.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
