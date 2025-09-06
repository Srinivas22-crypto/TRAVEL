import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SearchBar from '@/components/SearchBar';
import { useTranslation } from 'react-i18next';
import { MapPin, Search, Star, Clock, Users, Filter, RefreshCw } from 'lucide-react';

const Explore = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('rating');

  const popularDestinations = [
    {
      id: 1,
      name: "Paris, France",
      image: "https://plus.unsplash.com/premium_photo-1661919210043-fd847a58522d?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      rating: 4.8,
      reviews: 1250,
      description: "The City of Light awaits with its iconic landmarks and romantic atmosphere.",
      category: "culture",
      price: 1200
    },
    {
      id: 2,
      name: "Tokyo, Japan",
      image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf",
      rating: 4.9,
      reviews: 980,
      description: "Experience the perfect blend of traditional culture and modern innovation.",
      category: "city",
      price: 1800
    },
    {
      id: 3,
      name: "New York, USA",
      image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9",
      rating: 4.7,
      reviews: 2100,
      description: "The city that never sleeps offers endless possibilities and experiences.",
      category: "city",
      price: 1500
    },
    {
      id: 4,
      name: "Bali, Indonesia",
      image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1",
      rating: 4.6,
      reviews: 840,
      description: "Tropical paradise with stunning beaches and rich cultural heritage.",
      category: "beach",
      price: 900
    },
    {
      id: 5,
      name: "Swiss Alps, Switzerland",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
      rating: 4.9,
      reviews: 567,
      description: "Breathtaking mountain views and world-class skiing adventures.",
      category: "adventure",
      price: 2200
    },
    {
      id: 6,
      name: "Tuscany, Italy",
      image: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9",
      rating: 4.8,
      reviews: 734,
      description: "Rolling hills, vineyards, and authentic Italian cuisine.",
      category: "food",
      price: 1300
    },
    {
      id: 7,
      name: "Costa Rica",
      image: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23",
      rating: 4.7,
      reviews: 423,
      description: "Rich biodiversity and stunning natural landscapes.",
      category: "nature",
      price: 1100
    },
    {
      id: 8,
      name: "Santorini, Greece",
      image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff",
      rating: 4.8,
      reviews: 1156,
      description: "Iconic white buildings and spectacular sunsets.",
      category: "beach",
      price: 1400
    },
    {
      id: 9,
      name: "Goa, India",
      image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2",
      rating: 4.5,
      reviews: 892,
      description: "Beautiful beaches, Portuguese architecture, and vibrant nightlife in India's coastal paradise.",
      category: "beach",
      price: 600
    },
    {
      id: 10,
      name: "Dubai, UAE",
      image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c",
      rating: 4.6,
      reviews: 1340,
      description: "Luxury shopping, ultramodern architecture, and desert adventures in the Middle East.",
      category: "city",
      price: 1600
    },
    {
      id: 11,
      name: "Iceland",
      image: "https://images.unsplash.com/photo-1539066834862-2e0c2e2c9b8e",
      rating: 4.8,
      reviews: 654,
      description: "Land of fire and ice with stunning waterfalls, geysers, and northern lights.",
      category: "nature",
      price: 1900
    },
    {
      id: 12,
      name: "Barcelona, Spain",
      image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4",
      rating: 4.7,
      reviews: 1567,
      description: "Gaudi's architectural masterpieces, vibrant culture, and Mediterranean beaches.",
      category: "culture",
      price: 1100
    }
  ];

  const categories = [
    { name: "All", id: "all", icon: "🌍", count: popularDestinations.length },
    { name: "Adventure", id: "adventure", icon: "🏔️", count: popularDestinations.filter(d => d.category === 'adventure').length },
    { name: "Beach", id: "beach", icon: "🏖️", count: popularDestinations.filter(d => d.category === 'beach').length },
    { name: "Culture", id: "culture", icon: "🏛️", count: popularDestinations.filter(d => d.category === 'culture').length },
    { name: "Food", id: "food", icon: "🍜", count: popularDestinations.filter(d => d.category === 'food').length },
    { name: "Nature", id: "nature", icon: "🌿", count: popularDestinations.filter(d => d.category === 'nature').length },
    { name: "City", id: "city", icon: "🏙️", count: popularDestinations.filter(d => d.category === 'city').length }
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
      filtered = filtered.filter(destination => destination.category === selectedCategory);
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
        : searchResults.filter(d => d.category === category.id).length
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
      <Header />
      
      <main className="container mx-auto px-4 py-8">
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
            placeholder="Search destinations (e.g., Tokyo, Paris, Beach, Culture...)"
            className="max-w-xl mx-auto mb-6"
            initialValue={searchTerm}
          />
          
          {/* Search Results Info */}
          {searchTerm && (
            <div className="max-w-xl mx-auto mb-6">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  Searching for: <strong className="text-foreground">"{searchTerm}"</strong>
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Clear all
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
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="reviews">Most Reviewed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Categories */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Browse by Category</h2>
            {searchTerm && (
              <Badge variant="secondary" className="text-xs">
                Filtered by search
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
                    {category.count} {category.count === 1 ? 'place' : 'places'}
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
              {selectedCategory === 'all' ? 'All Destinations' : `${categories.find(c => c.id === selectedCategory)?.name} Destinations`}
            </h2>
            <Badge variant="outline">
              {filteredDestinations.length} {filteredDestinations.length === 1 ? 'destination' : 'destinations'} found
            </Badge>
          </div>
          
          {filteredDestinations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No destinations found matching your criteria.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredDestinations.map((destination) => (
                <Card 
                  key={destination.id} 
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleDestinationClick(destination)}
                >
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={destination.image} 
                      alt={destination.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-lg">{destination.name}</h3>
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-current" />
                        {destination.rating}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {destination.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {destination.reviews} reviews
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">${destination.price}</p>
                        <p className="text-xs text-muted-foreground">per person</p>
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
          <h2 className="text-2xl font-semibold mb-6">Explore Tools</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Route Planner
                </CardTitle>
                <CardDescription>
                  Plan your perfect journey with our intelligent route planner
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" onClick={() => navigate('/route-planner')}>Start Planning</Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-secondary" />
                  Destination Finder
                </CardTitle>
                <CardDescription>
                  Discover hidden gems and popular attractions worldwide
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">Explore Now</Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Explore;