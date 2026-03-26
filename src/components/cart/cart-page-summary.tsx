'use client'

import { useApplyCouponMutation } from '@/hooks/mutations/coupon.mutation'
import { useCartStore } from '@/stores/cart.store'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils/format-utils'

interface CartPageSummaryProps {
  subtotal: number
}

export function CartPageSummary({ subtotal }: CartPageSummaryProps) {
  const applyCouponMutation = useApplyCouponMutation()
  const { couponCode, appliedCoupon, setCouponCode, setAppliedCoupon } =
    useCartStore()

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return

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
          })
        },
      },
    )
  }

  return (
    <Card className="p-6 sticky top-24 shadow-sm">
      <h2 className="text-xl font-bold mb-4">Tóm tắt đơn hàng</h2>

      <div className="space-y-3 text-sm mb-4">
        <div className="flex justify-between text-gray-600">
          <span>Tạm tính</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Giảm giá</span>
          <span className={appliedCoupon ? 'text-green-600 font-medium' : ''}>
            {appliedCoupon
              ? `-${formatCurrency(appliedCoupon.discountAmount)}`
              : '0 ₫'}
          </span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Phí vận chuyển</span>
          <span>Chưa tính</span>
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
  )
}
