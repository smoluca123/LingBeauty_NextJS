import {
  getTopProductsAPI,
  type ITopProductsParams,
} from '@/lib/apis/server/stats-apis';
import { proxyRoute } from '@/lib/proxy-route';

export const GET = (request: Request) => {
  const { searchParams } = new URL(request.url);

  const params: ITopProductsParams = {
    limit: searchParams.has('limit')
      ? Number(searchParams.get('limit'))
      : undefined,
  };

  return proxyRoute(() => getTopProductsAPI(params));
};
