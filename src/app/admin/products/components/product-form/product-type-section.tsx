'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ExternalLink, Info } from 'lucide-react'
import type { IProductFormData } from '@/lib/types/interfaces/apis/admin-product.interfaces'
import type { ProductType } from '@/lib/types/interfaces/apis/product.interfaces'

interface ProductTypeSectionProps {
  formData: IProductFormData
  onFieldChange: <K extends keyof IProductFormData>(
    field: K,
    value: IProductFormData[K],
  ) => void
}

export function ProductTypeSection({
  formData,
  onFieldChange,
}: ProductTypeSectionProps) {
  const productType = (formData.productType as ProductType) || 'INVENTORY'
  const isAffiliate = productType === 'AFFILIATE'

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-primary-pink">Loại sản phẩm</h3>

      {/* Product Type Selector */}
      <div className="space-y-2">
        <Label htmlFor="productType">
          Loại sản phẩm <span className="text-primary-pink">*</span>
        </Label>
        <Select
          value={productType}
          onValueChange={(value: ProductType) => {
            onFieldChange('productType', value)
            // Clear affiliate fields when switching to inventory
            if (value === 'INVENTORY') {
              onFieldChange('affiliateLink', '')
              onFieldChange('affiliateSource', '')
            }
          }}
        >
          <SelectTrigger className="focus:ring-primary-pink focus:border-primary-pink">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="INVENTORY">Sản phẩm trong kho</SelectItem>
            <SelectItem value="AFFILIATE">Sản phẩm Affiliate</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          {isAffiliate
            ? 'Sản phẩm từ đối tác bên thứ 3 (Shopee, Lazada, Tiki...)'
            : 'Sản phẩm có trong kho của bạn'}
        </p>
      </div>

      {/* Affiliate Fields */}
      {isAffiliate && (
        <>
          <Alert className="border-blue-200 bg-blue-50">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-sm text-blue-900">
              Sản phẩm affiliate không cần quản lý kho và biến thể. Khách hàng
              sẽ được chuyển đến link affiliate khi nhấn &quot;Mua ngay&quot;.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="affiliateLink">
              Link Affiliate <span className="text-primary-pink">*</span>
            </Label>
            <div className="relative">
              <Input
                id="affiliateLink"
                type="url"
                value={formData.affiliateLink || ''}
                onChange={(e) => onFieldChange('affiliateLink', e.target.value)}
                placeholder="https://shopee.vn/product/..."
                className="focus:ring-primary-pink focus:border-primary-pink pr-10"
              />
              <ExternalLink className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">
              Link đến trang sản phẩm trên nền tảng affiliate
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="affiliateSource">Nguồn Affiliate</Label>
            <Select
              value={formData.affiliateSource || ''}
              onValueChange={(value) => onFieldChange('affiliateSource', value)}
            >
              <SelectTrigger className="focus:ring-primary-pink focus:border-primary-pink">
                <SelectValue placeholder="Chọn nguồn" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Shopee">Shopee</SelectItem>
                <SelectItem value="Lazada">Lazada</SelectItem>
                <SelectItem value="Tiki">Tiki</SelectItem>
                <SelectItem value="Sendo">Sendo</SelectItem>
                <SelectItem value="Amazon">Amazon</SelectItem>
                <SelectItem value="Other">Khác</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Tên nền tảng sẽ hiển thị cho khách hàng
            </p>
          </div>
        </>
      )}
    </div>
  )
}
