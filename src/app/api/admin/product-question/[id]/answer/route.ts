import { proxyRoute } from '@/lib/proxy-route';
import {
  answerQuestionAPI,
  deleteAnswerAPI,
} from '@/lib/apis/server/admin-product-question-apis';
import type { IAnswerQuestionPayload } from '@/lib/types/interfaces/apis/product-question.interfaces';

// PATCH /api/admin/product-question/[id]/answer - Answer a question
export const PATCH = (
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  return proxyRoute(async () => {
    const { id } = await params;
    const body = (await req.json()) as IAnswerQuestionPayload;
    return answerQuestionAPI(id, body);
  });
};

// DELETE /api/admin/product-question/[id]/answer - Delete an answer
export const DELETE = (
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  return proxyRoute(async () => {
    const { id } = await params;
    return deleteAnswerAPI(id);
  });
};
