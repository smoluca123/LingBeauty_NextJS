'use client'

import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="flex justify-center">
          <div className="rounded-full bg-destructive/10 p-4">
            <AlertTriangle className="h-12 w-12 text-destructive" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            Đã có lỗi xảy ra!
          </h1>
          <p className="text-muted-foreground">
            Xin lỗi, đã có lỗi không mong muốn xảy ra. Vui lòng thử lại.
          </p>
        </div>

        {process.env.NODE_ENV === 'development' && error.message && (
          <div className="rounded-lg bg-muted p-4 text-left">
            <p className="text-xs font-mono text-muted-foreground break-all">
              {error.message}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={() => reset()} variant="default">
            Thử lại
          </Button>
          <Button
            onClick={() => (window.location.href = '/')}
            variant="outline"
          >
            Về trang chủ
          </Button>
        </div>
      </div>
    </div>
  )
}
