'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, Loader2, Check, X, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  useProductBadgesQuery,
  useAddProductBadgeMutation,
  useUpdateProductBadgeMutation,
  useDeleteProductBadgeMutation,
} from '@/hooks/querys/admin-product.query';
import type {
  IAdminProductBadge,
  ICreateProductBadgePayload,
  IUpdateProductBadgePayload,
  ProductBadgeVariant,
  ProductBadgeType,
} from '@/lib/types/interfaces/apis/admin-product.interfaces';

// ============ Constants ============

const BADGE_VARIANTS: { value: ProductBadgeVariant; label: string }[] = [
  { value: 'PRIMARY', label: 'Chính' },
  { value: 'INFO', label: 'Thông tin' },
  { value: 'NEUTRAL', label: 'Trung tính' },
];

const BADGE_TYPES: { value: ProductBadgeType; label: string }[] = [
  { value: 'NEW', label: 'Mới' },
  { value: 'SALE', label: 'Giảm giá' },
  { value: 'BEST_SELLER', label: 'Bán chạy' },
  { value: 'FREESHIPPING', label: 'Miễn ship' },
];

// ============ Helper ============

const VARIANT_BADGE_MAP: Record<ProductBadgeVariant, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  PRIMARY: 'default',
  INFO: 'secondary',
  NEUTRAL: 'outline',
};

function getBadgeVariant(variant?: ProductBadgeVariant) {
  if (!variant) return 'secondary';
  return VARIANT_BADGE_MAP[variant] ?? 'secondary';
}

function getVariantLabel(value?: ProductBadgeVariant) {
  return BADGE_VARIANTS.find((v) => v.value === value)?.label ?? value ?? '—';
}

function getTypeLabel(value?: ProductBadgeType) {
  return BADGE_TYPES.find((t) => t.value === value)?.label ?? value ?? '—';
}

// ============ Types ============

interface ProductBadgesDialogProps {
  productId: string;
  productName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface BadgeFormState {
  name: string;
  sortOrder: string;
  isActive: boolean;
  variant: ProductBadgeVariant | '';
  type: ProductBadgeType | '';
}

const EMPTY_FORM: BadgeFormState = {
  name: '',
  sortOrder: '0',
  isActive: true,
  variant: '',
  type: '',
};

const toBadgeFormState = (badge: IAdminProductBadge): BadgeFormState => ({
  name: badge.name,
  sortOrder: String(badge.sortOrder),
  isActive: badge.isActive,
  variant: badge.variant ?? '',
  type: badge.type ?? '',
});

// ============ BadgeRow ============

interface BadgeRowProps {
  badge: IAdminProductBadge;
  isUpdating: boolean;
  isDeleting: boolean;
  onSave: (badgeId: string, data: IUpdateProductBadgePayload) => void;
  onDelete: (badgeId: string) => void;
}

function BadgeRow({ badge, isUpdating, isDeleting, onSave, onDelete }: BadgeRowProps) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<BadgeFormState>(toBadgeFormState(badge));
  const isLoading = isUpdating || isDeleting;

  const handleEdit = () => {
    setForm(toBadgeFormState(badge));
    setEditing(true);
  };

  const handleSave = () => {
    onSave(badge.id, {
      name: form.name || undefined,
      sortOrder: form.sortOrder !== '' ? Number(form.sortOrder) : undefined,
      isActive: form.isActive,
      variant: form.variant || undefined,
      type: form.type || undefined,
    });
    setEditing(false);
  };

  const handleCancel = () => {
    setForm(toBadgeFormState(badge));
    setEditing(false);
  };

