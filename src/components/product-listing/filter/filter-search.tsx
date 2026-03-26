'use client'

import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils/style-utils'

interface FilterSearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function FilterSearch({
  value,
  onChange,
  placeholder = 'Tìm kiếm sản phẩm...',
  className,
}: FilterSearchProps) {
  return (
    <div className={cn('relative', className)}>
      <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 pl-10 pr-4 rounded-xl bg-white border-gray-200 text-sm placeholder:text-muted-foreground/60 focus:border-primary-pink focus:ring-2 focus:ring-primary-pink/10 transition-all shadow-sm"
      />
    </div>
  )
}
