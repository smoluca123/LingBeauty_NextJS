import { getAllUsersAPI, createUserByAdminAPI } from '@/lib/apis/server/user-apis';
import { proxyRoute } from '@/lib/proxy-route';
import type { IUserFilters } from '@/lib/types/interfaces/apis/admin-user.interfaces';

// GET /api/admin/users
export const GET = (req: Request) => {
  const { searchParams } = new URL(req.url);

  const params: IUserFilters = {
    page: searchParams.get('page')
      ? Number(searchParams.get('page'))
      : undefined,
    limit: searchParams.get('limit')
      ? Number(searchParams.get('limit'))
      : undefined,
    search: searchParams.get('search') ?? undefined,
    isActive: searchParams.has('isActive')
      ? searchParams.get('isActive') === 'true'
      : undefined,
    isBanned: searchParams.has('isBanned')
      ? searchParams.get('isBanned') === 'true'
      : undefined,
    isVerified: searchParams.has('isVerified')
      ? searchParams.get('isVerified') === 'true'
      : undefined,
    sortBy: (searchParams.get('sortBy') as IUserFilters['sortBy']) ?? undefined,
    order: (searchParams.get('order') as IUserFilters['order']) ?? undefined,
  };

  return proxyRoute(() => getAllUsersAPI(params));
};

// POST /api/admin/users
export const POST = async (req: Request) => {
  const body = await req.json();
  return proxyRoute(() => createUserByAdminAPI(body));
};
