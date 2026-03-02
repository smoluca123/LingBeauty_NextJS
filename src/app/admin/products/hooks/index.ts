export {
  useAdminProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  useCreateVariant,
  useProductVariants,
  useUpdateVariant,
  useDeleteVariant,
  ADMIN_PRODUCTS_QUERY_KEY,
  PRODUCT_VARIANTS_QUERY_KEY,
} from './use-admin-products';

export { useBrands } from './use-brands';

export {
  useProductImages,
  useUploadProductImage,
  useUpdateProductImage,
  useDeleteProductImage,
  PRODUCT_IMAGES_QUERY_KEY,
} from './use-product-images';

export {
  useProductBadges,
  useCreateBadge,
  useCreateMultipleBadges,
  useUpdateBadge,
  useDeleteBadge,
  PRODUCT_BADGES_QUERY_KEY,
} from './use-product-badges';
