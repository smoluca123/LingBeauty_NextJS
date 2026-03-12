'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MoreHorizontal, Pencil, Trash2, Eye, Images, Sliders, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  IAdminProductDataType,
  getTotalStock,
  getPrimaryImageUrl,
  getFirstCategory,
} from '@/lib/types/interfaces/apis/admin-product.interfaces';
import { ProductImagesDialog } from '../product-images-dialog';
import { ProductVariantsDialog } from '../product-variants-dialog';
import { ProductBadgesDialog } from '../product-badges-dialog';
import { EditProductDialog } from '../edit-product-dialog';
import { formatPrice, getStockStatus } from './helpers';

// ============ Types ============

interface ProductTableProps {
  products: IAdminProductDataType[];
  onDelete: (product: IAdminProductDataType) => void;
}

// ============ Component ============

export function ProductTable({ products, onDelete }: ProductTableProps) {
  const [imagesProduct, setImagesProduct] =
    useState<IAdminProductDataType | null>(null);
  const [variantProduct, setVariantProduct] =
    useState<IAdminProductDataType | null>(null);
  const [editProduct, setEditProduct] =
    useState<IAdminProductDataType | null>(null);
  const [badgeProduct, setBadgeProduct] =
    useState<IAdminProductDataType | null>(null);

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">Không tìm thấy sản phẩm nào</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-lg border bg-card max-h-full overflow-auto">
        <Table className="min-w-max">
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Ảnh</TableHead>
              <TableHead className="min-w-50">Sản phẩm</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead className="text-center">Giá</TableHead>
              <TableHead className="text-center">Tồn kho</TableHead>
              <TableHead className="text-center">Trạng thái</TableHead>
              <TableHead className="w-12.5"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => {
              const stock = getTotalStock(product);
              const stockStatus = getStockStatus(stock);
              const category = getFirstCategory(product);

              return (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="relative h-10 w-10 md:h-12 md:w-12 overflow-hidden rounded-md bg-muted shrink-0">
                      <Image
                        src={getPrimaryImageUrl(product)}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium">{product.name}</p>
                      {category && (
                        <p className="text-sm text-muted-foreground">
                          {category.name}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                      {product.sku}
                    </code>
                  </TableCell>
                  <TableCell className="text-center">
                    {formatPrice(product.basePrice)}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="font-medium">{stock}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={stockStatus.variant}>
                      {stockStatus.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/products/${product.slug}`} target='_blank'>
                            <Eye className="mr-2 h-4 w-4" />
                            Xem chi tiết
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setEditProduct(product)}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setImagesProduct(product)}
                        >
                          <Images className="mr-2 h-4 w-4" />
                          Quản lý ảnh
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setVariantProduct(product)}
                        >
                          <Sliders className="mr-2 h-4 w-4" />
                          Chỉnh sửa biến thể
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setBadgeProduct(product)}
                        >
                          <Tag className="mr-2 h-4 w-4" />
                          Quản lý badge
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onDelete(product)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Product Images Dialog */}
      {imagesProduct && (
        <ProductImagesDialog
          productId={imagesProduct.id}
          productName={imagesProduct.name}
          open={!!imagesProduct}
          onOpenChange={(open: boolean) => {
            if (!open) setImagesProduct(null);
          }}
        />
      )}

      {/* Product Variants Dialog */}
      {variantProduct && (
        <ProductVariantsDialog
          productId={variantProduct.id}
          productName={variantProduct.name}
          open={!!variantProduct}
          onOpenChange={(open) => {
            if (!open) setVariantProduct(null);
          }}
        />
      )}

      {/* Edit Product Dialog */}
      {editProduct && (
        <EditProductDialog
          product={editProduct}
          open={!!editProduct}
          onOpenChange={(open) => {
            if (!open) setEditProduct(null);
          }}
        />
      )}
      {/* Product Badges Dialog */}
      {badgeProduct && (
        <ProductBadgesDialog
          productId={badgeProduct.id}
          productName={badgeProduct.name}
          open={!!badgeProduct}
          onOpenChange={(open) => {
            if (!open) setBadgeProduct(null);
          }}
        />
      )}
    </>
  );
}
