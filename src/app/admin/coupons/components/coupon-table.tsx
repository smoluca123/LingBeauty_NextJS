'use client';

import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Ticket,
  Percent,
  Banknote,
  Users,
  Calendar,
} from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import type { ICouponDataType } from '@/lib/types/interfaces/apis/coupon.interfaces';
import {
  COUPON_STATUS,
  formatCouponValue,
  formatCurrency,
  getCouponStatus,
  calculateUsagePercentage,
} from '@/app/admin/coupons/constants';

interface CouponTableProps {
  coupons: ICouponDataType[];
  onEdit: (coupon: ICouponDataType) => void;
  onDelete: (coupon: ICouponDataType) => void;
}

export function CouponTable({ coupons, onEdit, onDelete }: CouponTableProps) {
  return (
    <div className='rounded-lg border bg-card w-full overflow-x-auto'>
      <Table className='min-w-max'>
        <TableHeader>
          <TableRow>
            <TableHead className='min-w-[120px]'>Mã giảm giá</TableHead>
            <TableHead className='w-[100px]'>Loại</TableHead>
            <TableHead className='w-[120px]'>Giá trị</TableHead>
            <TableHead className='hidden md:table-cell w-[140px]'>
              Đơn tối thiểu
            </TableHead>
            <TableHead className='hidden lg:table-cell w-[140px]'>
              Giảm tối đa
            </TableHead>
            <TableHead className='hidden sm:table-cell min-w-40'>
              Thời hạn
            </TableHead>
            <TableHead className='hidden md:table-cell w-[120px]'>
              Sử dụng
            </TableHead>
            <TableHead className='w-[100px]'>Trạng thái</TableHead>
            <TableHead className='text-right w-[72px]'>Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {coupons.map((coupon) => {
            const status = getCouponStatus(
              coupon.isActive,
              coupon.startDate,
              coupon.endDate,
              coupon.usedCount,
              coupon.usageLimit,
            );
            const statusConfig = COUPON_STATUS[status];
            const usagePercentage = calculateUsagePercentage(
              coupon.usedCount,
              coupon.usageLimit,
            );

            return (
              <TableRow key={coupon.id}>
                {/* Code */}
                <TableCell>
                  <div className='flex items-center gap-2'>
                    <Ticket className='h-4 w-4 text-muted-foreground shrink-0' />
                    <span className='font-mono font-semibold text-sm'>
                      {coupon.code}
                    </span>
                  </div>
                </TableCell>

                {/* Type */}
                <TableCell>
                  <Badge
                    variant={
                      coupon.type === 'PERCENTAGE'
                        ? 'primary-pink'
                        : 'secondary'
                    }
                    className='flex items-center gap-1 w-fit'
                  >
                    {coupon.type === 'PERCENTAGE' ? (
                      <Percent className='h-3 w-3' />
                    ) : (
                      <Banknote className='h-3 w-3' />
                    )}
                    {coupon.type === 'PERCENTAGE' ? '%' : 'VNĐ'}
                  </Badge>
                </TableCell>

                {/* Value */}
                <TableCell>
                  <span className='font-medium'>
                    {formatCouponValue(coupon.type, coupon.value)}
                  </span>
                </TableCell>

                {/* Min Purchase */}
                <TableCell className='hidden md:table-cell'>
                  <span className='text-sm text-muted-foreground'>
                    {formatCurrency(coupon.minPurchase)}
                  </span>
                </TableCell>

                {/* Max Discount */}
                <TableCell className='hidden lg:table-cell'>
                  {coupon.maxDiscount !== undefined &&
                  coupon.maxDiscount !== null ? (
                    <span className='text-sm'>
                      {formatCurrency(coupon.maxDiscount)}
                    </span>
                  ) : (
                    <span className='text-sm text-muted-foreground'>—</span>
                  )}
                </TableCell>

                {/* Valid Period */}
                <TableCell className='hidden sm:table-cell'>
                  <div className='flex flex-col gap-1 text-xs'>
                    <div className='flex items-center gap-1.5 text-muted-foreground'>
                      <Calendar className='h-3 w-3' />
                      <span>
                        {new Date(coupon.startDate).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    <div className='flex items-center gap-1.5 text-muted-foreground'>
                      <span className='w-3 text-center'>→</span>
                      <span>
                        {new Date(coupon.endDate).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  </div>
                </TableCell>

                {/* Usage */}
                <TableCell className='hidden md:table-cell'>
                  <div className='flex flex-col gap-1.5 w-full min-w-[100px]'>
                    <div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
                      <Users className='h-3 w-3' />
                      <span>
                        {coupon.usedCount}
                        {coupon.usageLimit ? ` / ${coupon.usageLimit}` : ''}
                      </span>
                    </div>
                    {coupon.usageLimit && (
                      <Progress value={usagePercentage} className='h-1.5' />
                    )}
                  </div>
                </TableCell>

                {/* Status */}
                <TableCell>
                  <Badge variant={statusConfig.variant} className='text-xs'>
                    {statusConfig.label}
                  </Badge>
                </TableCell>

                {/* Actions */}
                <TableCell className='text-right'>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='ghost' size='icon' aria-label='Thao tác'>
                        <MoreHorizontal className='h-4 w-4' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <DropdownMenuItem onClick={() => onEdit(coupon)}>
                        <Pencil className='h-4 w-4 mr-2' />
                        Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onDelete(coupon)}
                        className='text-destructive focus:text-destructive'
                      >
                        <Trash2 className='h-4 w-4 mr-2' />
                        Xóa mã
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
