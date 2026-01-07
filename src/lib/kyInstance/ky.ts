'use server';
import { refreshAccessTokenApi } from '@/lib/apis/server/user-apis';
import { env } from '@/lib/env.config';
import ky from 'ky';
import { cookies } from 'next/headers';

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
        // Use cookie directly instead of validateAuth for every request
        // This avoids repeated validation calls
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('accessToken');

        if (accessToken) {
          request.headers.set('accessToken', accessToken.value);
        }
        // Only call validateAuth if we're making a request that needs full user info
        // or we need to validate the token's authenticity
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        console.log('afterResponse hook triggered', response.status);
        // Return early if the response is ok
        if (response.ok) {
          console.log('Response is OK');
          return response;
        }
        if (response.status === 401) {
          console.log('401 Unauthorized detected, attempting to refresh token');
          const cookieStore = await cookies();
          const accessToken = cookieStore.get('accessToken')?.value;
          if (!accessToken) {
            console.log('No access token found in cookies');
            return response;
          }
          try {
            console.log('Attempting to refresh token', accessToken);
            const res = await refreshAccessTokenApi({
              accessToken,
            });
            console.log('Token refresh successful');
            request.headers.set('accessToken', res.data.accessToken);
            cookieStore.set('accessToken', res.data.accessToken);
            // Create a new request with the updated token and retry
            const newRequest = new Request(request, {
              headers: request.headers,
            });
            console.log('Retrying request with new token');
            return ky(newRequest);
          } catch (error) {
            console.error('Token refresh failed:', error);
            cookieStore.delete('accessToken');
            return response;
          }
        }
        // Return the response for other status codes
        console.log(`Non-401 error: ${response.status}`);
        return response;
      },
    ],
  },
});
