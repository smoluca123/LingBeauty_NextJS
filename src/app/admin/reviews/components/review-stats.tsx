'use client';

import { Star, MessageSquare, Clock, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminReviewStatsQuery } from '@/hooks/querys/admin-review.query';
import { Skeleton } from '@/components/ui/skeleton';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const ratingColors = {
  1: '#ef4444', // red-500
  2: '#f97316', // orange-500
  3: '#eab308', // yellow-500
  4: '#84cc16', // lime-500
  5: '#22c55e', // green-500
};

export function ReviewStats() {
  const { data: statsData, isLoading } = useAdminReviewStatsQuery();
  const stats = statsData?.data;

  if (isLoading) {
    return <ReviewStatsSkeleton />;
  }

  const distributionData = stats
    ? [
        { rating: '1 sao', count: stats.ratingDistribution[1], value: 1 },
        { rating: '2 sao', count: stats.ratingDistribution[2], value: 2 },
        { rating: '3 sao', count: stats.ratingDistribution[3], value: 3 },
        { rating: '4 sao', count: stats.ratingDistribution[4], value: 4 },
        { rating: '5 sao', count: stats.ratingDistribution[5], value: 5 },
      ]
    : [];

  return (
    <div className='space-y-4'>
      {/* Stats Cards */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Tổng đánh giá</CardTitle>
            <MessageSquare className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats?.totalReviews ?? 0}</div>
            <p className='text-xs text-muted-foreground'>
              Tất cả đánh giá trong hệ thống
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Đã phê duyệt</CardTitle>
            <CheckCircle className='h-4 w-4 text-green-600' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-green-600'>
              {stats?.approvedReviews ?? 0}
            </div>
            <p className='text-xs text-muted-foreground'>
              {stats
                ? Math.round((stats.approvedReviews / stats.totalReviews) * 100)
                : 0}
              % tổng số đánh giá
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Chờ phê duyệt</CardTitle>
            <Clock className='h-4 w-4 text-orange-600' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-orange-600'>
              {stats?.pendingReviews ?? 0}
            </div>
            <p className='text-xs text-muted-foreground'>
              Cần được xem xét và phê duyệt
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Đánh giá trung bình
            </CardTitle>
            <Star className='h-4 w-4 text-yellow-500' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {stats?.averageRating ?? 0}
              <span className='text-sm text-muted-foreground font-normal'>
                /5
              </span>
            </div>
            <p className='text-xs text-muted-foreground'>
              Dựa trên đánh giá đã phê duyệt
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Rating Distribution Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Phân bố đánh giá theo sao</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='h-[250px]'>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart data={distributionData}>
                <CartesianGrid strokeDasharray='3 3' vertical={false} />
                <XAxis
                  dataKey='rating'
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(value: number) => [value, 'Số lượng']}
                  contentStyle={{
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Bar dataKey='count' radius={[4, 4, 0, 0]}>
                  {distributionData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        ratingColors[entry.value as keyof typeof ratingColors]
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ReviewStatsSkeleton() {
  return (
    <div className='space-y-4'>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className='pb-2'>
              <Skeleton className='h-4 w-24' />
            </CardHeader>
            <CardContent>
              <Skeleton className='h-8 w-16 mb-2' />
              <Skeleton className='h-3 w-32' />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <Skeleton className='h-5 w-48' />
        </CardHeader>
        <CardContent>
          <Skeleton className='h-[250px] w-full' />
        </CardContent>
      </Card>
    </div>
  );
}
