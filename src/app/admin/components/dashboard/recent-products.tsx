import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const recentProducts = [
  { name: 'Serum Vitamin C Brightening', category: 'Serum', price: '450.000₫' },
  { name: 'Kem dưỡng ẩm Hyaluronic', category: 'Kem dưỡng', price: '380.000₫' },
  { name: 'Sữa rửa mặt Gentle Cleanser', category: 'Làm sạch', price: '250.000₫' },
  { name: 'Toner cân bằng pH', category: 'Toner', price: '320.000₫' },
  { name: 'Kem chống nắng SPF50+', category: 'Chống nắng', price: '290.000₫' },
];

export function RecentProducts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base md:text-lg">Sản phẩm gần đây</CardTitle>
        <CardDescription className="text-xs md:text-sm">
          5 sản phẩm được thêm gần nhất
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentProducts.map((product, index) => (
            <div key={index} className="flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm md:text-base truncate">
                  {product.name}
                </p>
                <p className="text-xs md:text-sm text-muted-foreground">
                  {product.category}
                </p>
              </div>
              <span className="font-medium text-primary-pink text-sm md:text-base whitespace-nowrap">
                {product.price}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
