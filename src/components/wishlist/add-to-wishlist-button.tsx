'use client'

import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/style-utils'
import {
  useAddToWishlist,
  useRemoveFromWishlist,
} from '@/hooks/mutations/wishlist.mutation'
import { useWishlistStatus } from '@/hooks/querys/wishlist.query'
import { useState, useTransition } from 'react'

interface AddToWishlistButtonProps {
  productId: string
  variantId?: string
  className?: string
  iconOnly?: boolean
}

export function AddToWishlistButton({
  productId,
  variantId,
  className,
  iconOnly = false,
}: AddToWishlistButtonProps) {
  const { data: statusData } = useWishlistStatus(productId, variantId)
  const addToWishlist = useAddToWishlist()
  const removeFromWishlist = useRemoveFromWishlist()
  const [isAnimating, setIsAnimating] = useState(false)
  const [isPending, startTransition] = useTransition()

  const isInWishlist = statusData?.data?.isInWishlist ?? false
  const wishlistItemId = statusData?.data?.wishlistItemId

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 300)

    startTransition(() => {
      if (isInWishlist && wishlistItemId) {
        removeFromWishlist.mutate({
          itemId: wishlistItemId,
          productId,
          variantId,
        })
      } else {
        addToWishlist.mutate({
          productId,
          variantId,
        })
      }
    })
  }

  const isLoading =
    isPending || addToWishlist.isPending || removeFromWishlist.isPending

  if (iconOnly) {
    return (
      <button
        onClick={handleToggle}
        disabled={isLoading}
        className={cn(
          'group relative flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm transition-all hover:shadow-md disabled:opacity-50',
          isAnimating && 'scale-110',
          className,
        )}
        aria-label={isInWishlist ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
      >
        <Heart
          className={cn(
            'h-5 w-5 transition-all',
            isInWishlist
              ? 'fill-primary-pink text-primary-pink'
              : 'text-gray-400 group-hover:text-primary-pink',
          )}
        />
      </button>
    )
  }

  return (
    <Button
      variant={isInWishlist ? 'default' : 'outline'}
      size="sm"
      onClick={handleToggle}
      disabled={isLoading}
      className={cn(
        'gap-2 transition-all',
        isInWishlist && 'bg-red-500 hover:bg-red-600',
        isAnimating && 'scale-105',
        className,
      )}
    >
      <Heart
        className={cn(
          'h-4 w-4 transition-all',
          isInWishlist && 'fill-white text-white',
        )}
      />
      {isInWishlist ? 'Đã yêu thích' : 'Yêu thích'}
    </Button>
  )
}
