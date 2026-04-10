'use client'

import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to error reporting service
    console.error('Global application error:', error)
  }, [error])

  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center px-4 bg-background">
          <div className="w-full max-w-md space-y-6 text-center">
            <div className="flex justify-center">
              <div className="rounded-full bg-destructive/10 p-4">
                <AlertTriangle className="h-12 w-12 text-destructive" />
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-foreground">
                Đã có lỗi nghiêm trọng xảy ra!
              </h1>
              <p className="text-muted-foreground">
                Xin lỗi, ứng dụng gặp lỗi không mong muốn. Vui lòng tải lại
                trang.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => reset()}
                className="inline-flex items-center justify-center rounded-md bg-primary-pink px-4 py-2 text-sm font-medium text-white hover:bg-primary-pink/90 transition-colors"
              >
                Thử lại
              </button>
              <button
                onClick={() => (window.location.href = '/')}
                className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                Về trang chủ
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
