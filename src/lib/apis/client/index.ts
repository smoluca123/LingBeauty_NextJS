/**
 * Client API Functions - Barrel Export
 *
 * This file exports all client API functions organized by domain.
 * All functions use kyNextInstance to call Next.js API route handlers.
 */

// ============ Authentication APIs ============
export {
  loginApi,
  registerApi,
  logoutApi,
  refreshTokenApi,
  validateTokenApi,
  sendEmailVerificationApi,
  verifyEmailApi,
  resendEmailVerificationApi,
  changePasswordAPI,
  type RateLimitError,
} from './auth-apis'

// ============ User APIs ============
export { uploadAvatarAPI, updateMyInformationAPI } from './user-apis'

// ============ Product APIs ============
export {
  getProductListingAPI,
  getFilterCategoriesAPI,
  getProductReviewsAPI,
  type IProductListingParams,
  type IFilterCategoriesParams,
} from './product.apis'

// ============ Cart APIs ============
export {
  getCartAPI,
  getCartCountAPI,
  addToCartAPI,
  updateCartItemAPI,
  removeCartItemAPI,
  clearCartAPI,
} from './cart.apis'

// ============ Address APIs ============
export { getMyAddressesAPI } from './address.apis'

// ============ Brand APIs ============
export { getBrandsAPI } from './brand.apis'

// ============ Category APIs ============
export { getCategoriesAPI } from './header-apis'

// ============ Review APIs ============
export {
  getPublicProductReviewsAPI,
  getProductReviewSummaryAPI,
  getPublicReviewByIdAPI,
  createReviewAPI,
  markHelpfulAPI,
  unmarkHelpfulAPI,
  createReviewReplyAPI,
  getReviewRepliesAPI,
  updateReviewAPI,
  deleteReviewAPI,
  updateReviewReplyAPI,
  deleteReviewReplyAPI,
} from './review.apis'

// ============ Upload APIs ============
export { uploadGeneralImage } from './upload.apis'

// ============ Admin - Product APIs ============
export {
  getAllAdminProductsClientAPI,
  createProductClientAPI,
  updateProductClientAPI,
  deleteProductClientAPI,
  getProductImagesClientAPI,
  uploadProductImageClientAPI,
  updateProductImageClientAPI,
  deleteProductImageClientAPI,
  reorderProductImagesClientAPI,
  getProductVariantsClientAPI,
  addProductVariantClientAPI,
  updateProductVariantClientAPI,
  deleteProductVariantClientAPI,
  getProductBadgesClientAPI,
  addProductBadgeClientAPI,
  addMultipleProductBadgesClientAPI,
  updateProductBadgeClientAPI,
  deleteProductBadgeClientAPI,
} from './admin-product.apis'

// ============ Admin - User APIs ============
export {
  getAllUsersClientAPI,
  getAllUserRolesClientAPI,
  banUserClientAPI,
  banUserBulkClientAPI,
  updateUserByAdminClientAPI,
  createUserClientAPI,
  type IUpdateUserByAdminPayload,
  type ICreateUserByAdminPayload,
} from './admin-user.apis'
