import TopHeader from '@/components/header/top-header';
import Header from '@/components/header/header';
import { Footer } from '@/components/footer';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <TopHeader />
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
