import { useQuery } from '@tanstack/react-query';
import { getBrandsAPI } from '@/lib/apis/client/brand.apis';
import { BrandOption } from '../components/product-table/product-form.types';

const BRANDS_QUERY_KEY = ['admin', 'brands'];

export function useBrands() {
  return useQuery<BrandOption[]>({
    queryKey: BRANDS_QUERY_KEY,
    queryFn: async () => {
      const res = await getBrandsAPI({ limit: 100, page: 1 });
      return res.data.items.map((b) => ({ id: b.id, name: b.name }));
    },
    staleTime: 5 * 60 * 1000, // 5 phút
  });
}
