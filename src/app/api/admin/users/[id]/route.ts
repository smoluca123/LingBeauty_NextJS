import { updateUserByAdminAPI } from '@/lib/apis/server/user-apis';
import { proxyRoute } from '@/lib/proxy-route';

// PATCH /api/admin/users/[id]
export const PATCH = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;
  const body = await req.json();
  return proxyRoute(() => updateUserByAdminAPI(id, body));
};
