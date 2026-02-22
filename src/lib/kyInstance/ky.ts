'use server';
import { env } from '@/lib/env.config';
import ky from 'ky';
import { cookies } from 'next/headers';

// Token refresh queue to prevent race conditions
let refreshPromise: Promise<{ accessToken: string }> | null = null;

async function refreshTokenOnce(
  currentAccessToken: string,
): Promise<{ accessToken: string }> {
  // If already refreshing, reuse the existing promise
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const res = await ky
        .post(`${env.NEXT_PUBLIC_API_URL}auth/refresh-token`, {
          json: { accessToken: currentAccessToken },
          headers: {
            Authorization: `Bearer ${env.NEXT_PUBLIC_AUTHORIZATION_TOKEN}`,
            accessToken: currentAccessToken,
          },
        })
        .json<{
          data: { accessToken: string; user: { id: string } };
        }>();

      // Update cookie with new token
      const cookieStore = await cookies();
      cookieStore.set('accessToken', res.data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });

      return { accessToken: res.data.accessToken };
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export const kyInstance = ky.create({
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
      async (request) => {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('accessToken');

        if (accessToken) {
          request.headers.set('accessToken', accessToken.value);
        }
      },
    ],
    afterResponse: [
      async (request, _options, response) => {
        if (response.ok) {
          return response;
        }

        if (response.status === 401) {
          const cookieStore = await cookies();
          const accessToken = cookieStore.get('accessToken')?.value;

          if (!accessToken) {
            return response;
          }

          try {
            const refreshed = await refreshTokenOnce(accessToken);
            request.headers.set('accessToken', refreshed.accessToken);

            // Retry the original request with new token
            const newRequest = new Request(request, {
              headers: request.headers,
            });
            return ky(newRequest);
          } catch {
            cookieStore.delete('accessToken');
            return response;
          }
        }

        return response;
      },
    ],
  },
});
