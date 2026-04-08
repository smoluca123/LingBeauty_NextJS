'use client'

import { useWishlist } from '@/hooks/querys/wishlist.query'
import { useClearWishlist } from '@/hooks/mutations/wishlist.mutation'
import { Button } from '@/components/ui/button'
import { Heart, Trash2, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { Skeleton } from '@/components/ui/skeleton'
import type { IWishlistItemType } from '@/lib/types/interfaces/apis/wishlist.interfaces'
import { ShareWishlistDialog } from '@/components/wishlist/share-wishlist-dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { ProductCard2 } from '@/components/product'
import InfiniteScrollContainer from '@/components/InfiniteScrollContainer'

export default function WishlistPage() {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useWishlist()
  const clearWishlist = useClearWishlist()

  const wishlistItems = data?.pages.flatMap((page) => page.data.items) || []
  const totalCount = data?.pages[0]?.data.totalCount || 0

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

  if (wishlistItems.length === 0) {
    return (
      <div className="container py-16">
        <div className="mx-auto max-w-md text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-gray-100 p-6">
              <Heart className="h-12 w-12 text-primary-pink" />
            </div>
          </div>
          <h2 className="mb-2 text-2xl font-semibold">
            Danh sách yêu thích trống
          </h2>
          <p className="mb-6 text-gray-600">
            Bạn chưa có sản phẩm nào trong danh sách yêu thích
          </p>
          <Link href="/products">
            <Button variant={'primary-pink'}>Khám phá sản phẩm</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="mb-6  flex md:flex-row flex-col items-center justify-center md:justify-between">
        <div className="text-center md:text-left">
          <h1 className="text-2xl font-bold">Danh sách yêu thích</h1>
          <p className="text-gray-600">{totalCount} sản phẩm</p>
        </div>
        {totalCount > 0 && (
          <div className="flex gap-2">
            <ShareWishlistDialog />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Trash2 className="h-4 w-4" />
                  Xóa tất cả
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Xóa toàn bộ danh sách?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Bạn có chắc chắn muốn xóa tất cả sản phẩm khỏi danh sách yêu
                    thích? Hành động này không thể hoàn tác.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => clearWishlist.mutate()}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    Xóa tất cả
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>

      <InfiniteScrollContainer
        onBottomReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage()
          }
        }}
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
          {wishlistItems.map((item: IWishlistItemType) => (
            <ProductCard2 key={item.id} product={item.product} showAddToCart />
          ))}
        </div>

        {isFetchingNextPage && (
          <div className="flex items-center justify-center gap-2 py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Đang tải thêm...</span>
          </div>
        )}
      </InfiniteScrollContainer>
    </div>
  )
}
