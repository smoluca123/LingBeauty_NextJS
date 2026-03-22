'use client';

import { useState, useMemo } from 'react';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import type { IAdminCategoryDataType } from '@/lib/types/interfaces/apis/admin-category.interfaces';

interface CategoryMultiSelectProps {
  categories: IAdminCategoryDataType[];
  value: string[];
  onValueChange: (ids: string[]) => void;
  placeholder?: string;
}

/** Flatten nested category tree into a flat list for searching.
 *  Bỏ qua các node có type === 'BRAND' (thương hiệu) để chỉ hiển thị danh mục thực sự.
 */
function flattenCategories(
  cats: IAdminCategoryDataType[],
  depth = 0,
): Array<IAdminCategoryDataType & { depth: number }> {
  return cats.flatMap((cat) => {
    // Bỏ qua node loại BRAND (thương hiệu) và toàn bộ cây con của nó
    if (cat.type === 'BRAND') return [];
    return [
      { ...cat, depth },
      ...flattenCategories(cat.children ?? [], depth + 1),
    ];
  });
}

export function CategoryMultiSelect({
  categories,
  value,
  onValueChange,
  placeholder = 'Chọn danh mục...',
}: CategoryMultiSelectProps) {
  const [open, setOpen] = useState(false);

  const flatCategories = useMemo(
    () => flattenCategories(categories),
    [categories],
  );

  const selectedCategories = useMemo(
    () => flatCategories.filter((c) => value.includes(c.id)),
    [flatCategories, value],
  );

  const toggle = (id: string) => {
    if (value.includes(id)) {
      onValueChange(value.filter((v) => v !== id));
    } else {
      onValueChange([...value, id]);
    }
  };

  const remove = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onValueChange(value.filter((v) => v !== id));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-auto min-h-10 flex-wrap gap-1"
        >
          {selectedCategories.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {selectedCategories.map((cat) => (
                <Badge
                  key={cat.id}
                  variant="secondary"
                  className="text-xs"
                  onClick={(e) => remove(cat.id, e)}
                >
                  {cat.name}
                  <X className="ml-1 h-3 w-3" />
                </Badge>
              ))}
            </div>
          ) : (
            <span className="text-muted-foreground font-normal">
              {placeholder}
            </span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Tìm kiếm danh mục..." />
          <CommandList>
            <CommandEmpty>Không tìm thấy danh mục.</CommandEmpty>
            <CommandGroup>
              {flatCategories.map((cat) => (
                <CommandItem
                  key={cat.id}
                  value={cat.name}
                  onSelect={() => toggle(cat.id)}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4 shrink-0',
                      value.includes(cat.id) ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  <span
                    style={{ paddingLeft: `${cat.depth * 16}px` }}
                    className="truncate"
                  >
                    {cat.name}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
