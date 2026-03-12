'use client';

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useOrderStatusBreakdownQuery } from '@/hooks/querys/stats.query';
import type { IOrderStatusBreakdownType } from '@/lib/types/interfaces/apis/stats.interfaces';

interface StatusConfig {
  key: keyof IOrderStatusBreakdownType;
  label: string;
  color: string;
}

const STATUS_CONFIG: StatusConfig[] = [
  { key: 'pending', label: 'Chờ xử lý', color: '#f59e0b' },
  { key: 'confirmed', label: 'Đã xác nhận', color: '#3b82f6' },
  { key: 'processing', label: 'Đang xử lý', color: '#8b5cf6' },
  { key: 'shipped', label: 'Đang giao', color: '#06b6d4' },
  { key: 'delivered', label: 'Đã giao', color: '#22c55e' },
  { key: 'cancelled', label: 'Đã hủy', color: '#ef4444' },
  { key: 'refunded', label: 'Hoàn tiền', color: '#f97316' },
];

export function RecentUsers() {
  const { data, isLoading } = useOrderStatusBreakdownQuery();

  const breakdown = data?.data;

  const chartData = STATUS_CONFIG.filter(
    (s) => breakdown && breakdown[s.key] > 0,
  ).map((s) => ({
    name: s.label,
    value: breakdown![s.key],
    color: s.color,
  }));

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base md:text-lg">
          Trạng thái đơn hàng
        </CardTitle>
        <CardDescription className="text-xs md:text-sm">
          {isLoading
            ? 'Đang tải...'
            : `Tổng ${total.toLocaleString('vi-VN')} đơn hàng`}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex flex-col items-center gap-4">
            <Skeleton className="h-48 w-48 rounded-full" />
            <div className="grid grid-cols-2 gap-2 w-full">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
          </div>
        ) : chartData.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm py-8">
            Chưa có dữ liệu
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string) => [
                  `${value.toLocaleString('vi-VN')} đơn`,
                  name,
                ]}
              />
              <Legend
                formatter={(value) => (
                  <span className="text-xs">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
