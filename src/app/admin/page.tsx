'use client';

import {
  StatsSection,
  RevenueChart,
  OrdersChart,
  RecentProducts,
  DailyStatsChart,
  OrderStatusPieChart,
  SyncStatsButton,
} from './components/dashboard';

export default function AdminDashboardPage() {
  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">Tổng quan</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Xin chào! Đây là bảng điều khiển quản trị của bạn.
          </p>
        </div>
        <SyncStatsButton />
      </div>

      {/* Stats Grid */}
      <StatsSection />

      {/* Revenue & Orders Charts with period tabs */}
      <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-2">
        <RevenueChart />
        <OrdersChart />
      </div>

      {/* Daily Trends */}
      <DailyStatsChart />

      {/* Top Products & Order Status */}
      <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-2">
        <RecentProducts />
        <OrderStatusPieChart />
      </div>
    </div>
  );
}
