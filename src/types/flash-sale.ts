export type FlashSaleStatus = 'UPCOMING' | 'ACTIVE' | 'ENDED' | 'CANCELLED';

export interface FlashSale {
  id: string;
  name: string;
  slug: string;
  banner?: string;
  startTime: string;
  endTime: string;
  status: FlashSaleStatus;
  products: FlashSaleProduct[];
}

export interface FlashSaleProduct {
  id: string;
  productId: string;
  variantId?: string;
  flashPrice: number;
  originalPrice: number;
  maxQuantity: number;
  soldQuantity: number;
  limitPerOrder: number;
  product: {
    id: string;
    name: string;
    slug: string;
    image: string;
    brand: {
      name: string;
    };
    rating?: number;
    reviewCount?: number;
  };
  badges?: ProductBadge[];
}

export interface ProductBadge {
  label: string;
  variant: 'freeship' | 'hot' | 'new' | 'gift';
}

export interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}
