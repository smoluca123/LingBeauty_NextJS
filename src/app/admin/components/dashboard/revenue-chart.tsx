'use client';

import { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from 'recharts';
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

const SKELETON_HEIGHTS = Array.from({ length: 7 }, () => 30 + Math.random() * 60);

const revenueChartConfig: ChartConfig = {
  revenue: {
    label: 'Doanh thu',
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
  if (period === 'day') return label.slice(5); // MM-DD
  if (period === 'week') return label.replace(/^\d{4}-/, ''); // W01
  if (period === 'month') return label.slice(5); // MM
  return label; // YYYY
}

export function RevenueChart() {
  const [period, setPeriod] = useState<StatsPeriod>('month');
  const { data, isLoading } = useRevenueChartQuery({ period });

  const chartData =
    data?.data?.items.map((item) => ({
      label: formatLabel(item.label, period),
      revenue: parseFloat(item.revenue),
    })) ?? [];

  const totalRevenue = parseFloat(data?.data?.totalRevenue ?? '0');

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="space-y-1">
            <CardTitle className="text-base md:text-lg flex items-center gap-2">
              Doanh thu
              <TrendingUp
                className="h-4 w-4 md:h-5 md:w-5 text-primary-pink"
                aria-hidden="true"
              />
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">
              {isLoading
                ? 'Đang tải...'
                : `Tổng: ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(totalRevenue)}`}
            </CardDescription>
          </div>

          <Select
            value={period}
            onValueChange={(v) => setPeriod(v as StatsPeriod)}
          >
            <SelectTrigger
              id="revenue-period-select"
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
          <div className="h-64 md:h-80 flex items-end gap-2 px-2">
            {SKELETON_HEIGHTS.map((height, i) => (
              <Skeleton
                key={i}
                className="flex-1 rounded-t-md"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        ) : (
          <ChartContainer
            config={revenueChartConfig}
            className="h-64 md:h-80 w-full"
          >
            <BarChart data={chartData}>
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
                tickFormatter={(value) =>
                  `${(value / 1_000_000).toFixed(0)}tr`
                }
                tickMargin={10}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) =>
                      new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                        maximumFractionDigits: 0,
                      }).format(Number(value))
                    }
                  />
                }
              />
              <Bar
                dataKey="revenue"
                fill="var(--color-primary-pink)"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
