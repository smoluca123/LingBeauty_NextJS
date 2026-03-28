'use client'

import { Heart } from 'lucide-react'
import Link from 'next/link'
import { useWishlist } from '@/hooks/querys/wishlist.query'
import { cn } from '@/lib/utils/style-utils'
import BadgeCount from '@/components/badge-count'
import { Button } from '@/components/ui/button'

interface WishlistIconProps {
  className?: string
  showCount?: boolean
}

export function WishlistIcon({
  className,
  showCount = true,
}: WishlistIconProps) {
  const { data } = useWishlist()
  const count = data?.pages[0]?.data?.totalCount || 0

  return (
    <Link
      href="/wishlist"
      className={cn('relative', className)}
      aria-label="Danh sách yêu thích"
    >
      <Button variant={'ghost'}>
        <Heart className="h-6 w-6" />
        {showCount && count > 0 && <BadgeCount count={count} />}
      </Button>
    </Link>
  )
}
