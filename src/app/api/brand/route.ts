import { getBrandsAPI } from '@/lib/apis/server/brand-apis';
import { proxyRoute } from '@/lib/proxy-route';

export const GET = (request: Request) => {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get('limit');
  const page = searchParams.get('page');
  return proxyRoute(() =>
    getBrandsAPI({
      limit: limit ? Number(limit) : undefined,
      page: page ? Number(page) : undefined,
    }),
  );
};
