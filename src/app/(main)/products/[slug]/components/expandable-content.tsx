'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils/style-utils'

interface ExpandableContentProps {
  children: React.ReactNode
  maxHeight?: number
}

export function ExpandableContent({
  children,
  maxHeight = 300,
}: ExpandableContentProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [shouldShowButton, setShouldShowButton] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Kiểm tra xem nội dung có vượt quá chiều cao tối đa không
    if (contentRef.current) {
      const contentHeight = contentRef.current.scrollHeight
      setShouldShowButton(contentHeight > maxHeight)
    }
  }, [maxHeight])

  return (
    <div className="space-y-3">
      <div
        ref={contentRef}
        className="relative overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          maxHeight:
            !isExpanded && shouldShowButton ? `${maxHeight}px` : 'none',
        }}
      >
        {children}
        {/* Gradient overlay khi thu gọn - responsive height */}
        {!isExpanded && shouldShowButton && (
          <div
            className="pointer-events-none absolute bottom-0 left-0 right-0 bg-linear-to-t from-background to-transparent"
            style={{ height: `${Math.min(96, maxHeight * 0.3)}px` }}
          />
        )}
      </div>

      {/* Nút Xem thêm / Thu gọn */}
      {shouldShowButton && (
        <div className="flex justify-center pt-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={cn(
              'flex items-center gap-2 rounded-lg border border-primary-pink/20 bg-primary-pink/5 px-6 py-2.5 text-sm font-medium text-primary-pink transition-all',
              'hover:border-primary-pink/40 hover:bg-primary-pink/10',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-pink focus-visible:ring-offset-2',
            )}
            aria-expanded={isExpanded}
            aria-label={isExpanded ? 'Thu gọn nội dung' : 'Xem thêm nội dung'}
          >
            {isExpanded ? (
              <>
                Thu gọn
                <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                Xem thêm
                <ChevronDown className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}
