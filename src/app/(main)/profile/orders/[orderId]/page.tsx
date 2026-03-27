'use client'

import { use } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, MapPin, CreditCard, Package, Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetOrderByIdQuery } from '@/hooks/querys/order.query'
import { useCancelOrderMutation } from '@/hooks/mutations/order.mutation'
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
  CANCELLABLE_STATUSES,
} from '@/lib/types/interfaces/apis/order.interfaces'
import { formatCurrency } from '@/lib/utils/format-utils'

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>
}) {
  const { orderId } = use(params)
  const { data, isLoading } = useGetOrderByIdQuery(orderId)
  const cancelMutation = useCancelOrderMutation(orderId)
  const order = data?.data

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">Không tìm thấy đơn hàng.</p>
        <Link href="/profile/orders">
          <Button variant="outline">Quay lại danh sách đơn hàng</Button>
        </Link>
      </div>
    )
  }

  const canCancel = CANCELLABLE_STATUSES.includes(order.status)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/profile/orders"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary-pink transition-colors"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Đơn hàng của tôi
        </Link>
        {canCancel && (
          <Button
            variant="outline"
            size="sm"
            className="border-destructive text-destructive hover:bg-destructive/10"
            onClick={() => cancelMutation.mutate({})}
            disabled={cancelMutation.isPending}
          >
            {cancelMutation.isPending && (
              <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
            )}
            Hủy đơn hàng
          </Button>
        )}
      </div>

      {/* Order Info */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">{order.orderNumber}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Đặt lúc {formatDate(order.createdAt)}
              </p>
            </div>
            <Badge
              className={`${ORDER_STATUS_COLORS[order.status]} border-0 font-medium text-sm px-3 py-1`}
            >
              {ORDER_STATUS_LABELS[order.status]}
            </Badge>
          </div>

          {/* Shipping Address */}
          {order.shippingAddress && (
            <>
              <Separator className="my-4" />
              <div className="flex gap-3">
                <MapPin className="h-4 w-4 text-primary-pink mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold mb-0.5">
                    Địa chỉ giao hàng
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {order.shippingAddress.fullName} ·{' '}
                    {order.shippingAddress.phone}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {order.shippingAddress.addressLine1}
                    {order.shippingAddress.addressLine2
                      ? `, ${order.shippingAddress.addressLine2}`
                      : ''}
                    {`, ${order.shippingAddress.city}, ${order.shippingAddress.province}`}
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Payment */}
          {order.payments[0] && (
            <>
              <Separator className="my-4" />
              <div className="flex gap-3">
                <CreditCard className="h-4 w-4 text-primary-pink mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold mb-0.5">Thanh toán</p>
                  <p className="text-sm text-muted-foreground">
                    {order.payments[0].method === 'COD'
                      ? 'Thanh toán khi nhận hàng'
                      : 'Chuyển khoản ngân hàng'}
                    {' · '}
                    <span
                      className={
                        order.payments[0].status === 'PAID'
                          ? 'text-green-600'
                          : 'text-amber-600'
                      }
                    >
                      {order.payments[0].status === 'PAID'
                        ? 'Đã thanh toán'
                        : 'Chờ thanh toán'}
                    </span>
                  </p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Order Items */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">
            Sản phẩm ({order.items.length})
          </h3>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted shrink-0 border">
                  {item.product?.primaryImage?.media?.url ? (
                    <Image
                      src={item.product.primaryImage.media.url}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                      Ảnh
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm line-clamp-2">
                    {item.name}
                  </p>
                  {item.variant && item.variant.name !== 'Mặc định' && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {[
                        item.variant.color,
                        item.variant.size,
                        item.variant.type,
                      ]
                        .filter(Boolean)
                        .join(' / ') || item.variant.name}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm text-muted-foreground">
                      {formatCurrency(Number(item.price))} × {item.quantity}
                    </span>
                    <span className="text-sm font-semibold text-primary-pink">
                      {formatCurrency(Number(item.total))}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          {/* Totals */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Tạm tính</span>
              <span>{formatCurrency(Number(order.subtotal))}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Phí vận chuyển</span>
              <span>
                {Number(order.shipping) > 0
                  ? formatCurrency(Number(order.shipping))
                  : 'Miễn phí'}
              </span>
            </div>
            {Number(order.discount) > 0 && (
              <div className="flex justify-between text-green-600">
                <span>
                  Giảm giá{order.couponCode ? ` (${order.couponCode})` : ''}
                </span>
                <span>-{formatCurrency(Number(order.discount))}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between font-bold text-base pt-1">
              <span>Tổng cộng</span>
              <span className="text-primary-pink">
                {formatCurrency(Number(order.total))}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {order.notes && (
        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
            <p className="text-sm font-semibold mb-1">Ghi chú</p>
            <p className="text-sm text-muted-foreground">{order.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
