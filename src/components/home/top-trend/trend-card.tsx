import Image from 'next/image';
import type { TrendProduct } from './data';
import { Button } from '@/components/ui/button';

type TrendCardProps = {
  product: TrendProduct;
};

export function TrendCard({ product }: TrendCardProps) {
  return (
    <div
      className="group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer hover:-translate-y-2"
      style={{ background: product.backgroundColor }}
    >
      {/* Product Content */}
      <div className="relative aspect-3/4 p-6 flex flex-col">
        {/* Brand Title */}
        <div className="mb-3 text-center">
          <h3 className="text-xl md:text-2xl font-bold text-foreground mb-1.5 uppercase tracking-wide">
            {product.title}
          </h3>
          <p className="text-[10px] md:text-xs font-medium text-foreground/70 leading-relaxed uppercase tracking-wider">
            {product.subtitle}
          </p>
        </div>

        {/* Product Image */}
        <div className="flex-1 relative my-3">
          <div className="relative w-full h-full transition-transform duration-700 group-hover:scale-105">
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-contain drop-shadow-2xl"
              loading="lazy"
            />
          </div>
        </div>

        {/* View Now Button */}
        <div className="mt-auto pt-2">
          <Button className="w-full bg-primary-pink/80 text-white font-bold text-xs md:text-sm py-3 px-6 rounded-full transition-all duration-300 hover:shadow-xl uppercase tracking-wider hover:bg-white hover:text-primary-pink border-2 border-primary-pink/80 hover:border-primary-pink cursor-pointer">
            {product.buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
}
