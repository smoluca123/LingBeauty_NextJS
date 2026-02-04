'use server';

import { env } from '@/lib/env.config';
import ky from 'ky';

/**
 * Public Ky instance for endpoints that don't require authentication
 * This instance does NOT inject cookies, making it compatible with 'use cache'
 * Use this for public data like products, categories, etc.
 */
export const publicKyInstance = ky.create({
  prefixUrl: env.NEXT_PUBLIC_API_URL,
  headers: {
    Authorization: `Bearer ${env.NEXT_PUBLIC_AUTHORIZATION_TOKEN}`,
  },
  parseJson: (text) => {
    return JSON.parse(text, (key, value) => {
      // Auto-convert fields ending with 'At' to Date objects
      if (key.endsWith('At')) return new Date(value);
      return value;
    });
  },
  // No hooks that access cookies - safe for 'use cache'
});
