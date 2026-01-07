'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import {
  sendEmailVerificationApi,
  verifyEmailApi,
  resendEmailVerificationApi,
  RateLimitError,
} from '@/lib/apis/client/auth-apis';
import { useAuth } from '@/hooks/use-auth';

export type VerificationStep = 'initial' | 'otp-input';
export type VerificationStatus =
  | 'idle'
  | 'loading'
  | 'success'
  | 'error'
  | 'rate-limited';

export interface UseEmailVerificationReturn {
  // State
  step: VerificationStep;
  status: VerificationStatus;
  error: string | null;
  cooldownSeconds: number;
  isLoading: boolean;

  // Actions
  sendOTP: () => Promise<void>;
  verifyOTP: (code: string) => Promise<boolean>;
  resendOTP: () => Promise<void>;
  reset: () => void;
}

function isRateLimitError(error: unknown): error is RateLimitError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'remainingCooldown' in error &&
    typeof (error as RateLimitError).remainingCooldown === 'number'
  );
}

export function useEmailVerification(): UseEmailVerificationReturn {
  const { refreshAuth } = useAuth();
  const [step, setStep] = useState<VerificationStep>('initial');
  const [status, setStatus] = useState<VerificationStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup countdown on unmount
  useEffect(() => {
    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, []);

  // Countdown timer effect
  useEffect(() => {
    if (cooldownSeconds > 0) {
      countdownRef.current = setInterval(() => {
        setCooldownSeconds((prev) => {
          if (prev <= 1) {
            if (countdownRef.current) {
              clearInterval(countdownRef.current);
            }
            setStatus('idle');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, [cooldownSeconds]);

  const sendOTP = useCallback(async () => {
    setStatus('loading');
    setError(null);

    try {
      await sendEmailVerificationApi();
      setStep('otp-input');
      setStatus('idle'); // Reset to idle so OTP input form is shown
    } catch (err) {
      if (isRateLimitError(err)) {
        setStatus('rate-limited');
        setCooldownSeconds(err.remainingCooldown);
        setError(
          `Vui lòng đợi ${err.remainingCooldown} giây trước khi gửi lại.`
        );
      } else {
        setStatus('error');
        setError(
          err instanceof Error
            ? err.message
            : 'Không thể gửi mã xác thực. Vui lòng thử lại.'
        );
      }
    }
  }, []);

  const verifyOTP = useCallback(
    async (code: string): Promise<boolean> => {
      setStatus('loading');
      setError(null);

      try {
        await verifyEmailApi(code);
        setStatus('success');
        // Refresh user data to update isEmailVerified status
        await refreshAuth();
        return true;
      } catch (err) {
        setStatus('error');
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Mã xác thực không đúng. Vui lòng thử lại.';
        setError(errorMessage);
        return false;
      }
    },
    [refreshAuth]
  );

  const resendOTP = useCallback(async () => {
    setStatus('loading');
    setError(null);

    try {
      await resendEmailVerificationApi();
      setStatus('idle'); // Reset to idle so OTP input form remains visible
    } catch (err) {
      if (isRateLimitError(err)) {
        setStatus('rate-limited');
        setCooldownSeconds(err.remainingCooldown);
        setError(
          `Vui lòng đợi ${err.remainingCooldown} giây trước khi gửi lại.`
        );
      } else {
        setStatus('error');
        setError(
          err instanceof Error
            ? err.message
            : 'Không thể gửi lại mã xác thực. Vui lòng thử lại.'
        );
      }
    }
  }, []);

  const reset = useCallback(() => {
    setStep('initial');
    setStatus('idle');
    setError(null);
    setCooldownSeconds(0);
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }
  }, []);

  return {
    step,
    status,
    error,
    cooldownSeconds,
    isLoading: status === 'loading',
    sendOTP,
    verifyOTP,
    resendOTP,
    reset,
  };
}
