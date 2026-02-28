'use client';

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
import { Skeleton } from '@/components/ui/skeleton';
import { useRevenueChart } from '@/app/admin/hooks';

const revenueChartConfig: ChartConfig = {
  revenue: {
    label: 'Doanh thu',
    color: 'var(--color-primary-pink)',
  },
};

export function RevenueChart() {
  const { data, isLoading } = useRevenueChart({ period: 'month' });

  const chartData =
    data?.data.items.map((item) => ({
      month: item.label,
      revenue: Number(item.revenue),
    })) ?? [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
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
                : `${chartData.length} tháng gần nhất`}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-64 md:h-80 w-full rounded-lg" />
        ) : (
          <ChartContainer
            config={revenueChartConfig}
            className="h-64 md:h-80 w-full"
          >
            <BarChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-muted"
              />
              <XAxis
                dataKey="month"
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                tickMargin={10}
              />
              <YAxis
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                tickFormatter={(value) => `${(value / 1_000_000).toFixed(0)}tr`}
                tickMargin={10}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) =>
                      `${Number(value).toLocaleString('vi-VN')}₫`
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
