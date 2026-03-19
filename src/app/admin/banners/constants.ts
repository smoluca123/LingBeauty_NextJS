/**
 * Constants for Banner Admin Module
 * Shared between banners and banner-groups pages
 */

// Position labels for banners
export const POSITION_LABELS: Record<string, string> = {
  MAIN_CAROUSEL: 'Carousel chính',
  SIDE_TOP: 'Bên phải (trên)',
  SIDE_BOTTOM: 'Bên phải (dưới)',
};

// Type labels for banners
export const TYPE_LABELS: Record<string, string> = {
  TEXT: 'Văn bản',
  IMAGE: 'Hình ảnh',
};

// Banner type options
export const BANNER_TYPES = [
  { value: 'TEXT', label: 'Text' },
  { value: 'IMAGE', label: 'Hình ảnh' },
] as const;

// Banner position options
export const BANNER_POSITIONS = [
  { value: 'MAIN_CAROUSEL', label: 'Carousel chính' },
  { value: 'SIDE_TOP', label: 'Bên phải (trên)' },
  { value: 'SIDE_BOTTOM', label: 'Bên phải (dưới)' },
] as const;

// Default gradient colors
export const DEFAULT_GRADIENT = {
  from: '#FF6B9D',
  to: '#FF8E53',
};

/**
 * Get position label from position value
 */
export function getPositionLabel(position: string | null | undefined): string {
  return POSITION_LABELS[position ?? ''] ?? position ?? 'Không xác định';
}

/**
 * Get type label from type value
 */
export function getTypeLabel(type: string | null | undefined): string {
  return TYPE_LABELS[type ?? ''] ?? type ?? 'Không xác định';
}

/**
 * Generate slug from text
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Format date to Vietnamese locale
 */
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleDateString('vi-VN');
}
