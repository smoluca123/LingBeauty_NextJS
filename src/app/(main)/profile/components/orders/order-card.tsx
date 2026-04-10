'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Package, ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
  type IOrderListItemDataType,
} from '@/lib/types/interfaces/apis/order.interfaces'
import { formatCurrency } from '@/lib/utils/format-utils'

function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

interface OrderCardProps {
  order: IOrderListItemDataType
}

export function OrderCard({ order }: OrderCardProps) {
  const firstItem = order.items?.[0]
  const remainingCount = order.itemCount - 1

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium text-sm">{order.orderNumber}</span>
          </div>
          <Badge
            className={`${ORDER_STATUS_COLORS[order.status]} border-0 font-medium`}
          >
            {ORDER_STATUS_LABELS[order.status]}
          </Badge>
        </div>

        {/* Product Preview */}
        {firstItem && (
          <div className="flex gap-3 py-3 border-t border-b">
            <div className="relative w-16 h-16 rounded-md overflow-hidden bg-muted shrink-0">
              {firstItem.product.images?.[0]?.media?.url ? (
                <Image
                  src={firstItem.product.images[0].media.url}
                  alt={firstItem.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm line-clamp-1">
                {firstItem.name}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {firstItem.quantity} x {formatCurrency(Number(firstItem.price))}
              </p>
              {remainingCount > 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  +{remainingCount} sản phẩm khác
                </p>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-3">
          <div>
            <p className="text-xs text-muted-foreground">
              {formatDate(order.createdAt)}
            </p>
            <p className="font-semibold text-lg text-foreground mt-1">
              {formatCurrency(Number(order.total))}
            </p>
          </div>
          <Link href={`/profile/orders/${order.id}`}>
            <Button
              variant="ghost"
              size="sm"
              className="text-primary-pink hover:text-primary-pink/80"
            >
              Chi tiết
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
