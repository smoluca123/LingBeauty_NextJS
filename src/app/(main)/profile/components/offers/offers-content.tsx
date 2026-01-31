'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmptyState } from '../empty-state';
import {
  getOffersByStatus,
  type OfferStatus,
} from '../../offers/_data/mock-offers';
import { OfferCard } from './offer-card';

// ============ Types ============
type OfferTab = 'all' | 'active' | 'used' | 'expired';

interface TabItem {
  value: OfferTab;
  label: string;
  count?: number;
}

// ============ Main Component ============
export function OffersContent() {
  const [activeTab, setActiveTab] = useState<OfferTab>('active');

  const activeCount = getOffersByStatus('active').length;
  const usedCount = getOffersByStatus('used').length;
  const expiredCount = getOffersByStatus('expired').length;

  const OFFER_TABS: TabItem[] = [
    { value: 'active', label: 'Có thể dùng', count: activeCount },
    { value: 'used', label: 'Đã sử dụng', count: usedCount },
    { value: 'expired', label: 'Hết hạn', count: expiredCount },
  ];

  const filteredOffers = getOffersByStatus(activeTab as OfferStatus);

  return (
    <div className="space-y-4">
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as OfferTab)}
      >
        <TabsList className="h-auto w-full justify-start gap-0 rounded-none border-b bg-transparent p-0">
          {OFFER_TABS.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="h-10 rounded-none border-b-2 border-transparent px-4 py-2 text-sm font-medium text-muted-foreground data-[state=active]:border-primary-pink data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className="ml-1.5 rounded-full bg-muted px-2 py-0.5 text-xs">
                  {tab.count}
                </span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Tab Contents */}
        {OFFER_TABS.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="mt-6">
            {filteredOffers.length > 0 ? (
              <div className="grid gap-4">
                {filteredOffers.map((offer) => (
                  <OfferCard key={offer.id} offer={offer} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="Không có ưu đãi"
                description="Bạn chưa có ưu đãi nào trong mục này"
              />
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
