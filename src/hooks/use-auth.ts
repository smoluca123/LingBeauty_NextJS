'use client';

import { useAuthStore } from '@/stores/auth.store';
import { kyNextInstance } from '@/lib/kyInstance/kyNext';
import type { IGetAuthResponse } from '@/lib/types/interfaces/apis/auth.interfaces';

/**
 * Hook to access authentication state from Zustand store.
 * Uses selectors to prevent unnecessary re-renders.
 *
 * For auth actions (login, register, logout), use the dedicated mutation hooks:
 * - useLoginMutation() from '@/hooks/mutations/auth.mutation'
 * - useRegisterMutation() from '@/hooks/mutations/auth.mutation'
 * - useLogoutMutation() from '@/hooks/mutations/auth.mutation'
 */
export function useAuthUser() {
  return useAuthStore((s) => s.user);
}

export function useIsAuthenticated() {
  return useAuthStore((s) => s.isAuthenticated);
}

export function useAuthLoading() {
  return useAuthStore((s) => s.isLoading);
}

/**
 * Refresh auth state by re-validating token via API route.
 * Returns a function that can be called to refresh.
 */
export function useRefreshAuth() {
  const setUser = useAuthStore((s) => s.setUser);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const refreshAuth = async () => {
    try {
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

  return refreshAuth;
}
