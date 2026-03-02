'use client';

import { Pie, PieChart, Cell } from 'recharts';
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
import { useOrderStatusBreakdown } from '@/app/admin/hooks';

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string }
> = {
  pending: { label: 'Chờ xử lý', color: 'hsl(45, 93%, 47%)' },
  confirmed: { label: 'Đã xác nhận', color: 'hsl(217, 91%, 60%)' },
  processing: { label: 'Đang xử lý', color: 'hsl(239, 84%, 67%)' },
  shipped: { label: 'Đang giao', color: 'hsl(271, 91%, 65%)' },
  delivered: { label: 'Đã giao', color: 'hsl(142, 71%, 45%)' },
  cancelled: { label: 'Đã hủy', color: 'hsl(0, 84%, 60%)' },
  refunded: { label: 'Hoàn tiền', color: 'hsl(25, 95%, 53%)' },
};

const chartConfig: ChartConfig = Object.fromEntries(
  Object.entries(STATUS_CONFIG).map(([key, { label, color }]) => [
    key,
    { label, color },
  ]),
);

export function OrderStatusPieChart() {
  const { data, isLoading } = useOrderStatusBreakdown();

  const breakdown = data?.data;

  const chartData = breakdown
    ? Object.entries(breakdown)
        .filter(([, count]) => (count as number) > 0)
        .map(([status, count]) => ({
          name: STATUS_CONFIG[status]?.label ?? status,
          value: count as number,
          fill: STATUS_CONFIG[status]?.color ?? 'hsl(0, 0%, 60%)',
        }))
    : [];

  const totalOrders = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base md:text-lg">
          Trạng thái đơn hàng
        </CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Phân bổ trạng thái hiện tại
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-[200px] w-full rounded-lg" />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <ChartContainer
              config={chartConfig}
              className="h-[200px] w-full"
            >
              <PieChart>
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value) =>
                        `${value} đơn`
                      }
                    />
                  }
                />
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  strokeWidth={2}
                  stroke="hsl(var(--background))"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>

            {/* Center label */}
            <div className="text-center -mt-[130px] mb-[100px]">
              <p className="text-2xl font-bold">
                {totalOrders.toLocaleString('vi-VN')}
              </p>
              <p className="text-xs text-muted-foreground">Tổng đơn</p>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 w-full">
              {chartData.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className="h-3 w-3 rounded-full shrink-0"
                      style={{ backgroundColor: item.fill }}
                    />
                    <span className="text-xs text-muted-foreground truncate">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-xs font-semibold whitespace-nowrap">
                    {item.value.toLocaleString('vi-VN')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
