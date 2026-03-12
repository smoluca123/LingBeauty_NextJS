'use client';

import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { Line, LineChart, XAxis, YAxis, CartesianGrid } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from '@/components/ui/chart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useRevenueChartQuery } from '@/hooks/querys/stats.query';
import type { StatsPeriod } from '@/lib/types/interfaces/apis/stats.interfaces';

const ordersChartConfig: ChartConfig = {
  orders: {
    label: 'Đơn hàng',
    color: 'var(--color-primary-pink)',
  },
};

const PERIOD_OPTIONS: { value: StatsPeriod; label: string }[] = [
  { value: 'day', label: 'Theo ngày' },
  { value: 'week', label: 'Theo tuần' },
  { value: 'month', label: 'Theo tháng' },
  { value: 'year', label: 'Theo năm' },
];

function formatLabel(label: string, period: StatsPeriod): string {
  if (period === 'day') return label.slice(5);
  if (period === 'week') return label.replace(/^\d{4}-/, '');
  if (period === 'month') return label.slice(5);
  return label;
}

export function OrdersChart() {
  const [period, setPeriod] = useState<StatsPeriod>('month');
  const { data, isLoading } = useRevenueChartQuery({ period });

  const chartData =
    data?.data?.items.map((item) => ({
      label: formatLabel(item.label, period),
      orders: item.orders,
    })) ?? [];

  const totalOrders = data?.data?.totalOrders ?? 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="space-y-1">
            <CardTitle className="text-base md:text-lg flex items-center gap-2">
              Đơn hàng
              <ShoppingCart className="h-4 w-4 md:h-5 md:w-5 text-primary-pink" />
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">
              {isLoading
                ? 'Đang tải...'
                : `Tổng: ${totalOrders.toLocaleString('vi-VN')} đơn`}
            </CardDescription>
          </div>

          <Select
            value={period}
            onValueChange={(v) => setPeriod(v as StatsPeriod)}
          >
            <SelectTrigger
              id="orders-period-select"
              className="w-32 h-8 text-xs"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PERIOD_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="h-64 md:h-80 flex flex-col justify-end gap-1 px-2">
            <Skeleton className="h-full w-full rounded-md opacity-30" />
          </div>
        ) : (
          <ChartContainer
            config={ordersChartConfig}
            className="h-64 md:h-80 w-full"
          >
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="label"
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                tickMargin={10}
              />
              <YAxis
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                tickMargin={10}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="var(--color-primary-pink)"
                strokeWidth={3}
                dot={{ fill: 'var(--color-primary-pink)', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
