'use client'

import { Search } from 'lucide-react'
import { useState } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils/style-utils'
import { IFilterCategoryDataType } from '@/lib/types/interfaces/apis/product.interfaces'
import { CustomCheckbox } from './custom-checkbox'

interface FilterCategoryProps {
  categories: IFilterCategoryDataType[]
  selectedCategories: string[]
  onChange: (categories: string[]) => void
  className?: string
}

export function FilterCategoryComponent({
  categories,
  selectedCategories,
  onChange,
  className,
}: FilterCategoryProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleCheckboxChange = (categorySlug: string, checked: boolean) => {
    if (checked) {
      onChange([...selectedCategories, categorySlug])
    } else {
      onChange(selectedCategories.filter((slug) => slug !== categorySlug))
    }
  }

  return (
    <Accordion
      type="single"
      collapsible
      defaultValue="category"
      className={cn('', className)}
    >
      <AccordionItem value="category" className="border-b-0">
        <AccordionTrigger className="py-3 text-sm font-semibold text-foreground hover:no-underline hover:text-primary-pink transition-colors">
          Loại sản phẩm
        </AccordionTrigger>
        <AccordionContent className="pb-3">
          <div className="space-y-3">
            {/* Search input for categories */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Tìm loại sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-9 pl-9 text-sm bg-white/70 border-primary-pink/20 focus:bg-white focus:border-primary-pink rounded-lg placeholder:text-muted-foreground/50"
              />
            </div>

            {/* Category checkboxes */}
            <div className="space-y-0.5">
              {filteredCategories.map((category: IFilterCategoryDataType) => (
                <CustomCheckbox
                  key={category.id}
                  checked={selectedCategories.includes(category.slug)}
                  onChange={(checked) =>
                    handleCheckboxChange(category.slug, checked)
                  }
                  label={category.name}
                  count={category.count}
                />
              ))}
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
