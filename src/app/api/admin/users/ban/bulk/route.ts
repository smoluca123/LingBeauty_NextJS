import { banUserBulkAPI } from '@/lib/apis/server/user-apis';
import { proxyRoute } from '@/lib/proxy-route';
import { NextRequest } from 'next/server';

// PATCH /api/admin/users/ban/bulk
export const PATCH = async (req: NextRequest) => {
  const body = await req.json();
  return proxyRoute(() => banUserBulkAPI(body.items));
};
