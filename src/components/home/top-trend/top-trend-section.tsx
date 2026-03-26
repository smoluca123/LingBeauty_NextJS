'use client'

import { useState, useMemo } from 'react'
import { cn } from '@/lib/utils/style-utils'
import { trendCategories, getProductsByCategory } from './data'
import { TrendCard } from './trend-card'
import { SectionHeadingCenter } from '@/components/home/section-heading'

export default function TopTrendSection() {
  const [activeTab, setActiveTab] = useState('all')

  const filteredProducts = useMemo(() => {
    return getProductsByCategory(activeTab)
  }, [activeTab])

  return (
    <section className="">
      <div className="">
        {/* Header */}
        <div className="mb-10 md:mb-12 text-center">
          {/* <h2 className="mb-8 md:mb-10 text-3xl md:text-4xl font-bold uppercase tracking-wide text-foreground">
            TOP TREND HÔM NAY
          </h2> */}
          <SectionHeadingCenter
            title="TOP TREND HÔM NAY"
            subtitle="Khám phá những bài viết hay về làm đẹp"
            eyebrow="BEAUTY"
            className="w-full"
          />

          {/* Tabs */}
          <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
            <div className="flex justify-center gap-6 md:gap-8 min-w-max px-4">
              {trendCategories.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'relative pb-3 text-sm md:text-base font-medium transition-colors duration-300',
                    'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5',
                    'after:bg-primary-pink after:transition-transform after:duration-300',
                    activeTab === tab.id
                      ? 'text-foreground font-semibold after:scale-x-100'
                      : 'text-muted-foreground hover:text-foreground after:scale-x-0',
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredProducts.map((product) => (
            <TrendCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
