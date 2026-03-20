'use client';

import { useState } from 'react';
import { Loader2, Package, Plus, Trash2, Search, Pencil } from 'lucide-react';
import { AddProductsDialog } from './add-products-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  useAdminFlashSaleQuery,
  useRemoveProductFromFlashSaleMutation,
  useUpdateFlashSaleProductMutation,
} from '@/hooks/querys/admin-flash-sale.query';
import type {
  IFlashSaleDataType,
  IFlashSaleProductDataType,
} from '@/lib/types/interfaces/apis/flash-sale.interfaces';
import {
  getFlashSaleProductImageUrl,
  getFlashSaleVariantImageUrl,
} from '@/lib/types/interfaces/apis/flash-sale.interfaces';
import {
  formatCurrency,
  calculateDiscountPercentage,
  calculateSoldPercentage,
  FLASH_SALE_VALIDATION,
} from '@/app/admin/flash-sales/constants';
import { Progress } from '@/components/ui/progress';
import Image from 'next/image';
import { toast } from 'sonner';

// ── Types ─────────────────────────────────────────────────────────────────────

interface ManageProductsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  flashSale: IFlashSaleDataType; // basic info from list (no products)
}

interface EditState {
  product: IFlashSaleProductDataType;
  flashPrice: number;
  maxQuantity: number;
  limitPerOrder: number;
}

// ── Sub-component: Product Row ─────────────────────────────────────────────────

interface ProductRowProps {
  product: IFlashSaleProductDataType;
  isRemoving: boolean;
  onRemove: (product: IFlashSaleProductDataType) => void;
  onEdit: (product: IFlashSaleProductDataType) => void;
}

function ProductRow({ product, isRemoving, onRemove, onEdit }: ProductRowProps) {
  const originalPrice =
    typeof product.originalPrice === 'string'
      ? parseFloat(product.originalPrice)
      : product.originalPrice;
  const flashPrice =
    typeof product.flashPrice === 'string'
      ? parseFloat(product.flashPrice)
      : product.flashPrice;
  const discountPercent = calculateDiscountPercentage(originalPrice, flashPrice);
  const soldPercent = calculateSoldPercentage(
    product.soldQuantity,
    product.maxQuantity,
  );

  // Images: prefer variant image, fallback to product image
  const imageUrl =
    getFlashSaleVariantImageUrl(product.variant) ??
    getFlashSaleProductImageUrl(product.product);

  return (
    <TableRow>
      <TableCell>
        <div className='flex items-center gap-3'>
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.product?.name ?? ''}
              width={40}
              height={40}
              className='h-10 w-10 rounded object-cover shrink-0'
            />
          ) : (
            <div className='h-10 w-10 rounded bg-muted flex items-center justify-center shrink-0'>
              <Package className='h-5 w-5 text-muted-foreground' />
            </div>
          )}
          <div>
            <p className='font-medium text-sm'>
              {product.product?.name ?? 'Không có tên'}
            </p>
            {product.variant && (
              <p className='text-xs text-muted-foreground'>
                {product.variant.name ?? product.variant.color}
                {product.variant.size && ` - ${product.variant.size}`}
              </p>
            )}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <span className='text-sm text-muted-foreground line-through'>
          {formatCurrency(originalPrice)}
        </span>
      </TableCell>
      <TableCell>
        <span className='font-medium text-primary-pink'>
          {formatCurrency(flashPrice)}
        </span>
      </TableCell>
      <TableCell>
        <span className='text-sm font-medium text-green-600'>
          -{discountPercent}%
        </span>
      </TableCell>
      <TableCell>
        <div className='space-y-1'>
          <div className='flex justify-between text-xs'>
            <span>
              {product.soldQuantity} / {product.maxQuantity}
            </span>
            <span>{soldPercent}%</span>
          </div>
          <Progress value={soldPercent} className='h-1.5' />
        </div>
      </TableCell>
      <TableCell className='text-right'>
        <div className='flex items-center justify-end gap-1'>
          <Button
            variant='ghost'
            size='icon'
            className='h-8 w-8 text-muted-foreground hover:text-foreground'
            onClick={() => onEdit(product)}
          >
            <Pencil className='h-4 w-4' />
          </Button>
          <Button
            variant='ghost'
            size='icon'
            className='h-8 w-8 text-destructive'
            onClick={() => onRemove(product)}
            disabled={isRemoving}
          >
            {isRemoving ? (
              <Loader2 className='h-4 w-4 animate-spin' />
            ) : (
              <Trash2 className='h-4 w-4' />
            )}
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

