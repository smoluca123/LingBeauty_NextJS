'use client'

import Link from 'next/link'
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

        <div className="flex items-center justify-between pt-3 border-t">
          <div>
            <p className="text-xs text-muted-foreground">
              {formatDate(order.createdAt)}
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">
              {order.itemCount} sản phẩm
            </p>
            <p className="font-semibold text-lg text-foreground mt-0.5">
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
