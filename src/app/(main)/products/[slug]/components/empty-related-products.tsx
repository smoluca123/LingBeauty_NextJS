import { Package } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface EmptyRelatedProductsProps {
  title?: string;
  description?: string;
}

export function EmptyRelatedProducts({
  title = 'Chưa có sản phẩm liên quan',
  description = 'Hiện tại chưa có sản phẩm liên quan nào. Hãy khám phá các sản phẩm khác của chúng tôi.',
}: EmptyRelatedProductsProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-muted/30 px-6 py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <Package className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="mb-6 max-w-md text-sm text-muted-foreground">
        {description}
      </p>
      <Button asChild variant={'primary-pink'}>
        <Link href="/products">Khám phá sản phẩm</Link>
      </Button>
    </div>
  );
}
