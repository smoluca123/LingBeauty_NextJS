import { BrandList } from '@/components/home/brands/brand-list';
import { getBrandsAPI } from '@/lib/apis/server/brand-apis';

export async function BrandListSection() {
  const initialData = await getBrandsAPI({ page: 1, limit: 20 });

  return <BrandList initialData={initialData.data.items} />;
}
