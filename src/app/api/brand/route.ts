import { getBrandsAPI } from '@/lib/apis/server/brand-apis';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get('limit');
  const page = searchParams.get('page');
  const data = await getBrandsAPI({
    limit: limit ? Number(limit) : undefined,
    page: page ? Number(page) : undefined,
  });
  return NextResponse.json(data);
}
