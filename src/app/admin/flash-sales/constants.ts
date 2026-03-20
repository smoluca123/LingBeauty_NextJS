/**
 * Flash Sale status enum values - matches server FlashSaleStatus
 */
export const FLASH_SALE_STATUS = {
  UPCOMING: {
    value: 'UPCOMING' as const,
    label: 'Sắp diễn ra',
    description: 'Flash sale chưa bắt đầu',
    variant: 'outline' as const,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50 border-yellow-200',
  },
  ACTIVE: {
    value: 'ACTIVE' as const,
    label: 'Đang diễn ra',
    description: 'Flash sale đang hoạt động',
    variant: 'success' as const,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  ENDED: {
    value: 'ENDED' as const,
    label: 'Đã kết thúc',
    description: 'Flash sale đã kết thúc',
    variant: 'secondary' as const,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
  },
};

/**
 * Flash sale status options for select inputs
 */
export const FLASH_SALE_STATUS_OPTIONS = Object.values(FLASH_SALE_STATUS);

/**
 * Default values for new flash sale
 */
export const DEFAULT_FLASH_SALE_VALUES = {
  status: 'UPCOMING' as const,
  isActive: true,
  sortOrder: 0,
};

/**
 * Flash Sale validation constants
 */
export const FLASH_SALE_VALIDATION = {
  NAME_MIN_LENGTH: 3,
  NAME_MAX_LENGTH: 200,
  SLUG_MIN_LENGTH: 3,
  SLUG_MAX_LENGTH: 100,
  DESCRIPTION_MAX_LENGTH: 1000,
  MIN_FLASH_PRICE: 1000,
  MAX_QUANTITY_MIN: 1,
  LIMIT_PER_ORDER_MIN: 1,
  LIMIT_PER_ORDER_MAX: 10,
};

/**
 * Computed flash sale status for UI display
 * This combines the server status with isActive flag and time checks
 */
export const FLASH_SALE_COMPUTED_STATUS = {
  upcoming: {
    label: 'Sắp diễn ra',
    variant: 'outline' as const,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50 border-yellow-200',
  },
  active: {
    label: 'Đang diễn ra',
    variant: 'success' as const,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  ended: {
    label: 'Đã kết thúc',
    variant: 'secondary' as const,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
  },
  inactive: {
    label: 'Tạm ngưng',
    variant: 'outline' as const,
    color: 'text-gray-500',
    bgColor: 'bg-gray-100',
  },
};

/**
 * Get computed flash sale status based on server status, isActive flag, and time
 */
export const getFlashSaleComputedStatus = (
  status: string,
  isActive: boolean,
  startTime: Date | string,
  endTime: Date | string,
): keyof typeof FLASH_SALE_COMPUTED_STATUS => {
  if (!isActive) return 'inactive';

  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);

  if (now > end || status === 'ENDED') return 'ended';
  if (now >= start && now <= end && status === 'ACTIVE') return 'active';
  return 'upcoming';
};

/**
 * Format currency for display
 */
export const formatCurrency = (
  value: number | string | undefined | null,
): string => {
  if (value === undefined || value === null) return '—';
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(numValue);
};

/**
 * Calculate discount percentage
 */
export const calculateDiscountPercentage = (
  originalPrice: number | string,
  flashPrice: number | string,
): number => {
  const original =
    typeof originalPrice === 'string'
      ? parseFloat(originalPrice)
      : originalPrice;
  const flash =
    typeof flashPrice === 'string' ? parseFloat(flashPrice) : flashPrice;
  if (original <= 0 || flash >= original) return 0;
  return Math.round(((original - flash) / original) * 100);
};

/**
 * Calculate sold percentage
 */
export const calculateSoldPercentage = (
  soldQuantity: number,
  maxQuantity: number,
): number => {
  if (maxQuantity <= 0) return 0;
  return Math.min(100, Math.round((soldQuantity / maxQuantity) * 100));
};

/**
 * Format time remaining for countdown display
 */
export const formatTimeRemaining = (milliseconds: number): string => {
  if (milliseconds <= 0) return '00:00:00';

  const seconds = Math.floor((milliseconds / 1000) % 60);
  const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
  const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);
  const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));

  if (days > 0) {
    return `${days}d ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * Generate slug from name
 */
export const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, FLASH_SALE_VALIDATION.SLUG_MAX_LENGTH);
};

/**
 * Page size for flash sale list
 */
export const FLASH_SALE_PAGE_SIZE = 10;

/**
 * Flash sale product sort options
 */
export const FLASH_SALE_PRODUCT_SORT_OPTIONS = [
  { value: 'sortOrder', label: 'Thứ tự' },
  { value: 'flashPrice', label: 'Giá flash sale' },
  { value: 'originalPrice', label: 'Giá gốc' },
  { value: 'discount', label: 'Chiết khấu' },
];
