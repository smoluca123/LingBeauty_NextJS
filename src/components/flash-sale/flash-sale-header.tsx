'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CountdownTimer } from './countdown-timer';

interface FlashSaleHeaderProps {
  endTime: string;
  onExpire?: () => void;
}

export function FlashSaleHeader({ endTime, onExpire }: FlashSaleHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-t-2xl bg-primary-pink px-4 py-3 md:px-6">
      {/* Title */}
      <div className="flex items-center gap-2 w-60">
        <h2 className="font-script text-2xl font-bold italic text-white drop-shadow-md md:text-3xl">
          Flash Sale
        </h2>
        <span className="rounded-md bg-muted px-2 py-0.5 text-lg font-bold text-primary-pink md:text-xl">
          24h
        </span>
      </div>

      {/* Countdown */}
      <div className="flex-1 flex justify-center">
        <CountdownTimer endTime={endTime} onExpire={onExpire} />
      </div>

      {/* View all button */}
      <div className="w-60 text-right">
        <Button
          asChild
          variant="outline"
          className="rounded-full border-white bg-transparent text-white hover:bg-white hover:text-purple-600"
        >
          <Link href="/flash-sale">Xem tất cả</Link>
        </Button>
      </div>
    </div>
  );
}
