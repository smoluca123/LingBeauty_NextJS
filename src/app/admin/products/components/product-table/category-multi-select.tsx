'use client';

import { useState } from 'react';
import { X, Check, ChevronsUpDown } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { CategoryOption } from './product-form.types';

// ─── Props ────────────────────────────────────────────────────────────────────

interface CategoryMultiSelectProps {
  options: CategoryOption[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  label?: string;
  required?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CategoryMultiSelect({
  options,
  selectedIds,
  onToggle,
  onRemove,
  label = 'Danh mục',
  required = false,
}: CategoryMultiSelectProps) {
  const [open, setOpen] = useState(false);

  const selectedOptions = selectedIds
    .map((id) => options.find((o) => o.id === id))
    .filter(Boolean) as CategoryOption[];

  return (
    <div className="space-y-1.5">
      <Label>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div
            role="combobox"
            aria-expanded={open}
            aria-controls="category-listbox"
            aria-haspopup="listbox"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setOpen((prev) => !prev);
              }
            }}
            className="flex w-full cursor-pointer items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background min-h-9 h-auto hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          >
            {selectedOptions.length > 0 ? (
              <div className="flex flex-wrap gap-1 py-0.5">
                {selectedOptions.map((opt) => (
                  <Badge
                    key={opt.id}
                    variant="secondary"
                    className="text-xs pr-1 flex items-center gap-1"
                  >
                    {opt.label}
                    <span
                      role="button"
                      tabIndex={0}
                      aria-label={`Xóa ${opt.label}`}
                      className="rounded-full hover:bg-muted-foreground/20 p-0.5 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemove(opt.id);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.stopPropagation();
                          onRemove(opt.id);
                        }
                      }}
                    >
                      <X className="h-3 w-3" />
                    </span>
                  </Badge>
                ))}
              </div>
            ) : (
              <span className="text-muted-foreground">Chọn danh mục...</span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </div>
        </PopoverTrigger>

        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Tìm danh mục..." />
            <CommandList>
              <CommandEmpty>Không tìm thấy danh mục.</CommandEmpty>
              <CommandGroup>
                {options.map((opt) => {
                  const isSelected = selectedIds.includes(opt.id);
                  return (
                    <CommandItem
                      key={opt.id}
                      value={opt.label}
                      onSelect={() => onToggle(opt.id)}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          isSelected ? 'opacity-100' : 'opacity-0',
                        )}
                      />
                      {opt.label}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
