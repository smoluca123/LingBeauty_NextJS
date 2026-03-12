// ── Period ────────────────────────────────────────────────────────────────────

export type StatsPeriod = 'day' | 'week' | 'month' | 'year';

// ── Overview summary ──────────────────────────────────────────────────────────

export interface IOverviewStatsType {
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

// ── Daily snapshot ────────────────────────────────────────────────────────────

export interface IDailyStatsType {
  date: string; // YYYY-MM-DD
  newUsers: number;
  totalUsers: number;
  totalOrders: number;
  confirmedOrders: number;
  cancelledOrders: number;
  deliveredOrders: number;
  revenue: string;
  totalProducts: number;
  newProducts: number;
  totalItemsSold: number;
  newReviews: number;
  approvedReviews: number;
}

// ── Aggregated (week / month / year) ─────────────────────────────────────────

export interface IAggregatedStatsType {
  periodLabel: string; // "YYYY-WNN" | "YYYY-MM" | "YYYY"
  startDate: string;
  endDate: string;
  newUsers: number;
  totalOrders: number;
  confirmedOrders: number;
  cancelledOrders: number;
  deliveredOrders: number;
  revenue: string;
  newProducts: number;
  totalItemsSold: number;
  newReviews: number;
  approvedReviews: number;
}

// ── Revenue chart ─────────────────────────────────────────────────────────────

export interface IRevenueChartItemType {
  label: string;
  revenue: string;
  orders: number;
}

export interface IRevenueChartType {
  items: IRevenueChartItemType[];
  totalRevenue: string;
  totalOrders: number;
}

// ── Order status breakdown ────────────────────────────────────────────────────

export interface IOrderStatusBreakdownType {
  pending: number;
  confirmed: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  refunded: number;
}

// ── Top products ──────────────────────────────────────────────────────────────

export interface ITopProductType {
  id: string;
  name: string;
  slug: string;
  totalSold: number;
  revenue: string;
  avgRating: string | null;
  reviewCount: number;
}
