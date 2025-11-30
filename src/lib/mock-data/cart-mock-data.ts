import { CartItem } from '@/lib/types/interfaces/cart.interfaces';

/**
 * Mock cart items data
 * In production, this would come from localStorage, session, or backend API
 */
export const mockCartItems: CartItem[] = [
  {
    productId: '1', // Will be matched with real products from API
    variantId: null, // null means default/base variant
    quantity: 2,
  },
  {
    productId: '2',
    variantId: null,
    quantity: 1,
  },
  {
    productId: '3',
    variantId: null,
    quantity: 3,
  },
];
