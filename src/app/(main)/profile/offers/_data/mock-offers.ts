// Mock data for Offers page
export type OfferType = 'discount' | 'freeship' | 'gift' | 'cashback';
export type OfferStatus = 'active' | 'used' | 'expired';

export interface Offer {
  id: string;
  code: string;
  title: string;
  description: string;
  type: OfferType;
  discountValue: number; // percentage or fixed amount
  minOrderValue: number;
  maxDiscount?: number;
  expiresAt: string;
  status: OfferStatus;
  usageLimit: number;
  usedCount: number;
}

export const MOCK_OFFERS: Offer[] = [
  {
    id: '1',
    code: 'BEAUTY20',
    title: 'Giảm 20% đơn hàng',
    description: 'Áp dụng cho đơn hàng từ 500.000đ',
    type: 'discount',
    discountValue: 20,
    minOrderValue: 500000,
    maxDiscount: 200000,
    expiresAt: '2026-02-28T23:59:59',
    status: 'active',
    usageLimit: 1,
    usedCount: 0,
  },
  {
    id: '2',
    code: 'FREESHIP50K',
    title: 'Miễn phí vận chuyển',
    description: 'Giảm tối đa 50.000đ phí ship',
    type: 'freeship',
    discountValue: 50000,
    minOrderValue: 300000,
    expiresAt: '2026-03-15T23:59:59',
    status: 'active',
    usageLimit: 3,
    usedCount: 1,
  },
  {
    id: '3',
    code: 'GIFT2026',
    title: 'Tặng kèm sản phẩm sample',
    description: 'Nhận 3 sample sản phẩm cao cấp khi mua từ 1 triệu',
    type: 'gift',
    discountValue: 0,
    minOrderValue: 1000000,
    expiresAt: '2026-01-31T23:59:59',
    status: 'active',
    usageLimit: 1,
    usedCount: 0,
  },
  {
    id: '4',
    code: 'CASHBACK10',
    title: 'Hoàn tiền 10%',
    description: 'Hoàn 10% vào ví khi thanh toán online',
    type: 'cashback',
    discountValue: 10,
    minOrderValue: 800000,
    maxDiscount: 150000,
    expiresAt: '2026-02-14T23:59:59',
    status: 'active',
    usageLimit: 1,
    usedCount: 0,
  },
  {
    id: '5',
    code: 'USED123',
    title: 'Giảm 15% đơn hàng',
    description: 'Đã sử dụng',
    type: 'discount',
    discountValue: 15,
    minOrderValue: 400000,
    expiresAt: '2026-01-25T23:59:59',
    status: 'used',
    usageLimit: 1,
    usedCount: 1,
  },
  {
    id: '6',
    code: 'EXPIRED50',
    title: 'Giảm 50% Flash Sale',
    description: 'Đã hết hạn',
    type: 'discount',
    discountValue: 50,
    minOrderValue: 1500000,
    maxDiscount: 500000,
    expiresAt: '2026-01-01T23:59:59',
    status: 'expired',
    usageLimit: 1,
    usedCount: 0,
  },
];

export const OFFER_TYPE_LABELS: Record<OfferType, string> = {
  discount: 'Giảm giá',
  freeship: 'Miễn phí ship',
  gift: 'Quà tặng',
  cashback: 'Hoàn tiền',
};

export const OFFER_TYPE_COLORS: Record<OfferType, string> = {
  discount: 'bg-pink-100 text-pink-700',
  freeship: 'bg-blue-100 text-blue-700',
  gift: 'bg-purple-100 text-purple-700',
  cashback: 'bg-green-100 text-green-700',
};

export function getOffersByStatus(status: OfferStatus | 'all'): Offer[] {
  if (status === 'all') return MOCK_OFFERS;
  return MOCK_OFFERS.filter((offer) => offer.status === status);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
}

export function isOfferExpiringSoon(expiresAt: string): boolean {
  const now = new Date();
  const expiry = new Date(expiresAt);
  const diffDays = Math.ceil(
    (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
  return diffDays <= 7 && diffDays > 0;
}
