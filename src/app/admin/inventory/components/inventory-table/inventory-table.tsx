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
import { InventoryItem, getStatusBadge } from './helpers';

interface InventoryTableProps {
  inventory: InventoryItem[];
  onAdjust: (item: InventoryItem) => void;
}

export function InventoryTable({ inventory, onAdjust }: InventoryTableProps) {
  return (
    <div className="rounded-lg border bg-card max-h-[50vh] overflow-auto">
      <Table className="min-w-max">
        <TableHeader>
          <TableRow>
            <TableHead className="w-20">Ảnh</TableHead>
            <TableHead>Sản phẩm</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead className="text-center">Số lượng</TableHead>
            <TableHead className="text-center">Ngưỡng cảnh báo</TableHead>
            <TableHead className="text-center">Trạng thái</TableHead>
            <TableHead className="w-25"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inventory.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                Không tìm thấy sản phẩm nào.
              </TableCell>
            </TableRow>
          ) : (
            inventory.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="relative h-12 w-12 overflow-hidden rounded-md bg-muted">
                    <Image
                      src={item.productImage || '/images/placeholder.png'}
                      alt={item.productName}
                      fill
                      className="object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  {item.productName}
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {item.productSku}
                </TableCell>
                <TableCell className="text-center">
                  <span
                    className={
                      item.quantity <= item.lowStockThreshold
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
                <TableCell className="text-center">
                  {getStatusBadge(item.status)}
                </TableCell>
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
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
