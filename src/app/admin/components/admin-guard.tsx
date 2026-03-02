'use client';

import { useEffect } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';

// Roles allowed to access admin panel
const ADMIN_ROLES = ['Quản trị viên', 'Quản lý'] as const;
type AdminRole = (typeof ADMIN_ROLES)[number];

function hasAdminRole(roleAssignments?: { role: { name: string } }[]): boolean {
  if (!roleAssignments || roleAssignments.length === 0) return false;
  return roleAssignments.some((ra) =>
    (ADMIN_ROLES as readonly AdminRole[]).includes(ra.role.name as AdminRole),
  );
}

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
