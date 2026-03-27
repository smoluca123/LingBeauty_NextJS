'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Loader2, Package, MapPin, CreditCard, User } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useAdminOrderDetailQuery } from '@/hooks/querys/admin-order.query'
import { useUpdateOrderMutation } from '@/hooks/mutations/admin-order.mutation'
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
  type OrderStatus,
} from '@/lib/types/interfaces/apis/order.interfaces'
import { formatCurrency } from '@/lib/utils/format-utils'

interface OrderDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  orderId: string | null
}

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function OrderDetailDialog({
  open,
  onOpenChange,
  orderId,
}: OrderDetailDialogProps) {
  const { data, isLoading } = useAdminOrderDetailQuery(orderId)
  const order = data?.data

  const [status, setStatus] = useState<OrderStatus | ''>('')
  const [notes, setNotes] = useState('')

  const updateMutation = useUpdateOrderMutation(orderId ?? '')

  // Reset form khi mở dialog
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen && order) {
      setStatus(order.status)
      setNotes(order.notes ?? '')
    }
    onOpenChange(newOpen)
  }

  const handleUpdate = () => {
    if (!orderId) return

    const payload: { status?: OrderStatus; notes?: string } = {}
    if (status && status !== order?.status) payload.status = status
    if (notes !== order?.notes) payload.notes = notes

    if (Object.keys(payload).length === 0) {
      onOpenChange(false)
      return
    }

    updateMutation.mutate(payload, {
      onSuccess: () => {
        onOpenChange(false)
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="min-w-4xl ">
        <DialogHeader>
          <DialogTitle>Chi tiết đơn hàng</DialogTitle>
        </DialogHeader>

        <div className="max-h-[80vh] overflow-y-auto">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : !order ? (
            <div className="text-center py-8 text-muted-foreground">
              Không tìm thấy đơn hàng
            </div>
          ) : (
            <div className="space-y-6">
              {/* Order Info */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">{order.orderNumber}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                <Badge
                  className={`${ORDER_STATUS_COLORS[order.status]} border-0 text-sm`}
                >
                  {ORDER_STATUS_LABELS[order.status]}
                </Badge>
              </div>

              <Separator />

              {/* Customer Info */}
              {order.shippingAddress && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <User className="h-4 w-4" />
                    Thông tin khách hàng
                  </div>
                  <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">Họ tên:</span>{' '}
                      {order.shippingAddress.fullName}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">SĐT:</span>{' '}
                      {order.shippingAddress.phone}
                    </p>
                  </div>
                </div>
              )}

              {/* Shipping Address */}
              {order.shippingAddress && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <MapPin className="h-4 w-4" />
                    Địa chỉ giao hàng
                  </div>
                  <div className="bg-muted/30 rounded-lg p-4">
                    <p className="text-sm">
                      {order.shippingAddress.addressLine1}
                      {order.shippingAddress.addressLine2 &&
                        `, ${order.shippingAddress.addressLine2}`}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {order.shippingAddress.city},{' '}
                      {order.shippingAddress.province}
                    </p>
                  </div>
                </div>
              )}

              {/* Order Items */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Package className="h-4 w-4" />
                  Sản phẩm ({order.items.length})
                </div>
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-3 p-3 bg-muted/30 rounded-lg"
                    >
                      <div className="relative w-16 h-16 rounded-md overflow-hidden bg-muted shrink-0">
                        {item.product.images?.[0]?.media?.url ? (
                          <Image
                            src={item.product.images[0].media.url}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          SKU: {item.sku}
                        </p>
                        {item.variant && (
                          <p className="text-xs text-muted-foreground">
                            {[
                              item.variant.color,
                              item.variant.size,
                              item.variant.type,
                            ]
                              .filter(Boolean)
                              .join(' - ')}
                          </p>
                        )}
                        <p className="text-sm mt-1">
                          {formatCurrency(Number(item.price))} x {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {formatCurrency(Number(item.total))}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <CreditCard className="h-4 w-4" />
                  Thanh toán
                </div>
                <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Tạm tính:</span>
                    <span>{formatCurrency(Number(order.subtotal))}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Phí vận chuyển:</span>
                    <span>{formatCurrency(Number(order.shipping))}</span>
                  </div>
                  {Number(order.discount) > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Giảm giá:</span>
                      <span>-{formatCurrency(Number(order.discount))}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Tổng cộng:</span>
                    <span className="text-primary-pink">
                      {formatCurrency(Number(order.total))}
                    </span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Update Form */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Trạng thái đơn hàng</Label>
                  <Select
                    value={status}
                    onValueChange={(v) => setStatus(v as OrderStatus)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Chờ xác nhận</SelectItem>
                      <SelectItem value="CONFIRMED">Đã xác nhận</SelectItem>
                      <SelectItem value="PROCESSING">Đang chuẩn bị</SelectItem>
                      <SelectItem value="SHIPPED">Đang giao</SelectItem>
                      <SelectItem value="DELIVERED">Đã giao</SelectItem>
                      <SelectItem value="CANCELLED">Đã hủy</SelectItem>
                      <SelectItem value="REFUNDED">Đã hoàn tiền</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Ghi chú</Label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Thêm ghi chú cho đơn hàng..."
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={updateMutation.isPending}
            >
              Hủy
            </Button>
            <Button
              variant="primary-pink"
              onClick={handleUpdate}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Cập nhật
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
