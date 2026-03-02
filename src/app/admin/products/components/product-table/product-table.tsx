import Link from 'next/link';
import Image from 'next/image';
import { MoreHorizontal, Pencil, Trash2, Eye, ImagePlus, Layers, Settings2, Tag } from 'lucide-react';
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
import { IAdminProductDataType } from '@/lib/types/interfaces/apis/admin-product.interfaces';
import { formatPrice } from './helpers';

interface ProductTableProps {
  products: IAdminProductDataType[];
  onEdit: (product: IAdminProductDataType) => void;
  onDelete: (product: IAdminProductDataType) => void;
  onUploadImage: (product: IAdminProductDataType) => void;
  onAddVariant: (product: IAdminProductDataType) => void;
  onManageVariants: (product: IAdminProductDataType) => void;
  onManageBadges: (product: IAdminProductDataType) => void;
}

export function ProductTable({ products, onEdit, onDelete, onUploadImage, onAddVariant, onManageVariants, onManageBadges }: ProductTableProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">Không tìm thấy sản phẩm nào</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card max-h-[50vh] overflow-auto">
      <Table className="min-w-max">
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Ảnh</TableHead>
              <TableHead className="min-w-50">Sản phẩm</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead className="text-center">Giá</TableHead>
              <TableHead className="text-center">Trạng thái</TableHead>
              <TableHead className="w-12.5"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => {
              const categoryNames = product.productCategories
                ?.map((pc) => pc.category.name)
                ?? product.categories?.map((c) => c.name)
                ?? [];

              return (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="relative h-10 w-10 md:h-12 md:w-12 overflow-hidden rounded-md bg-muted shrink-0">
                      <Image
                        src={product.primaryImage?.media.url || '/images/placeholder.png'}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium">{product.name}</p>
                      {categoryNames.length > 0 && (
                        <p className="text-sm text-muted-foreground">
                          {categoryNames.join(', ')}
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
                    <Badge variant={product.isActive ? 'primary-pink' : 'secondary'}>
                      {product.isActive ? 'Đang bán' : 'Ngừng bán'}
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
                          <Link href={`/admin/products/${product.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            Xem chi tiết
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(product)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onUploadImage(product)}>
                            <ImagePlus className="mr-2 h-4 w-4" />
                            Tải ảnh lên
                          </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onAddVariant(product)}>
                            <Layers className="mr-2 h-4 w-4" />
                            Thêm biến thể
                          </DropdownMenuItem>
                        {/* Only show manage option when product already has variants */}
                        {(product as { variants?: unknown[] }).variants?.length ? (
                          <DropdownMenuItem onClick={() => onManageVariants(product)}>
                            <Settings2 className="mr-2 h-4 w-4" />
                            Quản lý biến thể
                          </DropdownMenuItem>
                        ) : null}
                        <DropdownMenuItem onClick={() => onManageBadges(product)}>
                          <Tag className="mr-2 h-4 w-4" />
                          Quản lý nhãn
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
  );
}
