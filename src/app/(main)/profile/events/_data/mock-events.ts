// Mock data for Events page
export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

export interface Event {
  id: string;
  title: string;
  description: string;
  image: string;
  location: string;
  startDate: string;
  endDate: string;
  status: EventStatus;
  registeredAt: string;
  ticketCode?: string;
  benefits: string[];
}

export const MOCK_EVENTS: Event[] = [
  {
    id: '1',
    title: 'Ling Beauty VIP Night 2026',
    description:
      'Đêm tiệc tri ân khách hàng VIP với nhiều quà tặng và ưu đãi độc quyền. Cơ hội trải nghiệm sản phẩm mới trước ngày ra mắt.',
    image: '/images/events/vip-night.jpg',
    location: 'Khách sạn Rex, 141 Nguyễn Huệ, Quận 1, TP.HCM',
    startDate: '2026-02-14T18:00:00',
    endDate: '2026-02-14T22:00:00',
    status: 'upcoming',
    registeredAt: '2026-01-15T10:30:00',
    ticketCode: 'VIP2026-A001',
    benefits: [
      'Cocktail chào mừng',
      'Túi quà VIP trị giá 2 triệu',
      'Giảm 30% sản phẩm mới',
    ],
  },
  {
    id: '2',
    title: 'Beauty Masterclass: K-Beauty Secrets',
    description:
      'Workshop làm đẹp với chuyên gia Hàn Quốc, học các bí quyết skincare và makeup theo phong cách K-Beauty.',
    image: '/images/events/k-beauty-class.jpg',
    location: 'Ling Beauty Flagship Store, 123 Đồng Khởi, Quận 1',
    startDate: '2026-02-20T14:00:00',
    endDate: '2026-02-20T17:00:00',
    status: 'upcoming',
    registeredAt: '2026-01-20T15:45:00',
    ticketCode: 'KBEAUTY-B023',
    benefits: [
      'Sản phẩm sample cao cấp',
      'Chứng nhận tham gia',
      'Voucher giảm 15%',
    ],
  },
  {
    id: '3',
    title: 'Ngày hội làm đẹp mùa xuân',
    description:
      'Sự kiện makeup miễn phí và tư vấn làm đẹp cá nhân hóa cho dịp Tết.',
    image: '/images/events/spring-beauty.jpg',
    location: 'AEON Mall Tân Phú',
    startDate: '2026-01-25T09:00:00',
    endDate: '2026-01-25T18:00:00',
    status: 'completed',
    registeredAt: '2026-01-10T08:00:00',
    benefits: ['Makeup miễn phí', 'Tư vấn skincare', 'Quà tặng Tết'],
  },
  {
    id: '4',
    title: 'Workshop Nước Hoa: Tìm mùi hương của bạn',
    description:
      'Khám phá thế giới nước hoa cùng chuyên gia. Tìm hiểu cách chọn mùi hương phù hợp với phong cách.',
    image: '/images/events/perfume-workshop.jpg',
    location: 'Ling Beauty Store, SC VivoCity',
    startDate: '2026-03-08T10:00:00',
    endDate: '2026-03-08T12:00:00',
    status: 'upcoming',
    registeredAt: '2026-01-28T12:00:00',
    ticketCode: 'PERFUME-C045',
    benefits: ['Mini perfume sample set', 'Giảm 20% nước hoa', 'Tea party'],
  },
];

export const EVENT_STATUS_LABELS: Record<EventStatus, string> = {
  upcoming: 'Sắp diễn ra',
  ongoing: 'Đang diễn ra',
  completed: 'Đã kết thúc',
  cancelled: 'Đã hủy',
};

export const EVENT_STATUS_COLORS: Record<EventStatus, string> = {
  upcoming: 'bg-blue-100 text-blue-700',
  ongoing: 'bg-green-100 text-green-700',
  completed: 'bg-gray-100 text-gray-700',
  cancelled: 'bg-red-100 text-red-700',
};

export function formatEventDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatEventTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getEventsByStatus(status: EventStatus | 'all'): Event[] {
  if (status === 'all') return MOCK_EVENTS;
  return MOCK_EVENTS.filter((event) => event.status === status);
}
