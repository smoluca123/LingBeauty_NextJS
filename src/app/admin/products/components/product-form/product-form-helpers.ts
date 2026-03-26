/** Tạo SKU ngẫu nhiên từ tên sản phẩm */
export const generateSku = (productName: string): string => {
  const prefix = productName
    .slice(0, 3)
    .toUpperCase()
    .replace(/[^A-Z]/g, 'X')
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0')
  return `${prefix}-${random}`
}
