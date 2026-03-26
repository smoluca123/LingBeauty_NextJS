import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

import { AddressesContent } from '@/app/(main)/profile/components';

export default function AddressesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">
        Địa chỉ giao nhận
      </h1>
      <Suspense
        fallback={
          <div className="flex items-center justify-center">
            <Loader2 className="animate-spin text-primary-pink" />
          </div>
        }
      >
        <AddressesContent />
      </Suspense>
    </div>
  );
}
