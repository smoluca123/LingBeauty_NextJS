import { syncDailyStatsAPI } from '@/lib/apis/server/stats-apis';
import { proxyRoute } from '@/lib/proxy-route';

export const POST = () => proxyRoute(() => syncDailyStatsAPI());
