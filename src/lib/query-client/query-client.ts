import { GC_TIME, STALE_TIME } from '@/constants/cache';
import { QueryClient } from '@tanstack/react-query';
import { cache } from 'react';

export const queryClient = cache(
  () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: STALE_TIME,
          gcTime: GC_TIME,
        },
      },
    }),
);
