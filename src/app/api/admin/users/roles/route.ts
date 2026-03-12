import { getAllUserRolesAPI } from '@/lib/apis/server/user-apis';
import { proxyRoute } from '@/lib/proxy-route';

export const GET = () => proxyRoute(() => getAllUserRolesAPI());
