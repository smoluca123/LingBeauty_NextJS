import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { InventoryRow, isVariantRow, getDetailedStatus, getStatusBadge } from './helpers';

interface InventoryTableProps {
  inventory: InventoryRow[];
  onAdjust: (item: InventoryRow) => void;
}

export function InventoryTable({ inventory, onAdjust }: InventoryTableProps) {
  return (
    <div className="rounded-lg border bg-card max-h-full overflow-auto">
      <Table className="min-w-max">
        <TableHeader>
          <TableRow>
            <TableHead className="w-20">Ảnh</TableHead>
            <TableHead>Sản phẩm</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Biến thể</TableHead>
            <TableHead className="text-center">Số lượng</TableHead>
            <TableHead className="text-center">Ngưỡng cảnh báo</TableHead>
            <TableHead className="text-center">Trạng thái</TableHead>
            <TableHead className="w-28" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {inventory.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                Không có sản phẩm nào.
              </TableCell>
            </TableRow>
          ) : (
            inventory.map((item) => {
              const isVariant = isVariantRow(item);
              const status = getDetailedStatus(item);

              // Lấy ảnh từ images array (BE trả về images[0].media.url, không phải primaryImage string)
              const productImage = item.product?.images?.[0]?.media?.url ?? null;
              // Với variant, ưu tiên ảnh variant, fallback về ảnh product
              const variantImage = isVariant
                ? (item.variant?.images?.[0]?.media?.url ?? productImage)
                : productImage;
              const displayImage = variantImage ?? '/images/placeholder.png';

              return (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="relative h-12 w-12 overflow-hidden rounded-md bg-muted">
                      <Image
                        src={displayImage}
                        alt={item.product?.name ?? ''}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium leading-snug">{item.product?.name}</span>
                      {item.product?.brand?.name && (
                        <span className="text-xs text-muted-foreground">{item.product.brand.name}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{item.product?.sku}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {isVariant ? (
                      <div className="flex flex-col gap-0.5">
                        <span>{item.variant.name}</span>
                        {item.variant.sku && (
                          <span className="font-mono text-xs opacity-70">{item.variant.sku}</span>
                        )}
                      </div>
                    ) : (
                      <span className="italic">Đơn giản</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={
                        item.quantity > 0 && item.quantity <= item.lowStockThreshold
                          ? 'font-bold text-orange-500'
                          : item.quantity === 0
                            ? 'font-bold text-destructive'
                            : ''
                      }
                    >
                      {item.quantity}
                    </span>
                  </TableCell>
                  <TableCell className="text-center text-muted-foreground">
                    {item.lowStockThreshold}
                  </TableCell>
                  <TableCell className="text-center">{getStatusBadge(status)}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onAdjust(item)}
                    >
                      Điều chỉnh
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
