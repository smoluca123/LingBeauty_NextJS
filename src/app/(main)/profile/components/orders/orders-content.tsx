'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { EmptyState } from '../empty-state';
import {
  getOrdersByStatus,
  searchOrders,
} from '../../orders/_data/mock-orders';
import { OrderCard } from './order-card';

// ============ Types ============
type OrderTab = 'all' | 'pending' | 'processing' | 'shipping' | 'delivered';

interface TabItem {
  value: OrderTab;
  label: string;
}

// ============ Constants ============
const ORDER_TABS: TabItem[] = [
  { value: 'all', label: 'Tất cả' },
  { value: 'pending', label: 'Chờ xác nhận' },
  { value: 'processing', label: 'Đang chuẩn bị' },
  { value: 'shipping', label: 'Đang giao' },
  { value: 'delivered', label: 'Đã giao' },
];

// ============ Main Component ============
export function OrdersContent() {
  const [activeTab, setActiveTab] = useState<OrderTab>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrders = searchOrders(
    getOrdersByStatus(activeTab),
    searchQuery
  );

  return (
    <div className="space-y-4">
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as OrderTab)}
      >
        <TabsList className="h-auto w-full justify-start gap-0 rounded-none border-b bg-transparent p-0">
          {ORDER_TABS.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="h-10 rounded-none border-b-2 border-transparent px-4 py-2 text-sm font-medium text-muted-foreground data-[state=active]:border-primary-pink data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Search */}
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm đơn hàng..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-11 rounded-lg pl-10 border-input"
          />
        </div>

        {/* Tab Contents */}
        {ORDER_TABS.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="mt-6">
            {filteredOrders.length > 0 ? (
              <div className="grid gap-4">
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
                    : 'Bạn chưa có đơn hàng nào'
                }
              />
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
