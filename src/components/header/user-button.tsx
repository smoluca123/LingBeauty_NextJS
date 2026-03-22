'use client';

import { useState } from 'react';
import Link from 'next/link';
import { User, ShoppingBag, LogOut, LayoutDashboard } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { AuthModal } from '@/components/auth/auth-modal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  useAuthUser,
  useIsAuthenticated,
  useAuthLoading,
} from '@/hooks/use-auth';
import { useLogoutMutation } from '@/hooks/mutations/auth.mutation';
import { hasAdminRole } from '@/lib/utils';

export function UserButton() {
  const [loginOpen, setLoginOpen] = useState(false);
  const user = useAuthUser();
  const isAuthenticated = useIsAuthenticated();
  const isLoading = useAuthLoading();
  const logoutMutation = useLogoutMutation();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const isAdmin = user !== null && hasAdminRole(user?.roleAssignments as { role: { name: string } }[]);

  if (isLoading) {
    return <div className="h-9 w-20 bg-muted animate-pulse rounded-md" />;
  }

  if (isAuthenticated && user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 md:gap-2"
          >
            <User className="h-4 w-4" />
            <span className="hidden md:inline whitespace-nowrap max-w-32 truncate">
              {user.firstName || user.username}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
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
          
          {isAdmin && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/admin" className="cursor-pointer text-primary-pink focus:text-primary-pink focus:bg-primary-pink/10">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Quản trị viên
                </Link>
              </DropdownMenuItem>
            </>
          )}

          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Đăng xuất
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setLoginOpen(true)}
        className="flex items-center gap-1 md:gap-2"
      >
        <User className="h-4 w-4" />
        <span className="hidden md:inline whitespace-nowrap">Đăng nhập</span>
      </Button>
      <AuthModal open={loginOpen} onOpenChange={setLoginOpen} />
    </>
  );
}
