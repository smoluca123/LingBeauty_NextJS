'use client';

import Image from 'next/image';
import { Package, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
  type Order,
} from '../../orders/_data/mock-orders';

// ============ Helper ============
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// ============ Order Card Component ============
interface OrderCardProps {
  order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
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

        {/* Products Preview */}
        <div className="space-y-3 mb-4">
          {order.products.slice(0, 2).map((product) => (
            <div key={product.id} className="flex gap-3">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm line-clamp-1">
                  {product.name}
                </p>
                {product.variant && (
                  <p className="text-xs text-muted-foreground">
                    {product.variant}
                  </p>
                )}
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm text-primary-pink font-medium">
                    {formatCurrency(product.price)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    x{product.quantity}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {order.products.length > 2 && (
            <p className="text-xs text-muted-foreground">
              +{order.products.length - 2} sản phẩm khác
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t">
          <div>
            <p className="text-xs text-muted-foreground">
              {formatDate(order.createdAt)}
            </p>
            <p className="font-semibold text-lg text-foreground">
              {formatCurrency(order.totalAmount)}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-primary-pink hover:text-primary-pink/80"
          >
            Chi tiết
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
