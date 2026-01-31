'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmptyState } from '../empty-state';
import {
  getEventsByStatus,
  type EventStatus,
} from '../../events/_data/mock-events';
import { EventCard } from './event-card';

// ============ Types ============
type EventTab = 'upcoming' | 'completed';

interface TabItem {
  value: EventTab;
  label: string;
  count?: number;
}

// ============ Main Component ============
export function EventsContent() {
  const [activeTab, setActiveTab] = useState<EventTab>('upcoming');

  const upcomingCount = getEventsByStatus('upcoming').length;
  const completedCount = getEventsByStatus('completed').length;

  const EVENT_TABS: TabItem[] = [
    { value: 'upcoming', label: 'Sắp diễn ra', count: upcomingCount },
    { value: 'completed', label: 'Đã tham gia', count: completedCount },
  ];

  const filteredEvents = getEventsByStatus(activeTab as EventStatus);

  return (
    <div className="space-y-4">
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as EventTab)}
      >
        <TabsList className="h-auto w-full justify-start gap-2 rounded-lg border bg-muted/30 p-1">
          {EVENT_TABS.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="relative h-10 rounded-md border border-transparent px-6 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-background/50 data-[state=active]:border-primary-pink/20 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className="ml-2 rounded-full bg-primary-pink/10 px-2.5 py-0.5 text-xs font-semibold text-primary-pink">
                  {tab.count}
                </span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Tab Contents */}
        {EVENT_TABS.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="mt-6">
            {filteredEvents.length > 0 ? (
              <div className="grid gap-4">
                {filteredEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="Không có sự kiện"
                description="Bạn chưa đăng ký tham gia sự kiện nào"
              />
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
