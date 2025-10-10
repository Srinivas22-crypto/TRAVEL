import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Plane, 
  MapPin, 
  Users, 
  Calendar,
  Star,
  ArrowRight,
  Globe,
  Camera,
  Heart
} from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const quickActions = [
    {
      icon: <Plane className="h-8 w-8" />,
      title: t('home.Cards.FlightDetails'),
      description: t('home.Cards.FlightDescription'),
      action: () => navigate('/book'),
      color: "bg-blue-50 text-blue-600"
    },
    {
      icon: <MapPin className="h-8 w-8" />,
      title: t('home.Cards.ExploreDetails'), 
      description: t('home.Cards.ExploreDescription'),
      action: () => navigate('/explore'),
      color: "bg-green-50 text-green-600"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: t('home.Cards.CommunityDetails'),
      description: t('home.Cards.CommunityDescription'),
      action: () => navigate('/community'),
      color: "bg-purple-50 text-purple-600"
    }
  ];

  const featuredDestinations = [
    {
      name: t('destinations.paris.name'),
      image: "https://plus.unsplash.com/premium_photo-1661919210043-fd847a58522d?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      rating: 4.9,
      highlights: ["Eiffel Tower", "Louvre Museum", "Notre Dame"]
    },
    {
      name: t('destinations.tokyo.name'),
      image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf",
      rating: 4.8,
      highlights: ["Shibuya Crossing", "Mount Fuji", "Cherry Blossoms"]
    },
    {
      name: t('destinations.newYork.name'),
      image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1", 
      rating: 4.7,
      highlights: ["Rice Terraces", "Temples", "Beaches"]
    }
  ];

  const handleDestinationClick = (destination: any) => {
    // Convert destination name to URL-friendly format
    const destinationName = destination.name.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .trim();
    
    navigate(`/destination/${destinationName}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-50">
        <Header />
      </div>
      
      {/* Hero Section */}
      <main className="pt-16">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent">
            {t('home.title')}
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t('home.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-hero hover:opacity-90 text-lg px-8"
              onClick={() => navigate('/explore')}
            >
              {t('home.cta')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8"
              onClick={() => navigate('/community')}
            >
              {t('nav.community')}
            </Button>
          </div>
        </div>
      </main>

      {/* Quick Actions */}
      <section className="py-16 px-4 bg-muted/30 mt-16">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">{t('home.quickActions')}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {quickActions.map((action, index) => (
              <Card 
                key={index} 
                className="hover:shadow-lg transition-all cursor-pointer group"
                onClick={action.action}
              >
                <CardContent className="p-8 text-center">
                  <div className={`inline-flex p-4 rounded-full ${action.color} mb-4 group-hover:scale-110 transition-transform`}>
                    {action.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{action.title}</h3>
                  <p className="text-muted-foreground">{action.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('home.featured')}</h2>
            <p className="text-muted-foreground text-lg">{t('home.featuredDestinations')}</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {featuredDestinations.map((destination, index) => (
              <Card 
                key={index} 
                className="overflow-hidden hover:shadow-xl transition-all cursor-pointer group"
                onClick={() => handleDestinationClick(destination)}
              >
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={destination.image} 
                    alt={destination.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-semibold">{destination.name}</h3>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-current" />
                      {destination.rating}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {destination.highlights.map((highlight, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {highlight}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/explore')}
            >
              {t('home.ViewDes')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="flex justify-center mb-3">
                <Globe className="h-8 w-8 text-primary" />
              </div>
              <p className="text-3xl font-bold text-primary mb-1">180+</p>
              <p className="text-muted-foreground">{t('home.stats.destinations')}</p>
            </div>
            <div>
              <div className="flex justify-center mb-3">
                <Users className="h-8 w-8 text-secondary" />
              </div>
              <p className="text-3xl font-bold text-secondary mb-1">50K+</p>
              <p className="text-muted-foreground">{t('home.stats.travelers')}</p>
            </div>
            <div>
              <div className="flex justify-center mb-3">
                <Camera className="h-8 w-8 text-accent" />
              </div>
              <p className="text-3xl font-bold text-accent mb-1">120K+</p>
              <p className="text-muted-foreground">{t('home.stats.reviews')}</p>
            </div>
            <div>
              <div className="flex justify-center mb-3">
                <Heart className="h-8 w-8 text-red-500" />
              </div>
              <p className="text-3xl font-bold text-red-500 mb-1">1M+</p>
              <p className="text-muted-foreground">{t('home.stats.memories')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">
            {t('features.ctaTitle')}
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t('home.description')}
          </p>
          <Button 
            size="lg" 
            className="bg-gradient-hero hover:opacity-90 text-lg px-12"
            onClick={() => navigate('/register')}
          >
            {t('home.button')}
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;