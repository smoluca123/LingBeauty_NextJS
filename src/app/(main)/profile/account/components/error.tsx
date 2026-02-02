'use client';

import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

/**
 * Error boundary for Account page
 * Catches errors during data fetching and rendering
 */

interface IProps {
  message?: string;
  reset: () => void;
}

export default function AccountError({ message, reset }: IProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">Tài khoản</h1>

      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="rounded-full bg-destructive/20 p-3">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-destructive">
              Không thể tải thông tin tài khoản
            </h2>
            <p className="text-sm text-muted-foreground">
              {message || 'Đã xảy ra lỗi khi tải dữ liệu'}
            </p>
          </div>

          <div className="flex gap-3">
            <Button onClick={reset} variant="outline" className="min-w-30">
              Thử lại
            </Button>
            <Button
              onClick={() => (window.location.href = '/')}
              className="min-w-30 bg-primary-pink hover:bg-primary-pink/90"
            >
              Về trang chủ
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
