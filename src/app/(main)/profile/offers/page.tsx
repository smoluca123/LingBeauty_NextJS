import { Suspense } from 'react';
import { OffersContent } from '../components';

export default function OffersPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">Ưu đãi của tôi</h1>
      <Suspense
        fallback={<div className="text-muted-foreground">Đang tải...</div>}
      >
        <OffersContent />
      </Suspense>
    </div>
  );
}
