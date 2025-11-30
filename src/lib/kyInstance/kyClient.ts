'use client';
import { env } from '@/lib/env.config';
import ky from 'ky';

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
    // beforeRequest: [
    //   async (request) => {
    //     const accessToken = await kyNextInstance.get('auth/auth-cookie').json<{
    //       accessToken: string | undefined;
    //       userId: string | undefined;
    //     }>();
    //     if (accessToken.accessToken) {
    //       request.headers.set('accessToken', accessToken.accessToken);
    //     }
    //   },
    // ],
  },
});
