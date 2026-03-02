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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useRevenueChart } from '@/app/admin/hooks';
import type { StatsPeriod } from '@/lib/types/interfaces/apis/stats.interfaces';

const PERIOD_LABELS: Record<StatsPeriod, string> = {
  day: 'Ngày',
  week: 'Tuần',
  month: 'Tháng',
  year: 'Năm',
};

const revenueChartConfig: ChartConfig = {
  revenue: {
    label: 'Doanh thu',
    color: 'var(--color-primary-pink)',
  },
};

export function RevenueChart() {
  const [period, setPeriod] = useState<StatsPeriod>('month');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const params = {
    period,
    ...(startDate && { startDate }),
    ...(endDate && { endDate }),
  };

  const { data, isLoading } = useRevenueChart(params);

  const chartData =
    data?.data.items.map((item) => ({
      label: item.label,
      revenue: Number(item.revenue),
    })) ?? [];

  const totalRevenue = data?.data.totalRevenue
    ? `${Number(data.data.totalRevenue).toLocaleString('vi-VN')}₫`
    : '—';

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3">
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
                  : `Tổng: ${totalRevenue} · ${chartData.length} ${PERIOD_LABELS[period].toLowerCase()}`}
              </CardDescription>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <Tabs
              value={period}
              onValueChange={(v) => setPeriod(v as StatsPeriod)}
            >
              <TabsList className="h-8">
                {Object.entries(PERIOD_LABELS).map(([key, label]) => (
                  <TabsTrigger key={key} value={key} className="text-xs px-3">
                    {label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <div className="flex items-center gap-2">
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-8 w-[130px] text-xs"
                aria-label="Từ ngày"
              />
              <span className="text-xs text-muted-foreground">—</span>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="h-8 w-[130px] text-xs"
                aria-label="Đến ngày"
              />
            </div>
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
                dataKey="label"
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                tickMargin={10}
              />
              <YAxis
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
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
