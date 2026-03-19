'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Store, BookOpen, Heart, ShoppingBag } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { CartDrawer } from './cart-drawer';
import { UserButton } from './user-button';
import { useGetCartCountQuery } from '@/hooks/querys/cart.query';

export function HeaderActions() {
  const [cartOpen, setCartOpen] = useState(false);

  // Cart badge count — only fetches when authenticated
  const { data: cartCountData } = useGetCartCountQuery();
  const cartItemCount = cartCountData?.data?.itemCount ?? 0;

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

        {/* Wishlist - Always icon only */}
        <Link
          href="/wishlist"
          className="flex items-center justify-center h-9 w-9 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
          aria-label="Yêu thích"
        >
          <Heart className="h-4 w-4" />
        </Link>

        {/* Cart - with item count badge */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCartOpen(true)}
          className="relative"
          aria-label="Giỏ hàng"
        >
          <ShoppingBag className="h-4 w-4" />
          {cartItemCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary-pink text-[10px] font-bold text-white leading-none">
              {cartItemCount > 99 ? '99+' : cartItemCount}
            </span>
          )}
        </Button>
      </div>

      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </>
  );
}
