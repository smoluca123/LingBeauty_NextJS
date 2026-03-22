import { answerQuestionAction } from '@/lib/apis/server/actions/product-question.actions';
import { proxyRoute } from '@/lib/proxy-route';
import type { IAnswerQuestionPayload } from '@/lib/types/interfaces/apis/product-question.interfaces';

// PATCH /api/product-question/[id]/answer - Answer question (Admin)
export const PATCH = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;
  const body = (await req.json()) as IAnswerQuestionPayload;
  return proxyRoute(() => answerQuestionAction(id, body));
};
