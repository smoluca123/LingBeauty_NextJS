'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils/utils';
import { PRICE_RANGES, PriceRange } from '../constants';
import { CustomCheckbox } from './custom-checkbox';

interface FilterPriceProps {
  selectedRanges: string[];
  onChange: (ranges: string[]) => void;
  className?: string;
}

export function FilterPrice({
  selectedRanges,
  onChange,
  className,
}: FilterPriceProps) {
  const handleCheckboxChange = (rangeId: string, checked: boolean) => {
    if (checked) {
      onChange([...selectedRanges, rangeId]);
    } else {
      onChange(selectedRanges.filter((id) => id !== rangeId));
    }
  };

  return (
    <Accordion
      type="single"
      collapsible
      defaultValue="price"
      className={cn('', className)}
    >
      <AccordionItem value="price" className="border-b border-primary-pink/10">
        <AccordionTrigger className="py-3 text-sm font-semibold text-foreground hover:no-underline hover:text-primary-pink transition-colors">
          Giá sản phẩm
        </AccordionTrigger>
        <AccordionContent className="pb-3">
          <div className="space-y-0.5">
            {PRICE_RANGES.map((range: PriceRange) => (
              <CustomCheckbox
                key={range.id}
                checked={selectedRanges.includes(range.id)}
                onChange={(checked) => handleCheckboxChange(range.id, checked)}
                label={range.label}
              />
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
