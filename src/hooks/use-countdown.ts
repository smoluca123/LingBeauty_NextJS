'use client';

import { useState, useEffect, useCallback, useLayoutEffect } from 'react';

interface UseCountdownOptions {
  targetDate: Date | string | number;
  interval?: number;
  onComplete?: () => void;
}

interface CountdownResult {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
  totalMilliseconds: number;
  isExpired: boolean;
  formatted: string;
  formattedShort: string;
}

// Use useLayoutEffect for initial render to avoid cascading renders
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * Hook for countdown timer functionality
 * @param options - Configuration options
 * @returns Countdown state and formatted strings
 */
export function useCountdown(options: UseCountdownOptions): CountdownResult {
  const { targetDate, interval = 1000, onComplete } = options;

  const calculateTimeRemaining = useCallback(() => {
    const target = new Date(targetDate).getTime();
    const now = Date.now();
    const difference = target - now;

    if (difference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
        totalMilliseconds: 0,
        isExpired: true,
      };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    const milliseconds = difference % 1000;

    return {
      days,
      hours,
      minutes,
      seconds,
      milliseconds,
      totalMilliseconds: difference,
      isExpired: false,
    };
  }, [targetDate]);

  const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining);

  // Update state when targetDate changes using layout effect
  useIsomorphicLayoutEffect(() => {
    setTimeRemaining(calculateTimeRemaining());
  }, [calculateTimeRemaining]);

  useEffect(() => {
    // Set up interval
    const timer = setInterval(() => {
      const remaining = calculateTimeRemaining();
      setTimeRemaining(remaining);

      if (remaining.isExpired && onComplete) {
        onComplete();
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [calculateTimeRemaining, interval, onComplete]);

  const formatNumber = (num: number): string => num.toString().padStart(2, '0');

  const formatted =
    timeRemaining.days > 0
      ? `${timeRemaining.days}d ${formatNumber(timeRemaining.hours)}:${formatNumber(
          timeRemaining.minutes,
        )}:${formatNumber(timeRemaining.seconds)}`
      : `${formatNumber(timeRemaining.hours)}:${formatNumber(
          timeRemaining.minutes,
        )}:${formatNumber(timeRemaining.seconds)}`;

  const formattedShort =
    timeRemaining.days > 0
      ? `${timeRemaining.days}d ${formatNumber(timeRemaining.hours)}h`
      : timeRemaining.hours > 0
        ? `${formatNumber(timeRemaining.hours)}:${formatNumber(timeRemaining.minutes)}`
        : `${formatNumber(timeRemaining.minutes)}:${formatNumber(timeRemaining.seconds)}`;

  return {
    ...timeRemaining,
    formatted,
    formattedShort,
  };
}

/**
 * Hook for tracking flash sale status with automatic transitions
 * @param startTime - Flash sale start time
 * @param endTime - Flash sale end time
 * @param serverStatus - Server-side status
 * @param isActive - Whether the flash sale is active
 * @returns Computed status and countdown info
 */
export function useFlashSaleStatus(
  startTime: Date | string,
  endTime: Date | string,
  serverStatus: string,
  isActive: boolean,
) {
  const [computedStatus, setComputedStatus] = useState(() =>
    calculateFlashSaleStatus(startTime, endTime, serverStatus, isActive),
  );

  const startCountdown = useCountdown({
    targetDate: startTime,
    onComplete: () => {
      setComputedStatus('active');
    },
  });

  const endCountdown = useCountdown({
    targetDate: endTime,
    onComplete: () => {
      setComputedStatus('ended');
    },
  });

  useEffect(() => {
    setComputedStatus(
      calculateFlashSaleStatus(startTime, endTime, serverStatus, isActive),
    );
  }, [startTime, endTime, serverStatus, isActive]);

  const isUpcoming = computedStatus === 'upcoming';
  const isActiveNow = computedStatus === 'active';
  const isEnded = computedStatus === 'ended';
  const isInactive = computedStatus === 'inactive';

  return {
    status: computedStatus,
    isUpcoming,
    isActive: isActiveNow,
    isEnded,
    isInactive,
    startCountdown,
    endCountdown,
    timeUntilStart: startCountdown.totalMilliseconds,
    timeUntilEnd: endCountdown.totalMilliseconds,
  };
}

/**
 * Calculate flash sale status based on time and server state
 */
function calculateFlashSaleStatus(
  startTime: Date | string,
  endTime: Date | string,
  serverStatus: string,
  isActive: boolean,
): 'upcoming' | 'active' | 'ended' | 'inactive' {
  if (!isActive) return 'inactive';

  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);

  if (now > end || serverStatus === 'ENDED') return 'ended';
  if (now >= start && now <= end && serverStatus === 'ACTIVE') return 'active';
  return 'upcoming';
}
