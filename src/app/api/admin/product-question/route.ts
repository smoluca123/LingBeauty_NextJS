import { type NextRequest } from 'next/server';
import { proxyRoute } from '@/lib/proxy-route';
import { getAllAdminQuestionsAPI } from '@/lib/apis/server/admin-product-question-apis';
import type {
  IProductQuestionFilters,
  ProductQuestionStatus,
} from '@/lib/types/interfaces/apis/product-question.interfaces';

// GET /api/admin/product-question - Get all questions with filters
export const GET = (req: NextRequest) => {
  const { searchParams } = new URL(req.url);

  const params: IProductQuestionFilters = {
    page: searchParams.has('page')
      ? Number(searchParams.get('page'))
      : undefined,
    limit: searchParams.has('limit')
      ? Number(searchParams.get('limit'))
      : undefined,
    productId: searchParams.get('productId') ?? undefined,
    userId: searchParams.get('userId') ?? undefined,
    status: (searchParams.get('status') as ProductQuestionStatus) ?? undefined,
    sortBy:
      (searchParams.get('sortBy') as IProductQuestionFilters['sortBy']) ??
      undefined,
    order:
      (searchParams.get('order') as IProductQuestionFilters['order']) ??
      undefined,
  };

  return proxyRoute(() => getAllAdminQuestionsAPI(params));
};
