'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Store, BookOpen, User, Heart, ShoppingBag } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { AuthModal } from '@/components/auth/auth-modal';
import { CartDrawer } from './cart-drawer';

export function HeaderActions() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

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

        {/* Login button - Show text on tablet+, icon only on mobile */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLoginOpen(true)}
          className="flex items-center gap-1 md:gap-2"
        >
          <User className="h-4 w-4" />
          <span className="hidden md:inline whitespace-nowrap">Đăng nhập</span>
        </Button>

        {/* Wishlist - Always icon only */}
        <Link
          href="/wishlist"
          className="flex items-center justify-center h-9 w-9 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
          aria-label="Yêu thích"
        >
          <Heart className="h-4 w-4" />
        </Link>

        {/* Cart - Always icon only */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCartOpen(true)}
          className="relative"
          aria-label="Giỏ hàng"
        >
          <ShoppingBag className="h-4 w-4" />
        </Button>
      </div>

      <AuthModal open={loginOpen} onOpenChange={setLoginOpen} />
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </>
  );
}
