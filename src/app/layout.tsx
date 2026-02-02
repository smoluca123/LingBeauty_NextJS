import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ReactQueryProvider from '@/components/react-query-provider';
import { AuthProvider } from '@/providers/auth-provider';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

// const montExtraLight = localFont({
//   src: './fonts/mont/Mont-ExtraLightDEMO.otf',
// });

// const montHeavy = localFont({
//   src: './fonts/mont/Mont-HeavyDEMO.otf',
// });

export const metadata: Metadata = {
  title:
    'Ling Beauty | Mỹ phẩm, dưỡng da, trang điểm, mặt nạ, chăm sóc da,... chính hãng',
  description:
    'Cửa hàng mỹ phẩm làm đẹp uy tín, chuyên cung cấp sản phẩm chăm sóc da, trang điểm chính hãng, an toàn và hiệu quả. Khám phá xu hướng làm đẹp mới nhất, bí quyết dưỡng da, review sản phẩm và các chương trình khuyến mãi hấp dẫn tại LingBeauty.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={` ${inter.variable} antialiased`}>
        <ReactQueryProvider>
          <AuthProvider>{children}</AuthProvider>
          <Toaster position="bottom-right" />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
