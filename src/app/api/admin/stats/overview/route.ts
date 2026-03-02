import { getOverviewStatsAPI } from '@/lib/apis/server/stats-apis';
import { proxyRoute } from '@/lib/proxy-route';

export const GET = () => proxyRoute(() => getOverviewStatsAPI());
