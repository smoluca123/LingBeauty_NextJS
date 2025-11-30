import TopHeader from '@/components/header/top-header';
import Header from '@/components/header/header';

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
    </div>
  );
}
