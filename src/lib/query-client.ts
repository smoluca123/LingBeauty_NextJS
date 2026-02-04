import { QueryClient } from '@tanstack/react-query';
import { cache } from 'react';

// React.cache() đảm bảo reuse QueryClient trong cùng 1 request
export const getQueryClient = cache(
  () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 5 * 60 * 1000, // 5 minute
        },
      },
    }),
);
