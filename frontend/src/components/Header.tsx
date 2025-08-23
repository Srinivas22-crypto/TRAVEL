import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSelector } from './LanguageSelector';
import { NotificationCenter } from './NotificationCenter';
import { useNavigate } from 'react-router-dom';
import { 
  Plane, 
  User, 
  Settings, 
  LogOut, 
  Menu, 
  Search,
  MapPin,
  Calendar,
  Users,
  X
} from 'lucide-react';

export const Header = () => {
  const { t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<any>(null); 
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      // navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-hero p-2 rounded-lg">
                <Plane className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                  TravelHub
                </h1>
                <p className="text-xs text-muted-foreground">Your Journey Starts Here</p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent">
                  <MapPin className="h-4 w-4 mr-2" />
                  {t('nav.explore')}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-80 p-4 gap-3">
                    <NavigationMenuLink 
                      className="flex items-center gap-2 p-2 hover:bg-accent rounded-md cursor-pointer"
                      onClick={() => navigate('/explore')}
                    >
                      <MapPin className="h-4 w-4 text-primary" />
                      <div>
                        <p className="font-medium">Route Planner</p>
                        <p className="text-sm text-muted-foreground">Plan your perfect journey</p>
                      </div>
                    </NavigationMenuLink>
                    <NavigationMenuLink 
                      className="flex items-center gap-2 p-2 hover:bg-accent rounded-md cursor-pointer"
                      onClick={() => navigate('/explore')}
                    >
                      <Search className="h-4 w-4 text-secondary" />
                      <div>
                        <p className="font-medium">Destinations</p>
                        <p className="text-sm text-muted-foreground">Discover amazing places</p>
                      </div>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent">
                  <Calendar className="h-4 w-4 mr-2" />
                  {t('nav.book')}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-80 p-4 gap-3">
                    <NavigationMenuLink 
                      className="flex items-center gap-2 p-2 hover:bg-accent rounded-md cursor-pointer"
                      onClick={() => navigate('/book')}
                    >
                      <Plane className="h-4 w-4 text-primary" />
                      <div>
                        <p className="font-medium">{t('book.flights')}</p>
                        <p className="text-sm text-muted-foreground">Find the best deals</p>
                      </div>
                    </NavigationMenuLink>
                    <NavigationMenuLink 
                      className="flex items-center gap-2 p-2 hover:bg-accent rounded-md cursor-pointer"
                      onClick={() => navigate('/book')}
                    >
                      <Calendar className="h-4 w-4 text-secondary" />
                      <div>
                        <p className="font-medium">{t('book.hotels')}</p>
                        <p className="text-sm text-muted-foreground">Book your stay</p>
                      </div>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink 
                  className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-accent rounded-md"
                  onClick={() => navigate('/community')}
                >
                  <Users className="h-4 w-4" />
                  {t('nav.community')}
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Search (Desktop) */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="hidden md:flex"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Notifications */}
            <NotificationCenter />

            {/* Language Selector */}
            <LanguageSelector />

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <User className="h-5 w-5" />
                  {user && (
                    <Badge 
                      variant="success" 
                      className="absolute -top-1 -right-1 h-3 w-3 p-0 rounded-full"
                    />
                  )}
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                {user ? (
                  <>
                    <div className="px-3 py-2">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <Settings className="mr-2 h-4 w-4" />
                      Profile Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-destructive"
                      onClick={() => {
                        setUser(null); // replace with actual logout logic
                        navigate('/signin');
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem onClick={() => navigate('/signin')}>
                      <User className="mr-2 h-4 w-4" />
                      Sign In
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => navigate('/register')} 
                      disabled={!!user}  // 👈 disables Register if user is logged in
                    >
                      <User className="mr-2 h-4 w-4" />
                      Register
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Search Bar Overlay */}
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
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery('');
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Search Results */}
            {searchQuery && (
              <div className="container mx-auto px-4 relative">
                <SearchResults 
                  query={searchQuery} 
                  onClose={() => {
                    setIsSearchOpen(false);
                    setSearchQuery('');
                  }} 
                />
              </div>
            )}
          </div>
        )}

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4">
            <div className="space-y-2">
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => navigate('/explore')}
              >
                <MapPin className="h-4 w-4 mr-2" />
                Route Planner
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => navigate('/book')}
              >
                <Plane className="h-4 w-4 mr-2" />
                Flights
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => navigate('/book')}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Hotels
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => navigate('/community')}
              >
                <Users className="h-4 w-4 mr-2" />
                {t('nav.community')}
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                <Search className="h-4 w-4 mr-2" />
                {t('nav.search')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
