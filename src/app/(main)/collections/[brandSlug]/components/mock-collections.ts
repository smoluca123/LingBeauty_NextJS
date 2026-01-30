export interface CollectionData {
  name: string;
  slug: string;
  productCount: number;
  purchaseCount: string;
  bannerImage: string;
  description: string;
  featuredProducts: string;
  advantages: string[];
  targetAudience: string[];
}

export const mockCollections: Record<string, CollectionData> = {
  miffy: {
    name: 'MIFFY',
    slug: 'miffy',
    productCount: 15,
    purchaseCount: '1.7K',
    bannerImage: '/images/collections/miffy-banner.jpg',
    description:
      'Miffy kỷ niệm 70 năm ra đời, với hình ảnh hiền lành, dễ thương và luôn lan tỏa niềm vui. Beauty Box mong bạn kết nối cùng Miffy qua những sản phẩm đáng yêu, mang lại trải nghiệm ngọt ngào và gần gũi mỗi ngày. Hãy để Miffy làm bạn đồng hành trong cuộc sống của bạn.',
    featuredProducts:
      'MINI BAG KEYCHAIN BLINDBOX - móc khóa bí ẩn ra mắt năm 2025, mang đến trải nghiệm mở hộp đầy thú vị với 6 phiên bản độc đáo cùng 1 phiên bản secret hiếm có.',
    advantages: [
      'Bất ngờ thú vị: Mở hộp và khám phá phiên bản Miffy khác biệt',
      'Dễ thương, phong cách: Móc khóa xinh xắn, tô điểm cho túi xách, balo hay chìa khóa.',
      'Quà tặng ý nghĩa: Hoàn hảo cho fan Miffy và những ai yêu thích đồ sưu tập.',
    ],
    targetAudience: [
      'Chất liệu an toàn phù hợp với tất cả độ tuổi.',
      'Những sản phẩm móc khóa vỉ có móc kim loại phù hợp từ 3+',
      'Đồ chơi nhồi bông từ 0+',
    ],
  },
  'hello-kitty': {
    name: 'HELLO KITTY',
    slug: 'hello-kitty',
    productCount: 28,
    purchaseCount: '3.2K',
    bannerImage: '/images/collections/hello-kitty-banner.jpg',
    description:
      'Hello Kitty - biểu tượng văn hóa Nhật Bản với hơn 50 năm tuổi đời, mang đến sự dễ thương và tích cực cho mọi lứa tuổi. Bộ sưu tập Hello Kitty tại Beauty Box bao gồm các sản phẩm làm đẹp, phụ kiện và quà tặng độc đáo, giúp bạn thể hiện phong cách cá nhân đầy màu sắc.',
    featuredProducts:
      'Bộ sưu tập mỹ phẩm Hello Kitty Limited Edition 2025 với thiết kế hồng pastel đáng yêu, bao gồm son môi, phấn má, và bảng phấn mắt với chất lượng cao cấp từ Hàn Quốc.',
    advantages: [
      'Thiết kế độc quyền: Hình ảnh Hello Kitty được in nổi 3D trên bao bì cao cấp',
      'Chất lượng đảm bảo: Sản phẩm được kiểm nghiệm da liễu, an toàn cho làn da nhạy cảm',
      'Bộ sưu tập đa dạng: Từ mỹ phẩm đến phụ kiện thời trang',
      'Giá trị sưu tầm: Phiên bản giới hạn với số lượng có hạn',
    ],
    targetAudience: [
      'Phù hợp cho mọi lứa tuổi yêu thích Hello Kitty',
      'Sản phẩm mỹ phẩm dành cho 13+',
      'Phụ kiện và đồ chơi phù hợp từ 6+',
    ],
  },
  'my-melody': {
    name: 'MY MELODY',
    slug: 'my-melody',
    productCount: 22,
    purchaseCount: '2.5K',
    bannerImage: '/images/collections/my-melody-banner.jpg',
    description:
      'My Melody - cô thỏ ngọt ngào với chiếc mũ trùm đầu hồng đặc trưng, là người bạn đồng hành đáng yêu của bạn. Bộ sưu tập My Melody tại Beauty Box mang đến những sản phẩm xinh xắn với tông màu hồng pastel nhẹ nhàng, hoàn hảo cho những ai yêu thích sự dịu dàng và nữ tính.',
    featuredProducts:
      'Bộ dưỡng da My Melody Skincare Set với 5 bước chăm sóc da hoàn chỉnh: sữa rửa mặt, toner, serum, kem dưỡng và mặt nạ giấy. Thiết kế bao bì hồng pastel cực kỳ đáng yêu.',
    advantages: [
      'Công thức nhẹ nhàng: Chiết xuất từ hoa anh đào và trà xanh Nhật Bản',
      'Thiết kế đáng yêu: Bao bì hồng pastel với hình My Melody dập nổi',
      'Hiệu quả rõ rệt: Giúp da mềm mại, sáng khỏe sau 2 tuần sử dụng',
      'Hương thơm dễ chịu: Hương hoa anh đào tự nhiên, không gây kích ứng',
    ],
    targetAudience: [
      'Phù hợp cho làn da nhạy cảm, da khô',
      'Sản phẩm skincare dành cho 16+',
      'Phụ kiện và gấu bông phù hợp mọi lứa tuổi',
    ],
  },
  kuromi: {
    name: 'KUROMI',
    slug: 'kuromi',
    productCount: 18,
    purchaseCount: '2.1K',
    bannerImage: '/images/collections/kuromi-banner.jpg',
    description:
      'Kuromi - cô thỏ nổi loạn với phong cách punk rock độc đáo, mang đến sự cá tính và năng động. Bộ sưu tập Kuromi tại Beauty Box dành cho những bạn trẻ yêu thích sự khác biệt, với các sản phẩm mang phong cách edgy và màu sắc tím đen đặc trưng.',
    featuredProducts:
      'Bộ sưu tập makeup Kuromi Dark Series với tông màu tím đen cá tính, bao gồm son kem lì, eyeliner và mascara chống nước. Thiết kế bao bì punk rock với họa tiết đầu lâu đáng yêu.',
    advantages: [
      'Phong cách độc đáo: Thiết kế punk rock kết hợp với sự dễ thương',
      'Chất lượng cao cấp: Công thức lâu trôi, không lem, chống nước',
      'Màu sắc nổi bật: Tông màu tím đen cá tính, dễ phối hợp',
      'Bộ sưu tập giới hạn: Số lượng có hạn, giá trị sưu tầm cao',
    ],
    targetAudience: [
      'Dành cho những bạn trẻ yêu thích phong cách cá tính',
      'Sản phẩm makeup dành cho 14+',
      'Phụ kiện thời trang phù hợp từ 10+',
    ],
  },
};

export function getCollectionBySlug(slug: string): CollectionData | null {
  return mockCollections[slug] || null;
}
