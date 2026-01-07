import type { FlashSale } from '@/types/flash-sale';

// Mock data for testing - replace with actual API call later
const MOCK_FLASH_SALE: FlashSale = {
  id: '1',
  name: 'Flash Sale 24h',
  slug: 'flash-sale-24h',
  startTime: new Date().toISOString(),
  endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
  status: 'ACTIVE',
  products: [
    {
      id: '1',
      productId: 'dermatory-moisture',
      flashPrice: 260000,
      originalPrice: 520000,
      maxQuantity: 100,
      soldQuantity: 99,
      limitPerOrder: 2,
      product: {
        id: 'dermatory-moisture',
        name: 'Bộ Mua 5 Tặng 1 Xịt Cấp Ẩm Dermatory Pro Hyal Shot Moisture',
        slug: 'dermatory-pro-hyal-shot-moisture',
        image:
          'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80',
        brand: { name: 'DERMATORY' },
        rating: 4.9,
        reviewCount: 102,
      },
      badges: [{ label: 'FREESHIP', variant: 'freeship' }],
    },
    {
      id: '2',
      productId: 'club-clio-mask',
      flashPrice: 399000,
      originalPrice: 499000,
      maxQuantity: 50,
      soldQuantity: 37,
      limitPerOrder: 1,
      product: {
        id: 'club-clio-mask',
        name: 'Mặt Nạ Ngủ Dưỡng Sáng Da Green Tangerine Vita',
        slug: 'club-clio-green-tangerine-vita',
        image:
          'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80',
        brand: { name: 'CLUB CLIO' },
        rating: 4.8,
        reviewCount: 43,
      },
      badges: [{ label: 'FREESHIP', variant: 'freeship' }],
    },
    {
      id: '3',
      productId: 'amuse-tint',
      flashPrice: 359000,
      originalPrice: 420000,
      maxQuantity: 80,
      soldQuantity: 68,
      limitPerOrder: 2,
      product: {
        id: 'amuse-tint',
        name: 'Son Tint Lì Amuse Dew Tint 3.8g',
        slug: 'amuse-dew-tint',
        image:
          'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80',
        brand: { name: 'AMUSE' },
        rating: 4.7,
        reviewCount: 215,
      },
      badges: [
        { label: 'FREESHIP', variant: 'freeship' },
        { label: 'HOT', variant: 'hot' },
      ],
    },
    {
      id: '4',
      productId: 'amuse-palette',
      flashPrice: 599000,
      originalPrice: 699000,
      maxQuantity: 30,
      soldQuantity: 29,
      limitPerOrder: 1,
      product: {
        id: 'amuse-palette',
        name: 'Bảng Phấn Mắt 9 Ô Amuse Eye Color Palette',
        slug: 'amuse-eye-color-palette',
        image:
          'https://image.hsv-tech.io/600x600/bbx/common/d6c8a528-ca8d-408d-b3eb-de751cddae90.webp',
        brand: { name: 'AMUSE' },
        rating: 4.6,
        reviewCount: 37,
      },
      badges: [{ label: 'NEW', variant: 'new' }],
    },
    {
      id: '5',
      productId: 'banila-co-pad',
      flashPrice: 302000,
      originalPrice: 429000,
      maxQuantity: 25,
      soldQuantity: 14,
      limitPerOrder: 1,
      product: {
        id: 'banila-co-pad',
        name: 'Toner Pad Cấp Ẩm Banila Co Zero 7 Pad',
        slug: 'banila-co-zero-7-pad',
        image:
          'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80',
        brand: { name: 'BANILA CO' },
        rating: 4.8,
        reviewCount: 128,
      },
      badges: [{ label: 'FREESHIP', variant: 'freeship' }],
    },
    {
      id: '6',
      productId: 'dermatory-serum',
      flashPrice: 189000,
      originalPrice: 350000,
      maxQuantity: 60,
      soldQuantity: 45,
      limitPerOrder: 3,
      product: {
        id: 'dermatory-serum',
        name: 'Serum Cấp Ẩm Dermatory Pro Hyal Shot Ampoule',
        slug: 'dermatory-pro-hyal-shot-ampoule',
        image:
          'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80',
        brand: { name: 'DERMATORY' },
        rating: 4.6,
        reviewCount: 78,
      },
      badges: [{ label: 'FREESHIP', variant: 'freeship' }],
    },
  ],
};

export async function getActiveFlashSaleAPI(): Promise<FlashSale | null> {
  // TODO: Replace with actual API call
  // const response = await fetch(`${API_URL}/flash-sales/active`);
  // return response.json();

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  return MOCK_FLASH_SALE;
}
