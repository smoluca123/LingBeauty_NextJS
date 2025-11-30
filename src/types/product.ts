export type Product = {
  id: string;
  name: string;
  brand: string;
  image: string;
  price: number;
  originalPrice?: number;
  rankLabel?: string;
  dealLabel?: string;
  badges?: {
    label: string;
    variant?: 'primary' | 'info' | 'neutral';
  }[];
  rating?: number;
  reviewCount?: number;
  variants?: Variant[];
};

export type Variant = {
  id: string;
  name: string;
  thumbnail?: string;
  color?: string;
};
