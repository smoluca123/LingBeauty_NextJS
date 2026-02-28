'use client';

import {
  StatsSection,
  RevenueChart,
  OrdersChart,
  RecentProducts,
  RecentUsers,
} from './components/dashboard';

export default function AdminDashboardPage() {
  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold">Tổng quan</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Xin chào! Đây là bảng điều khiển quản trị của bạn.
        </p>
      </div>

      {/* Stats Grid */}
      <StatsSection />

      {/* Charts */}
      <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-2">
        <RevenueChart />
        <OrdersChart />
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-2">
        <RecentProducts />
        <RecentUsers />
      </div>
    </div>
  );
}
