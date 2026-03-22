import { getQuestionByIdAPI } from "@/lib/apis/server/product-question-apis";
import {
  deleteQuestionAction,
  updateQuestionAction,
} from "@/lib/apis/server/actions/product-question.actions";
import { proxyRoute } from "@/lib/proxy-route";

// GET /api/product-question/[id] - Get question by ID
export const GET = async (
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;
  return proxyRoute(() => getQuestionByIdAPI(id));
};

// PATCH /api/product-question/[id] - Update question
export const PATCH = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;
  const body = await req.json();
  return proxyRoute(() => updateQuestionAction(id, body));
};

// DELETE /api/product-question/[id] - Delete question
export const DELETE = async (
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;
  return proxyRoute(() => deleteQuestionAction(id));
};
