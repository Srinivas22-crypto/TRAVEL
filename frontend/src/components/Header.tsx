import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SearchResults } from './SearchResults';
import { useTranslation } from 'react-i18next';
import { 
  NavigationMenu,
  NavigationMenuContent, 
  NavigationMenuItem, 
  NavigationMenuLink, 
  NavigationMenuList, 
  NavigationMenuTrigger 
} from '@/components/ui/navigation-menu';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSelector } from './LanguageSelector';
import { NotificationCenter } from './NotificationCenter';
import UserMenu from './UserMenu';
import { useNavigate } from 'react-router-dom';
import { 
  Plane, 
  Menu, 
  Search,
  MapPin,
  Calendar,
  Users,
  X,
  Route,
  User as UserIcon
} from 'lucide-react';

interface HeaderProps {
  className?: string;
}

export const Header = ({ className }: HeaderProps) => {
  const { t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      // navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <header className="z-40 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex h-14 md:h-16 items-center justify-between">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate('/home')}
          >
            <div className="bg-gradient-hero p-2 rounded-lg">
              <Plane className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                TravelHub
              </h1>
              <p className="text-[10px] md:text-xs text-muted-foreground">{t('header.tagline')}</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              {/* Explore Menu */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent">
                  <MapPin className="h-4 w-4 mr-2" />
                  {t('nav.explore')}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[280px] sm:w-[320px] p-4 rounded-md bg-popover border shadow-md">
                    <div className="grid gap-3">
                      <NavigationMenuLink 
                        className="flex items-center gap-2 p-3 hover:bg-accent rounded-md cursor-pointer transition-all duration-200 group"
                        href="/route-planner"
                        onClick={(e) => { e.preventDefault(); navigate('/route-planner'); }}
                      >
                        <Route className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
                        <div className="flex flex-col gap-0.5">
                          <p className="font-medium">{t('explore.tools.routePlanner.title')}</p>
                          <p className="text-sm text-muted-foreground">{t('explore.tools.routePlanner.description')}</p>
                        </div>
                      </NavigationMenuLink>
                      <NavigationMenuLink 
                        className="flex items-center gap-2 p-3 hover:bg-accent rounded-md cursor-pointer transition-all duration-200 group"
                        href="/explore"
                        onClick={(e) => { e.preventDefault(); navigate('/explore'); }}
                      >
                        <Search className="h-4 w-4 text-secondary group-hover:scale-110 transition-transform" />
                        <div className="flex flex-col gap-0.5">
                          <p className="font-medium">{t('explore.tools.destinationFinder.title')}</p>
                          <p className="text-sm text-muted-foreground">{t('explore.tools.destinationFinder.description')}</p>
                        </div>
                      </NavigationMenuLink>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Book Menu */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent">
                  <Calendar className="h-4 w-4 mr-2" />
                  {t('nav.book')}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[280px] sm:w-[320px] p-4 rounded-md bg-popover border shadow-md">
                    <div className="grid gap-3">
                      <NavigationMenuLink 
                        className="flex items-center gap-2 p-3 hover:bg-accent rounded-md cursor-pointer transition-all duration-200 group"
                        href="/book"
                        onClick={(e) => { e.preventDefault(); navigate('/book'); }}
                      >
                        <Plane className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
                        <div className="flex flex-col gap-0.5">
                          <p className="font-medium">{t('book.flights')}</p>
                          <p className="text-sm text-muted-foreground">{t('book.searchFlights')}</p>
                        </div>
                      </NavigationMenuLink>
                      <NavigationMenuLink 
                        className="flex items-center gap-2 p-3 hover:bg-accent rounded-md cursor-pointer transition-all duration-200 group"
                        href="/book"
                        onClick={(e) => { e.preventDefault(); navigate('/book'); }}
                      >
                        <Calendar className="h-4 w-4 text-secondary group-hover:scale-110 transition-transform" />
                        <div className="flex flex-col gap-0.5">
                          <p className="font-medium">{t('book.hotels')}</p>
                          <p className="text-sm text-muted-foreground">{t('book.searchHotels')}</p>
                        </div>
                      </NavigationMenuLink>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Community Link */}
              <NavigationMenuItem>
                <NavigationMenuLink 
                  className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-accent rounded-md group"
                  href="/community"
                  onClick={(e) => { e.preventDefault(); navigate('/community'); }}
                >
                  <Users className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  {t('nav.community')}
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="hover:bg-accent"
              aria-label={t('nav.search')}
            >
              <Search className="h-5 w-5" />
            </Button>

            <NotificationCenter />
            <div className="hidden md:flex"><LanguageSelector /></div>
            <ThemeToggle />
            <div className="hidden md:flex"><UserMenu /></div>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Search Overlay */}
        {isSearchOpen && (
          <div className="relative">
            <div className="absolute top-0 left-0 right-0 bg-card border-b border-border p-4 shadow-lg">
              <div className="container mx-auto flex items-center gap-2">
                <Input
                  placeholder={t('nav.search')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleSearchKeyPress}
                  className="flex-1"
                  autoFocus
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleSearch}
                  disabled={!searchQuery.trim()}
                >
                  {t('nav.search')}
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {searchQuery && (
              <div className="container mx-auto relative">
                <SearchResults 
                  query={searchQuery} 
                  onClose={() => { setIsSearchOpen(false); setSearchQuery(''); }} 
                />
              </div>
            )}
          </div>
        )}

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4 space-y-2">
            <div className="px-4 pb-3 border-b border-border"><LanguageSelector /></div>
            <Button variant="ghost" className="w-full justify-start" onClick={() => navigate('/route-planner')}>
              <Route className="h-4 w-4 mr-2" /> {t('nav.routePlanner')}
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => navigate('/explore')}>
              <MapPin className="h-4 w-4 mr-2" /> {t('nav.destinations')}
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => navigate('/book')}>
              <Plane className="h-4 w-4 mr-2" /> {t('book.flights')}
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => navigate('/book')}>
              <Calendar className="h-4 w-4 mr-2" /> {t('book.hotels')}
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => navigate('/community')}>
              <Users className="h-4 w-4 mr-2" /> {t('nav.community')}
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => navigate('/profile')}>
              <UserIcon className="h-4 w-4 mr-2" /> {t('nav.profile')}
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => setIsSearchOpen(!isSearchOpen)}>
              <Search className="h-4 w-4 mr-2" /> {t('nav.search')}
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};
