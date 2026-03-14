'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Store,
  BookOpen,
  User,
  Heart,
  ShoppingBag,
  LogOut,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { AuthModal } from '@/components/auth/auth-modal';
import { CartDrawer } from './cart-drawer';
import {
  useAuthUser,
  useIsAuthenticated,
  useAuthLoading,
} from '@/hooks/use-auth';
import { useLogoutMutation } from '@/hooks/mutations/auth.mutation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useGetCartCountQuery } from '@/hooks/querys/cart.query';

export function HeaderActions() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const user = useAuthUser();
  const isAuthenticated = useIsAuthenticated();
  const isLoading = useAuthLoading();
  const logoutMutation = useLogoutMutation();

  // Cart badge count — only fetches when authenticated
  const { data: cartCountData } = useGetCartCountQuery();
  const cartItemCount = cartCountData?.data?.itemCount ?? 0;

  const handleLogout = async () => {
    logoutMutation.mutate();
  };

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
        {isLoading ? (
          <div className="h-9 w-20 bg-muted animate-pulse rounded-md" />
        ) : isAuthenticated && user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1 md:gap-2"
              >
                <User className="h-4 w-4" />
                <span className="hidden md:inline whitespace-nowrap max-w-24 truncate">
                  {user.firstName || user.username}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link href="/profile" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Tài khoản
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/orders" className="cursor-pointer">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Đơn hàng
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer text-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLoginOpen(true)}
            className="flex items-center gap-1 md:gap-2"
          >
            <User className="h-4 w-4" />
            <span className="hidden md:inline whitespace-nowrap">
              Đăng nhập
            </span>
          </Button>
        )}

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

      <AuthModal open={loginOpen} onOpenChange={setLoginOpen} />
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </>
  );
}
