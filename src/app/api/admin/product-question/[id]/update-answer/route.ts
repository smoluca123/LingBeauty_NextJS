import { proxyRoute } from '@/lib/proxy-route';
import { updateAnswerAPI } from '@/lib/apis/server/admin-product-question-apis';
import type { IAnswerQuestionPayload } from '@/lib/types/interfaces/apis/product-question.interfaces';

// PATCH /api/admin/product-question/[id]/update-answer - Update an answer
export const PATCH = (
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  return proxyRoute(async () => {
    const { id } = await params;
    const body = (await req.json()) as IAnswerQuestionPayload;
    return updateAnswerAPI(id, body);
  });
};
