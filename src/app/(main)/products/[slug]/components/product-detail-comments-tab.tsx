import { MessageCircle, Smile } from 'lucide-react';

// Placeholder UI for comments tab (data will be implemented later)
export function ProductDetailCommentsTab() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <MessageCircle className="h-5 w-5 text-primary-pink" />
        <h3 className="font-semibold text-foreground">Hỏi & Đáp</h3>
      </div>

      {/* Empty state */}
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed bg-muted/30 py-14 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-pink/10">
          <Smile className="h-6 w-6 text-primary-pink" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">
            Chưa có câu hỏi nào
          </p>
          <p className="max-w-xs text-xs text-muted-foreground">
            Bạn có thắc mắc về sản phẩm? Hãy đặt câu hỏi, chúng tôi sẽ phản
            hồi sớm nhất có thể.
          </p>
        </div>
        <button className="rounded-full border border-primary-pink px-6 py-2 text-sm font-semibold text-primary-pink transition-colors hover:bg-primary-pink/10">
          Đặt câu hỏi
        </button>
      </div>
    </div>
  );
}
