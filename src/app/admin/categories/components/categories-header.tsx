'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CategoriesHeaderProps {
  onAddNew: () => void;
}

export function CategoriesHeader({ onAddNew }: CategoriesHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shrink-0">
      <div>
        <h1 className="text-xl md:text-2xl font-bold">Danh mục sản phẩm</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Quản lý danh mục sản phẩm của cửa hàng
        </p>
      </div>
      <Button variant="primary-pink" onClick={onAddNew}>
        <Plus className="mr-2 h-4 w-4" />
        Thêm danh mục
      </Button>
    </div>
  );
}
