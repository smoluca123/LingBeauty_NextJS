'use client'

import { useApplyCouponMutation } from '@/hooks/mutations/coupon.mutation'
import { useCartStore } from '@/stores/cart.store'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import Link from 'next/link'
import { ICartDataType } from '@/lib/types/interfaces/cart.interfaces'
import { formatCurrency } from '@/lib/utils/format-utils'
import { Loader2 } from 'lucide-react'

interface CheckoutSummaryProps {
  cartData: ICartDataType
  onPlaceOrder: () => void
  isPlacingOrder: boolean
  canPlaceOrder: boolean
}

export function CheckoutSummary({
  cartData,
  onPlaceOrder,
  isPlacingOrder,
  canPlaceOrder,
}: CheckoutSummaryProps) {
  const applyCouponMutation = useApplyCouponMutation()
  const { couponCode, appliedCoupon, setCouponCode, setAppliedCoupon } =
    useCartStore()
  const subtotal = Number(cartData.summary.subtotal)
  const discount = appliedCoupon?.discountAmount ?? 0
  const total = appliedCoupon ? appliedCoupon.finalTotal : subtotal

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return
    applyCouponMutation.mutate(
      { code: couponCode, subtotal },
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
    <Card className="p-6 border-none shadow-sm sticky top-24">
      <h2 className="text-lg font-bold mb-4">
        Đơn hàng ({cartData.summary.itemCount} sản phẩm)
      </h2>

      <div className="space-y-4 max-h-[320px] overflow-y-auto pr-1">
        {cartData.items.map((item) => (
          <div key={item.id} className="flex gap-3">
            <div className="relative w-14 h-14 bg-gray-100 rounded-md overflow-hidden shrink-0 border">
              {item.product.thumbnailImage?.media?.url ? (
                <Image
                  src={item.product.thumbnailImage.media.url}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">
                  Ảnh
                </div>
              )}
              <span className="absolute -top-1.5 -right-1.5 bg-gray-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium line-clamp-2">{item.product.name}</p>
              {item.variant && item.variant.name !== 'Mặc định' && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {[item.variant.color, item.variant.size, item.variant.type]
                    .filter(Boolean)
                    .join(' / ') || item.variant.name}
                </p>
              )}
              <p className="text-sm font-semibold text-primary-pink mt-1">
                {formatCurrency(Number(item.lineTotal))}
              </p>
            </div>
          </div>
        ))}
      </div>

      <Separator className="my-4" />

      {/* Coupon */}
      <div className="space-y-2 mb-4">
        <label className="text-sm font-medium">Mã giảm giá</label>
        <div className="flex gap-2">
          <Input
            placeholder="Nhập mã giảm giá..."
            className="flex-1"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            disabled={applyCouponMutation.isPending || !!appliedCoupon}
          />
          <Button
            variant="outline"
            className="shrink-0 border-primary-pink text-primary-pink hover:bg-primary-pink/10"
            onClick={handleApplyCoupon}
            disabled={!couponCode.trim() || applyCouponMutation.isPending || !!appliedCoupon}
          >
            {applyCouponMutation.isPending ? 'Đang áp dụng...' : 'Áp dụng'}
          </Button>
        </div>
        {appliedCoupon && (
          <p className="text-sm text-green-600">
            Đã áp dụng mã <strong>{appliedCoupon.code}</strong> — giảm{' '}
            {formatCurrency(appliedCoupon.discountAmount)}
          </p>
        )}
      </div>

      <Separator className="my-4" />

      {/* Totals */}
      <div className="space-y-2 text-sm mb-4">
        <div className="flex justify-between text-muted-foreground">
          <span>Tạm tính</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Phí vận chuyển</span>
          <span>Miễn phí</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Giảm giá</span>
            <span>-{formatCurrency(discount)}</span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mb-6">
        <span className="text-lg font-bold">Tổng cộng</span>
        <div className="text-right">
          <span className="text-2xl font-bold text-primary-pink block">
            {formatCurrency(total)}
          </span>
          <span className="text-xs text-muted-foreground">Đã bao gồm VAT</span>
        </div>
      </div>

      <Button
        size="lg"
        className="w-full text-base font-semibold"
        variant="primary-pink"
        onClick={onPlaceOrder}
        disabled={!canPlaceOrder || isPlacingOrder}
      >
        {isPlacingOrder ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Đang đặt hàng...
          </>
        ) : (
          'Đặt hàng'
        )}
      </Button>

      <p className="text-xs text-center text-muted-foreground mt-4 leading-relaxed">
        Bằng việc đặt hàng, bạn đồng ý với{' '}
        <Link href="#" className="underline hover:text-primary-pink">
          Điều khoản dịch vụ
        </Link>{' '}
        và{' '}
        <Link href="#" className="underline hover:text-primary-pink">
          Chính sách bảo mật
        </Link>
        .
      </p>
    </Card>
  )
}
