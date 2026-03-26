'use client';

import { DollarSign, ShoppingCart, Package, Users } from 'lucide-react';

import { Skeleton } from '@/components/ui/skeleton';
import { StatCard } from '@/app/admin/components/stat-card';
import { useOverviewStatsQuery } from '@/hooks/querys/stats.query';

function StatCardSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-4 md:p-6 space-y-3">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-3 w-40" />
    </div>
  );
}

function formatCurrency(value: string | number): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '0₫';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(num);
}

export function StatsSection() {
  const { data, isLoading, isError } = useOverviewStatsQuery();

  if (isLoading) {
    return (
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  const stats = data.data;

  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Tổng doanh thu"
        value={formatCurrency(stats.totalRevenue)}
        description={`Hôm nay: ${formatCurrency(stats.revenueToday)}`}
        icon={DollarSign}
        trend="up"
      />
      <StatCard
        title="Đơn hàng"
        value={stats.totalOrders.toLocaleString('vi-VN')}
        description={`${stats.pendingOrders} đơn đang chờ xử lý`}
        icon={ShoppingCart}
        trend={stats.pendingOrders > 0 ? 'up' : undefined}
      />
      <StatCard
        title="Sản phẩm"
        value={stats.totalProducts.toLocaleString('vi-VN')}
        description={`${stats.totalReviews} đánh giá`}
        icon={Package}
      />
      <StatCard
        title="Người dùng"
        value={stats.totalUsers.toLocaleString('vi-VN')}
        description={`+${stats.newUsersToday} hôm nay · +${stats.newUsersThisMonth} tháng này`}
        icon={Users}
        trend="up"
      />
    </div>
  );
}
