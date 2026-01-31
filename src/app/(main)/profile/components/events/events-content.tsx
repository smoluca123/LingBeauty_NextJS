'use client';

import { useState } from 'react';
import {
  TabsUnderline,
  TabsUnderlineList,
  TabsUnderlineTrigger,
  TabsUnderlineContent,
} from '@/components/ui/tabs-underline';
import { EmptyState } from '../empty-state';
import { type Event, getEventsByStatus } from '../../events/_data/mock-events';
import { EventCard } from './event-card';

// ============ Types ============
type EventTab = 'upcoming' | 'completed';

// ============ Helper Component ============
function EventsTabContent({ events }: { events: Event[] }) {
  return events.length > 0 ? (
    <div className="grid gap-4">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  ) : (
    <EmptyState
      title="Không có sự kiện"
      description="Bạn chưa đăng ký tham gia sự kiện nào"
    />
  );
}

// ============ Main Component ============
export function EventsContent() {
  const [activeTab, setActiveTab] = useState<EventTab>('upcoming');

  const upcomingCount = getEventsByStatus('upcoming').length;
  const completedCount = getEventsByStatus('completed').length;

  const upcomingEvents = getEventsByStatus('upcoming');
  const completedEvents = getEventsByStatus('completed');

  return (
    <div className="space-y-4">
      <TabsUnderline
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as EventTab)}
      >
        <TabsUnderlineList>
          <TabsUnderlineTrigger value="upcoming">
            Sắp diễn ra
            {upcomingCount > 0 && (
              <span className="ml-2 rounded-full bg-primary-pink/10 px-2.5 py-0.5 text-xs font-semibold text-primary-pink">
                {upcomingCount}
              </span>
            )}
          </TabsUnderlineTrigger>
          <TabsUnderlineTrigger value="completed">
            Đã tham gia
            {completedCount > 0 && (
              <span className="ml-2 rounded-full bg-primary-pink/10 px-2.5 py-0.5 text-xs font-semibold text-primary-pink">
                {completedCount}
              </span>
            )}
          </TabsUnderlineTrigger>
        </TabsUnderlineList>

        <TabsUnderlineContent value="upcoming">
          <EventsTabContent events={upcomingEvents} />
        </TabsUnderlineContent>

        <TabsUnderlineContent value="completed">
          <EventsTabContent events={completedEvents} />
        </TabsUnderlineContent>
      </TabsUnderline>
    </div>
  );
}
