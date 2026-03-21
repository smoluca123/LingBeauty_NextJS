'use client';

import { useApplyCouponMutation } from '@/hooks/mutations/coupon.mutation';
import { useCartStore } from '@/stores/cart.store';
import { formatCurrency } from '@/lib/utils/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import Link from 'next/link';
import { ICartDataType } from '@/lib/types/interfaces/cart.interfaces';

interface CheckoutSummaryProps {
  cartData: ICartDataType;
}

export function CheckoutSummary({ cartData }: CheckoutSummaryProps) {
  const applyCouponMutation = useApplyCouponMutation();
  const { couponCode, appliedCoupon, setCouponCode, setAppliedCoupon } =
    useCartStore();
  const subtotal = Number(cartData.summary.subtotal);

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;

    applyCouponMutation.mutate(
      {
        code: couponCode,
        subtotal: subtotal,
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

  return (
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
                  alt={item.product.thumbnailImage.alt || item.product.name}
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
            {formatCurrency(subtotal)}
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
                ? 'text-green-600 font-medium'
                : 'font-medium text-gray-900'
            }
          >
            {appliedCoupon
              ? `-${formatCurrency(appliedCoupon.discountAmount)}`
              : '0 ₫'}
          </span>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="mb-4 space-y-2">
        <label htmlFor="promo" className="text-sm font-medium text-gray-700">
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
            {applyCouponMutation.isPending ? 'Đang áp dụng...' : 'Áp dụng'}
          </Button>
        </div>
        {appliedCoupon && (
          <p className="text-sm text-green-600 mt-2">
            Đã áp dụng mã <strong>{appliedCoupon.code}</strong> thành công!
          </p>
        )}
      </div>

      <Separator className="my-4" />

      <div className="flex justify-between items-center mb-6">
        <span className="text-lg font-bold">Tổng cộng</span>
        <div className="text-right">
          <span className="text-2xl font-bold text-primary-pink block">
            {formatCurrency(
              appliedCoupon ? appliedCoupon.finalTotal : subtotal,
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
        </Link>{' '}
        và{' '}
        <Link
          href="#"
          className="underline text-gray-700 hover:text-primary-pink"
        >
          Chính sách bảo mật
        </Link>{' '}
        của chúng tôi.
      </p>
    </Card>
  );
}
