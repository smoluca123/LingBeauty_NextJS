/**
 * Utility functions barrel export
 * All utility functions are organized by purpose in separate files
 */

// Style utilities
export { cn } from './style-utils'

// Format utilities
export { formatCurrency, formatCount } from './format-utils'

// Category utilities
export { findCategoryBySlug } from './category-utils'

// Validation utilities
export { isValidEmail, hasAdminRole } from './validation-utils'

// Email utilities
export { maskEmail } from './email-utils'

// Error handling utilities
export {
  handleApiError,
  getErrorMessage,
  extractErrorMessage,
} from './error-handler'

// Flash sale utilities
export {
  calculateTimeRemaining,
  padZero,
  calculateDiscountPercent,
  calculateStockPercent,
  isLowStock,
  isSoldOut,
  getRemainingStock,
} from './flash-sale-utils'

// Product utilities
export { getIsOutOfStock, getIsLowStock } from './product-utils'

// Tiptap utilities
export {
  handleTiptapImageUpload,
  createTiptapImageUploadHandler,
  handleTiptapPasteImage,
} from './tiptap-utils'
