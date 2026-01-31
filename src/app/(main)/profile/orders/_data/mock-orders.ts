// Mock data for Orders page
export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipping'
  | 'delivered'
  | 'cancelled';

export interface OrderProduct {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  variant?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  createdAt: string;
  products: OrderProduct[];
  totalAmount: number;
  shippingAddress: string;
  paymentMethod: string;
}

export const MOCK_ORDERS: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2026-001234',
    status: 'delivered',
    createdAt: '2026-01-28T10:30:00',
    products: [
      {
        id: 'p1',
        name: 'Son YSL Rouge Pur Couture',
        image: '/images/products/ysl-lipstick.jpg',
        price: 950000,
        quantity: 1,
        variant: '#13 Le Orange',
      },
      {
        id: 'p2',
        name: 'Kem Dưỡng La Mer Moisturizing Cream',
        image: '/images/products/la-mer-cream.jpg',
        price: 8500000,
        quantity: 1,
      },
    ],
    totalAmount: 9450000,
    shippingAddress: '123 Nguyễn Huệ, Quận 1, TP.HCM',
    paymentMethod: 'Thẻ tín dụng',
  },
  {
    id: '2',
    orderNumber: 'ORD-2026-001235',
    status: 'shipping',
    createdAt: '2026-01-29T14:20:00',
    products: [
      {
        id: 'p3',
        name: 'Nước Hoa Dior Sauvage EDP',
        image: '/images/products/dior-sauvage.jpg',
        price: 3200000,
        quantity: 1,
        variant: '100ml',
      },
    ],
    totalAmount: 3200000,
    shippingAddress: '456 Lê Lợi, Quận 3, TP.HCM',
    paymentMethod: 'Thanh toán khi nhận hàng',
  },
  {
    id: '3',
    orderNumber: 'ORD-2026-001236',
    status: 'processing',
    createdAt: '2026-01-30T09:15:00',
    products: [
      {
        id: 'p4',
        name: 'Serum SK-II Facial Treatment Essence',
        image: '/images/products/sk2-essence.jpg',
        price: 4800000,
        quantity: 1,
        variant: '230ml',
      },
      {
        id: 'p5',
        name: 'Mặt Nạ SK-II Facial Treatment Mask',
        image: '/images/products/sk2-mask.jpg',
        price: 1900000,
        quantity: 2,
      },
    ],
    totalAmount: 8600000,
    shippingAddress: '789 Trần Hưng Đạo, Quận 5, TP.HCM',
    paymentMethod: 'Ví MoMo',
  },
  {
    id: '4',
    orderNumber: 'ORD-2026-001237',
    status: 'pending',
    createdAt: '2026-01-30T18:45:00',
    products: [
      {
        id: 'p6',
        name: 'Phấn Nền Charlotte Tilbury',
        image: '/images/products/ct-powder.jpg',
        price: 1650000,
        quantity: 1,
        variant: 'Medium 3',
      },
    ],
    totalAmount: 1650000,
    shippingAddress: '321 Võ Văn Tần, Quận 3, TP.HCM',
    paymentMethod: 'Thẻ ghi nợ',
  },
];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Chờ xác nhận',
  processing: 'Đang chuẩn bị',
  shipping: 'Đang giao',
  delivered: 'Đã giao',
  cancelled: 'Đã hủy',
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipping: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export function getOrdersByStatus(status: string): Order[] {
  if (status === 'all') return MOCK_ORDERS;
  return MOCK_ORDERS.filter((order) => order.status === status);
}

export function searchOrders(orders: Order[], query: string): Order[] {
  if (!query.trim()) return orders;
  const searchTerm = query.toLowerCase();
  return orders.filter(
    (order) =>
      order.orderNumber.toLowerCase().includes(searchTerm) ||
      order.products.some((p) => p.name.toLowerCase().includes(searchTerm))
  );
}
