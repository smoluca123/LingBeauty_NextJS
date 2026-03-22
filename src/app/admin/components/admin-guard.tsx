'use client';

import { useEffect } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { hasAdminRole } from '@/lib/utils';

interface AdminGuardProps {
  children: React.ReactNode;
}

/**
 * Client-side guard for admin routes.
 * Middleware handles the unauthenticated case (no token).
 * This guard handles the authorization case (wrong role).
 *
 * Renders nothing while auth is loading to prevent flash of admin UI.
 */
export function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);

  const isAuthorized = user !== null && hasAdminRole(user.roleAssignments);

  useEffect(() => {
    // Wait for auth to initialize before checking
    if (isLoading) return;

    if (!user) {
      router.replace('/login?redirect=/admin');
      return;
    }

    if (!isAuthorized) {
      // Authenticated but not an admin/manager — redirect to home
      notFound();
    }
  }, [isLoading, user, isAuthorized, router]);

  // Show nothing while loading or unauthorized to prevent UI flash
  if (isLoading || !isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
