/**
 * Coupon types - maps to server CouponType enum
 */
export const COUPON_TYPES = {
  FIXED: {
    value: 'FIXED' as const,
    label: 'Cố định',
    description: 'Giảm số tiền cố định',
  },
  PERCENTAGE: {
    value: 'PERCENTAGE' as const,
    label: 'Phần trăm',
    description: 'Giảm theo phần trăm',
  },
};

/**
 * Coupon type options for select inputs
 */
export const COUPON_TYPE_OPTIONS = Object.values(COUPON_TYPES);

/**
 * Default values for new coupon
 */
export const DEFAULT_COUPON_VALUES = {
  type: 'PERCENTAGE' as const,
  value: 10,
  isActive: true,
  usageLimit: undefined as number | undefined,
  minPurchase: undefined as number | undefined,
  maxDiscount: undefined as number | undefined,
};

/**
 * Coupon status labels and colors
 */
export const COUPON_STATUS = {
  active: {
    label: 'Đang hoạt động',
    variant: 'success' as const,
  },
  inactive: {
    label: 'Tạm ngưng',
    variant: 'secondary' as const,
  },
  expired: {
    label: 'Đã hết hạn',
    variant: 'destructive' as const,
  },
  upcoming: {
    label: 'Sắp diễn ra',
    variant: 'outline' as const,
  },
  exhausted: {
    label: 'Đã hết lượt',
    variant: 'destructive' as const,
  },
};

/**
 * Get coupon status based on dates and usage
 */
export const getCouponStatus = (
  isActive: boolean,
  startDate: Date | string,
  endDate: Date | string,
  usedCount: number,
  usageLimit?: number | null,
): keyof typeof COUPON_STATUS => {
  if (!isActive) return 'inactive';
  if (
    usageLimit !== undefined &&
    usageLimit !== null &&
    usedCount >= usageLimit
  ) {
    return 'exhausted';
  }

  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (now > end) return 'expired';
  if (now < start) return 'upcoming';
  return 'active';
};

/**
 * Format coupon value for display
 */
export const formatCouponValue = (
  type: 'FIXED' | 'PERCENTAGE',
  value: number | string,
): string => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  if (type === 'PERCENTAGE') {
    return `${numValue}%`;
  }
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(numValue);
};

/**
 * Format currency
 */
export const formatCurrency = (value: number | string | undefined): string => {
  if (value === undefined || value === null) return '—';
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(numValue);
};

/**
 * Calculate usage percentage
 */
export const calculateUsagePercentage = (
  usedCount: number,
  usageLimit?: number | null,
): number => {
  if (!usageLimit) return 0;
  return Math.min(100, Math.round((usedCount / usageLimit) * 100));
};

/**
 * Validation constants
 */
export const COUPON_VALIDATION = {
  CODE_MIN_LENGTH: 3,
  CODE_MAX_LENGTH: 20,
  MIN_VALUE: 1,
  MAX_PERCENTAGE: 100,
  MAX_FIXED_DISCOUNT: 100000000, // 100 million VND
  MIN_ORDER_VALUE: 0,
};
