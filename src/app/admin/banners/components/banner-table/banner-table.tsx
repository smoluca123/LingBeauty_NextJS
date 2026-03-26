'use client'

import { Pencil, Trash2, Type, ImageIcon } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { IBannerDataType } from '@/lib/types/interfaces/apis/banner.interfaces'
import Image from 'next/image'
import { getPositionLabel } from '@/app/admin/banners/constants'

interface BannerTableProps {
  banners: Array<IBannerDataType & { groupId?: string; groupName?: string }>
  onEdit: (banner: IBannerDataType & { groupId?: string }) => void
  onDelete: (banner: IBannerDataType & { groupId?: string }) => void
}

export function BannerTable({ banners, onEdit, onDelete }: BannerTableProps) {
  return (
    <div className="rounded-lg border bg-card w-full overflow-x-auto">
      <Table className="min-w-max">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[72px]">Hình ảnh</TableHead>
            <TableHead className="min-w-[180px]">Thông tin</TableHead>
            <TableHead className="hidden sm:table-cell min-w-[120px]">
              Nhóm
            </TableHead>
            <TableHead className="w-[100px]">Loại</TableHead>
            <TableHead className="hidden md:table-cell w-[140px]">
              Vị trí
            </TableHead>
            {/* <TableHead className='hidden sm:table-cell w-20'>Thứ tự</TableHead> */}
            <TableHead className="w-[100px]">Trạng thái</TableHead>
            <TableHead className="text-right w-[90px]">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {banners.map((banner) => (
            <TableRow key={banner.id}>
              {/* Image */}
              <TableCell>
                {banner.imageMedia?.url ? (
                  <Image
                    src={banner.imageMedia.url}
                    alt={banner.title ?? 'Banner'}
                    width={64}
                    height={48}
                    className="h-12 w-16 rounded-md object-cover border"
                  />
                ) : (
                  <div className="h-12 w-16 rounded-md bg-muted flex items-center justify-center">
                    {banner.type === 'TEXT' ? (
                      <Type className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ImageIcon className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                )}
              </TableCell>

              {/* Info */}
              <TableCell>
                <div className="flex flex-col gap-0.5">
                  {banner.badge && (
                    <Badge variant="outline" className="text-xs w-fit">
                      {banner.badge}
                    </Badge>
                  )}
                  {banner.title && (
                    <span className="font-medium text-sm">{banner.title}</span>
                  )}
                  {banner.description && (
                    <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                      {banner.description}
                    </span>
                  )}
                </div>
              </TableCell>

              {/* Group */}
              <TableCell className="hidden sm:table-cell">
                <Badge variant="secondary" className="text-xs">
                  {banner.groupName ?? '—'}
                </Badge>
              </TableCell>

              {/* Type */}
              <TableCell>
                <Badge
                  variant={
                    banner.type === 'TEXT' ? 'primary-pink' : 'secondary'
                  }
                >
                  {banner.type === 'TEXT' ? 'Text' : 'Hình ảnh'}
                </Badge>
              </TableCell>

              {/* Position */}
              <TableCell className="hidden md:table-cell">
                <span className="text-sm">
                  {getPositionLabel(banner.position)}
                </span>
              </TableCell>

              {/* Sort Order */}
              {/* <TableCell className="hidden sm:table-cell">
                <Badge variant="outline">{banner.sortOrder}</Badge>
              </TableCell> */}

              {/* Status */}
              <TableCell>
                <Badge variant={banner.isActive ? 'primary-pink' : 'secondary'}>
                  {banner.isActive ? 'Hoạt động' : 'Tạm ẩn'}
                </Badge>
              </TableCell>

              {/* Actions */}
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(banner)}
                    aria-label="Chỉnh sửa"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(banner)}
                    aria-label="Xóa"
                    className="text-destructive hover:text-destructive"
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
  )
}
