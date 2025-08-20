import { useTranslation } from 'react-i18next';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plane, Hotel, Camera, Mountain, Waves, TreePine, Building, Utensils } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BrowseByCategory = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const categories = [
    {
      id: 1,
      name: "Adventure Travel",
      icon: Mountain,
      description: "Thrilling outdoor experiences and extreme sports",
      deals: "250+ deals",
      image: "/placeholder.svg"
    },
    {
      id: 2,
      name: "Beach & Islands",
      icon: Waves,
      description: "Tropical getaways and coastal destinations",
      deals: "180+ deals",
      image: "/placeholder.svg"
    },
    {
      id: 3,
      name: "City Breaks",
      icon: Building,
      description: "Urban exploration and cultural experiences",
      deals: "320+ deals",
      image: "/placeholder.svg"
    },
    {
      id: 4,
      name: "Nature & Wildlife",
      icon: TreePine,
      description: "National parks and wildlife experiences",
      deals: "140+ deals",
      image: "/placeholder.svg"
    },
    {
      id: 5,
      name: "Food & Wine",
      icon: Utensils,
      description: "Culinary tours and gastronomic adventures",
      deals: "95+ deals",
      image: "/placeholder.svg"
    },
    {
      id: 6,
      name: "Photography Tours",
      icon: Camera,
      description: "Capture stunning landscapes and moments",
      deals: "75+ deals",
      image: "/placeholder.svg"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{t('categories.title')}</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('categories.subtitle')}
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Card key={category.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <IconComponent className="h-8 w-8 text-primary" />
                    <Badge variant="secondary">{category.deals}</Badge>
                  </div>
                  <CardTitle className="text-xl">{category.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6">{category.description}</p>
                  <Button 
                    className="w-full" 
                    onClick={() => navigate('/payment')}
                  >
                    {t('common.explore')}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BrowseByCategory;