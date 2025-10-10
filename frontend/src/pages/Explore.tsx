import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SearchBar from '@/components/SearchBar';
import { useTranslation } from 'react-i18next';
import { Search, Clock, Filter, RefreshCw, Star, MapPin, Users, Plane } from 'lucide-react';
import { DestinationCard } from '@/components/DestinationCard';

const Explore = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('rating');

  const popularDestinations = [
    {
      id: 1,
      name: t('explore.destinationsData.paris.name'),
      image: "https://plus.unsplash.com/premium_photo-1661919210043-fd847a58522d?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      rating: 4.8,
      reviews: 1250,
      description: t('explore.destinationsData.paris.description'),
      category: t('explore.destinationsData.paris.category'),
      price: 1200
    },
    {
      id: 2,
      name: t('explore.destinationsData.tokyo.name'),
      image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf",
      rating: 4.9,
      reviews: 980,
      description: t('explore.destinationsData.tokyo.description'),
      category: t('explore.destinationsData.tokyo.category'),
      price: 1800
    },
    {
      id: 3,
      name: t('explore.destinationsData.newYork.name'),
      image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9",
      rating: 4.7,
      reviews: 2100,
      description: t('explore.destinationsData.newYork.description'),
      category: t('explore.destinationsData.newYork.category'),
      price: 1500
    },
    {
      id: 4,
      name: t('explore.destinationsData.bali.name'),
      image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1",
      rating: 4.6,
      reviews: 840,
      description: t('explore.destinationsData.bali.description'),
      category: t('explore.destinationsData.bali.category'),
      price: 900
    },
    {
      id: 5,
      name: t('explore.destinationsData.swissAlps.name'),
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
      rating: 4.9,
      reviews: 567,
      description: t('explore.destinationsData.swissAlps.description'),
      category: t('explore.destinationsData.swissAlps.category'),
      price: 2200
    },
    {
      id: 6,
      name: t('explore.destinationsData.tuscany.name'),
      image: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9",
      rating: 4.8,
      reviews: 734,
      description: t('explore.destinationsData.tuscany.description'),
      category: t('explore.destinationsData.tuscany.category'),
      price: 1300
    },
    {
      id: 7,
      name: t('explore.destinationsData.costaRica.name'),
      image: "https://images.unsplash.com/photo-1607287322237-e9eeee4849a8?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y29zdGElMjByaWNhJTIwYmVhY2h8ZW58MHx8MHx8fDA%3D",
      rating: 4.7,
      reviews: 423,
      description: t('explore.destinationsData.costaRica.description'),
      category: t('explore.destinationsData.costaRica.category'),
      price: 1100
    },
    {
      id: 8,
      name: t('explore.destinationsData.santorini.name'),
      image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff",
      rating: 4.8,
      reviews: 1156,
      description: t('explore.destinationsData.santorini.description'),
      category: t('explore.destinationsData.santorini.category'),
      price: 1400
    },
    {
      id: 9,
      name: t('explore.destinationsData.goa.name'),
      image: "https://images.unsplash.com/photo-1594801001182-99ee8f8d5db9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDR8fGdvYSUyMGluZGlhfGVufDB8fDB8fHww",
      rating: 4.5,
      reviews: 892,
      description: t('explore.destinationsData.goa.description'),
      category: t('explore.destinationsData.goa.category'),
      price: 600
    },
    {
      id: 10,
      name: t('explore.destinationsData.dubai.name'),
      image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c",
      rating: 4.6,
      reviews: 1340,
      description: t('explore.destinationsData.dubai.description'),
      category: t('explore.destinationsData.dubai.category'),
      price: 1600
    },
    {
      id: 11,
      name: t('explore.destinationsData.iceland.name'),
      image: "https://images.unsplash.com/photo-1657780576805-ea092344358e?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8aWNlbGFuZCUyMHdhdGVyZmFsbHxlbnwwfHwwfHx8MA%3D%3D",
      rating: 4.8,
      reviews: 654,
      description: t('explore.destinationsData.iceland.description'),
      category: t('explore.destinationsData.iceland.category'),
      price: 1900
    },
    {
      id: 12,
      name: t('explore.destinationsData.barcelona.name'),
      image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4",
      rating: 4.7,
      reviews: 1567,
      description: t('explore.destinationsData.barcelona.description'),
      category: t('explore.destinationsData.barcelona.category'),
      price: 1100
    }
  ];

  const categories = [
    { name: t('explore.categories.all'), id: "all", icon: "", count: popularDestinations.length },
    { name: t('explore.categories.adventure'), id: "adventure", icon: "", count: popularDestinations.filter(d => d.category === t('explore.categories.adventure')).length },
    { name: t('explore.categories.beach'), id: "beach", icon: "", count: popularDestinations.filter(d => d.category === t('explore.categories.beach')).length },
    { name: t('explore.categories.culture'), id: "culture", icon: "", count: popularDestinations.filter(d => d.category === t('explore.categories.culture')).length },
    { name: t('explore.categories.food'), id: "food", icon: "", count: popularDestinations.filter(d => d.category === t('explore.categories.food')).length },
    { name: t('explore.categories.nature'), id: "nature", icon: "", count: popularDestinations.filter(d => d.category === t('explore.categories.nature')).length },
    { name: t('explore.categories.city'), id: "city", icon: "", count: popularDestinations.filter(d => d.category === t('explore.categories.city')).length }
  ];

  // Enhanced search function with better matching
  const searchDestinations = useCallback((searchQuery: string) => {
    return popularDestinations.filter(destination => {
      if (!searchQuery.trim()) return true;
      
      const query = searchQuery.toLowerCase().trim();
      const name = destination.name.toLowerCase();
      const description = destination.description.toLowerCase();
      const category = destination.category.toLowerCase();
      
      // Split search query into words for better matching
      const searchWords = query.split(/\s+/);
      
      return searchWords.every(word => 
        name.includes(word) || 
        description.includes(word) || 
        category.includes(word) ||
        // Check for partial matches in city/country names
        name.split(',').some(part => part.trim().includes(word))
      );
    });
  }, [popularDestinations]);

  // Filter and sort destinations with enhanced search
  const filteredDestinations = useMemo(() => {
    // First apply search filter
    let filtered = searchDestinations(searchTerm);
    
    // Then apply category filter
    if (selectedCategory !== 'all') {
      const selectedLabel = t(`explore.categories.${selectedCategory}`);
      filtered = filtered.filter(destination => destination.category === selectedLabel);
    }

    // Sort destinations
    switch (sortBy) {
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'reviews':
        filtered.sort((a, b) => b.reviews - a.reviews);
        break;
      default:
        break;
    }

    return filtered;
  }, [searchTerm, selectedCategory, sortBy, searchDestinations]);

  // Update category counts based on search results
  const updatedCategories = useMemo(() => {
    const searchResults = searchDestinations(searchTerm);
    return categories.map(category => ({
      ...category,
      count: category.id === 'all' 
        ? searchResults.length 
        : searchResults.filter(d => d.category === t(`explore.categories.${category.id}`)).length
    }));
  }, [searchTerm, categories, searchDestinations]);

  const handleSearch = useCallback((searchQuery: string) => {
    setSearchTerm(searchQuery);
  }, []);

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleDestinationClick = (destination: any) => {
    // Convert destination name to URL-friendly format
    const destinationName = destination.name.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .trim();
    
    navigate(`/destination/${destinationName}`);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
  };

  // Get search suggestions based on current input
  const getSearchSuggestions = useCallback((query: string) => {
    if (!query.trim()) return [];
    
    const suggestions = new Set<string>();
    const queryLower = query.toLowerCase();
    
    popularDestinations.forEach(destination => {
      // Add destination names
      if (destination.name.toLowerCase().includes(queryLower)) {
        suggestions.add(destination.name);
      }
      
      // Add city names
      const parts = destination.name.split(',');
      parts.forEach(part => {
        const trimmed = part.trim();
        if (trimmed.toLowerCase().includes(queryLower)) {
          suggestions.add(trimmed);
        }
      });
      
      // Add categories
      if (destination.category.toLowerCase().includes(queryLower)) {
        suggestions.add(destination.category.charAt(0).toUpperCase() + destination.category.slice(1));
      }
    });
    
    return Array.from(suggestions).slice(0, 5);
  }, [popularDestinations]);

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-50">
        <Header />
      </div>
      
      <main className="container mx-auto px-4 py-8 pt-16">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-hero bg-clip-text text-transparent">
            {t('explore.title')}
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t('explore.subtitle')}
          </p>
          
          {/* Enhanced Search Bar */}
          <SearchBar
            onSearch={handleSearch}
            placeholder={t('explore.searchPlaceholderEnhanced')}
            className="max-w-xl mx-auto mb-6"
            initialValue={searchTerm}
          />
          
          {/* Search Results Info */}
          {searchTerm && (
            <div className="max-w-xl mx-auto mb-6">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  {t('explore.searchingFor')} <strong className="text-foreground">"{searchTerm}"</strong>
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  {t('common.clearAll')}
                </Button>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="max-w-2xl mx-auto flex gap-4 justify-center">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder={t('explore.sortBy')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">{t('explore.sortByOptions.rating')}</SelectItem>
                <SelectItem value="price-low">{t('explore.sortByOptions.priceLow')}</SelectItem>
                <SelectItem value="price-high">{t('explore.sortByOptions.priceHigh')}</SelectItem>
                <SelectItem value="reviews">{t('explore.sortByOptions.reviews')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Categories */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">{t('explore.browseByCategory')}</h2>
            {searchTerm && (
              <Badge variant="secondary" className="text-xs">
                {t('explore.filteredBySearch')}
              </Badge>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {updatedCategories.map((category) => (
              <Card 
                key={category.id} 
                className={`hover:shadow-md transition-shadow cursor-pointer ${
                  selectedCategory === category.id ? 'ring-2 ring-primary' : ''
                } ${category.count === 0 ? 'opacity-50' : ''}`}
                onClick={() => handleCategoryClick(category.id)}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2">{category.icon}</div>
                  <h3 className="font-medium mb-1">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('explore.places_one', { count: category.count })}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Popular Destinations */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">
              {selectedCategory === 'all' ? t('explore.allDestinations') : `${t('explore.categories.' + selectedCategory)} ${t('explore.destinations')}`}
            </h2>
            <Badge variant="outline">
              {t('explore.destinationsFound', { count: filteredDestinations.length })}
            </Badge>
          </div>
          
          {filteredDestinations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">{t('explore.noDestinationsFound')}</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
              >
                {t('explore.clearFilters')}
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
              {filteredDestinations.map((destination) => (
                <Card 
                  key={destination.id} 
                  className="overflow-hidden hover:shadow-lg transition-shadow group h-full"
                >
                  <div 
                    className="aspect-video overflow-hidden relative cursor-pointer"
                    onClick={() => handleDestinationClick(destination)}
                  >
                    <img 
                      src={destination.image} 
                      alt={destination.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-3 flex flex-col h-full space-y-3">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{destination.name}</h3>
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-current" />
                        {destination.rating}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {destination.description}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {destination.reviews} {t('explore.reviews')}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span className="capitalize">{destination.category}</span>
                      </span>
                    </div>

                    <div className="mt-auto pt-3 border-t border-border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <span className="text-lg font-bold text-primary">${destination.price}</span>
                          <span className="text-xs text-muted-foreground">{t('explore.perPerson')}</span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="hover:bg-primary hover:text-white transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate('/payment', { 
                              state: { 
                                type: 'flight',
                                destination,
                                amount: destination.price
                              } 
                            });
                          }}
                        >
                          <Plane className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Featured Tools */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">{t('explore.exploreTools')}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  {t('explore.tools.routePlanner.title')}
                </CardTitle>
                <CardDescription>
                  {t('explore.tools.routePlanner.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" onClick={() => navigate('/route-planner')}>{t('explore.tools.routePlanner.cta')}</Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-secondary" />
                  {t('explore.tools.destinationFinder.title')}
                </CardTitle>
                <CardDescription>
                  {t('explore.tools.destinationFinder.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">{t('explore.tools.destinationFinder.cta')}</Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Explore;