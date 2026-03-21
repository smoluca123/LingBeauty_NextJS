'use client';

import { useState } from 'react';
import {
  Plus,
  ChevronRight,
  ChevronDown,
  Pencil,
  Trash2,
  GripVertical,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { IAdminCategoryDataType } from '@/lib/types/interfaces/apis/admin-category.interfaces';
import { cn } from '@/lib/utils/utils';

interface CategoryTreeItemProps {
  category: IAdminCategoryDataType;
  level: number;
  onEdit: (category: IAdminCategoryDataType) => void;
  onDelete: (category: IAdminCategoryDataType) => void;
  onAddChild: (category: IAdminCategoryDataType) => void;
}

export function CategoryTreeItem({
  category,
  level,
  onEdit,
  onDelete,
  onAddChild,
}: CategoryTreeItemProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = category.children && category.children.length > 0;

  return (
    <div className="min-w-0">
      <div
        className={cn(
          'group flex items-center gap-2 rounded-lg border bg-card p-3 transition-colors hover:bg-muted/50 min-w-0',
          level > 0 && 'ml-4 sm:ml-6',
        )}
      >
        <GripVertical
          className="h-4 w-4 cursor-grab text-muted-foreground opacity-0 group-hover:opacity-100 shrink-0 hidden sm:block"
          aria-hidden="true"
        />

        {/* Toggle expand */}
        {hasChildren ? (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 shrink-0"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={isExpanded ? 'Thu gọn' : 'Mở rộng'}
            aria-expanded={isExpanded}
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        ) : (
          <div className="w-6 shrink-0" />
        )}

        {/* Image thumbnail */}
        {category.imageMedia?.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={category.imageMedia.url}
            alt={category.name}
            className="h-8 w-8 rounded object-cover shrink-0"
          />
        ) : (
          <div
            className="h-8 w-8 rounded bg-muted shrink-0"
            aria-hidden="true"
          />
        )}

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium">{category.name}</span>
            <Badge variant={category.isActive ? 'primary-pink' : 'secondary'}>
              {category.isActive ? 'Hoạt động' : 'Ẩn'}
            </Badge>
            {category.type && (
              <Badge variant="outline" className="text-xs">
                {category.type === 'BRAND' ? 'Thương hiệu' : 'Danh mục'}
              </Badge>
            )}
            {category.sortOrder !== undefined && (
              <span className="text-xs text-muted-foreground">
                #{category.sortOrder}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground truncate">
            /{category.slug}
          </p>
          {category.description && (
            <p className="text-xs text-muted-foreground truncate">
              {category.description}
            </p>
          )}
        </div>

        {/* Children count */}
        {hasChildren && (
          <span className="text-xs text-muted-foreground hidden sm:block shrink-0">
            {category.children!.length} con
          </span>
        )}

        {/* Actions - Always visible on mobile (touch), hover on desktop */}
        <div className="flex items-center gap-1 shrink-0 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            aria-label={`Thêm danh mục con vào ${category.name}`}
            onClick={() => onAddChild(category)}
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            aria-label={`Chỉnh sửa ${category.name}`}
            onClick={() => onEdit(category)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            aria-label={`Xóa ${category.name}`}
            onClick={() => onDelete(category)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {hasChildren && isExpanded && (
        <div className="mt-2 space-y-2">
          {category.children!.map((child) => (
            <CategoryTreeItem
              key={child.id}
              category={child}
              level={level + 1}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddChild={onAddChild}
            />
          ))}
        </div>
      )}
    </div>
  );
}
