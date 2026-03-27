'use client'

import { Search, X, Eye } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import type { IAdminOrderListItemDataType } from '@/lib/types/interfaces/apis/admin-order.interfaces'
import type { OrderStatus } from '@/lib/types/interfaces/apis/order.interfaces'
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
} from '@/lib/types/interfaces/apis/order.interfaces'
import { formatCurrency } from '@/lib/utils/format-utils'

// ── Order Filters ──────────────────────────────────────────────────────────

interface OrderFiltersProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  statusFilter: OrderStatus | 'all'
  onStatusChange: (value: string) => void
  sortValue: string
  onSortChange: (value: string) => void
  onClearAll: () => void
  hasActiveFilters: boolean
}

export function OrderFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  sortValue,
  onSortChange,
  onClearAll,
  hasActiveFilters,
}: OrderFiltersProps) {
  return (
    <Card className="p-4">
      <div className="flex flex-col gap-4">
        {/* Row 1: Search & Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm theo mã đơn hàng..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={onStatusChange}>
            <SelectTrigger>
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
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

        {/* Row 2: Sort & Clear */}
        <div className="flex items-center gap-3">
          <Select value={sortValue} onValueChange={onSortChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Sắp xếp" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt:desc">Mới nhất</SelectItem>
              <SelectItem value="createdAt:asc">Cũ nhất</SelectItem>
              <SelectItem value="total:desc">Giá cao nhất</SelectItem>
              <SelectItem value="total:asc">Giá thấp nhất</SelectItem>
              <SelectItem value="orderNumber:asc">Mã đơn A-Z</SelectItem>
              <SelectItem value="orderNumber:desc">Mã đơn Z-A</SelectItem>
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAll}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="mr-2 h-4 w-4" />
              Xóa bộ lọc
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}

// ── Order Table ────────────────────────────────────────────────────────────

interface OrderTableProps {
  orders: IAdminOrderListItemDataType[]
  onViewDetail: (order: IAdminOrderListItemDataType) => void
}

function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function OrderTable({ orders, onViewDetail }: OrderTableProps) {
  if (orders.length === 0) {
    return (
      <Card className="p-12">
        <div className="text-center text-muted-foreground">
          <p className="text-lg font-medium mb-2">Không tìm thấy đơn hàng</p>
          <p className="text-sm">Thử thay đổi bộ lọc để xem kết quả khác</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Mã đơn hàng</TableHead>
              <TableHead className="w-[150px]">Trạng thái</TableHead>
              <TableHead className="w-[120px]">Số sản phẩm</TableHead>
              <TableHead className="w-[140px]">Tổng tiền</TableHead>
              <TableHead className="w-[180px]">Ngày tạo</TableHead>
              <TableHead className="w-[100px] text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">
                  {order.orderNumber}
                </TableCell>
                <TableCell>
                  <Badge
                    className={`${ORDER_STATUS_COLORS[order.status]} border-0`}
                  >
                    {ORDER_STATUS_LABELS[order.status]}
                  </Badge>
                </TableCell>
                <TableCell>{order.itemCount}</TableCell>
                <TableCell className="font-semibold">
                  {formatCurrency(Number(order.total))}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(order.createdAt)}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDetail(order)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}
