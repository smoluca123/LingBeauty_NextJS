/** Tạo slug từ tên (Vietnamese → ASCII) */
export const generateSlug = (name: string): string =>
  name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();

/** Tạo SKU ngẫu nhiên từ tên sản phẩm */
export const generateSku = (productName: string): string => {
  const prefix = productName
    .slice(0, 3)
    .toUpperCase()
    .replace(/[^A-Z]/g, 'X');
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0');
  return `${prefix}-${random}`;
};
