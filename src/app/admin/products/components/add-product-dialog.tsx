'use client';

import { useState } from 'react';
import { Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockAdminCategories, mockAdminBrands } from '@/lib/mock-data/admin';
import { IProductFormData } from '@/lib/types/interfaces/apis/admin-product.interfaces';

// ============ Primary Pink Theme Colors ============
const PRIMARY_PINK_THEME = {
  primaryLight: 'bg-primary-pink/10 text-primary-pink',
  border: 'border-primary-pink/30 focus:border-primary-pink',
  ring: 'focus:ring-primary-pink',
  text: 'text-primary-pink',
};

// ============ Types ============
interface AddProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (data: IProductFormData) => void;
}

// ============ Initial Form State ============
const INITIAL_FORM_DATA: IProductFormData = {
  name: '',
  slug: '',
  sku: '',
  shortDesc: '',
  basePrice: 0,
  comparePrice: 0,
  brandId: '',
  categoryIds: [],
  isActive: true,
  isFeatured: false,
  stock: 0,
  lowStockThreshold: 10,
  minStockQuantity: -10,
};

// ============ Component ============
export function AddProductDialog({
  open,
  onOpenChange,
  onSave,
}: AddProductDialogProps) {
  const [formData, setFormData] = useState<IProductFormData>(INITIAL_FORM_DATA);

  // Generate slug from name
  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  // Generate SKU
  const generateSku = (): string => {
    const prefix = formData.name
      .slice(0, 3)
      .toUpperCase()
      .replace(/[^A-Z]/g, 'X');
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0');
    return `${prefix}-${random}`;
  };

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: generateSlug(name),
    }));
  };

  const handleSubmit = () => {
    // Add auto-generated SKU if empty
    const dataToSave = {
      ...formData,
      sku: formData.sku || generateSku(),
    };
    console.log('Saving product:', dataToSave);
    onSave?.(dataToSave);
    handleClose();
  };

  const handleClose = () => {
    setFormData(INITIAL_FORM_DATA);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b border-primary-pink/20">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${PRIMARY_PINK_THEME.primaryLight}`}>
              <Package className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-xl">Thêm sản phẩm mới</DialogTitle>
              <DialogDescription>
                Điền thông tin chi tiết để thêm sản phẩm vào hệ thống
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Basic Information Section */}
          <div className="space-y-4">
            <h3 className={`font-semibold ${PRIMARY_PINK_THEME.text}`}>
              Thông tin cơ bản
            </h3>

            {/* Product Name */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Tên sản phẩm <span className="text-primary-pink">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Nhập tên sản phẩm"
                className="focus:ring-primary-pink focus:border-primary-pink"
              />
            </div>

            {/* Slug & SKU */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="slug">Slug (URL)</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  placeholder="ten-san-pham"
                  className="focus:ring-primary-pink focus:border-primary-pink"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <div className="flex gap-2">
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) =>
                      setFormData({ ...formData, sku: e.target.value })
                    }
                    placeholder="Tự động tạo nếu để trống"
                    className="focus:ring-primary-pink focus:border-primary-pink"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      setFormData({ ...formData, sku: generateSku() })
                    }
                    className="shrink-0 border-primary-pink/30 text-primary-pink hover:bg-primary-pink/10"
                  >
                    Tạo SKU
                  </Button>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="shortDesc">Mô tả ngắn</Label>
              <Textarea
                id="shortDesc"
                value={formData.shortDesc}
                onChange={(e) =>
                  setFormData({ ...formData, shortDesc: e.target.value })
                }
                placeholder="Mô tả ngắn về sản phẩm (hiển thị trên danh sách)"
                rows={3}
                className="focus:ring-primary-pink focus:border-primary-pink"
              />
            </div>
            </div>
          </div>

          {/* Category & Brand Section */}
          <div className="space-y-4">
            <h3 className={`font-semibold ${PRIMARY_PINK_THEME.text}`}>Phân loại</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Danh mục <span className="text-primary-pink">*</span></Label>
                <Select
                  value={formData.categoryIds[0] || ''}
                  onValueChange={(value) =>
                    setFormData({ ...formData, categoryIds: [value] })
                  }
                >
                  <SelectTrigger className="focus:ring-primary-pink focus:border-primary-pink">
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockAdminCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Thương hiệu <span className="text-primary-pink">*</span></Label>
                <Select
                  value={formData.brandId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, brandId: value })
                  }
                >
                  <SelectTrigger className="focus:ring-primary-pink focus:border-primary-pink">
                    <SelectValue placeholder="Chọn thương hiệu" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockAdminBrands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="space-y-4">
            <h3 className={`font-semibold ${PRIMARY_PINK_THEME.text}`}>Giá bán</h3>
            <div className="grid grid-cols-2 gap-4">
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
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        basePrice: parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder="0"
                    className="pr-12 focus:ring-primary-pink focus:border-primary-pink"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    ₫
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="comparePrice">Giá so sánh (gạch ngang)</Label>
                <div className="relative">
                  <Input
                    id="comparePrice"
                    type="number"
                    min="0"
                    value={formData.comparePrice || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        comparePrice: parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder="0"
                    className="pr-12 focus:ring-primary-pink focus:border-primary-pink"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    ₫
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Inventory Section */}
          <div className="space-y-4">
            <h3 className={`font-semibold ${PRIMARY_PINK_THEME.text}`}>Kho hàng</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stock">Số lượng tồn kho</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  value={formData.stock || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      stock: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="0"
                  className="focus:ring-primary-pink focus:border-primary-pink"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lowStockThreshold">Ngưỡng cảnh báo hết hàng</Label>
                <Input
                  id="lowStockThreshold"
                  type="number"
                  min="0"
                  value={formData.lowStockThreshold || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      lowStockThreshold: parseInt(e.target.value) || 10,
                    })
                  }
                  placeholder="10"
                  className="focus:ring-primary-pink focus:border-primary-pink"
                />
              </div>
            </div>
          </div>

          {/* Options Section */}
          <div className="space-y-4">
            <h3 className={`font-semibold ${PRIMARY_PINK_THEME.text}`}>Tùy chọn</h3>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between p-4 rounded-lg border border-primary-pink/20 bg-primary-pink/5">
                <div>
                  <Label htmlFor="isActive" className="font-medium">
                    Đăng bán ngay
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Sản phẩm sẽ hiển thị trên website
                  </p>
                </div>
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isActive: checked })
                  }
                  className="data-[state=checked]:bg-primary-pink"
                />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border border-primary-pink/20 bg-primary-pink/5">
                <div>
                  <Label htmlFor="isFeatured" className="font-medium">
                    Sản phẩm nổi bật
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Hiển thị trong danh sách sản phẩm nổi bật
                  </p>
                </div>
                <Switch
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isFeatured: checked })
                  }
                  className="data-[state=checked]:bg-primary-pink"
                />
              </div>
            </div>
          </div>

        <DialogFooter className="pt-4 border-t border-primary-pink/20">
          <Button variant="outline" onClick={handleClose} className="border-primary-pink/30 text-primary-pink hover:bg-primary-pink/10">
            Hủy
          </Button>
          <Button
            variant="primary-pink"
            onClick={handleSubmit}
            disabled={!formData.name || !formData.categoryIds.length || !formData.brandId}
          >
            <Package className="mr-2 h-4 w-4" />
            Thêm sản phẩm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
