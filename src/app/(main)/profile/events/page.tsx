import { EventsContent } from '@/app/(main)/profile/components';

export default function EventsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">
        Sự kiện của tôi
      </h1>
      <EventsContent />
    </div>
  );
}
