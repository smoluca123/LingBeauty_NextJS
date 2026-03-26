'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';

import { Input } from '@/components/ui/input';
import {
  TabsUnderline,
  TabsUnderlineList,
  TabsUnderlineTrigger,
  TabsUnderlineContent,
} from '@/components/ui/tabs-underline';
import { EmptyState } from '@/app/(main)/profile/components/empty-state';
import { OrderCard } from './order-card';

import {
  type Order,
  getOrdersByStatus,
  searchOrders,
} from '@/app/(main)/profile/orders/_data/mock-orders';

// ============ Types ============
type OrderTab = 'all' | 'pending' | 'processing' | 'shipping' | 'delivered';

// ============ Helper Component ============
function OrdersTabContent({
  orders,
  searchQuery,
}: {
  orders: Order[];
  searchQuery: string;
}) {
  return orders.length > 0 ? (
    <div className="grid gap-4">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  ) : (
    <EmptyState
      title="Không có đơn hàng"
      description={
        searchQuery
          ? 'Không tìm thấy đơn hàng phù hợp'
          : 'Bạn chưa có đơn hàng nào'
      }
    />
  );
}

// ============ Main Component ============
export function OrdersContent() {
  const [activeTab, setActiveTab] = useState<OrderTab>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrders = searchOrders(
    getOrdersByStatus(activeTab),
    searchQuery,
  );

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm đơn hàng..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-11 rounded-lg pl-10 border-input"
        />
      </div>

      {/* Tabs */}
      <TabsUnderline
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as OrderTab)}
      >
        <TabsUnderlineList>
          <TabsUnderlineTrigger value="all">Tất cả</TabsUnderlineTrigger>
          <TabsUnderlineTrigger value="pending">
            Chờ xác nhận
          </TabsUnderlineTrigger>
          <TabsUnderlineTrigger value="processing">
            Đang chuẩn bị
          </TabsUnderlineTrigger>
          <TabsUnderlineTrigger value="shipping">
            Đang giao
          </TabsUnderlineTrigger>
          <TabsUnderlineTrigger value="delivered">Đã giao</TabsUnderlineTrigger>
        </TabsUnderlineList>

        <TabsUnderlineContent value="all">
          <OrdersTabContent orders={filteredOrders} searchQuery={searchQuery} />
        </TabsUnderlineContent>

        <TabsUnderlineContent value="pending">
          <OrdersTabContent orders={filteredOrders} searchQuery={searchQuery} />
        </TabsUnderlineContent>

        <TabsUnderlineContent value="processing">
          <OrdersTabContent orders={filteredOrders} searchQuery={searchQuery} />
        </TabsUnderlineContent>

        <TabsUnderlineContent value="shipping">
          <OrdersTabContent orders={filteredOrders} searchQuery={searchQuery} />
        </TabsUnderlineContent>

        <TabsUnderlineContent value="delivered">
          <OrdersTabContent orders={filteredOrders} searchQuery={searchQuery} />
        </TabsUnderlineContent>
      </TabsUnderline>
    </div>
  );
}
