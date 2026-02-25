import { TrendingUp } from 'lucide-react';
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from '@/components/ui/chart';

const revenueData = [
  { month: 'T1', revenue: 45000000 },
  { month: 'T2', revenue: 52000000 },
  { month: 'T3', revenue: 48000000 },
  { month: 'T4', revenue: 61000000 },
  { month: 'T5', revenue: 55000000 },
  { month: 'T6', revenue: 67000000 },
];

const revenueChartConfig: ChartConfig = {
  revenue: {
    label: 'Doanh thu',
    color: 'var(--color-primary-pink)',
  },
};

export function RevenueChart() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base md:text-lg flex items-center gap-2">
              Doanh thu
              <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-primary-pink" aria-hidden="true" />
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">
              6 tháng gần nhất
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={revenueChartConfig} className="h-64 md:h-80 w-full">
          <BarChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="month"
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              tickMargin={10}
            />
            <YAxis
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              tickFormatter={(value) => `${(value / 1000000).toFixed(0)}tr`}
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
      </CardContent>
    </Card>
  );
}