// ── Sub-component: Edit Product Panel ─────────────────────────────────────────

interface EditProductPanelProps {
  editState: EditState;
  isSaving: boolean;
  onChange: (updates: Partial<Omit<EditState, 'product'>>) => void;
  onSave: () => void;
  onCancel: () => void;
}

function EditProductPanel({
  editState,
  isSaving,
  onChange,
  onSave,
  onCancel,
}: EditProductPanelProps) {
  const originalPrice =
    typeof editState.product.originalPrice === 'string'
      ? parseFloat(editState.product.originalPrice)
      : editState.product.originalPrice;

  const discountPct =
    originalPrice > 0
      ? Math.round(((originalPrice - editState.flashPrice) / originalPrice) * 100)
      : 0;

  return (
    <div className='border rounded-lg p-4 bg-muted/30 space-y-3'>
      <div className='flex items-center justify-between'>
        <p className='text-sm font-medium'>
          Chỉnh sửa:{' '}
          <span className='text-primary'>
            {editState.product.product?.name}
            {editState.product.variant?.color &&
              ` - ${editState.product.variant.color}`}
            {editState.product.variant?.size &&
              ` (${editState.product.variant.size})`}
          </span>
        </p>
        <span className='text-xs text-green-600 font-medium'>
          Giảm {discountPct}%
        </span>
      </div>

      <div className='grid grid-cols-3 gap-3'>
        <div>
          <label className='text-xs text-muted-foreground'>
            Giá flash <span className='text-destructive'>*</span>
          </label>
          <Input
            type='number'
            value={editState.flashPrice}
            onChange={(e) =>
              onChange({ flashPrice: parseInt(e.target.value) || 0 })
            }
            className='h-8 text-sm mt-1'
            min={FLASH_SALE_VALIDATION.MIN_FLASH_PRICE}
          />
        </div>
        <div>
          <label className='text-xs text-muted-foreground'>
            Số lượng tối đa <span className='text-destructive'>*</span>
          </label>
          <Input
            type='number'
            value={editState.maxQuantity}
            onChange={(e) =>
              onChange({ maxQuantity: parseInt(e.target.value) || 0 })
            }
            className='h-8 text-sm mt-1'
            min={FLASH_SALE_VALIDATION.MAX_QUANTITY_MIN}
          />
        </div>
        <div>
          <label className='text-xs text-muted-foreground'>
            Giới hạn/đơn <span className='text-destructive'>*</span>
          </label>
          <Input
            type='number'
            value={editState.limitPerOrder}
            onChange={(e) =>
              onChange({ limitPerOrder: parseInt(e.target.value) || 0 })
            }
            className='h-8 text-sm mt-1'
            min={FLASH_SALE_VALIDATION.LIMIT_PER_ORDER_MIN}
            max={FLASH_SALE_VALIDATION.LIMIT_PER_ORDER_MAX}
          />
        </div>
      </div>

      <div className='flex justify-end gap-2'>
        <Button variant='outline' size='sm' onClick={onCancel}>
          Hủy
        </Button>
        <Button
          size='sm'
          onClick={onSave}
          disabled={isSaving}
          className='bg-primary-pink hover:bg-primary-pink/90 text-white'
        >
          {isSaving && <Loader2 className='h-3 w-3 mr-1 animate-spin' />}
          Lưu
        </Button>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

export function ManageProductsDialog({
  open,
  onOpenChange,
  flashSale,
}: ManageProductsDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editState, setEditState] = useState<EditState | null>(null);

  // Fetch full flash sale data by ID to get products with nested info
  // (getAllFlashSales does NOT include products - it uses plain findMany without flashSaleSelect)
  const { data: flashSaleDetail, isLoading: isLoadingDetail } =
    useAdminFlashSaleQuery(flashSale.id, { enabled: open });

  const fullFlashSale = flashSaleDetail?.data ?? flashSale;
  const products = fullFlashSale.products ?? [];

  const removeMutation = useRemoveProductFromFlashSaleMutation();
  const updateMutation = useUpdateFlashSaleProductMutation();

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleRemoveProduct = async (product: IFlashSaleProductDataType) => {
    try {
      await removeMutation.mutateAsync({
        flashSaleId: flashSale.id,
        productId: product.productId,
        variantId: product.variantId,
      });
      toast.success('Đã xóa sản phẩm khỏi flash sale');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Có lỗi xảy ra');
    }
  };

  const handleEditProduct = (product: IFlashSaleProductDataType) => {
    setEditState({
      product,
      flashPrice:
        typeof product.flashPrice === 'string'
          ? parseFloat(product.flashPrice)
          : product.flashPrice,
      maxQuantity: product.maxQuantity,
      limitPerOrder: product.limitPerOrder,
    });
  };

  const handleSaveEdit = async () => {
    if (!editState) return;

    const originalPrice =
      typeof editState.product.originalPrice === 'string'
        ? parseFloat(editState.product.originalPrice)
        : editState.product.originalPrice;

    if (editState.flashPrice < FLASH_SALE_VALIDATION.MIN_FLASH_PRICE) {
      toast.error(
        `Giá flash sale phải tối thiểu ${FLASH_SALE_VALIDATION.MIN_FLASH_PRICE.toLocaleString('vi-VN')}đ`,
      );
      return;
    }
    if (editState.flashPrice >= originalPrice) {
      toast.error('Giá flash sale phải thấp hơn giá gốc');
      return;
    }
    if (editState.limitPerOrder > editState.maxQuantity) {
      toast.error('Giới hạn mỗi đơn không được vượt quá số lượng tối đa');
      return;
    }

    try {
      await updateMutation.mutateAsync({
        flashSaleId: flashSale.id,
        productId: editState.product.productId,
        variantId: editState.product.variantId,
        data: {
          flashPrice: editState.flashPrice,
          maxQuantity: editState.maxQuantity,
          limitPerOrder: editState.limitPerOrder,
        },
      });
      toast.success('Cập nhật sản phẩm thành công');
      setEditState(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Có lỗi xảy ra');
    }
  };

  const filteredProducts = products.filter((product) => {
    const q = searchQuery.toLowerCase();
    return (
      product.product?.name?.toLowerCase().includes(q) ||
      product.product?.slug?.toLowerCase().includes(q) ||
      product.variant?.sku?.toLowerCase().includes(q)
    );
  });

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[900px] max-h-[90vh] overflow-hidden flex flex-col'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Package className='h-5 w-5' />
            Quản lý sản phẩm — {flashSale.name}
          </DialogTitle>
          <DialogDescription>
            {isLoadingDetail
              ? 'Đang tải...'
              : `${products.length} sản phẩm trong flash sale này`}
          </DialogDescription>
        </DialogHeader>

        {/* Toolbar */}
        <div className='flex items-center gap-4 py-4'>
          <div className='relative flex-1'>
            <Search className='absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
            <Input
              type='search'
              placeholder='Tìm kiếm sản phẩm...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='pl-9'
            />
          </div>
          <Button
            onClick={() => setAddDialogOpen(true)}
            className='bg-primary-pink hover:bg-primary-pink/90 text-white'
          >
            <Plus className='h-4 w-4 mr-2' />
            Thêm sản phẩm
          </Button>
        </div>

        {/* Edit panel (composition: shown conditionally, no boolean prop) */}
        {editState && (
          <EditProductPanel
            editState={editState}
            isSaving={updateMutation.isPending}
            onChange={(updates) =>
              setEditState((prev) => (prev ? { ...prev, ...updates } : null))
            }
            onSave={handleSaveEdit}
            onCancel={() => setEditState(null)}
          />
        )}

        {/* Product Table */}
        <div className='flex-1 overflow-auto border rounded-lg'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='min-w-[200px]'>Sản phẩm</TableHead>
                <TableHead className='w-[120px]'>Giá gốc</TableHead>
                <TableHead className='w-[120px]'>Giá flash</TableHead>
                <TableHead className='w-[100px]'>Giảm giá</TableHead>
                <TableHead className='w-[140px]'>Tồn kho</TableHead>
                <TableHead className='w-20 text-right'>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingDetail ? (
                <TableRow>
                  <TableCell colSpan={6} className='text-center py-8'>
                    <Loader2 className='h-6 w-6 animate-spin mx-auto text-muted-foreground' />
                  </TableCell>
                </TableRow>
              ) : filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className='text-center py-8 text-muted-foreground'
                  >
                    {searchQuery
                      ? 'Không tìm thấy sản phẩm phù hợp'
                      : 'Flash sale này chưa có sản phẩm nào'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
                  <ProductRow
                    key={product.id}
                    product={product}
                    isRemoving={
                      removeMutation.isPending &&
                      removeMutation.variables?.productId === product.productId
                    }
                    onRemove={handleRemoveProduct}
                    onEdit={handleEditProduct}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className='flex justify-end pt-4'>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
        </div>
      </DialogContent>

      {/* AddProductsDialog nhận full flash sale (với products đã load) để detect đã thêm */}
      <AddProductsDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        flashSale={fullFlashSale}
      />
    </Dialog>
  );
}
