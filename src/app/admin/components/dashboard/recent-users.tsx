'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useOrderStatusBreakdown } from '@/app/admin/hooks';

const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: 'Chờ xử lý',
  confirmed: 'Đã xác nhận',
  processing: 'Đang xử lý',
  shipped: 'Đang giao',
  delivered: 'Đã giao',
  cancelled: 'Đã hủy',
  refunded: 'Hoàn tiền',
};

const ORDER_STATUS_COLORS: Record<string, string> = {
  pending: 'text-yellow-600',
  confirmed: 'text-blue-600',
  processing: 'text-indigo-600',
  shipped: 'text-purple-600',
  delivered: 'text-green-600',
  cancelled: 'text-red-600',
  refunded: 'text-orange-600',
};

export function RecentUsers() {
  const { data, isLoading } = useOrderStatusBreakdown();

  const breakdown = data?.data;

  const entries = breakdown
    ? (Object.entries(breakdown) as [string, number][])
    : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base md:text-lg">Trạng thái đơn hàng</CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Phân bổ trạng thái hiện tại
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-full rounded" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {entries.map(([status, count]) => (
              <div
                key={status}
                className="flex items-center justify-between gap-2"
              >
                <p className="text-sm md:text-base text-muted-foreground">
                  {ORDER_STATUS_LABELS[status] ?? status}
                </p>
                <span
                  className={`font-semibold text-sm md:text-base whitespace-nowrap ${ORDER_STATUS_COLORS[status] ?? ''}`}
                >
                  {count.toLocaleString('vi-VN')}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
