import { getMyQuestionsAPI } from '@/lib/apis/server/product-question-apis';
import { proxyRoute } from '@/lib/proxy-route';
import type { IProductQuestionFilters, ProductQuestionStatus } from '@/lib/types/interfaces/apis/product-question.interfaces';

// GET /api/product-question/my-questions - Get my questions
export const GET = (req: Request) => {
  const { searchParams } = new URL(req.url);

  const params: IProductQuestionFilters = {};

  if (searchParams.has('page')) {
    params.page = Number(searchParams.get('page'));
  }
  if (searchParams.has('limit')) {
    params.limit = Number(searchParams.get('limit'));
  }
  if (searchParams.has('status') && searchParams.get('status')) {
    params.status = searchParams.get('status') as ProductQuestionStatus;
  }
  if (searchParams.has('sortBy') && searchParams.get('sortBy')) {
    params.sortBy = searchParams.get('sortBy') as 'createdAt' | 'updatedAt';
  }
  if (searchParams.has('order') && searchParams.get('order')) {
    params.order = searchParams.get('order') as 'asc' | 'desc';
  }

  return proxyRoute(() => getMyQuestionsAPI(params));
};
