import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { IAdminCategoryDataType } from '@/lib/types/interfaces/apis/admin-product.interfaces';

export interface CategoryFormData {
  name: string;
  description: string;
  isActive: boolean;
  parentId: string | null;
}

interface CategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Category đang được edit. Null = đang tạo mới */
  category: IAdminCategoryDataType | null;
  formData: CategoryFormData;
  onFormChange: (updates: Partial<CategoryFormData>) => void;
  onSave: () => void;
  /** Danh sách root categories để chọn làm cha */
  rootCategories: IAdminCategoryDataType[];
  isPending?: boolean;
}

const NO_PARENT_VALUE = '__none__';

export function CategoryFormDialog({
  open,
  onOpenChange,
  category,
  formData,
  onFormChange,
  onSave,
  rootCategories,
  isPending = false,
}: CategoryFormDialogProps) {
  const isEditing = Boolean(category);

  const title = isEditing
    ? 'Chỉnh sửa danh mục'
    : formData.parentId
      ? 'Thêm danh mục con'
      : 'Thêm danh mục';

  const handleParentChange = (value: string) => {
    onFormChange({ parentId: value === NO_PARENT_VALUE ? null : value });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="cat-name">
              Tên danh mục <span className="text-destructive">*</span>
            </Label>
            <Input
              id="cat-name"
              value={formData.name}
              onChange={(e) => onFormChange({ name: e.target.value })}
              placeholder="Nhập tên danh mục"
            />
            <p className="text-xs text-muted-foreground">Slug sẽ được tạo tự động từ tên.</p>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="cat-desc">Mô tả</Label>
            <Textarea
              id="cat-desc"
              value={formData.description}
              onChange={(e) => onFormChange({ description: e.target.value })}
              placeholder="Mô tả ngắn về danh mục (tùy chọn)"
              rows={3}
            />
          </div>

          {/* Parent selector — chỉ hiện khi tạo mới, không hiện khi edit */}
          {!isEditing && (
            <div className="space-y-1.5">
              <Label htmlFor="cat-parent">Danh mục cha</Label>
              <Select
                value={formData.parentId ?? NO_PARENT_VALUE}
                onValueChange={handleParentChange}
              >
                <SelectTrigger id="cat-parent">
                  <SelectValue placeholder="Chọn danh mục cha..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NO_PARENT_VALUE}>
                    — Không có cha (danh mục gốc) —
                  </SelectItem>
                  {rootCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {formData.parentId
                  ? 'Danh mục này sẽ là con của danh mục được chọn.'
                  : 'Để trống để tạo danh mục gốc.'}
              </p>
            </div>
          )}

          {/* isActive toggle */}
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <Label htmlFor="cat-active" className="font-medium">
                Hiển thị
              </Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                Danh mục sẽ hiển thị trên cửa hàng
              </p>
            </div>
            <Switch
              id="cat-active"
              checked={formData.isActive}
              onCheckedChange={(checked) => onFormChange({ isActive: checked })}
              className="data-[state=checked]:bg-primary-pink"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            Hủy
          </Button>
          <Button
            variant="primary-pink"
            onClick={onSave}
            disabled={isPending || !formData.name.trim()}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? 'Lưu thay đổi' : 'Tạo danh mục'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
