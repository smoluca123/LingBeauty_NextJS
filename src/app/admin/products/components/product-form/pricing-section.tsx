'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { IProductFormData } from '@/lib/types/interfaces/apis/admin-product.interfaces';

// ============ Types ============
interface PricingSectionProps {
  formData: IProductFormData;
  onFieldChange: <K extends keyof IProductFormData>(field: K, value: IProductFormData[K]) => void;
}

// ============ Component ============
export function PricingSection({ formData, onFieldChange }: PricingSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-primary-pink">Giá bán</h3>

      <div className="grid grid-cols-2 gap-4">
        {/* Giá bán */}
        <div className="space-y-2">
          <Label htmlFor="basePrice">
            Giá bán <span className="text-primary-pink">*</span>
          </Label>
          <div className="relative">
            <Input
              id="basePrice"
              type="number"
              min="0"
              value={formData.basePrice || ''}
              onChange={(e) => onFieldChange('basePrice', parseInt(e.target.value) || 0)}
              placeholder="0"
              className="pr-12 focus:ring-primary-pink focus:border-primary-pink"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">₫</span>
          </div>
        </div>

        {/* Giá so sánh */}
        <div className="space-y-2">
          <Label htmlFor="comparePrice">Giá so sánh (gạch ngang)</Label>
          <div className="relative">
            <Input
              id="comparePrice"
              type="number"
              min="0"
              value={formData.comparePrice || ''}
              onChange={(e) => onFieldChange('comparePrice', parseInt(e.target.value) || 0)}
              placeholder="0"
              className="pr-12 focus:ring-primary-pink focus:border-primary-pink"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">₫</span>
          </div>
        </div>
      </div>
    </div>
  );
}
