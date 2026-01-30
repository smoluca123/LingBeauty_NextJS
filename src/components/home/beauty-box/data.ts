// Mock data cho Beauty Box articles
// Trong thực tế, data này sẽ được fetch từ API

export interface BeautyBoxArticle {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  categoryId: string;
  date: string;
  author?: string;
  readTime?: string;
}

export const beautyBoxArticles: BeautyBoxArticle[] = [
  {
    id: '1',
    title: 'MIFFY CHÍNH HÃNG ĐÃ CÓ MẶT TẠI BEAUTY BOX',
    description:
      'Beauty Box mong bạn kết nối cùng Miffy qua những sản phẩm đáng yêu, mang lại trải nghiệm ngọt ngào và gần gũi mỗi ngày. Hãy để Miffy làm bạn đồng hành trong cuộc sống...',
    image: '/assets/images/beauty-box/miffy.jpg',
    category: 'Tin tức',
    categoryId: 'news',
    date: '2026-01-25',
    author: 'Beauty Box Team',
    readTime: '3 phút đọc',
  },
  {
    id: '2',
    title: 'TỎA SÁNG RỰC RỠ VỚI TRANG SỨC ĐẲNG CẤP TỪ CASHION',
    description:
      'Với việc đồng hành cùng Beauty Box, Cashion mang đến một góc nhìn mới về kim cương và trang sức, nơi mọi phụ nữ đều có thể tỏa sáng theo cách của riêng mình.',
    image: '/assets/images/beauty-box/cashion.jpg',
    category: 'Góc review',
    categoryId: 'review',
    date: '2026-01-24',
    author: 'Minh Anh',
    readTime: '5 phút đọc',
  },
  {
    id: '3',
    title:
      'BEAUTY BOX AEON MALL TÂN PHÚ CELADON CHÍNH THỨC RA MẮT DIỆN MẠO MỚI - ĐẸP CHẤT CHƠI',
    description:
      'Từ 10/2/08, Beauty Box Aeon Mall Tân Phú Celadon trở lại trong diện mạo hoàn toàn mới, Trendy - Hiện đại – Trẻ trung hơn bao giờ hết!',
    image: '/assets/images/beauty-box/aeon.jpg',
    category: 'Bí quyết khỏe đẹp',
    categoryId: 'secrets',
    date: '2026-01-23',
    author: 'Thu Hà',
    readTime: '4 phút đọc',
  },
  // Thêm các bài viết mẫu khác
  {
    id: '4',
    title: 'CÁCH CHĂM SÓC DA MÙA ĐÔNG HIỆU QUẢ',
    description:
      'Mùa đông đến, làn da cần được chăm sóc đặc biệt để giữ ẩm và tránh khô ráp. Cùng Beauty Box khám phá những bí quyết chăm sóc da hiệu quả nhất.',
    image: '/assets/images/beauty-box/miffy.jpg',
    category: 'Cách chăm sóc da',
    categoryId: 'tips',
    date: '2026-01-22',
    author: 'Lan Anh',
    readTime: '6 phút đọc',
  },
  {
    id: '5',
    title: 'XU HƯỚNG TRANG ĐIỂM 2026 - NATURAL GLAM',
    description:
      'Xu hướng trang điểm năm 2026 hướng đến vẻ đẹp tự nhiên nhưng vẫn nổi bật. Cùng tìm hiểu các tips makeup hot nhất hiện nay.',
    image: '/assets/images/beauty-box/cashion.jpg',
    category: 'Xu hướng trang điểm',
    categoryId: 'makeup',
    date: '2026-01-21',
    author: 'Phương Anh',
    readTime: '7 phút đọc',
  },
  {
    id: '6',
    title: 'REVIEW SẢN PHẨM DƯỠNG DA MỚI NHẤT',
    description:
      'Những sản phẩm dưỡng da mới nhất đã có mặt tại Beauty Box. Cùng xem review chi tiết để chọn được sản phẩm phù hợp nhất.',
    image: '/assets/images/beauty-box/aeon.jpg',
    category: 'Góc review',
    categoryId: 'review',
    date: '2026-01-20',
    author: 'Hương Giang',
    readTime: '5 phút đọc',
  },
];

export const beautyBoxCategories = [
  { id: 'all', label: 'Tất cả', count: beautyBoxArticles.length },
  {
    id: 'news',
    label: 'Tin tức',
    count: beautyBoxArticles.filter((a) => a.categoryId === 'news').length,
  },
  {
    id: 'review',
    label: 'Góc review',
    count: beautyBoxArticles.filter((a) => a.categoryId === 'review').length,
  },
  {
    id: 'tips',
    label: 'Cách chăm sóc da',
    count: beautyBoxArticles.filter((a) => a.categoryId === 'tips').length,
  },
  {
    id: 'makeup',
    label: 'Xu hướng trang điểm',
    count: beautyBoxArticles.filter((a) => a.categoryId === 'makeup').length,
  },
  {
    id: 'secrets',
    label: 'Bí quyết khỏe đẹp',
    count: beautyBoxArticles.filter((a) => a.categoryId === 'secrets').length,
  },
];

// Helper function để filter articles theo category
export function getArticlesByCategory(categoryId: string): BeautyBoxArticle[] {
  if (categoryId === 'all') {
    return beautyBoxArticles;
  }
  return beautyBoxArticles.filter(
    (article) => article.categoryId === categoryId,
  );
}

// Helper function để lấy 3 bài viết mới nhất
export function getLatestArticles(limit: number = 3): BeautyBoxArticle[] {
  return beautyBoxArticles
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}
