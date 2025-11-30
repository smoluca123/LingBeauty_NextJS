import { Suspense } from 'react';
import { getCategoriesServerAPI } from '@/lib/apis/server/header-apis';
import { NavigationBarClient } from './navigation-bar-client';
import { NavigationBarLoading } from './navigation-bar-loading';

export async function NavigationBar() {
  const categories = await getCategoriesServerAPI();

  return (
    <Suspense fallback={<NavigationBarLoading />}>
      <NavigationBarClient categories={categories} />
    </Suspense>
  );
}
