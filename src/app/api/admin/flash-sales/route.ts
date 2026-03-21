import {
  getAllFlashSalesAPI,
  createFlashSaleAPI,
} from '@/lib/apis/server/admin-flash-sale-apis';
import { proxyRoute } from '@/lib/proxy-route';
import type { ICreateFlashSaleFormData } from '@/lib/types/interfaces/apis/flash-sale.interfaces';

// GET /api/admin/flash-sales - Get all flash sales with pagination and filtering
export const GET = (req: Request) => {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get('page')
    ? Number(searchParams.get('page'))
    : undefined;
  const limit = searchParams.get('limit')
    ? Number(searchParams.get('limit'))
    : undefined;
  const search = searchParams.get('search') || undefined;
  const status = searchParams.get('status') as
    | 'UPCOMING'
    | 'ACTIVE'
    | 'ENDED'
    | undefined;
  const isActive = searchParams.get('isActive')
    ? searchParams.get('isActive') === 'true'
    : undefined;
  const sortBy = searchParams.get('sortBy') as
    | 'createdAt'
    | 'name'
    | 'startTime'
    | 'endTime'
    | 'sortOrder'
    | undefined;
  const sortOrder = searchParams.get('sortOrder') as 'asc' | 'desc' | undefined;

  return proxyRoute(() =>
    getAllFlashSalesAPI({
      page,
      limit,
      search,
      status,
      isActive,
      sortBy,
      sortOrder,
    }),
  );
};

// POST /api/admin/flash-sales - Create new flash sale
export const POST = async (req: Request) => {
  const data = (await req.json()) as ICreateFlashSaleFormData;
  return proxyRoute(() => createFlashSaleAPI(data));
};
