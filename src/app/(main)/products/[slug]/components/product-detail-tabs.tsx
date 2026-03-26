'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils/style-utils'
import { IProductDataType } from '@/lib/types/interfaces/apis/product.interfaces'
import { ProductDetailDescriptionTab } from './product-detail-description-tab'
import { ProductDetailReviewTab } from './product-detail-review-tab'
import { ProductDetailQnaTab } from './product-detail-qna-tab'

type TabId = 'description' | 'reviews' | 'qna'

interface Tab {
  id: TabId
  label: string
}

const TABS: Tab[] = [
  { id: 'description', label: 'Mô tả' },
  { id: 'reviews', label: 'Đánh giá' },
  { id: 'qna', label: 'Hỏi & Đáp' },
]

interface ProductDetailTabsProps {
  product: IProductDataType
}

export function ProductDetailTabs({ product }: ProductDetailTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>('description')

  return (
    <div className="space-y-6">
      {/* Tab header */}
      <div className="border-b">
        <nav className="flex gap-1" role="tablist">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'relative px-5 py-3 text-sm font-medium transition-colors',
                activeTab === tab.id
                  ? 'text-primary-pink'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {tab.label}
              {/* Active indicator */}
              <span
                className={cn(
                  'absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-primary-pink transition-opacity',
                  activeTab === tab.id ? 'opacity-100' : 'opacity-0',
                )}
              />
            </button>
          ))}
        </nav>
      </div>

      {/* Tab content */}
      <div className="min-h-[200px]">
        {activeTab === 'description' && (
          <ProductDetailDescriptionTab product={product} />
        )}
        {activeTab === 'reviews' && (
          <ProductDetailReviewTab
            productId={product.id}
            productName={product.name}
          />
        )}
        {activeTab === 'qna' && (
          <ProductDetailQnaTab
            productId={product.id}
            productName={product.name}
          />
        )}
      </div>
    </div>
  )
}
