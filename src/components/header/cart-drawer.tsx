'use client';

import { useState, useMemo } from 'react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { useGetProductsQuery } from '@/hooks/querys/product.query';
import { CartItem as CartItemType } from '@/lib/types/interfaces/cart.interfaces';
import { CartItem } from '@/components/cart/cart-item';
import { CartSummary } from '@/components/cart/cart-summary';
import { EmptyCart } from '@/components/cart/empty-cart';
import { Loader2 } from 'lucide-react';

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const { data, isLoading } = useGetProductsQuery();

  // Get all products from paginated data
  const allProducts = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page.data.items || []);
  }, [data]);

  // Auto-generate initial cart items from first 3 products for demo
  const initialCartItems = useMemo(() => {
    if (allProducts.length === 0) return [];
    return allProducts.slice(0, 3).map((product, index) => ({
      productId: product.id,
      variantId: product.variants?.[0]?.id || null,
      quantity: index + 1, // 1, 2, 3
    }));
  }, [allProducts]);

  // Initialize cart items with lazy initialization to avoid cascading renders
  const [cartItems, setCartItems] = useState<CartItemType[]>(
    () => initialCartItems,
  );

  // Map cart items with product data
  const cartItemsWithProducts = useMemo(() => {
    return cartItems
      .map((cartItem) => {
        const product = allProducts.find((p) => p.id === cartItem.productId);
        if (!product) return null;

        const variant = cartItem.variantId
          ? product.variants?.find((v) => v.id === cartItem.variantId)
          : undefined;

        return {
          ...cartItem,
          product,
          variant,
        };
      })
      .filter(Boolean);
  }, [cartItems, allProducts]);

  // Calculate totals
  const subtotal = useMemo(() => {
    return cartItemsWithProducts.reduce((sum, item) => {
      if (!item) return sum;
      const price = item.variant
        ? Number(item.variant.price)
        : Number(item.product.basePrice);
      return sum + price * item.quantity;
    }, 0);
  }, [cartItemsWithProducts]);

  const shipping = subtotal >= 500000 ? 0 : 30000; // Free shipping over 500k VND

  const handleUpdateQuantity = (
    productId: string,
    variantId: string | null,
    newQuantity: number,
  ) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.productId === productId && item.variantId === variantId
          ? { ...item, quantity: newQuantity }
          : item,
      ),
    );
  };

  const handleRemoveItem = (productId: string, variantId: string | null) => {
    setCartItems((prev) =>
      prev.filter(
        (item) =>
          !(item.productId === productId && item.variantId === variantId),
      ),
    );
  };

  // Reset cart to initial demo data
  const handleResetCart = () => {
    setCartItems(initialCartItems);
  };

  const handleCheckout = () => {
    console.log('Proceeding to checkout with items:', cartItemsWithProducts);
    console.log('Total amount:', subtotal + shipping);
    // TODO: Implement checkout logic
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="h-full w-full sm:w-[400px] lg:max-w-md flex flex-col">
        <DrawerHeader className="border-b">
          <DrawerTitle>Giỏ hàng</DrawerTitle>
          <DrawerDescription>
            {cartItems.length > 0
              ? `${cartItems.length} sản phẩm trong giỏ hàng`
              : 'Giỏ hàng của bạn'}
          </DrawerDescription>
        </DrawerHeader>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary-pink" />
            </div>
          ) : cartItems.length === 0 ? (
            <EmptyCart
              onClose={() => onOpenChange(false)}
              onResetCart={handleResetCart}
            />
          ) : (
            <div className="p-4 space-y-3">
              {cartItemsWithProducts.map((item) => {
                if (!item) return null;
                return (
                  <CartItem
                    key={`${item.productId}-${item.variantId || 'default'}`}
                    product={item.product}
                    variant={item.variant}
                    quantity={item.quantity}
                    onUpdateQuantity={(newQty) =>
                      handleUpdateQuantity(
                        item.productId,
                        item.variantId,
                        newQty,
                      )
                    }
                    onRemove={() =>
                      handleRemoveItem(item.productId, item.variantId)
                    }
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Footer with Summary and Actions */}
        {cartItems.length > 0 && !isLoading && (
          <DrawerFooter className="border-t pt-4 gap-3">
            <CartSummary subtotal={subtotal} shipping={shipping} />

            <Button
              onClick={handleCheckout}
              className="w-full h-11 rounded-xl bg-primary-pink hover:bg-primary-pink/90 text-white font-semibold"
            >
              Thanh toán
            </Button>

            <DrawerClose asChild>
              <Button variant="outline" className="w-full rounded-xl">
                Tiếp tục mua sắm
              </Button>
            </DrawerClose>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
}
