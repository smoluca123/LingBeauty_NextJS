import { proxyRoute } from '@/lib/proxy-route';
import { deleteReplyAPI } from '@/lib/apis/server/admin-review-apis';

// DELETE /api/admin/reviews/reply/[replyId] - Delete reply
export const DELETE = (
  _req: Request,
  { params }: { params: Promise<{ replyId: string }> },
) => {
  return proxyRoute(async () => {
    const { replyId } = await params;
    return deleteReplyAPI(replyId);
  });
};
