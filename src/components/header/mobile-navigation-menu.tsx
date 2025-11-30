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

const categories = [
  {
    label: 'Thương hiệu',
    href: '/brands',
    items: [
      { label: 'Thương hiệu nổi tiếng', href: '/brands/popular' },
      { label: 'Thương hiệu mới', href: '/brands/new' },
      { label: 'Tất cả thương hiệu', href: '/brands/all' },
    ],
  },
  {
    label: 'Khuyến mãi hot',
    href: '/promotions',
    items: [
      { label: 'Deal hôm nay', href: '/promotions/today' },
      { label: 'Flash sale', href: '/promotions/flash-sale' },
      { label: 'Mua 1 tặng 1', href: '/promotions/buy-1-get-1' },
    ],
  },
  {
    label: 'Sản phẩm cao cấp',
    href: '/premium',
    items: [
      { label: 'Skincare cao cấp', href: '/premium/skincare' },
      { label: 'Makeup cao cấp', href: '/premium/makeup' },
      { label: 'Chăm sóc da', href: '/premium/care' },
    ],
  },
  {
    label: 'Trang điểm',
    href: '/makeup',
    items: [
      { label: 'Foundation', href: '/makeup/foundation' },
      { label: 'Lipstick', href: '/makeup/lipstick' },
      { label: 'Eye makeup', href: '/makeup/eye' },
      { label: 'Blush', href: '/makeup/blush' },
    ],
  },
  {
    label: 'Chăm Sóc Da',
    href: '/skincare',
    items: [
      { label: 'Cleanser', href: '/skincare/cleanser' },
      { label: 'Serum', href: '/skincare/serum' },
      { label: 'Moisturizer', href: '/skincare/moisturizer' },
      { label: 'Sunscreen', href: '/skincare/sunscreen' },
    ],
  },
  {
    label: 'Chăm sóc cá nhân',
    href: '/personal-care',
    items: [
      { label: 'Hair care', href: '/personal-care/hair' },
      { label: 'Body care', href: '/personal-care/body' },
      { label: 'Fragrance', href: '/personal-care/fragrance' },
    ],
  },
  {
    label: 'Chăm sóc cơ thể',
    href: '/body-care',
    items: [
      { label: 'Body wash', href: '/body-care/wash' },
      { label: 'Body lotion', href: '/body-care/lotion' },
      { label: 'Scrub', href: '/body-care/scrub' },
    ],
  },
  {
    label: 'Sản Phẩm Mới',
    href: '/new-products',
    items: [
      { label: 'Sản phẩm mới nhất', href: '/new-products/latest' },
      { label: 'Xu hướng mới', href: '/new-products/trending' },
    ],
  },
];

export function MobileNavigationMenu() {
  const [open, setOpen] = useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen} direction="left">
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden" aria-label="Menu">
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
              <AccordionItem key={category.label} value={category.label}>
                <div className="flex items-center justify-between">
                  <AccordionTrigger className="flex-1 text-left py-4">
                    {category.label}
                  </AccordionTrigger>
                  <Link
                    href={category.href}
                    onClick={() => setOpen(false)}
                    className="px-4 py-4 text-sm text-primary-pink hover:underline"
                  >
                    Xem tất cả
                  </Link>
                </div>
                <AccordionContent>
                  <ul className="space-y-2 pl-4 pb-2">
                    {category.items.map((item) => (
                      <li key={item.label}>
                        <Link
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className="block py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