  return (
    <TableRow>
      {/* Name */}
      <TableCell className="text-xs">
        {editing ? (
          <Input
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            className="h-7 text-xs px-2"
            disabled={isLoading}
            placeholder="Tên badge"
          />
        ) : (
          <span className="font-medium">{badge.name}</span>
        )}
      </TableCell>

      {/* Type */}
      <TableCell className="text-xs">
        {editing ? (
          <Select
            value={form.type}
            onValueChange={(v) => setForm((prev) => ({ ...prev, type: v as ProductBadgeType }))}
            disabled={isLoading}
          >
            <SelectTrigger className="h-7 text-xs">
              <SelectValue placeholder="Chọn type" />
            </SelectTrigger>
            <SelectContent>
              {BADGE_TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value} className="text-xs">
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <span className="text-muted-foreground">{getTypeLabel(badge.type)}</span>
        )}
      </TableCell>

      {/* Variant */}
      <TableCell className="text-xs">
        {editing ? (
          <Select
            value={form.variant}
            onValueChange={(v) => setForm((prev) => ({ ...prev, variant: v as ProductBadgeVariant }))}
            disabled={isLoading}
          >
            <SelectTrigger className="h-7 text-xs">
              <SelectValue placeholder="Chọn variant" />
            </SelectTrigger>
            <SelectContent>
              {BADGE_VARIANTS.map((v) => (
                <SelectItem key={v.value} value={v.value} className="text-xs">
                  {v.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Badge variant={getBadgeVariant(badge.variant)} className="text-xs">
            {getVariantLabel(badge.variant)}
          </Badge>
        )}
      </TableCell>

      {/* Sort Order */}
      <TableCell className="text-xs text-center">
        {editing ? (
          <Input
            value={form.sortOrder}
            type="number"
            min={0}
            onChange={(e) => setForm((prev) => ({ ...prev, sortOrder: e.target.value }))}
            className="h-7 text-xs px-2 w-16 text-center"
            disabled={isLoading}
          />
        ) : (
          badge.sortOrder
        )}
      </TableCell>

      {/* isActive */}
      <TableCell className="text-center">
        {editing ? (
          <Switch
            checked={form.isActive}
            onCheckedChange={(checked) => setForm((prev) => ({ ...prev, isActive: checked }))}
            disabled={isLoading}
          />
        ) : (
          <Badge variant={badge.isActive ? 'default' : 'secondary'} className="text-xs">
            {badge.isActive ? 'Hiện' : 'Ẩn'}
          </Badge>
        )}
      </TableCell>

      {/* Actions */}
      <TableCell>
        <div className="flex items-center gap-1">
          {editing ? (
            <>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-green-600 hover:text-green-700 hover:bg-green-50"
                onClick={handleSave}
                disabled={isLoading || !form.name.trim()}
                title="Lưu"
              >
                {isUpdating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-muted-foreground hover:bg-muted"
                onClick={handleCancel}
                disabled={isLoading}
                title="Hủy"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </>
          ) : (
            <>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-primary-pink hover:bg-primary-pink/10"
                onClick={handleEdit}
                disabled={isLoading}
                title="Sửa"
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-destructive hover:bg-destructive/10"
                onClick={() => onDelete(badge.id)}
                disabled={isLoading}
                title="Xóa"
              >
                {isDeleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
              </Button>
            </>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}

// ============ AddBadgeRow ============

interface AddBadgeRowProps {
  isSaving: boolean;
  onSave: (data: ICreateProductBadgePayload) => void;
  onCancel: () => void;
}

function AddBadgeRow({ isSaving, onSave, onCancel }: AddBadgeRowProps) {
  const [form, setForm] = useState<BadgeFormState>(EMPTY_FORM);

  const handleSave = () => {
    if (!form.name.trim()) return;
    onSave({
      name: form.name,
      sortOrder: form.sortOrder !== '' ? Number(form.sortOrder) : 0,
      isActive: form.isActive,
      variant: form.variant || undefined,
      type: form.type || undefined,
    });
  };

  return (
    <TableRow className="bg-primary-pink/5">
      {/* Name */}
      <TableCell>
        <Input
          value={form.name}
          onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          className="h-7 text-xs px-2"
          placeholder="Tên badge *"
          disabled={isSaving}
        />
      </TableCell>

      {/* Type */}
      <TableCell>
        <Select
          value={form.type}
          onValueChange={(v) => setForm((prev) => ({ ...prev, type: v as ProductBadgeType }))}
          disabled={isSaving}
        >
          <SelectTrigger className="h-7 text-xs">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            {BADGE_TYPES.map((t) => (
              <SelectItem key={t.value} value={t.value} className="text-xs">
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>

      {/* Variant */}
      <TableCell>
        <Select
          value={form.variant}
          onValueChange={(v) => setForm((prev) => ({ ...prev, variant: v as ProductBadgeVariant }))}
          disabled={isSaving}
        >
          <SelectTrigger className="h-7 text-xs">
            <SelectValue placeholder="Variant" />
          </SelectTrigger>
          <SelectContent>
            {BADGE_VARIANTS.map((v) => (
              <SelectItem key={v.value} value={v.value} className="text-xs">
                {v.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>

      {/* Sort Order */}
      <TableCell>
        <Input
          value={form.sortOrder}
          type="number"
          min={0}
          onChange={(e) => setForm((prev) => ({ ...prev, sortOrder: e.target.value }))}
          className="h-7 text-xs px-2 w-16 text-center"
          disabled={isSaving}
        />
      </TableCell>

      {/* isActive */}
      <TableCell className="text-center">
        <div className="flex items-center gap-1.5 justify-center">
          <Switch
            checked={form.isActive}
            onCheckedChange={(checked) => setForm((prev) => ({ ...prev, isActive: checked }))}
            disabled={isSaving}
          />
          <Label className="text-xs">{form.isActive ? 'Hiện' : 'Ẩn'}</Label>
        </div>
      </TableCell>

      {/* Actions */}
      <TableCell>
        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 text-green-600 hover:text-green-700 hover:bg-green-50"
            onClick={handleSave}
            disabled={isSaving || !form.name.trim()}
            title="Lưu"
          >
            {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 text-muted-foreground hover:bg-muted"
            onClick={onCancel}
            disabled={isSaving}
            title="Hủy"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

// ============ ProductBadgesDialog ============

export function ProductBadgesDialog({
  productId,
  productName,
  open,
  onOpenChange,
}: ProductBadgesDialogProps) {
  const [isAdding, setIsAdding] = useState(false);

  const { data: badgesData, isLoading } = useProductBadgesQuery(open ? productId : null);
  const addMutation = useAddProductBadgeMutation(productId);
  const updateMutation = useUpdateProductBadgeMutation(productId);
  const deleteMutation = useDeleteProductBadgeMutation(productId);

  const badges = badgesData?.data ?? [];

  const handleAdd = (data: ICreateProductBadgePayload) => {
    addMutation.mutate(data, { onSuccess: () => setIsAdding(false) });
  };

  const handleSaveUpdate = (badgeId: string, data: IUpdateProductBadgePayload) => {
    updateMutation.mutate({ badgeId, data });
  };

  const handleDelete = (badgeId: string) => {
    deleteMutation.mutate(badgeId);
  };

  const anyPending =
    addMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col overflow-hidden">
        <DialogHeader className="pb-4 border-b border-primary-pink/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary-pink/10 text-primary-pink">
              <Tag className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-xl">Quản lý Badge</DialogTitle>
              <DialogDescription>{productName}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {/* ── Summary & Add button ── */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {badges.length} badge
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-primary-pink/30 text-primary-pink hover:bg-primary-pink/10"
              onClick={() => setIsAdding(true)}
              disabled={isAdding || anyPending}
            >
              <Plus className="mr-1 h-4 w-4" />
              Thêm badge
            </Button>
          </div>

          {/* ── Table ── */}
          <div className="rounded-lg border overflow-x-auto">
            <Table className="min-w-max text-sm">
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[150px]">Tên</TableHead>
                  <TableHead className="min-w-[120px]">Loại</TableHead>
                  <TableHead className="min-w-[120px]">Kiểu</TableHead>
                  <TableHead className="text-center min-w-20">Thứ tự</TableHead>
                  <TableHead className="text-center min-w-20">Trạng thái</TableHead>
                  <TableHead className="w-20" />
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading ? (
                  [...Array(3)].map((_, i) => (
                    <TableRow key={i}>
                      {[...Array(6)].map((__, j) => (
                        <TableCell key={j}>
                          <Skeleton className="h-5 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : badges.length === 0 && !isAdding ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground text-sm">
                      Chưa có badge nào. Bấm &quot;Thêm badge&quot; để tạo.
                    </TableCell>
                  </TableRow>
                ) : (
                  <>
                    {badges.map((badge) => (
                      <BadgeRow
                        key={badge.id}
                        badge={badge}
                        isUpdating={
                          updateMutation.isPending &&
                          updateMutation.variables?.badgeId === badge.id
                        }
                        isDeleting={
                          deleteMutation.isPending &&
                          deleteMutation.variables === badge.id
                        }
                        onSave={handleSaveUpdate}
                        onDelete={handleDelete}
                      />
                    ))}
                    {isAdding && (
                      <AddBadgeRow
                        isSaving={addMutation.isPending}
                        onSave={handleAdd}
                        onCancel={() => setIsAdding(false)}
                      />
                    )}
                  </>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <DialogFooter className="pt-4 border-t border-primary-pink/20">
          <Button
            variant="primary-pink"
            onClick={() => onOpenChange(false)}
            disabled={anyPending}
          >
            Hoàn thành
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
