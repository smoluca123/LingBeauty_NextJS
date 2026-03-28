'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Store, BookOpen, ShoppingBag } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { CartDrawer } from './cart-drawer'
import { UserButton } from './user-button'
import { useGetCartCountQuery } from '@/hooks/querys/cart.query'
import { WishlistIcon } from '@/components/wishlist'
import BadgeCount from '@/components/badge-count'

export function HeaderActions() {
  const [cartOpen, setCartOpen] = useState(false)

  // Cart badge count — only fetches when authenticated
  const { data: cartCountData } = useGetCartCountQuery()
  const cartItemCount = cartCountData?.data?.itemCount ?? 0

  return (
    <>
      <div className="flex items-center gap-2 md:gap-4">
        {/* Store link - Hide on mobile, show on tablet+ */}
        <Link
          href="/stores"
          className="hidden lg:flex items-center gap-2 text-sm hover:text-primary-pink transition-colors"
        >
          <Store className="h-4 w-4" />
          <span className="whitespace-nowrap">Hệ thống cửa hàng</span>
        </Link>

        {/* Magazine link - Hide on mobile, show on tablet+ */}
        <Link
          href="/magazine"
          className="hidden lg:flex items-center gap-2 text-sm hover:text-primary-pink transition-colors"
        >
          <BookOpen className="h-4 w-4" />
          <span className="whitespace-nowrap">Tạp chí làm đẹp</span>
        </Link>

        {/* Auth section */}
        <UserButton />

        {/* Wishlist - with item count badge */}
        <WishlistIcon />

        {/* Cart - with item count badge */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCartOpen(true)}
          className="relative"
          aria-label="Giỏ hàng"
        >
          <ShoppingBag className="h-4 w-4" />
          {cartItemCount > 0 && <BadgeCount count={cartItemCount} />}
        </Button>
      </div>

      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </>
  )
}
