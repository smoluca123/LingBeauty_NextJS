'use client';

import { useState, useMemo, useCallback } from 'react';
import { Loader2, Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { useAdminProductsQuery } from '@/hooks/querys/admin-product.query';
import { useAddProductsToFlashSaleMutation } from '@/hooks/querys/admin-flash-sale.query';
import type {
  IFlashSaleDataType,
  IAddFlashSaleProductFormData,
} from '@/lib/types/interfaces/apis/flash-sale.interfaces';
import type {
  IAdminProductDataType,
  IAdminProductVariant,
} from '@/lib/types/interfaces/apis/admin-product.interfaces';
import { FLASH_SALE_VALIDATION } from '@/app/admin/flash-sales/constants';
import {
  ProductSearch,
  ProductList,
  SelectedProductsConfig,
  makeProductKey,
  type SelectedProduct,
} from './add-products-dialog/index';

// ── Types ─────────────────────────────────────────────────────────────────────

interface AddProductsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  flashSale: IFlashSaleDataType;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function AddProductsDialog({
  open,
  onOpenChange,
  flashSale,
}: AddProductsDialogProps) {
  // ── State ───────────────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<
    Map<string, SelectedProduct>
  >(new Map());
  const [expandedProducts, setExpandedProducts] = useState<Set<string>>(
    new Set(),
  );

  // ── Data Fetching ───────────────────────────────────────────────────────────
  const { data: productsData, isLoading: isLoadingProducts } =
    useAdminProductsQuery({
      search: searchQuery || undefined,
      limit: 50,
      isActive: true,
    });

  const addMutation = useAddProductsToFlashSaleMutation();

  // ── Derived State ───────────────────────────────────────────────────────────
  const existingProductKeys = useMemo(() => {
    const keys = new Set<string>();
    flashSale.products?.forEach(
      (p: { productId: string; variantId?: string }) => {
        keys.add(makeProductKey(p.productId, p.variantId));
      },
    );
    return keys;
  }, [flashSale.products]);

  const products: IAdminProductDataType[] = productsData?.data?.items ?? [];
  const selectedCount = selectedProducts.size;

  // ── Handlers ────────────────────────────────────────────────────────────────
  const toggleExpanded = useCallback((productId: string) => {
    setExpandedProducts((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });
  }, []);

  const toggleSelection = useCallback(
    (product: IAdminProductDataType, variant?: IAdminProductVariant) => {
      const key = makeProductKey(product.id, variant?.id);
      const basePrice = variant
        ? parseFloat(variant.price)
        : parseFloat(product.basePrice);

      setSelectedProducts((prev) => {
        const next = new Map(prev);
        if (next.has(key)) {
          next.delete(key);
        } else {
          next.set(key, {
            productId: product.id,
            variantId: variant?.id,
            originalPrice: basePrice,
            flashPrice: Math.round(basePrice * 0.8), // Default 20% off
            maxQuantity: 100,
            limitPerOrder: 2,
          });
        }
        return next;
      });
    },
    [],
  );

  const updateSelected = useCallback(
    (key: string, updates: Partial<SelectedProduct>) => {
      setSelectedProducts((prev) => {
        const next = new Map(prev);
        const current = next.get(key);
        if (current) next.set(key, { ...current, ...updates });
        return next;
      });
    },
    [],
  );

  const handleClose = useCallback(() => {
    setSelectedProducts(new Map());
    setSearchQuery('');
    onOpenChange(false);
  }, [onOpenChange]);

  const validateProducts = useCallback((): boolean => {
    for (const [, product] of selectedProducts) {
      if (product.flashPrice < FLASH_SALE_VALIDATION.MIN_FLASH_PRICE) {
        toast.error(
          `Giá flash sale phải tối thiểu ${FLASH_SALE_VALIDATION.MIN_FLASH_PRICE.toLocaleString('vi-VN')}đ`,
        );
        return false;
      }
      if (product.flashPrice >= product.originalPrice) {
        toast.error('Giá flash sale phải thấp hơn giá gốc');
        return false;
      }
      if (product.maxQuantity < FLASH_SALE_VALIDATION.MAX_QUANTITY_MIN) {
        toast.error(
          `Số lượng tối đa phải ít nhất là ${FLASH_SALE_VALIDATION.MAX_QUANTITY_MIN}`,
        );
        return false;
      }
      if (
        product.limitPerOrder < FLASH_SALE_VALIDATION.LIMIT_PER_ORDER_MIN ||
        product.limitPerOrder > FLASH_SALE_VALIDATION.LIMIT_PER_ORDER_MAX
      ) {
        toast.error(
          `Giới hạn mỗi đơn phải từ ${FLASH_SALE_VALIDATION.LIMIT_PER_ORDER_MIN} đến ${FLASH_SALE_VALIDATION.LIMIT_PER_ORDER_MAX}`,
        );
        return false;
      }
      if (product.limitPerOrder > product.maxQuantity) {
        toast.error('Giới hạn mỗi đơn không được vượt quá số lượng tối đa');
        return false;
      }
    }
    return true;
  }, [selectedProducts]);

  const handleSubmit = useCallback(async () => {
    if (selectedCount === 0) {
      toast.error('Vui lòng chọn ít nhất một sản phẩm');
      return;
    }

    if (!validateProducts()) {
      return;
    }

    const data: IAddFlashSaleProductFormData[] = Array.from(
      selectedProducts.values(),
    ).map((p) => ({
      productId: p.productId,
      variantId: p.variantId,
      flashPrice: p.flashPrice,
      originalPrice: p.originalPrice,
      maxQuantity: p.maxQuantity,
      limitPerOrder: p.limitPerOrder,
      sortOrder: 0,
    }));

    try {
      await addMutation.mutateAsync({ flashSaleId: flashSale.id, data });
      toast.success(`Đã thêm ${selectedCount} sản phẩm vào flash sale`);
      setSelectedProducts(new Map());
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Có lỗi xảy ra khi thêm sản phẩm',
      );
    }
  }, [
    selectedCount,
    selectedProducts,
    flashSale.id,
    addMutation,
    onOpenChange,
    validateProducts,
  ]);

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[800px] max-h-[90vh] overflow-hidden flex flex-col'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Plus className='h-5 w-5' />
            Thêm sản phẩm vào Flash Sale
          </DialogTitle>
          <DialogDescription>
            Chọn sản phẩm từ danh sách và cấu hình giá flash sale
          </DialogDescription>
        </DialogHeader>

        <ProductSearch
          value={searchQuery}
          onChange={setSearchQuery}
          selectedCount={selectedCount}
        />

        <div className='flex-1 overflow-y-auto pr-2 py-1 space-y-4 min-h-0'>
          {/* Product List */}
          <div className='border rounded-lg overflow-hidden shrink-0 bg-card'>
            <div className='p-3 bg-muted/50 border-b font-medium text-sm'>
              Danh sách sản phẩm
            </div>
            <ScrollArea className='h-[350px]'>
              <ProductList
                products={products}
                isLoading={isLoadingProducts}
                expandedProducts={expandedProducts}
                selectedProducts={selectedProducts}
                existingProductKeys={existingProductKeys}
                onToggleExpand={toggleExpanded}
                onToggleSelection={toggleSelection}
              />
            </ScrollArea>
          </div>

          {/* Selected Products Configuration */}
          <div className='border rounded-lg overflow-hidden shrink-0 bg-card'>
            <div className='p-3 bg-muted/50 border-b font-medium text-sm'>
              Cấu hình sản phẩm đã chọn
            </div>
            <ScrollArea className='h-[400px]'>
              <SelectedProductsConfig
                selectedProducts={selectedProducts}
                products={products}
                onUpdate={updateSelected}
                onRemove={toggleSelection}
              />
            </ScrollArea>
          </div>
        </div>

        {/* Footer */}
        <div className='flex justify-end gap-3 pt-4 border-t'>
          <Button variant='outline' onClick={handleClose}>
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={selectedCount === 0 || addMutation.isPending}
            className='bg-primary-pink hover:bg-primary-pink/90 text-white'
          >
            {addMutation.isPending ? (
              <>
                <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                Đang thêm...
              </>
            ) : (
              <>
                <Plus className='h-4 w-4 mr-2' />
                Thêm {selectedCount > 0 ? `(${selectedCount})` : ''}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
