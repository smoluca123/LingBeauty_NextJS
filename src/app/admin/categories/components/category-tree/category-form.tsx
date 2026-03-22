'use client';

import { useRef, useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ImageIcon, X } from 'lucide-react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { RichTextField } from '@/components/form/rich-text-field';
import {
  useAdminBrandsQuery,
  useAdminCategoriesQuery,
} from '@/hooks/querys/admin-category-brand.query';
import { ICategoryFormData, IAdminCategoryDataType } from '@/lib/types/interfaces/apis/admin-category.interfaces';
import { IBrandDataType } from '@/lib/types/interfaces/apis/header.interfaces';
import type { IApiResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces';

interface FlatCategory {
  id: string;
  label: string; // indented name for display
}

/** Recursively flatten the tree into a flat array with indented labels */
function flattenCategories(
  categories: IAdminCategoryDataType[],
  depth = 0,
): FlatCategory[] {
  const result: FlatCategory[] = [];
  const prefix = depth > 0 ? '—'.repeat(depth) + ' ' : '';
  for (const cat of categories) {
    result.push({ id: cat.id, label: `${prefix}${cat.name}` });
    if (cat.children && cat.children.length > 0) {
      result.push(...flattenCategories(cat.children, depth + 1));
    }
  }
  return result;
}

interface CategoryFormProps {
  form: UseFormReturn<ICategoryFormData>;
  /** id của category đang edit – để loại trừ khỏi danh sách parent */
  excludeCategoryId?: string;
  /** preview URL/DataURL của ảnh hiện tại – quản lý bởi parent dialog */
  imagePreview: string | null;
  onImagePreviewChange: (preview: string | null) => void;
}

export function CategoryForm({
  form,
  excludeCategoryId,
  imagePreview,
  onImagePreviewChange,
}: CategoryFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: brandsData } = useAdminBrandsQuery();
  const { data: categoriesData } = useAdminCategoriesQuery();

  const brands: IBrandDataType[] = brandsData?.data?.items ?? [];

  // Flatten tree → flat list for parent select, excluding "self" when editing
  const flatCategories = useMemo<FlatCategory[]>(() => {
    const result = categoriesData as IApiResponseWrapperType<IAdminCategoryDataType[]> | undefined;
    const tree = (result?.data ?? []) as IAdminCategoryDataType[];
    const flat = flattenCategories(tree);
    // Exclude the category being edited so it can't be its own parent
    return excludeCategoryId ? flat.filter((c) => c.id !== excludeCategoryId) : flat;
  }, [categoriesData, excludeCategoryId]);

  const watchedType = form.watch('type');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    form.setValue('imageFile', file);
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      form.setValue('imagePreview', result);
      onImagePreviewChange(result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    form.setValue('imageFile', null);
    form.setValue('imagePreview', null);
    onImagePreviewChange(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-4">
      {/* Name */}
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tên danh mục *</FormLabel>
            <FormControl>
              <Input placeholder="Nhập tên danh mục" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Description */}
      <RichTextField
        control={form.control}
        name="description"
        label="Mô tả"
        placeholder="Mô tả danh mục (tuỳ chọn)"
        availableHashtags={['danh mục', 'category', 'sản phẩm', 'hot', 'trending']}
      />

      {/* Parent Category Select – luôn hiển thị */}
      <FormField
        control={form.control}
        name="parentId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Danh mục cha</FormLabel>
            <Select
              onValueChange={(val) => field.onChange(val === '__none__' ? undefined : val)}
              value={field.value ?? '__none__'}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="— Không có (danh mục gốc) —" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="__none__">— Không có (danh mục gốc) —</SelectItem>
                {flatCategories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Type + SortOrder row */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Loại danh mục</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="CATEGORY">Danh mục</SelectItem>
                  <SelectItem value="BRAND">Thương hiệu</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sortOrder"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thứ tự sắp xếp</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  placeholder="0"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Brand (only when type=BRAND) */}
      {watchedType === 'BRAND' && (
        <FormField
          control={form.control}
          name="brandId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thương hiệu liên kết</FormLabel>
              <Select onValueChange={field.onChange} value={field.value ?? ''}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn thương hiệu" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {brands.map((brand: IBrandDataType) => (
                    <SelectItem key={brand.id} value={brand.id}>
                      {brand.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {/* Image upload */}
      <FormItem>
        <FormLabel>Ảnh danh mục</FormLabel>
        <div className="space-y-2">
          {imagePreview ? (
            <div className="relative w-24 h-24 rounded-md overflow-hidden border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed rounded-md cursor-pointer hover:border-primary/50 transition-colors"
            >
              <ImageIcon className="h-6 w-6 text-muted-foreground" />
              <span className="text-xs text-muted-foreground mt-1">Chọn ảnh</span>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          {!imagePreview && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              Tải ảnh lên
            </Button>
          )}
        </div>
      </FormItem>

      {/* isActive */}
      <FormField
        control={form.control}
        name="isActive"
        render={({ field }) => (
          <FormItem className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <FormLabel className="text-sm font-medium">Hiển thị</FormLabel>
              <p className="text-xs text-muted-foreground">Bật để hiển thị danh mục trên website</p>
            </div>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}
