'use client';

import { MessageSquare, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface QandAStatsProps {
  stats?: {
    totalQuestions: number;
    answeredQuestions: number;
    pendingQuestions: number;
    answerRate: number;
  };
  isLoading?: boolean;
}

export function QandAStats({ stats, isLoading }: QandAStatsProps) {
  if (isLoading) {
    return (
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className='p-6'>
              <Skeleton className='h-20 w-full' />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: 'Tổng câu hỏi',
      value: stats?.totalQuestions ?? 0,
      icon: MessageSquare,
      color: 'text-primary-pink',
      bgColor: 'bg-primary-pink/10',
    },
    {
      title: 'Đã trả lời',
      value: stats?.answeredQuestions ?? 0,
      icon: CheckCircle,
      color: 'text-primary-pink',
      bgColor: 'bg-primary-pink/10',
    },
    {
      title: 'Chờ trả lời',
      value: stats?.pendingQuestions ?? 0,
      icon: Clock,
      color: 'text-muted-foreground',
      bgColor: 'bg-muted',
    },
    {
      title: 'Tỷ lệ trả lời',
      value: `${stats?.answerRate ?? 0}%`,
      icon: TrendingUp,
      color: 'text-primary-pink',
      bgColor: 'bg-primary-pink/10',
    },
  ];

  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
      {statCards.map((stat) => (
        <Card key={stat.title}>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  {stat.title}
                </p>
                <p className='text-2xl font-bold mt-2'>{stat.value}</p>
              </div>
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
