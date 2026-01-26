'use client';
import { env } from '@/lib/env.config';
import { useAuthStore } from '@/stores/auth.store';
import ky, {
  type KyRequest,
  type KyResponse,
  type NormalizedOptions,
} from 'ky';

// Refresh token state management
let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

async function refreshToken(): Promise<boolean> {
  try {
    const response = await fetch('/api/auth/refresh', { method: 'POST' });
    return response.ok;
  } catch {
    return false;
  }
}

async function handleTokenRefresh(): Promise<boolean> {
  // If already refreshing, wait for the existing promise
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = refreshToken();

  try {
    const result = await refreshPromise;
    return result;
  } finally {
    isRefreshing = false;
    refreshPromise = null;
  }
}

export const kyClientInstance = ky.create({
  prefixUrl: env.NEXT_PUBLIC_API_URL,
  headers: {
    Authorization: `Bearer ${env.NEXT_PUBLIC_AUTHORIZATION_TOKEN}`,
  },
  parseJson: (text) => {
    return JSON.parse(text, (key, value) => {
      if (key.endsWith('At')) return new Date(value);
      return value;
    });
  },
  hooks: {
    beforeRequest: [
      async () => {
        // Get access token from cookie via API route
        // The server-side API routes handle token management
        // This hook is here for future enhancements like proactive refresh
      },
    ],
    afterResponse: [
      async (
        request: KyRequest,
        options: NormalizedOptions,
        response: KyResponse
      ): Promise<KyResponse> => {
        // Handle 401 Unauthorized
        if (response.status === 401) {
          const refreshed = await handleTokenRefresh();

          if (refreshed) {
            // Retry the original request
            return ky(request, options);
          }

          // Refresh failed, clear auth state
          // This will be handled by the auth provider
          useAuthStore.getState().clearAuth();
        }

        return response;
      },
    ],
  },
});
