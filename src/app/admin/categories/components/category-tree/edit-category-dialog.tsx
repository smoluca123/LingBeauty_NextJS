import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { IAdminCategoryDataType } from '@/lib/types/interfaces/apis/admin-product.interfaces';

interface CategoryFormData {
  name: string;
  slug: string;
  isActive: boolean;
}

interface EditCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: IAdminCategoryDataType | null;
  formData: CategoryFormData;
  onFormChange: (data: Partial<CategoryFormData>) => void;
  onSave: () => void;
  parentId?: string | null;
}

export function EditCategoryDialog({
  open,
  onOpenChange,
  category,
  formData,
  onFormChange,
  onSave,
  parentId,
}: EditCategoryDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {category ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Tên danh mục</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => onFormChange({ name: e.target.value })}
              placeholder="Nhập tên danh mục"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => onFormChange({ slug: e.target.value })}
              placeholder="ten-danh-muc"
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="isActive">Hiển thị</Label>
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => onFormChange({ isActive: checked })}
            />
          </div>
          {parentId && (
            <p className="text-sm text-muted-foreground">
              Danh mục con của: <span className="font-medium">Danh mục cha</span>
            </p>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button variant="primary-pink" onClick={onSave}>Lưu</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
