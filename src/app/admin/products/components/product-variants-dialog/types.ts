import type {
  IAdminProductVariant,
  VariantDisplayType,
} from '@/lib/types/interfaces/apis/admin-product.interfaces';

// ============ Types ============

export interface ProductVariantsDialogProps {
  productId: string;
  productName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface EditState {
  sku: string;
  name: string;
  color: string;
  size: string;
  type: string;
  displayType: VariantDisplayType;
  price: string;
  quantity: string;
  lowStockThreshold: string;
}

// ============ Helpers ============

export const toEditState = (v: IAdminProductVariant): EditState => ({
  sku: v.sku ?? '',
  name: v.name,
  color: v.color ?? '',
  size: v.size ?? '',
  type: v.type ?? '',
  displayType: v.displayType ?? 'COLOR',
  price: v.price,
  quantity: String(v.inventory?.quantity ?? 0),
  lowStockThreshold: String(v.inventory?.lowStockThreshold ?? 10),
});

export const EMPTY_ADD_STATE: EditState = {
  sku: '',
  name: '',
  color: '',
  size: '',
  type: '',
  displayType: 'COLOR',
  price: '',
  quantity: '0',
  lowStockThreshold: '10',
};
