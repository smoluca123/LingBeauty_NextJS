'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';

interface AdminGuardProps {
  children: React.ReactNode;
}

/**
 * AdminGuard — Client-side role-based protection for admin routes.
 *
 * Flow:
 * 1. While auth is loading → show full-page spinner (avoid flicker).
 * 2. If not authenticated OR role is not "admin" → redirect to home.
 * 3. Otherwise → render children.
 *
 * Note: Token-level protection (no cookie → redirect) is handled
 * server-side in proxy.ts middleware, so this component only runs
 * for users who already have a valid session token.
 */
export function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);

  const isAdmin =
    isAuthenticated &&
    user?.roleAssignments?.some(
      (ra) => ra.role.name.toLowerCase() === 'admin'
    );

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated || !isAdmin) {
      router.replace('/');
    }
  }, [isLoading, isAuthenticated, isAdmin, router]);

  // Loading state — wait for auth store to hydrate
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
          <p className="text-sm text-muted-foreground">Đang xác thực...</p>
        </div>
      </div>
    );
  }

  // Not authorized — redirect happening, show nothing to avoid flicker
  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return <>{children}</>;
}
