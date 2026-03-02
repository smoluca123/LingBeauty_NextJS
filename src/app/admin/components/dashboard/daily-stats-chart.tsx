'use client';

import { useState } from 'react';
import { Activity } from 'lucide-react';
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
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
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useDailyStats } from '@/app/admin/hooks';

const dailyChartConfig: ChartConfig = {
  revenue: {
    label: 'Doanh thu (triệu)',
    color: 'var(--color-primary-pink)',
  },
  totalOrders: {
    label: 'Đơn hàng',
    color: 'hsl(220, 70%, 55%)',
  },
  newUsers: {
    label: 'Người dùng mới',
    color: 'hsl(150, 60%, 45%)',
  },
};

export function DailyStatsChart() {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const params = {
    ...(startDate && { startDate }),
    ...(endDate && { endDate }),
  };

  const { data, isLoading } = useDailyStats(params);

  const chartData =
    data?.data.map((item) => ({
      date: item.date,
      revenue: Number(item.revenue) / 1_000_000,
      totalOrders: item.totalOrders,
      newUsers: item.newUsers,
    })) ?? [];

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base md:text-lg flex items-center gap-2">
              Xu hướng hàng ngày
              <Activity
                className="h-4 w-4 md:h-5 md:w-5 text-primary-pink"
                aria-hidden="true"
              />
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">
              {isLoading
                ? 'Đang tải...'
                : `${chartData.length} ngày — doanh thu · đơn hàng · người dùng mới`}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="h-8 w-[140px] text-xs"
              aria-label="Từ ngày"
            />
            <span className="text-xs text-muted-foreground">đến</span>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="h-8 w-[140px] text-xs"
              aria-label="Đến ngày"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-64 md:h-80 w-full rounded-lg" />
        ) : (
          <ChartContainer
            config={dailyChartConfig}
            className="h-64 md:h-80 w-full"
          >
            <LineChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-muted"
              />
              <XAxis
                dataKey="date"
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                tickMargin={10}
                tickFormatter={(v) => {
                  const d = new Date(v);
                  return `${d.getDate()}/${d.getMonth() + 1}`;
                }}
              />
              <YAxis
                yAxisId="revenue"
                orientation="left"
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                tickFormatter={(v) => `${v}tr`}
                tickMargin={5}
              />
              <YAxis
                yAxisId="count"
                orientation="right"
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                tickMargin={5}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => {
                      if (name === 'revenue')
                        return `${Number(value).toFixed(1)} triệu ₫`;
                      return `${value}`;
                    }}
                  />
                }
              />
              <Line
                yAxisId="revenue"
                type="monotone"
                dataKey="revenue"
                stroke="var(--color-primary-pink)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
              <Line
                yAxisId="count"
                type="monotone"
                dataKey="totalOrders"
                stroke="hsl(220, 70%, 55%)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
              <Line
                yAxisId="count"
                type="monotone"
                dataKey="newUsers"
                stroke="hsl(150, 60%, 45%)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
