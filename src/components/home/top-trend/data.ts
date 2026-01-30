export type TrendCategory = {
  id: string;
  label: string;
};

export type TrendProduct = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  backgroundColor: string;
  buttonText: string;
  categories: string[];
};

export const trendCategories: TrendCategory[] = [
  { id: 'all', label: 'Tất cả' },
  { id: 'son-peripera', label: 'son peripera' },
  { id: 'cushion-clio', label: 'cushion clio' },
  { id: 'mat-na', label: 'mặt nạ' },
  { id: 'sua-rua-mat', label: 'sữa rửa mặt' },
  { id: 'kem-chong-nang', label: 'kem chống nắng' },
];

export const trendProducts: TrendProduct[] = [
  {
    id: 'miffy',
    title: 'MIFFY',
    subtitle: 'Thỏ Chanh - BEAUTY 8 X',
    image: '/assets/images/trends/miffy.png',
    backgroundColor: 'linear-gradient(135deg, #4FC3F7 0%, #29B6F6 100%)',
    buttonText: 'XEM NGAY',
    categories: ['all', 'mat-na'],
  },
  {
    id: 'goodal',
    title: 'goodal',
    subtitle: 'HOUTTUYNIA CORDATA HYALURONIC ACID',
    image: '/assets/images/trends/goodal.png',
    backgroundColor: 'linear-gradient(135deg, #A7E9E3 0%, #7DD8CF 100%)',
    buttonText: 'XEM NGAY',
    categories: ['all', 'sua-rua-mat'],
  },
  {
    id: 'amuse',
    title: 'AMUSE',
    subtitle: 'AMUSE LIP TINT',
    image: '/assets/images/trends/amuse.png',
    backgroundColor: 'linear-gradient(135deg, #FFB5D8 0%, #FF9AC5 100%)',
    buttonText: 'XEM NGAY',
    categories: ['all', 'son-peripera'],
  },
  {
    id: 'eighty-eight',
    title: 'eighty eight',
    subtitle: 'PADS COTTON',
    image: '/assets/images/trends/eighty-eight.png',
    backgroundColor: 'linear-gradient(135deg, #FF6B9D 0%, #FE5C8D 100%)',
    buttonText: 'XEM NGAY',
    categories: ['all', 'kem-chong-nang'],
  },
];

export function getProductsByCategory(categoryId: string): TrendProduct[] {
  if (categoryId === 'all') {
    return trendProducts;
  }
  return trendProducts.filter((product) =>
    product.categories.includes(categoryId)
  );
}
