'use client'

import { useState } from 'react'
import { useGetCartQuery } from '@/hooks/querys/cart.query'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { CheckoutFormOptions } from '@/components/checkout/checkout-form-options'
import { CheckoutSummary } from '@/components/checkout/checkout-summary'
import { useCreateOrderMutation } from '@/hooks/mutations/order.mutation'
import { useCartStore } from '@/stores/cart.store'
import type { PaymentMethod } from '@/lib/types/interfaces/apis/order.interfaces'

export default function CheckoutPage() {
  const { data: cartResponse, isLoading } = useGetCartQuery()
  const cartData = cartResponse?.data
  const { appliedCoupon } = useCartStore()

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  )
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD')

  const createOrderMutation = useCreateOrderMutation()

  const canPlaceOrder =
    !!selectedAddressId && !!cartData && cartData.items.length > 0

  const handlePlaceOrder = () => {
    if (!canPlaceOrder || !cartData) return

    createOrderMutation.mutate({
      shippingAddressId: selectedAddressId!,
      paymentMethod,
      couponCode: appliedCoupon?.code,
      items: cartData.items.map((item) => ({
        productId: item.productId,
        variantId: item.variantId!,
        quantity: item.quantity,
      })),
    })
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Skeleton className="h-8 w-48 mb-6 rounded-md" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <Skeleton className="h-64 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
      </div>
    )
  }

  if (!cartData || cartData.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center max-w-xl">
        <h2 className="text-2xl font-bold mb-4">Giỏ hàng của bạn đang trống</h2>
        <p className="text-muted-foreground mb-8">
          Không có sản phẩm nào để thanh toán. Vui lòng thêm sản phẩm vào giỏ
          hàng trước.
        </p>
        <Link href="/products">
          <Button>Quay về cửa hàng</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Link
          href="/cart"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary-pink mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Quay lại Giỏ hàng
        </Link>

        <h1 className="text-3xl font-bold mb-8">Thanh toán</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            <CheckoutFormOptions
              selectedAddressId={selectedAddressId}
              onAddressChange={setSelectedAddressId}
              paymentMethod={paymentMethod}
              onPaymentMethodChange={setPaymentMethod}
            />
          </div>

          <div className="lg:col-span-5 xl:col-span-4">
            <CheckoutSummary
              cartData={cartData}
              onPlaceOrder={handlePlaceOrder}
              isPlacingOrder={createOrderMutation.isPending}
              canPlaceOrder={canPlaceOrder}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
