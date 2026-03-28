'use client'

import { useParams } from 'next/navigation'
import { useSharedWishlist } from '@/hooks/querys/wishlist.query'
import { Heart, Eye, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { Skeleton } from '@/components/ui/skeleton'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { ProductCard2 } from '@/components/product'
import InfiniteScrollContainer from '@/components/InfiniteScrollContainer'

export default function SharedWishlistPage() {
  const params = useParams()
  const shareToken = params.shareToken as string

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSharedWishlist(shareToken)

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="mb-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="mt-2 h-4 w-48" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    )
  }

  if (error || !data?.pages[0]?.data) {
    return (
      <div className="container py-16">
        <div className="mx-auto max-w-md text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-red-100 p-6">
              <Heart className="h-12 w-12 text-red-500" />
            </div>
          </div>
          <h2 className="mb-2 text-2xl font-semibold">
            Không tìm thấy danh sách
          </h2>
          <p className="mb-6 text-gray-600">
            Link chia sẻ không tồn tại hoặc đã hết hạn
          </p>
          <Link href="/products" className="text-primary-pink hover:underline">
            Khám phá sản phẩm
          </Link>
        </div>
      </div>
    )
  }

  const wishlist = data.pages[0].data
  const items = data.pages.flatMap((page) => page.data.items)

  return (
    <div className="container py-8">
      <div className="mb-6">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              {wishlist.title || 'Danh sách yêu thích được chia sẻ'}
            </h1>
            {wishlist.description && (
              <p className="mt-2 text-gray-600">{wishlist.description}</p>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Eye className="h-4 w-4" />
            <span>{wishlist.viewCount} lượt xem</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <div>
            <span className="font-medium">{wishlist.totalCount}</span> sản phẩm
          </div>
          {wishlist.expiresAt && (
            <div>
              Hết hạn:{' '}
              {format(new Date(wishlist.expiresAt), 'dd/MM/yyyy', {
                locale: vi,
              })}
            </div>
          )}
          <div>
            Chia sẻ lúc:{' '}
            {format(new Date(wishlist.createdAt), 'dd/MM/yyyy HH:mm', {
              locale: vi,
            })}
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-gray-600">Danh sách yêu thích trống</p>
        </div>
      ) : (
        <InfiniteScrollContainer
          onBottomReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage()
            }
          }}
        >
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <ProductCard2 product={item.product} key={item.id} />
            ))}
          </div>

          {isFetchingNextPage && (
            <div className="flex items-center justify-center gap-2 py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Đang tải thêm...</span>
            </div>
          )}
        </InfiniteScrollContainer>
      )}
    </div>
  )
}
