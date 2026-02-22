import TopHeader from '@/components/header/top-header';
import Header from '@/components/header/header';
import { Footer } from '@/components/footer';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <TopHeader />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
