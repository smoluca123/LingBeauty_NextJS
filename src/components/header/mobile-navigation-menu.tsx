'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ICategoryDataType } from '@/lib/types/interfaces/apis/header.interfaces';

interface MobileNavigationMenuProps {
  categories: ICategoryDataType[];
}

export function MobileNavigationMenu({
  categories,
}: MobileNavigationMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen} direction="left">
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-full w-full sm:w-80">
        <DrawerHeader className="border-b">
          <div className="flex items-center justify-between">
            <DrawerTitle>Danh mục</DrawerTitle>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon" aria-label="Đóng">
                <X className="h-5 w-5" />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>
        <div className="flex-1 overflow-y-auto p-4">
          <Accordion type="single" collapsible className="w-full">
            {categories.map((category) => (
              <MobileCategoryItem
                key={category.id}
                category={category}
                onNavigate={() => setOpen(false)}
              />
            ))}
          </Accordion>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

interface MobileCategoryItemProps {
  category: ICategoryDataType;
  onNavigate: () => void;
}

/**
 * Renders a single category item in the mobile accordion menu.
 * If category has children, shows an accordion with expandable sub-items.
 * If no children, shows a simple link.
 */
function MobileCategoryItem({ category, onNavigate }: MobileCategoryItemProps) {
  const hasChildren = category.children.length > 0;

  // Category without children - render as simple link
  if (!hasChildren) {
    return (
      <div className="border-b">
        <Link
          href={`/categories/${category.slug}`}
          onClick={onNavigate}
          className="flex items-center py-4 text-sm font-medium hover:text-primary-pink transition-colors"
        >
          {category.name}
        </Link>
      </div>
    );
  }

  // Category with children - render as accordion
  return (
    <AccordionItem value={category.id}>
      <div className="flex items-center justify-between">
        <AccordionTrigger className="flex-1 text-left py-4">
          {category.name}
        </AccordionTrigger>
        <Link
          href={`/categories/${category.slug}`}
          onClick={onNavigate}
          className="px-4 py-4 text-sm text-primary-pink hover:underline"
        >
          Xem tất cả
        </Link>
      </div>
      <AccordionContent>
        <ul className="space-y-2 pl-4 pb-2">
          {category.children.map((child) => (
            <MobileChildItem
              key={child.type === 'BRAND' ? child.brand.id : child.id}
              item={child}
              onNavigate={onNavigate}
            />
          ))}
        </ul>
      </AccordionContent>
    </AccordionItem>
  );
}

interface MobileChildItemProps {
  item: ICategoryDataType;
  onNavigate: () => void;
}

/**
 * Renders a child item inside an accordion.
 * Handles both BRAND and CATEGORY types using discriminated union.
 */
function MobileChildItem({ item, onNavigate }: MobileChildItemProps) {
  const href =
    item.type === 'BRAND'
      ? `/collections/${item.brand.slug}`
      : `/categories/${item.slug}`;
  const label = item.type === 'BRAND' ? item.brand.name : item.name;

  return (
    <li>
      <Link
        href={href}
        onClick={onNavigate}
        className="block py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        {label}
      </Link>
    </li>
  );
}
