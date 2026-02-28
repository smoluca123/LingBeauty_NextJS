import {
  deleteMyAddressAPI,
  updateMyAddressAPI,
} from '@/lib/apis/server/actions/addresses.actions';
import { proxyRoute } from '@/lib/proxy-route';
import type { UpdateAddressValues } from '@/lib/zod-schemas/addresses.schema';

export const DELETE = (
  _request: Request,
  { params }: { params: Promise<{ addressId: string }> },
) =>
  proxyRoute(async () => {
    const { addressId } = await params;
    return deleteMyAddressAPI(addressId);
  });

export const PATCH = async (
  request: Request,
  { params }: { params: Promise<{ addressId: string }> },
) => {
  const [body, { addressId }] = await Promise.all([
    request.json() as Promise<UpdateAddressValues>,
    params,
  ]);
  return proxyRoute(() => updateMyAddressAPI({ id: addressId, data: body }));
};
