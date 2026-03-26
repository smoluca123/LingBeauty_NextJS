import { proxyRoute } from '@/lib/proxy-route';
import {
  getAdminQuestionByIdAPI,
  deleteQuestionByAdminAPI,
} from '@/lib/apis/server/admin-product-question-apis';

// GET /api/admin/product-question/[id] - Get question by ID
export const GET = (
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  return proxyRoute(async () => {
    const { id } = await params;
    return getAdminQuestionByIdAPI(id);
  });
};

// DELETE /api/admin/product-question/[id] - Delete question
export const DELETE = (
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  return proxyRoute(async () => {
    const { id } = await params;
    return deleteQuestionByAdminAPI(id);
  });
};
