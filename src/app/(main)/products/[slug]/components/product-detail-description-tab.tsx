
import { IProductDataType } from '@/lib/types/interfaces/apis/product.interfaces';
import parse from 'html-react-parser';
import DOMPurify from 'isomorphic-dompurify';

interface ProductDetailDescriptionTabProps {
  product: IProductDataType;
}

export async function ProductDetailDescriptionTab({
  product,
}: ProductDetailDescriptionTabProps) {
  const sanitize = (html: string) => {
    return DOMPurify.sanitize(html);
    // return html;
  };
  if (!product.description && !product.shortDesc) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-muted-foreground text-sm">
          Chưa có mô tả cho sản phẩm này.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {product.shortDesc && (
        <p className="text-base font-medium text-foreground">
          {product.shortDesc}
        </p>
      )}
      {product.description && (
        <article className="prose prose-sm max-w-none text-muted-foreground tiptap">
          {parse(sanitize(product.description))}
        </article>
      )}
    </div>
  );
}
