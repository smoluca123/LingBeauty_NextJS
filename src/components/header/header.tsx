import { Logo } from '@/components/logo';
import { SearchBar } from './search-bar';
import { HeaderActions } from './header-actions';
import { NavigationBar } from './navigation-bar';
import { MobileNavigationMenu } from './mobile-navigation-menu';

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
              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <MobileNavigationMenu />
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
          <NavigationBar />
        </div>
      </div>
    </header>
  );
}
