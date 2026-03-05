'use client';

import { getCartAPI, getCartCountAPI } from '@/lib/apis/client/cart.apis';
import { useIsAuthenticated } from '@/hooks/use-auth';
import { useQuery } from '@tanstack/react-query';

/** Query key factory for cart queries */
export const cartQueryKeys = {
  all: ['cart'] as const,
  detail: () => [...cartQueryKeys.all, 'detail'] as const,
  count: () => [...cartQueryKeys.all, 'count'] as const,
};

/**
 * Fetch the full cart with all items.
 * Only runs when the user is authenticated.
 */
export const useGetCartQuery = () => {
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    queryKey: cartQueryKeys.detail(),
    queryFn: () => getCartAPI(),
    enabled: isAuthenticated,
    staleTime: 1000 * 30, // 30 seconds — cart changes frequently
  });
};

/**
 * Fetch lightweight cart count for the header badge.
 * Only runs when the user is authenticated.
 */
export const useGetCartCountQuery = () => {
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    queryKey: cartQueryKeys.count(),
    queryFn: () => getCartCountAPI(),
    enabled: isAuthenticated,
    staleTime: 1000 * 30,
  });
};
