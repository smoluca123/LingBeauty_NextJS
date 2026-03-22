import { getPublicProductQuestionsAPI } from '@/lib/apis/server/product-question-apis';
import { proxyRoute } from '@/lib/proxy-route';
import type { IProductQuestionFilters, ProductQuestionStatus } from '@/lib/types/interfaces/apis/product-question.interfaces';

// GET /api/product-question/public/product/[productId] - Get public product questions
export const GET = async (
  req: Request,
  { params }: { params: Promise<{ productId: string }> },
) => {
  const { productId } = await params;
  const { searchParams } = new URL(req.url);

  const filters: IProductQuestionFilters = {};

  if (searchParams.has('page')) {
    filters.page = Number(searchParams.get('page'));
  }
  if (searchParams.has('limit')) {
    filters.limit = Number(searchParams.get('limit'));
  }
  if (searchParams.has('status') && searchParams.get('status')) {
    filters.status = searchParams.get('status') as ProductQuestionStatus;
  }
  if (searchParams.has('sortBy') && searchParams.get('sortBy')) {
    filters.sortBy = searchParams.get('sortBy') as 'createdAt' | 'updatedAt';
  }
  if (searchParams.has('order') && searchParams.get('order')) {
    filters.order = searchParams.get('order') as 'asc' | 'desc';
  }

  return proxyRoute(() =>
    getPublicProductQuestionsAPI(productId, filters),
  );
};
