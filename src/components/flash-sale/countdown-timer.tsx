'use client';

import { useEffect, useState } from 'react';
import { calculateTimeRemaining, padZero } from '@/lib/utils/flash-sale-utils';
import type { CountdownTime } from '@/types/flash-sale';

interface CountdownTimerProps {
  endTime: string;
  onExpire?: () => void;
}

export function CountdownTimer({ endTime, onExpire }: CountdownTimerProps) {
  const [time, setTime] = useState<CountdownTime>(() =>
    calculateTimeRemaining(endTime)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = calculateTimeRemaining(endTime);
      setTime(remaining);

      if (
        remaining.days === 0 &&
        remaining.hours === 0 &&
        remaining.minutes === 0 &&
        remaining.seconds === 0
      ) {
        clearInterval(timer);
        onExpire?.();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime, onExpire]);

  return (
    <div className="flex items-center gap-1 text-sm" suppressHydrationWarning>
      <div className="flex items-center gap-1">
        <TimeUnit value={time.days} label="NGÀY" />
        <TimeSeparator />
        <TimeUnit value={time.hours} label="GIỜ" />
        <TimeSeparator />
        <TimeUnit value={time.minutes} label="PHÚT" />
        <TimeSeparator />
        <TimeUnit value={time.seconds} label="GIÂY" />
      </div>
    </div>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex items-center gap-1 rounded-md bg-white px-2 py-1">
      <span
        className="min-w-[24px] text-center text-lg font-bold text-purple-700"
        suppressHydrationWarning
      >
        {padZero(value)}
      </span>
      <span className="text-[10px] font-medium text-purple-500">{label}</span>
    </div>
  );
}

function TimeSeparator() {
  return <span className="font-bold text-white">|</span>;
}
