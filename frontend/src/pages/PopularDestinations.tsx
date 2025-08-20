import { useTranslation } from 'react-i18next';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PopularDestinations = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const destinations = [
    {
      id: 1,
      name: "Santorini, Greece",
      country: "Greece",
      rating: 4.9,
      reviews: 2847,
      price: 899,
      duration: "7 days",
      image: "/placeholder.svg",
      highlights: ["Sunset Views", "Ancient Architecture", "Wine Tasting"]
    },
    {
      id: 2,
      name: "Kyoto, Japan",
      country: "Japan",
      rating: 4.8,
      reviews: 1923,
      price: 1299,
      duration: "10 days",
      image: "/placeholder.svg",
      highlights: ["Temple Tours", "Cherry Blossoms", "Traditional Culture"]
    },
    {
      id: 3,
      name: "Machu Picchu, Peru",
      country: "Peru",
      rating: 4.9,
      reviews: 3156,
      price: 1599,
      duration: "12 days",
      image: "/placeholder.svg",
      highlights: ["Ancient Ruins", "Hiking", "Mountain Views"]
    },
    {
      id: 4,
      name: "Maldives",
      country: "Maldives",
      rating: 4.7,
      reviews: 1234,
      price: 2299,
      duration: "5 days",
      image: "/placeholder.svg",
      highlights: ["Overwater Bungalows", "Diving", "Pristine Beaches"]
    },
    {
      id: 5,
      name: "Iceland",
      country: "Iceland",
      rating: 4.8,
      reviews: 2567,
      price: 1799,
      duration: "8 days",
      image: "/placeholder.svg",
      highlights: ["Northern Lights", "Geysers", "Blue Lagoon"]
    },
    {
      id: 6,
      name: "Safari Kenya",
      country: "Kenya",
      rating: 4.9,
      reviews: 1876,
      price: 2599,
      duration: "14 days",
      image: "/placeholder.svg",
      highlights: ["Wildlife Safari", "Masai Mara", "Cultural Experience"]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{t('destinations.title')}</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('destinations.subtitle')}
          </p>
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((destination) => (
            <Card key={destination.id} className="hover:shadow-lg transition-shadow overflow-hidden">
              <div className="aspect-video bg-muted relative">
                <img 
                  src={destination.image} 
                  alt={destination.name}
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-4 right-4 bg-background/90 text-foreground">
                  <Star className="h-3 w-3 fill-current mr-1" />
                  {destination.rating}
                </Badge>
              </div>
              
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{destination.name}</CardTitle>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {destination.country}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Star className="h-4 w-4 fill-current" />
                  <span>{destination.rating} ({destination.reviews} reviews)</span>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {destination.duration}
                </div>
                
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {destination.highlights.map((highlight, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {highlight}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-2xl font-bold text-primary">${destination.price}</span>
                    <span className="text-sm text-muted-foreground ml-1">per person</span>
                  </div>
                  <Button onClick={() => navigate('/payment')}>
                    {t('common.bookNow')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PopularDestinations;