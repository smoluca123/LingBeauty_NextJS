'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils/style-utils'

interface GoBackButtonProps {
  className?: string
}

export function GoBackButton({ className }: GoBackButtonProps) {
  const router = useRouter()

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className={cn(
        'group inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary-pink',
        className,
      )}
    >
      <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
      Quay lại trang trước
    </button>
  )
}
