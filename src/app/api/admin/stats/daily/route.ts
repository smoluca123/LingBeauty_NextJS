import {
  getDailyStatsAPI,
  type IDailyStatsParams,
} from '@/lib/apis/server/stats-apis';
import { proxyRoute } from '@/lib/proxy-route';

export const GET = (request: Request) => {
  const { searchParams } = new URL(request.url);

  const params: IDailyStatsParams = {
    startDate: searchParams.get('startDate') ?? undefined,
    endDate: searchParams.get('endDate') ?? undefined,
  };

  return proxyRoute(() => getDailyStatsAPI(params));
};
