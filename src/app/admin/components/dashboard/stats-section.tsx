'use client';

import { DollarSign, ShoppingCart, Package, Users } from 'lucide-react';
import { StatCard } from '../stat-card';
import { useOverviewStats } from '@/app/admin/hooks';
import { Skeleton } from '@/components/ui/skeleton';

function StatsSkeleton() {
  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-[104px] rounded-xl" />
      ))}
    </div>
  );
}

export function StatsSection() {
  const { data, isLoading } = useOverviewStats();

  if (isLoading) return <StatsSkeleton />;

  const stats = data?.data;

  const formatRevenue = (value: string) =>
    `${Number(value).toLocaleString('vi-VN')}₫`;

  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Tổng doanh thu"
        value={stats ? formatRevenue(stats.totalRevenue) : '—'}
        description={
          stats
            ? `Hôm nay: ${formatRevenue(stats.revenueToday)}`
            : undefined
        }
        icon={DollarSign}
        trend="up"
      />
      <StatCard
        title="Đơn hàng"
        value={stats ? stats.totalOrders.toLocaleString('vi-VN') : '—'}
        description={
          stats ? `${stats.pendingOrders} đơn đang chờ xử lý` : undefined
        }
        icon={ShoppingCart}
      />
      <StatCard
        title="Sản phẩm"
        value={stats ? stats.totalProducts.toLocaleString('vi-VN') : '—'}
        description={stats ? `${stats.totalReviews} đánh giá` : undefined}
        icon={Package}
      />
      <StatCard
        title="Người dùng"
        value={stats ? stats.totalUsers.toLocaleString('vi-VN') : '—'}
        description={
          stats ? `+${stats.newUsersThisMonth} người dùng tháng này` : undefined
        }
        icon={Users}
        trend="up"
      />
    </div>
  );
}
