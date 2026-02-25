'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { mockAdminCategories, mockAdminBrands } from '@/lib/mock-data/admin';

interface AddProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddProductDialog({
  open,
  onOpenChange,
}: AddProductDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    shortDesc: '',
    basePrice: '',
    comparePrice: '',
    categoryId: '',
    brandId: '',
    stock: '',
    lowStockThreshold: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating new product:', formData);
    // TODO: API call to create product
    onOpenChange(false);
    // Reset form
    setFormData({
      name: '',
      sku: '',
      shortDesc: '',
      basePrice: '',
      comparePrice: '',
      categoryId: '',
      brandId: '',
      stock: '',
      lowStockThreshold: '',
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thêm sản phẩm mới</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {/* Product Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="required">
              Tên sản phẩm
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Nhập tên sản phẩm"
              required
            />
          </div>

          {/* SKU */}
          <div className="space-y-2">
            <Label htmlFor="sku" className="required">
              SKU
            </Label>
            <Input
              id="sku"
              value={formData.sku}
              onChange={(e) => handleChange('sku', e.target.value)}
              placeholder="VD: SER-VIT-001"
              required
            />
          </div>

          {/* Short Description */}
          <div className="space-y-2">
            <Label htmlFor="shortDesc">Mô tả ngắn</Label>
            <Textarea
              id="shortDesc"
              value={formData.shortDesc}
              onChange={(e) => handleChange('shortDesc', e.target.value)}
              placeholder="Mô tả ngắn về sản phẩm"
              rows={3}
            />
          </div>

          {/* Price Group */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="basePrice" className="required">
                Giá bán (₫)
              </Label>
              <Input
                id="basePrice"
                type="number"
                min="0"
                step="1000"
                value={formData.basePrice}
                onChange={(e) => handleChange('basePrice', e.target.value)}
                placeholder="0"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="comparePrice">Giá so sánh (₫)</Label>
              <Input
                id="comparePrice"
                type="number"
                min="0"
                step="1000"
                value={formData.comparePrice}
                onChange={(e) => handleChange('comparePrice', e.target.value)}
                placeholder="0"
              />
            </div>
          </div>

          {/* Category & Brand */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category" className="required">
                Danh mục
              </Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) => handleChange('categoryId', value)}
                required
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  {mockAdminCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand" className="required">
                Thương hiệu
              </Label>
              <Select
                value={formData.brandId}
                onValueChange={(value) => handleChange('brandId', value)}
                required
              >
                <SelectTrigger id="brand">
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

          {/* Inventory Group */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stock" className="required">
                Số lượng tồn kho
              </Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => handleChange('stock', e.target.value)}
                placeholder="0"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lowStockThreshold" className="required">
                Ngưỡng cảnh báo
              </Label>
              <Input
                id="lowStockThreshold"
                type="number"
                min="0"
                value={formData.lowStockThreshold}
                onChange={(e) =>
                  handleChange('lowStockThreshold', e.target.value)
                }
                placeholder="0"
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button type="submit" variant="primary-pink">
              Tạo sản phẩm
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
