'use client';
'use no memo';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from '@/components/ui/input-otp';
import { useEmailVerification } from '@/hooks/use-email-verification';
import { maskEmail } from '@/lib/utils/email-utils';
import { Mail, CheckCircle2, Loader2, RefreshCw } from 'lucide-react';

interface EmailVerificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userEmail: string;
  onVerificationSuccess?: () => void;
}

export function EmailVerificationModal({
  open,
  onOpenChange,
  userEmail,
  onVerificationSuccess,
}: EmailVerificationModalProps) {
  const {
    step,
    status,
    error,
    cooldownSeconds,
    isLoading,
    sendOTP,
    verifyOTP,
    resendOTP,
    reset,
  } = useEmailVerification();

  const [otpValue, setOtpValue] = useState('');
  const [prevOpen, setPrevOpen] = useState(open);
  const [otpSent, setOtpSent] = useState(false);

  // Reset state when modal closes (using derived state pattern)
  if (prevOpen !== open) {
    setPrevOpen(open);
    if (!open) {
      setOtpValue('');
      setOtpSent(false);
      reset();
    }
  }

  const handleSendOTP = async () => {
    await sendOTP();
    setOtpSent(true);
  };

  const handleVerifyOTP = async (code: string) => {
    const success = await verifyOTP(code);
    if (success) {
      onVerificationSuccess?.();
      onOpenChange(false);
    } else {
      setOtpValue('');
    }
  };

  const handleResendOTP = async () => {
    setOtpValue('');
    await resendOTP();
    setOtpSent(true);
  };

  const handleOTPComplete = (value: string) => {
    if (value.length === 6) {
      handleVerifyOTP(value);
    }
  };

  const formatCountdown = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px] rounded-2xl p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 bg-linear-to-br from-primary-pink/5 to-transparent">
          <div className="flex justify-center mb-3">
            <div className="w-16 h-16 rounded-full bg-primary-pink/10 flex items-center justify-center">
              <Mail className="w-8 h-8 text-primary-pink" />
            </div>
          </div>
          <DialogTitle className="text-xl font-bold text-center">
            Xác thực email
          </DialogTitle>
          <DialogDescription className="text-center">
            {step === 'initial'
              ? `Chúng tôi sẽ gửi mã xác thực đến ${maskEmail(userEmail)}`
              : `Nhập mã 6 chữ số đã gửi đến ${maskEmail(userEmail)}`}
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 pb-6 pt-4">
          {step === 'initial' ? (
            <div className="space-y-4">
              {error && (
                <div
                  className="p-3 rounded-lg bg-red-50 text-red-600 text-sm"
                  role="alert"
                >
                  {error}
                </div>
              )}

              {status === 'rate-limited' && cooldownSeconds > 0 ? (
                <div className="text-center">
                  <p className="text-muted-foreground mb-2">
                    Vui lòng đợi trước khi gửi lại
                  </p>
                  <p className="text-2xl font-bold text-primary-pink">
                    {formatCountdown(cooldownSeconds)}
                  </p>
                </div>
              ) : (
                <Button
                  onClick={handleSendOTP}
                  disabled={isLoading}
                  className="w-full h-11 rounded-xl bg-primary-pink hover:bg-primary-pink/90 text-white font-semibold"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Đang gửi...
                    </>
                  ) : (
                    'Gửi mã xác thực'
                  )}
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {otpSent && !error && (
                <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-green-50 text-green-600 text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mã xác thực đã được gửi đến email của bạn!</span>
                </div>
              )}

              {error && (
                <div
                  className="p-3 rounded-lg bg-red-50 text-red-600 text-sm"
                  role="alert"
                >
                  {error}
                </div>
              )}

              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otpValue}
                  onChange={setOtpValue}
                  onComplete={handleOTPComplete}
                  disabled={isLoading}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <Button
                onClick={() => handleVerifyOTP(otpValue)}
                disabled={isLoading || otpValue.length !== 6}
                className="w-full h-11 rounded-xl bg-primary-pink hover:bg-primary-pink/90 text-white font-semibold"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Đang xác thực...
                  </>
                ) : (
                  'Xác thực'
                )}
              </Button>

              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  Không nhận được mã?
                </p>
                {status === 'rate-limited' && cooldownSeconds > 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Gửi lại sau{' '}
                    <span className="font-semibold text-primary-pink">
                      {formatCountdown(cooldownSeconds)}
                    </span>
                  </p>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleResendOTP}
                    disabled={isLoading || cooldownSeconds > 0}
                    className="text-primary-pink hover:text-primary-pink/80"
                  >
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Gửi lại mã
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-muted/30 border-t text-center text-xs text-muted-foreground">
          Mã xác thực có hiệu lực trong 10 phút
        </div>
      </DialogContent>
    </Dialog>
  );
}
