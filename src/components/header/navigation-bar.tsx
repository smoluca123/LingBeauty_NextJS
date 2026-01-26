import { getCategoriesServerAPI } from '@/lib/apis/server/category-apis';
import { NavigationBarClient } from './navigation-bar-client';

export async function NavigationBar() {
  const categories = await getCategoriesServerAPI();

  return <NavigationBarClient categories={categories} />;
}
