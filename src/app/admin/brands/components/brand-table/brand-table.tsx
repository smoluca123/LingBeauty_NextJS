'use client';

import { Pencil, Trash2, Globe, ExternalLink } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { IAdminBrandDataType } from '@/lib/types/interfaces/apis/admin-brand.interfaces';

interface BrandTableProps {
  brands: IAdminBrandDataType[];
  onEdit: (brand: IAdminBrandDataType) => void;
  onDelete: (brand: IAdminBrandDataType) => void;
}

export function BrandTable({ brands, onEdit, onDelete }: BrandTableProps) {
  return (
    <div className="rounded-lg border bg-card max-h-full overflow-auto">
      <Table className="min-w-max">
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Logo</TableHead>
            <TableHead>Tên thương hiệu</TableHead>
            <TableHead className="hidden md:table-cell">Slug</TableHead>
            <TableHead className="hidden lg:table-cell">Website</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="hidden sm:table-cell">Ngày tạo</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {brands.map((brand) => (
            <TableRow key={brand.id}>
              {/* Logo */}
              <TableCell>
                {brand.logoMedia?.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={brand.logoMedia.url}
                    alt={brand.name}
                    className="h-10 w-10 rounded-md object-cover border"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                    <span className="text-xs text-muted-foreground font-bold">
                      {brand.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </TableCell>

              {/* Name */}
              <TableCell className="font-medium">{brand.name}</TableCell>

              {/* Slug */}
              <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                {brand.slug}
              </TableCell>

              {/* Website */}
              <TableCell className="hidden lg:table-cell">
                {brand.website ? (
                  <a
                    href={brand.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    <Globe className="h-3 w-3" />
                    <span className="max-w-[140px] truncate">{brand.website}</span>
                    <ExternalLink className="h-3 w-3 shrink-0" />
                  </a>
                ) : (
                  <span className="text-muted-foreground text-sm">—</span>
                )}
              </TableCell>

              {/* isActive */}
              <TableCell>
                <Badge variant={brand.isActive ? 'default' : 'secondary'}>
                  {brand.isActive ? 'Hoạt động' : 'Tạm ẩn'}
                </Badge>
              </TableCell>

              {/* createdAt */}
              <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">
                {new Date(brand.createdAt).toLocaleDateString('vi-VN')}
              </TableCell>

              {/* Actions */}
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(brand)}
                    aria-label={`Chỉnh sửa ${brand.name}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => onDelete(brand)}
                    aria-label={`Xóa ${brand.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
