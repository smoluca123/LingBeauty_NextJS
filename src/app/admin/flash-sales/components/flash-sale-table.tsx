'use client';

import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Zap,
  Clock,
  Package,
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
import type { IFlashSaleDataType } from '@/lib/types/interfaces/apis/flash-sale.interfaces';
import {
  FLASH_SALE_COMPUTED_STATUS,
  getFlashSaleComputedStatus,
} from '@/app/admin/flash-sales/constants';
import { useCountdown } from '@/hooks/use-countdown';

interface FlashSaleTableProps {
  flashSales: IFlashSaleDataType[];
  onEdit: (flashSale: IFlashSaleDataType) => void;
  onDelete: (flashSale: IFlashSaleDataType) => void;
  onManageProducts?: (flashSale: IFlashSaleDataType) => void;
}

// Countdown cell component
function CountdownCell({ flashSale }: { flashSale: IFlashSaleDataType }) {
  const now = new Date();
  const startTime = new Date(flashSale.startTime);
  const endTime = new Date(flashSale.endTime);

  const isUpcoming = now < startTime;
  const targetDate = isUpcoming ? startTime : endTime;
  const label = isUpcoming ? 'Bắt đầu sau' : 'Còn lại';

  const { formatted, isExpired } = useCountdown({
    targetDate,
    interval: 1000,
  });

  if (isExpired) {
    return <span className='text-muted-foreground text-sm'>—</span>;
  }

  return (
    <div className='flex flex-col gap-1'>
      <span className='text-xs text-muted-foreground'>{label}</span>
      <span className='font-mono text-sm font-medium text-primary-pink'>
        {formatted}
      </span>
    </div>
  );
}

export function FlashSaleTable({
  flashSales,
  onEdit,
  onDelete,
  onManageProducts,
}: FlashSaleTableProps) {
  return (
    <div className='rounded-lg border bg-card w-full overflow-x-auto'>
      <Table className='min-w-max'>
        <TableHeader>
          <TableRow>
            <TableHead className='min-w-[180px]'>Tên Flash Sale</TableHead>
            <TableHead className='w-[120px]'>Thời gian</TableHead>
            <TableHead className='w-[140px]'>Đếm ngược</TableHead>
            <TableHead className='hidden md:table-cell w-[100px]'>
              Sản phẩm
            </TableHead>
            <TableHead className='hidden sm:table-cell w-[120px]'>
              Trạng thái
            </TableHead>
            <TableHead className='w-20 text-right'>Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {flashSales.map((flashSale) => {
            const computedStatus = getFlashSaleComputedStatus(
              flashSale.status,
              flashSale.isActive,
              flashSale.startTime,
              flashSale.endTime,
            );
            const statusConfig = FLASH_SALE_COMPUTED_STATUS[computedStatus];
            const productCount = flashSale.products?.length ?? 0;

            return (
              <TableRow key={flashSale.id}>
                {/* Name */}
                <TableCell>
                  <div className='flex flex-col gap-1'>
                    <div className='flex items-center gap-2'>
                      <Zap className='h-4 w-4 text-yellow-500 shrink-0' />
                      <span className='font-semibold text-sm'>
                        {flashSale.name}
                      </span>
                    </div>
                    {flashSale.description && (
                      <span className='text-xs text-muted-foreground line-clamp-1 max-w-[200px]'>
                        {flashSale.description}
                      </span>
                    )}
                    <span className='text-xs text-muted-foreground font-mono'>
                      /{flashSale.slug}
                    </span>
                  </div>
                </TableCell>

                {/* Time Period */}
                <TableCell>
                  <div className='flex flex-col gap-1 text-xs'>
                    <div className='flex items-center gap-1.5 text-muted-foreground'>
                      <Calendar className='h-3 w-3' />
                      <span>
                        {new Date(flashSale.startTime).toLocaleDateString(
                          'vi-VN',
                        )}
                      </span>
                    </div>
                    <div className='flex items-center gap-1.5 text-muted-foreground'>
                      <Clock className='h-3 w-3' />
                      <span>
                        {new Date(flashSale.startTime).toLocaleTimeString(
                          'vi-VN',
                          { hour: '2-digit', minute: '2-digit' },
                        )}
                        {' - '}
                        {new Date(flashSale.endTime).toLocaleTimeString(
                          'vi-VN',
                          { hour: '2-digit', minute: '2-digit' },
                        )}
                      </span>
                    </div>
                  </div>
                </TableCell>

                {/* Countdown */}
                <TableCell>
                  <CountdownCell flashSale={flashSale} />
                </TableCell>

                {/* Product Count */}
                <TableCell className='hidden md:table-cell'>
                  <div className='flex items-center gap-2'>
                    <Package className='h-4 w-4 text-muted-foreground' />
                    <span className='text-sm font-medium'>{productCount}</span>
                  </div>
                </TableCell>

                {/* Status */}
                <TableCell className='hidden sm:table-cell'>
                  <Badge
                    variant={statusConfig.variant}
                    className={`${statusConfig.color} ${statusConfig.bgColor}`}
                  >
                    {statusConfig.label}
                  </Badge>
                </TableCell>

                {/* Actions */}
                <TableCell className='text-right'>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='ghost' size='icon' className='h-8 w-8'>
                        <MoreHorizontal className='h-4 w-4' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end' className='w-48'>
                      <DropdownMenuItem onClick={() => onEdit(flashSale)}>
                        <Pencil className='h-4 w-4 mr-2' />
                        Chỉnh sửa
                      </DropdownMenuItem>
                      {onManageProducts && (
                        <DropdownMenuItem
                          onClick={() => onManageProducts(flashSale)}
                        >
                          <Package className='h-4 w-4 mr-2' />
                          Quản lý sản phẩm
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onDelete(flashSale)}
                        className='text-destructive focus:text-destructive'
                      >
                        <Trash2 className='h-4 w-4 mr-2' />
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
