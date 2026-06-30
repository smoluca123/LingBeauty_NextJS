import { type NextRequest, NextResponse } from 'next/server';
import { getAllAdminReviewsAPI } from '@/lib/apis/server/admin-review-apis';
import { isKyHttpError } from '@/lib/utils/error-handler';

// GET /api/admin/reviews/stats - Get review statistics
export async function GET(request: NextRequest) {
  try {
    // Get all reviews for statistics
    const allReviews = await getAllAdminReviewsAPI({
      page: 1,
      limit: 1000, // Get a large number for stats
    });

    const reviews = allReviews.data?.items || [];

    // Calculate statistics
    const totalReviews = reviews.length;
    const approvedReviews = reviews.filter((r) => r.isApproved).length;
    const pendingReviews = totalReviews - approvedReviews;

    // Calculate average rating (only for approved reviews)
    const approvedReviewRatings = reviews
      .filter((r) => r.isApproved)
      .map((r) => r.rating);
    const averageRating =
      approvedReviewRatings.length > 0
        ? approvedReviewRatings.reduce((a, b) => a + b, 0) /
          approvedReviewRatings.length
        : 0;

    // Calculate rating distribution
    const ratingDistribution = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };
    approvedReviewRatings.forEach((rating) => {
      ratingDistribution[rating as keyof typeof ratingDistribution]++;
    });

    // Group by date for trend (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentReviews = reviews.filter(
      (r) => new Date(r.createdAt) >= thirtyDaysAgo,
    );

    const dateMap = new Map<string, { count: number; approvedCount: number }>();
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      dateMap.set(dateStr, { count: 0, approvedCount: 0 });
    }

    recentReviews.forEach((review) => {
      const dateStr = new Date(review.createdAt).toISOString().split('T')[0];
      const current = dateMap.get(dateStr) || { count: 0, approvedCount: 0 };
      current.count++;
      if (review.isApproved) {
        current.approvedCount++;
      }
      dateMap.set(dateStr, current);
    });

    const recentReviewsTrend = Array.from(dateMap.entries())
      .map(([date, stats]) => ({
        date,
        count: stats.count,
        approvedCount: stats.approvedCount,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return NextResponse.json({
      type: 'response',
      message: 'Lấy thống kê đánh giá thành công',
      data: {
        totalReviews,
        approvedReviews,
        pendingReviews,
        averageRating: Math.round(averageRating * 10) / 10,
        ratingDistribution,
        recentReviewsTrend,
      },
    });
  } catch (error) {
    // Forward the exact BE error response
    if (isKyHttpError(error)) {
      const errorBody = await error.response.json().catch(() => ({
        success: false,
        message: error.message,
      }));
      return NextResponse.json(errorBody, { status: error.response.status });
    }

    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 },
    );
  }
}
