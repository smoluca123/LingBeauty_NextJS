import {
  getRevenueChartAPI,
  type IRevenueChartParams,
} from '@/lib/apis/server/stats-apis';
import { proxyRoute } from '@/lib/proxy-route';
import type { StatsPeriod } from '@/lib/types/interfaces/apis/stats.interfaces';

export const GET = (request: Request) => {
  const { searchParams } = new URL(request.url);

  const params: IRevenueChartParams = {
    period: (searchParams.get('period') as StatsPeriod) ?? undefined,
    startDate: searchParams.get('startDate') ?? undefined,
    endDate: searchParams.get('endDate') ?? undefined,
  };

  return proxyRoute(() => getRevenueChartAPI(params));
};
