'use client';

import { useState } from 'react';
import {
  TabsUnderline,
  TabsUnderlineList,
  TabsUnderlineTrigger,
  TabsUnderlineContent,
} from '@/components/ui/tabs-underline';
import { EmptyState } from '../empty-state';
import { type Offer, getOffersByStatus } from '../../offers/_data/mock-offers';
import { OfferCard } from './offer-card';

// ============ Types ============
type OfferTab = 'active' | 'used' | 'expired';

// ============ Helper Component ============
function OffersTabContent({ offers }: { offers: Offer[] }) {
  return offers.length > 0 ? (
    <div className="grid gap-4">
      {offers.map((offer) => (
        <OfferCard key={offer.id} offer={offer} />
      ))}
    </div>
  ) : (
    <EmptyState
      title="Không có ưu đãi"
      description="Bạn chưa có ưu đãi nào trong mục này"
    />
  );
}

// ============ Main Component ============
export function OffersContent() {
  const [activeTab, setActiveTab] = useState<OfferTab>('active');

  const activeCount = getOffersByStatus('active').length;
  const usedCount = getOffersByStatus('used').length;
  const expiredCount = getOffersByStatus('expired').length;

  const activeOffers = getOffersByStatus('active');
  const usedOffers = getOffersByStatus('used');
  const expiredOffers = getOffersByStatus('expired');

  return (
    <div className="space-y-4">
      <TabsUnderline
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as OfferTab)}
      >
        <TabsUnderlineList>
          <TabsUnderlineTrigger value="active">
            Có thể dùng
            {activeCount > 0 && (
              <span className="ml-1.5 rounded-full bg-muted px-2 py-0.5 text-xs">
                {activeCount}
              </span>
            )}
          </TabsUnderlineTrigger>
          <TabsUnderlineTrigger value="used">
            Đã sử dụng
            {usedCount > 0 && (
              <span className="ml-1.5 rounded-full bg-muted px-2 py-0.5 text-xs">
                {usedCount}
              </span>
            )}
          </TabsUnderlineTrigger>
          <TabsUnderlineTrigger value="expired">
            Hết hạn
            {expiredCount > 0 && (
              <span className="ml-1.5 rounded-full bg-muted px-2 py-0.5 text-xs">
                {expiredCount}
              </span>
            )}
          </TabsUnderlineTrigger>
        </TabsUnderlineList>

        <TabsUnderlineContent value="active">
          <OffersTabContent offers={activeOffers} />
        </TabsUnderlineContent>

        <TabsUnderlineContent value="used">
          <OffersTabContent offers={usedOffers} />
        </TabsUnderlineContent>

        <TabsUnderlineContent value="expired">
          <OffersTabContent offers={expiredOffers} />
        </TabsUnderlineContent>
      </TabsUnderline>
    </div>
  );
}
