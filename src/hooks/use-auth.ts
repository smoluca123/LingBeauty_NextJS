'use client';

import { useAuthContext } from '@/providers/auth-provider';

/**
 * Hook to access authentication state and actions.
 * Must be used within an AuthProvider.
 *
 * @returns {IAuthContextType} Auth state and actions
 * - user: Current user data or null
 * - isAuthenticated: Whether user is logged in
 * - isLoading: Whether auth state is being loaded
 * - login: Function to log in with credentials
 * - register: Function to register new account
 * - logout: Function to log out
 * - refreshAuth: Function to refresh auth state
 */
export function useAuth() {
  return useAuthContext();
}
