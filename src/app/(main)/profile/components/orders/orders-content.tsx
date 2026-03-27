'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  TabsUnderline,
  TabsUnderlineList,
  TabsUnderlineTrigger,
  TabsUnderlineContent,
} from '@/components/ui/tabs-underline'
import { EmptyState } from '@/app/(main)/profile/components/empty-state'
import { OrderCard } from './order-card'
import { useGetMyOrdersQuery } from '@/hooks/querys/order.query'
import type { OrderStatus } from '@/lib/types/interfaces/apis/order.interfaces'

type OrderTab = 'ALL' | OrderStatus

const TABS: { value: OrderTab; label: string }[] = [
  { value: 'ALL', label: 'Tất cả' },
  { value: 'PENDING', label: 'Chờ xác nhận' },
  { value: 'CONFIRMED', label: 'Đã xác nhận' },
  { value: 'PROCESSING', label: 'Đang chuẩn bị' },
  { value: 'SHIPPED', label: 'Đang giao' },
  { value: 'DELIVERED', label: 'Đã giao' },
  { value: 'CANCELLED', label: 'Đã hủy' },
]

export function OrdersContent() {
  const [activeTab, setActiveTab] = useState<OrderTab>('ALL')
  const [searchQuery, setSearchQuery] = useState('')

  const { data, isLoading } = useGetMyOrdersQuery({
    status: activeTab === 'ALL' ? undefined : activeTab,
    limit: 20,
  })

  const orders = data?.data.items ?? []

  const filteredOrders = searchQuery.trim()
    ? orders.filter((o) =>
        o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : orders

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm theo mã đơn hàng..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-11 rounded-lg pl-10"
        />
      </div>

      <TabsUnderline
        value={activeTab}
        onValueChange={(v) => {
          setActiveTab(v as OrderTab)
          setSearchQuery('')
        }}
      >
        <TabsUnderlineList>
          {TABS.map((tab) => (
            <TabsUnderlineTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsUnderlineTrigger>
          ))}
        </TabsUnderlineList>

        {TABS.map((tab) => (
          <TabsUnderlineContent key={tab.value} value={tab.value}>
            {isLoading ? (
              <div className="grid gap-4 mt-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-36 w-full rounded-xl" />
                ))}
              </div>
            ) : filteredOrders.length > 0 ? (
              <div className="grid gap-4 mt-4">
                {filteredOrders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="Không có đơn hàng"
                description={
                  searchQuery
                    ? 'Không tìm thấy đơn hàng phù hợp'
                    : 'Bạn chưa có đơn hàng nào trong mục này'
                }
              />
            )}
          </TabsUnderlineContent>
        ))}
      </TabsUnderline>
    </div>
  )
}
