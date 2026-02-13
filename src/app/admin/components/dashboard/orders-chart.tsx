import { ShoppingCart } from 'lucide-react';
import { Line, LineChart, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from '@/components/ui/chart';

const ordersData = [
  { month: 'T1', orders: 120 },
  { month: 'T2', orders: 145 },
  { month: 'T3', orders: 132 },
  { month: 'T4', orders: 168 },
  { month: 'T5', orders: 155 },
  { month: 'T6', orders: 189 },
];

const ordersChartConfig: ChartConfig = {
  orders: {
    label: 'Đơn hàng',
    color: 'var(--color-primary-pink)',
  },
};

export function OrdersChart() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base md:text-lg flex items-center gap-2">
              Đơn hàng
              <ShoppingCart className="h-4 w-4 md:h-5 md:w-5 text-primary-pink" />
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">
              6 tháng gần nhất
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={ordersChartConfig} className="h-64 md:h-80 w-full">
          <LineChart data={ordersData}>
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
      </CardContent>
    </Card>
  );
}
