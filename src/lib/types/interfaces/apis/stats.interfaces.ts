// ── Period enum ───────────────────────────────────────────────────────────────

export type StatsPeriod = 'day' | 'week' | 'month' | 'year';

// ── Overview ──────────────────────────────────────────────────────────────────

export interface IOverviewStats {
  totalUsers: number;
  newUsersToday: number;
  newUsersThisMonth: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: string;
  revenueToday: string;
  revenueThisMonth: string;
  totalProducts: number;
  totalReviews: number;
}

// ── Revenue chart ─────────────────────────────────────────────────────────────

export interface IRevenueChartItem {
  label: string;
  revenue: string;
  orders: number;
}

export interface IRevenueChart {
  items: IRevenueChartItem[];
  totalRevenue: string;
  totalOrders: number;
}

// ── Order status breakdown ────────────────────────────────────────────────────

export interface IOrderStatusBreakdown {
  pending: number;
  confirmed: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  refunded: number;
}

// ── Top products ──────────────────────────────────────────────────────────────

export interface ITopProduct {
  id: string;
  name: string;
  slug: string;
  totalSold: number;
  revenue: string;
  avgRating: string | null;
  reviewCount: number;
}
