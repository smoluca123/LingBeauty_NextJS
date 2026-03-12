'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import type { IProductFormData } from '@/lib/types/interfaces/apis/admin-product.interfaces';

// ============ Types ============
interface OptionsSectionProps {
  formData: IProductFormData;
  onFieldChange: <K extends keyof IProductFormData>(field: K, value: IProductFormData[K]) => void;
}

// ============ Component ============
export function OptionsSection({ formData, onFieldChange }: OptionsSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-primary-pink">Tùy chọn</h3>

      {/* Weight */}
      <div className="space-y-2">
        <Label htmlFor="weight">Trọng lượng (gram)</Label>
        <Input
          id="weight"
          type="number"
          min="0"
          value={formData.weight || ''}
          onChange={(e) => onFieldChange('weight', parseFloat(e.target.value) || 0)}
          placeholder="VD: 50"
          className="w-48 focus:ring-primary-pink focus:border-primary-pink"
        />
      </div>

      {/* Switches */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between p-4 rounded-lg border border-primary-pink/20 bg-primary-pink/5">
          <div>
            <Label htmlFor="isActive" className="font-medium">Đăng bán ngay</Label>
            <p className="text-sm text-muted-foreground">Sản phẩm sẽ hiển thị trên website</p>
          </div>
          <Switch
            id="isActive"
            checked={formData.isActive}
            onCheckedChange={(checked) => onFieldChange('isActive', checked)}
            className="data-[state=checked]:bg-primary-pink"
          />
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg border border-primary-pink/20 bg-primary-pink/5">
          <div>
            <Label htmlFor="isFeatured" className="font-medium">Sản phẩm nổi bật</Label>
            <p className="text-sm text-muted-foreground">Hiển thị trong danh sách sản phẩm nổi bật</p>
          </div>
          <Switch
            id="isFeatured"
            checked={formData.isFeatured}
            onCheckedChange={(checked) => onFieldChange('isFeatured', checked)}
            className="data-[state=checked]:bg-primary-pink"
          />
        </div>
      </div>
    </div>
  );
}
