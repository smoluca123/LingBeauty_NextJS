import { Suspense } from 'react';

import { Logo } from '@/components/logo';
import { getCategoriesServerAPI } from '@/lib/apis/server/category-apis';
import { NavigationBarLoading } from '@/components/header/navigation-bar-loading';
import { SearchBar } from './search-bar';
import { HeaderActions } from './header-actions';
import { NavigationBarClient } from './navigation-bar-client';
import { MobileNavigationMenu } from './mobile-navigation-menu';

/**
 * Async server component that fetches categories data
 * and renders both mobile menu button + desktop navigation bar.
 * This ensures both mobile and desktop use the same data source.
 */
// async function NavigationContent() {
//   const categories = await getCategoriesServerAPI();

//   return (
//     <>
//       {/* Mobile Menu Button - only visible on mobile */}
//       <MobileNavigationMenu categories={categories} />

//       {/* Desktop Navigation Bar - only visible on desktop */}
//       <NavigationBarClient categories={categories} />
//     </>
//   );
// }

export default function Header() {
  return (
    <header className="bg-background border-b sticky top-0 z-50">
      {/* Main Header Section */}
      <div className="container mx-auto px-2 sm:px-4">
        {/* Mobile: Stack vertical, Desktop: Horizontal */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4 py-3 md:py-4">
          {/* Logo and Mobile Menu - Mobile: left side with menu, Desktop: left */}
          <div className="w-full md:w-auto flex items-center justify-between md:justify-start md:shrink-0">
            <div className="flex items-center gap-2 md:gap-0">
              {/* Mobile Menu Button - async content with loading fallback */}
              <div className="md:hidden">
                <Suspense
                  fallback={
                    <div className="h-9 w-9 rounded-md bg-muted animate-pulse" />
                  }
                >
                  <MobileNavigationMenuWrapper />
                </Suspense>
              </div>
              <div className="shrink-0">
                <Logo
                  className="text-left"
                  classNames={{
                    text: 'text-xl sm:text-2xl font-bold',
                  }}
                />
              </div>
            </div>
            {/* Header Actions - Mobile: show on same row with logo */}
            <div className="md:hidden">
              <HeaderActions />
            </div>
          </div>

          {/* Search Bar - Mobile: full width, Desktop: centered */}
          <div className="w-full md:flex-1 md:flex md:justify-center order-3 md:order-2">
            <SearchBar />
          </div>

          {/* Header Actions - Desktop: right side */}
          <div className="hidden md:flex shrink-0 order-2 md:order-3">
            <HeaderActions />
          </div>
        </div>

        {/* Navigation Bar - Desktop only */}
        <div className="border-t hidden md:block">
          <Suspense fallback={<NavigationBarLoading />}>
            <DesktopNavigationBarWrapper />
          </Suspense>
        </div>
      </div>
    </header>
  );
}

/**
 * Wrapper component for mobile menu - fetches categories and renders the mobile menu button
 */
async function MobileNavigationMenuWrapper() {
  const categories = await getCategoriesServerAPI();
  return <MobileNavigationMenu categories={categories} />;
}

/**
 * Wrapper component for desktop navbar - fetches categories and renders navbar
 */
async function DesktopNavigationBarWrapper() {
  const categories = await getCategoriesServerAPI();
  return <NavigationBarClient categories={categories} />;
}
