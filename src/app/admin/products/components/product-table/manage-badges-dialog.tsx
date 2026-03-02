'use client';

import { useState } from 'react';
import { Pencil, Trash2, Loader2, Plus, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { IAdminProductDataType } from '@/lib/types/interfaces/apis/admin-product.interfaces';
import { IProductBadgeDataType } from '@/lib/types/interfaces/apis/product.interfaces';
import { useProductBadges, useDeleteBadge } from '../../hooks';
import { EditBadgeDialog } from './edit-badge-dialog';
import { AddBadgeDialog } from './add-badge-dialog';

// ─── Constants ────────────────────────────────────────────────────────────────

const BADGE_TYPE_LABEL: Record<string, string> = {
  NEW: 'Mới',
  SALE: 'Giảm giá',
  BEST_SELLER: 'Bán chạy',
  FREESHIPPING: 'Miễn phí ship',
};

const BADGE_VARIANT_MAP: Record<string, 'default' | 'secondary' | 'outline'> = {
  PRIMARY: 'default',
  INFO: 'secondary',
  NEUTRAL: 'outline',
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface ManageBadgesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: IAdminProductDataType | null;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ManageBadgesDialog({
  open,
  onOpenChange,
  product,
}: ManageBadgesDialogProps) {
  const productId = product?.id ?? '';

  const { data, isLoading } = useProductBadges(open ? productId : undefined);
  const badges = (data?.data ?? []) as IProductBadgeDataType[];

  const deleteBadgeMutation = useDeleteBadge(productId);

  // ─── Selection state ───
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  // ─── Nested dialog state ───
  const [editTarget, setEditTarget] = useState<IProductBadgeDataType | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);

  // ─── Selection handlers ───
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedIds.size === badges.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(badges.map((b) => b.id)));
    }
  };

  // ─── Actions ───
  const handleEdit = (badge: IProductBadgeDataType) => {
    setEditTarget(badge);
    setEditOpen(true);
  };

  const handleDelete = (badge: IProductBadgeDataType) => {
    setDeletingId(badge.id);
    deleteBadgeMutation.mutate(badge.id, {
      onSuccess: () => {
        toast.success(`Đã xóa nhãn "${badge.name}"!`);
        setDeletingId(null);
        setSelectedIds((prev) => {
          const next = new Set(prev);
          next.delete(badge.id);
          return next;
        });
      },
      onError: (error) => {
        toast.error(
          error instanceof Error ? error.message : 'Không thể xóa nhãn.',
        );
        setDeletingId(null);
      },
    });
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    setBulkDeleting(true);

    const ids = Array.from(selectedIds);
    let successCount = 0;

    for (const id of ids) {
      try {
        await deleteBadgeMutation.mutateAsync(id);
        successCount++;
      } catch {
        // Continue deleting other items
      }
    }

    if (successCount > 0) {
      toast.success(`Đã xóa ${successCount} nhãn thành công!`);
    }
    if (successCount < ids.length) {
      toast.error(`Không thể xóa ${ids.length - successCount} nhãn.`);
    }

    setSelectedIds(new Set());
    setBulkDeleting(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle>Quản lý nhãn — {product?.name}</DialogTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {badges.length} nhãn
                </p>
              </div>
              <Button
                variant="primary-pink"
                size="sm"
                onClick={() => setAddOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Thêm nhãn
              </Button>
            </div>
          </DialogHeader>

          {/* Bulk action bar */}
          {selectedIds.size > 0 && (
            <div className="flex items-center gap-3 px-3 py-2 rounded-md bg-muted/50 border">
              <span className="text-sm text-muted-foreground">
                Đã chọn {selectedIds.size} nhãn
              </span>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
                disabled={bulkDeleting}
              >
                {bulkDeleting ? (
                  <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Trash2 className="mr-2 h-3.5 w-3.5" />
                )}
                Xóa đã chọn
              </Button>
            </div>
          )}

          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : badges.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                <p className="font-medium">Chưa có nhãn nào</p>
                <p className="text-sm mt-1">
                  Nhấn &ldquo;Thêm nhãn&rdquo; để tạo mới.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">
                      <Checkbox
                        checked={
                          badges.length > 0 && selectedIds.size === badges.length
                        }
                        onCheckedChange={toggleAll}
                      />
                    </TableHead>
                    <TableHead>Tên nhãn</TableHead>
                    <TableHead className="text-center">Loại</TableHead>
                    <TableHead className="text-center">Kiểu hiển thị</TableHead>
                    <TableHead className="text-center">Thứ tự</TableHead>
                    <TableHead className="text-center">Trạng thái</TableHead>
                    <TableHead className="w-24" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {badges.map((badge) => (
                    <TableRow key={badge.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.has(badge.id)}
                          onCheckedChange={() => toggleSelect(badge.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        <Badge variant={BADGE_VARIANT_MAP[badge.variant] ?? 'outline'}>
                          {badge.name}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-sm">
                          {BADGE_TYPE_LABEL[badge.type] ?? badge.type}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                          {badge.variant}
                        </code>
                      </TableCell>
                      <TableCell className="text-center">
                        {badge.sortOrder}
                      </TableCell>
                      <TableCell className="text-center">
                        {badge.isActive ? (
                          <div className="flex items-center justify-center gap-1 text-green-600 text-xs">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Đang bật
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-1 text-muted-foreground text-xs">
                            <XCircle className="h-3.5 w-3.5" />
                            Đã tắt
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleEdit(badge)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => handleDelete(badge)}
                            disabled={deletingId === badge.id}
                          >
                            {deletingId === badge.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="h-3.5 w-3.5" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Nested edit dialog */}
      <EditBadgeDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        productId={productId}
        badge={editTarget}
      />

      {/* Nested add dialog */}
      <AddBadgeDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        productId={productId}
      />
    </>
  );
}
