import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from 'react-i18next';
import { MapPin, Search, Star, Clock, Users, Filter } from 'lucide-react';

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
      image: "https://media.istockphoto.com/id/2211711751/photo/eiffel-tower-and-streets-of-paris-in-spring-france.jpg?s=2048x2048&w=is&k=20&c=xFioDdyy4PX9Tmbn2nzEtDiOWAJl0V4lwSUfKxMRpS4=",
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

  // Filter and sort destinations
  const filteredDestinations = useMemo(() => {
    let filtered = popularDestinations.filter(destination => {
      const matchesSearch = destination.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           destination.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || destination.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

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
  }, [searchTerm, selectedCategory, sortBy, popularDestinations]);

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleDestinationClick = (destinationId: number) => {
    navigate('/payment', { state: { destinationId } });
  };

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
          
          {/* Search Bar */}
          <div className="max-w-xl mx-auto flex gap-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder={t('explore.searchPlaceholder')}
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button className="bg-gradient-hero hover:opacity-90">
              <Search className="h-4 w-4 mr-2" />
              {t('nav.search')}
            </Button>
          </div>

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
          <h2 className="text-2xl font-semibold mb-6">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Card 
                key={category.id} 
                className={`hover:shadow-md transition-shadow cursor-pointer ${
                  selectedCategory === category.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => handleCategoryClick(category.id)}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2">{category.icon}</div>
                  <h3 className="font-medium mb-1">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.count} places</p>
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
                  onClick={() => handleDestinationClick(destination.id)}
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
                <Button className="w-full">Start Planning</Button>
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