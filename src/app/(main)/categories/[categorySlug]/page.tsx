import { Suspense } from 'react';
import { CategoryShield } from './components/category-shield';

interface CategoryPageProps {
  params: Promise<{
    categorySlug: string;
  }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  return (
    <Suspense>
      <CategoryShield params={params} />
    </Suspense>
  );
}
