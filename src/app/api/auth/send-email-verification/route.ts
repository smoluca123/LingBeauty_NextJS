import { proxyRoute } from '@/lib/proxy-route';
import { kyInstance } from '@/lib/kyInstance/ky';
import { cookies } from 'next/headers';

interface SendOTPResponse {
  message: string;
  data?: { message: string; code?: string };
}

export const POST = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  return proxyRoute(() =>
    kyInstance
      .post('auth/send-email-verification', {
        headers: { accessToken: accessToken ?? '' },
      })
      .json<SendOTPResponse>(),
  );
};
