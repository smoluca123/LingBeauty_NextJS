'use client';
import { env } from '@/lib/env.config';
import ky from 'ky';

// Refresh token state management
// let refreshPromise: Promise<boolean> | null = null;

// async function refreshToken(): Promise<boolean> {
//   try {
//     const response = await fetch('/api/auth/refresh', { method: 'POST' });
//     return response.ok;
//   } catch {
//     return false;
//   }
// }

// async function handleTokenRefresh(): Promise<boolean> {
//   // If already refreshing, wait for the existing promise
//   if (refreshPromise) {
//     return refreshPromise;
//   }

//   refreshPromise = (async () => {
//     try {
//       return await refreshToken();
//     } finally {
//       refreshPromise = null;
//     }
//   })();

//   return refreshPromise;
// }

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
    afterResponse: [
      // async (
      //   request: KyRequest,
      //   options: NormalizedOptions,
      //   response: KyResponse,
      // ): Promise<KyResponse> => {
      //   // Handle 401 Unauthorized
      //   if (response.status === 401) {
      //     const refreshed = await handleTokenRefresh();
      //     if (refreshed) {
      //       // Retry the original request
      //       return ky(request, options);
      //     }
      //     // Refresh failed, clear auth state
      //     useAuthStore.getState().clearAuth();
      //   }
      //   return response;
      // },
    ],
  },
});
