'use client';

import { useEffect, PropsWithChildren } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { kyNextInstance } from '@/lib/kyInstance/kyNext';
import { EmailVerificationModal } from '@/components/auth/email-verification-modal';
import type { IGetAuthResponse } from '@/lib/types/interfaces/apis/auth.interfaces';

/**
 * AuthProvider handles:
 * 1. Initialize auth state on mount (validate token via API route)
 * 2. Show email verification modal when user is not verified
 *
 * No Context needed - auth state lives in Zustand store.
 * Auth actions (login, register, logout) are in auth.mutation.ts hooks.
 */
export function AuthProvider({ children }: PropsWithChildren) {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setUser = useAuthStore((s) => s.setUser);
  const setLoading = useAuthStore((s) => s.setLoading);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  // Initialize auth state on mount via API route (not Server Action)
  useEffect(() => {
    const initAuth = async () => {
      try {
        setLoading(true);
        const data = await kyNextInstance
          .get('auth/validate-token')
          .json<IGetAuthResponse>();

        if (data.isAuthenticated && data.user) {
          setUser(data.user);
        } else {
          clearAuth();
        }
      } catch {
        clearAuth();
      }
    };

    initAuth();
  }, [setUser, setLoading, clearAuth]);

  // Derive verification modal visibility directly from auth state
  const showVerificationModal =
    isAuthenticated && user !== null && !user.isEmailVerified;

  return (
    <>
      {children}
      {user && (
        <EmailVerificationModal
          open={showVerificationModal}
          onOpenChange={() => {
            // Modal can only be dismissed by verifying email
          }}
          userEmail={user.email}
          onVerificationSuccess={() => {
            // Auth state will be refreshed by useEmailVerification hook
          }}
        />
      )}
    </>
  );
}
