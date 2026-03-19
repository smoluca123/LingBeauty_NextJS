import { create } from 'zustand';


export interface AppliedCoupon {
  code: string;
  discountAmount: number;
  finalTotal: number;
}

interface CartState {
  couponCode: string; // The text typed in the input
  appliedCoupon: AppliedCoupon | null; // The verified coupon response
}

interface CartActions {
  setCouponCode: (code: string) => void;
  setAppliedCoupon: (coupon: AppliedCoupon | null) => void;
  clearCoupon: () => void;
}

type CartStore = CartState & CartActions;

const initialState: CartState = {
  couponCode: '',
  appliedCoupon: null,
};

export const useCartStore = create<CartStore>((set) => ({
    ...initialState,
    setCouponCode: (couponCode) => set({ couponCode }),
    setAppliedCoupon: (appliedCoupon) => set({ appliedCoupon }),
    clearCoupon: () => set(initialState),
  })
);
