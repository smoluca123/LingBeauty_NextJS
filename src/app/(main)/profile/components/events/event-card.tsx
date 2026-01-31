'use client';

import Image from 'next/image';
import {
  Calendar,
  MapPin,
  Clock,
  Ticket,
  Gift,
  ChevronRight,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  EVENT_STATUS_LABELS,
  EVENT_STATUS_COLORS,
  formatEventDate,
  formatEventTime,
  type Event,
} from '../../events/_data/mock-events';

// ============ Event Card Component ============
interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          {/* Image */}
          <div className="relative h-48 w-full md:h-auto md:w-48 shrink-0">
            <Image
              src={event.image}
              alt={event.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 192px"
            />
            <Badge
              className={`absolute top-3 left-3 ${EVENT_STATUS_COLORS[event.status]} border-0`}
            >
              {EVENT_STATUS_LABELS[event.status]}
            </Badge>
          </div>

          {/* Content */}
          <div className="flex-1 p-4">
            <h3 className="font-semibold text-lg text-foreground mb-2">
              {event.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {event.description}
            </p>

            {/* Event Details */}
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary-pink" />
                <span>{formatEventDate(event.startDate)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary-pink" />
                <span>
                  {formatEventTime(event.startDate)} -{' '}
                  {formatEventTime(event.endDate)}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary-pink mt-0.5" />
                <span className="line-clamp-1">{event.location}</span>
              </div>
            </div>

            {/* Ticket Code (for upcoming events) */}
            {event.ticketCode && event.status === 'upcoming' && (
              <div className="flex items-center gap-2 mt-3 pt-3 border-t">
                <Ticket className="h-4 w-4 text-primary-pink" />
                <span className="text-sm font-medium">
                  Mã vé: <code className="font-mono">{event.ticketCode}</code>
                </span>
              </div>
            )}

            {/* Benefits */}
            {event.benefits.length > 0 && (
              <div className="mt-3 pt-3 border-t">
                <div className="flex items-center gap-2 mb-2">
                  <Gift className="h-4 w-4 text-primary-pink" />
                  <span className="text-sm font-medium text-foreground">
                    Quyền lợi
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {event.benefits.map((benefit, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-xs font-normal"
                    >
                      {benefit}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* View Details */}
            <div className="flex justify-end mt-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-primary-pink hover:text-primary-pink/80"
              >
                Xem chi tiết
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
